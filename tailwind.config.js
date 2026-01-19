/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./src/app/**/*.{js,ts,jsx,tsx}', './src/components/**/*.{js,ts,jsx,tsx}'],
	theme: {
		extend: {
			colors: {
				primary: 'rgb(var(--color-primary) / <alpha-value>)',
				secondary: 'rgb(var(--color-secondary) / <alpha-value>)',

				accent: 'rgb(var(--color-accent) / <alpha-value>)',
				'accent-light': 'rgb(var(--color-accent-light) / <alpha-value>)',

				warning: 'rgb(var(--color-warning) / <alpha-value>)',
				'warning-light': 'rgb(var(--color-warning-light) / <alpha-value>)',

				success: 'rgb(var(--color-success) / <alpha-value>)',
				'success-light': 'rgb(var(--color-success-light) / <alpha-value>)',

				error: 'rgb(var(--color-error) / <alpha-value>)',
				'error-light': 'rgb(var(--color-error-light) / <alpha-value>)',

				grey: {
					light: 'rgb(var(--color-grey-light) / <alpha-value>)',
					medium: 'rgb(var(--color-grey-medium) / <alpha-value>)',
					dark: 'rgb(var(--color-grey-dark) / <alpha-value>)',
				},

				black: 'rgb(var(--color-black) / <alpha-value>)',
			},
		},
	},
	plugins: [],
};
