import { useEffect, useState } from 'react';
import { useFishCast } from './hooks/useFishCast';
import { ConditionSummary } from './components/ConditionSummary';
import { RecommendationCard } from './components/RecommendationCard';
import { DetailView } from './components/DetailView';
import { LocationInput } from './components/LocationInput';
import { Settings } from './components/Settings';
import { LoadingState } from './components/LoadingState';

export default function App() {
  const {
    location,
    locationLoading,
    locationError,
    weather,
    weatherLoading,
    weatherError,
    derived,
    recommendations,
    selectedRecommendation,
    setSelectedRecommendation,
    initWithGeolocation,
    initWithZipCode,
    refresh,
  } = useFishCast();

  const [showSettings, setShowSettings] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    if (!hasStarted && !location) {
      setHasStarted(true);
      initWithGeolocation();
    }
  }, [hasStarted, location, initWithGeolocation]);

  const isLoading = locationLoading || weatherLoading;
  const error = locationError || weatherError;
  const hasData = weather && derived && recommendations.length > 0;

  return (
    <div className="min-h-screen bg-slate-950">
      <div className="max-w-lg mx-auto px-4 pb-8">
        {/* Header */}
        <header className="sticky top-0 z-20 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/50 -mx-4 px-4 py-3 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🐟</span>
              <h1 className="text-xl font-bold text-white tracking-tight">FishCast</h1>
            </div>
            <div className="flex items-center gap-1">
              {hasData && (
                <button
                  onClick={refresh}
                  disabled={isLoading}
                  className="p-2 rounded-xl hover:bg-slate-800 transition-colors disabled:opacity-50"
                  aria-label="Refresh"
                >
                  <svg className={`w-5 h-5 text-slate-400 ${isLoading ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </button>
              )}
              <button
                onClick={() => setShowSettings(true)}
                className="p-2 rounded-xl hover:bg-slate-800 transition-colors"
                aria-label="Settings"
              >
                <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
            </div>
          </div>
        </header>

        {/* Error with manual fallback */}
        {error && (
          <div className="mb-4 bg-red-500/10 border border-red-500/30 rounded-2xl p-4">
            <p className="text-sm text-red-300 mb-3">{error}</p>
            <p className="text-xs text-slate-400 mb-3">Try entering your location manually:</p>
            <LocationInput onSubmit={initWithZipCode} loading={isLoading} />
          </div>
        )}

        {/* Loading */}
        {isLoading && !hasData && <LoadingState />}

        {/* Main content */}
        {hasData && (
          <div className="space-y-4">
            <ConditionSummary weather={weather} derived={derived} />

            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">
                Recommendations
              </h2>
              <span className="text-xs text-slate-500">{recommendations.length} strategies</span>
            </div>

            <div className="space-y-3">
              {recommendations.map((rec, i) => (
                <RecommendationCard
                  key={rec.id}
                  rec={rec}
                  index={i}
                  onClick={() => setSelectedRecommendation(rec)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Detail overlay */}
        {selectedRecommendation && (
          <DetailView
            rec={selectedRecommendation}
            onClose={() => setSelectedRecommendation(null)}
          />
        )}

        {/* Settings overlay */}
        {showSettings && <Settings onClose={() => setShowSettings(false)} />}
      </div>
    </div>
  );
}
