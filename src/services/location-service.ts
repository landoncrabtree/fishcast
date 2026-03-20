import type { LocationData } from '../engine/types';

interface GeocodingResult {
  results?: Array<{
    latitude: number;
    longitude: number;
    name: string;
    admin1?: string;
    country?: string;
  }>;
}

export async function getCurrentPosition(): Promise<LocationData> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by this browser'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        });
      },
      (error) => {
        reject(new Error(`Geolocation error: ${error.message}`));
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 300000 }
    );
  });
}

export async function geocodeZipCode(zip: string): Promise<LocationData> {
  const res = await fetch(
    `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(zip)}&count=1&language=en&format=json`
  );
  if (!res.ok) throw new Error('Geocoding request failed');

  const data: GeocodingResult = await res.json();
  if (!data.results?.length) throw new Error('Location not found');

  const r = data.results[0];
  return {
    lat: r.latitude,
    lon: r.longitude,
    label: [r.name, r.admin1].filter(Boolean).join(', '),
  };
}

export async function reverseGeocode(lat: number, lon: number): Promise<string> {
  try {
    const res = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${lat.toFixed(2)},${lon.toFixed(2)}&count=1&language=en&format=json`
    );
    if (res.ok) {
      const data: GeocodingResult = await res.json();
      if (data.results?.length) {
        const r = data.results[0];
        return [r.name, r.admin1].filter(Boolean).join(', ');
      }
    }
  } catch {
    // Fall through to default
  }
  return `${lat.toFixed(2)}°, ${lon.toFixed(2)}°`;
}
