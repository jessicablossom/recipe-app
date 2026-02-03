'use client';

import { useCallback, useEffect, useState } from 'react';

const STORAGE_PREFIX = 'recipe-app';

function getStoredBoolean(key: string, defaultValue: boolean): boolean {
	if (typeof window === 'undefined') return defaultValue;
	try {
		const raw = localStorage.getItem(`${STORAGE_PREFIX}:${key}`);
		if (raw === null) return defaultValue;
		return raw === 'true';
	} catch {
		return defaultValue;
	}
}

function setStoredBoolean(key: string, value: boolean): void {
	try {
		localStorage.setItem(`${STORAGE_PREFIX}:${key}`, value ? 'true' : 'false');
	} catch {
		console.log('log error');
	}
}

export function usePersistedPreference(key: string, defaultValue: boolean): [boolean, (value: boolean) => void] {
	const [value, setValueState] = useState<boolean>(defaultValue);
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		const stored = getStoredBoolean(key, defaultValue);
		queueMicrotask(() => {
			setValueState(stored);
			setMounted(true);
		});
	}, [key, defaultValue]);

	const setValue = useCallback(
		(newValue: boolean) => {
			setValueState(newValue);
			if (mounted) setStoredBoolean(key, newValue);
		},
		[key, mounted],
	);

	return [value, setValue];
}
