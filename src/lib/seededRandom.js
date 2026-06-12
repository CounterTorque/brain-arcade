// Deterministic pseudo-random number generator.
// Same seed → same sequence, so every teammate gets the identical daily puzzle.
//
//   import { makeRng, dateSeed } from '../../lib/seededRandom.js';
//   const rng = makeRng(seed);   // rng() → float in [0, 1), like Math.random() but reproducible
//
// Uses mulberry32 — small, fast, good enough for game randomness.

export function makeRng(seed) {
  let a = seed >>> 0;            // coerce to unsigned 32-bit
  return function rng() {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Turn a date into a stable integer seed, e.g. 2026-06-12 → 20260612.
// The shell uses this to derive both today's puzzle set and each puzzle's seed.
export function dateSeed(date = new Date()) {
  const y = date.getFullYear();
  const m = date.getMonth() + 1;
  const d = date.getDate();
  return y * 10000 + m * 100 + d;
}
