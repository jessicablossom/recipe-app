import { notFound } from 'next/navigation';
import Image from 'next/image';
import { CategoryMealsGrid } from '@/components/category/CategoryMealsGrid';
import { getCategories, getMealsByCategory } from '@/services/meals';

type Props = {
	params: Promise<{
		category: string;
	}>;
};

export default async function CategoryPage({ params }: Props) {
	const { category } = await params;
	const decodedCategory = decodeURIComponent(category);

	const [categories, meals] = await Promise.all([
		getCategories(),
		getMealsByCategory(decodedCategory),
	]);

	const categoryExists = categories.some(
		(c) => c.strCategory.toLowerCase() === decodedCategory.toLowerCase(),
	);
	if (!categoryExists) notFound();

	const glassTitle =
		'inline-flex w-fit items-center rounded-full bg-white/20 backdrop-blur-md ring-1 ring-white/30 px-4 py-2 text-grey-dark';

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
				<div className='absolute inset-0 bg-grey-light/70' aria-hidden />
			</div>
			<main className='relative flex flex-col flex-1 gap-6 w-full max-w-5xl mx-auto px-4 py-8 md:px-16'>
				<h1 className={`text-3xl font-bold ${glassTitle}`}>{decodedCategory}</h1>
				<CategoryMealsGrid meals={meals} />
			</main>
		</div>
	);
}
