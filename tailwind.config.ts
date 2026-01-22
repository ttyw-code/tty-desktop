import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/renderer/src/**/*.{js,ts,jsx,tsx}',
    './node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};

export default config;