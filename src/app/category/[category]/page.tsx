import { Card } from '@/components/Card';
import { getMealsByCategory } from '@/services/meals';
import Link from 'next/link';

type Props = {
	params: Promise<{
		category: string;
	}>;
};

export default async function CategoryPage({ params }: Props) {
	const { category } = await params;
	const decodedCategory = decodeURIComponent(category);

	const meals = await getMealsByCategory(decodedCategory);

	return (
		<div className='flex min-h-screen flex-col'>
			<main className='flex flex-col flex-1 gap-4 w-full max-w-5xl mx-auto px-4 py-8 md:px-16'>
				<h1 className='text-3xl font-bold text-grey-dark'> Categoría: {decodedCategory}</h1>
				<div className='w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
					{meals.map((meal) => (
						<Link key={meal.idMeal} href={`/meal/${meal.idMeal}`}>
							<Card key={meal.idMeal} title={meal.strMeal} image={meal.strMealThumb} fit='cover' />
						</Link>
					))}
				</div>
			</main>
		</div>
	);
}
