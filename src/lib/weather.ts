import { weatherFunctionUrl, geocodeFunctionUrl } from "./supabase";
import type { WeatherResponse, GeoResponse } from "./types";

const headers = {
  "Content-Type": "application/json",
};

export async function fetchWeather(
  latitude: number,
  longitude: number,
  timezone?: string
): Promise<WeatherResponse> {
  const params = new URLSearchParams({
    latitude: latitude.toString(),
    longitude: longitude.toString(),
  });
  if (timezone) params.set("timezone", timezone);

  const response = await fetch(`${weatherFunctionUrl}?${params.toString()}`, { headers });

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body?.error || `Weather request failed (${response.status})`);
  }

  const data = await response.json() as WeatherResponse;
  if (!data.current) {
    throw new Error("Invalid weather data received");
  }
  return data;
}

export async function searchLocations(query: string): Promise<GeoResponse> {
  const params = new URLSearchParams({ q: query });
  const response = await fetch(`${geocodeFunctionUrl}?${params.toString()}`, { headers });

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body?.error || `Search request failed (${response.status})`);
  }

  return response.json() as Promise<GeoResponse>;
}
