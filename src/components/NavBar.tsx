import Image from 'next/image';
import Link from 'next/link';

export function NavBar() {
	return (
		<nav className='w-full bg-primary border-b border-grey-medium'>
			<div className='mx-auto flex h-16 max-w-5xl items-center justify-between px-4 md:px-16'>
				<div className='flex items-center gap-6'>
					<div className='flex items-end gap-2'>
						<Image src='/assets/icon-filled.png' alt='Recipe App icon' width={35} height={35} />
						<span className='text-grey-light text-xl font-medium'>Recetas app</span>
					</div>
				</div>
				<ul className='flex gap-6'>
					<li>
						<Link href='/' className='text-grey-light hover:text-warning transition'>
							Home
						</Link>
					</li>
					<li>
						<Link href='/search' className='text-grey-light hover:text-warning transition'>
							Búsqueda
						</Link>
					</li>
					<li>
						<Link href='/faqs' className='text-grey-light hover:text-warning transition'>
							FAQs
						</Link>
					</li>
				</ul>
			</div>
		</nav>
	);
}
