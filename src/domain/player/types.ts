import type { ID } from "@core/types";

export type Foot = "Left" | "Right" | "Both";
export type Position =
  | "GK"
  | "RB"
  | "CB"
  | "LB"
  | "DM"
  | "CM"
  | "AM"
  | "RW"
  | "LW"
  | "ST";

export interface Attributes {
  finishing: number;
  firstTouch: number;
  passing: number;
  crossing: number;
  dribbling: number;
  heading: number;
  tackling: number;
  marking: number;
  longShots: number;
  setPieces: number;
  decisions: number;
  anticipation: number;
  vision: number;
  workRate: number;
  bravery: number;
  composure: number;
  offTheBall: number;
  positioning: number;
  leadership: number;
  flair: number;
  pace: number;
  acceleration: number;
  strength: number;
  stamina: number;
  agility: number;
  jumping: number;
  handling: number;
  reflexes: number;
  aerial: number;
  distribution: number;
}

export interface Player {
  id: ID;
  name: string;
  age: number;
  nationality: string;
  foot: Foot;
  positions: Position[];
  attributes: Attributes;
  currentAbility: number;
  potentialAbility: number;
  morale: number;
  condition: number;
  sharpness: number;
  value: number;
  wage: number;
  contractExpirySeason: number;
  clubId: ID | null;
  form: number[];
  transferListed?: boolean;
}

export interface PlayerMatchStats {
  playerId: ID;
  rating: number;
  minutes: number;
  goals: number;
  assists: number;
  shots: number;
  passesCompleted: number;
  tacklesWon: number;
}
