import './globals.css';
import { Providers } from './providers';
import { NavBar } from '@/components/NavBar';
import { Footer } from '@/components/Footer';
import { FloatingRecommendationButton } from '@/components/FloatingRecommendationButton';
import { MainWithRouteBackground } from '@/components/MainWithRouteBackground';

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang='en'>
			<body className='antialiased flex min-h-screen flex-col'>
				<Providers>
					<NavBar />
					<MainWithRouteBackground>{children}</MainWithRouteBackground>
					<Footer />
					<FloatingRecommendationButton />
				</Providers>
			</body>
		</html>
	);
}
