const MEALDB_BASE = 'https://www.themealdb.com/api/json/v1/1';
const DEFAULT_TIMEOUT_MS = 15_000;

const baseHeaders: HeadersInit = { Accept: 'application/json' };

export async function mealdbGet<T>(path: string, overrides?: RequestInit): Promise<T | null> {
	let timeoutId: ReturnType<typeof setTimeout> | undefined;
	const controller = overrides?.signal ? undefined : new AbortController();
	if (controller) {
		timeoutId = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT_MS);
	}
	const signal = overrides?.signal ?? controller?.signal;

	try {
		const res = await fetch(`${MEALDB_BASE}${path}`, {
			...overrides,
			headers: { ...baseHeaders, ...overrides?.headers },
			cache: 'no-store',
			signal,
		});
		if (timeoutId) clearTimeout(timeoutId);
		if (!res.ok) return null;
		const data = (await res.json()) as T;
		return data;
	} catch {
		if (timeoutId) clearTimeout(timeoutId);
		return null;
	}
}

export async function mealdbGetCached<T>(path: string): Promise<T | null> {
	try {
		const res = await fetch(`${MEALDB_BASE}${path}`, {
			headers: baseHeaders,
			next: { revalidate: 3600 },
		});
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
