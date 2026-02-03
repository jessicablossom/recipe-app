'use client';

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

export function Footer() {
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
						aria-label='Abrir recomendación instantánea'
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
									1 receta
								</div>
								<div className='mt-0.5 text-base font-semibold tracking-tight text-white'>
									Recomendación instantánea
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
										aria-label='Preguntar en recomendaciones y guardar historial'
									/>
									<span className='text-sm font-medium text-white/70' aria-hidden>
										Sí
									</span>
								</div>
							</div>
							<div className='border-t border-white/20 pt-3'>
								<div className='text-xs font-medium uppercase tracking-wider text-white/80 mb-2'>
									Historial
								</div>
								{feedbackList.length === 0 ? (
									<p className='text-sm text-white/70'>
										{feedbackEnabled
											? 'Responde Sí o No en una recomendación para ver el historial.'
											: 'Activa el switch para preguntar y guardar.'}
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
													aria-label={entry.matched ? 'Coincidió' : 'No coincidió'}
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
			</div>
		</footer>
	);
}
