// Puzzle manifest — the contract the shell reads.
// Copy this whole folder to src/puzzles/<your-puzzle-id>/ and edit the fields below.
export default {
  id: 'template',                       // MUST be kebab-case and match your folder name
  name: 'Template Puzzle',              // shown in menus and results
  description: 'Replace me with a one-line description of how it plays.',
  difficulty: 'easy',                   // 'easy' | 'medium' | 'hard'
  estSeconds: 45,                       // honest expected play time; the shell budgets the session with it
  component: () => import('./Template.svelte'), // lazy-loaded; rename to match your component file
};
