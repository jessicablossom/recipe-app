'use client';

import { useFavorites } from '@/contexts/FavoritesContext';
import { RecipeImage } from '@/components/ui/RecipeImage';

type ImageFit = 'contain' | 'cover';

type Props = {
	title: string;
	image: string;
	fit?: ImageFit;
	favoriteId?: string;
	imageGradient?: boolean;
};

const fitClasses: Record<ImageFit, string> = {
	contain: 'object-contain',
	cover: 'object-cover',
};

const glassCard =
	'rounded-2xl bg-white/20 ring-1 ring-white/30 shadow-[0_8px_32px_-12px_rgba(0,0,0,0.12)] aspect-square min-w-[180px] flex flex-col overflow-hidden transition hover:bg-white/25 hover:ring-white/40 hover:shadow-[0_12px_40px_-12px_rgba(0,0,0,0.18)] hover:-translate-y-0.5';

const HeartIcon = ({ filled }: { filled: boolean }) => {
	return (
		<svg
			xmlns='http://www.w3.org/2000/svg'
			viewBox='0 0 24 24'
			fill={filled ? 'currentColor' : 'none'}
			stroke={filled ? 'none' : 'currentColor'}
			strokeWidth='1.5'
			strokeLinecap='round'
			strokeLinejoin='round'
			className='w-5 h-5'
			aria-hidden
		>
			<path d='M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z' />
		</svg>
	);
};

export function Card({ title, image, fit = 'contain', favoriteId, imageGradient = false }: Props) {
	const { isFavorite, toggleFavorite } = useFavorites();
	const favorited = favoriteId != null ? isFavorite(favoriteId) : false;

	const handleHeartClick = (e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();
		if (favoriteId != null) toggleFavorite(favoriteId);
	};

	return (
		<div className={glassCard}>
			<div className='relative flex-1 min-h-0 w-full overflow-hidden rounded-t-2xl'>
				<div className='absolute inset-0 overflow-hidden rounded-t-2xl'>
					<RecipeImage
					src={image}
					alt={title}
					className={fitClasses[fit]}
					sizes='(max-width: 768px) 100vw, 25vw'
					roundedClass='rounded-t-2xl'
				/>
				{imageGradient && (
					<>
						<div className='absolute inset-0 rounded-t-2xl bg-black/5' aria-hidden />
						<div
							className='absolute inset-0 rounded-t-2xl bg-gradient-to-b from-black/0 via-black/5 to-black/25'
							aria-hidden
						/>
					</>
				)}
				{favoriteId != null && (
					<button
						type='button'
						onClick={handleHeartClick}
						className={`absolute top-2 right-2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 backdrop-blur-sm hover:bg-white focus:outline-none focus:ring-2 focus:ring-primary ${favorited ? 'text-accent' : 'text-grey-dark'}`}
						aria-label={favorited ? 'Remove from favorites' : 'Add to favorites'}
					>
						<HeartIcon filled={favorited} />
					</button>
				)}
				</div>
			</div>
			<span
				className='text-base font-medium text-grey-dark tracking-wide truncate p-3 text-center flex-shrink-0'
				title={title}
			>
				{title}
			</span>
		</div>
	);
}
