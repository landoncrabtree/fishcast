import type { Recommendation } from '../engine/types';

export function DetailView({ rec, onClose }: { rec: Recommendation; onClose: () => void }) {
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
          <h2 className="text-lg font-semibold text-white truncate">{rec.title}</h2>
        </div>

        {/* Content */}
        <div className="flex-1 p-4 space-y-4">
          {/* Confidence */}
          <div className="flex items-center gap-3 bg-slate-800/50 rounded-2xl p-4 border border-slate-700/50">
            <div className="relative w-14 h-14">
              <svg className="w-14 h-14 -rotate-90" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="15.9" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-700" />
                <circle
                  cx="18" cy="18" r="15.9" fill="none" strokeWidth="2"
                  strokeDasharray={`${rec.confidence} ${100 - rec.confidence}`}
                  className={rec.confidence >= 80 ? 'text-emerald-400' : rec.confidence >= 60 ? 'text-yellow-400' : 'text-orange-400'}
                  stroke="currentColor"
                  strokeLinecap="round"
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-white">
                {rec.confidence}
              </span>
            </div>
            <div>
              <div className="text-sm font-medium text-white">Match Confidence</div>
              <div className="text-xs text-slate-400">Based on current conditions</div>
            </div>
          </div>

          {/* Details grid */}
          <div className="space-y-3">
            <DetailItem icon="🎣" label="Lure Type" value={rec.lureType} />
            <DetailItem icon="🎨" label="Color" value={rec.color} />
            <DetailItem icon="🔄" label="Retrieve" value={rec.retrieve} />
            <DetailItem icon="📏" label="Depth / Zone" value={rec.depth} />
          </div>

          {/* Reasoning */}
          <div className="bg-slate-800/50 rounded-2xl p-4 border border-slate-700/50">
            <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-2">Why this works</h3>
            <p className="text-sm text-slate-300 leading-relaxed">{rec.reasoning}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function DetailItem({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div className="bg-slate-800/40 rounded-xl p-3.5 border border-slate-700/30">
      <div className="flex items-start gap-3">
        <span className="text-lg">{icon}</span>
        <div>
          <div className="text-xs text-slate-400 uppercase tracking-wider mb-0.5">{label}</div>
          <div className="text-sm text-white font-medium">{value}</div>
        </div>
      </div>
    </div>
  );
}
