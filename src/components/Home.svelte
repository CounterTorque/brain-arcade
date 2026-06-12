<script>
  // The intro / "today's set" screen (DESIGN.md §5). Shows what's queued for today and
  // starts the session. Reads the registry + scheduler to preview the day's puzzles.
  import { createEventDispatcher } from 'svelte';

  export let dailySet;   // { date, seed, puzzles: [{ manifest, seed }, ...] } from the scheduler

  const dispatch = createEventDispatcher();

  $: hasPuzzles = dailySet.puzzles.length > 0;
  $: today = dailySet.date.toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });
</script>

<main class="home">
  <h1>Brain Arcade 🧠🕹️</h1>
  <p class="date">{today}</p>

  {#if hasPuzzles}
    <div class="surface card pop-in">
      <h2>Today's set</h2>
      <ol class="set">
        {#each dailySet.puzzles as { manifest } (manifest.id)}
          <li>
            <span class="pname">{manifest.name}</span>
            <span class="diff diff-{manifest.difficulty}">{manifest.difficulty}</span>
          </li>
        {/each}
      </ol>
      <button class="btn primary" on:click={() => dispatch('start')}>Start →</button>
    </div>
  {:else}
    <div class="surface card pop-in">
      <h2>No puzzles yet</h2>
      <p>The arcade is still being built. Add a puzzle folder and register it to see it here.</p>
      <button class="btn" disabled>Start →</button>
    </div>
  {/if}
</main>

<style>
  .home { max-width: 32rem; margin: 0 auto; padding: var(--space-4); text-align: center; }
  .date { color: var(--ink-soft); margin-top: calc(-1 * var(--space-2)); }
  .card { margin-top: var(--space-4); }
  .set { list-style: none; padding: 0; margin: var(--space-3) 0; text-align: left; }
  .set li {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--space-2);
    padding: var(--space-2) var(--space-3);
    margin-bottom: var(--space-2);
    background: var(--surface);
    border-radius: var(--radius-pill);
    box-shadow: var(--shadow-in);
  }
  .pname { font-weight: 600; font-size: var(--text-md); }
  .diff {
    font-size: var(--text-sm);
    font-weight: 700;
    padding: 0.15rem var(--space-2);
    border-radius: var(--radius-pill);
    color: var(--surface-raised);
  }
  .diff-easy   { background: var(--green); }
  .diff-medium { background: var(--orange); }
  .diff-hard   { background: var(--red); }
  .btn { margin-top: var(--space-2); }
</style>
