import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { LocationData, WeatherData, DerivedConditions, Recommendation, AppSettings, TemperatureUnit, MaxDepth, WaterClarity, BassPosition } from '../engine/types';

interface AppState {
  // Location
  location: LocationData | null;
  locationError: string | null;
  locationLoading: boolean;

  // Weather
  weather: WeatherData | null;
  weatherLoading: boolean;
  weatherError: string | null;

  // Derived
  derived: DerivedConditions | null;

  // Bass position insight
  bassPosition: BassPosition | null;

  // Recommendations
  recommendations: Recommendation[];

  // Settings
  settings: AppSettings;

  // Selected recommendation for detail view
  selectedRecommendation: Recommendation | null;

  // Actions
  setLocation: (loc: LocationData) => void;
  setLocationError: (err: string | null) => void;
  setLocationLoading: (loading: boolean) => void;
  setWeather: (w: WeatherData) => void;
  setWeatherLoading: (loading: boolean) => void;
  setWeatherError: (err: string | null) => void;
  setDerived: (d: DerivedConditions) => void;
  setBassPosition: (bp: BassPosition | null) => void;
  setRecommendations: (recs: Recommendation[]) => void;
  setSelectedRecommendation: (rec: Recommendation | null) => void;
  setTemperatureUnit: (unit: TemperatureUnit) => void;
  setSpecies: (species: string) => void;
  setMaxDepth: (maxDepth: MaxDepth) => void;
  setWaterClarityOverride: (clarity: WaterClarity | 'Auto') => void;
  reset: () => void;
}

const initialState = {
  location: null,
  locationError: null,
  locationLoading: false,
  weather: null,
  weatherLoading: false,
  weatherError: null,
  derived: null,
  bassPosition: null,
  recommendations: [],
  selectedRecommendation: null,
};

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      ...initialState,
      settings: {
        species: 'Bass',
        temperatureUnit: 'F' as TemperatureUnit,
        maxDepth: 'Reservoir' as MaxDepth,
        waterClarityOverride: 'Auto' as WaterClarity | 'Auto',
      },
      setLocation: (loc) => set({ location: loc, locationError: null }),
      setLocationError: (err) => set({ locationError: err, locationLoading: false }),
      setLocationLoading: (loading) => set({ locationLoading: loading }),
      setWeather: (w) => set({ weather: w, weatherError: null }),
      setWeatherLoading: (loading) => set({ weatherLoading: loading }),
      setWeatherError: (err) => set({ weatherError: err, weatherLoading: false }),
      setDerived: (d) => set({ derived: d }),
      setBassPosition: (bp) => set({ bassPosition: bp }),
      setRecommendations: (recs) => set({ recommendations: recs }),
      setSelectedRecommendation: (rec) => set({ selectedRecommendation: rec }),
      setTemperatureUnit: (unit) =>
        set((s) => ({ settings: { ...s.settings, temperatureUnit: unit } })),
      setSpecies: (species) =>
        set((s) => ({ settings: { ...s.settings, species } })),
      setMaxDepth: (maxDepth) =>
        set((s) => ({ settings: { ...s.settings, maxDepth } })),
      setWaterClarityOverride: (clarity) =>
        set((s) => ({ settings: { ...s.settings, waterClarityOverride: clarity } })),
      reset: () => set(initialState),
    }),
    {
      name: 'fishcast-settings',
      partialize: (state) => ({ settings: state.settings }),
    }
  )
);
