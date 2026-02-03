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

export async function getCategories(): Promise<Category[]> {
	const response = await mealdbClient.get<{ categories: Category[] | null }>('/categories.php');
	const categories = response.data?.categories ?? [];
	return categories;
}

export async function getMealsByCategory(category: string) {
	const { data } = await mealdbClient.get<{ meals: MealByCategory[] | null }>(
		`/filter.php?c=${encodeURIComponent(category)}`,
	);

	return data.meals ?? [];
}

export async function getMealsByArea(area: string): Promise<MealByCategory[]> {
	const trimmed = area.trim();
	if (!trimmed) return [];
	const { data } = await mealdbClient.get<{ meals: MealByCategory[] | null }>(
		`/filter.php?a=${encodeURIComponent(trimmed)}`,
	);
	return data.meals ?? [];
}

export async function getMealById(id: string): Promise<MealDetail | null> {
	const { data } = await mealdbClient.get<{ meals: MealDetail[] | null }>(`/lookup.php?i=${id}`);
	return data.meals?.[0] ?? null;
}

export async function searchMealsByName(query: string): Promise<MealByCategory[]> {
	const trimmed = query.trim();
	if (!trimmed) return [];
	const { data } = await mealdbClient.get<{ meals: MealByCategory[] | null }>(
		`/search.php?s=${encodeURIComponent(trimmed)}`,
	);
	return data.meals ?? [];
}

export async function getRandomMeal(): Promise<MealDetail | null> {
	const { data } = await mealdbClient.get<{ meals: MealDetail[] | null }>('/random.php');
	return data.meals?.[0] ?? null;
}

export type AreaItem = { strArea: string };

export async function getAreas(): Promise<string[]> {
	const { data } = await mealdbClient.get<{ meals: AreaItem[] | null }>('/list.php?a=list');
	const list = data.meals ?? [];
	const names = list.map((m) => m.strArea).filter(Boolean);
	return [...names].sort((a, b) => a.localeCompare(b, 'en'));
}

export type AreaWithThumb = { strArea: string; strMealThumb: string };

export async function getAreasWithThumb(): Promise<AreaWithThumb[]> {
	const areas = await getAreas();
	const results = await Promise.all(
		areas.map(async (area) => {
			const meals = await getMealsByArea(area);
			const thumb = meals[0]?.strMealThumb ?? '';
			return { strArea: area, strMealThumb: thumb };
		}),
	);
	return results;
}

export async function getRecommendationByAreaAndCategory(area: string, category: string): Promise<MealDetail | null> {
	const [mealsByArea, mealsByCategory] = await Promise.all([getMealsByArea(area), getMealsByCategory(category)]);

	const idsByArea = new Set(mealsByArea.map((m) => m.idMeal));
	const intersection = mealsByCategory.filter((m) => idsByArea.has(m.idMeal));

	const pool = intersection.length > 0 ? intersection : mealsByArea;
	if (pool.length === 0) return null;

	const picked = pool[Math.floor(Math.random() * pool.length)];
	return getMealById(picked.idMeal);
}
