import { NextResponse } from 'next/server';
import { mealdbGet, type MealDBMealListItem, type MealDBResponse } from '@/app/api/lib/mealdb';

export async function GET(request: Request) {
	const { searchParams } = new URL(request.url);
	const q = (searchParams.get('q') ?? '').trim();

	try {
		if (!q) {
			return NextResponse.json([]);
		}
		const res = await mealdbGet<MealDBResponse<MealDBMealListItem>>(
			`/search.php?s=${encodeURIComponent(q)}`,
		);
		const list = Array.isArray(res?.meals) ? res.meals : [];
		return NextResponse.json(list);
	} catch (err) {
		console.error('[api/search] error:', err);
		return NextResponse.json([]);
	}
}
