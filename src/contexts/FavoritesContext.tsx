'use client';

import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useState,
	type ReactNode,
} from 'react';

const FAVORITES_KEY = 'recipe-app:favorites';

function getStoredFavorites(): string[] {
	if (typeof window === 'undefined') return [];
	try {
		const raw = localStorage.getItem(FAVORITES_KEY);
		if (raw === null) return [];
		const parsed = JSON.parse(raw) as unknown;
		return Array.isArray(parsed) ? parsed.filter((x): x is string => typeof x === 'string') : [];
	} catch {
		return [];
	}
}

function setStoredFavorites(ids: string[]): void {
	try {
		localStorage.setItem(FAVORITES_KEY, JSON.stringify(ids));
	} catch {
		// ignore
	}
}

type FavoritesContextValue = {
	favorites: string[];
	isFavorite: (id: string) => boolean;
	toggleFavorite: (id: string) => void;
};

const FavoritesContext = createContext<FavoritesContextValue | null>(null);

export function FavoritesProvider({ children }: { children: ReactNode }) {
	const [favorites, setFavorites] = useState<string[]>([]);
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setFavorites(getStoredFavorites());
		setMounted(true);
	}, []);

	const isFavorite = useCallback((id: string) => favorites.includes(id), [favorites]);

	const toggleFavorite = useCallback(
		(id: string) => {
			setFavorites((prev) => {
				const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
				if (mounted) setStoredFavorites(next);
				return next;
			});
		},
		[mounted],
	);

	const value: FavoritesContextValue = {
		favorites,
		isFavorite,
		toggleFavorite,
	};

	return (
		<FavoritesContext.Provider value={value}>
			{children}
		</FavoritesContext.Provider>
	);
}

export function useFavorites(): FavoritesContextValue {
	const ctx = useContext(FavoritesContext);
	if (ctx === null) {
		throw new Error('useFavorites must be used within FavoritesProvider');
	}
	return ctx;
}
