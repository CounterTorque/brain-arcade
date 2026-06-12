<script>
  // ── The puzzle contract ──────────────────────────────────────────────
  // The shell passes these props in. You generally only need `seed`,
  // `reportScore`, and `reportComplete`.
  export let seed;             // number — deterministic seed for TODAY. Use it for all challenge randomness.
  export let reportScore;      // (value:number) => void — higher is better, aim for ~0–1000
  export let reportComplete;   // () => void — call once when the player is finished
  export let timeLeft = null;  // optional Svelte readable store with the shared countdown

  import { makeRng } from '../../lib/seededRandom.js';

  // Deterministic randomness: same seed → same puzzle for everyone today.
  // NEVER use bare Math.random() for anything that defines the day's challenge.
  const rng = makeRng(seed);

  // ── Example state — replace with your own puzzle ─────────────────────
  // This stub picks a target number and asks the player to type it back.
  const target = 1 + Math.floor(rng() * 9);   // 1–9, seeded
  let guess = '';
  let done = false;

  function submit() {
    if (done) return;
    done = true;
    const score = (Number(guess) === target) ? 1000 : 0;  // your scoring formula goes here
    reportScore(score);
    reportComplete();
  }
</script>

<!-- ── Your puzzle UI — replace everything below ──────────────────────── -->
<div class="puzzle">
  <h2>Template Puzzle</h2>
  <p>Type the number <strong>{target}</strong> and submit. (Replace this with your real puzzle.)</p>

  {#if timeLeft}
    <p class="timer">Time left: {$timeLeft}s</p>
  {/if}

  <input type="number" bind:value={guess} disabled={done} />
  <button on:click={submit} disabled={done}>Submit</button>
</div>

<style>
  /* Keep styles scoped to your component. */
  .puzzle { text-align: center; padding: 1.5rem; }
  .timer { color: #888; font-variant-numeric: tabular-nums; }
  input { font-size: 1.25rem; padding: 0.4rem; width: 6rem; text-align: center; }
  button { font-size: 1rem; padding: 0.5rem 1rem; margin-left: 0.5rem; cursor: pointer; }
</style>
