/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./app/**/*.{js,jsx,ts,tsx}","./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      fontFamily: {
        rubik: ["Rubik-Regular", "sans-serif"],
        "rubik-bold": ["Rubik-Bold", "sans-serif"],
        "rubik-medium": ["Rubik-Medium", "sans-serif"],
        "rubik-light": ["Rubik-Light", "sans-serif"],
        "rubik-semibold": ["Rubik-SemiBold", "sans-serif"],
        "rubik-extrabold": ["Rubik-ExtraBold", "sans-serif"],
      },
      colors:{
        "primary" : {
          100: "#531A080A",
          200: "#531A081A",
          300: "#531A08",
        },
        accent:{
          100: "#FBFBFD",
        },
        black:{
          DEFAULT: "#000000",
          100: "#8C8E98",
          200: "#666876",
          300: "#191d31",
        },
        danger: '#F75555'
      }
    },
  },
  plugins: [],
}