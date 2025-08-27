// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  // Add the safelist section. This is the key.
  safelist: [
    // Safelist entire patterns (This is the nuclear option)
    // WARNING: This will make your CSS file very large.
    {
      pattern: /(bg|text|border|rounded|p|m|w|h|flex|justify|items|gap)-./,
      variants: ["hover", "focus", "sm", "md", "lg"], // Include responsive variants
    },
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
