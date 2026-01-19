import Image from 'next/image';

type ImageFit = 'contain' | 'cover';

type Props = {
	title: string;
	image: string;
	fit?: ImageFit;
};

const fitClasses: Record<ImageFit, string> = {
	contain: 'object-contain',
	cover: 'object-cover',
};

export function Card({ title, image, fit = 'contain' }: Props) {
	return (
		<div className='bg-white border border-grey-medium rounded-xl p-4 text-center transition hover:shadow-md hover:-translate-y-0.5 hover:ring-2 hover:ring-secondary min-h-[250px] flex flex-col'>
			<div className='relative mx-auto h-[140px] w-full overflow-hidden rounded-lg'>
				<Image src={image} alt={title} fill className={fitClasses[fit]} />
			</div>
			<span className='text-lg font-medium text-grey-dark tracking-wide line-clamp-3 mt-2'>{title}</span>
		</div>
	);
}
