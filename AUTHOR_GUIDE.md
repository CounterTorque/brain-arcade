# Brain Arcade — Puzzle Author Guide

You've been assigned a puzzle (see **FEATURES.md**). This guide gets you from zero to a merged PR.
You'll use an AI coding tool for most of the work — there's a ready-to-paste prompt at the end.

---

## What you're building

A **self-contained puzzle folder** that plugs into the game shell. The shell already handles the daily
schedule, the timer, navigation, results, and saving scores. **You only build the puzzle itself** — it
renders, takes input, and reports a score. You never touch the shell or other people's puzzles.

---

## Step-by-step

### 1. Branch
```bash
git checkout main
git pull
git checkout -b puzzle/<your-puzzle-id>     # e.g. puzzle/head-count
```

### 2. Copy the template
Duplicate `src/puzzles/_template/` to `src/puzzles/<your-puzzle-id>/` and rename the files:
```bash
cp -r src/puzzles/_template src/puzzles/head-count
```
Rename `Template.svelte` to something descriptive (e.g. `HeadCount.svelte`) and update the import in
`index.js`. Keep all your assets (images, sounds) inside this folder.

### 3. Fill in the manifest (`index.js`)
```js
export default {
  id: 'head-count',                 // MUST match your folder name, kebab-case
  name: 'Head Count',
  description: 'Count the objects before they vanish.',
  difficulty: 'easy',               // 'easy' | 'medium' | 'hard'
  estSeconds: 45,                   // honest estimate of play time
  component: () => import('./HeadCount.svelte'),
};
```

### 4. Build the puzzle (`*.svelte`)
Your component receives these props from the shell:

| Prop | Type | Use it for |
|------|------|------------|
| `seed` | `number` | **Always use this** to generate your puzzle. Same seed → same puzzle for everyone today. Never use `Math.random()` for anything that defines the day's challenge. |
| `reportScore` | `(value:number) => void` | Call when you have a score. Higher = better. |
| `reportComplete` | `() => void` | Call once when the player is done; the shell then advances. |
| `timeLeft` | `Readable<number>` (store) | Optional: show the countdown. The shell enforces the limit regardless. |

**The contract in one sentence:** generate from `seed`, let the player play, then call `reportScore(value)`
and `reportComplete()`.

#### Seeding
Use the shared helper so your randomness is deterministic:
```js
import { makeRng } from '../../lib/seededRandom.js';
const rng = makeRng(seed);     // rng() → float in [0,1), like Math.random but reproducible
const count = 5 + Math.floor(rng() * 6);   // 5–10 objects, same for everyone today
```

#### Styling: use the shared theme
The shell loads `src/styles/theme.css` globally — design tokens (palette, radii, shadows, easings)
and ready-made classes (`.surface`, `.btn`, `.well`, `.pop-in`, `.celebrate`, `.shake`) are already
available in your component. Style your puzzle's own pieces in your scoped `<style>` block **using
the tokens** (`var(--blue)`, `var(--radius-pill)`, `var(--ease-bounce)`), never hard-coded values.
**STYLE_GUIDE.md** explains the look: light neumorphic, pill shapes, big rounded type, bouncy
squash-and-stretch feedback. Green = correct, red = wrong, everywhere.

#### Scoring convention
Aim for roughly **0–1000**, higher is better, so your puzzle weighs fairly in the daily Brain Score composite.
A simple pattern: `score = correct * basePoints + speedBonus`. Document your formula in the README.

### 5. Register (the one shared line)
In `src/puzzles/registry.js` add **one import** and **one array entry**:
```js
import headCount from './head-count/index.js';   // ← add
export const puzzles = [
  triangleMath,
  headCount,                                       // ← add
];
```
> If this is the only place you get a merge conflict later, that's expected — it's a one-line fix and
> we resolve it together. Don't worry about it.

### 6. Run and check
```bash
npm install      # first time only
npm run dev
```
Confirm: your puzzle shows up, plays, reports a score, and the session moves on. No console errors.
Check it finishes within your `estSeconds`.

### 7. README
Add a short `README.md` in your folder: how it plays, the scoring formula, anything notable. (Template included.)

### 8. PR
```bash
git add src/puzzles/<your-puzzle-id> src/puzzles/registry.js
git commit -m "Add <your puzzle> puzzle"
git push -u origin puzzle/<your-puzzle-id>
```
Open a pull request — **one puzzle per PR**. We review and merge as a group.

---

## Checklist before you open the PR

- [ ] Everything is inside `src/puzzles/<your-id>/` (assets too).
- [ ] Manifest is complete and `id` matches the folder name.
- [ ] You used `seed` (via `makeRng`) for anything that defines the day's challenge — no bare `Math.random()`.
- [ ] You call `reportScore(value)` then `reportComplete()`.
- [ ] Score is roughly 0–1000, higher is better.
- [ ] Plays within `estSeconds`; no console errors.
- [ ] Styled with the shared theme tokens/classes (see STYLE_GUIDE.md) — no hard-coded colors, fonts, or shadows.
- [ ] One import + one entry added to `registry.js`.
- [ ] README written.

---

## Paste this to your AI coding tool

> I'm building a puzzle for a Svelte + Vite game called Brain Arcade. Each puzzle is a self-contained
> Svelte component that the game shell mounts. The shell passes these props:
>
> - `seed` (number): use it to generate the puzzle deterministically so every player gets the same
>   instance today. Use the helper `import { makeRng } from '../../lib/seededRandom.js'`; `makeRng(seed)`
>   returns a function like `Math.random` but reproducible. Never use bare `Math.random()` for anything
>   that defines the challenge.
> - `reportScore(value)` (function): call with a number score, higher = better, roughly 0–1000.
> - `reportComplete()` (function): call once when the player finishes; then the shell advances.
> - `timeLeft` (a Svelte readable store, optional): the countdown; the shell enforces the time limit anyway.
>
> Build the puzzle **[describe your puzzle here — e.g. "Head Count: flash N objects on screen briefly,
> hide them, ask the player to type how many there were, over 4 rounds"]**. Keep all logic and assets
> inside this one component/folder. Don't modify any shared/shell files. Use Svelte 4 single-file
> component syntax. At the end, call `reportScore` with my computed score and then `reportComplete`.
>
> Style it with the app's shared theme, which is already loaded globally. Use only its CSS custom
> properties — colors `--red --orange --yellow --green --blue --purple`, surfaces `--surface
> --surface-raised`, text `--ink --ink-soft`, shadows `--shadow-out --shadow-in`, radii `--radius
> --radius-pill`, font `--font-display`, easing `--ease-bounce`, durations `--snap --move` — plus the
> global classes `.surface`, `.btn`, `.well`, `.pop-in`, `.celebrate`, `.shake`. The look is light-mode
> neumorphic: soft extruded panels, pill-shaped buttons, big rounded type, vibrant saturated accents.
> Interactions must give snappy feedback: buttons squash when pressed, correct answers flash green
> with a bouncy pop, wrong answers shake red. No hard-coded hex colors, no borders, no serif or thin
> fonts, no dark backgrounds.
>
> Also generate a short README.md describing how it plays and the scoring formula.

Then drop the result into your folder, wire up the manifest and the registry line, and run `npm run dev`.

---

## Getting unstuck

- Puzzle doesn't appear? Check the registry import path and that `id` matches the folder.
- Everyone sees a different puzzle? You used `Math.random()` somewhere instead of `makeRng(seed)`.
- Session doesn't advance? You forgot to call `reportComplete()`.
- Ask in the team channel and bring it to the group review — that's what the sessions are for.
