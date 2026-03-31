import type { WeatherData, DerivedConditions } from '../engine/types';
import { useAppStore } from '../store/app-store';

function windDir(deg: number): string {
  const dirs = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  return dirs[Math.round(deg / 45) % 8];
}

function tempStr(f: number, unit: 'F' | 'C'): string {
  if (unit === 'C') return `${Math.round((f - 32) * (5 / 9))}°`;
  return `${Math.round(f)}°`;
}

export function ConditionSummary({ weather, derived }: { weather: WeatherData; derived: DerivedConditions }) {
  const unit = useAppStore((s) => s.settings.temperatureUnit);
  const location = useAppStore((s) => s.location);
  const bassPosition = useAppStore((s) => s.bassPosition);
  const now = new Date();
  const dateStr = now.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
  const timeStr = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });

  return (
    <div className="space-y-4">
      {/* Location + Temp hero */}
      <div className="flex items-start justify-between">
        <div>
          {location?.label && (
            <h2 className="text-xl font-bold text-gray-900">{location.label}</h2>
          )}
          <p className="text-sm text-gray-500">{dateStr} at {timeStr}</p>
        </div>
        <div className="text-right">
          <div className="text-5xl font-light text-gray-900 leading-none">
            {tempStr(weather.tempF, unit)}
          </div>
          <p className="text-sm text-gray-500 mt-1">{weather.weatherDescription}</p>
        </div>
      </div>

      {/* 4 stat cards */}
      <div className="grid grid-cols-4 gap-2">
        <StatCard
          icon={<FeelsIcon />}
          label="Feels"
          value={tempStr(weather.feelsLikeF, unit)}
        />
        <StatCard
          icon={<WindIcon />}
          label="Wind"
          value={`${Math.round(weather.windSpeedMph)} ${windDir(weather.windDirection)}`}
        />
        <StatCard
          icon={<HumidityIcon />}
          label="Humidity"
          value={`${Math.round(weather.humidityPercent)}%`}
        />
        <StatCard
          icon={<CloudIcon />}
          label="Clouds"
          value={`${Math.round(weather.cloudCoverPercent)}%`}
        />
      </div>

      {/* Fishing Conditions card */}
      <div className="bg-white rounded-2xl border border-gray-200 p-4">
        <h3 className="text-base font-semibold text-gray-900 mb-3">Fishing Conditions</h3>
        <div className="grid grid-cols-2 gap-y-2.5 gap-x-6">
          <CondRow label="Time" value={derived.timeOfDay} />
          <CondRow label="Season" value={derived.seasonPhase} />
          <CondRow label="Water Temp" value={`~${tempStr(derived.waterTempEstimateF, unit)}${unit}`} />
          <CondRow label="Clarity" value={derived.clarity} />
          <CondRow label="Light" value={derived.lightLevel} />
          <CondRow label="Pressure" value={derived.pressureTrend} />
        </div>
      </div>

      {/* Bass Position insight */}
      {bassPosition && (
        <div className="bg-emerald-50 rounded-2xl border border-emerald-200 p-4">
          <div className="flex items-start gap-3">
            <span className="text-lg leading-none mt-0.5">🐟</span>
            <div>
              <p className="text-sm font-semibold text-gray-900">
                Bass are likely <span className="text-emerald-700 lowercase">{bassPosition.zone}</span>
              </p>
              <p className="text-xs text-gray-500 mt-1 leading-relaxed">{bassPosition.reasoning}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="bg-emerald-50 rounded-xl py-3 px-2 flex flex-col items-center gap-1">
      <span className="text-emerald-700">{icon}</span>
      <span className="text-xs text-gray-500">{label}</span>
      <span className="text-sm font-semibold text-gray-900">{value}</span>
    </div>
  );
}

function CondRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-sm text-gray-500">{label}</span>
      <span className="text-sm font-semibold text-gray-900">{value}</span>
    </div>
  );
}

// ── Icons ──
function FeelsIcon() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m8-9h1M3 12H2m15.364-6.364l.707.707M6.343 17.657l-.707.707m12.021 0l.707-.707M6.343 6.343l-.707-.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  );
}

function WindIcon() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 8h13a3 3 0 110 6h-2M3 16h9a3 3 0 100-6M3 12h5" />
    </svg>
  );
}

function HumidityIcon() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 21.5c-3.6 0-6.5-2.9-6.5-6.5 0-4.5 6.5-12.5 6.5-12.5s6.5 8 6.5 12.5c0 3.6-2.9 6.5-6.5 6.5z" />
    </svg>
  );
}

function CloudIcon() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6.341 17.059a4.5 4.5 0 01-.847-8.956A5.5 5.5 0 0116.5 8.5h.5a4 4 0 014 4 4 4 0 01-4 4H7a.66.66 0 01-.659-.941" />
    </svg>
  );
}
