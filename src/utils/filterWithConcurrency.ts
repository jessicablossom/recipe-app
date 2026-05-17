import { MEALDB_FILTER_CONCURRENCY } from '@/constants/mealdb';

export async function filterWithConcurrency<T>(
	items: T[],
	predicate: (item: T) => Promise<boolean>,
	concurrency: number = MEALDB_FILTER_CONCURRENCY,
): Promise<T[]> {
	if (items.length === 0) return [];

	const kept: T[] = [];
	for (let i = 0; i < items.length; i += concurrency) {
		const chunk = items.slice(i, i + concurrency);
		const results = await Promise.all(
			chunk.map(async (item) => ({ item, keep: await predicate(item) })),
		);
		for (const { item, keep } of results) {
			if (keep) kept.push(item);
		}
	}
	return kept;
}
