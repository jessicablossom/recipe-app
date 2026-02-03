'use client';

import { useState } from 'react';
import Image from 'next/image';

const FALLBACK_LOGO = '/assets/icon-filled.png';

const glassFallback =
	'absolute inset-0 flex items-center justify-center bg-white/20 backdrop-blur-2xl ring-[1px] ring-white/25 shadow-[0_8px_32px_-8px_rgba(0,0,0,0.08)]';
const fallbackOverlay = 'absolute inset-0 bg-black/10 pointer-events-none';

type Props = {
	src: string;
	alt: string;
	fill?: boolean;
	className?: string;
	sizes?: string;
	priority?: boolean;
	quality?: number;
	roundedClass?: string;
};

function hasValidImageSrc(src: string): boolean {
	if (!src || typeof src !== 'string') return false;
	const t = src.trim();
	return t.length > 0 && (t.startsWith('http') || t.startsWith('/'));
}

export function RecipeImage({
	src,
	alt,
	fill = true,
	className = 'object-cover',
	sizes,
	priority,
	quality,
	roundedClass = 'rounded-t-2xl',
}: Props) {
	const [useFallback, setUseFallback] = useState(!hasValidImageSrc(src));

	const showFallback = useFallback || !hasValidImageSrc(src);

	if (showFallback) {
		return (
			<div className={`absolute inset-0 size-full ${roundedClass} overflow-hidden`}>
				<div className={`${glassFallback} ${roundedClass} size-full relative`}>
					<div className={`${fallbackOverlay} ${roundedClass} size-full`} aria-hidden />
					<Image
						src={FALLBACK_LOGO}
						alt={alt}
						width={80}
						height={80}
						className="relative z-10 opacity-90"
						aria-hidden={alt !== ''}
					/>
				</div>
			</div>
		);
	}

	return (
		<Image
			src={src}
			alt={alt}
			fill={fill}
			className={className}
			sizes={sizes}
			priority={priority}
			quality={quality}
			onError={() => setUseFallback(true)}
		/>
	);
}
