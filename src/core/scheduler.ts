import { compareDateStamp, nextDay } from "./types";
import type { DateStamp, Job } from "./types";

export class Scheduler {
  private queue: Job[] = [];

  enqueue(when: DateStamp, job: () => void): void {
    this.queue.push({ when: { ...when }, run: job });
    this.queue.sort((a, b) => compareDateStamp(a.when, b.when));
  }

  runDay(date: DateStamp): void {
    while (this.queue.length && compareDateStamp(this.queue[0].when, date) <= 0) {
      const job = this.queue.shift();
      job?.run();
    }
  }

  advance(date: DateStamp, days: number, handler: (current: DateStamp) => void): DateStamp {
    let cursor = { ...date };
    for (let i = 0; i < days; i += 1) {
      handler(cursor);
      this.runDay(cursor);
      cursor = nextDay(cursor);
    }
    return cursor;
  }
}
