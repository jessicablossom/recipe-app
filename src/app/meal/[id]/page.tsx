import { notFound } from 'next/navigation';
import Image from 'next/image';
import { getMealById } from '@/services/meals';
import { parseIngredients } from '@/utils/parseIngredients';
import { getMealImageLarge, hasValidRecipeImage } from '@/utils/mealImage';
import { RecipeImage } from '@/components/ui/RecipeImage';
import { FavoriteButton } from '@/components/ui/FavoriteButton';
import { RecipeViewTracker } from '@/components/RecipeViewTracker';

const HERO_BG = '/assets/hero-image.jpg';

type Props = {
	params: Promise<{
		id: string;
	}>;
};

const glassPanel = 'rounded-2xl bg-white/25 ring-1 ring-white/30 shadow-[0_8px_32px_-12px_rgba(0,0,0,0.08)]';
const glassBadge =
	'inline-flex items-center rounded-full bg-white/30 ring-1 ring-white/30 px-3 py-1 text-sm font-medium text-grey-dark';

export default async function MealPage({ params }: Props) {
	const { id } = await params;
	let meal = null;
	try {
		meal = await getMealById(id);
	} catch {
		notFound();
	}

	if (!meal) notFound();

	const ingredients = parseIngredients(meal);
	const imageLarge = getMealImageLarge(meal.strMealThumb);
	const hasRecipeImage = hasValidRecipeImage(meal.strMealThumb);

	const mainImageSrc = hasRecipeImage ? imageLarge : '';

	return (
		<div className='relative flex min-h-screen flex-col'>
			<RecipeViewTracker idMeal={meal.idMeal} strMeal={meal.strMeal} />
			<div className='absolute inset-0 overflow-hidden'>
				{hasRecipeImage ? (
					<RecipeImage
						src={imageLarge}
						alt=''
						className='object-cover blur-lg scale-110'
						sizes='100vw'
						priority
						quality={85}
						roundedClass='rounded-none'
					/>
				) : (
					<Image
						src={HERO_BG}
						alt=''
						fill
						className='object-cover blur-lg scale-110'
						sizes='100vw'
						priority
						quality={85}
					/>
				)}
				<div className='absolute inset-0 bg-grey-light/70' aria-hidden />
			</div>
			<main className='relative flex flex-1 flex-col gap-6 w-full max-w-3xl mx-auto px-4 py-8 md:px-8'>
				<header className={`${glassPanel} p-5 md:p-6`}>
					<div className='flex items-start justify-between gap-4'>
						<div className='min-w-0 flex-1'>
							<h1 className='text-2xl font-bold tracking-tight text-grey-dark md:text-3xl'>
								{meal.strMeal}
							</h1>
							<div className='mt-3 flex flex-wrap gap-2'>
								<span className={glassBadge}>{meal.strCategory}</span>
								<span className={glassBadge}>{meal.strArea}</span>
							</div>
						</div>
						<FavoriteButton favoriteId={`meal:${meal.idMeal}`} />
					</div>
				</header>
				<div
					className={`relative w-full overflow-hidden rounded-2xl ${glassPanel} aspect-[4/3] max-h-[380px] ring-1 ring-white/30`}
				>
					<RecipeImage
						src={mainImageSrc}
						alt={meal.strMeal}
						className='object-cover'
						sizes='(max-width: 768px) 100vw, 672px'
						priority
						quality={90}
						roundedClass='rounded-2xl'
					/>
					<div
						className='absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent'
						aria-hidden
					/>
				</div>

				<section className={`${glassPanel} p-5 md:p-6`}>
					<h2 className='text-lg font-semibold text-grey-dark md:text-xl'>Ingredients</h2>
					<ul className='mt-4 flex flex-wrap gap-2'>
						{ingredients.map((item, index) => (
							<li
								key={`${index}-${item.ingredient}-${item.measure}`}
								className='rounded-xl bg-white/35 px-3 py-2 text-sm text-grey-dark ring-1 ring-white/40'
							>
								<span className='font-medium'>{item.ingredient}</span>
								{item.measure && <span className='ml-1.5 text-grey-medium'>· {item.measure}</span>}
							</li>
						))}
					</ul>
				</section>

				<section className={`${glassPanel} p-5 md:p-6`}>
					<h2 className='text-lg font-semibold text-grey-dark md:text-xl'>Instructions</h2>
					<div className='mt-4 whitespace-pre-wrap rounded-xl bg-white/20 p-4 text-grey-dark leading-relaxed ring-1 ring-white/25 md:p-5'>
						{meal.strInstructions}
					</div>
				</section>
			</main>
		</div>
	);
}
