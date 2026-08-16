import { WeatherIcon } from "./WeatherIcon";
import { getWeatherInfo } from "@/lib/weatherCodes";
import type { CurrentWeather } from "@/lib/types";
import { Wind, Droplets, Eye, Gauge, Sunrise, Sunset, Compass } from "lucide-react";

interface CurrentConditionsProps {
  current: CurrentWeather;
  locationName: string;
  sunrise?: string;
  sunset?: string;
  high?: number;
  low?: number;
}

export function CurrentConditions({
  current,
  locationName,
  sunrise,
  sunset,
  high,
  low,
}: CurrentConditionsProps) {
  const isDay = current.is_day === 1;
  const info = getWeatherInfo(current.weather_code, isDay);

  const windDir = getWindDirection(current.wind_direction_10m);

  return (
    <div className="text-white">
      <div className="flex flex-col items-center text-center mb-8">
        <p className="text-lg font-medium text-white/80 mb-1">{locationName}</p>
        <div className="flex items-center gap-4 my-2">
          <WeatherIcon icon={info.icon} className="w-20 h-20 drop-shadow-lg" strokeWidth={1.5} />
          <div className="text-7xl font-extralight tracking-tighter">
            {Math.round(current.temperature_2m)}°
          </div>
        </div>
        <p className="text-xl font-medium">{info.label}</p>
        <p className="text-white/70 mt-1">
          Feels like {Math.round(current.apparent_temperature)}°
          {high !== undefined && low !== undefined && (
            <span className="ml-3">
              · H: {Math.round(high)}° L: {Math.round(low)}°
            </span>
          )}
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <DetailCard
          icon={<Wind className="w-5 h-5" />}
          label="Wind"
          value={`${Math.round(current.wind_speed_10m)} mph`}
          sub={windDir}
        />
        <DetailCard
          icon={<Droplets className="w-5 h-5" />}
          label="Humidity"
          value={`${current.relative_humidity_2m}%`}
        />
        <DetailCard
          icon={<Gauge className="w-5 h-5" />}
          label="Pressure"
          value={`${Math.round(current.pressure_msl)}`}
          sub="hPa"
        />
        <DetailCard
          icon={<Eye className="w-5 h-5" />}
          label="Cloud Cover"
          value={`${current.cloud_cover}%`}
        />
      </div>

      {sunrise && sunset && (
        <div className="grid grid-cols-2 gap-3 mt-3">
          <DetailCard
            icon={<Sunrise className="w-5 h-5 text-amber-300" />}
            label="Sunrise"
            value={formatTime(sunrise)}
          />
          <DetailCard
            icon={<Sunset className="w-5 h-5 text-orange-300" />}
            label="Sunset"
            value={formatTime(sunset)}
          />
        </div>
      )}
    </div>
  );
}

function DetailCard({
  icon,
  label,
  value,
  sub,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub?: string;
}) {
  return (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 flex flex-col gap-1">
      <div className="flex items-center gap-2 text-white/60 text-sm">
        {icon}
        <span>{label}</span>
      </div>
      <p className="text-lg font-semibold">
        {value}
        {sub && <span className="text-sm font-normal text-white/60 ml-1">{sub}</span>}
      </p>
    </div>
  );
}

function getWindDirection(degrees: number): string {
  const directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
  const index = Math.round(degrees / 45) % 8;
  return directions[index];
}

function formatTime(iso: string): string {
  const date = new Date(iso);
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}
