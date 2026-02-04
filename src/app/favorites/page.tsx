'use client';

import { useFavorites } from '@/contexts/FavoritesContext';
import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Card } from '@/components/Card';
import type { MealByCategory } from '@/services/meals';

type MealFavorite = { type: 'meal'; id: string; raw: string };

function parseFavorite(raw: string): MealFavorite | null {
	if (!raw.startsWith('meal:')) return null;
	const id = raw.slice(5).trim();
	return id ? { type: 'meal', id, raw } : null;
}

const glassTitle =
	'inline-flex w-fit items-center rounded-full bg-white/20 backdrop-blur-md ring-1 ring-white/30 px-4 py-2 text-grey-dark';

function CardSkeleton() {
	return (
		<div className="aspect-square min-w-[180px] rounded-2xl bg-white/15 backdrop-blur-xl ring-1 ring-white/25 animate-skeleton-pulse" />
	);
}

export default function FavoritesPage() {
	const { favorites } = useFavorites();
	const [mealDetails, setMealDetails] = useState<Record<string, MealByCategory | null>>({});

	const mealFavorites = useMemo(
		() =>
			favorites
				.map(parseFavorite)
				.filter((x): x is MealFavorite => x !== null),
		[favorites],
	);

	useEffect(() => {
		let cancelled = false;

		const load = async () => {
			if (mealFavorites.length === 0) {
				if (!cancelled) setMealDetails({});
				return;
			}

			const details: Record<string, MealByCategory | null> = {};
			await Promise.all(
				mealFavorites.map(async (fav) => {
					const res = await fetch(`/api/meals/${encodeURIComponent(fav.id)}`);
					if (!res.ok) {
						details[fav.raw] = null;
						return;
					}
					const data = (await res.json()) as { idMeal: string; strMeal: string; strMealThumb: string };
					details[fav.raw] = { idMeal: data.idMeal, strMeal: data.strMeal, strMealThumb: data.strMealThumb };
				}),
			);

			if (!cancelled) {
				setMealDetails(details);
			}
		};

		void load();

		return () => {
			cancelled = true;
		};
	}, [mealFavorites]);

	const mealList = mealFavorites
		.map((fav) => ({ fav, data: mealDetails[fav.raw] }))
		.filter(({ data }) => data != null) as { fav: MealFavorite; data: MealByCategory }[];
	const loadingMeals = mealFavorites.length > mealList.length;

	const isEmpty = mealFavorites.length === 0;

	return (
		<div className="relative flex min-h-screen flex-col">
			<div className="absolute inset-0 overflow-hidden">
				<Image
					src="/assets/hero-image.jpg"
					alt=""
					fill
					className="object-cover blur-xl scale-105"
					sizes="100vw"
					priority={false}
				/>
				<div className="absolute inset-0 bg-grey-light/50" aria-hidden />
				<div className="absolute inset-0 bg-gradient-to-t from-black/15 via-transparent to-transparent" aria-hidden />
			</div>
			<main className="relative flex flex-1 flex-col gap-6 w-full max-w-5xl mx-auto px-4 py-8 md:px-16">
				<h1 className={`text-3xl font-bold ${glassTitle}`}>Favorites</h1>

				{isEmpty && (
					<p className="text-grey-dark text-lg">
						You have no favorites. Add recipes from the app to see them here.
					</p>
				)}

				{!isEmpty && (
					<section>
						<div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 grid-scroll-3-rows">
							{mealList.map(({ fav, data }) => (
								<div key={fav.raw} className="animate-card-in">
									<Link href={`/meal/${data.idMeal}`}>
										<Card
											title={data.strMeal}
											image={data.strMealThumb}
											fit="cover"
											favoriteId={fav.raw}
											imageGradient
										/>
									</Link>
								</div>
							))}
							{loadingMeals && Array.from({ length: 4 }, (_, i) => <CardSkeleton key={`skeleton-${i}`} />)}
						</div>
					</section>
				)}
			</main>
		</div>
	);
}
