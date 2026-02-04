'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';

type Props = {
	open: boolean;
	onClose: () => void;
	isHome?: boolean;
};

type SearchResult = {
	idMeal: string;
	strMeal: string;
	strMealThumb: string;
};

const MIN_CHARS = 3;
const DEBOUNCE_MS = 280;

function SearchIcon({ className }: { className?: string }) {
	return (
		<svg
			xmlns='http://www.w3.org/2000/svg'
			viewBox='0 0 24 24'
			fill='none'
			stroke='currentColor'
			strokeWidth='2'
			strokeLinecap='round'
			strokeLinejoin='round'
			className={className}
			aria-hidden
		>
			<circle cx='11' cy='11' r='8' />
			<path d='m21 21-4.35-4.35' />
		</svg>
	);
}

function CloseIcon({ className }: { className?: string }) {
	return (
		<svg
			xmlns='http://www.w3.org/2000/svg'
			viewBox='0 0 24 24'
			fill='none'
			stroke='currentColor'
			strokeWidth='2'
			strokeLinecap='round'
			strokeLinejoin='round'
			className={className}
			aria-hidden
		>
			<path d='M18 6 6 18' />
			<path d='m6 6 12 12' />
		</svg>
	);
}

export function SearchBox({ open, onClose, isHome = false }: Props) {
	const inputRef = useRef<HTMLInputElement>(null);
	const [query, setQuery] = useState('');
	const [results, setResults] = useState<SearchResult[]>([]);
	const [loading, setLoading] = useState(false);
	const [searched, setSearched] = useState(false);
	const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	const fetchResults = useCallback(async (q: string) => {
		const trimmed = q.trim();
		if (trimmed.length < MIN_CHARS) {
			setResults([]);
			setSearched(false);
			return;
		}
		setLoading(true);
		setSearched(true);
		try {
			const res = await fetch(`/api/search?q=${encodeURIComponent(trimmed)}`);
			const data = (await res.json()) as SearchResult[];
			setResults(Array.isArray(data) ? data : []);
		} catch {
			setResults([]);
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		if (!open) return;
		inputRef.current?.focus();
		setQuery('');
		setResults([]);
		setSearched(false);
	}, [open]);

	useEffect(() => {
		if (!open) return;
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === 'Escape') onClose();
		};
		window.addEventListener('keydown', handleKeyDown);
		return () => window.removeEventListener('keydown', handleKeyDown);
	}, [open, onClose]);

	useEffect(() => {
		if (debounceRef.current) clearTimeout(debounceRef.current);
		if (query.trim().length < MIN_CHARS) {
			setResults([]);
			setSearched(false);
			return;
		}
		debounceRef.current = setTimeout(() => {
			fetchResults(query);
		}, DEBOUNCE_MS);
		return () => {
			if (debounceRef.current) clearTimeout(debounceRef.current);
		};
	}, [query, fetchResults]);

	const showPanel = query.trim().length >= MIN_CHARS;
	const panelContent =
		loading && results.length === 0 ? 'loading' : searched && results.length === 0 ? 'empty' : 'results';

	if (!open) return null;

	const overlayClass = 'fixed inset-0 z-40 bg-black/10 backdrop-blur-md cursor-default';
	const inputClass = `flex-1 min-w-0 bg-transparent text-base outline-none border-none [&::-webkit-search-cancel-button]:hidden [&::-webkit-search-decoration]:hidden ${
		isHome ? 'text-white placeholder:text-white/70' : 'text-grey-dark placeholder:text-grey-medium'
	}`;
	const boxClass = `flex items-center gap-3 rounded-2xl backdrop-blur-xl shadow-lg px-4 py-3 ${
		isHome ? 'bg-white/20 ring-1 ring-white/25' : 'bg-white/25 ring-1 ring-white/30'
	}`;

	const searchContent = (
		<>
			<button type='button' className={overlayClass} onClick={onClose} aria-label='Close search' tabIndex={-1} />
			<div
				className='fixed left-0 right-0 top-16 z-50 px-4 pt-3 pb-4 md:px-16 inset-x-0 bottom-0'
				role='dialog'
				aria-label='Search'
				onClick={onClose}
			>
				<div className='mx-auto max-w-5xl' onClick={(e) => e.stopPropagation()} role='presentation'>
					<form action='/search' method='get' className='space-y-2'>
						<div className={boxClass}>
							<span
								className={`flex-shrink-0 ${isHome ? 'text-white/80' : 'text-grey-dark/70'}`}
								aria-hidden
							>
								<SearchIcon className='w-5 h-5' />
							</span>
							<input
								ref={inputRef}
								type='search'
								name='q'
								value={query}
								onChange={(e) => setQuery(e.target.value)}
								placeholder='Search recipes...'
								autoComplete='off'
								className={inputClass}
								aria-label='Search recipes'
								aria-controls='search-results'
								aria-autocomplete='list'
							/>
							<button
								type='button'
								onClick={() => setQuery('')}
								className={`flex-shrink-0 p-1 rounded-full hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-offset-transparent ${
									isHome ? 'text-secondary focus:ring-secondary' : 'text-primary focus:ring-primary'
								}`}
								aria-label='Clear search'
							>
								<CloseIcon className='w-5 h-5' />
							</button>
						</div>

						{showPanel && (
							<div
								id='search-results'
								role='listbox'
								className='rounded-2xl shadow-xl overflow-hidden max-h-[min(70vh,420px)] overflow-y-auto bg-white/95 backdrop-blur-xl ring-1 ring-white/40'
							>
								{panelContent === 'loading' && (
									<div className='px-4 py-6 text-center text-sm text-grey-dark'>Searching...</div>
								)}
								{panelContent === 'empty' && (
									<div className='px-4 py-6 text-center text-sm text-grey-dark'>
										No recipes found with that name
									</div>
								)}
								{panelContent === 'results' && (
									<ul className='py-2'>
										{results.map((meal) => (
											<li key={meal.idMeal}>
												<Link
													href={`/meal/${meal.idMeal}`}
													onClick={onClose}
													className='block px-4 py-3 transition text-grey-dark hover:bg-white/60 font-medium truncate'
												>
													{meal.strMeal}
												</Link>
											</li>
										))}
									</ul>
								)}
							</div>
						)}
					</form>
				</div>
			</div>
		</>
	);

	if (typeof document === 'undefined') return null;
	return createPortal(searchContent, document.body);
}
