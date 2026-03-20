import type { DerivedConditions, WeatherData } from '../engine/types';
import { useAppStore } from '../store/app-store';

function windDirectionLabel(deg: number): string {
  const dirs = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  return dirs[Math.round(deg / 45) % 8];
}

function tempDisplay(f: number, unit: 'F' | 'C'): string {
  if (unit === 'C') return `${Math.round((f - 32) * (5 / 9))}°C`;
  return `${Math.round(f)}°F`;
}

export function ConditionSummary({ weather, derived }: { weather: WeatherData; derived: DerivedConditions }) {
  const unit = useAppStore((s) => s.settings.temperatureUnit);
  const location = useAppStore((s) => s.location);

  return (
    <div className="bg-slate-800/50 backdrop-blur rounded-2xl p-5 border border-slate-700/50">
      {location?.label && (
        <div className="flex items-center gap-2 mb-3">
          <svg className="w-4 h-4 text-blue-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="text-sm text-slate-300 truncate">{location.label}</span>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-slate-700/40 rounded-xl p-3">
          <div className="text-xs text-slate-400 uppercase tracking-wider mb-1">Temperature</div>
          <div className="text-2xl font-bold text-white">{tempDisplay(weather.tempF, unit)}</div>
          <div className="text-xs text-slate-400 mt-0.5">
            H: {tempDisplay(weather.tempHighF, unit)} · L: {tempDisplay(weather.tempLowF, unit)}
          </div>
        </div>

        <div className="bg-slate-700/40 rounded-xl p-3">
          <div className="text-xs text-slate-400 uppercase tracking-wider mb-1">Wind</div>
          <div className="text-2xl font-bold text-white">{Math.round(weather.windSpeedMph)}<span className="text-sm font-normal text-slate-400"> mph</span></div>
          <div className="text-xs text-slate-400 mt-0.5">{windDirectionLabel(weather.windDirection)}</div>
        </div>

        <div className="bg-slate-700/40 rounded-xl p-3">
          <div className="text-xs text-slate-400 uppercase tracking-wider mb-1">Water Temp (est.)</div>
          <div className="text-lg font-semibold text-cyan-400">{tempDisplay(derived.waterTempEstimateF, unit)}</div>
        </div>

        <div className="bg-slate-700/40 rounded-xl p-3">
          <div className="text-xs text-slate-400 uppercase tracking-wider mb-1">Conditions</div>
          <div className="text-sm font-medium text-white">{derived.clarity} water</div>
          <div className="text-xs text-slate-400 mt-0.5">{weather.cloudCoverPercent}% cloud</div>
        </div>
      </div>

      <div className="flex gap-2 mt-3">
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-300 border border-blue-500/30">
          {derived.timeOfDay}
        </span>
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
          {derived.seasonPhase}
        </span>
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-purple-500/20 text-purple-300 border border-purple-500/30">
          {Math.round(weather.pressureHpa)} hPa
        </span>
      </div>
    </div>
  );
}
