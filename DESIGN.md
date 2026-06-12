# Brain Arcade — Design Document

> A team-built daily brain-training puzzle game. The core team builds the shell;
> each team member builds one self-contained puzzle as a feature, using AI coding tools,
> on their own branch, reviewed and merged together.

**Status:** Design / starting point. This bundle is meant to be lifted into a fresh git repo as the seed.
**Stack:** Svelte + Vite. **Hosting (v1):** GitHub Pages, no backend. **Scores (v1):** browser localStorage.

---

## 1. The idea in one paragraph

Every day, the team plays the **same short set of puzzles** — a 3–4 minute "daily session" in the spirit of classic brain-training games. Each puzzle is a small, self-contained brain teaser (Triangle Math, Head Count, Sign Match, and so on). The point isn't just the game: the team **builds** the game together. The core framework — the shell that runs the daily session, times each puzzle, collects scores, and shows results — is provided. Then a dozen-plus puzzles are defined as independent features and assigned to team members, who each build theirs on a branch with the help of AI coding tools. We review each puzzle together and merge it. Playing takes under 5 minutes a day; building your puzzle is a real, demoable "that's cool, I made that" contribution.

This serves the AI Leadership Framework goals directly: hands-on practice with AI coding tools, a real git/PR workflow, and a low-stakes shared artifact the whole team owns.

---

## 2. Design goals & constraints

- **Daily play under 5 minutes.** A session is a small fixed set of puzzles (default 3), each ~60s.
- **One shared set of puzzles per day.** Everyone on the team plays the same puzzles on the same date (deterministic, date-seeded). This is what creates the shared experience.
- **Each user keeps their own scores, live.** v1 stores scores locally; a later feature wires up a cloud store so scores are per-user and visible across devices / as a team view.
- **Features must be genuinely independent.** Puzzle authors must not have to edit each other's code. Each puzzle is a self-contained folder.
- **Real creative depth.** Each puzzle is a whole mini-game the author owns end to end — not a cosmetic tweak.
- **Mixed-skill friendly.** Approachable for non-developers leaning on AI tools, with room for stronger coders to show off.
- **Clean, reviewable PRs.** Adding a puzzle is "add a folder + one registry line," so every pull request is small and easy to review and merge together.

---

## 3. Architecture: a shell + a puzzle registry

The whole design rests on one decision: **the core is an engine that puzzles plug into, not a thing puzzles edit.** Authors add to a registry; they never modify shared game logic. This is what makes "a dozen independent ambitious features" actually work, and it models a genuinely good engineering habit (extension over modification).

```
┌─────────────────────────────────────────────────────────┐
│                        THE SHELL                          │
│  (built by the core team — puzzle authors don't touch)    │
│                                                           │
│  • Daily scheduler   — date seed → today's puzzle set     │
│  • Session flow      — intro → puzzle → puzzle → results   │
│  • Timer harness     — runs the clock for each puzzle      │
│  • Scoring harness   — collects results via scoreStore     │
│  • Profile/score store — per-user scores (localStorage v1) │
│  • Menu / registry   — lists all available puzzles         │
│  • Brain Score       — composite of the day's results      │
└───────────────────────────┬───────────────────────────────┘
                            │  the puzzle contract (see §4)
        ┌───────────────────┼───────────────────┐
        ▼                   ▼                   ▼
  ┌───────────┐       ┌───────────┐       ┌───────────┐
  │ triangle- │       │  head-    │       │  sign-    │   … one folder per
  │  math/    │       │  count/   │       │  match/   │      puzzle, each
  │ (Person A)│       │ (Person B)│       │ (Person C)│      owned by one author
  └───────────┘       └───────────┘       └───────────┘
```

The shell owns timing, navigation, persistence, and the daily ritual so puzzle authors never rebuild them. A puzzle only has to render itself, react to input, and report a score.

---

## 4. The puzzle contract

Every puzzle is a folder under `src/puzzles/` that is **fully self-contained** — its own components, images, and sounds live inside the folder and are referenced relatively, never globally.

```
src/puzzles/
  triangle-math/
    index.js             ← manifest: the contract the shell reads (required)
    TriangleMath.svelte  ← the puzzle UI + logic (required)
    assets/              ← images, sounds — referenced relatively (optional)
    components/          ← any sub-components this puzzle needs (optional)
    README.md            ← author notes / how it plays (recommended)
```

### 4.1 The manifest (`index.js`)

```js
export default {
  id: 'triangle-math',            // unique, kebab-case, matches the folder name
  name: 'Triangle Math',          // shown in menus and results
  description: 'Chain the arithmetic before the clock runs out.',
  difficulty: 'easy',             // 'easy' | 'medium' | 'hard'
  estSeconds: 60,                 // expected play time; shell uses it to budget the session
  component: () => import('./TriangleMath.svelte'), // lazy-loaded, keeps bundle small
};
```

### 4.2 The component API (props the shell passes in)

The shell mounts the puzzle component and passes a small, stable set of props. Puzzles stay "dumb" about timing, navigation, and persistence — they just play and report.

| Prop | Type | What it does |
|------|------|--------------|
| `seed` | `number` | Deterministic seed for *today*. Use it to generate the puzzle so everyone gets the same instance on the same day. |
| `reportScore(value)` | `function` | Call when the puzzle produces a score (higher = better, normalized guidance in the author guide). |
| `reportComplete()` | `function` | Call when the puzzle is finished so the shell advances the session. |
| `timeLeft` | `readable store` | Optional. The shared countdown, if the author wants to display it. The shell enforces the time limit either way. |

A puzzle that doesn't use the clock simply calls `reportScore` then `reportComplete` whenever it's done. A timed puzzle reports a running score and the shell calls time on it at `estSeconds`.

> The full, copy-pasteable contract and a worked example live in **AUTHOR_GUIDE.md** and the **`_template/`** folder.

### 4.3 The one shared line: the registry

There is exactly **one** file all authors touch — `src/puzzles/registry.js`:

```js
import triangleMath from './triangle-math/index.js';
import headCount    from './head-count/index.js';
// each author adds ONE import above and ONE entry below

export const puzzles = [
  triangleMath,
  headCount,
  // ...
];
```

This single shared file is the only place two authors could conflict, and it's a trivial one-line conflict — which makes it a perfect, low-stakes lesson in resolving a merge rather than a frustration.

> **v2 option (zero shared edits):** Vite's `import.meta.glob('./puzzles/*/index.js', { eager: true })` can auto-discover every puzzle folder, so nobody edits a shared file at all. We deliberately start with the explicit registry so the wiring is visible and learnable, then switch to auto-discovery once the team is comfortable.

---

## 5. The daily session flow

```
        ┌──────────┐   ┌──────────┐   ┌──────────┐   ┌──────────┐   ┌──────────┐
  ──▶   │  Intro   │─▶ │ Puzzle 1 │─▶ │ Puzzle 2 │─▶ │ Puzzle 3 │─▶ │ Results  │
        │ "Today's │   │  ~60s    │   │  ~60s    │   │  ~60s    │   │ + Brain  │
        │  set"    │   │          │   │          │   │          │   │ Score+📈 │
        └──────────┘   └──────────┘   └──────────┘   └──────────┘   └──────────┘
                         each reports score → shell collects → composite score
```

1. **Daily scheduler** takes today's date, derives a seed, and deterministically picks the day's puzzles (default 3) from the registry. Same date → same puzzles for everyone.
2. The shell runs each puzzle in turn, passing the day's `seed` and the report callbacks.
3. After the last puzzle, the **Results** screen shows the day's scores, a composite **Brain Score**, and the user's trend over time.
4. Total time targets under 5 minutes.

**Seeding:** a small deterministic PRNG seeded from the date (e.g. `YYYYMMDD`). Both *which* puzzles run and *what instance* each generates derive from that seed, so the whole team shares the identical daily challenge with no backend required.

---

## 6. Scoring & the `scoreStore` interface

All scores flow through **one interface**, so the storage backend can change without touching any puzzle or the session flow.

```js
// src/lib/scoreStore.js  (interface the shell depends on)
export interface ScoreStore {
  saveResult(date, puzzleId, score):  Promise<void>;
  getResults(date):                    Promise<Result[]>;   // this user, this day
  getHistory(puzzleId?):               Promise<Result[]>;   // this user, trend lines
  // (cloud impl adds) getTeamResults(date): Promise<Result[]>;
}
```

- **v1 implementation — `localStorageScoreStore`.** Zero infrastructure, ships on GitHub Pages immediately. Per-browser scores and personal trend lines work out of the box. The limitation — not cross-device, no team view — is acceptable for a first playable version.
- **v2 implementation — cloud store (a feature, see assignments).** Swap in a `supabaseScoreStore` (or Firebase) behind the *same interface* to get live per-user scores across devices plus a team leaderboard / daily-results view. Because puzzles only ever see `reportScore`, none of them change.

This is the key staging decision: **build day one with no infra, make the backend a teachable assignment, not a prerequisite.**

---

## 7. Hosting plan

| Stage | Hosting | Scores | Notes |
|-------|---------|--------|-------|
| **v1 (start here)** | GitHub Pages | localStorage | Static build (`vite build`), pushed to Pages. Nothing to maintain, nothing to secure, no cost. |
| **v2 (when team wants shared/live scores)** | GitHub Pages + Supabase free tier | Supabase Postgres + realtime | A `scores` table + auto REST/realtime API. Realtime channel makes "live" literal. Inactivity-pause caveat is moot for a daily game. |
| **alt v2** | GitHub Pages + Firebase Firestore | Firestore | Equivalent; pick if the team prefers Google's stack. Realtime is its strength. |

All options stay within free tiers for a small team. Keep secrets (Supabase anon key etc.) in a `.env` and out of the repo; the anon key is safe for client use with row-level security configured.

Deployment for v1 is a GitHub Action that runs `vite build` and publishes `dist/` to the `gh-pages` branch (or Pages-from-Actions). Set Vite's `base` to the repo name for project Pages.

---

## 8. Git / PR workflow for the team

This is as much the point as the game. The loop per puzzle:

1. **Branch.** `git checkout -b puzzle/<your-puzzle-id>` off `main`.
2. **Copy the template.** Duplicate `src/puzzles/_template/` to `src/puzzles/<your-puzzle-id>/` and rename. (See AUTHOR_GUIDE.md.)
3. **Build with AI.** Use your AI coding tool. The author guide gives a ready-to-paste prompt describing the contract so the tool generates a compliant puzzle.
4. **Register.** Add your one import + one array entry to `src/puzzles/registry.js`.
5. **Run it.** `npm run dev`, confirm your puzzle appears and plays, scores report, session advances.
6. **Push & open a PR.** One puzzle per PR.
7. **Review together.** The group reviews the PR — does it meet the acceptance criteria, is it self-contained, does it play in under its `estSeconds`? — then merges. Merge conflicts (only ever in `registry.js`) are resolved live as a teaching moment.

**Branch protection (recommended):** require a PR and at least one approval to merge to `main`, so review-together is enforced rather than optional.

**Definition of done for a puzzle PR:**
- Lives entirely in its own folder; assets/sounds self-contained.
- Exports a valid manifest; appears in the menu and the daily rotation.
- Uses `seed` so the daily instance is the same for everyone.
- Calls `reportScore` and `reportComplete`.
- Plays within its `estSeconds`; no console errors.
- Has a short README explaining how it plays.

---

## 9. Repo layout (the seed)

```
brain-arcade/
  README.md                  ← what this is + quickstart
  DESIGN.md                  ← this document
  AUTHOR_GUIDE.md            ← how to build & submit a puzzle (+ AI prompt)
  FEATURES.md                ← the puzzle assignments
  package.json
  vite.config.js
  index.html
  src/
    main.js                  ← boots the Svelte app
    App.svelte               ← the shell UI (menu / session / results)
    lib/
      scheduler.js           ← date → seed → today's puzzle set
      seededRandom.js        ← deterministic PRNG
      scoreStore.js          ← ScoreStore interface + localStorage impl
      brainScore.js          ← composite-score calculation
    puzzles/
      registry.js            ← the one shared file (one line per puzzle)
      _template/             ← copy this to start a new puzzle
        index.js
        Template.svelte
        README.md
      triangle-math/         ← example puzzle (reference implementation)
        index.js
        TriangleMath.svelte
        README.md
```

> Note: the `src/` tree above is the **target** structure. This starting bundle ships the three docs plus the `_template/` and a worked example spec so the core team can scaffold the Svelte app from a clean, agreed design. The core-team setup checklist is in §10.

---

## 10. Core-team setup checklist (before handing puzzles out)

1. Create the repo, drop in this bundle, run `npm create vite@latest` with the Svelte template and reconcile the layout in §9.
2. Implement the shell: `scheduler.js`, `seededRandom.js`, `scoreStore.js` (localStorage), `brainScore.js`, and `App.svelte` (menu → session → results).
3. Ship the `triangle-math` example puzzle as the reference implementation authors copy.
4. Create `_template/` from the example, stripped to a minimal working stub.
5. Turn on branch protection + PR review on `main`.
6. Deploy v1 to GitHub Pages and confirm the daily session plays end to end.
7. Hand out FEATURES.md assignments; point everyone at AUTHOR_GUIDE.md.

---

## 11. Stretch / later features (beyond the first 10)

- Auto-discovery registry (`import.meta.glob`) to remove the one shared file.
- The Supabase/Firebase cloud score store + team leaderboard (listed as an assignment in FEATURES.md).
- Brain Score trend analytics and badges.
- Let people pitch and add their *own* puzzle ideas — the registry makes this trivial and is itself motivating.
- Accessibility pass (color-blind palettes, keyboard play, reduced-motion).
