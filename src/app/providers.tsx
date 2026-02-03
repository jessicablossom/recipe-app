'use client';

import { FavoritesProvider } from '@/contexts/FavoritesContext';
import { SearchProvider } from '@/contexts/SearchContext';
import { StoreProvider } from '@/store/StoreProvider';

type Props = {
	children: React.ReactNode;
};

export function Providers({ children }: Props) {
	return (
		<StoreProvider>
			<FavoritesProvider>
				<SearchProvider>{children}</SearchProvider>
			</FavoritesProvider>
		</StoreProvider>
	);
}
