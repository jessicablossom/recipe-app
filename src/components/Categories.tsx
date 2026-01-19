import { getCategories } from '@/services/meals';
import { Card } from './Card';
import Link from 'next/link';

export async function CategoryList() {
	const categories = await getCategories();
	return (
		<div className='flex flex-col gap-4 w-full h-full'>
			<h1 className='text-3xl font-bold text-grey-dark'>Categorias</h1>
			<div className='w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
				{categories.map((category) => (
					<Link key={category.idCategory} href={`/category/${encodeURIComponent(category.strCategory)}`}>
						<Card
							key={category.idCategory}
							title={category.strCategory}
							image={category.strCategoryThumb}
						/>
					</Link>
				))}
			</div>
		</div>
	);
}
