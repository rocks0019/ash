import {
  Sun,
  Moon,
  Cloud,
  CloudSun,
  CloudFog,
  CloudDrizzle,
  CloudRain,
  CloudRainWind,
  CloudSnow,
  CloudLightning,
  type LucideIcon,
} from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  sun: Sun,
  moon: Moon,
  cloud: Cloud,
  "cloud-sun": CloudSun,
  "cloud-fog": CloudFog,
  "cloud-drizzle": CloudDrizzle,
  "cloud-rain": CloudRain,
  "cloud-rain-wind": CloudRainWind,
  "cloud-snow": CloudSnow,
  "cloud-lightning": CloudLightning,
};

interface WeatherIconProps {
  icon: string;
  className?: string;
  strokeWidth?: number;
}

export function WeatherIcon({ icon, className, strokeWidth }: WeatherIconProps) {
  const Icon = iconMap[icon] ?? Sun;
  return <Icon className={className} strokeWidth={strokeWidth ?? 2} />;
}
