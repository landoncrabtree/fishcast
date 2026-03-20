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
        className="flex-1 bg-slate-800/60 border border-slate-700/50 rounded-xl px-4 py-2.5 text-sm text-white 
                   placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent
                   disabled:opacity-50"
      />
      <button
        type="submit"
        disabled={loading || !query.trim()}
        className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 disabled:text-slate-500
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
