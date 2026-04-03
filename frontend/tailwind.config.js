/** @type {import('tailwindcss').Config} */
export default {
  // Tailwind v4 uses @source in many setups, but keeping a content config doesn't hurt
  // for editors and tooling.
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [],
};

