import { env } from "process"
const APIKEY = "65ad34ef51cc68f1567d459fc99efa63" // base


export const apiUrl = (location: string) => {
	return `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${APIKEY}`;
};

export const apiUrlForecast = (location: string) => `https://api.openweathermap.org/data/2.5/forecast?q=${location}&appid=${APIKEY}`;
