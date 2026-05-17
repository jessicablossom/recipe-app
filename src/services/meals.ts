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
import { MEALDB_FILTER_CONCURRENCY } from '@/constants/mealdb';
import { filterWithConcurrency } from '@/utils/filterWithConcurrency';
import { hasValidRecipeImage } from '@/utils/mealImage';

const LIST_REVALIDATE_SECONDS = 3600;

async function categoryHasMeals(category: string): Promise<boolean> {
	const meals = await getMealsByCategory(category);
	return meals.length > 0;
}

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
	const list = Array.isArray(data?.categories) ? (data.categories as Category[]) : [];
	return filterWithConcurrency(list, (cat) => categoryHasMeals(cat.strCategory));
}

export async function getCategories(): Promise<Category[]> {
	return unstable_cache(getCategoriesUncached, ['mealdb-categories-with-meals'], {
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

export type AreaWithThumb = { strArea: string; strMealThumb: string };

async function resolveAreaWithThumb(area: string): Promise<AreaWithThumb | null> {
	const meals = await getMealsByArea(area);
	if (meals.length === 0) return null;
	const thumb = meals[0]?.strMealThumb?.trim() ?? '';
	if (!hasValidRecipeImage(thumb)) return null;
	return { strArea: area, strMealThumb: thumb };
}

async function getAreasWithThumbUncached(): Promise<AreaWithThumb[]> {
	const data = await mealdbGetCached<MealDBAreasResponse>('/list.php?a=list');
	const list = Array.isArray(data?.meals) ? data.meals : [];
	const names = list.map((m) => m?.strArea).filter((s): s is string => Boolean(s));
	const unique = [...new Set(names)].sort((a, b) => a.localeCompare(b, 'en'));

	const withThumb: AreaWithThumb[] = [];
	for (let i = 0; i < unique.length; i += MEALDB_FILTER_CONCURRENCY) {
		const chunk = unique.slice(i, i + MEALDB_FILTER_CONCURRENCY);
		const batch = await Promise.all(chunk.map((area) => resolveAreaWithThumb(area)));
		for (const item of batch) {
			if (item) withThumb.push(item);
		}
	}
	return withThumb;
}

export async function getAreasWithThumb(): Promise<AreaWithThumb[]> {
	return unstable_cache(getAreasWithThumbUncached, ['mealdb-areas-with-thumb'], {
		revalidate: LIST_REVALIDATE_SECONDS,
		tags: ['mealdb-lists'],
	})();
}

export async function getAreas(): Promise<string[]> {
	const withThumb = await getAreasWithThumb();
	return withThumb.map((a) => a.strArea);
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
