<script>
  import { onDestroy, untrack } from 'svelte';
  import { writable } from 'svelte/store';

  let { manifest, seed, oncomplete } = $props();

  // manifest never changes per instance (parent keys on puzzle id); untrack to suppress
  // the "captured initial value" lint — this is intentional, not a reactivity bug.
  const { estSeconds: estSecondsRaw = 60, id: manifestId, component: loadComponent } = untrack(() => manifest);
  const timeLeft = writable(estSecondsRaw);

  let latestScore = 0;
  let finished = false;
  let intervalId = null;

  const componentPromise = loadComponent().then((m) => {
    startTimer();
    return m.default;
  });

  function reportScore(value) {
    latestScore = Number(value) || 0;
  }

  function reportComplete() {
    finish();
  }

  function finish() {
    if (finished) return;
    finished = true;
    stopTimer();
    oncomplete({ puzzleId: manifestId, score: latestScore });
  }

  function startTimer() {
    if (intervalId !== null) return;
    intervalId = setInterval(() => {
      timeLeft.update((t) => {
        const next = t - 1;
        if (next <= 0) {
          finish();
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
      <Puzzle
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
