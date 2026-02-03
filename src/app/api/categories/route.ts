import { getCategories } from '@/services/meals';
import { NextResponse } from 'next/server';

export async function GET() {
	const categories = await getCategories();
	const names = categories.map((c) => c.strCategory).filter(Boolean);
	return NextResponse.json(names);
}
