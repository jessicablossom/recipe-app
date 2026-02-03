'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Card } from '@/components/Card';
import type { MealByCategory } from '@/services/meals';

const INITIAL_PAGE_SIZE = 12;
const ROW_SIZE = 3;
const OBSERVER_ROOT_MARGIN_PX = 80;
const SCROLL_LOAD_MARGIN_PX = 120;
const LOADING_DELAY_MS = 750;

function CardSkeleton() {
	return (
		<div className='aspect-square min-w-[200px] rounded-2xl bg-white/15 backdrop-blur-xl ring-1 ring-white/25 animate-skeleton-pulse' />
	);
}

type Props = {
	meals: MealByCategory[];
};

export function CategoryMealsGrid({ meals }: Props) {
	const [visibleCount, setVisibleCount] = useState(() => Math.min(INITIAL_PAGE_SIZE, meals.length));
	const [isLoadingMore, setIsLoadingMore] = useState(false);
	const sentinelRef = useRef<HTMLDivElement>(null);
	const loadingRef = useRef(false);
	const visibleCountRef = useRef(visibleCount);
	const mealsLengthRef = useRef(meals.length);
	const loadMoreRef = useRef<() => void>(() => {});
	const hasMore = meals.length > INITIAL_PAGE_SIZE && visibleCount < meals.length;

	const loadMore = useCallback(() => {
		const current = visibleCountRef.current;
		const total = mealsLengthRef.current;
		if (current >= total || loadingRef.current) return;
		loadingRef.current = true;
		setIsLoadingMore(true);

		setTimeout(() => {
			setVisibleCount((prev) => {
				const next = Math.min(prev + ROW_SIZE, mealsLengthRef.current);
				visibleCountRef.current = next;
				return next;
			});
			setIsLoadingMore(false);
			loadingRef.current = false;
		}, LOADING_DELAY_MS);
	}, []);

	useEffect(() => {
		visibleCountRef.current = visibleCount;
		mealsLengthRef.current = meals.length;
		loadMoreRef.current = loadMore;
	}, [visibleCount, meals.length, loadMore]);

	useEffect(() => {
		const el = sentinelRef.current;
		if (!el) return;

		const observer = new IntersectionObserver(
			(entries) => {
				if (!entries[0]?.isIntersecting) return;
				loadMoreRef.current();
			},
			{ root: null, rootMargin: `0px 0px ${OBSERVER_ROOT_MARGIN_PX}px 0px`, threshold: 0 },
		);
		observer.observe(el);
		return () => observer.disconnect();
	}, []);

	useEffect(() => {
		const check = () => {
			const total = mealsLengthRef.current;
			const current = visibleCountRef.current;
			if (current >= total || loadingRef.current) return;
			const scrollBottom = window.scrollY + window.innerHeight;
			const docHeight = document.documentElement.scrollHeight - SCROLL_LOAD_MARGIN_PX;
			if (scrollBottom >= docHeight) loadMoreRef.current();
		};

		window.addEventListener('scroll', check, { passive: true });
		return () => window.removeEventListener('scroll', check);
	}, []);

	const visibleMeals = meals.slice(0, visibleCount);

	return (
		<>
			<div className='w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
				{visibleMeals.map((meal, index) => (
					<div key={meal.idMeal} className={index >= INITIAL_PAGE_SIZE ? 'animate-card-in' : undefined}>
						<Link href={`/meal/${meal.idMeal}`}>
							<Card
								title={meal.strMeal}
								image={meal.strMealThumb}
								fit='cover'
								favoriteId={`meal:${meal.idMeal}`}
								imageGradient
							/>
						</Link>
					</div>
				))}
				{isLoadingMore && Array.from({ length: ROW_SIZE }, (_, i) => <CardSkeleton key={`skeleton-${i}`} />)}
			</div>

			{hasMore && <div ref={sentinelRef} className='h-16 w-full flex-shrink-0' aria-hidden />}
		</>
	);
}
