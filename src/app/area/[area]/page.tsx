import { notFound } from 'next/navigation';
import Image from 'next/image';
import { CategoryMealsGrid } from '@/components/category/CategoryMealsGrid';
import { getAreas, getMealsByArea } from '@/services/meals';

type Props = {
	params: Promise<{
		area: string;
	}>;
};

export default async function AreaPage({ params }: Props) {
	const { area } = await params;
	const decodedArea = decodeURIComponent(area);

	let areas: string[] = [];
	let meals;
	try {
		[areas, meals] = await Promise.all([getAreas(), getMealsByArea(decodedArea)]);
	} catch {
		notFound();
	}

	const areaExists = areas.some((a) => a.toLowerCase() === decodedArea.toLowerCase());
	if (!areaExists) notFound();

	const glassTitle =
		'inline-flex w-fit items-center rounded-full bg-white/20 backdrop-blur-md ring-1 ring-white/30 px-4 py-2 text-grey-dark';

	return (
		<div className='relative flex min-h-screen flex-col'>
			<div className='absolute inset-0 overflow-hidden'>
				<Image
					src='/assets/hero-image.jpg'
					alt=''
					fill
					className='object-cover blur-xl scale-105'
					sizes='100vw'
					priority={false}
				/>
				<div className='absolute inset-0 bg-grey-light/70' aria-hidden />
			</div>
			<main className='relative flex flex-col flex-1 gap-6 w-full max-w-5xl mx-auto px-4 py-8 md:px-16'>
				<h1 className={`text-3xl font-bold ${glassTitle}`}>{decodedArea}</h1>
				<CategoryMealsGrid meals={meals} />
			</main>
		</div>
	);
}
