import { NextResponse } from 'next/server';
import { mealdbGetCached, type MealDBAreasResponse } from '@/app/api/lib/mealdb';

export const dynamic = 'force-dynamic';

export async function GET() {
	try {
		const data = await mealdbGetCached<MealDBAreasResponse>('/list.php?a=list');
		const list = Array.isArray(data?.meals) ? data.meals : [];
		const areas = list.map((m) => m?.strArea).filter((s): s is string => Boolean(s));
		return NextResponse.json([...new Set(areas)].sort((a, b) => a.localeCompare(b, 'en')));
	} catch (err) {
		console.error('[api/areas] error:', err);
		return NextResponse.json([], { status: 200 });
	}
}
