//import { env } from "process"
// const APIKEY = "65ad34ef51cc68f1567d459fc99efa63" // base

const APIKEY = '664a5c83e36aa6a36f36ff14c3f3b383'; // my

export const apiUrl = (location: string) => {
	return `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${APIKEY}`;
};

export const apiUrlForecast = (location: string) => `https://api.openweathermap.org/data/2.5/forecast?q=${location}&appid=${APIKEY}`;
