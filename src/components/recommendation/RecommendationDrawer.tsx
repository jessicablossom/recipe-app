'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { FavoriteButton } from '@/components/ui/FavoriteButton';
import { LikeIcon, DislikeIcon } from '@/components/ui/LikeDislikeIcons';
import { getMealImageLarge } from '@/utils/mealImage';
import { useRecommendationFeedback } from '@/contexts/RecommendationFeedbackContext';
import { RecipeImage } from '../ui/RecipeImage';

type MealDetail = {
	idMeal: string;
	strMeal: string;
	strMealThumb: string;
	strCategory: string;
	strArea: string;
	strInstructions: string;
};

const PREVIEW_CHARS = 219;

function firstParagraphPreview(instructions: string): string {
	const trimmed = instructions.trim();
	if (!trimmed) return '';
	const split = trimmed.split(/\r?\n\r?\n/);
	const first = split[0]?.trim() ?? trimmed;
	if (first.length <= PREVIEW_CHARS) return first;
	return first.slice(0, PREVIEW_CHARS).trim() + '…';
}

export type RecommendationDrawerParams = { area: string; category: string } | null;

type Props = {
	open: boolean;
	onClose: () => void;
	params?: RecommendationDrawerParams;
};

function CloseIcon({ className }: { className?: string }) {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
			className={className}
			aria-hidden
		>
			<path d="M18 6 6 18" />
			<path d="m6 6 12 12" />
		</svg>
	);
}

const glassPanel =
	'rounded-2xl bg-white/80 backdrop-blur-xl ring-1 ring-white/40 shadow-[0_8px_32px_-12px_rgba(0,0,0,0.08)]';
const glassBadge =
	'inline-flex items-center rounded-full bg-white/30 ring-1 ring-white/30 px-3 py-1 text-sm font-medium text-grey-dark';
/* Ghost iOS 2026: minimal fill, thin ring, soft hover */
const ghostButtonBase =
	'flex-1 flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-medium transition-all duration-200 ' +
	'bg-white/10 backdrop-blur-sm ring-[1px] ring-white/30 hover:bg-white/20 hover:ring-white/40 ' +
	'focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-white/80';
const ghostCloseButton =
	'flex h-10 w-10 items-center justify-center rounded-full transition-all duration-200 ' +
	'bg-white/0 ring-[1px] ring-white/25 text-grey-dark hover:bg-white/15 hover:ring-white/40 ' +
	'focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-white/80';

export function RecommendationDrawer({ open, onClose, params = null }: Props) {
	const [meal, setMeal] = useState<MealDetail | null>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const feedbackGivenForMealRef = useRef<string | null>(null);
	const { addFeedback, feedbackEnabled } = useRecommendationFeedback();

	useEffect(() => {
		feedbackGivenForMealRef.current = null;
	}, [meal?.idMeal]);

	const fetchRandom = useCallback(async () => {
		setLoading(true);
		setError(null);
		try {
			const res = await fetch('/api/meals/random');
			if (!res.ok) throw new Error('Could not fetch recipe');
			const data = (await res.json()) as MealDetail;
			setMeal(data);
		} catch (e) {
			setError(e instanceof Error ? e.message : 'Error loading');
			setMeal(null);
		} finally {
			setLoading(false);
		}
	}, []);

	const fetchByAreaAndCategory = useCallback(async (area: string, category: string) => {
		setLoading(true);
		setError(null);
		try {
			const res = await fetch(
				`/api/meals/recommend?area=${encodeURIComponent(area)}&category=${encodeURIComponent(category)}`,
			);
			if (!res.ok) {
				const err = await res.json().catch(() => ({}));
				throw new Error(
					(res.status === 404 && err?.error) || 'No recipe found for that combination.',
				);
			}
			const data = (await res.json()) as MealDetail;
			setMeal(data);
		} catch (e) {
			setError(e instanceof Error ? e.message : 'Error loading');
			setMeal(null);
		} finally {
			setLoading(false);
		}
	}, []);

	const fetchMeal = useCallback(() => {
		if (params?.area && params?.category) {
			fetchByAreaAndCategory(params.area, params.category);
		} else {
			fetchRandom();
		}
	}, [params?.area, params?.category, fetchRandom, fetchByAreaAndCategory]);

	useEffect(() => {
		if (open) fetchMeal();
	}, [open, fetchMeal]);

	useEffect(() => {
		if (!open) return;
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === 'Escape') onClose();
		};
		window.addEventListener('keydown', handleKeyDown);
		return () => window.removeEventListener('keydown', handleKeyDown);
	}, [open, onClose]);

	if (!open) return null;

	const overlayClass = 'fixed inset-0 z-40 bg-black/50 backdrop-blur-md cursor-default';
	const panelClass =
		'fixed right-0 top-0 bottom-0 z-50 w-full max-w-md overflow-y-auto bg-white/80 backdrop-blur-xl ring-1 ring-white/40 shadow-xl flex flex-col';

	const content = (
		<>
			<button
				type="button"
				className={overlayClass}
				onClick={onClose}
				aria-label="Close"
				tabIndex={-1}
			/>
			<div className="fixed inset-0 z-50 pointer-events-none" aria-hidden>
				<div className={`${panelClass} pointer-events-auto`}>
						<div className="sticky top-0 z-10 flex items-center justify-between p-4 bg-white/70 backdrop-blur-xl border-b border-white/30">
							<h2 className="text-lg font-semibold text-grey-dark">Instant recommendation</h2>
							<button
								type="button"
								onClick={onClose}
								className={ghostCloseButton}
								aria-label="Close"
							>
								<CloseIcon className="w-5 h-5" />
							</button>
						</div>
						<div className="flex-1 p-4 space-y-4">
							{loading && (
								<div className="space-y-4" aria-hidden>
									<div className="rounded-2xl bg-grey-medium/40 backdrop-blur-xl ring-1 ring-grey-medium/50 aspect-[4/3] animate-skeleton-pulse" />
									<div className="rounded-2xl bg-grey-medium/40 backdrop-blur-xl ring-1 ring-grey-medium/50 h-24 animate-skeleton-pulse" />
									<div className="rounded-2xl bg-grey-medium/40 backdrop-blur-xl ring-1 ring-grey-medium/50 h-32 animate-skeleton-pulse" />
								</div>
							)}
							{error && (
								<div className={`${glassPanel} p-6 text-center text-grey-dark`}>
									<p>{error}</p>
<button
											type="button"
											onClick={fetchMeal}
											className="mt-4 rounded-xl px-4 py-2.5 text-sm font-medium bg-white/15 backdrop-blur-sm ring-[1px] ring-white/35 text-grey-dark hover:bg-white/25 hover:ring-white/45 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2"
										>
											Retry
										</button>
								</div>
							)}
							{!loading && !error && meal && (
								<>
									<div className={`${glassPanel} overflow-hidden aspect-[4/3] relative ring-1 ring-white/30`}>
										<RecipeImage
											src={getMealImageLarge(meal.strMealThumb)}
											alt={meal.strMeal}
											className="object-cover"
											sizes="(max-width: 448px) 100vw, 448px"
											roundedClass="rounded-2xl"
										/>
										<div
											className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"
											aria-hidden
										/>
									</div>
									<div className={`${glassPanel} p-4`}>
										<div className="flex items-start justify-between gap-3">
											<div className="min-w-0 flex-1">
												<h3 className="text-xl font-bold text-grey-dark truncate">{meal.strMeal}</h3>
												<div className="mt-2 flex flex-wrap gap-2">
													<span className={glassBadge}>{meal.strCategory}</span>
													<span className={glassBadge}>{meal.strArea}</span>
												</div>
											</div>
											<FavoriteButton favoriteId={`meal:${meal.idMeal}`} />
										</div>
									</div>
									{meal.strInstructions && (
										<div className={`${glassPanel} p-4`}>
											<p className="text-sm text-grey-dark leading-relaxed line-clamp-4 whitespace-pre-wrap">
												{firstParagraphPreview(meal.strInstructions)}
											</p>
											<Link
												href={`/meal/${meal.idMeal}`}
												onClick={onClose}
												className="mt-3 inline-block text-sm font-medium text-primary hover:underline"
											>
												View full recipe
											</Link>
										</div>
									)}
									{feedbackEnabled && (
										<div className={`${glassPanel} p-4`}>
											<p className="text-sm font-medium text-grey-dark mb-2">Did it match your preference?</p>
											<div className="flex gap-2">
												<button
													type="button"
													onClick={() => {
														if (feedbackGivenForMealRef.current === meal.idMeal) return;
														feedbackGivenForMealRef.current = meal.idMeal;
														addFeedback({
															idMeal: meal.idMeal,
															strMeal: meal.strMeal,
															strMealThumb: meal.strMealThumb,
															timestamp: Date.now(),
															area: params?.area,
															category: params?.category,
															matched: true,
														});
													}}
													className={`${ghostButtonBase} feedback-btn-yes ring-0`}
													aria-label="Yes, it matched"
												>
													<LikeIcon size={20} />
													<span>Yes</span>
												</button>
												<button
													type="button"
													onClick={() => {
														if (feedbackGivenForMealRef.current === meal.idMeal) return;
														feedbackGivenForMealRef.current = meal.idMeal;
														addFeedback({
															idMeal: meal.idMeal,
															strMeal: meal.strMeal,
															strMealThumb: meal.strMealThumb,
															timestamp: Date.now(),
															area: params?.area,
															category: params?.category,
															matched: false,
														});
													}}
													className={`${ghostButtonBase} feedback-btn-no ring-0`}
													aria-label="No, it did not match"
												>
													<DislikeIcon size={20} />
													<span>No</span>
												</button>
											</div>
										</div>
									)}
									<div className="flex flex-col gap-2">
										<button
											type="button"
											onClick={fetchMeal}
											className="w-full rounded-2xl bg-primary py-3 text-sm font-medium text-white hover:opacity-95 transition focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-white/80"
										>
											New recommendation
										</button>
									</div>
								</>
							)}
						</div>
					</div>
			</div>
		</>
	);

	if (typeof document === 'undefined') return null;
	return createPortal(content, document.body);
}
