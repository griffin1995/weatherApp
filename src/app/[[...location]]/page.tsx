import ForecastGraph from '@/components/ForecastGraph'
import InfoIcon from '@/components/InfoIcon'
import Navbar from '@/components/Navbar'
import { getForecast, getWeather } from '@/lib/constants'
import Image from 'next/image'
import React from 'react'
import { fetchForecast, fetchWeather } from '../fetch/fetchWeather'



async function SearchResult({ params }: { params: { location: string } }) {
    // server side component so fetches take place directly here
    // response mapped to the interfaces for type safety
    const weather = await fetchWeather(params.location || "london") as WeatherResponse
    const forecast = await fetchForecast(params.location || "London") as ForecastResponse
    var bg = "blue-200"

    const weatherCode = weather == undefined ? -1 : weather.weather[0].id

    // set background image based on the weathercode returned by API
    if (weatherCode < 1) {
        bg = "rgb(191, 219, 254)"
    } else if(weatherCode < 300) { // thunderstorm
        bg = "rgb(75, 85, 99)"
    } else if (weatherCode < 500) { // drizzle
        bg = "rgb(209, 213, 219)"
    } else if (weatherCode < 600) { // rain
        bg = "rgb(156, 163, 175)"
    } else if (weatherCode < 700) { // snow
        bg = "rgb(229, 231, 235)"
    } else if (weatherCode < 800) { //atmposphere
        bg = "rgb(191, 219, 254)"
    } else if (weatherCode == 800) { //clear
        bg = "rgb(191, 219, 254)"
    } else if (weatherCode > 800) { // Cloud
        bg = "rgb(209, 213, 219)"
    }

    return (
        { bg } && <div className={` flex flex-col gap-y-5 min-h-screen mx-auto gray- p-5`} style={{ background: bg }}>
            <Navbar />
            <div className=' text-gray-500 mt-5 gap-y-10 flex items-center justify-center flex-col'>
                {(weather == undefined || forecast == undefined) ?
                    <>
                        <h1 className='text-3xl font-bold text-red-400'>Location {"'" + params.location + "'"} not found!</h1>
                    </>
                    :
                    <>
                        <div className='flex items-center justify-center flex-col w-full'>
                            <div className='flex items-center gap-5 w-full'>
                                <h1 className='font-bold text-xl'>{weather.name} - <span className='font-normal'>{new Date().toLocaleDateString()}</span></h1>
                            </div>
                            <div className='flex items-center justify-around w-full'>
                                <div>
                                    <h1 className='text-7xl font-extrabold'>{(weather.main.temp - 273).toPrecision(2)}°</h1>
                                    {weather.weather[0].description.charAt(0).toUpperCase() + weather.weather[0].description.substring(1)}
                                </div>
                                <Image src={`/weather-icons/${weather.weather[0].icon}.png`} alt={weather.weather[0].description} height={100} width={160} />
                            </div>
                        </div>

                        <div className='border rounded-lg p-5 flex justify-between gap-x-10'>
                            <InfoIcon icon='💨' value={weather.wind.speed.toString()} units='Kn' />
                            <InfoIcon icon='🧭' value={weather.wind.deg.toString()} units='°' />
                            <InfoIcon icon='👓' value={(weather.visibility / 1000).toString()} units='km' />
                        </div>
                        <div className=''>
                            {/* only the first 6 values are important for our use case */}
                            <ForecastGraph forecasts={forecast.list.slice(0, 6)} />
                        </div>
                    </>}



            </div>
        </div>

    )
}

export default SearchResult