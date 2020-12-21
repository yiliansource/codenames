module.exports = {
  purge: {
    // Tailwind will automatically purge when NODE_ENV is set to 'production'.
    content: [
      "./src/**/*.ejs",
      "./src/**/*.{tsx,ts}"
    ]
  }
}
