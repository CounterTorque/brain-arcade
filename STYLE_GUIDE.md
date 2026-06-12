# Brain Arcade — Style Guide

The goal: every puzzle should feel like a sibling, not a clone. This guide (plus the shared tokens in
`src/styles/theme.css`) pins down the **family resemblance** — surface, color, type, shape, motion —
and deliberately leaves the rest to you. If your puzzle uses the shared tokens for its surfaces,
buttons, and feedback, it will sit comfortably next to everyone else's no matter how different the
gameplay is.

**The one rule:** style *with* the tokens, not with hard-coded values. Use `var(--blue)`, not `#1E90FF`.

---

## 1. The look in one sentence

**Light-mode neumorphic:** soft pale surfaces that game elements appear gently extruded from or
pressed into, punctuated by a small rainbow of vibrant, saturated accent colors.

- Backgrounds are soft and pale (`--surface`), never pure white, never dark.
- Elements get depth from **dual soft shadows** (`--shadow-out` raised, `--shadow-in` pressed), not hard borders.
- Color is used **sparingly and loudly** — saturated accents on calm surfaces, not colored backgrounds.

## 2. Color

A limited rainbow palette, defined once in `theme.css`:

| Token | Role guidance |
|-------|---------------|
| `--red` | errors, wrong answers, danger |
| `--orange` | warnings, streaks, heat |
| `--yellow` | highlights, stars, scores |
| `--green` | correct answers, success |
| `--blue` | primary actions, neutral accent |
| `--purple` | special items, bonuses |
| `--ink` / `--ink-soft` | text — a deep blue-gray, never pure black |
| `--surface` / `--surface-raised` | backgrounds and raised elements |

**How to use it**
- Pick **one or two accents** as your puzzle's identity; let `--green`/`--red` keep their universal
  correct/wrong meanings everywhere.
- Color is feedback, not decoration: a mostly-calm board that flashes vibrantly when something
  happens reads better than a board that is loud all the time.
- **Never rely on color alone** to carry meaning — pair it with a shape, icon, motion, or label
  (color-blind players are on the team).

## 3. Typography

- One family, app-wide: a **thick, rounded sans** — `--font-display` (Fredoka, falling back to
  Nunito / rounded system fonts). No serifs, no thin weights, ever.
- **Big and generous.** Body text starts at `--text-md` (1.125rem); game numbers and prompts should
  lean on `--text-xl`/`--text-2xl`. If a player squints, it's too small.
- Use weight (600–700) and size for hierarchy, not extra colors or underlines.
- Numbers in timers/scores use `font-variant-numeric: tabular-nums` so they don't jiggle as they tick.

## 4. Shape language

- **Rounded everything.** Cards and panels use `--radius` (24px); buttons and inputs are
  **pill-shaped** (`--radius-pill`). No sharp corners, no hard 1px-border boxes.
- Curves are smooth and blobby rather than geometric — when in doubt, rounder.
- Generous breathing room: padding inside elements (`--space-3`+) and space between them. Crowded
  layouts break the soft look faster than anything else.

## 5. Motion

- **Bouncy, squash-and-stretch.** Things don't fade in — they *pop* in, overshooting slightly and
  settling. Use `--ease-bounce` and the shared keyframes (`pop-in`, `squash`, `shake`, `celebrate`).
- **Snappy.** Feedback animations run 150–300ms (`--snap`, `--move`). The player should never wait
  for an animation to finish before acting again.
- Presses physically squash: interactables compress on `:active` (the shared `.btn` does this for you).
- Wrap any large or looping motion in `@media (prefers-reduced-motion: no-preference)` — the shared
  classes already do.

## 6. Interaction & UX feedback

Interactable things must be **obviously interactable**, and every action gets an **immediate,
colorful reaction**:

- Raised (`--shadow-out`) = "you can press me". Pressed (`--shadow-in`) = "you did / I'm selected".
  Flat things are decoration.
- Hover lifts slightly; press squashes; release pops back. The `.btn` class gives you all three.
- **Right answer:** green flash + a bouncy pop (`celebrate`). **Wrong answer:** red flash + a quick
  `shake`. Always within ~150ms of the input — snappy beats fancy.
- Touch/click targets are at least 44×44px. Buttons are pills with room to spare.
- Disabled states go soft and flat, not grayed-to-invisible.

## 7. What's fixed vs. what's yours

| Fixed (family resemblance) | Yours (creative identity) |
|---|---|
| Token values: palette, font, radii, shadows, easings | Which accents you feature, and how boldly |
| Light neumorphic surfaces; pill buttons | Your layout, board design, and game pieces |
| Green = correct, red = wrong | Every other meaning you give color |
| Bouncy/squashy motion feel, snappy timing | What animates, and your signature flourishes |
| Big rounded type | Your copy, tone, and personality |

Custom illustrations, sounds, themed pieces, weird mechanics: **encouraged.** Just build them out of
the family's colors, curves, and bounce.

## 8. Practical bits

- `src/styles/theme.css` is imported **once by the shell** (in `main.js`) — every token and utility
  class is already available inside your component. Don't re-import it.
- Keep puzzle-specific styles **scoped** in your `.svelte` file, written in terms of the tokens.
- Don't restyle global elements or define new `:root` variables — that's a shell change.
- Quick self-check before your PR: does your puzzle look like it came from the same toybox as
  Triangle Math? If yes, ship it.
