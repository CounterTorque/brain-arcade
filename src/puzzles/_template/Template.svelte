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

<!-- ── Your puzzle UI — replace everything below ────────────────────────
     The shared theme (src/styles/theme.css) is loaded globally by the shell:
     use its tokens (var(--blue), var(--radius-pill), …) and classes
     (.surface, .btn, .well, .pop-in, .celebrate, .shake). See STYLE_GUIDE.md. -->
<div class="puzzle surface pop-in">
  <h2>Template Puzzle</h2>
  <p>Type the number <strong class="prompt">{target}</strong> and submit. (Replace this with your real puzzle.)</p>

  {#if timeLeft}
    <p class="timer numeric">Time left: {$timeLeft}s</p>
  {/if}

  <input class="well" type="number" bind:value={guess} disabled={done} />
  <button class="btn primary" on:click={submit} disabled={done}>Submit</button>
</div>

<style>
  /* Keep styles scoped to your component, written with the shared tokens —
     no hard-coded colors, fonts, or shadows. */
  .puzzle { text-align: center; max-width: 28rem; margin: 0 auto; }
  .prompt { color: var(--blue); font-size: var(--text-xl); }
  .timer { color: var(--ink-soft); }
  input { font-size: var(--text-lg); width: 6rem; }
  button { margin-left: var(--space-1); }
</style>
