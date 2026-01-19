import { getMealById } from '@/services/meals';
import { parseIngredients } from '@/utils/parseIngredients';
import Image from 'next/image';

type Props = {
	params: Promise<{
		id: string;
	}>;
};

export default async function MealPage({ params }: Props) {
	const { id } = await params;
	const meal = await getMealById(id);

	if (!meal) {
		return <div className='p-10'>Receta no encontrada</div>;
	}

	const ingredients = parseIngredients(meal);

	return (
		<div className='flex min-h-screen flex-col'>
			<main className='flex-1 w-full max-w-5xl mx-auto px-4 py-8 md:px-16'>
				{' '}
				<div className='flex flex-col gap-4'>
					<h1 className='text-3xl font-bold text-grey-dark'>{meal.strMeal}</h1>
					<div className='relative w-full max-w-5xl mx-auto h-[360px] overflow-hidden rounded-xl'>
						<Image
							src={meal.strMealThumb}
							alt={meal.strMeal}
							fill
							className='object-cover'
							sizes='(max-width: 1024px) 100vw, 1024px'
							priority
						/>
					</div>
					<span className='text-grey-dark'>
						{meal.strCategory} · {meal.strArea}
					</span>
					<div>
						<h2 className='text-xl font-semibold mb-3'>Ingredientes</h2>

						<div className='flex flex-wrap gap-2'>
							{ingredients.map((item) => (
								<div
									key={item.ingredient}
									className='flex items-center gap-2 p-1 text-sm text-grey-dark'
								>
									<span className='font-medium'>{item.ingredient}</span>
									{item.measure && <span className='text-accent'>({item.measure})</span>}
								</div>
							))}
						</div>
					</div>
					<pre className='bg-accent-light rounded-md whitespace-pre-wrap p-4 '>{meal.strInstructions}</pre>
				</div>
			</main>
		</div>
	);
}
