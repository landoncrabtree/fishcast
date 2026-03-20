import type { Recommendation } from '../engine/types';

function confidenceDot(c: number): string {
  if (c >= 80) return 'bg-emerald-500';
  if (c >= 60) return 'bg-yellow-500';
  return 'bg-orange-500';
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
      className="w-full text-left bg-white rounded-2xl border border-gray-200 p-4
                 hover:border-gray-300 hover:shadow-sm transition-all duration-150
                 active:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
    >
      <div className="flex items-start gap-3">
        {/* Number badge */}
        <div className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
          <span className="text-white text-sm font-bold">{index + 1}</span>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-base font-semibold text-gray-900 truncate">{rec.title}</h3>
            <div className="flex items-center gap-1.5 shrink-0">
              <span className={`w-2 h-2 rounded-full ${confidenceDot(rec.confidence)}`} />
              <span className="text-sm font-semibold text-gray-700">{rec.confidence}%</span>
              <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-0.5">{rec.lureType}</p>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 mt-2">
            <Tag>{rec.color}</Tag>
            <Tag>{rec.depth}</Tag>
            <Tag>{rec.retrieve}</Tag>
          </div>

          {/* Reasoning preview */}
          <p className="text-sm text-gray-500 mt-2 line-clamp-2">{rec.reasoning}</p>
        </div>
      </div>
    </button>
  );
}

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200">
      {children}
    </span>
  );
}
