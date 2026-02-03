'use client';

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';

const FEEDBACK_KEY = 'recipe-app:recommendation-feedback';
const SAVE_FEEDBACK_KEY = 'recipe-app:save-feedback';
const MAX_ENTRIES = 50;

function getFeedbackEnabled(): boolean {
	if (typeof window === 'undefined') return true;
	try {
		const raw = localStorage.getItem(SAVE_FEEDBACK_KEY);
		if (raw === null) return true;
		return raw === 'true';
	} catch {
		return true;
	}
}

function persistFeedbackEnabled(value: boolean): void {
	try {
		localStorage.setItem(SAVE_FEEDBACK_KEY, value ? 'true' : 'false');
	} catch {
		console.log('log error');
	}
}

export type RecommendationFeedbackEntry = {
	idMeal: string;
	strMeal: string;
	strMealThumb: string;
	timestamp: number;
	area?: string;
	category?: string;
	matched: boolean;
};

function getStoredFeedback(): RecommendationFeedbackEntry[] {
	if (typeof window === 'undefined') return [];
	try {
		const raw = localStorage.getItem(FEEDBACK_KEY);
		if (raw === null) return [];
		const parsed = JSON.parse(raw) as unknown;
		if (!Array.isArray(parsed)) return [];
		return parsed
			.filter(
				(x): x is RecommendationFeedbackEntry =>
					typeof x === 'object' &&
					x !== null &&
					'idMeal' in x &&
					'strMeal' in x &&
					'strMealThumb' in x &&
					'timestamp' in x &&
					'matched' in x,
			)
			.slice(0, MAX_ENTRIES);
	} catch {
		return [];
	}
}

function setStoredFeedback(entries: RecommendationFeedbackEntry[]): void {
	try {
		localStorage.setItem(FEEDBACK_KEY, JSON.stringify(entries.slice(0, MAX_ENTRIES)));
	} catch {
		console.log('log error');
	}
}

type RecommendationFeedbackContextValue = {
	feedbackList: RecommendationFeedbackEntry[];
	addFeedback: (entry: RecommendationFeedbackEntry) => void;
	feedbackEnabled: boolean;
	setFeedbackEnabled: (value: boolean) => void;
};

const RecommendationFeedbackContext = createContext<RecommendationFeedbackContextValue | null>(null);

export function RecommendationFeedbackProvider({ children }: { children: ReactNode }) {
	const [feedbackList, setFeedbackList] = useState<RecommendationFeedbackEntry[]>([]);
	const [feedbackEnabled, setFeedbackEnabledState] = useState(true);

	useEffect(() => {
		setFeedbackList(getStoredFeedback());
		setFeedbackEnabledState(getFeedbackEnabled());
	}, []);

	const setFeedbackEnabled = useCallback((value: boolean) => {
		setFeedbackEnabledState(value);
		persistFeedbackEnabled(value);
	}, []);

	const addFeedback = useCallback((entry: RecommendationFeedbackEntry) => {
		setFeedbackList((prev) => {
			const next = [entry, ...prev].slice(0, MAX_ENTRIES);
			setStoredFeedback(next);
			return next;
		});
	}, []);

	return (
		<RecommendationFeedbackContext.Provider
			value={{ feedbackList, addFeedback, feedbackEnabled, setFeedbackEnabled }}
		>
			{children}
		</RecommendationFeedbackContext.Provider>
	);
}

export function useRecommendationFeedback(): RecommendationFeedbackContextValue {
	const ctx = useContext(RecommendationFeedbackContext);
	if (ctx === null) throw new Error('useRecommendationFeedback must be used within RecommendationFeedbackProvider');
	return ctx;
}
