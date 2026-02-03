import { getCategories } from '@/services/meals';
import { Card } from './Card';
import Link from 'next/link';

const glassTitle =
	'inline-flex w-fit items-center rounded-full bg-white/20 backdrop-blur-md ring-1 ring-white/30 px-4 py-2 text-grey-dark';

export async function CategoryList() {
	const categories = await getCategories();
	return (
		<div className='flex flex-col gap-6 w-full h-full'>
			<h1 className={`text-3xl font-bold ${glassTitle}`}>Categories</h1>
			<div className='w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
				{categories.map((category) => (
					<Link key={category.idCategory} href={`/category/${encodeURIComponent(category.strCategory)}`}>
						<Card title={category.strCategory} image={category.strCategoryThumb} imageGradient />
					</Link>
				))}
			</div>
		</div>
	);
}
