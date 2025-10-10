import type { ID } from "@core/types";
import type { DateStamp } from "@core/types";
import type { PlayerMatchStats } from "@domain/player/types";

export interface Fixture {
  id: ID;
  competitionId: ID;
  homeId: ID;
  awayId: ID;
  date: DateStamp;
  played: boolean;
  matchId?: ID;
}

export interface MatchEvent {
  minute: number;
  type: "Kickoff" | "Goal" | "Shot" | "Foul" | "HalfTime" | "FullTime";
  description: string;
  teamId?: ID;
  playerId?: ID;
}

export interface MatchTeamStats {
  clubId: ID;
  goals: number;
  shots: number;
  shotsOnTarget: number;
  possession: number;
}

export interface Match {
  id: ID;
  fixtureId: ID;
  events: MatchEvent[];
  stats: MatchTeamStats[];
  playerStats: PlayerMatchStats[];
  state: "Scheduled" | "Live" | "Complete";
  score: { home: number; away: number };
}
