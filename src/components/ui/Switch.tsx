'use client';

import { forwardRef } from 'react';

type Props = {
	checked: boolean;
	onChange: (checked: boolean) => void;
	disabled?: boolean;
	'aria-label'?: string;
	className?: string;
};

export const Switch = forwardRef<HTMLButtonElement, Props>(
	({ checked, onChange, disabled = false, 'aria-label': ariaLabel, className = '' }, ref) => {
		return (
			<button
				ref={ref}
				type='button'
				role='switch'
				aria-checked={checked}
				aria-label={ariaLabel}
				disabled={disabled}
				onClick={() => onChange(!checked)}
				className={`
					relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full
					transition-colors duration-200 ease-out
					focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
					disabled:cursor-not-allowed disabled:opacity-50
					${checked ? 'bg-secondary' : 'bg-grey-medium'}
					${className}
				`.trim()}
			>
				<span
					className={`
						pointer-events-none absolute top-0.5 h-6 w-6 rounded-full
						bg-white shadow-[0_1px_3px_rgba(0,0,0,0.3)]
						transition-transform duration-200 ease-out
						${checked ? 'left-6 translate-x-0' : 'left-0.5 translate-x-0'}
					`.trim()}
					aria-hidden
				/>
			</button>
		);
	},
);

Switch.displayName = 'Switch';
