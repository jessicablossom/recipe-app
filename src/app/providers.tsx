'use client';

import { FavoritesProvider } from '@/contexts/FavoritesContext';
import { RecipeHistoryProvider } from '@/contexts/RecipeHistoryContext';
import { RecommendationFeedbackProvider } from '@/contexts/RecommendationFeedbackContext';
import { RecommendationProvider } from '@/contexts/RecommendationContext';
import { SearchProvider } from '@/contexts/SearchContext';
import { StoreProvider } from '@/store/StoreProvider';

type Props = {
	children: React.ReactNode;
};

export function Providers({ children }: Props) {
	return (
		<StoreProvider>
			<FavoritesProvider>
				<SearchProvider>
					<RecipeHistoryProvider>
						<RecommendationFeedbackProvider>
							<RecommendationProvider>{children}</RecommendationProvider>
						</RecommendationFeedbackProvider>
					</RecipeHistoryProvider>
				</SearchProvider>
			</FavoritesProvider>
		</StoreProvider>
	);
}
