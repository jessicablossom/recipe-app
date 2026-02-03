
export const getMealImageLarge = (thumbUrl: string): string => {
	if (!thumbUrl || typeof thumbUrl !== 'string') return thumbUrl;
	const trimmed = thumbUrl.trim();
	if (trimmed.endsWith('/large')) return trimmed;
	return `${trimmed.replace(/\/$/, '')}/large`;
}
