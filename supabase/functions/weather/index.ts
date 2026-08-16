import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface WeatherParams {
  latitude: number;
  longitude: number;
  current?: string;
  hourly?: string;
  daily?: string;
  timezone?: string;
  forecast_days?: number;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const latitude = url.searchParams.get("latitude");
    const longitude = url.searchParams.get("longitude");

    if (!latitude || !longitude) {
      return new Response(
        JSON.stringify({ error: "latitude and longitude are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const lat = parseFloat(latitude);
    const lon = parseFloat(longitude);

    if (isNaN(lat) || isNaN(lon) || lat < -90 || lat > 90 || lon < -180 || lon > 180) {
      return new Response(
        JSON.stringify({ error: "Invalid coordinates" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const current = url.searchParams.get("current") ||
      "temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,cloud_cover,pressure_msl,wind_speed_10m,wind_direction_10m";
    const hourly = url.searchParams.get("hourly") ||
      "temperature_2m,weather_code,precipitation_probability";
    const daily = url.searchParams.get("daily") ||
      "weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,precipitation_probability_max,wind_speed_10m_max,uv_index_max";
    const timezone = url.searchParams.get("timezone") || "auto";
    const forecastDays = url.searchParams.get("forecast_days") || "7";

    const apiUrl = new URL("https://api.open-meteo.com/v1/forecast");
    apiUrl.searchParams.set("latitude", lat.toString());
    apiUrl.searchParams.set("longitude", lon.toString());
    apiUrl.searchParams.set("current", current);
    apiUrl.searchParams.set("hourly", hourly);
    apiUrl.searchParams.set("daily", daily);
    apiUrl.searchParams.set("timezone", timezone);
    apiUrl.searchParams.set("forecast_days", forecastDays);
    apiUrl.searchParams.set("wind_speed_unit", "mph");
    apiUrl.searchParams.set("temperature_unit", "fahrenheit");
    apiUrl.searchParams.set("precipitation_unit", "inch");

    const response = await fetch(apiUrl.toString(), {
      headers: { "Accept": "application/json" },
    });

    if (!response.ok) {
      return new Response(
        JSON.stringify({ error: `Weather service returned ${response.status}` }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();

    if (!data || !data.current) {
      return new Response(
        JSON.stringify({ error: "Invalid weather data received" }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
