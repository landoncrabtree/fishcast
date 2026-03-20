export function LoadingState() {
  return (
    <div className="space-y-4 animate-pulse">
      {/* Hero skeleton */}
      <div className="flex justify-between">
        <div>
          <div className="h-6 w-48 bg-gray-200 rounded mb-2" />
          <div className="h-4 w-36 bg-gray-100 rounded" />
        </div>
        <div className="h-12 w-16 bg-gray-200 rounded" />
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-4 gap-2">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-gray-100 rounded-xl h-20" />
        ))}
      </div>

      {/* Conditions card */}
      <div className="bg-white rounded-2xl border border-gray-200 p-4">
        <div className="h-5 w-36 bg-gray-200 rounded mb-3" />
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-4 bg-gray-100 rounded" />
          ))}
        </div>
      </div>

      {/* Rec cards */}
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-white rounded-2xl border border-gray-200 p-4">
          <div className="flex gap-3">
            <div className="w-10 h-10 rounded-full bg-gray-200" />
            <div className="flex-1">
              <div className="h-5 w-40 bg-gray-200 rounded mb-2" />
              <div className="h-4 w-28 bg-gray-100 rounded mb-3" />
              <div className="flex gap-2">
                <div className="h-5 w-20 bg-gray-100 rounded-full" />
                <div className="h-5 w-16 bg-gray-100 rounded-full" />
                <div className="h-5 w-18 bg-gray-100 rounded-full" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
