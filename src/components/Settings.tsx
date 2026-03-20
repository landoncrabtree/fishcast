import { useAppStore } from '../store/app-store';
import type { TemperatureUnit } from '../engine/types';

export function Settings({ onClose }: { onClose: () => void }) {
  const settings = useAppStore((s) => s.settings);
  const setTemperatureUnit = useAppStore((s) => s.setTemperatureUnit);
  const setSpecies = useAppStore((s) => s.setSpecies);

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-sm overflow-auto">
      <div className="min-h-full flex flex-col max-w-lg mx-auto">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/50 px-4 py-3 flex items-center gap-3">
          <button
            onClick={onClose}
            className="p-2 -ml-2 rounded-xl hover:bg-slate-800 transition-colors"
            aria-label="Close"
          >
            <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h2 className="text-lg font-semibold text-white">Settings</h2>
        </div>

        <div className="flex-1 p-4 space-y-4">
          {/* Temperature Unit */}
          <div className="bg-slate-800/50 rounded-2xl p-4 border border-slate-700/50">
            <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-3">Temperature Unit</h3>
            <div className="flex gap-2">
              {(['F', 'C'] as TemperatureUnit[]).map((unit) => (
                <button
                  key={unit}
                  onClick={() => setTemperatureUnit(unit)}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    settings.temperatureUnit === unit
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-700/50 text-slate-400 hover:text-white'
                  }`}
                >
                  °{unit}
                </button>
              ))}
            </div>
          </div>

          {/* Species */}
          <div className="bg-slate-800/50 rounded-2xl p-4 border border-slate-700/50">
            <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-3">Target Species</h3>
            <div className="flex flex-wrap gap-2">
              {['Bass', 'Trout', 'Walleye', 'Panfish'].map((species) => (
                <button
                  key={species}
                  onClick={() => setSpecies(species)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    settings.species === species
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-700/50 text-slate-400 hover:text-white'
                  } ${species !== 'Bass' ? 'opacity-50 cursor-not-allowed' : ''}`}
                  disabled={species !== 'Bass'}
                >
                  {species}
                  {species !== 'Bass' && <span className="ml-1 text-[10px]">(soon)</span>}
                </button>
              ))}
            </div>
          </div>

          {/* About */}
          <div className="bg-slate-800/50 rounded-2xl p-4 border border-slate-700/50">
            <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-2">About</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              FishCast provides fishing recommendations based on real-time weather and environmental conditions. 
              Weather data from Open-Meteo. Recommendations are rule-based and designed for bass fishing.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
