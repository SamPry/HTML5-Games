import { createRNG, deriveSeed, type RNG } from "@core/rng";
import { addDays, nextDay, sameDate, type DateStamp, type ID, type RNGSeed } from "@core/types";
import type { Club } from "@domain/club/types";
import type { Player, Position, Attributes } from "@domain/player/types";
import type { Fixture, Match } from "@domain/match/types";
import type { TransferHistoryEntry, TransferListing } from "@domain/transfer/types";
import { buildSchedule } from "@engine/sim/schedule";
import { simulateMatch } from "@engine/sim/simpleMatch";
import { leaguePacks, createSyntheticSquad } from "@data/leagues";
import type { ClubTemplate, PlayerTemplate } from "@data/premierLeague";
import { nanoid } from "nanoid";

export interface StandingsRow {
  clubId: ID;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
  form: string[];
}

export interface World {
  seed: RNGSeed;
  date: DateStamp;
  leagues: { id: ID; name: string; nation: string; level: number; clubIds: ID[] }[];
  clubs: Club[];
  players: Player[];
  fixtures: Fixture[];
  matches: Match[];
  inbox: string[];
  results: Match[];
  standings: Record<ID, StandingsRow[]>;
  transferListings: TransferListing[];
  transferHistory: TransferHistoryEntry[];
  userClubId: ID | null;
  userLeagueId: ID | null;
}

export interface DailyTickSummary {
  matches: Match[];
  messages: string[];
}

export interface TransferBidPayload {
  playerId: ID;
  buyingClubId: ID;
  offer: number;
}

export interface ManualSimulationPayload {
  fixtureId: ID;
}

export interface CustomClubInput {
  leagueId: ID;
  name: string;
  shortName: string;
  primaryColor: string;
  secondaryColor: string;
  mentality: "Balanced" | "Positive" | "Cautious";
  formation: string;
  profile: "academy" | "challenger" | "elite";
  nationality?: string;
}

export interface CustomClubResult {
  success: boolean;
  clubId?: ID;
  message: string;
}

const START_SEASON = 2024;

export function createInitialWorld(seed: RNGSeed): World {
  const rng = createRNG(seed);
  const date: DateStamp = { season: START_SEASON, week: 0, day: 0 };

  const leagues: World["leagues"] = [];
  const clubs: Club[] = [];
  const players: Player[] = [];
  const fixtures: Fixture[] = [];

  leaguePacks.forEach((leagueTemplate) => {
    const leagueClubIds: ID[] = [];
    const leagueClubs: Club[] = [];

    leagueTemplate.clubs.forEach((clubTemplate) => {
      const club = createClubFromTemplate(clubTemplate, leagueTemplate.id);
      leagueClubIds.push(club.id);

      const squad = createPlayersFromTemplate(clubTemplate, club, date, rng);
      club.roster.push(...squad.map((player) => player.id));
      club.wageCommitment = squad.reduce((total, player) => total + player.wage, 0);

      leagueClubs.push(club);
      clubs.push(club);
      players.push(...squad);
    });

    fixtures.push(...buildSchedule(leagueClubs, leagueTemplate.id, date));

    leagues.push({
      id: leagueTemplate.id,
      name: leagueTemplate.name,
      nation: leagueTemplate.nation,
      level: leagueTemplate.level,
      clubIds: leagueClubIds
    });
  });

  const transferListings = seedTransferMarket(clubs, players, rng);

  const world: World = {
    seed,
    date,
    leagues,
    clubs,
    players,
    fixtures,
    matches: [],
    inbox: ["Welcome to HTML5 Football Manager."],
    results: [],
    standings: {},
    transferListings,
    transferHistory: [],
    userClubId: null,
    userLeagueId: null
  };

  leagues.forEach((league) => {
    world.standings[league.id] = computeStandingsForLeague(world, league.id);
  });

  return world;
}

export function simulateDay(world: World): DailyTickSummary {
  const todaysFixtures = world.fixtures.filter((fixture) => !fixture.played && sameDate(fixture.date, world.date));
  const rngSeed = deriveSeed(world.seed, world.date.week * 10 + world.date.day);
  const matches = todaysFixtures.map((fixture) => simulateMatch(world, fixture, rngSeed));

  matches.forEach((match) => finalizeMatch(world, match));

  world.date = nextDay(world.date);

  if (!todaysFixtures.length) {
    return { matches: [], messages: ["No fixtures scheduled today."] };
  }

  const messages = todaysFixtures.map((fixture) => {
    const match = world.matches.find((m) => m.fixtureId === fixture.id);
    const home = clubName(world, fixture.homeId);
    const away = clubName(world, fixture.awayId);
    const score = match ? `${match.score.home}-${match.score.away}` : "vs";
    return `${home} ${score} ${away}`;
  });

  return { matches, messages };
}

export function simulateFixture(world: World, payload: ManualSimulationPayload): Match | null {
  const fixture = world.fixtures.find((f) => f.id === payload.fixtureId);
  if (!fixture || fixture.played) {
    return null;
  }

  const rngSeed = deriveSeed(world.seed, Number(fixture.id.replace(/\D/g, "")) || 1);
  const match = simulateMatch(world, fixture, rngSeed);
  finalizeMatch(world, match);
  return match;
}

export function makeTransferBid(world: World, payload: TransferBidPayload): string {
  const player = world.players.find((p) => p.id === payload.playerId);
  if (!player || player.clubId === null) {
    return "Selected player is unavailable.";
  }

  const sellingClub = world.clubs.find((club) => club.id === player.clubId);
  const buyingClub = world.clubs.find((club) => club.id === payload.buyingClubId);

  if (!sellingClub || !buyingClub) {
    return "Invalid clubs for transfer bid.";
  }

  if (sellingClub.id === buyingClub.id) {
    return "You already employ this player.";
  }

  if (payload.offer > buyingClub.transferBudget) {
    return "Offer exceeds available transfer budget.";
  }

  const listing = world.transferListings.find((entry) => entry.playerId === player.id);
  const askingPrice = listing?.askingPrice ?? Math.round(player.value * 1.1);

  if (payload.offer < askingPrice * 0.85) {
    listing?.interestedClubIds.push(buyingClub.id);
    return "Bid rejected – the offer is too low.";
  }

  // Complete the transfer
  sellingClub.transferBudget += payload.offer;
  buyingClub.transferBudget -= payload.offer;
  sellingClub.roster = sellingClub.roster.filter((id) => id !== player.id);
  buyingClub.roster.push(player.id);
  player.clubId = buyingClub.id;
  player.transferListed = false;
  buyingClub.wageCommitment += player.wage;
  sellingClub.wageCommitment -= player.wage;

  const historyEntry: TransferHistoryEntry = {
    id: nanoid(),
    playerId: player.id,
    fromClubId: sellingClub.id,
    toClubId: buyingClub.id,
    fee: payload.offer,
    date: { ...world.date }
  };
  world.transferHistory.unshift(historyEntry);

  if (listing) {
    listing.status = "Completed";
  }

  world.inbox.unshift(`${player.name} has signed for ${buyingClub.name} for £${formatMoney(payload.offer)}.`);

  return `${player.name} agrees to join ${buyingClub.name}.`;
}

const customProfiles: Record<CustomClubInput["profile"], { baseAbility: number; tempo: number; press: number }> = {
  academy: { baseAbility: 134, tempo: 59, press: 60 },
  challenger: { baseAbility: 144, tempo: 62, press: 64 },
  elite: { baseAbility: 152, tempo: 64, press: 66 }
};

const nationCodeLookup: Record<string, string> = {
  England: "ENG",
  Spain: "ESP",
  Italy: "ITA",
  Germany: "GER",
  France: "FRA",
  Netherlands: "NED",
  Portugal: "PRT",
  Brazil: "BRA",
  Japan: "JPN",
  USA: "USA"
};

export function createCustomClub(world: World, input: CustomClubInput): CustomClubResult {
  const league = world.leagues.find((entry) => entry.id === input.leagueId);
  if (!league) {
    return { success: false, message: "Selected league does not exist." };
  }

  const trimmedName = input.name.trim();
  if (trimmedName.length < 3) {
    return { success: false, message: "Club name must be at least three characters." };
  }

  const trimmedShort = input.shortName.trim().toUpperCase();
  if (trimmedShort.length < 2 || trimmedShort.length > 5) {
    return { success: false, message: "Short name must be 2-5 characters." };
  }

  if (world.clubs.some((club) => club.name.toLowerCase() === trimmedName.toLowerCase())) {
    return { success: false, message: "A club with that name already exists." };
  }

  if (world.clubs.some((club) => club.shortName.toUpperCase() === trimmedShort)) {
    return { success: false, message: "Short name is already in use." };
  }

  const profile = customProfiles[input.profile] ?? customProfiles.academy;

  const baseId = slugify(trimmedName) || `custom-${world.clubs.length + 1}`;
  let clubId = baseId;
  let suffix = 1;
  while (world.clubs.some((club) => club.id === clubId)) {
    clubId = `${baseId}-${suffix}`;
    suffix += 1;
  }

  const nationality = input.nationality ?? nationCodeLookup[league.nation] ?? "ENG";
  const playersTemplate = createSyntheticSquad(clubId, nationality, profile.baseAbility);
  const estimatedValue = playersTemplate.reduce((total, player) => total + player.value, 0);
  const transferBudget = Math.round(Math.max(20_000_000, estimatedValue * 0.09));
  const wageBudget = Math.round(Math.max(450_000, estimatedValue * 0.0025));
  const rep = Math.round(Math.min(9200, 6900 + Math.log10(estimatedValue / 1_000_000) * 520));

  const clubTemplate: ClubTemplate = {
    id: clubId,
    name: trimmedName,
    shortName: trimmedShort,
    colors: [input.primaryColor, input.secondaryColor],
    formation: input.formation,
    mentality: input.mentality,
    tempo: profile.tempo,
    press: profile.press,
    rep,
    marketValue: estimatedValue,
    transferBudget,
    wageBudget,
    players: playersTemplate
  };

  const club = createClubFromTemplate(clubTemplate, league.id);
  const rngSeed = deriveSeed(world.seed, world.players.length + world.clubs.length + 17);
  const rng = createRNG(rngSeed);
  const players = createPlayersFromTemplate(clubTemplate, club, world.date, rng);

  club.roster.push(...players.map((player) => player.id));
  club.wageCommitment = players.reduce((total, player) => total + player.wage, 0);

  world.clubs.push(club);
  world.players.push(...players);

  const leagueEntry = world.leagues.find((entry) => entry.id === league.id);
  if (leagueEntry) {
    leagueEntry.clubIds = [...leagueEntry.clubIds, club.id];
  }

  world.fixtures = world.fixtures.filter((fixture) => fixture.competitionId !== league.id);
  const leagueClubs = world.clubs.filter((entry) => entry.leagueId === league.id);
  world.fixtures.push(...buildSchedule(leagueClubs, league.id, world.date));
  world.standings[league.id] = computeStandingsForLeague(world, league.id);
  world.inbox.unshift(`${club.name} has been founded and joins ${league.name}.`);

  return {
    success: true,
    clubId: club.id,
    message: `${club.name} is ready for its inaugural season in ${league.name}.`
  };
}

export function upcomingFixtures(world: World, clubId: ID | null): Fixture[] {
  if (!clubId) return [];
  return world.fixtures
    .filter((fixture) => !fixture.played && (fixture.homeId === clubId || fixture.awayId === clubId))
    .sort((a, b) => dateToNumber(a.date) - dateToNumber(b.date))
    .slice(0, 5);
}

function finalizeMatch(world: World, match: Match): void {
  world.matches.push(match);
  world.results.unshift(match);

  const fixture = world.fixtures.find((f) => f.id === match.fixtureId);
  if (fixture) {
    fixture.played = true;
    fixture.matchId = match.id;
    world.standings[fixture.competitionId] = computeStandingsForLeague(world, fixture.competitionId);
  }
}

function createClubFromTemplate(template: ClubTemplate, leagueId: ID): Club {
  const marketValue = template.marketValue ?? estimateMarketValue(template);
  return {
    id: template.id,
    name: template.name,
    shortName: template.shortName,
    leagueId,
    roster: [],
    colors: template.colors,
    tactics: {
      formation: template.formation,
      mentality: template.mentality,
      tempo: template.tempo,
      press: template.press
    },
    rep: template.rep,
    marketValue,
    transferBudget: template.transferBudget,
    wageBudget: template.wageBudget,
    wageCommitment: 0
  };
}

function estimateMarketValue(template: ClubTemplate): number {
  if (template.players.length) {
    return template.players.reduce((total, player) => total + player.value, 0);
  }
  return 120_000_000;
}

function createPlayersFromTemplate(
  template: ClubTemplate,
  club: Club,
  date: DateStamp,
  rng: RNG
): Player[] {
  return template.players.map((playerTemplate) => ({
    id: playerTemplate.id,
    name: playerTemplate.name,
    age: playerTemplate.age,
    nationality: playerTemplate.nationality,
    foot: playerTemplate.foot,
    positions: playerTemplate.positions,
    attributes: generateAttributes(playerTemplate, rng),
    currentAbility: playerTemplate.currentAbility,
    potentialAbility: playerTemplate.potentialAbility,
    morale: 75 + Math.round(rng.next() * 10),
    condition: 88 + Math.round(rng.next() * 10),
    sharpness: 70 + Math.round(rng.next() * 15),
    value: playerTemplate.value,
    wage: playerTemplate.wage,
    contractExpirySeason: date.season + playerTemplate.contractYears,
    clubId: club.id,
    form: [],
    transferListed: playerTemplate.contractYears <= 2 && playerTemplate.age > 30
  }));
}

function generateAttributes(template: PlayerTemplate, rng: RNG): Attributes {
  const base = Math.max(6, Math.min(19, Math.round(template.currentAbility / 10)));
  const jitter = () => clamp(base + Math.round((rng.next() - 0.5) * 4), 3, 20);

  const raw: Record<keyof Attributes, number> = {
    finishing: emphasiseIf(template.positions, ["ST", "AM", "LW", "RW"], jitter, base + 1, rng),
    firstTouch: jitter(),
    passing: emphasiseIf(template.positions, ["CM", "DM", "AM", "RB", "LB"], jitter, base + 1, rng),
    crossing: emphasiseIf(template.positions, ["RB", "LB", "LW", "RW"], jitter, base, rng),
    dribbling: emphasiseIf(template.positions, ["LW", "RW", "AM", "ST"], jitter, base + 1, rng),
    heading: emphasiseIf(template.positions, ["CB", "ST"], jitter, base, rng),
    tackling: emphasiseIf(template.positions, ["CB", "DM", "RB", "LB"], jitter, base + 1, rng),
    marking: emphasiseIf(template.positions, ["CB", "DM"], jitter, base + 1, rng),
    longShots: jitter(),
    setPieces: jitter(),
    decisions: base + Math.round(rng.next() * 2),
    anticipation: jitter(),
    vision: emphasiseIf(template.positions, ["AM", "CM"], jitter, base + 1, rng),
    workRate: base + Math.round(rng.next() * 3),
    bravery: base + Math.round(rng.next() * 3),
    composure: emphasiseIf(template.positions, ["ST", "AM", "CM"], jitter, base + 1, rng),
    offTheBall: emphasiseIf(template.positions, ["ST", "AM", "LW", "RW"], jitter, base + 1, rng),
    positioning: emphasiseIf(template.positions, ["CB", "DM"], jitter, base + 1, rng),
    leadership: base - 1 + Math.round(rng.next() * 3),
    flair: emphasiseIf(template.positions, ["AM", "LW", "RW"], jitter, base + 2, rng),
    pace: emphasiseIf(template.positions, ["LW", "RW", "ST", "RB", "LB"], jitter, base + 1, rng),
    acceleration: emphasiseIf(template.positions, ["LW", "RW", "ST"], jitter, base + 1, rng),
    strength: emphasiseIf(template.positions, ["CB", "ST", "DM"], jitter, base, rng),
    stamina: base + Math.round(rng.next() * 3),
    agility: jitter(),
    jumping: emphasiseIf(template.positions, ["CB", "ST"], jitter, base, rng),
    handling: template.positions.includes("GK") ? base + 2 : 1,
    reflexes: template.positions.includes("GK") ? base + 1 : 1,
    aerial: template.positions.includes("GK") ? base + 1 : jitter(),
    distribution: template.positions.includes("GK") ? base + 1 : jitter()
  };

  const entries = Object.entries(raw) as [keyof Attributes, number][];
  const clamped: Partial<Attributes> = {};
  entries.forEach(([key, value]) => {
    clamped[key] = clamp(value, 1, 20);
  });
  return clamped as Attributes;
}

function emphasiseIf(
  positions: Position[],
  targets: Position[],
  generator: () => number,
  preferred: number,
  rng: RNG
): number {
  if (positions.some((position) => targets.includes(position))) {
    return clamp(preferred + Math.round((rng.next() - 0.4) * 4), 1, 20);
  }
  return generator();
}

function seedTransferMarket(clubs: Club[], players: Player[], rng: RNG): TransferListing[] {
  const listings: TransferListing[] = [];
  players
    .filter((player) => player.transferListed)
    .forEach((player) => {
      listings.push({
        playerId: player.id,
        fromClubId: player.clubId!,
        askingPrice: Math.round(player.value * (1 + rng.next() * 0.1)),
        interestedClubIds: [],
        status: "Available"
      });
    });

  // Ensure there are at least a few attractive options
  if (listings.length < 8) {
    const sorted = [...players]
      .filter((player) => player.clubId !== null)
      .sort((a, b) => b.currentAbility - a.currentAbility);
    for (const player of sorted) {
      if (listings.some((entry) => entry.playerId === player.id)) continue;
      listings.push({
        playerId: player.id,
        fromClubId: player.clubId!,
        askingPrice: Math.round(player.value * 1.15),
        interestedClubIds: [],
        status: "Available"
      });
      if (listings.length >= 8) break;
    }
  }

  return listings;
}

function computeStandingsForLeague(world: World, leagueId: ID): StandingsRow[] {
  const clubs = world.clubs.filter((club) => club.leagueId === leagueId);
  const table = new Map<ID, StandingsRow>();
  const fixtureLookup = new Map(world.fixtures.map((fixture) => [fixture.id, fixture] as const));

  clubs.forEach((club) => {
    table.set(club.id, {
      clubId: club.id,
      played: 0,
      won: 0,
      drawn: 0,
      lost: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      goalDifference: 0,
      points: 0,
      form: []
    });
  });

  world.results
    .slice()
    .reverse()
    .forEach((match) => {
      const fixture = fixtureLookup.get(match.fixtureId);
      if (!fixture || fixture.competitionId !== leagueId) return;

      const fixtureClubs = [match.stats[0].clubId, match.stats[1].clubId];
      fixtureClubs.forEach((clubId, index) => {
        const row = table.get(clubId);
        if (!row) return;

        const opponentId = fixtureClubs[1 - index];
        if (!table.has(opponentId)) return;

        const goalsFor = match.stats[index].goals;
        const goalsAgainst = match.stats[1 - index].goals;

        row.played += 1;
        row.goalsFor += goalsFor;
        row.goalsAgainst += goalsAgainst;
        row.goalDifference = row.goalsFor - row.goalsAgainst;

        if (goalsFor > goalsAgainst) {
          row.won += 1;
          row.points += 3;
          row.form.push("W");
        } else if (goalsFor === goalsAgainst) {
          row.drawn += 1;
          row.points += 1;
          row.form.push("D");
        } else {
          row.lost += 1;
          row.form.push("L");
        }

        if (row.form.length > 5) {
          row.form = row.form.slice(row.form.length - 5);
        }
      });
    });

  return Array.from(table.values()).sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    if (b.goalDifference !== a.goalDifference) return b.goalDifference - a.goalDifference;
    if (b.goalsFor !== a.goalsFor) return b.goalsFor - a.goalsFor;
    return clubs.findIndex((club) => club.id === a.clubId) - clubs.findIndex((club) => club.id === b.clubId);
  });
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
}

export function standingsForLeague(world: World, leagueId: ID | null): StandingsRow[] {
  if (!leagueId) return [];
  return world.standings[leagueId] ?? [];
}

function clubName(world: World, id: ID): string {
  return world.clubs.find((club) => club.id === id)?.shortName ?? "Unknown";
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function dateToNumber(date: DateStamp): number {
  return date.season * 1000 + date.week * 10 + date.day;
}

function formatMoney(value: number): string {
  return new Intl.NumberFormat("en-GB", { notation: "compact", compactDisplay: "short" }).format(value);
}

export function scheduleSummary(world: World, clubId: ID | null) {
  if (!clubId) return [];
  const fixtures = upcomingFixtures(world, clubId);
  return fixtures.map((fixture) => {
    const opponentId = fixture.homeId === clubId ? fixture.awayId : fixture.homeId;
    return {
      id: fixture.id,
      opponent: clubName(world, opponentId),
      home: fixture.homeId === clubId,
      date: fixture.date
    };
  });
}

export function projectDate(date: DateStamp, daysAhead: number): DateStamp {
  let result = { ...date };
  for (let i = 0; i < daysAhead; i += 1) {
    result = nextDay(result);
  }
  return result;
}

export function dateLabel(date: DateStamp): string {
  return `Season ${date.season} • Week ${date.week + 1} • Day ${date.day + 1}`;
}

// re-export helper for other modules
export { addDays };
