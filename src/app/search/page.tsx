import { notFound } from 'next/navigation';
import Image from 'next/image';
import { CategoryMealsGrid } from '@/components/category/CategoryMealsGrid';
import { searchMealsByName } from '@/services/meals';

type Props = {
	searchParams: Promise<{ q?: string }>;
};

const glassTitle =
	'inline-flex w-fit items-center rounded-full bg-white/20 backdrop-blur-md ring-1 ring-white/30 px-4 py-2 text-grey-dark';

export default async function SearchPage({ searchParams }: Props) {
	const { q } = await searchParams;
	const query = (q ?? '').trim();

	if (!query) {
		return (
			<div className='relative flex min-h-screen flex-col'>
				<div className='absolute inset-0 overflow-hidden'>
					<Image
						src='/assets/hero-image.jpg'
						alt=''
						fill
						className='object-cover blur-xl scale-105'
						sizes='100vw'
						priority={false}
					/>
					<div className='absolute inset-0 bg-grey-light/50' aria-hidden />
					<div
						className='absolute inset-0 bg-gradient-to-t from-black/15 via-transparent to-transparent'
						aria-hidden
					/>
				</div>
				<main className='relative flex flex-col flex-1 gap-6 w-full max-w-5xl mx-auto px-4 py-8 md:px-16'>
					<h1 className={`text-3xl font-bold ${glassTitle}`}>Search recipes</h1>
					<p className='text-grey-dark/90'>Use the search box in the menu and type the name of a recipe.</p>
				</main>
			</div>
		);
	}

	let meals;
	try {
		meals = await searchMealsByName(query);
	} catch {
		notFound();
	}

	return (
		<div className='relative flex min-h-screen flex-col'>
			<div className='absolute inset-0 overflow-hidden'>
				<Image
					src='/assets/hero-image.jpg'
					alt=''
					fill
					className='object-cover blur-xl scale-105'
					sizes='100vw'
					priority={false}
				/>
				<div className='absolute inset-0 bg-grey-light/50' aria-hidden />
				<div
					className='absolute inset-0 bg-gradient-to-t from-black/15 via-transparent to-transparent'
					aria-hidden
				/>
			</div>
			<main className='relative flex flex-col flex-1 gap-6 w-full max-w-5xl mx-auto px-4 py-8 md:px-16'>
				<h1 className={`text-3xl font-bold ${glassTitle}`}>
					Results for &quot;{query}&quot;
				</h1>
				{meals.length === 0 ? (
					<p className='text-grey-dark/90'>No recipes found with that name.</p>
				) : (
					<CategoryMealsGrid meals={meals} />
				)}
			</main>
		</div>
	);
}
