import {
  TimeBucket,
  SeasonPhase,
  WaterClarity,
  LightLevel,
  PressureTrend,
  type MaxDepth,
  type WeatherData,
  type DerivedConditions,
  type BassPosition,
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

export function deriveBassPosition(derived: DerivedConditions, maxDepth: MaxDepth): BassPosition {
  const isPond = maxDepth === 'Pond';
  const deepLabel = isPond ? 'deeper pockets' : 'deep structure';
  const midLabel = isPond ? 'center of pond' : 'mid-depth';

  // Pressure and front adjustments
  const pressureDeeper = derived.pressureTrend === PressureTrend.Rising || derived.isFrontalPassage;
  const pressureShallower = derived.pressureTrend === PressureTrend.Falling;

  switch (derived.seasonPhase) {
    case SeasonPhase.Winter:
      return {
        zone: isPond ? 'Deepest available' : 'Deep',
        reasoning: pressureShallower
          ? `Winter — bass holding on ${deepLabel}, but falling pressure may push brief shallow feeding`
          : `Winter — bass congregated on ${deepLabel}, slow and lethargic`,
      };

    case SeasonPhase.PreSpawn:
      return {
        zone: 'Shallow',
        reasoning: pressureDeeper
          ? 'Pre-spawn — bass staging near shallow flats, but high pressure keeping them cautious'
          : 'Pre-spawn — bass moving shallow to stage on flats and points before bedding',
      };

    case SeasonPhase.Spawn:
      return {
        zone: 'Shallow',
        reasoning: 'Spawn — bass on beds in 1-4ft of water, guarding nests near bank cover',
      };

    case SeasonPhase.PostSpawn: {
      if (pressureDeeper) {
        return {
          zone: isPond ? 'Center / edges' : 'Mid-depth',
          reasoning: `Post-spawn — females recovering near first drop-off at ${midLabel}, high pressure pushing them off bank`,
        };
      }
      return {
        zone: 'Shallow to mid',
        reasoning: `Post-spawn — males still guarding fry in shallows, females near ${midLabel} recovering`,
      };
    }

    case SeasonPhase.Summer: {
      const isLowLight = derived.lightLevel === LightLevel.Low || derived.lightLevel === LightLevel.Dark;
      if (isLowLight) {
        return {
          zone: 'Shallow',
          reasoning: 'Summer low-light — bass push shallow to feed during dawn/dusk windows',
        };
      }
      return {
        zone: isPond ? 'Deepest available' : 'Deep',
        reasoning: isPond
          ? 'Summer midday — bass seek shade and the deepest pockets available in the pond'
          : 'Summer midday — bass holding on deep ledges, points, and along the thermocline',
      };
    }

    case SeasonPhase.FallTransition: {
      if (derived.lightLevel === LightLevel.High && !pressureShallower) {
        return {
          zone: isPond ? 'Edges and cover' : 'Shallow to mid',
          reasoning: `Fall — bass following baitfish, relating to ${isPond ? 'bank cover and shade' : 'creek channels and flats'}`,
        };
      }
      return {
        zone: 'Shallow',
        reasoning: `Fall — bass aggressively chasing baitfish into ${isPond ? 'the shallows along the banks' : 'shallow creeks and flats'}`,
      };
    }
  }
}
