import { searchMealsByName } from '@/services/meals';
import { NextResponse } from 'next/server';

const SEARCH_CACHE_MAX_AGE = 120; 

export async function GET(request: Request) {
	const { searchParams } = new URL(request.url);
	const q = searchParams.get('q') ?? '';
	const meals = await searchMealsByName(q);
	return NextResponse.json(meals, {
		headers: {
			'Cache-Control': `public, s-maxage=${SEARCH_CACHE_MAX_AGE}, stale-while-revalidate=${SEARCH_CACHE_MAX_AGE}`,
		},
	});
}
