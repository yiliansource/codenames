module.exports = {
  purge: {
    content: [
      "./dist/**/*.ejs",
      "./dist/**/*.js",
      "./src/**/*.tsx"
    ]
  },
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
