import { MealDetail } from '@/services/meals';

export type Ingredient = {
	ingredient: string;
	measure: string;
};

export function parseIngredients(meal: MealDetail): Ingredient[] {
	const ingredients: Ingredient[] = [];

	for (let i = 1; i <= 20; i++) {
		const ingredient = meal[`strIngredient${i}`]?.trim();
		const measure = meal[`strMeasure${i}`]?.trim();

		if (ingredient) {
			ingredients.push({
				ingredient,
				measure: measure || '',
			});
		}
	}

	return ingredients;
}
