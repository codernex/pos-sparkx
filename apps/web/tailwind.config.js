module.exports = {
    content: ['./src/**/*.{js,jsx,ts,tsx}'],
    darkMode: 'class',
    theme: {

        fontFamily: {
            century: ['Century Gothic', 'sans-serif'],
            inter:['Inter','sans-serif']
        },
        extend: {
            fontSize: {
                14: '14px'
            },
            colors: {
                "primary-color": "#1878f3",
                primaryColor: {
                    100: "#d1e4fd",
                    200: "#a3c9fa",
                    300: "#74aef8",
                    400: "#4693f5",
                    500: "#1878f3",
                    600: "#1360c2",
                    700: "#0e4892",
                    800: "#0a3061",
                    900: "#051831"
                },

                "light-white": "rgba(255,255,255,0.8)"
            },
            backgroundColor: {
                'main-bg': '#FAFBFB',
                'main-dark-bg': '#20232A',
                'secondary-dark-bg': '#33373E',
                'light-gray': '#F7F7F7',
                'half-transparent': 'rgba(0, 0, 0, 0.5)'
            },
            borderWidth: {
                1: '1px'
            },
            borderColor: {
                color: 'rgba(0, 0, 0, 0.1)'
            },
            width: {
                250: '250px',
                400: '400px',
                760: '760px',
                780: '780px',
                800: '800px',
                1000: '1000px',
                1200: '1200px',
                1400: '1400px'
            },
            height: {
                80: '80px'
            },
            minHeight: {
                590: '590px'
            },
            backgroundImage: {
                'hero-pattern': "url('https://i.ibb.co/MkvLDfb/Rectangle-4389.png')"
            }
        }

    },
    plugins: [require('tailwind-scrollbar-hide'), require('tailwind-scrollbar')({nocompatible: true}),]
};
