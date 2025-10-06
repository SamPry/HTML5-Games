import type { RNGSeed } from "./types";

export interface RNG {
  next(): number;
  nextInt(max: number): number;
  pick<T>(items: readonly T[]): T;
}

function rotl(x: bigint, k: bigint): bigint {
  return ((x << k) | (x >> (64n - k))) & ((1n << 64n) - 1n);
}

function splitMix64(seed: bigint): () => bigint {
  let state = seed & ((1n << 64n) - 1n);
  return () => {
    state = (state + 0x9e3779b97f4a7c15n) & ((1n << 64n) - 1n);
    let z = state;
    z = (z ^ (z >> 30n)) * 0xbf58476d1ce4e5b9n & ((1n << 64n) - 1n);
    z = (z ^ (z >> 27n)) * 0x94d049bb133111ebn & ((1n << 64n) - 1n);
    return z ^ (z >> 31n);
  };
}

export function createRNG(seed: RNGSeed): RNG {
  const sm = splitMix64(BigInt(seed.s1) << 32n | BigInt(seed.s2));
  let s0 = sm();
  let s1 = sm();

  const nextRaw = () => {
    const result = rotl(s0 + s1, 17n) + s0;
    s1 ^= s0;
    s0 = rotl(s0, 49n) ^ s1 ^ (s1 << 21n);
    s1 = rotl(s1, 28n);
    return Number(result & ((1n << 64n) - 1n));
  };

  return {
    next(): number {
      return (nextRaw() >>> 0) / 0x1_0000_0000;
    },
    nextInt(max: number): number {
      if (max <= 0) {
        throw new Error("max must be positive");
      }
      return Math.floor(this.next() * max);
    },
    pick<T>(items: readonly T[]): T {
      if (!items.length) {
        throw new Error("cannot pick from empty array");
      }
      return items[this.nextInt(items.length)];
    }
  };
}

export function deriveSeed(seed: RNGSeed, salt: number): RNGSeed {
  const rng = createRNG(seed);
  for (let i = 0; i < salt % 5; i += 1) {
    rng.next();
  }
  const s1 = Math.floor(rng.next() * 0xffffffff);
  const s2 = Math.floor(rng.next() * 0xffffffff);
  return { s1, s2 };
}
