import { WeatherIcon } from "./WeatherIcon";
import { getWeatherInfo, getWeatherLabel } from "@/lib/weatherCodes";
import type { DailyWeather } from "@/lib/types";
import { Droplets, Wind } from "lucide-react";

interface DailyForecastProps {
  daily: DailyWeather;
}

export function DailyForecast({ daily }: DailyForecastProps) {
  const days = daily.time.slice(0, 7);
  const allTemps = daily.temperature_2m_max.concat(daily.temperature_2m_min);
  const globalMax = Math.max(...allTemps);
  const globalMin = Math.min(...allTemps);
  const range = Math.max(globalMax - globalMin, 1);

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-3xl p-5 border border-white/10">
      <h3 className="text-white/80 text-sm font-medium mb-3 px-2">7-Day Forecast</h3>
      <div className="flex flex-col">
        {days.map((day, i) => {
          const info = getWeatherInfo(daily.weather_code[i], true);
          const dayMax = daily.temperature_2m_max[i];
          const dayMin = daily.temperature_2m_min[i];
          const leftPct = ((dayMin - globalMin) / range) * 100;
          const widthPct = ((dayMax - dayMin) / range) * 100;

          return (
            <div
              key={day}
              className="flex items-center gap-3 py-2.5 border-b border-white/5 last:border-0"
            >
              <span className="w-12 text-sm font-medium text-white/90 flex-shrink-0">
                {i === 0 ? "Today" : formatDay(day)}
              </span>
              <WeatherIcon icon={info.icon} className="w-6 h-6 flex-shrink-0" strokeWidth={1.8} />
              <div className="hidden sm:block flex-1 min-w-0">
                <p className="text-xs text-white/60 truncate">{getWeatherLabel(daily.weather_code[i])}</p>
              </div>
              <div className="flex items-center gap-2 flex-1 sm:flex-initial">
                {daily.precipitation_probability_max[i] > 0 && (
                  <span className="flex items-center gap-0.5 text-xs text-sky-200 w-10">
                    <Droplets className="w-3 h-3" />
                    {daily.precipitation_probability_max[i]}%
                  </span>
                )}
                <span className="text-sm text-white/50 w-8 text-right">
                  {Math.round(dayMin)}°
                </span>
                <div className="relative w-20 h-1.5 bg-white/15 rounded-full overflow-hidden">
                  <div
                    className="absolute h-full rounded-full bg-gradient-to-r from-sky-400 via-amber-400 to-orange-500"
                    style={{ left: `${leftPct}%`, width: `${Math.max(widthPct, 8)}%` }}
                  />
                </div>
                <span className="text-sm font-medium w-8">
                  {Math.round(dayMax)}°
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function formatDay(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", { weekday: "short" });
}
