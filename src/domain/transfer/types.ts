import type { DateStamp, ID } from "@core/types";

export interface TransferListing {
  playerId: ID;
  fromClubId: ID;
  askingPrice: number;
  interestedClubIds: ID[];
  status: "Available" | "Negotiating" | "Completed";
}

export interface TransferHistoryEntry {
  id: ID;
  playerId: ID;
  fromClubId: ID;
  toClubId: ID;
  fee: number;
  date: DateStamp;
}
