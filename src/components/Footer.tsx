'use client';

import { usePersistedPreference } from '@/hooks/usePersistedPreference';
import { Switch } from '@/components/ui/Switch';

const SAVE_FEEDBACK_KEY = 'save-feedback';

const glassCard =
	'rounded-2xl bg-white/15 backdrop-blur-xl ring-1 ring-white/25 shadow-[0_8px_32px_-16px_rgba(0,0,0,0.2)] p-4 md:p-5';

export function Footer() {
	const [saveFeedback, setSaveFeedback] = usePersistedPreference(SAVE_FEEDBACK_KEY, true);

	return (
		<footer className='bg-primary w-full'>
			<div className='mx-auto max-w-5xl px-4 py-8 md:px-16 md:py-10'>
				<div className='grid gap-4 md:grid-cols-3 md:gap-6'>
					<div className={glassCard}>
						<div className='text-sm text-grey-dark/70'>1 receta</div>
						<div className='text-lg font-medium text-grey-dark'>Recomendación instantánea</div>
					</div>
					<div className={`${glassCard} flex flex-col gap-3`}>
						<div className='text-sm text-grey-dark/70'>Yes / No</div>
						<div className='text-lg font-medium text-grey-dark'>Feedback guardado</div>
						<div className='flex items-center justify-between gap-3'>
							<span
								className={`text-sm font-medium transition-colors ${!saveFeedback ? 'text-primary' : 'text-grey-dark/60'}`}
								aria-hidden
							>
								No
							</span>
							<Switch
								checked={saveFeedback}
								onChange={setSaveFeedback}
								aria-label='Guardar feedback: Sí o No'
							/>
							<span
								className={`text-sm font-medium transition-colors ${saveFeedback ? 'text-primary' : 'text-grey-dark/60'}`}
								aria-hidden
							>
								Sí
							</span>
						</div>
					</div>
					<div className={glassCard}>
						<div className='text-sm text-grey-dark/70'>Historial</div>
						<div className='text-lg font-medium text-grey-dark'>Preferencias persistentes</div>
					</div>
				</div>
			</div>
		</footer>
	);
}
