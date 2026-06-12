<script>
  import Home from './components/Home.svelte';
  import PuzzleRunner from './components/PuzzleRunner.svelte';
  import Results from './components/Results.svelte';
  import { getDailySet } from './lib/scheduler.js';
  import { scoreStore } from './lib/scoreStore.js';
  import { puzzles } from './puzzles/registry.js';

  const dailySet = getDailySet(puzzles);

  let phase = $state('home');
  let index = $state(0);
  let results = $state([]);

  let current = $derived(dailySet.puzzles[index]);

  function start() {
    index = 0;
    results = [];
    phase = 'session';
  }

  async function handleComplete({ puzzleId, score }) {
    const manifest = dailySet.puzzles[index].manifest;
    results = [...results, { puzzleId, name: manifest.name, score }];
    await scoreStore.saveResult(dailySet.date, puzzleId, score);

    if (index < dailySet.puzzles.length - 1) {
      index += 1;
    } else {
      phase = 'results';
    }
  }

  function goHome() {
    phase = 'home';
  }
</script>

{#if phase === 'home'}
  <Home {dailySet} onstart={start} />
{:else if phase === 'session'}
  {#key current.manifest.id}
    <PuzzleRunner
      manifest={current.manifest}
      seed={current.seed}
      oncomplete={handleComplete}
    />
  {/key}
{:else}
  <Results {results} onhome={goHome} />
{/if}
