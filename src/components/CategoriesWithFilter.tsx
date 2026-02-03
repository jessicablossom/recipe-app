'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Card } from '@/components/Card';
import type { Category, AreaWithThumb } from '@/services/meals';

const glassTitle =
	'inline-flex w-fit items-center rounded-full bg-white/20 backdrop-blur-md ring-1 ring-white/30 px-4 py-2 text-grey-dark';

const chipBase =
	'h-10 inline-flex items-center justify-center rounded-full px-4 text-sm font-medium transition-all duration-200 ring-[1px] ' +
	'bg-white/10 backdrop-blur-sm ring-white/30 hover:bg-white/20 hover:ring-white/40 ' +
	'focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-transparent';

const chipActive = 'bg-white/25 ring-white/40 text-grey-dark';

const AREA_PLACEHOLDER_IMAGE = '/assets/hero-image.jpg';

type Props = {
	categories: Category[];
	areasWithThumb: AreaWithThumb[];
};

type FilterKind = 'category' | 'area' | null;
type SortOrder = 'az' | 'za';

function toggleFilter(current: FilterKind, value: 'category' | 'area'): FilterKind {
	return current === value ? null : value;
}

type GridItem = {
	key: string;
	title: string;
	href: string;
	image: string;
	type: 'category' | 'area';
};

export function CategoriesWithFilter({ categories, areasWithThumb }: Props) {
	const [filter, setFilter] = useState<FilterKind>(null);
	const [sortOrder, setSortOrder] = useState<SortOrder>('az');

	const showCategories = filter === null || filter === 'category';
	const showAreas = filter === null || filter === 'area';
	const isFullList = filter === null;

	const sortCmp = sortOrder === 'az' ? 1 : -1;

	const fullListSorted = useMemo(() => {
		if (!isFullList) return [];
		const items: GridItem[] = [
			...categories.map((c) => ({
				key: `cat-${c.idCategory}`,
				title: c.strCategory,
				href: `/category/${encodeURIComponent(c.strCategory)}`,
				image: c.strCategoryThumb,
				type: 'category' as const,
			})),
			...areasWithThumb.map((a) => ({
				key: `area-${a.strArea}`,
				title: a.strArea,
				href: `/area/${encodeURIComponent(a.strArea)}`,
				image: a.strMealThumb || AREA_PLACEHOLDER_IMAGE,
				type: 'area' as const,
			})),
		];
		return [...items].sort((a, b) => sortCmp * a.title.localeCompare(b.title, 'es'));
	}, [isFullList, categories, areasWithThumb, sortOrder, sortCmp]);

	const categoriesSorted = useMemo(
		() => [...categories].sort((a, b) => sortCmp * a.strCategory.localeCompare(b.strCategory, 'es')),
		[categories, sortCmp],
	);

	const areasSorted = useMemo(
		() => [...areasWithThumb].sort((a, b) => sortCmp * a.strArea.localeCompare(b.strArea, 'es')),
		[areasWithThumb, sortCmp],
	);

	return (
		<div className='flex flex-col gap-6 w-full h-full'>
			<div className='flex flex-col gap-4'>
				<div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
					<h1 className={`text-3xl font-bold ${glassTitle}`}>Listado</h1>
					<div className='flex flex-wrap items-center gap-2'>
						<button
							type='button'
							onClick={() => setFilter((f) => toggleFilter(f, 'category'))}
							className={`${chipBase} ${filter === 'category' ? chipActive : 'text-grey-dark'}`}
							aria-pressed={filter === 'category'}
							aria-label={filter === 'category' ? 'Quitar filtro categoría' : 'Filtrar por categoría'}
						>
							Por categoría
						</button>
						<button
							type='button'
							onClick={() => setFilter((f) => toggleFilter(f, 'area'))}
							className={`${chipBase} ${filter === 'area' ? chipActive : 'text-grey-dark'}`}
							aria-pressed={filter === 'area'}
							aria-label={filter === 'area' ? 'Quitar filtro país' : 'Filtrar por país'}
						>
							Por país
						</button>
						<button
							type='button'
							onClick={() => setSortOrder((o) => (o === 'az' ? 'za' : 'az'))}
							className={`h-10 w-10 shrink-0 rounded-full p-0 transition-all duration-200 ${chipBase} ${sortOrder === 'za' ? chipActive : 'text-grey-dark'}`}
							aria-label={sortOrder === 'az' ? 'Orden A-Z (clic para Z-A)' : 'Orden Z-A (clic para A-Z)'}
							title={sortOrder === 'az' ? 'A-Z (clic: Z-A)' : 'Z-A (clic: A-Z)'}
							aria-pressed={sortOrder === 'za'}
						>
							{sortOrder === 'az' ? (
								<svg
									key='az'
									xmlns='http://www.w3.org/2000/svg'
									viewBox='0 0 24 24'
									fill='none'
									stroke='currentColor'
									strokeWidth='2'
									strokeLinecap='round'
									strokeLinejoin='round'
									className='size-5 shrink-0'
									aria-hidden
								>
									<path d='M12 5v14' />
									<path d='m19 12-7 7-7-7' />
								</svg>
							) : (
								<svg
									key='za'
									xmlns='http://www.w3.org/2000/svg'
									viewBox='0 0 24 24'
									fill='none'
									stroke='currentColor'
									strokeWidth='2'
									strokeLinecap='round'
									strokeLinejoin='round'
									className='size-5 shrink-0'
									aria-hidden
								>
									<path d='M12 19V5' />
									<path d='m5 12 7-7 7 7' />
								</svg>
							)}
						</button>
					</div>
				</div>
			</div>
			<div className='w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
				{isFullList &&
					fullListSorted.map((item) => (
						<Link key={item.key} href={item.href}>
							<Card
								title={item.title}
								image={item.image}
								fit={item.type === 'area' ? 'cover' : 'contain'}
								imageGradient
							/>
						</Link>
					))}
				{!isFullList &&
					showCategories &&
					categoriesSorted.map((category) => (
						<Link key={category.idCategory} href={`/category/${encodeURIComponent(category.strCategory)}`}>
							<Card title={category.strCategory} image={category.strCategoryThumb} imageGradient />
						</Link>
					))}
				{!isFullList &&
					showAreas &&
					areasSorted.map((area) => (
						<Link key={area.strArea} href={`/area/${encodeURIComponent(area.strArea)}`}>
							<Card
								title={area.strArea}
								image={area.strMealThumb || AREA_PLACEHOLDER_IMAGE}
								fit='cover'
								imageGradient
							/>
						</Link>
					))}
			</div>
		</div>
	);
}
