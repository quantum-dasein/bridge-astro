// Static Tailwind build for the hand-written marketing pages in public/
// (replaces the cdn.tailwindcss.com runtime script). Rebuild with: npm run build:tw
// The Astro news section uses Tailwind v4 via @tailwindcss/vite and is NOT affected.
module.exports = {
  content: [
    "./public/index.html",
    "./public/projects.html",
    "./public/EN/index.html",
    "./public/EN/projects.html",
    "./public/UZ/index.html",
    "./public/UZ/projects.html",
    "./public/main.js",
    "./public/projects-universe.js",
  ],
  theme: {
    extend: {
      colors: {
        "bridge-taupe": "#8A7B66",
        "bridge-dark": "#292724",
        "bridge-light": "#F5F4F2",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        serif: ["Playfair Display", "Georgia", "serif"],
      },
    },
  },
};
