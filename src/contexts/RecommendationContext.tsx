'use client';

import { createContext, useCallback, useContext, useState, type ReactNode } from 'react';
import { RecommendationDrawer } from '@/components/recommendation/RecommendationDrawer';

export type RecommendationParams = { area: string; category: string };

type RecommendationContextValue = {
	openRecommendation: (params?: RecommendationParams) => void;
	closeRecommendation: () => void;
};

const RecommendationContext = createContext<RecommendationContextValue | null>(null);

type RecommendationProviderProps = {
	children: ReactNode;
};

export function RecommendationProvider({ children }: RecommendationProviderProps) {
	const [isOpen, setIsOpen] = useState(false);
	const [params, setParams] = useState<RecommendationParams | null>(null);

	const openRecommendation = useCallback((nextParams?: RecommendationParams) => {
		setParams(nextParams ?? null);
		setIsOpen(true);
	}, []);

	const closeRecommendation = useCallback(() => {
		setIsOpen(false);
		setParams(null);
	}, []);

	return (
		<RecommendationContext.Provider value={{ openRecommendation, closeRecommendation }}>
			{children}
			<RecommendationDrawer
				open={isOpen}
				onClose={closeRecommendation}
				params={params}
			/>
		</RecommendationContext.Provider>
	);
}

export function useRecommendation(): RecommendationContextValue {
	const ctx = useContext(RecommendationContext);
	if (ctx === null) throw new Error('useRecommendation must be used within RecommendationProvider');
	return ctx;
}
