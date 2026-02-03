const INGREDIENT_BASE = 'https://www.themealdb.com/images/ingredients';

export type IngredientImageSize = 'small' | 'medium' | 'large';

export function getIngredientImageUrl(ingredientName: string, size: IngredientImageSize = 'small'): string {
	if (!ingredientName || typeof ingredientName !== 'string') return '';
	const slug = ingredientName.trim().replace(/\s+/g, '_');
	if (!slug) return '';
	const suffix = size === 'small' ? '-small' : size === 'medium' ? '-medium' : '-large';
	return `${INGREDIENT_BASE}/${slug}${suffix}.png`;
}
