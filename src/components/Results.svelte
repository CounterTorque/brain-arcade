<script>
  // End-of-session results (DESIGN.md §5): per-puzzle scores, the composite Brain Score,
  // and the player's trend over time from the score store.
  import { createEventDispatcher, onMount } from 'svelte';
  import { brainScore } from '../lib/brainScore.js';
  import { scoreStore } from '../lib/scoreStore.js';

  export let results;   // [{ puzzleId, name, score }] for today's session

  const dispatch = createEventDispatcher();

  $: todayScore = brainScore(results);

  let trend = [];   // [{ dayKey, score }] — daily Brain Score history, oldest → newest

  onMount(async () => {
    const history = await scoreStore.getHistory();
    // Group all stored results by day, then compute each day's Brain Score.
    const byDay = new Map();
    for (const r of history) {
      if (!byDay.has(r.dayKey)) byDay.set(r.dayKey, []);
      byDay.get(r.dayKey).push(r);
    }
    trend = [...byDay.entries()]
      .map(([dayKey, dayResults]) => ({ dayKey, score: brainScore(dayResults) }))
      .sort((a, b) => a.dayKey - b.dayKey);
  });

  // Build an SVG polyline for the sparkline (normalized to a 0–1000 scale).
  const W = 280, H = 60, PAD = 6;
  $: points = trend.length
    ? trend
        .map((d, i) => {
          const x = trend.length === 1 ? W / 2 : PAD + (i * (W - 2 * PAD)) / (trend.length - 1);
          const y = H - PAD - (Math.min(d.score, 1000) / 1000) * (H - 2 * PAD);
          return `${x.toFixed(1)},${y.toFixed(1)}`;
        })
        .join(' ')
    : '';
</script>

<main class="results">
  <h1>Brain Score</h1>
  <p class="score numeric pop-in">{todayScore}</p>

  <div class="surface card">
    <h2>Today</h2>
    <ul class="breakdown">
      {#each results as r (r.puzzleId)}
        <li>
          <span class="pname">{r.name}</span>
          <span class="pscore numeric">{r.score}</span>
        </li>
      {/each}
    </ul>
  </div>

  {#if trend.length > 1}
    <div class="surface card">
      <h2>Your trend</h2>
      <svg class="spark" viewBox="0 0 {W} {H}" role="img" aria-label="Brain Score over time">
        <polyline points={points} fill="none" stroke="var(--blue)" stroke-width="3"
                  stroke-linecap="round" stroke-linejoin="round" />
        {#each trend as d, i}
          {@const x = trend.length === 1 ? W / 2 : 6 + (i * (W - 12)) / (trend.length - 1)}
          {@const y = H - 6 - (Math.min(d.score, 1000) / 1000) * (H - 12)}
          <circle cx={x} cy={y} r="3.5"
                  fill={i === trend.length - 1 ? 'var(--green)' : 'var(--blue)'} />
        {/each}
      </svg>
      <p class="trend-note">{trend.length} days played</p>
    </div>
  {/if}

  <button class="btn primary" on:click={() => dispatch('home')}>Back home</button>
</main>

<style>
  .results { max-width: 32rem; margin: 0 auto; padding: var(--space-4); text-align: center; }
  .score { font-size: var(--text-2xl); font-weight: 700; color: var(--blue); margin: var(--space-2) 0; }
  .card { margin-top: var(--space-3); text-align: left; }
  .breakdown { list-style: none; padding: 0; margin: var(--space-3) 0 0; }
  .breakdown li {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: var(--space-2) var(--space-3);
    margin-bottom: var(--space-2);
    background: var(--surface);
    border-radius: var(--radius-pill);
    box-shadow: var(--shadow-in);
  }
  .pname { font-weight: 600; }
  .pscore { font-weight: 700; color: var(--ink); }
  .spark { width: 100%; height: auto; margin-top: var(--space-2); }
  .trend-note { color: var(--ink-soft); font-size: var(--text-sm); text-align: center; margin: var(--space-2) 0 0; }
  .btn { margin-top: var(--space-4); }
</style>
