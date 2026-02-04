import { getAreas } from '@/services/meals';
import { NextResponse } from 'next/server';

const CACHE_MAX_AGE = 3600; 

export async function GET() {
	const areas = await getAreas();
	return NextResponse.json(areas, {
		headers: {
			'Cache-Control': `public, s-maxage=${CACHE_MAX_AGE}, stale-while-revalidate=${CACHE_MAX_AGE}`,
		},
	});
}
