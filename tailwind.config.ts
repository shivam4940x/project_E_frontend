import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        dullBlack: "var(--color-dull-black)",
        paperBlack: "var(--color-paper-black)",
        softRed: "var(--color-soft-red)",
        softBlue: "var(--color-soft-blue)",
        lightBlue: "var(--color-light-blue)",
        darkBlue: "var(--color-dark-blue)",
        deepBlue: "var(--color-deep-blue)",
        wineRed: "var(--color-wine-red)",
        lightRed: "var(--color-light-red)",
        whiteL: "var(--color-white)",
      },
      fontFamily: {
        BeVietnamPro: "var(--font-BeVietnamPro)",
        Poppins: "var(--font-Poppins)",
        Sentient: "var(--font-Sentient)",
      },
    },
  },
  plugins: [],
};

export default config;
