import { getRecommendationByAreaAndCategory } from '@/services/meals';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
	const { searchParams } = new URL(request.url);
	const area = searchParams.get('area') ?? '';
	const category = searchParams.get('category') ?? '';

	if (!area.trim() || !category.trim()) {
		return NextResponse.json({ error: 'area and category are required' }, { status: 400 });
	}

	const meal = await getRecommendationByAreaAndCategory(area, category);
	if (!meal) {
		return NextResponse.json({ error: 'No meal found for this area and category' }, { status: 404 });
	}
	return NextResponse.json(meal);
}
