import { apiUrl, apiUrlForecast } from '../lib/constants';
import type { WeatherData, WeatherResponse } from '../lib/types';

export const getWeatherData: Function = async (city: string) => {
	const resp = await fetch(apiUrl(city), { cache: 'no-cache' });
	if (!resp.ok) {
		return null;
	}
	const WeatherData = (await resp.json()) as WeatherData;

	return WeatherData;
};

export const getForecast: Function = async (city: string) => {
	let resp = await fetch(apiUrlForecast(city), { cache: 'no-cache' });
	if (!resp.ok) {
		return null;
	}
	const forecast = (await resp.json()) as WeatherResponse;

	return forecast;
};
