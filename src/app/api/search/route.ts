import { searchMealsByName } from '@/services/meals';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
	const { searchParams } = new URL(request.url);
	const q = searchParams.get('q') ?? '';
	const meals = await searchMealsByName(q);
	return NextResponse.json(meals);
}
