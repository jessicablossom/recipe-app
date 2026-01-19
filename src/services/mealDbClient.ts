import axios from 'axios';

export const mealdbClient = axios.create({
	baseURL: 'https://www.themealdb.com/api/json/v1/1',
	timeout: 8000,
});
