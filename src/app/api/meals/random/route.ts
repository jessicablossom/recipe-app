import { NextResponse } from 'next/server';
import { mealdbGet, type MealDBMealDetail, type MealDBResponse } from '@/app/api/lib/mealdb';

export const dynamic = 'force-dynamic';

export async function GET() {
	try {
		const res = await mealdbGet<MealDBResponse<MealDBMealDetail>>('/random.php');
		const meal = Array.isArray(res?.meals) && res.meals.length > 0 ? res.meals[0] : null;
		if (!meal) {
			return NextResponse.json({ error: 'No meal found' }, { status: 404 });
		}
		return NextResponse.json(meal, {
			headers: { 'Cache-Control': 'no-store, max-age=0' },
		});
	} catch (err) {
		console.error('[api/meals/random] error:', err);
		return NextResponse.json({ error: 'Random meal unavailable' }, { status: 503 });
	}
}
