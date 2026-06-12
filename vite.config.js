import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';

// GitHub Pages deployment (base path + Actions workflow) is a deliberate later step — see DESIGN.md §7, §10.
export default defineConfig({
  plugins: [svelte()],
  server: {
    // Honor a PORT from the environment (e.g. the preview harness) when present.
    port: process.env.PORT ? Number(process.env.PORT) : 5173,
  },
});
