'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRecommendation } from '@/contexts/RecommendationContext';
import { useRecommendationFeedback } from '@/contexts/RecommendationFeedbackContext';
import { LikeIcon, DislikeIcon } from '@/components/ui/LikeDislikeIcons';
import { Switch } from '@/components/ui/Switch';

const glassCardEdge =
	'relative overflow-hidden rounded-2xl w-full p-4 md:p-5 transition-all duration-300 ease-out ' +
	'bg-white/20 backdrop-blur-xl ring-1 ring-white/30 shadow-[0_8px_32px_-12px_rgba(0,0,0,0.15)] ' +
	'hover:ring-white/40 hover:shadow-[0_12px_40px_-12px_rgba(0,0,0,0.2)] ' +
	'focus-within:ring-2 focus-within:ring-white/50 focus-within:ring-offset-2 focus-within:ring-offset-primary';

const recommendationButton =
	'relative overflow-hidden rounded-2xl w-full text-left p-4 md:p-5 transition-all duration-300 ease-out cursor-pointer ' +
	'bg-white/20 backdrop-blur-xl ring-1 ring-white/30 shadow-[0_8px_32px_-12px_rgba(0,0,0,0.15)] ' +
	'hover:bg-white/28 hover:ring-white/40 hover:shadow-[0_12px_40px_-12px_rgba(0,0,0,0.2)] hover:-translate-y-0.5 ' +
	'focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-primary ' +
	'active:translate-y-0 active:shadow-[0_4px_20px_-8px_rgba(0,0,0,0.2)]';

function SparkleIcon({ className }: { className?: string }) {
	return (
		<svg
			xmlns='http://www.w3.org/2000/svg'
			viewBox='0 0 24 24'
			fill='none'
			stroke='currentColor'
			strokeWidth='1.5'
			strokeLinecap='round'
			strokeLinejoin='round'
			className={className}
			aria-hidden
		>
			<path d='m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z' />
		</svg>
	);
}

function FooterHeartIcon({
	className,
	filled,
}: {
	className?: string;
	filled: boolean;
}) {
	return (
		<svg
			xmlns='http://www.w3.org/2000/svg'
			viewBox='0 0 24 24'
			fill={filled ? 'currentColor' : 'none'}
			stroke='currentColor'
			strokeWidth='1.5'
			strokeLinecap='round'
			strokeLinejoin='round'
			className={className}
			aria-hidden
		>
			<path d='M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z' />
		</svg>
	);
}

export function Footer() {
	const [heartFilled, setHeartFilled] = useState(false);
	const { openRecommendation } = useRecommendation();
	const { feedbackList, feedbackEnabled, setFeedbackEnabled } = useRecommendationFeedback();

	return (
		<footer className='bg-primary w-full'>
			<div className='mx-auto max-w-5xl px-4 py-8 md:px-16 md:py-10'>
				<div className='flex gap-4 flex-col'>
					<button
						type='button'
						onClick={() => openRecommendation()}
						className={recommendationButton}
						aria-label='Open instant recommendation'
					>
						<div
							className='absolute inset-0 rounded-2xl bg-gradient-to-br from-white/15 via-transparent to-transparent pointer-events-none'
							aria-hidden
						/>
						<div className='relative flex items-start gap-3'>
							<span
								className='flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/25 text-grey-dark'
								aria-hidden
							>
								<SparkleIcon className='h-5 w-5' />
							</span>
							<div className='min-w-0 flex-1'>
								<div className='text-xs font-medium uppercase tracking-wider text-white/80'>
									1 recipe
								</div>
								<div className='mt-0.5 text-base font-semibold tracking-tight text-white'>
									Instant recommendation
								</div>
							</div>
						</div>
					</button>
					<div className={glassCardEdge}>
						<div
							className='absolute inset-0 rounded-2xl bg-gradient-to-br from-white/15 via-transparent to-transparent pointer-events-none'
							aria-hidden
						/>
						<div className='relative flex flex-col gap-4'>
							<div className='flex items-center justify-between gap-3'>
								<div>
									<div className='text-xs font-medium uppercase tracking-wider text-white/80'>
										Feedback
									</div>
								</div>
								<div className='flex items-center gap-2 shrink-0'>
									<span className='text-sm font-medium text-white/70' aria-hidden>
										No
									</span>
									<Switch
										checked={feedbackEnabled}
										onChange={setFeedbackEnabled}
										aria-label='Ask in recommendations and save history'
									/>
									<span className='text-sm font-medium text-white/70' aria-hidden>
										Yes
									</span>
								</div>
							</div>
							<div className='border-t border-white/20 pt-3'>
								<div className='text-xs font-medium uppercase tracking-wider text-white/80 mb-2'>
									History
								</div>
								{feedbackList.length === 0 ? (
									<p className='text-sm text-white/70'>
										{feedbackEnabled
											? 'Answer Yes or No on a recommendation to see history.'
											: 'Turn on the switch to ask and save.'}
									</p>
								) : (
									<ul className='flex flex-col gap-2 max-h-32 overflow-y-auto'>
										{feedbackList.map((entry) => (
											<li
												key={`${entry.idMeal}-${entry.timestamp}`}
												className='flex items-center gap-2'
											>
												<Link
													href={`/meal/${entry.idMeal}`}
													className='flex-1 min-w-0 text-sm font-medium text-white hover:underline truncate block'
												>
													{entry.strMeal}
												</Link>
												<span
													className='shrink-0 flex items-center justify-center rounded-full w-7 h-7 backdrop-blur-sm ring-[1px] ring-white/30 bg-white/20 text-white hover:bg-white/30 hover:ring-white/40 transition-colors'
													aria-label={entry.matched ? 'Matched' : 'Did not match'}
												>
													{entry.matched ? (
														<LikeIcon size={14} variant='filled' />
													) : (
														<DislikeIcon size={14} variant='outline' />
													)}
												</span>
											</li>
										))}
									</ul>
								)}
							</div>
						</div>
					</div>
				</div>
				<p className='mt-8 pt-6 border-t border-white/20 flex items-center justify-center gap-1.5 text-sm text-white'>
					Made with love by Jess
					<button
						type='button'
						onClick={() => setHeartFilled((f) => !f)}
						className={`inline-flex items-center justify-center p-0.5 rounded focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-primary ${heartFilled ? 'text-accent' : ''}`}
						aria-label={heartFilled ? 'Unfill heart' : 'Fill heart'}
					>
						<FooterHeartIcon className='w-4 h-4 shrink-0' filled={heartFilled} />
					</button>
				</p>
			</div>
		</footer>
	);
}
