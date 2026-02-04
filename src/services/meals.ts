import { unstable_cache } from 'next/cache';
import {
	mealdbGet,
	mealdbGetCached,
	type MealDBResponse,
	type MealDBCategoriesResponse,
	type MealDBAreasResponse,
	type MealDBMealListItem,
	type MealDBMealDetail,
} from '@/lib/mealdb';

const LIST_REVALIDATE_SECONDS = 3600;

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

async function getCategoriesUncached(): Promise<Category[]> {
	const data = await mealdbGetCached<MealDBCategoriesResponse>('/categories.php');
	const list = Array.isArray(data?.categories) ? data.categories : [];
	return list as Category[];
}

export async function getCategories(): Promise<Category[]> {
	return unstable_cache(getCategoriesUncached, ['mealdb-categories'], {
		revalidate: LIST_REVALIDATE_SECONDS,
		tags: ['mealdb-lists'],
	})();
}

export async function getMealsByCategory(category: string): Promise<MealByCategory[]> {
	const data = await mealdbGet<MealDBResponse<MealDBMealListItem>>(
		`/filter.php?c=${encodeURIComponent(category)}`,
	);
	const list = Array.isArray(data?.meals) ? data.meals : [];
	return list;
}

export async function getMealsByArea(area: string): Promise<MealByCategory[]> {
	const trimmed = area.trim();
	if (!trimmed) return [];
	const data = await mealdbGet<MealDBResponse<MealDBMealListItem>>(
		`/filter.php?a=${encodeURIComponent(trimmed)}`,
	);
	const list = Array.isArray(data?.meals) ? data.meals : [];
	return list;
}

export async function getMealById(id: string): Promise<MealDetail | null> {
	const data = await mealdbGet<MealDBResponse<MealDBMealDetail>>(`/lookup.php?i=${encodeURIComponent(id)}`);
	const meal = Array.isArray(data?.meals) && data.meals.length > 0 ? data.meals[0] : null;
	return meal as MealDetail | null;
}

const SEARCH_REVALIDATE_SECONDS = 120;

async function searchMealsByNameUncached(query: string): Promise<MealByCategory[]> {
	const data = await mealdbGet<MealDBResponse<MealDBMealListItem>>(
		`/search.php?s=${encodeURIComponent(query)}`,
	);
	const list = Array.isArray(data?.meals) ? data.meals : [];
	return list;
}

export async function searchMealsByName(query: string): Promise<MealByCategory[]> {
	const trimmed = query.trim();
	if (!trimmed) return [];
	return unstable_cache(
		() => searchMealsByNameUncached(trimmed),
		['mealdb-search', trimmed],
		{ revalidate: SEARCH_REVALIDATE_SECONDS, tags: ['mealdb-search'] },
	)();
}

export async function getRandomMeal(): Promise<MealDetail | null> {
	const data = await mealdbGet<MealDBResponse<MealDBMealDetail>>('/random.php');
	const meal = Array.isArray(data?.meals) && data.meals.length > 0 ? data.meals[0] : null;
	return meal as MealDetail | null;
}

export type AreaItem = { strArea: string };

async function getAreasUncached(): Promise<string[]> {
	const data = await mealdbGetCached<MealDBAreasResponse>('/list.php?a=list');
	const list = Array.isArray(data?.meals) ? data.meals : [];
	const names = list.map((m) => m?.strArea).filter((s): s is string => Boolean(s));
	return [...new Set(names)].sort((a, b) => a.localeCompare(b, 'en'));
}

export async function getAreas(): Promise<string[]> {
	return unstable_cache(getAreasUncached, ['mealdb-areas'], {
		revalidate: LIST_REVALIDATE_SECONDS,
		tags: ['mealdb-lists'],
	})();
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

export async function getRecommendationByAreaAndCategory(
	area: string,
	category: string,
): Promise<MealDetail | null> {
	const [mealsByArea, mealsByCategory] = await Promise.all([getMealsByArea(area), getMealsByCategory(category)]);

	const idsByArea = new Set(mealsByArea.map((m) => m.idMeal));
	const intersection = mealsByCategory.filter((m) => idsByArea.has(m.idMeal));

	const pool = intersection.length > 0 ? intersection : mealsByArea;
	if (pool.length === 0) return null;

	const picked = pool[Math.floor(Math.random() * pool.length)];
	return getMealById(picked.idMeal);
}
