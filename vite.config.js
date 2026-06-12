import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';

// GitHub Pages deployment (base path + Actions workflow) is a deliberate later step — see DESIGN.md §7, §10.
export default defineConfig({
  plugins: [svelte()],
});
