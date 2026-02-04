type SearchIconProps = {
	className?: string;
	size?: number;
};

export function SearchIcon({ className, size }: SearchIconProps) {
	const dimensionProps = size ? { width: size, height: size } : {};

	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
			className={className}
			aria-hidden
			{...dimensionProps}
		>
			<circle cx="11" cy="11" r="8" />
			<path d="m21 21-4.35-4.35" />
		</svg>
	);
}

