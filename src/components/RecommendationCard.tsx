import type { Recommendation } from '../engine/types';

function confidenceColor(c: number): string {
  if (c >= 80) return 'text-emerald-400';
  if (c >= 60) return 'text-yellow-400';
  return 'text-orange-400';
}

function confidenceBg(c: number): string {
  if (c >= 80) return 'bg-emerald-500/20 border-emerald-500/30';
  if (c >= 60) return 'bg-yellow-500/20 border-yellow-500/30';
  return 'bg-orange-500/20 border-orange-500/30';
}

export function RecommendationCard({
  rec,
  index,
  onClick,
}: {
  rec: Recommendation;
  index: number;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left bg-slate-800/60 backdrop-blur border border-slate-700/50 rounded-2xl p-4 
                 hover:bg-slate-700/60 hover:border-slate-600/50 transition-all duration-200 
                 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-blue-500/50"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-bold text-slate-500">#{index + 1}</span>
            <h3 className="text-base font-semibold text-white truncate">{rec.title}</h3>
          </div>
          <p className="text-sm text-slate-300 font-medium mb-2">{rec.lureType}</p>
          <div className="flex flex-wrap gap-1.5">
            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs bg-slate-700/60 text-slate-300">
              🎨 {rec.color}
            </span>
            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs bg-slate-700/60 text-slate-300">
              📏 {rec.depth}
            </span>
          </div>
        </div>

        <div className={`flex flex-col items-center px-2.5 py-1.5 rounded-xl border ${confidenceBg(rec.confidence)}`}>
          <span className={`text-lg font-bold ${confidenceColor(rec.confidence)}`}>{rec.confidence}</span>
          <span className="text-[10px] text-slate-400 uppercase tracking-wider">match</span>
        </div>
      </div>

      <div className="mt-3 flex items-center text-xs text-slate-500">
        <span>Tap for details</span>
        <svg className="w-3.5 h-3.5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </button>
  );
}
