// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://www.bridgeconsult.uz',
  devToolbar: {
    enabled: false
  },
  integrations: [mdx()],
  vite: {
    cacheDir: '.astro/vite',
    plugins: [tailwindcss()]
  }
});
