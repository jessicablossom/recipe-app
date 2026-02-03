'use client';

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';

const HISTORY_KEY = 'recipe-app:recipe-history';
const MAX_HISTORY = 3;

export type RecipeHistoryEntry = { idMeal: string; strMeal: string };

function getStoredHistory(): RecipeHistoryEntry[] {
	if (typeof window === 'undefined') return [];
	try {
		const raw = localStorage.getItem(HISTORY_KEY);
		if (raw === null) return [];
		const parsed = JSON.parse(raw) as unknown;
		if (!Array.isArray(parsed)) return [];
		return parsed
			.filter(
				(x): x is RecipeHistoryEntry => typeof x === 'object' && x !== null && 'idMeal' in x && 'strMeal' in x,
			)
			.slice(0, MAX_HISTORY);
	} catch {
		return [];
	}
}

function setStoredHistory(entries: RecipeHistoryEntry[]): void {
	try {
		localStorage.setItem(HISTORY_KEY, JSON.stringify(entries.slice(0, MAX_HISTORY)));
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
		setHistory(getStoredHistory());
	}, []);

	const addToHistory = useCallback((entry: RecipeHistoryEntry) => {
		setHistory((prev) => {
			const next = [entry, ...prev.filter((e) => e.idMeal !== entry.idMeal)].slice(0, MAX_HISTORY);
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
