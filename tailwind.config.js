/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#6366F1', // Indigo 500
          light: '#818CF8',   // Indigo 400
          dark: '#4F46E5',    // Indigo 600
        },
        secondary: {
          DEFAULT: '#10B981', // Emerald 500
          light: '#34D399',   // Emerald 400
          dark: '#059669',    // Emerald 600
        },
        accent: {
          DEFAULT: '#F59E0B', // Amber 500
          light: '#FBBF24',   // Amber 400
          dark: '#D97706',    // Amber 600
        },
        background: '#F8F9FA',
        surface: '#FFFFFF',
        danger: '#EF4444',
        success: '#22C55E',
      }
    }
  },
  plugins: [],
};
