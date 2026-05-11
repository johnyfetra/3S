import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        ink: "#101010",
        amber: {
          50: "#fff8eb",
          100: "#ffedc7",
          300: "#ffc45c",
          500: "#f59e0b",
          700: "#b45309"
        },
        signal: "#ef4444"
      },
      boxShadow: {
        premium: "0 24px 70px rgba(15, 23, 42, 0.14)"
      }
    }
  },
  plugins: []
};

export default config;

