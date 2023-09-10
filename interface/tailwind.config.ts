import { type Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        QH: "#962d46",
        stiletto: {
          "50": "#fdf3f4",
          "100": "#fae9ea",
          "200": "#f5d6d9",
          "300": "#edb4bb",
          "400": "#e38995",
          "500": "#d45f72",
          "600": "#bf3f5a",
          "700": "#962d46",
          "800": "#862b43",
          "900": "#74273f",
          "950": "#40111e",
        },
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
} satisfies Config;
