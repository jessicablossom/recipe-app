'use client';

import { useFavorites } from '@/contexts/FavoritesContext';
import { HeartIcon } from '@/components/icons/HeartIcon';

type Props = {
	favoriteId: string;
};

export function FavoriteButton({ favoriteId }: Props) {
	const { isFavorite, toggleFavorite } = useFavorites();
	const favorited = isFavorite(favoriteId);

	return (
		<button
			type="button"
			onClick={() => toggleFavorite(favoriteId)}
			className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-all duration-200 bg-white/10 backdrop-blur-sm ring-[1px] ring-white/30 hover:bg-white/20 hover:ring-white/40 focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-white/80 ${favorited ? 'text-accent' : 'text-grey-dark'}`}
			aria-label={favorited ? 'Remove from favorites' : 'Add to favorites'}
		>
			<HeartIcon filled={favorited} className="w-6 h-6" />
		</button>
	);
}
