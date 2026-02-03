'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { SearchBox } from '@/components/ui/SearchBox';
import { useSearch } from '@/contexts/SearchContext';

const NAV_LINKS = [
	{ href: '/', label: 'Home' },
	{ href: '/categories', label: 'Categories' },
] as const;

function HeartIcon({ filled }: { filled: boolean }) {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 24 24"
			fill={filled ? 'currentColor' : 'none'}
			stroke={filled ? 'none' : 'currentColor'}
			strokeWidth="1.5"
			strokeLinecap="round"
			strokeLinejoin="round"
			className="w-6 h-6"
			aria-hidden
		>
			<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
		</svg>
	);
}

function navLinkClass(
	pathname: string,
	href: string,
	isHome: boolean,
	searchOpen: boolean,
): string {
	const base = 'inline-block py-2 transition';
	const active = pathname === href && !searchOpen;
	if (active) {
		return isHome
			? `${base} text-primary border-b-[3px] border-primary font-medium`
			: `${base} text-white border-b-[3px] border-white font-medium`;
	}
	return `${base} text-white hover:text-white/80`;
}

export function NavBar() {
	const pathname = usePathname();
	const isHome = pathname === '/';
	const { searchOpen, setSearchOpen } = useSearch();

	useEffect(() => {
		setSearchOpen(false);
	}, [pathname, setSearchOpen]);

	return (
		<nav
			className={`fixed top-0 left-0 right-0 z-50 w-full border-b backdrop-blur-md transition-colors ${
				isHome ? 'bg-black/75 border-white/10' : 'bg-primary/85 border-primary/70'
			}`}
		>
			<div className='mx-auto flex h-16 max-w-5xl items-center justify-between px-4 md:px-16'>
				<div className='flex items-center gap-6'>
					<Link href='/' className='flex items-end gap-2'>
						<Image src='/assets/icon-filled.png' alt='Recipe App icon' width={35} height={35} />
						<span className='hidden sm:inline text-white text-xl font-medium'>Recipe app</span>
					</Link>
				</div>
				<ul className='flex items-center gap-6'>
					{NAV_LINKS.map(({ href, label }) => (
						<li key={href}>
							<Link href={href} className={navLinkClass(pathname, href, isHome, searchOpen)}>
								{label}
							</Link>
						</li>
					))}
					<li>
						<button
							type="button"
							onClick={() => setSearchOpen((open) => !open)}
							className={
								searchOpen
									? isHome
										? 'inline-flex items-center justify-center py-2 transition text-primary border-b-[3px] border-primary font-medium'
										: 'inline-flex items-center justify-center py-2 transition text-white border-b-[3px] border-white font-medium'
									: 'inline-flex items-center justify-center py-2 transition text-white hover:text-white/80'
							}
							aria-label="Search"
							aria-expanded={searchOpen}
						>
							Search
						</button>
					</li>
					<li>
						<Link
							href="/favorites"
							className={navLinkClass(pathname, '/favorites', isHome, searchOpen)}
							aria-label="Favorites"
						>
							<HeartIcon filled={pathname === '/favorites'} />
						</Link>
					</li>
				</ul>
			</div>
			<SearchBox open={searchOpen} onClose={() => setSearchOpen(false)} isHome={isHome} />
		</nav>
	);
}
