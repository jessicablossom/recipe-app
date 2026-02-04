'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRecommendation } from '@/contexts/RecommendationContext';
import type { RootState, AppDispatch } from '@/store';
import { clearHeroPreference, setHeroArea, setHeroCategory } from '@/store/slices/appSlice';
import { HERO_PREFERENCE_AREA_KEY, HERO_PREFERENCE_CATEGORY_KEY } from '@/constants/storageKeys';

type Step = 1 | 2;

const CAROUSEL_MAX_WIDTH = '32rem';

export function Hero() {
	const [step, setStep] = useState<Step>(1);
	const dispatch = useDispatch<AppDispatch>();
	const area = useSelector((state: RootState) => state.app.heroPreference.area);
	const constraint = useSelector((state: RootState) => state.app.heroPreference.category);
	const [areas, setAreas] = useState<string[]>([]);
	const [areasLoading, setAreasLoading] = useState(true);
	const [categories, setCategories] = useState<string[]>([]);
	const [categoriesLoading, setCategoriesLoading] = useState(true);
	const { openRecommendation } = useRecommendation();
	const lastTriggerRef = useRef<{ key: string } | null>(null);
	const isTriggeringRef = useRef(false);

	useEffect(() => {
		if (typeof window === 'undefined') return;
		const storedArea = window.localStorage.getItem(HERO_PREFERENCE_AREA_KEY) ?? '';
		const storedCategory = window.localStorage.getItem(HERO_PREFERENCE_CATEGORY_KEY) ?? '';
		if (storedArea || storedCategory) {
			dispatch(setHeroArea(storedArea));
			dispatch(setHeroCategory(storedCategory));
			setStep(storedArea ? 2 : 1);
		}
	}, [dispatch]);

	useEffect(() => {
		Promise.all([fetch('/api/areas').then((res) => res.json()), fetch('/api/categories').then((res) => res.json())])
			.then(([areasData, categoriesData]) => {
				setAreas(Array.isArray(areasData) ? areasData : []);
				setCategories(Array.isArray(categoriesData) ? categoriesData : []);
			})
			.catch(() => {
				setAreas([]);
				setCategories([]);
			})
			.finally(() => {
				setAreasLoading(false);
				setCategoriesLoading(false);
			});
	}, []);

	const triggerRecommendation = (selectedArea: string, selectedCategory: string) => {
		const key = `${selectedArea}||${selectedCategory}`;
		const last = lastTriggerRef.current;

		if (isTriggeringRef.current && last && last.key === key) {
			return;
		}

		lastTriggerRef.current = { key };
		isTriggeringRef.current = true;
		openRecommendation({ area: selectedArea, category: selectedCategory });

		window.setTimeout(() => {
			isTriggeringRef.current = false;
		}, 500);
	};

	const handleClear = () => {
		dispatch(clearHeroPreference());
		if (typeof window !== 'undefined') {
			window.localStorage.removeItem(HERO_PREFERENCE_AREA_KEY);
			window.localStorage.removeItem(HERO_PREFERENCE_CATEGORY_KEY);
		}
		setStep(1);
		lastTriggerRef.current = null;
	};

	return (
		<section className='relative w-full min-h-[100dvh] md:min-h-[90vh] flex flex-col -mt-16 pt-16'>
			<div className='absolute inset-0 overflow-hidden'>
				<Image
					src='/assets/hero-image.jpg'
					alt='Fresh ingredients on a cutting board'
					fill
					priority
					className='object-cover object-center'
					sizes='100vw'
				/>
				<div className='absolute inset-0 bg-black/25' />
				<div className='absolute inset-0 bg-gradient-to-b from-black/5 via-black/20 to-black/70' />
			</div>

			<div className='relative flex flex-1 flex-col justify-center px-4 pt-16 pb-8 md:pt-20 md:pb-10 overflow-hidden'>
				<div className='mx-auto w-full max-w-5xl min-w-0'>
					<div className='grid gap-4 md:gap-6 lg:grid-cols-[1fr_1.15fr] items-center min-w-0'>
						<div className='space-y-4 min-w-0'>
							<div className='inline-flex items-center backdrop-blur rounded-full bg-white/25 ring-1 ring-white/20 px-3 py-1 text-base text-white/100'>
								Recipe recommender
							</div>

							<h1 className='text-4xl md:text-6xl font-semibold text-white tracking-tight leading-[1.02]'>
								Pick 2 and get 1 recipe
							</h1>

							<p className='text-white/75 text-base md:text-lg max-w-xl leading-relaxed'>
								Try a new idea without wasting time. We save your feedback and build history.
							</p>
						</div>

						<div className='relative min-w-0 max-w-full overflow-hidden rounded-[28px] bg-white/12 backdrop-blur-2xl ring-1 ring-white/25 shadow-[0_12px_40px_-20px_rgba(0,0,0,0.65)] p-5 md:p-6'>
							<div className='pointer-events-none absolute inset-0 rounded-[28px] bg-gradient-to-br from-white/22 via-white/6 to-transparent' />
							<div className='pointer-events-none absolute inset-0 rounded-[28px] ring-1 ring-black/10' />
							<form onSubmit={(e) => e.preventDefault()} className='relative space-y-4 min-w-0'>
								<div className='flex items-center justify-between gap-3'>
									<div className='flex items-center gap-2'>
										<span
											className={`h-2 w-2 rounded-full transition ${step === 1 ? 'bg-primary scale-110 ring-2 ring-primary/50' : 'bg-white/40'}`}
											aria-hidden
										/>
										<span
											className={`h-2 w-2 rounded-full transition ${step === 2 ? 'bg-secondary scale-110 ring-2 ring-secondary/50' : 'bg-white/40'}`}
											aria-hidden
										/>
									</div>
								</div>

								<div className='space-y-2 min-w-0'>
									<div className='flex items-center justify-between'>
										<label className='text-sm font-medium text-white'>Cuisine / Area</label>
									</div>

									<div
										className='w-full min-w-0 overflow-x-auto overflow-y-hidden scroll-smooth py-1 -mx-1 px-1 overscroll-x-contain touch-pan-x'
										style={{
											maxWidth: CAROUSEL_MAX_WIDTH,
											WebkitOverflowScrolling: 'touch',
											scrollbarWidth: 'thin',
										}}
									>
										<div className='flex gap-2 flex-nowrap w-max'>
											{areasLoading ? (
												<span className='text-sm text-white/70'>Loading areas…</span>
											) : (
												areas.map((a) => {
													const isActive = area === a;
													return (
														<button
															key={a}
															type='button'
															onClick={() => {
																const nextArea = isActive ? '' : a;
																dispatch(setHeroArea(nextArea));
																dispatch(setHeroCategory(''));
																if (typeof window !== 'undefined') {
																	if (nextArea) {
																		window.localStorage.setItem(
																			HERO_PREFERENCE_AREA_KEY,
																			nextArea,
																		);
																	} else {
																		window.localStorage.removeItem(
																			HERO_PREFERENCE_AREA_KEY,
																		);
																	}
																	window.localStorage.removeItem(
																		HERO_PREFERENCE_CATEGORY_KEY,
																	);
																}
																setStep(nextArea ? 2 : 1);
															}}
															className={[
																'px-3 py-2 rounded-full text-sm whitespace-nowrap transition shrink-0',
																'focus:outline-none focus:ring-2 focus:ring-primary',
																isActive
																	? 'bg-primary text-white ring-1 ring-primary/50'
																	: 'bg-white/60 hover:bg-white text-grey-dark ring-1 ring-black/10',
															].join(' ')}
														>
															{a}
														</button>
													);
												})
											)}
										</div>
									</div>
								</div>

								<div className={step === 1 ? 'opacity-40 pointer-events-none select-none' : ''}>
									<div className='space-y-2 min-w-0'>
										<div className='flex items-center justify-between'>
											<label htmlFor='constraint' className='text-sm font-medium text-white'>
												Category
											</label>
										</div>
										<div
											className='w-full min-w-0 overflow-x-auto overflow-y-hidden scroll-smooth py-1 -mx-1 px-1 overscroll-x-contain touch-pan-x'
											style={{
												maxWidth: CAROUSEL_MAX_WIDTH,
												WebkitOverflowScrolling: 'touch',
												scrollbarWidth: 'thin',
											}}
										>
											<div className='flex gap-2 flex-nowrap w-max'>
												{categoriesLoading ? (
													<span className='text-sm text-white/70'>Loading categories…</span>
												) : (
													categories.map((c) => {
														const isActive = constraint === c;
														return (
															<button
																key={c}
																type='button'
																onClick={() => {
																	const nextConstraint = isActive ? '' : c;
																	dispatch(setHeroCategory(nextConstraint));
																	if (typeof window !== 'undefined') {
																		if (nextConstraint) {
																			window.localStorage.setItem(
																				HERO_PREFERENCE_CATEGORY_KEY,
																				nextConstraint,
																			);
																		} else {
																			window.localStorage.removeItem(
																				HERO_PREFERENCE_CATEGORY_KEY,
																			);
																		}
																	}
																	if (nextConstraint && area) {
																		triggerRecommendation(area, nextConstraint);
																	}
																}}
																className={[
																	'px-3 py-2 rounded-full text-sm whitespace-nowrap transition shrink-0',
																	'focus:outline-none focus:ring-2 focus:ring-secondary',
																	isActive
																		? 'bg-secondary text-grey-dark ring-1 ring-secondary/50'
																		: 'bg-white/10 text-white hover:bg-white/15 ring-1 ring-white/20',
																].join(' ')}
															>
																{c}
															</button>
														);
													})
												)}
											</div>
										</div>
									</div>
								</div>

								<p className='text-xs text-white/75'>
									{step === 1
										? 'Pick an area to continue.'
										: 'Pick the category and we will auto-recommend.'}
								</p>

								<button
									type='button'
									onClick={handleClear}
									className={`mt-1 text-xs font-medium text-white/85 hover:underline hover:underline-offset-2 hover:text-white transition ${
										area || constraint ? 'opacity-100' : 'opacity-0 pointer-events-none'
									}`}
								>
									Clear selections
								</button>
							</form>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
