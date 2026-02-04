'use client';

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
import { RECIPE_HISTORY_LOCAL_STORAGE_KEY, MAX_RECIPE_HISTORY_ENTRIES } from '@/constants/storageKeys';

export type RecipeHistoryEntry = { idMeal: string; strMeal: string };

function getStoredHistory(): RecipeHistoryEntry[] {
	if (typeof window === 'undefined') return [];
	try {
		const raw = localStorage.getItem(RECIPE_HISTORY_LOCAL_STORAGE_KEY);
		if (raw === null) return [];
		const parsed = JSON.parse(raw) as unknown;
		if (!Array.isArray(parsed)) return [];
		return parsed
			.filter(
				(x): x is RecipeHistoryEntry => typeof x === 'object' && x !== null && 'idMeal' in x && 'strMeal' in x,
			)
			.slice(0, MAX_RECIPE_HISTORY_ENTRIES);
	} catch {
		return [];
	}
}

function setStoredHistory(entries: RecipeHistoryEntry[]): void {
	try {
		localStorage.setItem(
			RECIPE_HISTORY_LOCAL_STORAGE_KEY,
			JSON.stringify(entries.slice(0, MAX_RECIPE_HISTORY_ENTRIES)),
		);
	} catch {
		console.log('log error');
	}
}

type RecipeHistoryContextValue = {
	history: RecipeHistoryEntry[];
	addToHistory: (entry: RecipeHistoryEntry) => void;
};

const RecipeHistoryContext = createContext<RecipeHistoryContextValue | null>(null);

export function RecipeHistoryProvider({ children }: { children: ReactNode }) {
	const [history, setHistory] = useState<RecipeHistoryEntry[]>([]);

	useEffect(() => {
		let cancelled = false;

		const init = async () => {
			if (cancelled) return;
			const stored = getStoredHistory();
			if (cancelled) return;
			setHistory(stored);
		};

		void init();

		return () => {
			cancelled = true;
		};
	}, []);

	const addToHistory = useCallback((entry: RecipeHistoryEntry) => {
		setHistory((prev) => {
			const next = [entry, ...prev.filter((e) => e.idMeal !== entry.idMeal)].slice(
				0,
				MAX_RECIPE_HISTORY_ENTRIES,
			);
			setStoredHistory(next);
			return next;
		});
	}, []);

	return <RecipeHistoryContext.Provider value={{ history, addToHistory }}>{children}</RecipeHistoryContext.Provider>;
}

export function useRecipeHistory(): RecipeHistoryContextValue {
	const ctx = useContext(RecipeHistoryContext);
	if (ctx === null) throw new Error('useRecipeHistory must be used within RecipeHistoryProvider');
	return ctx;
}
