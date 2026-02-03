import Image from 'next/image';
import { CategoriesWithFilter } from '@/components/CategoriesWithFilter';
import { getCategories, getAreasWithThumb } from '@/services/meals';

export default async function CategoriesPage() {
	const [categories, areasWithThumb] = await Promise.all([
		getCategories(),
		getAreasWithThumb(),
	]);

	return (
		<div className="relative flex min-h-screen flex-col">
			<div className="absolute inset-0 overflow-hidden">
				<Image
					src="/assets/hero-image.jpg"
					alt=""
					fill
					className="object-cover blur-lg scale-105"
					sizes="100vw"
					priority={false}
				/>
				<div className="absolute inset-0 bg-grey-light/70" aria-hidden />
			</div>
			<main className="relative flex-1 w-full max-w-5xl mx-auto px-4 py-8 md:px-16">
				<CategoriesWithFilter categories={categories} areasWithThumb={areasWithThumb} />
			</main>
		</div>
	);
}
