// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';

import tailwindcss from '@tailwindcss/vite';
import remarkGlossaryLinks from './scripts/remark-glossary-links.mjs';

// https://astro.build/config
export default defineConfig({
  site: 'https://www.bridgeconsult.uz',
  devToolbar: {
    enabled: false
  },
  integrations: [mdx()],
  // Первое упоминание термина в статье ведёт на его страницу в словаре FIDIC.
  markdown: {
    remarkPlugins: [remarkGlossaryLinks]
  },
  vite: {
    cacheDir: '.astro/vite',
    plugins: [tailwindcss()]
  }
});
