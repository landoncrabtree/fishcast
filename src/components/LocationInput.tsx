import { useState } from 'react';

export function LocationInput({ onSubmit, loading }: { onSubmit: (query: string) => void; loading: boolean }) {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) onSubmit(query.trim());
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Enter city or zip code"
        disabled={loading}
        className="flex-1 bg-white border border-gray-300 rounded-xl px-4 py-2.5 text-sm text-gray-900
                   placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500
                   disabled:opacity-50"
      />
      <button
        type="submit"
        disabled={loading || !query.trim()}
        className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:bg-gray-300 disabled:text-gray-500
                   text-white text-sm font-medium rounded-xl transition-colors"
      >
        {loading ? (
          <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" className="opacity-25" />
            <path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="opacity-75" />
          </svg>
        ) : (
          'Search'
        )}
      </button>
    </form>
  );
}
