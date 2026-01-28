import type { Config } from 'tailwindcss';

const config: Config = {
  // Tailwind v4 uses CSS-based configuration, but shadcn init still checks for this file
  // Most configuration is now done via CSS using @theme directive
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
};

export default config;
