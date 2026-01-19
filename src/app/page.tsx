import { CategoryList } from '@/components/Categories';
import { Footer } from '@/components/Footer';
import { NavBar } from '@/components/NavBar';
import { Button } from '@/components/ui/Button';

export default function Home() {
	return (
		<div className='flex min-h-screen flex-col'>
			<main className='flex-1 w-full max-w-5xl mx-auto px-4 py-8 md:px-16'>
				<CategoryList />
			</main>
		</div>
	);
}
