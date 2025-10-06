import { createRNG, deriveSeed, type RNG } from "@core/rng";
import { nextDay } from "@core/types";
import type { DateStamp, ID, RNGSeed } from "@core/types";
import type { Club, League } from "@domain/club/types";
import type { Player, Position } from "@domain/player/types";
import type { Fixture, Match } from "@domain/match/types";
import { buildSchedule } from "@engine/sim/schedule";
import { simulateMatch } from "@engine/sim/simpleMatch";

export interface World {
  seed: RNGSeed;
  date: DateStamp;
  leagues: League[];
  clubs: Club[];
  players: Player[];
  fixtures: Fixture[];
  matches: Match[];
  inbox: string[];
  results: Match[];
  userClubId: ID;
}

export interface DailyTickSummary {
  matches: Match[];
  messages: string[];
}

export function createInitialWorld(seed: RNGSeed): World {
  const rng = createRNG(seed);
  const league: League = {
    id: "league-1",
    name: "Founders League",
    nation: "Neutral",
    clubIds: [],
    level: 1
  };

  const clubs: Club[] = Array.from({ length: 10 }, (_, idx) => {
    const id = `club-${idx + 1}`;
    league.clubIds.push(id);
    return {
      id,
      name: `FC ${cityNames[idx % cityNames.length]}`,
      shortName: `FC${idx + 1}`,
      leagueId: league.id,
      roster: [],
      colors: [accentPalette[idx % accentPalette.length]],
      tactics: {
        formation: formations[idx % formations.length],
        mentality: rng.pick(["Balanced", "Positive", "Cautious"]),
        tempo: 50 + rng.nextInt(50),
        press: 50 + rng.nextInt(50)
      },
      rep: 3000 + rng.nextInt(2000)
    };
  });

  const players: Player[] = [];
  clubs.forEach((club) => {
    const rosterSize = 18;
    for (let i = 0; i < rosterSize; i += 1) {
      const id = `${club.id}-player-${i}`;
      const position = defaultFormationOrder[i % defaultFormationOrder.length];
      const currentAbility = 40 + Math.floor(rng.next() * 40);
      const player: Player = {
        id,
        name: `${rng.pick(firstNames)} ${rng.pick(lastNames)}`,
        age: 18 + Math.floor(rng.next() * 15),
        nationality: rng.pick(["ENG", "ESP", "GER", "BRA", "ARG", "FRA", "NED"]),
        foot: rng.pick(["Left", "Right", "Both"]),
        positions: [position],
        attributes: generateAttributes(rng, position, currentAbility),
        currentAbility,
        potentialAbility: currentAbility + 20 + Math.floor(rng.next() * 60),
        morale: 60 + Math.floor(rng.next() * 40),
        condition: 70 + Math.floor(rng.next() * 30),
        sharpness: 40 + Math.floor(rng.next() * 60),
        value: currentAbility * 25000,
        clubId: club.id,
        form: []
      };
      players.push(player);
      club.roster.push(player.id);
    }
  });

  const fixtures = buildSchedule(clubs, league.id, { season: 2025, week: 0, day: 0 });

  return {
    seed,
    date: { season: 2025, week: 0, day: 0 },
    leagues: [league],
    clubs,
    players,
    fixtures,
    matches: [],
    inbox: ["Welcome to HTML5 Football Manager!"],
    results: [],
    userClubId: clubs[0].id
  };
}

export function simulateDay(world: World): DailyTickSummary {
  const todaysFixtures = world.fixtures.filter(
    (fixture) => !fixture.played && sameDate(fixture.date, world.date)
  );

  const rngSeed = deriveSeed(world.seed, world.date.week * 10 + world.date.day);
  const matches: Match[] = todaysFixtures.map((fixture) => simulateMatch(world, fixture, rngSeed));

  matches.forEach((match) => {
    world.matches.push(match);
    world.results.unshift(match);
    const fixture = world.fixtures.find((f) => f.id === match.fixtureId);
    if (fixture) {
      fixture.played = true;
      fixture.matchId = match.id;
    }
  });

  const messages = todaysFixtures.length
    ? todaysFixtures.map((f) =>
        `${clubName(world, f.homeId)} ${scoreLine(world, f.matchId)} ${clubName(world, f.awayId)}`
      )
    : ["No matches today."];

  world.date = nextDay(world.date);

  return { matches, messages };
}

function sameDate(a: DateStamp, b: DateStamp): boolean {
  return a.season === b.season && a.week === b.week && a.day === b.day;
}

function clubName(world: World, id: ID): string {
  return world.clubs.find((c) => c.id === id)?.shortName ?? "Unknown";
}

function scoreLine(world: World, matchId?: ID): string {
  if (!matchId) return "vs";
  const match = world.matches.find((m) => m.id === matchId);
  if (!match) return "vs";
  return `${match.score.home}-${match.score.away}`;
}

function generateAttributes(rng: RNG, position: string, ability: number) {
  const base = ability / 5;
  const randomAttribute = () => Math.max(1, Math.min(20, Math.round(base + rng.next() * 4)));
  return {
    finishing: randomAttribute(),
    firstTouch: randomAttribute(),
    passing: randomAttribute(),
    crossing: randomAttribute(),
    dribbling: randomAttribute(),
    heading: randomAttribute(),
    tackling: randomAttribute(),
    marking: randomAttribute(),
    longShots: randomAttribute(),
    setPieces: randomAttribute(),
    decisions: randomAttribute(),
    anticipation: randomAttribute(),
    vision: randomAttribute(),
    workRate: randomAttribute(),
    bravery: randomAttribute(),
    composure: randomAttribute(),
    offTheBall: randomAttribute(),
    positioning: randomAttribute(),
    leadership: randomAttribute(),
    flair: randomAttribute(),
    pace: randomAttribute(),
    acceleration: randomAttribute(),
    strength: randomAttribute(),
    stamina: randomAttribute(),
    agility: randomAttribute(),
    jumping: randomAttribute(),
    handling: position === "GK" ? randomAttribute() : 1,
    reflexes: position === "GK" ? randomAttribute() : 1,
    aerial: position === "GK" ? randomAttribute() : randomAttribute(),
    distribution: position === "GK" ? randomAttribute() : randomAttribute()
  };
}

const cityNames = [
  "Avalon",
  "Rivermouth",
  "Highfield",
  "Kingsport",
  "Northhaven",
  "Silverbrook",
  "Westminster",
  "Greenwich",
  "Brighton",
  "Southport"
];

const firstNames = [
  "Alex",
  "Luis",
  "Noah",
  "Leo",
  "Mateo",
  "Mason",
  "Ethan",
  "Kai",
  "Luca",
  "Owen"
];

const lastNames = [
  "Santos",
  "Garcia",
  "Fischer",
  "Johnson",
  "Silva",
  "Martinez",
  "Okafor",
  "Nguyen",
  "Ito",
  "Kouadio"
];

const accentPalette = ["#3ecf8e", "#60a5fa", "#f97316", "#a855f7", "#facc15"];

const formations = ["4-4-2", "4-3-3", "3-5-2"];

const defaultFormationOrder: Position[] = [
  "GK",
  "RB",
  "CB",
  "CB",
  "LB",
  "CM",
  "CM",
  "AM",
  "RW",
  "LW",
  "ST",
  "ST",
  "DM",
  "CB",
  "CM",
  "LW",
  "RW",
  "ST"
];
