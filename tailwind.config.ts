import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
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
        bg: {
            primary: 'hsl(225, 25%, 6%)',
            secondary: 'hsl(225, 20%, 10%)',
            elevated: 'hsl(225, 18%, 14%)',
            glass: 'hsla(225, 20%, 15%, 0.4)',
        },
        accent: {
            blue: 'hsl(217, 91%, 60%)',
            purple: 'hsl(270, 76%, 62%)',
            emerald: 'hsl(160, 84%, 39%)',
            gold: 'hsl(45, 93%, 58%)',
            crimson: 'hsl(0, 84%, 60%)',
            cyan: 'hsl(190, 95%, 50%)',
        },
        text: {
            primary: 'hsl(0, 0%, 95%)',
            secondary: 'hsl(220, 15%, 65%)',
            muted: 'hsl(220, 10%, 45%)',
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      backgroundImage: {
        'glass-gradient': 'linear-gradient(135deg, hsla(225,20%,15%,0.4) 0%, hsla(225,20%,10%,0.2) 100%)',
      }
    },
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
