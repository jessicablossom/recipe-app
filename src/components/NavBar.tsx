'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { SearchBox } from '@/components/ui/SearchBox';
import { useSearch } from '@/contexts/SearchContext';
import { HeartIcon } from '@/components/icons/HeartIcon';

const NAV_LINKS = [
	{ href: '/', label: 'Home' },
	{ href: '/categories', label: 'Categories' },
] as const;

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

	const safeAreaBg = isHome ? 'rgba(0, 0, 0, 0.75)' : 'rgba(52, 148, 115, 0.85)';

	return (
		<nav
			className={`nav-with-safe-area fixed top-0 left-0 right-0 z-50 w-full border-b backdrop-blur-md transition-colors ${
				isHome ? 'bg-black/75 border-white/10' : 'bg-primary/85 border-primary/70'
			}`}
			style={{ ['--nav-safe-area-bg' as string]: safeAreaBg }}
		>
			<div className='relative z-10 mx-auto flex h-16 max-w-5xl items-center justify-between px-4 md:px-16'>
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
							<HeartIcon filled={pathname === '/favorites'} className="w-6 h-6" />
						</Link>
					</li>
				</ul>
			</div>
			<SearchBox open={searchOpen} onClose={() => setSearchOpen(false)} isHome={isHome} />
		</nav>
	);
}
