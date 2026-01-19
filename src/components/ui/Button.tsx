import clsx from 'clsx';
import { ButtonHTMLAttributes } from 'react';

type Variant = 'filled' | 'outline' | 'ghost';
type Color = 'primary' | 'secondary' | 'accent';

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
	variant?: Variant;
	color?: Color;
};

export function Button({ variant = 'filled', color = 'primary', className, ...props }: Props) {
	const baseStyles =
		'inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';
	const variantStyles = {
		filled: '',
		outline: 'bg-transparent border',
		ghost: 'bg-transparent',
	};
	const colorStyles = {
		primary: {
			filled: 'bg-primary text-white hover:bg-primary/90 focus:ring-primary',
			outline: 'border-primary text-primary hover:bg-primary/10 focus:ring-primary',
			ghost: 'text-primary hover:bg-primary/10 focus:ring-primary',
		},
		secondary: {
			filled: 'bg-secondary text-grey-dark hover:bg-secondary/90 focus:ring-secondary',
			outline: 'border-secondary text-grey-dark hover:bg-secondary/20 focus:ring-secondary',
			ghost: 'text-grey-dark hover:bg-secondary/20 focus:ring-secondary',
		},
		accent: {
			filled: 'bg-accent text-white hover:bg-accent/90 focus:ring-accent',
			outline: 'border-accent text-accent hover:bg-accent/10 focus:ring-accent',
			ghost: 'text-accent hover:bg-accent/10 focus:ring-accent',
		},
	};

	return (
		<button
			className={clsx(baseStyles, variantStyles[variant], colorStyles[color][variant], className)}
			{...props}
		/>
	);
}
