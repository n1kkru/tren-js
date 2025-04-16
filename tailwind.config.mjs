import plugin from 'tailwindcss/plugin'

const rem = px => `${px / 16}rem`

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      transitionTimingFunction: {
        DEFAULT: 'cubic-bezier(0.33, 1, 0.68, 1)'
      },
      transitionDuration: {
        DEFAULT: '0.4s'
      },
      colors: {
        transparent: 'transparent',
        primary: '#000000',
        secondary: {
          dark: '#7A7A7A',
          DEFAULT: '#9A9A9A',
          light: '#D5D0C4'
        },
        white: '#FFFFFF',
        green: {
          DEFAULT: '#C4DB82',
          light: '#F4EDD0'
        },
        orange: '#FFBE78',
        red: '#DA2434',
        gray: {
          DEFAULT: '#262626',
          primary: '#D7CBD6',
          light: '#E4E4E4',
          extraLight: '#e5e5e5'
        },
        pastel: {
          blue: '#C8F4F6',
          green: '#C8F6C8'
        }
      },
      fontFamily: {
        sans: ['SuisseIntl', 'sans-serif']
      },
      fontSize: {
        'title-100': [
          '6.25rem',
          {
            fontWeight: 600,
            lineHeight: '100%',
            letterSpacing: '-0.04em'
          }
        ],
        'title-72': [
          '4.5rem',
          {
            fontWeight: 600,
            lineHeight: '100%',
            letterSpacing: '-0.04em'
          }
        ],
        'title-40': [
          '2.5rem',
          {
            fontWeight: 600,
            lineHeight: '100%',
            letterSpacing: '-0.03em'
          }
        ],
        'title-32': [
          '2rem',
          {
            fontWeight: 600,
            lineHeight: '120%',
            letterSpacing: '-0.02em'
          }
        ],
        'title-24': [
          '24px',
          {
            fontWeight: 600,
            lineHeight: '100%',
            letterSpacing: '-0.03em'
          }
        ],
        'title-20': [
          '20px',
          {
            fontWeight: 600,
            lineHeight: '150%',
            letterSpacing: '-0.01em'
          }
        ],
        'title-18': [
          '18px',
          {
            fontWeight: 600,
            lineHeight: '150%',
            letterSpacing: '-0.01em'
          }
        ],
        'title-16': [
          '16px',
          {
            fontWeight: 600,
            lineHeight: '150%',
            letterSpacing: '-0.01em'
          }
        ],
        'title-14': [
          '14px',
          {
            fontWeight: 600,
            lineHeight: '150%',
            letterSpacing: '0em'
          }
        ],
        24: [
          '24px',
          {
            fontWeight: 300,
            lineHeight: '150%',
            letterSpacing: '-0.01em'
          }
        ],
        20: [
          '20px',
          {
            fontWeight: 300,
            lineHeight: '150%',
            letterSpacing: '-0.01em'
          }
        ],
        16: [
          '16px',
          {
            fontWeight: 300,
            lineHeight: '150%',
            letterSpacing: '-0.01em'
          }
        ],
        14: [
          '14px',
          {
            fontWeight: 300,
            lineHeight: '150%',
            letterSpacing: '-0.01em'
          }
        ],
        12: [
          '12px',
          {
            fontWeight: 300,
            lineHeight: '150%',
            letterSpacing: '0'
          }
        ]
      },
      screens: {
        desktop: { min: '1201px' },
        devices: { max: '1200px' },
        tablet: { max: '1200px', min: '769px' },
        mobile: { max: '768px' }
      }
    }
  },
  plugins: [
    plugin(function ({ theme, addUtilities }) {
      const screens = theme('screens')

      const newUtilities = {
        '.desktop': {
          [`@media (max-width: ${screens.tablet.max})`]: {
            display: 'none !important'
          }
        },
        '.mobile': {
          [`@media (min-width: ${screens.tablet.min})`]: {
            display: 'none !important'
          }
        },
        '.tablet': {
          [`@media (min-width: ${screens.desktop.min})`]: {
            display: 'none !important'
          },
          [`@media (max-width: ${screens.mobile.max})`]: {
            display: 'none !important'
          }
        },
        '.devices': {
          [`@media (min-width: ${screens.desktop.min})`]: {
            display: 'none !important'
          }
        }
      }

      addUtilities(newUtilities, ['responsive'])
    })
  ]
}
