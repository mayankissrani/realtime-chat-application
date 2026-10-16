import type { Config } from 'tailwindcss'
const config: Config = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#fbf9f6',
          100: '#f2eae1',
          200: '#e5d5c5',
          300: '#d5bba3',
          400: '#c59d80',
          500: '#b78363',
          600: '#a96d51',
          700: '#8d5743',
          800: '#734839',
          900: '#5d3c31',
        }
      }
    },
  },
  plugins: [],
}
export default config
