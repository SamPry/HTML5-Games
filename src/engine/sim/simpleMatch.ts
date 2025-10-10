import { createRNG, deriveSeed } from "@core/rng";
import type { RNGSeed } from "@core/types";
import type { Fixture, Match, MatchEvent, MatchTeamStats } from "@domain/match/types";
import type { Player, PlayerMatchStats } from "@domain/player/types";
import type { World } from "@app/world";

export interface MatchInput {
  fixture: Fixture;
  homePlayers: Player[];
  awayPlayers: Player[];
}

export function simulateMatch(world: World, fixture: Fixture, seed: RNGSeed): Match {
  const derived = deriveSeed(seed, Number(fixture.id.replace(/\D/g, "")) || 0);
  const rng = createRNG(derived);
  const homePlayers = pickStartingXI(world, fixture.homeId);
  const awayPlayers = pickStartingXI(world, fixture.awayId);

  const input: MatchInput = { fixture, homePlayers, awayPlayers };
  const { homeScore, awayScore, events, homeStats, awayStats, playerStats } = runSimulation(
    input,
    rng
  );

  return {
    id: `match-${fixture.id}`,
    fixtureId: fixture.id,
    events,
    stats: [homeStats, awayStats],
    playerStats,
    state: "Complete",
    score: { home: homeScore, away: awayScore }
  };
}

function runSimulation(input: MatchInput, rng: ReturnType<typeof createRNG>) {
  const totalMinutes = 90;
  const events: MatchEvent[] = [{ minute: 0, type: "Kickoff", description: "Kick-off" }];

  let homePossession = 50;
  let awayPossession = 50;
  const homeStrength = squadStrength(input.homePlayers);
  const awayStrength = squadStrength(input.awayPlayers);
  const strengthTotal = homeStrength + awayStrength;

  const homeShotRate = 8 + Math.round((homeStrength / strengthTotal) * 6);
  const awayShotRate = 8 + Math.round((awayStrength / strengthTotal) * 6);

  let homeGoals = 0;
  let awayGoals = 0;

  for (let minute = 5; minute <= totalMinutes; minute += 5) {
    const possessionSwing = rng.next() * 10 - 5;
    homePossession = clamp(homePossession + possessionSwing, 35, 65);
    awayPossession = 100 - homePossession;

    if (rng.next() < homeShotRate / 100) {
      const shooter = rng.pick(input.homePlayers);
      const shotQuality = shootingQuality(shooter);
      const chance = 0.04 + shotQuality * 0.06 + homeStrength / (strengthTotal * 2);
      events.push({
        minute,
        type: "Shot",
        description: `${shooter.name} tries his luck from distance for the home side` ,
        teamId: input.fixture.homeId,
        playerId: shooter.id
      });
      if (rng.next() < chance) {
        homeGoals += 1;
        events.push({
          minute,
          type: "Goal",
          description: `${shooter.name} scores for the hosts!`,
          teamId: input.fixture.homeId,
          playerId: shooter.id
        });
      }
    }

    if (rng.next() < awayShotRate / 100) {
      const shooter = rng.pick(input.awayPlayers);
      const shotQuality = shootingQuality(shooter);
      const chance = 0.04 + shotQuality * 0.06 + awayStrength / (strengthTotal * 2);
      events.push({
        minute,
        type: "Shot",
        description: `${shooter.name} lines up a chance for the visitors`,
        teamId: input.fixture.awayId,
        playerId: shooter.id
      });
      if (rng.next() < chance) {
        awayGoals += 1;
        events.push({
          minute,
          type: "Goal",
          description: `${shooter.name} finds the net for the visitors!`,
          teamId: input.fixture.awayId,
          playerId: shooter.id
        });
      }
    }

    if (minute === 45) {
      events.push({ minute, type: "HalfTime", description: "Half-time whistle" });
    }
  }

  events.push({ minute: 90, type: "FullTime", description: "Full-time" });

  const homeStats: MatchTeamStats = {
    clubId: input.fixture.homeId,
    goals: homeGoals,
    shots: Math.round(homeShotRate * 1.2),
    shotsOnTarget: Math.round(homeShotRate * 0.6),
    possession: Math.round(homePossession)
  };

  const awayStats: MatchTeamStats = {
    clubId: input.fixture.awayId,
    goals: awayGoals,
    shots: Math.round(awayShotRate * 1.2),
    shotsOnTarget: Math.round(awayShotRate * 0.6),
    possession: Math.round(awayPossession)
  };

  const playerStats: PlayerMatchStats[] = [...input.homePlayers, ...input.awayPlayers].map((player) => {
    const abilityBoost = (player.currentAbility - 140) / 80;
    const rating = clamp(6.2 + rng.next() * 1.6 + abilityBoost, 5.0, 10);
    return {
      playerId: player.id,
      rating,
      minutes: 90,
      goals: events.filter((event) => event.type === "Goal" && event.playerId === player.id).length,
      assists: 0,
      shots: Math.round(rng.next() * 3),
      passesCompleted: Math.round(rng.next() * 40),
      tacklesWon: Math.round(rng.next() * 5)
    };
  });

  return {
    homeScore: homeGoals,
    awayScore: awayGoals,
    events,
    homeStats,
    awayStats,
    playerStats
  };
}

function squadStrength(players: Player[]): number {
  return players.reduce((acc, p) => acc + p.currentAbility, 0);
}

function shootingQuality(player: Player): number {
  const { finishing, composure, offTheBall } = player.attributes;
  return (finishing + composure + offTheBall) / 60;
}

function pickStartingXI(world: World, clubId: string): Player[] {
  const club = world.clubs.find((c) => c.id === clubId);
  if (!club) {
    throw new Error(`Club not found: ${clubId}`);
  }
  return club.roster
    .map((playerId) => world.players.find((p) => p.id === playerId)!)
    .sort((a, b) => b.currentAbility - a.currentAbility)
    .slice(0, 11);
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}
