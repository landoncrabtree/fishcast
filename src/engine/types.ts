// ── Enums as const objects (TS erasableSyntaxOnly compatible) ──

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

export const LightLevel = {
  Dark: 'Dark',
  Low: 'Low',
  Medium: 'Medium',
  High: 'High',
} as const;
export type LightLevel = (typeof LightLevel)[keyof typeof LightLevel];

export const PressureTrend = {
  Rising: 'Rising',
  Stable: 'Stable',
  Falling: 'Falling',
} as const;
export type PressureTrend = (typeof PressureTrend)[keyof typeof PressureTrend];

export const MaxDepth = {
  Pond: 'Pond',
  Lake: 'Lake',
  Reservoir: 'Reservoir',
} as const;
export type MaxDepth = (typeof MaxDepth)[keyof typeof MaxDepth];

// ── Data models ──

export interface LocationData {
  lat: number;
  lon: number;
  label?: string;
}

export interface WeatherData {
  tempF: number;
  feelsLikeF: number;
  tempHighF: number;
  tempLowF: number;
  windSpeedMph: number;
  windDirection: number;
  cloudCoverPercent: number;
  precipitationMm: number;
  precipLast24hMm: number;
  precipLast48hMm: number;
  humidityPercent: number;
  pressureHpa: number;
  pressureYesterdayHpa: number;
  sunrise: Date;
  sunset: Date;
  uvIndex: number;
  weatherDescription: string;
}

export interface DerivedConditions {
  seasonPhase: SeasonPhase;
  timeOfDay: TimeBucket;
  waterTempEstimateF: number;
  clarity: WaterClarity;
  lightLevel: LightLevel;
  pressureTrend: PressureTrend;
  isFrontalPassage: boolean;
  isStablePeriod: boolean;
}

export interface BassPosition {
  zone: string;
  reasoning: string;
}

export interface Condition {
  location: LocationData;
  timestamp: Date;
  weather: WeatherData;
  derived: DerivedConditions;
}

// ── Point-based engine types ──

export interface ScoredAttribute {
  name: string;
  points: number;
  reasons: string[];
}

export interface Recommendation {
  id: string;
  title: string;
  lureType: string;
  color: string;
  retrieve: string;
  retrieveDescription: string;
  depth: string;
  confidence: number; // 0-100 normalized
  totalPoints: number;
  reasoning: string;
  breakdown: {
    lure: ScoredAttribute;
    color: ScoredAttribute;
    retrieve: ScoredAttribute;
    depth: ScoredAttribute;
  };
}

// Scoring function: given conditions, return points + reasons
export type ScoreFn = (c: DerivedConditions, w: WeatherData) => { points: number; reasons: string[] };

export interface LureDefinition {
  id: string;
  name: string;
  category: string;
  score: ScoreFn;
}

export interface ColorDefinition {
  id: string;
  name: string;
  score: ScoreFn;
}

export interface RetrieveDefinition {
  id: string;
  name: string;
  description: string;
  score: ScoreFn;
}

export interface DepthDefinition {
  id: string;
  name: string;
  score: ScoreFn;
}

export type TemperatureUnit = 'F' | 'C';

export interface AppSettings {
  species: string;
  temperatureUnit: TemperatureUnit;
  maxDepth: MaxDepth;
  waterClarityOverride: WaterClarity | 'Auto';
}
