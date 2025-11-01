import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#0ea5e9",
          foreground: "#ffffff",
        },
      },
      container: {
        center: true,
        padding: "2rem",
      },
    },
  },
  plugins: [],
}
export default config
