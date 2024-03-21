// Enables strict usage of client-side imports ensuring Next.js optimizes for client-side only packages
"use client";

// React imports for managing state and side-effects
import React, { useEffect, useState } from "react";
// Importing constants for API URLs
import { apiUrl, apiUrlForecast } from "@/lib/constants";
// Types for weather data responses
import { WeatherData, WeatherResponse } from "@/lib/types";
// Importing icons from lucide-react for visual representation
import {
  CloudDrizzleIcon,
  MoveUpIcon,
  ThermometerIcon,
  WindIcon,
} from "lucide-react";
// Importing reusable InfoCard and Graph components
import InfoCard from "@/components/InfoCard";
import Graph from "@/components/Graph";

// WeatherDashboard component definition
const WeatherDashboard: React.FC = () => {
  // State for managing the current location
  const [location, setLocation] = useState("");
  // State for storing current weather data
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  // State for storing forecast data
  const [forecasts, setForecasts] = useState<WeatherResponse | null>(null);

  // useEffect hook to fetch weather data on component mount
  useEffect(() => {
    // Parsing location from URL parameters or using a default
    const params = new URLSearchParams(window.location.search);
    const LOCATION = params.get("name") || "DefaultLocation";
    setLocation(LOCATION);

    // Async function to fetch weather and forecast data
    const fetchData = async () => {
      try {
        // Fetching forecast data
        const resp = await fetch(apiUrlForecast(LOCATION), {
          cache: "no-cache",
        });
        const forecastsData = (await resp.json()) as WeatherResponse;
        setForecasts(forecastsData);

        // Fetching current weather data
        const resp2 = await fetch(apiUrl(LOCATION), { cache: "no-cache" });
        const weatherData = (await resp2.json()) as WeatherData;
        setWeatherData(weatherData);
      } catch (error) {
        // Logging errors to the console
        console.error("Failed to fetch weather data:", error);
      }
    };

    fetchData();
  }, []); // Empty dependency array to run once on mount

  // Rendering a loading message if data is not yet available
  if (!weatherData || !forecasts) {
    return <div>Loading...</div>;
  }

  //just added to avoid deploy error
const angle = 0
  // Main component render
  return (
    <main className="flex min-h-screen flex-col items-center px-24 gap-y-[3rem]">
      <div className="gap-y-10 flex flex-col items-center justify-center">
        <h1 className="text-secondary text-center text-4xl font-bold">
          {location}
        </h1>
        <div className="flex justify-between gap-x-10 w-full">
          {/* Displaying current temperature, wind speed, and rain percentage using InfoCards */}
          <InfoCard
            value={parseFloat((weatherData.main.temp - 273).toFixed(0))}
            unit="°C"
            icon={ThermometerIcon}
          />
          <InfoCard value={weatherData.wind.speed} unit="mph" icon={WindIcon} />
          <InfoCard
            value={weatherData.rain ? weatherData.rain["3h"] : 0}
            unit="%"
            icon={CloudDrizzleIcon}
          />
        </div>
      </div>
      {/* Section for displaying graphs and additional weather info */}
      <div className="gap-y-10 flex flex-col items-center w-full">
        <h1 className="text-xl font-bold text-white">
          Temperature
          <ThermometerIcon color="white" size={40} className="inline" />
        </h1>
        {/* Graph component for visualizing temperature data */}
        <Graph data={forecasts} />
        <h1 className="text-xl font-bold text-white">
          Wind <WindIcon color="white" size={40} className="inline" />
        </h1>
        <div className="flex gap-x-[7rem] justify-between">
          {/* Displaying wind speed and gusts */}
          <div className="text-6xl text-secondary font-bold">
            <div className="flex items-center">
              <h1>{weatherData.wind.speed.toFixed(0)}</h1>
              <div className="flex flex-col justify-start">
                <p className="text-sm font-normal">Wind</p>
                <p className="text-xl">mph</p>
              </div>
            </div>
            <div className=" border-t flex items-center">
              <h1>{weatherData.wind.gust ? weatherData.wind.gust : 0}</h1>
              <div className="flex flex-col justify-start">
                <p className="text-sm font-normal">Gusts</p>
                <p className="text-xl">mph</p>
              </div>
            </div>
          </div>
          {/* Conditionally rendering the wind direction icon if angle is greater than 0 */}
          {angle > 0 ? (
            <div className="text-white flex flex-col justify-center items-center">
              <div style={{ transform: `rotate(${weatherData.wind.deg}deg)` }}>
                <MoveUpIcon size={100} />
              </div>
              <h1 className="text-xl font-bold">{weatherData.wind.deg}°</h1>
            </div>
          ) : (
            <div>there's nothing here</div>
          )}
        </div>
      </div>
    </main>
  );
};

export default WeatherDashboard;
