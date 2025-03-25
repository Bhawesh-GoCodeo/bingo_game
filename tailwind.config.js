/** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        colors: {
          primary: "#4F46E5",
          secondary: "#10B981",
          accent: "#F59E0B",
          background: "#F9FAFB",
          text: "#1F2937",
        },
        fontFamily: {
          sans: ['Inter', 'sans-serif'],
          heading: ['Poppins', 'sans-serif'],
        },
        animation: {
          'bounce-slow': 'bounce 3s infinite',
          'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        },
        screens: {
          'xs': '475px',
        },
      },
    },
    plugins: [],
  }