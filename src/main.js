// Boots the Brain Arcade shell.
// The shared theme is imported ONCE here so its tokens + utility classes are
// global for the shell and every puzzle (STYLE_GUIDE.md §8). Don't import it elsewhere.
import './styles/theme.css';
import { mount } from 'svelte';
import App from './App.svelte';

const app = mount(App, {
  target: document.getElementById('app'),
});

export default app;
