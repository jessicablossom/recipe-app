'use client';

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
import type { RecommendationFeedbackEntry } from '@/types/recommendation';
import {
	FEEDBACK_LOCAL_STORAGE_KEY,
	SAVE_FEEDBACK_LOCAL_STORAGE_KEY,
	MAX_RECOMMENDATION_FEEDBACK_ENTRIES,
} from '@/constants/storageKeys';

function getFeedbackEnabled(): boolean {
	if (typeof window === 'undefined') return true;
	try {
		const raw = localStorage.getItem(SAVE_FEEDBACK_LOCAL_STORAGE_KEY);
		if (raw === null) return true;
		return raw === 'true';
	} catch {
		return true;
	}
}

function persistFeedbackEnabled(value: boolean): void {
	try {
		localStorage.setItem(SAVE_FEEDBACK_LOCAL_STORAGE_KEY, value ? 'true' : 'false');
	} catch {
		console.log('log error');
	}
}

function getStoredFeedback(): RecommendationFeedbackEntry[] {
	if (typeof window === 'undefined') return [];
	try {
		const raw = localStorage.getItem(FEEDBACK_LOCAL_STORAGE_KEY);
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
			.slice(0, MAX_RECOMMENDATION_FEEDBACK_ENTRIES);
	} catch {
		return [];
	}
}

function setStoredFeedback(entries: RecommendationFeedbackEntry[]): void {
	try {
		localStorage.setItem(
			FEEDBACK_LOCAL_STORAGE_KEY,
			JSON.stringify(entries.slice(0, MAX_RECOMMENDATION_FEEDBACK_ENTRIES)),
		);
	} catch {
		console.log('log error');
	}
}

type RecommendationFeedbackContextValue = {
	feedbackList: RecommendationFeedbackEntry[];
	addFeedback: (entry: RecommendationFeedbackEntry) => void;
	removeFeedback: (idMeal: string, timestamp: number) => void;
	feedbackEnabled: boolean;
	setFeedbackEnabled: (value: boolean) => void;
};

const RecommendationFeedbackContext = createContext<RecommendationFeedbackContextValue | null>(null);

export function RecommendationFeedbackProvider({ children }: { children: ReactNode }) {
	const [feedbackList, setFeedbackList] = useState<RecommendationFeedbackEntry[]>([]);
	const [feedbackEnabled, setFeedbackEnabledState] = useState(true);

	useEffect(() => {
		let cancelled = false;

		const init = async () => {
			if (cancelled) return;
			const storedFeedback = getStoredFeedback();
			const enabled = getFeedbackEnabled();
			if (cancelled) return;
			setFeedbackList(storedFeedback);
			setFeedbackEnabledState(enabled);
		};

		void init();

		return () => {
			cancelled = true;
		};
	}, []);

	const setFeedbackEnabled = useCallback((value: boolean) => {
		setFeedbackEnabledState(value);
		persistFeedbackEnabled(value);
	}, []);

	const addFeedback = useCallback((entry: RecommendationFeedbackEntry) => {
		setFeedbackList((prev) => {
			const filtered = prev.filter((e) => e.idMeal !== entry.idMeal);
			const next = [entry, ...filtered].slice(0, MAX_RECOMMENDATION_FEEDBACK_ENTRIES);
			setStoredFeedback(next);
			return next;
		});
	}, []);

	const removeFeedback = useCallback((idMeal: string, timestamp: number) => {
		setFeedbackList((prev) => {
			const next = prev.filter((entry) => !(entry.idMeal === idMeal && entry.timestamp === timestamp));
			setStoredFeedback(next);
			return next;
		});
	}, []);

	return (
		<RecommendationFeedbackContext.Provider
			value={{ feedbackList, addFeedback, removeFeedback, feedbackEnabled, setFeedbackEnabled }}
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
