/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class", //dark mode is applied if <html class="dark">. use dark: modifier for dark mode styling
  //if above is not added, dark: is based on 'prefers-color-scheme'/system preference
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    colors: {
      //brand/primary color
      emerald: {
        light: "#34d399",
        DEFAULT: "#10b981",
        dark: "#059669",
      },
      //accent/error/danger/secondary color
      red: {
        light: "#e43b66",
        DEFAULT: "#de194e",
        dark: "#b91048",
      },
      white: {
        DEFAULT: "#fff",
      },
      //info/blueish
      Sky: {
        light: "#2ab7f6",
        DEFAULT: "#0288d1",
        dark: "#0278bd",
      },
      //success
      green: {
        light: "#4ade80",
        DEFAULT: "#16a34a",
        dark: "#15803d",
      },
      //warning
      orange: {
        light: "#fd9703",
        DEFAULT: "#f37c02",
        dark: "#ed6c02",
      },

      //gray->dark mode bg, text, borders(light mode too)
      gray: {
        light: "#e2e8f0",
        lighter: "#f1f5f9",
        lightest: "#f8fafc",
        muted: "rgb(102, 112, 133)", //muted text + borders in dark mode
        dull: "rgb(242, 244, 247)", //lavender//border light
        disabled: "rgba(0, 0, 0, 0.26)", //disabled state color
        input: "rgba(67,59,54,.9)", //dark mode-input color

        DEFAULT: "#1e1e20", //main

        //dark mode theme 1
        divider: "#667085",//muted in hex
        dark: "#1e1e20", //content box + headers
        darker: "#161618", //screen bg
        darkest: "#000", ///pure black

        //dark mode theme 2
        // divider: "#2c333b"
        // dark: "#1a1d1e", //content box+headers//alt: #202425
        // darker: "#151718", //dark mode app bg //alt:
        // darkest: "#000", //pure black
      },
    },
    extend: {},
  },
  plugins: [],
};
