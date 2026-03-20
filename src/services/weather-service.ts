import type { WeatherData } from '../engine/types';

interface OpenMeteoResponse {
  current: {
    temperature_2m: number;
    wind_speed_10m: number;
    wind_direction_10m: number;
    cloud_cover: number;
    precipitation: number;
    surface_pressure: number;
  };
  daily: {
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    sunrise: string[];
    sunset: string[];
    precipitation_sum: number[];
  };
}

export async function fetchWeather(lat: number, lon: number): Promise<WeatherData> {
  const params = new URLSearchParams({
    latitude: lat.toString(),
    longitude: lon.toString(),
    current: 'temperature_2m,wind_speed_10m,wind_direction_10m,cloud_cover,precipitation,surface_pressure',
    daily: 'temperature_2m_max,temperature_2m_min,sunrise,sunset,precipitation_sum',
    temperature_unit: 'fahrenheit',
    wind_speed_unit: 'mph',
    timezone: 'auto',
    forecast_days: '3',
  });

  const res = await fetch(`https://api.open-meteo.com/v1/forecast?${params}`);
  if (!res.ok) throw new Error(`Weather API error: ${res.status}`);

  const data: OpenMeteoResponse = await res.json();
  const c = data.current;
  const d = data.daily;

  return {
    tempF: c.temperature_2m,
    tempHighF: d.temperature_2m_max[0],
    tempLowF: d.temperature_2m_min[0],
    windSpeedMph: c.wind_speed_10m,
    windDirection: c.wind_direction_10m,
    cloudCoverPercent: c.cloud_cover,
    precipitationMm: c.precipitation,
    pressureHpa: c.surface_pressure,
    sunrise: new Date(d.sunrise[0]),
    sunset: new Date(d.sunset[0]),
  };
}

export function recentPrecipitation(daily: { precipitation_sum: number[] }): number {
  return daily.precipitation_sum.slice(0, 3).reduce((a, b) => a + b, 0);
}
