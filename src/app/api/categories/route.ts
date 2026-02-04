import { getCategories } from '@/services/meals';
import { NextResponse } from 'next/server';

const CACHE_MAX_AGE = 3600; 

export async function GET() {
	const categories = await getCategories();
	const names = categories.map((c) => c.strCategory).filter(Boolean);
	return NextResponse.json(names, {
		headers: {
			'Cache-Control': `public, s-maxage=${CACHE_MAX_AGE}, stale-while-revalidate=${CACHE_MAX_AGE}`,
		},
	});
}
