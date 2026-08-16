import { WeatherIcon } from "./WeatherIcon";
import { getWeatherInfo } from "@/lib/weatherCodes";
import type { HourlyWeather } from "@/lib/types";
import { Droplets } from "lucide-react";

interface HourlyForecastProps {
  hourly: HourlyWeather;
  currentTime: string;
}

export function HourlyForecast({ hourly, currentTime }: HourlyForecastProps) {
  const startIndex = findCurrentHourIndex(hourly.time, currentTime);
  const displayCount = 24;
  const endIndex = Math.min(startIndex + displayCount, hourly.time.length);

  const hours = [];
  for (let i = startIndex; i < endIndex; i++) {
    if (i < 0 || i >= hourly.time.length) continue;
    const isNow = i === startIndex;
    const isDay = isDaytime(hourly.time[i]);
    const info = getWeatherInfo(hourly.weather_code[i], isDay);

    hours.push(
      <div
        key={i}
        className="flex-shrink-0 flex flex-col items-center gap-2 w-20 py-3 px-2 rounded-2xl hover:bg-white/10 transition-colors"
      >
        <span className="text-xs font-medium text-white/70">
          {isNow ? "Now" : formatHour(hourly.time[i])}
        </span>
        <WeatherIcon icon={info.icon} className="w-7 h-7" strokeWidth={1.8} />
        <span className="text-sm font-semibold">
          {Math.round(hourly.temperature_2m[i])}°
        </span>
        {hourly.precipitation_probability[i] > 0 && (
          <span className="flex items-center gap-0.5 text-xs text-sky-200">
            <Droplets className="w-3 h-3" />
            {hourly.precipitation_probability[i]}%
          </span>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-3xl p-5 border border-white/10">
      <h3 className="text-white/80 text-sm font-medium mb-3 px-2">Hourly Forecast</h3>
      <div className="flex gap-1 overflow-x-auto scrollbar-hide pb-1">
        {hours}
      </div>
    </div>
  );
}

function findCurrentHourIndex(times: string[], currentTime: string): number {
  const now = new Date(currentTime).getTime();
  let closest = 0;
  let minDiff = Infinity;
  for (let i = 0; i < times.length; i++) {
    const diff = Math.abs(new Date(times[i]).getTime() - now);
    if (diff < minDiff) {
      minDiff = diff;
      closest = i;
    }
  }
  return closest;
}

function isDaytime(iso: string): boolean {
  const hour = new Date(iso).getHours();
  return hour >= 6 && hour < 19;
}

function formatHour(iso: string): string {
  return new Date(iso).toLocaleTimeString("en-US", {
    hour: "numeric",
    hour12: true,
  });
}
