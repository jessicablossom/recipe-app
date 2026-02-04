const MEALDB_BASE = 'https://www.themealdb.com/api/json/v1/1';

const fetchOptions: RequestInit = {
	headers: { Accept: 'application/json' },
	next: { revalidate: 3600 },
};

export async function mealdbGet<T>(path: string): Promise<T | null> {
	try {
		const res = await fetch(`${MEALDB_BASE}${path}`, fetchOptions);
		if (!res.ok) return null;
		const data = (await res.json()) as T;
		return data;
	} catch {
		return null;
	}
}

export type MealDBMealListItem = {
	idMeal: string;
	strMeal: string;
	strMealThumb: string;
};

export type MealDBMealDetail = MealDBMealListItem & {
	strCategory: string;
	strArea: string;
	strInstructions: string;
	strYoutube: string | null;
	strTags?: string | null;
	[key: `strIngredient${number}`]: string | null;
	[key: `strMeasure${number}`]: string | null;
};

export type MealDBResponse<T> = { meals: T[] | null };
export type MealDBCategoriesResponse = {
	categories: Array<{ strCategory: string; [key: string]: unknown }> | null;
};
export type MealDBAreasResponse = { meals: Array<{ strArea: string }> | null };
