// Daily scheduler — turns today's date into a deterministic puzzle set.
// Same date → same puzzles, in the same order, for every teammate (no backend needed).
// See DESIGN.md §5.
import { makeRng, dateSeed } from './seededRandom.js';

// How many puzzles make up a daily session (DESIGN.md §2 default: ~3, under 5 minutes).
export const SESSION_SIZE = 3;

// Seeded Fisher–Yates shuffle on a COPY of the input (never mutates the registry array).
function shuffle(items, rng) {
  const out = items.slice();
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

// Pick today's puzzle set from the registry.
//
//   getDailySet(puzzles) → { date, seed, puzzles: [{ manifest, seed }, ...] }
//
// - `seed` (top level): the day's seed, e.g. 20260612.
// - each chosen puzzle gets its OWN seed derived from the day seed + its position, so both
//   *which* puzzles run and *what instance* each generates are stable across reloads/teammates.
// - clamps to min(size, available); an empty registry yields an empty set (no throw) so the
//   shell can show a graceful "no puzzles yet" state.
export function getDailySet(puzzles, date = new Date(), size = SESSION_SIZE) {
  const seed = dateSeed(date);
  const rng = makeRng(seed);
  const chosen = shuffle(puzzles ?? [], rng).slice(0, Math.min(size, puzzles?.length ?? 0));

  return {
    date,
    seed,
    puzzles: chosen.map((manifest, index) => ({
      manifest,
      // Distinct, deterministic per-puzzle seed. `| 0` keeps it a 32-bit int for makeRng.
      seed: (seed + index * 0x9e3779b1) | 0,
    })),
  };
}
