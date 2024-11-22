import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#ecbd0d",
        secondary: "#010101",
        teritiary: "#f7e18e",
        grey: "#23272e",
        light: "#fffff0",
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
export default config;
