import { getMealById } from '@/services/meals';
import { NextResponse } from 'next/server';

type RouteParams = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: RouteParams) {
	const { id } = await params;
	if (!id) {
		return NextResponse.json({ error: 'Missing meal id' }, { status: 400 });
	}
	const meal = await getMealById(id);
	if (!meal) {
		return NextResponse.json({ error: 'Meal not found' }, { status: 404 });
	}
	return NextResponse.json(meal);
}
