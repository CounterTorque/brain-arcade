# Brain Arcade 🧠🕹️

A team-built daily brain-training puzzle game. Everyone plays the same short set of puzzles each
day (3–4 minutes), and **the whole team builds the game together** — the core team builds the shell,
and each member builds one self-contained puzzle as a feature, with AI coding tools, on a branch we
review and merge as a group.

Built with **Svelte + Vite**. Hosts free on **GitHub Pages**; scores start in the browser
(`localStorage`) and a cloud store is a later feature.

## Docs
- **[DESIGN.md](DESIGN.md)** — the full design: architecture, puzzle contract, daily flow, scoring, hosting, git workflow.
- **[FEATURES.md](FEATURES.md)** — the puzzle assignments with acceptance criteria.
- **[AUTHOR_GUIDE.md](AUTHOR_GUIDE.md)** — how to build and submit your puzzle (includes an AI-tool prompt).
- **[STYLE_GUIDE.md](STYLE_GUIDE.md)** — the shared look & feel: palette, type, shape, motion, and the theme tokens.

## What's in this starting bundle
This is a **seed** to lift into a fresh repo. It ships the design docs plus the pieces that pin down
the puzzle contract so authors have something concrete to copy:

```
brain-arcade/
  README.md  DESIGN.md  FEATURES.md  AUTHOR_GUIDE.md  STYLE_GUIDE.md
  src/
    lib/seededRandom.js          ← deterministic RNG helper authors import
    styles/theme.css             ← shared design tokens & utility classes
    puzzles/
      registry.js                ← the one shared "add one line" file
      _template/                 ← copy this folder to start a puzzle
        index.js  Template.svelte  README.md
```

The core team scaffolds the rest of the Svelte app (the shell: scheduler, session flow, score store,
results) per **DESIGN.md §9–10**, ships `triangle-math` as the reference puzzle, then hands out
assignments.

## Quickstart (once the shell is scaffolded)
```bash
npm install
npm run dev        # play locally
npm run build      # produce dist/ for GitHub Pages
```

## The 30-second mental model
The shell runs the daily session and owns timing, navigation, and saving scores. A **puzzle** is a
folder under `src/puzzles/` that the shell mounts; it generates itself from a daily `seed`, lets the
player play, and calls `reportScore()` then `reportComplete()`. Authors add a folder + one registry
line — they never edit the shell or each other's code.
