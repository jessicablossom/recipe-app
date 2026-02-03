'use client';

import { createContext, useContext, useState, type ReactNode } from 'react';

type SearchContextValue = {
	searchOpen: boolean;
	setSearchOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const SearchContext = createContext<SearchContextValue | null>(null);

export function SearchProvider({ children }: { children: ReactNode }) {
	const [searchOpen, setSearchOpen] = useState(false);
	return (
		<SearchContext.Provider value={{ searchOpen, setSearchOpen }}>
			{children}
		</SearchContext.Provider>
	);
}

export function useSearch(): SearchContextValue {
	const ctx = useContext(SearchContext);
	if (ctx === null) throw new Error('useSearch must be used within SearchProvider');
	return ctx;
}
