import './globals.css';
import { Providers } from './providers';
import { NavBar } from '@/components/NavBar';
import { Footer } from '@/components/Footer';

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang='en'>
			<body className='antialiased flex min-h-screen flex-col'>
				<Providers>
					<NavBar />
					<main className='flex-1 w-full'>{children}</main>
					<Footer />
				</Providers>
			</body>
		</html>
	);
}
