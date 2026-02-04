import { NextRequest, NextResponse } from 'next/server';
import {
	mealdbGet,
	type MealDBMealListItem,
	type MealDBMealDetail,
	type MealDBResponse,
} from '@/app/api/lib/mealdb';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
	const { searchParams } = new URL(request.url);
	const area = (searchParams.get('area') ?? '').trim();
	const category = (searchParams.get('category') ?? '').trim();

	if (!area || !category) {
		return NextResponse.json({ error: 'area and category are required' }, { status: 400 });
	}

	try {
		const [areaRes, categoryRes] = await Promise.all([
			mealdbGet<MealDBResponse<MealDBMealListItem>>(`/filter.php?a=${encodeURIComponent(area)}`),
			mealdbGet<MealDBResponse<MealDBMealListItem>>(`/filter.php?c=${encodeURIComponent(category)}`),
		]);

		const mealsByArea = Array.isArray(areaRes?.meals) ? areaRes.meals : [];
		const mealsByCategory = Array.isArray(categoryRes?.meals) ? categoryRes.meals : [];

		const idsByArea = new Set(mealsByArea.map((m) => m.idMeal));
		const intersection = mealsByCategory.filter((m) => idsByArea.has(m.idMeal));
		const pool = intersection.length > 0 ? intersection : mealsByArea;

		if (pool.length === 0) {
			return NextResponse.json({ error: 'No meal found for this area and category' }, { status: 404 });
		}

		const picked = pool[Math.floor(Math.random() * pool.length)];
		const detailRes = await mealdbGet<MealDBResponse<MealDBMealDetail>>(
			`/lookup.php?i=${encodeURIComponent(picked.idMeal)}`,
		);
		const meal = Array.isArray(detailRes?.meals) && detailRes.meals.length > 0 ? detailRes.meals[0] : null;

		if (!meal) {
			return NextResponse.json({ error: 'Meal details not found' }, { status: 404 });
		}
		return NextResponse.json(meal, {
			headers: { 'Cache-Control': 'no-store, max-age=0' },
		});
	} catch (err) {
		console.error('[api/meals/recommend] error:', err);
		return NextResponse.json({ error: 'Recommendation unavailable' }, { status: 503 });
	}
}
