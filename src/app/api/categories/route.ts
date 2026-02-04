import { NextResponse } from 'next/server';
import { mealdbGet, type MealDBCategoriesResponse } from '@/app/api/lib/mealdb';

export async function GET() {
	try {
		const data = await mealdbGet<MealDBCategoriesResponse>('/categories.php');
		const list = Array.isArray(data?.categories) ? data.categories : [];
		const names = list.map((c) => c?.strCategory).filter((s): s is string => Boolean(s));
		return NextResponse.json(names);
	} catch (err) {
		console.error('[api/categories] error:', err);
		return NextResponse.json([], { status: 200 });
	}
}
