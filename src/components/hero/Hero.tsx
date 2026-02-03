'use client';

import Image from 'next/image';
import { useState } from 'react';

type Step = 1 | 2;

const AREAS = ['Italian', 'Mexican', 'Japanese', 'French', 'Indian', 'Chinese'] as const;
const CONSTRAINTS = ['Vegetarian', 'Seafood', 'Beef', 'Chicken', 'Dessert'] as const;

export function Hero() {
	const [step, setStep] = useState<Step>(1);
	const [area, setArea] = useState<string>('');
	const [constraint, setConstraint] = useState<string>('');

	const onNext = () => {
		if (step === 1 && area) setStep(2);
	};

	const onBack = () => {
		if (step === 2) setStep(1);
	};

	const onSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (!area || !constraint) return;
	};

	const buttonBase =
		'inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-accent disabled:opacity-40 disabled:cursor-not-allowed';
	const buttonPrimary = `${buttonBase} bg-white text-grey-dark shadow-[0_14px_40px_-28px_rgba(0,0,0,0.9)] hover:opacity-95`;
	const buttonGlass = `${buttonBase} bg-white/10 text-white ring-1 ring-white/20 hover:bg-white/15`;

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

			<div className='relative flex flex-1 flex-col justify-center px-4 pt-16 pb-8 md:pt-20 md:pb-10'>
				<div className='mx-auto w-full max-w-5xl'>
					<div className='grid gap-4 md:gap-6 lg:grid-cols-[1.1fr_0.9fr] items-center'>
						<div className='space-y-4'>
							<div className='inline-flex items-center rounded-full bg-white/15 ring-1 ring-white/20 px-3 py-1 text-sm text-white/85'>
								Recomendador de recetas
							</div>

							<h1 className='text-4xl md:text-6xl font-semibold text-white tracking-tight leading-[1.02]'>
								Elegí 2 preferencias y te damos 1 receta
							</h1>

							<p className='text-white/75 text-base md:text-lg max-w-xl leading-relaxed'>
								Probá una idea nueva sin perder tiempo. Guardamos tu feedback y armamos historial.
							</p>
						</div>

						<div
							className='
    relative
    rounded-[28px]
    bg-white/12
    backdrop-blur-2xl
    ring-1 ring-white/25
    shadow-[0_12px_40px_-20px_rgba(0,0,0,0.65)]
    p-5 md:p-6
  '
						>
							<div className='pointer-events-none absolute inset-0 rounded-[28px] bg-gradient-to-br from-white/22 via-white/6 to-transparent' />
							<div className='pointer-events-none absolute inset-0 rounded-[28px] ring-1 ring-black/10' />
							<form onSubmit={onSubmit} className='relative space-y-4'>
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
									<div className='flex items-center gap-2'>
										{step === 2 && (
											<button type='button' onClick={onBack} className={buttonGlass}>
												Volver
											</button>
										)}
										{step === 1 ? (
											<button
												type='button'
												onClick={onNext}
												disabled={!area}
												className={buttonPrimary}
											>
												Siguiente
											</button>
										) : (
											<button type='submit' disabled={!constraint} className={buttonPrimary}>
												Recomendar
											</button>
										)}
									</div>
								</div>

								<div className='space-y-2'>
									<div className='flex items-center justify-between'>
										<label className='text-sm font-medium text-white'>Cocina / Área</label>
										{area ? <span className='text-xs text-primary/90'>Seleccionado</span> : null}
									</div>

									<div className='flex flex-wrap gap-2'>
										{AREAS.map((a) => {
											const isActive = area === a;
											return (
												<button
													key={a}
													type='button'
													onClick={() => {
														setArea(a);
														setConstraint('');
													}}
													className={[
														'px-3 py-2 rounded-full text-sm transition',
														'focus:outline-none focus:ring-2 focus:ring-primary',
														isActive
															? 'bg-primary text-white ring-1 ring-primary/50'
															: 'bg-white/60 hover:bg-white text-grey-dark ring-1 ring-black/10',
													].join(' ')}
												>
													{a}
												</button>
											);
										})}
									</div>
								</div>

								<div className={step === 1 ? 'opacity-40 pointer-events-none select-none' : ''}>
									<div className='space-y-2'>
										<label htmlFor='constraint' className='text-sm font-medium text-white'>
											Restricción secundaria
										</label>
										<div className='flex flex-wrap gap-2'>
											{CONSTRAINTS.map((c) => {
												const isActive = constraint === c;
												return (
													<button
														key={c}
														type='button'
														onClick={() => setConstraint(c)}
														className={[
															'px-3 py-2 rounded-full text-sm transition',
															'focus:outline-none focus:ring-2 focus:ring-secondary',
															isActive
																? 'bg-secondary text-grey-dark ring-1 ring-secondary/50'
																: 'bg-white/10 text-white hover:bg-white/15 ring-1 ring-white/20',
														].join(' ')}
													>
														{c}
													</button>
												);
											})}
										</div>
									</div>
								</div>

								<p className='text-xs text-white/75'>
									{step === 1
										? 'Elegí un área para continuar.'
										: 'Elegí la restricción y pedí una recomendación.'}
								</p>
							</form>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
