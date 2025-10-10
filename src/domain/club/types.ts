import type { ID } from "@core/types";
import type { Position } from "@domain/player/types";

export interface TacticsProfile {
  formation: string;
  mentality: "Balanced" | "Positive" | "Cautious";
  tempo: number;
  press: number;
}

export interface Club {
  id: ID;
  name: string;
  shortName: string;
  leagueId: ID;
  roster: ID[];
  colors: string[];
  tactics: TacticsProfile;
  rep: number;
  marketValue: number;
  transferBudget: number;
  wageBudget: number;
  wageCommitment: number;
}

export interface LineupSlot {
  position: Position;
  playerId: ID;
}

export interface League {
  id: ID;
  name: string;
  nation: string;
  clubIds: ID[];
  level: number;
}
