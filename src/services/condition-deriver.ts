import {
  TimeBucket,
  SeasonPhase,
  WaterClarity,
  LightLevel,
  PressureTrend,
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
  return SeasonPhase.Summer;
}

export function estimateWaterTemp(airTempF: number, highF: number, lowF: number): number {
  const avgAir = (highF + lowF) / 2;
  return avgAir * 0.7 + airTempF * 0.3 - 3;
}

export function deriveWaterClarity(
  currentPrecipMm: number,
  precip24hMm: number,
  precip48hMm: number,
  windMph: number,
): WaterClarity {
  const totalRecent = currentPrecipMm + precip24hMm;
  if (totalRecent > 10 || (precip48hMm > 15 && windMph > 12)) return WaterClarity.Muddy;
  if (totalRecent > 3 || precip48hMm > 8 || windMph > 20) return WaterClarity.Stained;
  return WaterClarity.Clear;
}

export function deriveLightLevel(
  timeOfDay: TimeBucket,
  cloudCoverPercent: number,
): LightLevel {
  if (timeOfDay === TimeBucket.Night) return LightLevel.Dark;
  if (timeOfDay === TimeBucket.Dawn || timeOfDay === TimeBucket.Evening) {
    return cloudCoverPercent > 70 ? LightLevel.Dark : LightLevel.Low;
  }
  // Midday / Morning
  if (cloudCoverPercent > 80) return LightLevel.Low;
  if (cloudCoverPercent > 50) return LightLevel.Medium;
  return LightLevel.High;
}

export function derivePressureTrend(
  currentHpa: number,
  weatherCode: string,
): PressureTrend {
  // Use weather description as a proxy for pressure trend since we can't get historical hourly pressure easily
  const desc = weatherCode.toLowerCase();
  if (desc.includes('rain') || desc.includes('storm') || desc.includes('shower') || desc.includes('drizzle')) {
    return PressureTrend.Falling;
  }
  if (desc.includes('clear') || desc.includes('mainly')) {
    return currentHpa > 1018 ? PressureTrend.Rising : PressureTrend.Stable;
  }
  return PressureTrend.Stable;
}

export function deriveConditions(
  lat: number,
  now: Date,
  weather: WeatherData,
): DerivedConditions {
  const avgTemp = (weather.tempHighF + weather.tempLowF) / 2;
  const month = now.getMonth() + 1;
  const timeOfDay = deriveTimeBucket(now, weather.sunrise, weather.sunset);
  const pressureTrend = derivePressureTrend(weather.pressureHpa, weather.weatherDescription);

  // Frontal passage: big pressure change + precipitation or clearing
  const isFrontalPassage = weather.precipLast24hMm > 5 && weather.pressureHpa > 1015;

  // Stable period: no recent precip, moderate pressure, low wind
  const isStablePeriod = weather.precipLast48hMm < 2 && weather.windSpeedMph < 10
    && weather.pressureHpa > 1010 && weather.pressureHpa < 1025;

  return {
    timeOfDay,
    seasonPhase: deriveSeasonPhase(lat, month, avgTemp),
    waterTempEstimateF: estimateWaterTemp(weather.tempF, weather.tempHighF, weather.tempLowF),
    clarity: deriveWaterClarity(weather.precipitationMm, weather.precipLast24hMm, weather.precipLast48hMm, weather.windSpeedMph),
    lightLevel: deriveLightLevel(timeOfDay, weather.cloudCoverPercent),
    pressureTrend,
    isFrontalPassage,
    isStablePeriod,
  };
}
