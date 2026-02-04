import { NextResponse } from 'next/server';

const MEALDB_CATEGORIES_URL = 'https://www.themealdb.com/api/json/v1/1/categories.php';

export async function GET() {
	try {
		const res = await fetch(MEALDB_CATEGORIES_URL, {
			headers: { Accept: 'application/json' },
			next: { revalidate: 3600 },
		});
		if (!res.ok) {
			console.warn('[api/categories] upstream status:', res.status);
			return NextResponse.json([], { status: 200 });
		}
		const data = (await res.json()) as { categories?: Array<{ strCategory?: string }> | null };
		const list = Array.isArray(data?.categories) ? data.categories : [];
		const names = list.map((c) => c?.strCategory).filter((s): s is string => Boolean(s));
		return NextResponse.json(names);
	} catch (err) {
		console.error('[api/categories] error:', err);
		return NextResponse.json([], { status: 200 });
	}
}
