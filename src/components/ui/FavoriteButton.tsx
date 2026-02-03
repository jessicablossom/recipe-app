'use client';

import { useFavorites } from '@/contexts/FavoritesContext';

function HeartIcon({ filled }: { filled: boolean }) {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 24 24"
			fill={filled ? 'currentColor' : 'none'}
			stroke={filled ? 'none' : 'currentColor'}
			strokeWidth="1.5"
			strokeLinecap="round"
			strokeLinejoin="round"
			className="w-6 h-6"
			aria-hidden
		>
			<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
		</svg>
	);
}

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
			<HeartIcon filled={favorited} />
		</button>
	);
}
