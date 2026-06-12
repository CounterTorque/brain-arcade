// Puzzle manifest — the contract the shell reads.
// Copy this whole folder to src/puzzles/<your-puzzle-id>/ and edit the fields below.
export default {
  id: 'triangle-math',                       // MUST be kebab-case and match your folder name
  name: 'Triangle Math',              // shown in menus and results
  description: 'Chained arithmetic: a number flows down through a triangle of operations.',
  difficulty: 'easy',                   // 'easy' | 'medium' | 'hard'
  estSeconds: 50,                       // honest expected play time; the shell budgets the session with it
  component: () => import('./TriangleMath.svelte'), // lazy-loaded; rename to match your component file
};
