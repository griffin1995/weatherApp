"use client";
import Graph from "@/components/Graph";
import InfoCard from "@/components/InfoCard";
import { WeatherData, WeatherResponse } from "@/lib/types";
import {
  CloudDrizzleIcon,
  MoveUpIcon,
  Navigation2,
  ThermometerIcon,
  WindIcon,
} from "lucide-react";

import { getWeatherData, getForecast } from "@/lib/fetch";
import { useEffect, useState } from "react";

export default function Home({ city = "London" }: { city: String }) {
  const [weatherData, setWeatherData] = useState<WeatherData>(
    {} as WeatherData
  );
  const [forecasts, setForecasts] = useState<WeatherResponse>(
    {} as WeatherResponse
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);

    getWeatherData(city).then((data: WeatherData) => {
      setWeatherData(data);
    });
    getForecast(city).then((data: WeatherResponse) => {
      setForecasts(data);
    });
  }, [city]);

  useEffect(() => {
    if (!weatherData.main || !forecasts.list) {
      return;
    }
    setIsLoading(false);
    updateLocalStorageHistory();
  }, [weatherData, forecasts]);

  const updateLocalStorageHistory = () => {
    const history = localStorage.getItem("history");
    if (history) {
      const historyArray = JSON.parse(history);
      if (historyArray.includes(city)) {
        return;
      }
      historyArray.push(city);
      localStorage.setItem("history", JSON.stringify(historyArray));
    } else {
      localStorage.setItem("history", JSON.stringify([city]));
    }
  };

  return (
    <main className="flex flex-col items-center px-24 gap-y-[3rem]">
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <>
          <div className="gap-y-10 flex flex-col items-center justify-center">
            <h1 className="text-secondary text-center text-4xl font-bold">
              {weatherData?.name}
            </h1>
            <div className="flex justify-between gap-x-10 w-full">
              <InfoCard
                value={parseFloat((weatherData.main.temp - 273).toFixed(0))}
                unit="°C"
                icon={ThermometerIcon}
              />
              <InfoCard
                value={weatherData.wind.speed}
                unit="mph"
                icon={WindIcon}
              />
              <InfoCard
                value={weatherData.rain ? weatherData.rain["3h"] : 0}
                unit="%"
                icon={CloudDrizzleIcon}
              />
            </div>
          </div>

          <div className="gap-y-10 flex flex-col items-center w-full">
            <h1 className="text-xl font-bold text-white">
              Temperature
              <ThermometerIcon color="white" size={40} className="inline" />
            </h1>
            <Graph data={forecasts} />
            <h1 className="text-xl font-bold text-white">
              Wind
              <WindIcon color="white" size={40} className="inline" />
            </h1>
            <div className="flex gap-x-[7rem] justify-between">
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
              {weatherData.wind.deg > 0 ? (
                <div className="text-white flex flex-col justify-center items-center">
                  <div
                    style={{ transform: `rotate(${weatherData.wind.deg}deg)` }}
                  >
                    <MoveUpIcon size={100} />
                  </div>
                  <h1 className="text-xl font-bold">{weatherData.wind.deg}°</h1>
                </div>
              ) : (
                <div>No wind today</div>
              )}
            </div>
          </div>
        </>
      )}
    </main>
  );
}
