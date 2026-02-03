'use client';

import { useEffect } from 'react';
import { useRecipeHistory } from '@/contexts/RecipeHistoryContext';

type Props = { idMeal: string; strMeal: string };

export function RecipeViewTracker({ idMeal, strMeal }: Props) {
	const { addToHistory } = useRecipeHistory();

	useEffect(() => {
		addToHistory({ idMeal, strMeal });
	}, [idMeal, strMeal, addToHistory]);

	return null;
}
