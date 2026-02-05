'use client';

import { useEffect, useState } from 'react';
import { useRecommendation } from '@/contexts/RecommendationContext';

const FOOTER_BUTTON_ID = 'footer-instant-recommendation';

export function FloatingRecommendationButton() {
	const { openRecommendation } = useRecommendation();
	const [visible, setVisible] = useState(true);

	useEffect(() => {
		const footerEl = document.getElementById(FOOTER_BUTTON_ID);
		if (!footerEl) return;
		const observer = new IntersectionObserver(
			([entry]) => setVisible(!entry.isIntersecting),
			{
				rootMargin: '0px',
				threshold: 0,
			},
		);
		observer.observe(footerEl);
		return () => observer.disconnect();
	}, []);

	if (!visible) return null;

	return (
		<div className='fixed bottom-8 left-0 right-0 z-40 md:hidden px-4 pointer-events-none [&>*]:pointer-events-auto'>
			<button
				type='button'
				onClick={() => openRecommendation()}
				className='w-full rounded-2xl p-4 flex items-center gap-3 bg-white/20 backdrop-blur-2xl ring-1 ring-white/30 shadow-[0_8px_32px_-12px_rgba(0,0,0,0.2)] hover:bg-white/28 hover:ring-white/40 active:scale-[0.98] transition-all focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-transparent'
				aria-label='Open instant recommendation'
			>
				<span
					className='flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/25 text-grey-dark'
					aria-hidden
				>
					<svg
						xmlns='http://www.w3.org/2000/svg'
						viewBox='0 0 24 24'
						fill='none'
						stroke='currentColor'
						strokeWidth='1.5'
						strokeLinecap='round'
						strokeLinejoin='round'
						className='h-5 w-5'
					>
						<path d='m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z' />
					</svg>
				</span>
				<span className='text-left'>
					<span className='block text-xs font-medium uppercase tracking-wider text-white/80'>1 recipe</span>
					<span className='block text-base font-semibold tracking-tight text-white'>
						Instant recommendation
					</span>
				</span>
			</button>
		</div>
	);
}
