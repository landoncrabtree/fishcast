import { useAppStore } from '../store/app-store';
import type { TemperatureUnit, MaxDepth, WaterClarity } from '../engine/types';

export function Settings({ onClose }: { onClose: () => void }) {
  const settings = useAppStore((s) => s.settings);
  const derived = useAppStore((s) => s.derived);
  const setTemperatureUnit = useAppStore((s) => s.setTemperatureUnit);
  const setSpecies = useAppStore((s) => s.setSpecies);
  const setMaxDepth = useAppStore((s) => s.setMaxDepth);
  const setWaterClarityOverride = useAppStore((s) => s.setWaterClarityOverride);

  return (
    <div className="fixed inset-0 z-50 bg-white overflow-auto">
      <div className="min-h-full max-w-lg mx-auto flex flex-col">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-gray-200 px-4 py-3 flex items-center gap-3">
          <button
            onClick={onClose}
            className="p-2 -ml-2 rounded-xl hover:bg-gray-100 transition-colors"
            aria-label="Close"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h2 className="text-lg font-semibold text-gray-900">Settings</h2>
        </div>

        <div className="flex-1 p-4 space-y-4">
          {/* Max Depth */}
          <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200">
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-1">Water Depth</h3>
            <p className="text-xs text-gray-400 mb-3">Filters lure and depth recommendations</p>
            <div className="flex gap-2">
              {([
                { value: 'Pond' as MaxDepth, label: 'Pond', hint: '≤5ft' },
                { value: 'Lake' as MaxDepth, label: 'Lake', hint: '≤12ft' },
                { value: 'Reservoir' as MaxDepth, label: 'Reservoir', hint: 'All' },
              ]).map(({ value, label, hint }) => (
                <button
                  key={value}
                  onClick={() => setMaxDepth(value)}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    settings.maxDepth === value
                      ? 'bg-emerald-600 text-white'
                      : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  {label}
                  <span className={`block text-[10px] mt-0.5 ${settings.maxDepth === value ? 'text-emerald-100' : 'text-gray-400'}`}>
                    {hint}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Water Clarity */}
          <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200">
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-1">Water Clarity</h3>
            <p className="text-xs text-gray-400 mb-3">
              {settings.waterClarityOverride === 'Auto' && derived
                ? `Auto-detected: ${derived.clarity} (based on weather)`
                : 'Override the weather-based estimate'}
            </p>
            <div className="flex gap-2">
              {(['Auto', 'Clear', 'Stained', 'Muddy'] as (WaterClarity | 'Auto')[]).map((clarity) => (
                <button
                  key={clarity}
                  onClick={() => setWaterClarityOverride(clarity)}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    settings.waterClarityOverride === clarity
                      ? 'bg-emerald-600 text-white'
                      : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  {clarity}
                </button>
              ))}
            </div>
          </div>

          {/* Temperature Unit */}
          <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200">
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-3">Temperature Unit</h3>
            <div className="flex gap-2">
              {(['F', 'C'] as TemperatureUnit[]).map((unit) => (
                <button
                  key={unit}
                  onClick={() => setTemperatureUnit(unit)}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    settings.temperatureUnit === unit
                      ? 'bg-emerald-600 text-white'
                      : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  °{unit}
                </button>
              ))}
            </div>
          </div>

          {/* Species */}
          <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200">
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-3">Target Species</h3>
            <div className="flex flex-wrap gap-2">
              {['Bass', 'Trout', 'Walleye', 'Panfish'].map((species) => (
                <button
                  key={species}
                  onClick={() => setSpecies(species)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    settings.species === species
                      ? 'bg-emerald-600 text-white'
                      : 'bg-white text-gray-500 border border-gray-200'
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
          <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200">
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-2">About</h3>
            <p className="text-sm text-gray-500 leading-relaxed">
              FishCast uses a point-based scoring engine to combine the best lure, color, retrieve, and depth
              for current conditions. Weather data from Open-Meteo. Designed for bass fishing.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
