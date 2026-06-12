# Brain Arcade — Feature Assignments

Each feature below is **one self-contained puzzle folder** (see DESIGN.md §4 and AUTHOR_GUIDE.md).
One puzzle per person, one branch per puzzle, one PR per puzzle. Reviewed and merged together.

Difficulty is a guide for matching to skill/ambition, not a hard rule. Every puzzle, regardless of
difficulty, must satisfy the **shared acceptance criteria** plus its own.

---

## Shared acceptance criteria (every puzzle)

- [ ] Lives entirely in `src/puzzles/<your-id>/`; any images/sounds are inside the folder and referenced relatively.
- [ ] Exports a valid manifest (`id`, `name`, `description`, `difficulty`, `estSeconds`, `component`).
- [ ] Registered with exactly one import + one entry in `src/puzzles/registry.js`.
- [ ] Uses the `seed` prop so today's instance is **identical for every teammate** on the same date.
- [ ] Calls `reportScore(value)` then `reportComplete()` when the player finishes.
- [ ] Playable within its declared `estSeconds`; no console errors.
- [ ] Short `README.md` describing how it plays and how scoring works.

> **Scoring convention:** higher score = better. Aim for a roughly 0–1000 range per puzzle so the
> daily Brain Score composite stays balanced across puzzles. The author guide explains normalization.

---

## Approachable

### 1. Triangle Math  *(easy)* — also the reference example
Chained arithmetic: a number flows down through a triangle of operations (e.g. `7 → +3 → ×2 → −5`); player enters the running result at each step before the clock runs out.
- **Score:** correct steps × speed bonus.
- **Specific criteria:** at least 5 steps per round; wrong answer ends the round; seed determines the operation chain.
- *(This one is built by the core team as the reference implementation; listed here for completeness.)*

### 2. Head Count  *(easy)*
A cluster of objects slide into a building on screen for a moment, and some slide out; player types how many there were.
- **Score:** accuracy across several rounds (closer guess = more points), small speed bonus.
- **Specific criteria:** object count and in/out, and speed derive from the seed; 3–5 rounds; fixed duration.

### 3. Sign Match  *(easy)*
Given numbers and a target (e.g. `8 _ 4 _ 2 = 6`), player inserts `+ − × ÷` to make the equation true.
- **Score:** puzzles solved within the time limit; bonus for speed.
- **Specific criteria:** every generated puzzle has at least one valid solution; seed determines the numbers/target.

### 4. Color Clash (Stroop)  *(easy)*
A color word is shown in a different ink color; player must pick the **ink color**, not the word.
- **Score:** correct answers in the time window; streak multiplier.
- **Specific criteria:** word/ink pairings from the seed; clearly distinct, color-blind-considered palette; fast rounds.

### 5. Memory Grid  *(easy–medium)*
A sequence of cells lights up; player repeats it back. Sequence grows each round.
- **Score:** longest sequence reproduced.
- **Specific criteria:** starting sequence seeded; grid size fixed (e.g. 3×3); clear visual/audio feedback.

### 6. Bubble Order  *(easy)*
Numbered bubbles drift slowly around the screen; player pops them in ascending order as fast as possible.
- **Score:** bubbles popped in order × speed bonus; a wrong pop breaks the streak multiplier.
- **Specific criteria:** values, starting positions, and drift paths seeded; targets large enough to click comfortably with a mouse; 2–3 waves of increasing count.

### 7. Top Number  *(easy)*
Several quantities flash on screen, each shown a different way — numeral, dice pips, tally marks, dot clusters; player picks the largest (or smallest, per the round's prompt).
- **Score:** correct picks in the time window; speed bonus.
- **Specific criteria:** values and representations seeded; exactly one correct answer per round; prompt (largest vs. smallest) varies to keep the player reading.

---

## Mid

### 8. Quick Sort  *(medium)*
A row of numbers (or tiles) must be dragged into ascending order against the clock.
- **Score:** rounds completed × speed; penalty for wrong final order.
- **Specific criteria:** the set of values is seeded; supports both pointer drag and a keyboard fallback.

### 9. Odd One Out  *(medium)*
A grid of items where one breaks the pattern (shape, color, rotation, parity); player taps the odd one.
- **Score:** correct picks in the time window; harder grids worth more.
- **Specific criteria:** pattern and the odd item are seed-derived and provably unique; difficulty ramps within the round.

### 10. Word Scramble  *(medium)*
An anagram of a real word is shown; player unscrambles it (drag letters or type).
- **Score:** words solved; speed bonus; optional hint costs points.
- **Specific criteria:** word list bundled in the puzzle folder; the day's words picked by seed; case-insensitive validation.

### 11. Rapid Reckon  *(medium)*
True/false equations flash one after another (`6 × 7 = 42` → true); player answers as fast as possible.
- **Score:** correct answers in the time window; combo multiplier; wrong answer breaks the combo.
- **Specific criteria:** equations and their truth values seeded; tight per-equation timeout.

### 12. Balance Scales  *(medium)*
Two or three balance scales show how a set of objects compare in weight; player deduces and picks the heaviest (or lightest) object.
- **Score:** correct picks across rounds; speed bonus; harder multi-scale rounds worth more.
- **Specific criteria:** weight relationships seeded with exactly one valid answer; rounds ramp from one scale to chained inferences across two or three; pure point-and-click.

---

## Show-off

### 13. Number Maze  *(hard)*
Navigate a grid from start to exit, but you may only step onto cells that satisfy a rule (e.g. "next must be +3" or "ascending primes").
- **Score:** maze solved; bonus for fewest steps / time.
- **Specific criteria:** maze and rule generated from the seed with a guaranteed solution path; invalid moves rejected with feedback.

### 14. Cube Stack  *(hard)*
A 3D-looking stack of cubes is shown; player counts **all** the cubes, including the hidden ones that must be supporting the visible stack.
- **Score:** accuracy across rounds (exact count = full points); speed bonus; stack size ramps up.
- **Specific criteria:** stack layout seeded; every hidden cube must be logically inferable from what's visible (no ambiguous stacks); 3–5 rounds; rendered with CSS/SVG isometric projection — no 3D engine required.

### 15. Cloud Scores & Team Board  *(hard — not a puzzle; the backend feature)*
Implement a `supabaseScoreStore` (or Firebase) behind the existing `ScoreStore` interface so per-user scores are live and cross-device, plus a team daily-results / leaderboard view.
- **Acceptance:** drops in behind `src/lib/scoreStore.js` with **no changes to any puzzle**; keys/secrets in `.env`, not committed; row-level security configured; falls back to localStorage if offline/unconfigured.
- **Specific criteria:** documents the free-tier setup steps in its README so anyone can stand up their own instance.

---

## Assignment grid (fill in names)

| # | Puzzle | Difficulty | Assignee | Branch | Status |
|---|--------|-----------|----------|--------|--------|
| 1 | Triangle Math (reference) | easy | *core team* | `puzzle/triangle-math` | example |
| 2 | Head Count | easy | | `puzzle/head-count` | |
| 3 | Sign Match | easy | | `puzzle/sign-match` | |
| 4 | Color Clash | easy | | `puzzle/color-clash` | |
| 5 | Memory Grid | easy–med | | `puzzle/memory-grid` | |
| 6 | Bubble Order | easy | | `puzzle/bubble-order` | |
| 7 | Top Number | easy | | `puzzle/top-number` | |
| 8 | Quick Sort | medium | | `puzzle/quick-sort` | |
| 9 | Odd One Out | medium | | `puzzle/odd-one-out` | |
| 10 | Word Scramble | medium | | `puzzle/word-scramble` | |
| 11 | Rapid Reckon | medium | | `puzzle/rapid-reckon` | |
| 12 | Balance Scales | medium | | `puzzle/balance-scales` | |
| 13 | Number Maze | hard | | `puzzle/number-maze` | |
| 14 | Cube Stack | hard | | `puzzle/cube-stack` | |
| 15 | Cloud Scores & Team Board | hard | | `feature/cloud-scores` | |

> 14 puzzles + 1 backend feature gives slack for a team of ~10 and room for people to **pitch their own** instead — the registry makes adding one trivial, and a self-pitched puzzle is the most motivating of all.
