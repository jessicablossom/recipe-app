import { getAreas } from '@/services/meals';
import { NextResponse } from 'next/server';

export async function GET() {
	const areas = await getAreas();
	return NextResponse.json(areas);
}
