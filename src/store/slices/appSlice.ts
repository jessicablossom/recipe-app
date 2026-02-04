import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

type HeroPreferenceState = {
	area: string;
	category: string;
};

type AppState = {
	heroPreference: HeroPreferenceState;
};

const initialState: AppState = {
	heroPreference: {
		area: '',
		category: '',
	},
};

const appSlice = createSlice({
	name: 'app',
	initialState,
	reducers: {
		setHeroArea(state, action: PayloadAction<string>) {
			state.heroPreference.area = action.payload;
		},
		setHeroCategory(state, action: PayloadAction<string>) {
			state.heroPreference.category = action.payload;
		},
		clearHeroPreference(state) {
			state.heroPreference.area = '';
			state.heroPreference.category = '';
		},
	},
});

export const { setHeroArea, setHeroCategory, clearHeroPreference } = appSlice.actions;
export const appReducer = appSlice.reducer;
