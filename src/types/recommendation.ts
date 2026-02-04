export type RecommendationParams = {
	area: string;
	category: string;
};

export type RecommendationFeedbackEntry = {
	idMeal: string;
	strMeal: string;
	strMealThumb: string;
	timestamp: number;
	area?: string;
	category?: string;
	matched: boolean;
};

