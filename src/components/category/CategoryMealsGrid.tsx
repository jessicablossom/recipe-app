'use client';

import Link from 'next/link';
import { Card } from '@/components/Card';
import type { MealByCategory } from '@/services/meals';

type Props = {
	meals: MealByCategory[];
};

export function CategoryMealsGrid({ meals }: Props) {
	return (
		<div className='w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 grid-scroll-3-rows'>
			{meals.map((meal) => (
				<div key={meal.idMeal}>
					<Link href={`/meal/${meal.idMeal}`}>
						<Card
							title={meal.strMeal}
							image={meal.strMealThumb}
							fit='cover'
							favoriteId={`meal:${meal.idMeal}`}
							imageGradient
						/>
					</Link>
				</div>
			))}
		</div>
	);
}

