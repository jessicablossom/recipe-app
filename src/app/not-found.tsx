import Image from 'next/image';
import Link from 'next/link';

const glassPanel = 'rounded-2xl bg-white/25 ring-1 ring-white/30 shadow-[0_8px_32px_-12px_rgba(0,0,0,0.08)]';
const glassButton =
	'inline-flex items-center rounded-full bg-white/30 ring-1 ring-white/30 px-4 py-2.5 text-sm font-medium text-grey-dark transition hover:bg-white/40 hover:ring-white/40 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-transparent';

export default function NotFound() {
	return (
		<div className='relative flex min-h-screen flex-col items-center justify-center'>
			<div className='absolute inset-0 overflow-hidden'>
				<Image
					src='/assets/hero-image.jpg'
					alt=''
					fill
					className='object-cover object-bottom blur-2xl scale-105'
					sizes='100vw'
					priority
				/>
				<div className='absolute inset-0 bg-grey-light/75' aria-hidden />
			</div>

			<main className='relative flex flex-col items-center justify-center gap-6 px-4 py-8'>
				<div className={`w-full max-w-md p-8 text-center ${glassPanel}`}>
					<h1 className='text-2xl font-bold tracking-tight text-grey-dark md:text-3xl'>
						Page not found
					</h1>
					<p className='mt-3 text-grey-dark/90'>The link you followed does not exist or is no longer available.</p>
					<div className='mt-6 flex flex-wrap items-center justify-center gap-3'>
						<Link href='/' className={glassButton}>
							Home
						</Link>
						<Link href='/categories' className={glassButton}>
							Categories
						</Link>
					</div>
				</div>
			</main>
		</div>
	);
}
