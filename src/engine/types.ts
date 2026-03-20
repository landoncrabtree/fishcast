export const TimeBucket = {
  Dawn: 'Dawn',
  Morning: 'Morning',
  Midday: 'Midday',
  Evening: 'Evening',
  Night: 'Night',
} as const;
export type TimeBucket = (typeof TimeBucket)[keyof typeof TimeBucket];

export const SeasonPhase = {
  Winter: 'Winter',
  PreSpawn: 'Pre-Spawn',
  Spawn: 'Spawn',
  PostSpawn: 'Post-Spawn',
  Summer: 'Summer',
  FallTransition: 'Fall Transition',
} as const;
export type SeasonPhase = (typeof SeasonPhase)[keyof typeof SeasonPhase];

export const WaterClarity = {
  Clear: 'Clear',
  Stained: 'Stained',
  Muddy: 'Muddy',
} as const;
export type WaterClarity = (typeof WaterClarity)[keyof typeof WaterClarity];

export interface LocationData {
  lat: number;
  lon: number;
  label?: string;
}

export interface WeatherData {
  tempF: number;
  tempHighF: number;
  tempLowF: number;
  windSpeedMph: number;
  windDirection: number;
  cloudCoverPercent: number;
  precipitationMm: number;
  pressureHpa: number;
  sunrise: Date;
  sunset: Date;
}

export interface DerivedConditions {
  seasonPhase: SeasonPhase;
  timeOfDay: TimeBucket;
  waterTempEstimateF: number;
  clarity: WaterClarity;
}

export interface Condition {
  location: LocationData;
  timestamp: Date;
  weather: WeatherData;
  derived: DerivedConditions;
}

export interface Recommendation {
  id: string;
  title: string;
  lureType: string;
  color: string;
  retrieve: string;
  depth: string;
  confidence: number;
  reasoning: string;
}

export interface FishingRule {
  id: string;
  title: string;
  lureType: string;
  color: string;
  retrieve: string;
  depth: string;
  reasoning: string;
  match: (c: DerivedConditions, w: WeatherData) => number; // 0-100 confidence
}

export type TemperatureUnit = 'F' | 'C';

export interface AppSettings {
  species: string;
  temperatureUnit: TemperatureUnit;
}
