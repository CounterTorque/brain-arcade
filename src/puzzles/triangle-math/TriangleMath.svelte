<script>
  import { makeRng } from '../../lib/seededRandom.js';

  let { seed, reportScore, reportComplete, timeLeft = null } = $props();

  const TOTAL_ROUNDS = 5;
  const BASE_POINTS = 200;        // per correct round → 5 × 200 = 1000 max

  const rng = makeRng(seed);

  // ── Generate all rounds up front (deterministic) ─────────────────────
  function generateRound() {
    const a = 1 + Math.floor(rng() * 9);
    const b = 1 + Math.floor(rng() * 9);
    const c = 1 + Math.floor(rng() * 9);
    const op1 = rng() < 0.5 ? '+' : '−';
    const op2 = rng() < 0.5 ? '+' : '−';
    const mid1 = op1 === '+' ? a + b : a - b;
    const mid2 = op2 === '+' ? b + c : b - c;
    const op3 = rng() < 0.5 ? '+' : '−';
    const bottom = op3 === '+' ? mid1 + mid2 : mid1 - mid2;
    return { a, b, c, op1, op2, op3, mid1, mid2, bottom };
  }

  const rounds = Array.from({ length: TOTAL_ROUNDS }, generateRound);

  // ── Reactive state ───────────────────────────────────────────────────
  let round = $state(0);
  let inputMid1 = $state('');
  let inputMid2 = $state('');
  let inputBottom = $state('');
  let phase = $state('input');     // 'input' | 'feedback' | 'done'
  let feedbackMid1 = $state('');   // 'correct' | 'wrong' | ''
  let feedbackMid2 = $state('');
  let feedbackBottom = $state('');
  let correctCount = $state(0);
  let startTime = $state(Date.now());

  let current = $derived(rounds[round]);

  // Track which cell is focused for visual highlight
  let focusedCell = $state('');

  function checkAnswers() {
    if (phase !== 'input') return;
    const r = current;
    const m1ok = Number(inputMid1) === r.mid1;
    const m2ok = Number(inputMid2) === r.mid2;
    const bok  = Number(inputBottom) === r.bottom;
    feedbackMid1 = m1ok ? 'correct' : 'wrong';
    feedbackMid2 = m2ok ? 'correct' : 'wrong';
    feedbackBottom = bok ? 'correct' : 'wrong';
    if (m1ok && m2ok && bok) correctCount++;
    phase = 'feedback';

    setTimeout(advance, 900);
  }

  function advance() {
    if (round + 1 < TOTAL_ROUNDS) {
      round++;
      inputMid1 = '';
      inputMid2 = '';
      inputBottom = '';
      feedbackMid1 = '';
      feedbackMid2 = '';
      feedbackBottom = '';
      phase = 'input';
    } else {
      phase = 'done';
      const elapsed = (Date.now() - startTime) / 1000;
      const accuracy = correctCount / TOTAL_ROUNDS;
      const score = Math.round(accuracy * 1000);
      reportScore(score);
      reportComplete();
    }
  }

  // Handle Enter key in any input
  function onKey(e) {
    if (e.key === 'Enter') checkAnswers();
  }

  // Feedback CSS class helper
  function fbClass(fb) {
    if (fb === 'correct') return 'celebrate';
    if (fb === 'wrong') return 'shake';
    return '';
  }
</script>

<div class="puzzle surface pop-in">
  <header class="header">
    <h2>Triangle Math</h2>
    <div class="meta">
      <span class="round-badge numeric">Round {round + 1} / {TOTAL_ROUNDS}</span>
      {#if timeLeft}
        <span class="timer numeric">{$timeLeft}s</span>
      {/if}
    </div>
  </header>

  {#if phase === 'done'}
    <div class="result pop-in">
      <p class="score-label">Score</p>
      <p class="score-value numeric celebrate">{Math.round((correctCount / TOTAL_ROUNDS) * 1000)}</p>
      <p class="score-detail">{correctCount} / {TOTAL_ROUNDS} rounds correct</p>
    </div>
  {:else}
    <!-- Row 1: three given numbers -->
    {#key round}
    <div class="triangle pop-in">
      <div class="row row-top">
        <span class="cell given">{current.a}</span>
        <span class="op">{current.op1}</span>
        <span class="cell given">{current.b}</span>
        <span class="op">{current.op2}</span>
        <span class="cell given">{current.c}</span>
      </div>

      <!-- Row 2: two blanks -->
      <div class="row row-mid">
        <div class="cell-wrap {fbClass(feedbackMid1)}">
          <input
            class="cell blank well"
            class:focused={focusedCell === 'mid1'}
            type="number"
            bind:value={inputMid1}
            disabled={phase !== 'input'}
            onfocus={() => focusedCell = 'mid1'}
            onblur={() => focusedCell = ''}
            onkeydown={onKey}
            placeholder="?"
          />
        </div>
        <span class="op">{current.op3}</span>
        <div class="cell-wrap {fbClass(feedbackMid2)}">
          <input
            class="cell blank well"
            class:focused={focusedCell === 'mid2'}
            type="number"
            bind:value={inputMid2}
            disabled={phase !== 'input'}
            onfocus={() => focusedCell = 'mid2'}
            onblur={() => focusedCell = ''}
            onkeydown={onKey}
            placeholder="?"
          />
        </div>
      </div>

      <!-- Row 3: one blank -->
      <div class="row row-bot">
        <div class="cell-wrap {fbClass(feedbackBottom)}">
          <input
            class="cell blank well big-blank"
            class:focused={focusedCell === 'bot'}
            type="number"
            bind:value={inputBottom}
            disabled={phase !== 'input'}
            onfocus={() => focusedCell = 'bot'}
            onblur={() => focusedCell = ''}
            onkeydown={onKey}
            placeholder="?"
          />
        </div>
      </div>
    </div>
    {/key}

    <button
      class="btn primary submit-btn"
      style="--accent: var(--blue)"
      onclick={checkAnswers}
      disabled={phase !== 'input'}
    >
      Submit
    </button>
  {/if}
</div>

<style>
  .puzzle {
    text-align: center;
    max-width: 26rem;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--space-3);
  }

  .header {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--space-1);
  }

  .header h2 {
    font-size: var(--text-xl);
    color: var(--ink);
    margin: 0;
  }

  .meta {
    display: flex;
    gap: var(--space-3);
    align-items: center;
  }

  .round-badge {
    font-size: var(--text-md);
    font-weight: 600;
    color: var(--blue);
  }

  .timer {
    font-size: var(--text-md);
    font-weight: 600;
    color: var(--ink-soft);
  }

  /* ── Triangle layout ─────────────────────────────────────────────── */
  .triangle {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--space-3);
  }

  .row {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--space-2);
  }

  .op {
    font-size: var(--text-xl);
    font-weight: 700;
    color: var(--ink-soft);
    user-select: none;
    min-width: 1.5rem;
    text-align: center;
  }

  /* ── Cells ────────────────────────────────────────────────────────── */
  .cell {
    width: 3.8rem;
    height: 3.8rem;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: var(--text-xl);
    font-weight: 700;
    font-family: var(--font-display);
    border-radius: var(--radius-sm);
    text-align: center;
  }

  .given {
    background: var(--surface-raised);
    box-shadow: var(--shadow-out-sm);
    color: var(--ink);
  }

  .blank {
    padding: 0;
    font-size: var(--text-xl);
    font-weight: 700;
    color: var(--ink);
    caret-color: var(--blue);
    border-radius: var(--radius-sm);
  }

  .blank::placeholder {
    color: var(--ink-soft);
    opacity: 0.5;
  }

  .blank.focused {
    outline: 3px solid var(--blue);
    outline-offset: 2px;
  }

  .big-blank {
    width: 4.5rem;
    height: 4.5rem;
    font-size: var(--text-2xl);
  }

  /* remove number input spinners */
  input[type="number"]::-webkit-inner-spin-button,
  input[type="number"]::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  input[type="number"] {
    -moz-appearance: textfield;
    appearance: textfield;
  }

  /* ── Feedback wrappers ─────────────────────────────────────────── */
  .cell-wrap {
    display: inline-flex;
  }

  /* ── Submit button ─────────────────────────────────────────────── */
  .submit-btn {
    font-size: var(--text-lg);
    padding: var(--space-2) var(--space-4);
    margin-top: var(--space-2);
  }

  /* ── Result screen ─────────────────────────────────────────────── */
  .result {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--space-2);
    padding: var(--space-4);
  }

  .score-label {
    font-size: var(--text-lg);
    font-weight: 600;
    color: var(--ink-soft);
    margin: 0;
  }

  .score-value {
    font-size: var(--text-2xl);
    font-weight: 700;
    margin: 0;
  }

  .score-detail {
    font-size: var(--text-md);
    color: var(--ink-soft);
    margin: 0;
  }
</style>
