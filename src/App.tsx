import { useState, useEffect, useCallback } from "react";
import { Loader2, Star, AlertCircle, Navigation } from "lucide-react";
import { SearchBar } from "@/components/SearchBar";
import { CurrentConditions } from "@/components/CurrentConditions";
import { HourlyForecast } from "@/components/HourlyForecast";
import { DailyForecast } from "@/components/DailyForecast";
import { SavedLocations } from "@/components/SavedLocations";
import { fetchWeather } from "@/lib/weather";
import { supabase } from "@/lib/supabase";
import { getWeatherInfo } from "@/lib/weatherCodes";
import type { WeatherResponse, GeoResult, SavedLocation } from "@/lib/types";

interface ActiveLocation {
  name: string;
  latitude: number;
  longitude: number;
  country: string | null;
  timezone: string | null;
}

export default function App() {
  const [weather, setWeather] = useState<WeatherResponse | null>(null);
  const [location, setLocation] = useState<ActiveLocation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [savedRefreshKey, setSavedRefreshKey] = useState(0);

  const loadWeather = useCallback(async (loc: ActiveLocation) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchWeather(loc.latitude, loc.longitude, loc.timezone ?? undefined);
      setWeather(data);
      setLocation(loc);
      await checkIfSaved(loc);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load weather");
      setWeather(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load default city on mount
  useEffect(() => {
    loadWeather({
      name: "New York",
      latitude: 40.7128,
      longitude: -74.006,
      country: "United States",
      timezone: "America/New_York",
    });
  }, [loadWeather]);

  async function checkIfSaved(loc: ActiveLocation) {
    const { data } = await supabase
      .from("saved_locations")
      .select("id")
      .eq("latitude", loc.latitude)
      .eq("longitude", loc.longitude)
      .maybeSingle();
    setSaved(!!data);
  }

  function handleSearchSelect(result: GeoResult) {
    loadWeather({
      name: result.name,
      latitude: result.latitude,
      longitude: result.longitude,
      country: [result.admin1, result.country].filter(Boolean).join(", "),
      timezone: result.timezone ?? null,
    });
  }

  function handleSavedSelect(loc: SavedLocation) {
    loadWeather({
      name: loc.name,
      latitude: loc.latitude,
      longitude: loc.longitude,
      country: loc.country,
      timezone: loc.timezone,
    });
  }

  async function toggleSave() {
    if (!location) return;

    if (saved) {
      const { error } = await supabase
        .from("saved_locations")
        .delete()
        .eq("latitude", location.latitude)
        .eq("longitude", location.longitude);
      if (error) {
        setError("Failed to remove saved location");
        return;
      }
      setSaved(false);
      setSavedRefreshKey((k) => k + 1);
    } else {
      const { error } = await supabase.from("saved_locations").insert({
        name: location.name,
        latitude: location.latitude,
        longitude: location.longitude,
        country: location.country,
        timezone: location.timezone,
      });
      if (error) {
        setError("Failed to save location");
        return;
      }
      setSaved(true);
      setSavedRefreshKey((k) => k + 1);
    }
  }

  function useGeolocation() {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        await loadWeather({
          name: "Current Location",
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          country: null,
          timezone: null,
        });
      },
      () => {
        setError("Could not get your location. Please search for a city instead.");
      },
      { enableHighAccuracy: false, timeout: 10000 }
    );
  }

  const gradient = weather
    ? getWeatherInfo(weather.current.weather_code, weather.current.is_day === 1).gradient
    : "from-slate-700 via-slate-800 to-slate-900";

  return (
    <div className={`min-h-screen bg-gradient-to-br ${gradient} transition-all duration-1000 ease-out`}>
      <div className="min-h-screen bg-black/10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          {/* Header */}
          <header className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-white tracking-tight">Weather</h1>
            </div>
            <button
              onClick={useGeolocation}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 backdrop-blur-md text-white text-sm font-medium border border-white/20 hover:bg-white/20 transition-colors"
            >
              <Navigation className="w-4 h-4" />
              <span className="hidden sm:inline">My Location</span>
            </button>
          </header>

          {/* Search */}
          <div className="mb-6">
            <SearchBar onSelect={handleSearchSelect} />
          </div>

          {/* Error */}
          {error && (
            <div className="mb-6 bg-red-500/20 backdrop-blur-md border border-red-400/30 rounded-2xl p-4 flex items-center gap-3 text-white">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <p className="text-sm">{error}</p>
            </div>
          )}

          {/* Loading */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-32">
              <Loader2 className="w-10 h-10 text-white/70 animate-spin mb-4" />
              <p className="text-white/60">Loading weather...</p>
            </div>
          )}

          {/* Weather Content */}
          {!loading && weather && location && (
            <div className="grid lg:grid-cols-[1fr_300px] gap-6">
              <div className="space-y-4">
                {/* Save button */}
                <div className="flex justify-end">
                  <button
                    onClick={toggleSave}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border transition-colors ${
                      saved
                        ? "bg-amber-400/20 text-amber-200 border-amber-400/40"
                        : "bg-white/10 text-white border-white/20 hover:bg-white/20"
                    }`}
                  >
                    <Star className={`w-4 h-4 ${saved ? "fill-amber-300" : ""}`} />
                    {saved ? "Saved" : "Save"}
                  </button>
                </div>

                <CurrentConditions
                  current={weather.current}
                  locationName={location.name}
                  sunrise={weather.daily.sunrise?.[0]}
                  sunset={weather.daily.sunset?.[0]}
                  high={weather.daily.temperature_2m_max?.[0]}
                  low={weather.daily.temperature_2m_min?.[0]}
                />

                <HourlyForecast
                  hourly={weather.hourly}
                  currentTime={weather.current.time}
                />

                <DailyForecast daily={weather.daily} />
              </div>

              <div>
                <SavedLocations
                  onSelect={handleSavedSelect}
                  activeLocation={location ?? undefined}
                  refreshKey={savedRefreshKey}
                />
              </div>
            </div>
          )}

          {/* Footer */}
          <footer className="mt-12 text-center text-white/40 text-xs">
            <p>Weather data by Open-Meteo · Built with React & Supabase</p>
          </footer>
        </div>
      </div>
    </div>
  );
}
