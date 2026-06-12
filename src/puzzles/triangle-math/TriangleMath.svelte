<script>
  // ── The puzzle contract ──────────────────────────────────────────────
  // The shell passes these props in. You generally only need `seed`,
  // `reportScore`, and `reportComplete`.
  let { seed, reportScore, reportComplete, timeLeft = null } = $props();

  import { makeRng } from '../../lib/seededRandom.js';

  const rng = makeRng(seed);

  const target = 1 + Math.floor(rng() * 9);
  let guess = $state('');
  let done = $state(false);

  function submit() {
    if (done) return;
    done = true;
    const score = (Number(guess) === target) ? 1000 : 0;
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
  <button class="btn primary" onclick={submit} disabled={done}>Submit</button>
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
