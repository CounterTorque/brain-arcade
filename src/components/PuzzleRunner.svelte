<script>
  // Runs ONE puzzle: lazily mounts it, owns the countdown, and collects its score.
  // The puzzle stays "dumb" about timing/navigation (DESIGN.md §4.2) — it just plays and reports.
  import { createEventDispatcher, onDestroy } from 'svelte';
  import { writable } from 'svelte/store';

  export let manifest;   // one registry entry: { id, name, estSeconds, component, ... }
  export let seed;       // this puzzle's deterministic seed for today (from the scheduler)

  const dispatch = createEventDispatcher();

  const estSeconds = manifest.estSeconds ?? 60;
  // Shared countdown store the puzzle may display; the shell enforces the limit regardless.
  const timeLeft = writable(estSeconds);

  let latestScore = 0;
  let finished = false;
  let intervalId = null;

  // Lazy-load the puzzle component (keeps each puzzle out of the initial bundle),
  // and start the clock once it's ready — never before the puzzle can play.
  const componentPromise = manifest.component().then((m) => {
    startTimer();
    return m.default;
  });

  // ── The contract callbacks handed to the puzzle ──────────────────────
  function reportScore(value) {
    latestScore = Number(value) || 0;
  }

  function reportComplete() {
    finish();
  }

  // Idempotent: both the puzzle's own reportComplete and the timer expiry route here,
  // but the session only ever advances once.
  function finish() {
    if (finished) return;
    finished = true;
    stopTimer();
    dispatch('complete', { puzzleId: manifest.id, score: latestScore });
  }

  function startTimer() {
    if (intervalId !== null) return;
    intervalId = setInterval(() => {
      timeLeft.update((t) => {
        const next = t - 1;
        if (next <= 0) {
          finish(); // enforce the time limit even if the puzzle never completes
          return 0;
        }
        return next;
      });
    }, 1000);
  }

  function stopTimer() {
    if (intervalId !== null) {
      clearInterval(intervalId);
      intervalId = null;
    }
  }

  onDestroy(stopTimer);
</script>

<section class="runner">
  <header class="bar">
    <span class="name">{manifest.name}</span>
    <span class="timer numeric" class:low={$timeLeft <= 10}>{$timeLeft}s</span>
  </header>

  <div class="stage">
    {#await componentPromise}
      <p class="loading">Loading puzzle…</p>
    {:then Puzzle}
      <svelte:component
        this={Puzzle}
        {seed}
        {reportScore}
        {reportComplete}
        {timeLeft}
      />
    {:catch error}
      <p class="error">Couldn't load this puzzle: {error.message}</p>
    {/await}
  </div>
</section>

<style>
  .runner { max-width: 40rem; margin: 0 auto; }
  .bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--space-3);
    margin-bottom: var(--space-3);
  }
  .name { font-weight: 700; font-size: var(--text-lg); }
  .timer {
    font-size: var(--text-lg);
    font-weight: 700;
    color: var(--ink-soft);
    padding: var(--space-1) var(--space-3);
    background: var(--surface);
    border-radius: var(--radius-pill);
    box-shadow: var(--shadow-in);
  }
  .timer.low { color: var(--red); }
  .loading, .error { text-align: center; color: var(--ink-soft); }
  .error { color: var(--red); }
</style>
