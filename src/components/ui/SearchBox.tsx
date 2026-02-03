'use client';

import { useEffect, useRef } from 'react';

type Props = {
	open: boolean;
	onClose: () => void;
	/** Cuando true (home), texto e icono en blanco para contraste sobre fondo oscuro */
	isHome?: boolean;
};

function SearchIcon({ className }: { className?: string }) {
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
		>
			<circle cx="11" cy="11" r="8" />
			<path d="m21 21-4.35-4.35" />
		</svg>
	);
}

function CloseIcon({ className }: { className?: string }) {
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
		>
			<path d="M18 6 6 18" />
			<path d="m6 6 12 12" />
		</svg>
	);
}

export function SearchBox({ open, onClose, isHome = false }: Props) {
	const inputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		if (open) {
			inputRef.current?.focus();
		}
	}, [open]);

	useEffect(() => {
		if (!open) return;
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === 'Escape') onClose();
		};
		window.addEventListener('keydown', handleKeyDown);
		return () => window.removeEventListener('keydown', handleKeyDown);
	}, [open, onClose]);

	if (!open) return null;

	return (
		<div
			className="absolute left-0 right-0 top-full z-40 px-4 pt-3 pb-4 md:px-16"
			role="dialog"
			aria-label="Buscar"
		>
			<div className="mx-auto max-w-5xl">
				<div
					className={`flex items-center gap-3 rounded-2xl backdrop-blur-xl shadow-lg px-4 py-3 ${
						isHome
							? 'bg-white/20 ring-1 ring-white/25'
							: 'bg-white/25 ring-1 ring-white/30'
					}`}
				>
					<span
						className={`flex-shrink-0 ${isHome ? 'text-white/80' : 'text-grey-dark/70'}`}
						aria-hidden
					>
						<SearchIcon className="w-5 h-5" />
					</span>
					<input
						ref={inputRef}
						type="search"
						placeholder="Buscar recetas..."
						className={`flex-1 min-w-0 bg-transparent text-base outline-none border-none ${
							isHome
								? 'text-white placeholder:text-white/70'
								: 'text-grey-dark placeholder:text-grey-medium'
						}`}
						aria-label="Buscar recetas"
					/>
					<button
						type="button"
						onClick={onClose}
						className={`flex-shrink-0 p-1 rounded-full hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-offset-transparent ${
							isHome ? 'text-secondary focus:ring-secondary' : 'text-primary focus:ring-primary'
						}`}
						aria-label="Cerrar búsqueda"
					>
						<CloseIcon className="w-5 h-5" />
					</button>
				</div>
			</div>
		</div>
	);
}
