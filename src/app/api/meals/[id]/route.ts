import { NextResponse } from 'next/server';
import { mealdbGet, type MealDBMealDetail, type MealDBResponse } from '@/app/api/lib/mealdb';

export const dynamic = 'force-dynamic';

type RouteParams = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: RouteParams) {
	const { id } = await params;
	const trimmed = (id ?? '').trim();
	if (!trimmed) {
		return NextResponse.json({ error: 'Missing meal id' }, { status: 400 });
	}

	try {
		const res = await mealdbGet<MealDBResponse<MealDBMealDetail>>(
			`/lookup.php?i=${encodeURIComponent(trimmed)}`,
		);
		const meal = Array.isArray(res?.meals) && res.meals.length > 0 ? res.meals[0] : null;
		if (!meal) {
			return NextResponse.json({ error: 'Meal not found' }, { status: 404 });
		}
		return NextResponse.json(meal);
	} catch (err) {
		console.error('[api/meals/[id]] error:', err);
		return NextResponse.json({ error: 'Meal unavailable' }, { status: 503 });
	}
}
