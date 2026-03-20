import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { LocationData, WeatherData, DerivedConditions, Recommendation, AppSettings, TemperatureUnit } from '../engine/types';

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
  setRecommendations: (recs: Recommendation[]) => void;
  setSelectedRecommendation: (rec: Recommendation | null) => void;
  setTemperatureUnit: (unit: TemperatureUnit) => void;
  setSpecies: (species: string) => void;
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
  recommendations: [],
  selectedRecommendation: null,
};

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      ...initialState,
      settings: { species: 'Bass', temperatureUnit: 'F' as TemperatureUnit },
      setLocation: (loc) => set({ location: loc, locationError: null }),
      setLocationError: (err) => set({ locationError: err, locationLoading: false }),
      setLocationLoading: (loading) => set({ locationLoading: loading }),
      setWeather: (w) => set({ weather: w, weatherError: null }),
      setWeatherLoading: (loading) => set({ weatherLoading: loading }),
      setWeatherError: (err) => set({ weatherError: err, weatherLoading: false }),
      setDerived: (d) => set({ derived: d }),
      setRecommendations: (recs) => set({ recommendations: recs }),
      setSelectedRecommendation: (rec) => set({ selectedRecommendation: rec }),
      setTemperatureUnit: (unit) =>
        set((s) => ({ settings: { ...s.settings, temperatureUnit: unit } })),
      setSpecies: (species) =>
        set((s) => ({ settings: { ...s.settings, species } })),
      reset: () => set(initialState),
    }),
    {
      name: 'fishcast-settings',
      partialize: (state) => ({ settings: state.settings }),
    }
  )
);
