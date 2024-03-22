import { getForecast, getWeather, getWeatherByLngLat } from "@/lib/constants"

export const fetchWeather = async (location: string) => {
    const res = await fetch(getWeather(location), /* { cache: "no-cache" }*/)
    if (!res.ok) return undefined
    return res.json()
}

export const fetchWeatherByLngLat = async (lng: number, lat: number) => {
    const res = await fetch(getWeatherByLngLat(lng, lat), /* { cache: "no-cache" }*/)
    if (!res.ok) return undefined
    return res.json()
}

export const fetchForecast = async (location: string) => {
    const res = await fetch(getForecast(location),/* { cache: "no-cache" }*/)
    if (!res.ok) return undefined
    return res.json()
}