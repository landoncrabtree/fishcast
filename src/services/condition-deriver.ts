import {
  TimeBucket,
  SeasonPhase,
  WaterClarity,
  type WeatherData,
  type DerivedConditions,
} from '../engine/types';

export function deriveTimeBucket(now: Date, sunrise: Date, sunset: Date): TimeBucket {
  const minutes = now.getHours() * 60 + now.getMinutes();
  const sunriseMin = sunrise.getHours() * 60 + sunrise.getMinutes();
  const sunsetMin = sunset.getHours() * 60 + sunset.getMinutes();

  if (minutes >= sunriseMin - 30 && minutes < sunriseMin + 60) return TimeBucket.Dawn;
  if (minutes >= sunriseMin + 60 && minutes < 11 * 60) return TimeBucket.Morning;
  if (minutes >= 11 * 60 && minutes < sunsetMin - 120) return TimeBucket.Midday;
  if (minutes >= sunsetMin - 120 && minutes < sunsetMin + 30) return TimeBucket.Evening;
  return TimeBucket.Night;
}

export function deriveSeasonPhase(lat: number, month: number, avgTempF: number): SeasonPhase {
  const isNorthern = lat >= 0;
  const adjustedMonth = isNorthern ? month : ((month + 5) % 12) + 1;

  // Temperature-adjusted season detection
  if (avgTempF < 45) return SeasonPhase.Winter;
  if (avgTempF >= 45 && avgTempF < 55) {
    return adjustedMonth >= 2 && adjustedMonth <= 4 ? SeasonPhase.PreSpawn : SeasonPhase.Winter;
  }
  if (avgTempF >= 55 && avgTempF < 65) {
    if (adjustedMonth >= 3 && adjustedMonth <= 5) return SeasonPhase.Spawn;
    if (adjustedMonth >= 9) return SeasonPhase.FallTransition;
    return SeasonPhase.PreSpawn;
  }
  if (avgTempF >= 65 && avgTempF < 75) {
    if (adjustedMonth >= 4 && adjustedMonth <= 6) return SeasonPhase.PostSpawn;
    if (adjustedMonth >= 9 && adjustedMonth <= 11) return SeasonPhase.FallTransition;
    return SeasonPhase.Summer;
  }
  if (avgTempF >= 75) return SeasonPhase.Summer;

  return SeasonPhase.Summer;
}

export function estimateWaterTemp(airTempF: number, highF: number, lowF: number): number {
  // Water temp lags air temp; rough heuristic
  const avgAir = (highF + lowF) / 2;
  // Blend current temp with average, water is slower to change
  return avgAir * 0.7 + airTempF * 0.3 - 3;
}

export function deriveWaterClarity(precipMm: number, windMph: number): WaterClarity {
  if (precipMm > 5 || (precipMm > 2 && windMph > 15)) return WaterClarity.Muddy;
  if (precipMm > 1 || windMph > 20) return WaterClarity.Stained;
  return WaterClarity.Clear;
}

export function deriveConditions(
  lat: number,
  now: Date,
  weather: WeatherData
): DerivedConditions {
  const avgTemp = (weather.tempHighF + weather.tempLowF) / 2;
  const month = now.getMonth() + 1;

  return {
    timeOfDay: deriveTimeBucket(now, weather.sunrise, weather.sunset),
    seasonPhase: deriveSeasonPhase(lat, month, avgTemp),
    waterTempEstimateF: estimateWaterTemp(weather.tempF, weather.tempHighF, weather.tempLowF),
    clarity: deriveWaterClarity(weather.precipitationMm, weather.windSpeedMph),
  };
}
