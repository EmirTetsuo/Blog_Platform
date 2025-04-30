/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./src/**/*.{js,jsx,ts,tsx}'],
    theme: {
        extend: {},
        screens: {
            'max-xl': { max: '1440px' },
            'max-lg': { max: '1024px' },
            'max-md': { max: '768px' },
            'max-sm': { max: '480px' },
            'max-xs': { max: '360px' },
        },
    },
    plugins: [],
}
