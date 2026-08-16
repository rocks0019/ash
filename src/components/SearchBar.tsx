import { useState, useRef, useEffect } from "react";
import { Search, Loader2, MapPin, X } from "lucide-react";
import { searchLocations } from "@/lib/weather";
import type { GeoResult } from "@/lib/types";

interface SearchBarProps {
  onSelect: (result: GeoResult) => void;
}

export function SearchBar({ onSelect }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<GeoResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      setError(null);
      return;
    }

    if (debounceRef.current) clearTimeout(debounceRef.current);
    setLoading(true);
    setError(null);

    debounceRef.current = setTimeout(async () => {
      try {
        const data = await searchLocations(query);
        setResults(data.results ?? []);
        setOpen(true);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Search failed");
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 350);

    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [query]);

  function handleSelect(result: GeoResult) {
    onSelect(result);
    setQuery("");
    setResults([]);
    setOpen(false);
  }

  return (
    <div ref={containerRef} className="relative w-full">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/60" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => results.length > 0 && setOpen(true)}
          placeholder="Search for a city..."
          className="w-full pl-12 pr-12 py-3.5 rounded-2xl bg-white/15 backdrop-blur-md text-white placeholder-white/60 border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/40 transition-all"
        />
        {loading && (
          <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/60 animate-spin" />
        )}
        {query && !loading && (
          <button
            onClick={() => { setQuery(""); setResults([]); }}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {open && (results.length > 0 || error) && (
        <div className="absolute top-full mt-2 w-full bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden z-50 border border-white/30">
          {error && (
            <div className="px-4 py-3 text-sm text-red-600">{error}</div>
          )}
          {results.length > 0 && (
            <ul className="max-h-72 overflow-y-auto">
              {results.map((result) => (
                <li key={`${result.id}-${result.latitude}-${result.longitude}`}>
                  <button
                    onClick={() => handleSelect(result)}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-100 transition-colors text-left"
                  >
                    <MapPin className="w-4 h-4 text-slate-400 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="font-medium text-slate-800 truncate">
                        {result.name}
                      </p>
                      <p className="text-sm text-slate-500 truncate">
                        {[result.admin1, result.country].filter(Boolean).join(", ")}
                      </p>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
          {results.length === 0 && !error && !loading && (
            <div className="px-4 py-3 text-sm text-slate-500">No results found</div>
          )}
        </div>
      )}
    </div>
  );
}
