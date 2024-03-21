import Graph from "@/components/Graph";
import InfoCard from "@/components/InfoCard";
import { apiUrl, apiUrlForecast } from "@/lib/constants";
import { WeatherData, WeatherResponse } from "@/lib/types";
import {
  CloudDrizzleIcon,
  MoveUpIcon,
  Navigation2,
  ThermometerIcon,
  WindIcon,
} from "lucide-react";

<<<<<<< HEAD

export default async function Home() {
  const LOCATION = "London";
  const resp = await fetch(apiUrlForecast(LOCATION), { cache: "no-cache" });
=======
export default async function Home({newCity = "London"}) {
  const resp = await fetch(apiUrlForecast(newCity), { cache: "no-cache" });
>>>>>>> b9993fee99fcbe7b82041b48ed5e442605f2a852
  const forecasts = (await resp.json()) as WeatherResponse;

  const resp2 = await fetch(apiUrl(newCity), { cache: "no-cache" });
  const WeatherData = (await resp2.json()) as WeatherData;

  const angle = WeatherData.wind.deg;

  return (
    <main className="flex min-h-screen flex-col items-center px-24 gap-y-[3rem]">
      <div className="gap-y-10 flex flex-col items-center justify-center">
        <h1 className="text-secondary text-center text-4xl font-bold">
          {newCity}
        </h1>
        <div className="flex justify-between gap-x-10 w-full">
          <InfoCard
            value={parseFloat((WeatherData.main.temp - 273).toFixed(0))}
            unit="°C"
            icon={ThermometerIcon}
          />
          <InfoCard value={WeatherData.wind.speed} unit="mph" icon={WindIcon} />
          <InfoCard
            value={WeatherData.rain ? WeatherData.rain["3h"] : 0}
            unit="%"
            icon={CloudDrizzleIcon}
          />
        </div>
      </div>
      {/* Graph */}
      <div className="gap-y-10 flex flex-col items-center w-full">
        <h1 className="text-xl font-bold text-white">
          Temperature
          <ThermometerIcon color="white" size={40} className="inline" />
        </h1>
        <Graph data={forecasts} />
        <h1 className="text-xl font-bold text-white">
          Wind <WindIcon color="white" size={40} className="inline" />
        </h1>
        <div className="flex gap-x-[7rem] justify-between">
          <div className="text-6xl text-secondary font-bold">
            <div className="flex items-center">
              <h1>{WeatherData.wind.speed.toFixed(0)}</h1>
              <div className="flex flex-col justify-start">
                <p className="text-sm font-normal">Wind</p>
                <p className="text-xl">mph</p>
              </div>
            </div>
            <div className=" border-t flex items-center">
              <h1>{WeatherData.wind.gust ? WeatherData.wind.gust : 0}</h1>
              <div className="flex flex-col justify-start">
                <p className="text-sm font-normal">Gusts</p>
                <p className="text-xl">mph</p>
              </div>
            </div>
          </div>
          {angle > 0 ? (
            <div className="text-white flex flex-col justify-center items-center">
              <div style={{ transform: `rotate(${WeatherData.wind.deg}deg)` }}>
                <MoveUpIcon size={100} />
              </div>
              <h1 className="text-xl font-bold">{WeatherData.wind.deg}°</h1>
            </div>
          ) : (
            <div></div>
          )}
        </div>
      </div>
    </main>
  );
}
