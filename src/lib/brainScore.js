// Brain Score — the day's composite (DESIGN.md §3, §5).
// Each puzzle reports roughly 0–1000 (higher = better; FEATURES.md scoring convention),
// so a simple mean keeps puzzles weighted fairly. Pure function — easy to test/evolve later
// (e.g. weight by difficulty, add streak bonuses) without touching the session flow.
//
//   brainScore([{ score }, ...]) → number
export function brainScore(results) {
  if (!results || results.length === 0) return 0;
  const total = results.reduce((sum, r) => sum + (Number(r.score) || 0), 0);
  return Math.round(total / results.length);
}
