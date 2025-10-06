export type ID = string;

export interface DateStamp {
  season: number;
  week: number;
  day: number;
}

export interface RNGSeed {
  s1: number;
  s2: number;
}

export interface Command<T = any> {
  type: string;
  payload: T;
}

export interface Job {
  when: DateStamp;
  run: () => void;
}

export interface Result<T> {
  ok: boolean;
  value?: T;
  error?: string;
}

export function cloneDateStamp(date: DateStamp): DateStamp {
  return { ...date };
}

export function compareDateStamp(a: DateStamp, b: DateStamp): number {
  if (a.season !== b.season) return a.season - b.season;
  if (a.week !== b.week) return a.week - b.week;
  return a.day - b.day;
}

export function nextDay(date: DateStamp): DateStamp {
  const day = date.day + 1;
  if (day < 7) {
    return { ...date, day };
  }
  const week = date.week + 1;
  if (week < 52) {
    return { season: date.season, week, day: 0 };
  }
  return { season: date.season + 1, week: 0, day: 0 };
}
