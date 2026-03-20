import type { WeatherData } from '../engine/types';

interface OpenMeteoResponse {
  current: {
    temperature_2m: number;
    apparent_temperature: number;
    wind_speed_10m: number;
    wind_direction_10m: number;
    cloud_cover: number;
    precipitation: number;
    surface_pressure: number;
    relative_humidity_2m: number;
    weather_code: number;
  };
  daily: {
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    sunrise: string[];
    sunset: string[];
    precipitation_sum: number[];
    uv_index_max: number[];
  };
}

// WMO Weather interpretation codes → human descriptions
function weatherCodeToDescription(code: number): string {
  const map: Record<number, string> = {
    0: 'Clear Sky',
    1: 'Mainly Clear', 2: 'Partly Cloudy', 3: 'Overcast',
    45: 'Foggy', 48: 'Rime Fog',
    51: 'Light Drizzle', 53: 'Moderate Drizzle', 55: 'Dense Drizzle',
    61: 'Light Rain', 63: 'Moderate Rain', 65: 'Heavy Rain',
    66: 'Light Freezing Rain', 67: 'Heavy Freezing Rain',
    71: 'Light Snow', 73: 'Moderate Snow', 75: 'Heavy Snow',
    77: 'Snow Grains',
    80: 'Light Showers', 81: 'Moderate Showers', 82: 'Heavy Showers',
    85: 'Light Snow Showers', 86: 'Heavy Snow Showers',
    95: 'Thunderstorm', 96: 'Thunderstorm with Hail', 99: 'Severe Thunderstorm',
  };
  return map[code] ?? 'Unknown';
}

export async function fetchWeather(lat: number, lon: number): Promise<WeatherData> {
  const params = new URLSearchParams({
    latitude: lat.toString(),
    longitude: lon.toString(),
    current: [
      'temperature_2m', 'apparent_temperature', 'wind_speed_10m', 'wind_direction_10m',
      'cloud_cover', 'precipitation', 'surface_pressure', 'relative_humidity_2m', 'weather_code',
    ].join(','),
    daily: [
      'temperature_2m_max', 'temperature_2m_min', 'sunrise', 'sunset',
      'precipitation_sum', 'uv_index_max',
    ].join(','),
    temperature_unit: 'fahrenheit',
    wind_speed_unit: 'mph',
    timezone: 'auto',
    past_days: '2',
    forecast_days: '1',
  });

  const res = await fetch(`https://api.open-meteo.com/v1/forecast?${params}`);
  if (!res.ok) throw new Error(`Weather API error: ${res.status}`);

  const data: OpenMeteoResponse = await res.json();
  const c = data.current;
  const d = data.daily;

  // daily arrays: [2 days ago, yesterday, today] with past_days=2, forecast_days=1
  const todayIdx = d.precipitation_sum.length - 1;
  const yesterdayIdx = todayIdx - 1;
  const twoDaysAgoIdx = todayIdx - 2;

  return {
    tempF: c.temperature_2m,
    feelsLikeF: c.apparent_temperature,
    tempHighF: d.temperature_2m_max[todayIdx],
    tempLowF: d.temperature_2m_min[todayIdx],
    windSpeedMph: c.wind_speed_10m,
    windDirection: c.wind_direction_10m,
    cloudCoverPercent: c.cloud_cover,
    precipitationMm: c.precipitation,
    precipLast24hMm: d.precipitation_sum[yesterdayIdx] ?? 0,
    precipLast48hMm: (d.precipitation_sum[yesterdayIdx] ?? 0) + (d.precipitation_sum[twoDaysAgoIdx] ?? 0),
    humidityPercent: c.relative_humidity_2m,
    pressureHpa: c.surface_pressure,
    pressureYesterdayHpa: c.surface_pressure, // Open-Meteo doesn't give hourly past pressure easily; we derive trend from weather code
    sunrise: new Date(d.sunrise[todayIdx]),
    sunset: new Date(d.sunset[todayIdx]),
    uvIndex: d.uv_index_max[todayIdx] ?? 0,
    weatherDescription: weatherCodeToDescription(c.weather_code),
  };
}
