import { immer } from "zustand/middleware/immer";
import { createStore, type StoreApi } from "zustand/vanilla";

import {
  createInitialWorld,
  dateLabel,
  makeTransferBid,
  simulateDay,
  simulateFixture,
  type DailyTickSummary,
  type ManualSimulationPayload,
  type TransferBidPayload,
  type World
} from "@app/world";
import type { ID, RNGSeed } from "@core/types";

export type WorldCommand =
  | { type: "ADVANCE_DAY" }
  | { type: "ADVANCE_DAYS"; payload: { days?: number } }
  | { type: "SIMULATE_FIXTURE"; payload: ManualSimulationPayload }
  | { type: "MAKE_TRANSFER_BID"; payload: TransferBidPayload }
  | { type: "SET_USER_CLUB"; payload: { clubId: ID } };

interface GameState {
  world: World;
  lastSummary: DailyTickSummary | null;
  advanceDay: () => DailyTickSummary;
  advanceDays: (days: number) => DailyTickSummary;
  runFixture: (payload: ManualSimulationPayload) => MatchResult;
  placeBid: (payload: TransferBidPayload) => string;
  setUserClub: (clubId: ID) => void;
}

interface MatchResult {
  matchId: string | null;
  message: string;
}

function createGameState(seed: RNGSeed): StoreApi<GameState> {
  const world = createInitialWorld(seed);
  return createStore(
    immer<GameState>((set, get) => ({
      world,
      lastSummary: null,
      advanceDay: () => {
        const summary = simulateDay(get().world);
        set((state) => {
          state.lastSummary = summary;
        });
        return summary;
      },
      advanceDays: (days: number) => {
        let summary: DailyTickSummary = { matches: [], messages: [] };
        for (let i = 0; i < days; i += 1) {
          summary = simulateDay(get().world);
        }
        set((state) => {
          state.lastSummary = summary;
        });
        return summary;
      },
      runFixture: (payload: ManualSimulationPayload) => {
        const match = simulateFixture(get().world, payload);
        if (!match) {
          return { matchId: null, message: "Fixture could not be simulated." };
        }
        set((state) => {
          state.lastSummary = {
            matches: [match],
            messages: [
              `${dateLabel(state.world.date)}: ${match.score.home}-${match.score.away}`
            ]
          };
        });
        return { matchId: match.id, message: "Match simulated successfully." };
      },
      placeBid: (payload: TransferBidPayload) => {
        const message = makeTransferBid(get().world, payload);
        set((state) => {
          state.lastSummary = {
            matches: [],
            messages: [message]
          };
        });
        return message;
      },
      setUserClub: (clubId: ID) => {
        set((state) => {
          state.world.userClubId = clubId;
          const club = state.world.clubs.find((entry) => entry.id === clubId);
          state.world.userLeagueId = club?.leagueId ?? null;
        });
      }
    }))
  );
}

type Listener = () => void;

export class GameStore {
  private store: StoreApi<GameState>;
  private listeners: Set<Listener> = new Set();

  constructor(seed: RNGSeed) {
    this.store = createGameState(seed);
  }

  get snapshot(): World {
    return this.store.getState().world;
  }

  dispatch(command: WorldCommand): DailyTickSummary | MatchResult | string | null {
    const state = this.store.getState();
    switch (command.type) {
      case "ADVANCE_DAY": {
        const summary = state.advanceDay();
        this.notify();
        return summary;
      }
      case "ADVANCE_DAYS": {
        const days = command.payload?.days ?? 7;
        const summary = state.advanceDays(days);
        this.notify();
        return summary;
      }
      case "SIMULATE_FIXTURE": {
        const result = state.runFixture(command.payload);
        this.notify();
        return result;
      }
      case "MAKE_TRANSFER_BID": {
        const message = state.placeBid(command.payload);
        this.notify();
        return message;
      }
      case "SET_USER_CLUB": {
        state.setUserClub(command.payload.clubId);
        this.notify();
        return null;
      }
      default:
        return null;
    }
  }

  subscribe(listener: Listener): () => void {
    const unsubscribe = this.store.subscribe(() => {
      listener();
    });
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
      unsubscribe();
    };
  }

  private notify(): void {
    this.listeners.forEach((listener) => listener());
  }
}

export function randomSeed(): RNGSeed {
  const now = Date.now();
  return { s1: now & 0xffffffff, s2: (now >> 32) & 0xffffffff };
}
