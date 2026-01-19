import { mealdbClient } from './mealDbClient';

export type Category = {
	idCategory: string;
	strCategory: string;
	strCategoryThumb: string;
	strCategoryDescription: string;
};

export type MealByCategory = {
	idMeal: string;
	strMeal: string;
	strMealThumb: string;
};

export type MealDetail = {
	idMeal: string;
	strMeal: string;
	strMealThumb: string;
	strCategory: string;
	strArea: string;
	strInstructions: string;
	strYoutube: string | null;
	strTags?: string | null;
} & {
	[key: `strIngredient${number}`]: string | null;
} & {
	[key: `strMeasure${number}`]: string | null;
};

export async function getCategories() {
	const { data } = await mealdbClient.get<{ categories: Category[] }>('/categories.php');
	return data.categories;
}

export async function getMealsByCategory(category: string) {
	const { data } = await mealdbClient.get<{ meals: MealByCategory[] | null }>(
		`/filter.php?c=${encodeURIComponent(category)}`,
	);

	return data.meals ?? [];
}

export async function getMealById(id: string): Promise<MealDetail | null> {
	const { data } = await mealdbClient.get<{ meals: MealDetail[] | null }>(`/lookup.php?i=${id}`);
	return data.meals?.[0] ?? null;
}
