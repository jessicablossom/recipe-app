import { getRandomMeal } from '@/services/meals';
import { NextResponse } from 'next/server';

export async function GET() {
	const meal = await getRandomMeal();
	if (!meal) {
		return NextResponse.json({ error: 'No meal found' }, { status: 404 });
	}
	return NextResponse.json(meal);
}
