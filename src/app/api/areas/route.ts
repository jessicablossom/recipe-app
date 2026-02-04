import { NextResponse } from 'next/server';

const MEALDB_AREAS_URL = 'https://www.themealdb.com/api/json/v1/1/list.php?a=list';

export async function GET() {
	try {
		const res = await fetch(MEALDB_AREAS_URL, {
			headers: { Accept: 'application/json' },
			next: { revalidate: 3600 },
		});
		if (!res.ok) {
			console.warn('[api/areas] upstream status:', res.status);
			return NextResponse.json([], { status: 200 });
		}
		const data = (await res.json()) as { meals?: Array<{ strArea?: string }> | null };
		const list = Array.isArray(data?.meals) ? data.meals : [];
		const areas = list.map((m) => m?.strArea).filter((s): s is string => Boolean(s));
		return NextResponse.json([...new Set(areas)].sort((a, b) => a.localeCompare(b, 'en')));
	} catch (err) {
		console.error('[api/areas] error:', err);
		return NextResponse.json([], { status: 200 });
	}
}
