export function LoadingState() {
  return (
    <div className="space-y-4 animate-pulse">
      {/* Condition summary skeleton */}
      <div className="bg-slate-800/50 rounded-2xl p-5 border border-slate-700/50">
        <div className="h-4 w-32 bg-slate-700 rounded mb-4" />
        <div className="grid grid-cols-2 gap-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-slate-700/40 rounded-xl p-3 h-20" />
          ))}
        </div>
      </div>

      {/* Card skeletons */}
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-slate-800/60 rounded-2xl p-4 border border-slate-700/50">
          <div className="flex justify-between">
            <div className="flex-1">
              <div className="h-4 w-40 bg-slate-700 rounded mb-2" />
              <div className="h-3 w-28 bg-slate-700/60 rounded mb-3" />
              <div className="flex gap-2">
                <div className="h-5 w-20 bg-slate-700/40 rounded" />
                <div className="h-5 w-24 bg-slate-700/40 rounded" />
              </div>
            </div>
            <div className="w-14 h-16 bg-slate-700/40 rounded-xl" />
          </div>
        </div>
      ))}
    </div>
  );
}
