import type { Recommendation } from '../engine/types';

export function DetailView({ rec, onClose }: { rec: Recommendation; onClose: () => void }) {
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
          <h2 className="text-lg font-semibold text-gray-900 truncate">{rec.title}</h2>
        </div>

        <div className="flex-1 p-4 space-y-4">
          {/* Confidence ring */}
          <div className="flex items-center gap-4 bg-gray-50 rounded-2xl p-4 border border-gray-200">
            <div className="relative w-16 h-16">
              <svg className="w-16 h-16 -rotate-90" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="15.9" fill="none" stroke="#e5e7eb" strokeWidth="2.5" />
                <circle
                  cx="18" cy="18" r="15.9" fill="none" strokeWidth="2.5"
                  strokeDasharray={`${rec.confidence} ${100 - rec.confidence}`}
                  className={rec.confidence >= 80 ? 'text-emerald-500' : rec.confidence >= 60 ? 'text-yellow-500' : 'text-orange-500'}
                  stroke="currentColor"
                  strokeLinecap="round"
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-base font-bold text-gray-900">
                {rec.confidence}%
              </span>
            </div>
            <div>
              <div className="text-sm font-semibold text-gray-900">Match Confidence</div>
              <div className="text-xs text-gray-500">{rec.totalPoints} total points from conditions</div>
            </div>
          </div>

          {/* Details */}
          <div className="space-y-3">
            <DetailItem icon="🎣" label="Lure Type" value={rec.lureType} />
            <DetailItem icon="🎨" label="Color" value={rec.color} />
            <DetailItem icon="🔄" label="Retrieve" value={rec.retrieve} />
            <DetailItem icon="📏" label="Depth / Zone" value={rec.depth} />
          </div>

          {/* Reasoning */}
          <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200">
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-2">Why This Works</h3>
            <p className="text-sm text-gray-600 leading-relaxed">{rec.reasoning}</p>
          </div>

          {/* Point breakdown */}
          <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200">
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-3">Point Breakdown</h3>
            <div className="space-y-3">
              <BreakdownSection label="Lure" attr={rec.breakdown.lure} />
              <BreakdownSection label="Color" attr={rec.breakdown.color} />
              <BreakdownSection label="Retrieve" attr={rec.breakdown.retrieve} />
              <BreakdownSection label="Depth" attr={rec.breakdown.depth} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DetailItem({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div className="bg-white rounded-xl p-3.5 border border-gray-200">
      <div className="flex items-start gap-3">
        <span className="text-lg">{icon}</span>
        <div>
          <div className="text-xs text-gray-500 uppercase tracking-wider mb-0.5">{label}</div>
          <div className="text-sm text-gray-900 font-medium">{value}</div>
        </div>
      </div>
    </div>
  );
}

function BreakdownSection({ label, attr }: { label: string; attr: { name: string; points: number; reasons: string[] } }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-sm font-medium text-gray-900">{label}: {attr.name}</span>
        <span className={`text-sm font-bold ${attr.points > 0 ? 'text-emerald-600' : 'text-gray-400'}`}>
          {attr.points > 0 ? '+' : ''}{attr.points} pts
        </span>
      </div>
      <div className="space-y-0.5">
        {attr.reasons.map((reason, i) => (
          <p key={i} className="text-xs text-gray-500 pl-2 border-l-2 border-gray-200">{reason}</p>
        ))}
      </div>
    </div>
  );
}
