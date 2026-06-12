<script>
  // The shell state machine: home → session → results (DESIGN.md §5).
  // Owns the daily set, walks each puzzle through the PuzzleRunner, collects + persists scores.
  import Home from './components/Home.svelte';
  import PuzzleRunner from './components/PuzzleRunner.svelte';
  import Results from './components/Results.svelte';
  import { getDailySet } from './lib/scheduler.js';
  import { scoreStore } from './lib/scoreStore.js';
  import { puzzles } from './puzzles/registry.js';

  // Today's set is deterministic from the date — same puzzles for the whole team.
  const dailySet = getDailySet(puzzles);

  let phase = 'home';   // 'home' | 'session' | 'results'
  let index = 0;        // which puzzle in the day's set we're on
  let results = [];     // [{ puzzleId, name, score }] collected this session

  $: current = dailySet.puzzles[index];

  function start() {
    index = 0;
    results = [];
    phase = 'session';
  }

  async function handleComplete(event) {
    const { puzzleId, score } = event.detail;
    const manifest = dailySet.puzzles[index].manifest;
    results = [...results, { puzzleId, name: manifest.name, score }];
    await scoreStore.saveResult(dailySet.date, puzzleId, score);

    if (index < dailySet.puzzles.length - 1) {
      index += 1;          // next puzzle
    } else {
      phase = 'results';   // session done
    }
  }

  function goHome() {
    phase = 'home';
  }
</script>

{#if phase === 'home'}
  <Home {dailySet} on:start={start} />
{:else if phase === 'session'}
  <!-- key on the puzzle id so each puzzle is a fresh component instance (timer + state reset) -->
  {#key current.manifest.id}
    <PuzzleRunner
      manifest={current.manifest}
      seed={current.seed}
      on:complete={handleComplete}
    />
  {/key}
{:else}
  <Results {results} on:home={goHome} />
{/if}
