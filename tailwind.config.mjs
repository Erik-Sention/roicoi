/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        // Här kan du lägga till anpassade färger
        "custom-blue": "#1e40af",
        "custom-green": "#15803d",
      },
      fontFamily: {
        // Anpassade typsnitt
        sans: ["Inter", "sans-serif"],
      },
      spacing: {
        // Anpassade avstånd
        "72": "18rem",
        "84": "21rem",
        "96": "24rem",
      },
      borderRadius: {
        // Anpassade hörnradier
        "4xl": "2rem",
      },
    },
  },
  plugins: [
    // Använd import istället för require
    // Notera: Detta kan behöva ändras beroende på hur din build-process är konfigurerad
  ],
} 