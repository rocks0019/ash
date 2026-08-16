export interface WeatherInfo {
  label: string;
  icon: string;
  gradient: string;
  accent: string;
}

const weatherMap: Record<number, WeatherInfo> = {
  0: { label: "Clear sky", icon: "sun", gradient: "from-amber-400 via-orange-400 to-rose-500", accent: "amber" },
  1: { label: "Mainly clear", icon: "sun", gradient: "from-amber-300 via-orange-400 to-rose-400", accent: "amber" },
  2: { label: "Partly cloudy", icon: "cloud-sun", gradient: "from-sky-400 via-blue-500 to-indigo-600", accent: "sky" },
  3: { label: "Overcast", icon: "cloud", gradient: "from-slate-400 via-slate-500 to-slate-700", accent: "slate" },
  45: { label: "Fog", icon: "cloud-fog", gradient: "from-slate-300 via-slate-400 to-slate-600", accent: "slate" },
  48: { label: "Rime fog", icon: "cloud-fog", gradient: "from-slate-300 via-slate-400 to-slate-600", accent: "slate" },
  51: { label: "Light drizzle", icon: "cloud-drizzle", gradient: "from-sky-400 via-blue-500 to-slate-600", accent: "sky" },
  53: { label: "Drizzle", icon: "cloud-drizzle", gradient: "from-sky-500 via-blue-600 to-slate-700", accent: "sky" },
  55: { label: "Dense drizzle", icon: "cloud-drizzle", gradient: "from-sky-600 via-blue-700 to-slate-800", accent: "sky" },
  56: { label: "Freezing drizzle", icon: "cloud-drizzle", gradient: "from-cyan-400 via-blue-600 to-slate-700", accent: "cyan" },
  57: { label: "Freezing drizzle", icon: "cloud-drizzle", gradient: "from-cyan-500 via-blue-700 to-slate-800", accent: "cyan" },
  61: { label: "Light rain", icon: "cloud-rain", gradient: "from-sky-500 via-blue-600 to-slate-700", accent: "sky" },
  63: { label: "Rain", icon: "cloud-rain", gradient: "from-blue-500 via-blue-700 to-slate-800", accent: "blue" },
  65: { label: "Heavy rain", icon: "cloud-rain-wind", gradient: "from-blue-600 via-indigo-700 to-slate-900", accent: "blue" },
  66: { label: "Freezing rain", icon: "cloud-rain", gradient: "from-cyan-500 via-blue-700 to-slate-800", accent: "cyan" },
  67: { label: "Freezing rain", icon: "cloud-rain-wind", gradient: "from-cyan-600 via-blue-800 to-slate-900", accent: "cyan" },
  71: { label: "Light snow", icon: "cloud-snow", gradient: "from-slate-300 via-sky-400 to-slate-600", accent: "sky" },
  73: { label: "Snow", icon: "cloud-snow", gradient: "from-slate-400 via-sky-500 to-slate-700", accent: "sky" },
  75: { label: "Heavy snow", icon: "cloud-snow", gradient: "from-slate-500 via-sky-600 to-slate-800", accent: "slate" },
  77: { label: "Snow grains", icon: "cloud-snow", gradient: "from-slate-300 via-sky-400 to-slate-600", accent: "sky" },
  80: { label: "Light showers", icon: "cloud-rain", gradient: "from-sky-500 via-blue-600 to-slate-700", accent: "sky" },
  81: { label: "Showers", icon: "cloud-rain-wind", gradient: "from-blue-500 via-blue-700 to-slate-800", accent: "blue" },
  82: { label: "Violent showers", icon: "cloud-rain-wind", gradient: "from-blue-600 via-indigo-800 to-slate-900", accent: "blue" },
  85: { label: "Snow showers", icon: "cloud-snow", gradient: "from-slate-400 via-sky-500 to-slate-700", accent: "sky" },
  86: { label: "Heavy snow showers", icon: "cloud-snow", gradient: "from-slate-500 via-sky-600 to-slate-800", accent: "slate" },
  95: { label: "Thunderstorm", icon: "cloud-lightning", gradient: "from-indigo-600 via-purple-700 to-slate-900", accent: "indigo" },
  96: { label: "Thunderstorm with hail", icon: "cloud-lightning", gradient: "from-indigo-700 via-purple-800 to-slate-900", accent: "indigo" },
  99: { label: "Severe thunderstorm", icon: "cloud-lightning", gradient: "from-indigo-800 via-purple-900 to-slate-950", accent: "indigo" },
};

const nightGradient = "from-slate-900 via-indigo-950 to-slate-950";

export function getWeatherInfo(code: number, isDay: boolean): WeatherInfo {
  if (!isDay) {
    const base = weatherMap[code] ?? weatherMap[0];
    return { ...base, gradient: nightGradient, icon: base.icon === "sun" ? "moon" : base.icon };
  }
  return weatherMap[code] ?? weatherMap[0];
}

export function getWeatherLabel(code: number): string {
  return weatherMap[code]?.label ?? "Unknown";
}
