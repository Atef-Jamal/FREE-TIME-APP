import tailwindScrollbar from "tailwind-scrollbar";
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
        roboto: ["Roboto", "sans-serif"],
      },
    },
    screens: {
      xl: { max: "1400px" },
      lg: { max: "1130px" },
      sm: { max: "867px" },
      xs: { max: "500px" },
    },
  },
  plugins: [tailwindScrollbar],
};
