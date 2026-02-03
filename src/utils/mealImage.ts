export function hasValidRecipeImage(thumb: string | null | undefined): boolean {
	if (!thumb || typeof thumb !== 'string') return false;
	const t = thumb.trim();
	return t.length > 0 && (t.startsWith('http') || t.startsWith('/'));
}

export const getMealImageLarge = (thumbUrl: string): string => {
	if (!thumbUrl || typeof thumbUrl !== 'string') return thumbUrl;
	const trimmed = thumbUrl.trim();
	if (trimmed.endsWith('/large')) return trimmed;
	return `${trimmed.replace(/\/$/, '')}/large`;
}
