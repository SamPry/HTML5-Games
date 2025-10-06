import { createInitialWorld, simulateDay, type DailyTickSummary, type World } from "@app/world";
import type { RNGSeed } from "@core/types";

type Listener = () => void;

type WorldCommand =
  | { type: "ADVANCE_DAY" }
  | { type: "ADVANCE_DAYS"; payload: { days?: number } };

export class GameStore {
  private state: World;
  private listeners: Set<Listener> = new Set();

  constructor(seed: RNGSeed) {
    this.state = createInitialWorld(seed);
  }

  get snapshot(): World {
    return this.state;
  }

  subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  dispatch(command: WorldCommand): DailyTickSummary | null {
    switch (command.type) {
      case "ADVANCE_DAY": {
        const summary = simulateDay(this.state);
        this.notify();
        return summary;
      }
      case "ADVANCE_DAYS": {
        const days = command.payload?.days ?? 7;
        let lastSummary: DailyTickSummary | null = null;
        for (let i = 0; i < days; i += 1) {
          lastSummary = simulateDay(this.state);
        }
        this.notify();
        return lastSummary;
      }
      default:
        return null;
    }
  }

  private notify(): void {
    this.listeners.forEach((listener) => listener());
  }
}

export function randomSeed(): RNGSeed {
  const now = Date.now();
  return { s1: now & 0xffffffff, s2: (now >> 32) & 0xffffffff };
}
