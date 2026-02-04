type CloseIconProps = {
	className?: string;
	size?: number;
};

export function CloseIcon({ className, size }: CloseIconProps) {
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
			<path d="M18 6 6 18" />
			<path d="m6 6 12 12" />
		</svg>
	);
}

