import { useCallback } from 'react';
import { useAppStore } from '../store/app-store';
import { getCurrentPosition, geocodeZipCode, reverseGeocode } from '../services/location-service';
import { fetchWeather } from '../services/weather-service';
import { deriveConditions } from '../services/condition-deriver';
import { getRecommendations } from '../engine/recommendation-engine';
import type { LocationData } from '../engine/types';

export function useFishCast() {
  const store = useAppStore();

  const loadWeatherAndRecommendations = useCallback(async (loc: LocationData) => {
    store.setWeatherLoading(true);
    try {
      const weather = await fetchWeather(loc.lat, loc.lon);
      store.setWeather(weather);

      const derived = deriveConditions(loc.lat, new Date(), weather);
      store.setDerived(derived);

      const recs = getRecommendations({
        location: loc,
        timestamp: new Date(),
        weather,
        derived,
      });
      store.setRecommendations(recs);
      store.setWeatherLoading(false);
    } catch (err) {
      store.setWeatherError(err instanceof Error ? err.message : 'Failed to fetch weather');
    }
  }, [store]);

  const initWithGeolocation = useCallback(async () => {
    store.setLocationLoading(true);
    try {
      const loc = await getCurrentPosition();
      const label = await reverseGeocode(loc.lat, loc.lon);
      loc.label = label;
      store.setLocation(loc);
      store.setLocationLoading(false);
      await loadWeatherAndRecommendations(loc);
    } catch (err) {
      store.setLocationError(err instanceof Error ? err.message : 'Failed to get location');
    }
  }, [store, loadWeatherAndRecommendations]);

  const initWithZipCode = useCallback(async (zip: string) => {
    store.setLocationLoading(true);
    try {
      const loc = await geocodeZipCode(zip);
      store.setLocation(loc);
      store.setLocationLoading(false);
      await loadWeatherAndRecommendations(loc);
    } catch (err) {
      store.setLocationError(err instanceof Error ? err.message : 'Failed to geocode location');
    }
  }, [store, loadWeatherAndRecommendations]);

  const refresh = useCallback(async () => {
    if (store.location) {
      await loadWeatherAndRecommendations(store.location);
    }
  }, [store.location, loadWeatherAndRecommendations]);

  return {
    ...store,
    initWithGeolocation,
    initWithZipCode,
    refresh,
  };
}
