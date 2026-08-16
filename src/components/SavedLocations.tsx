import { useEffect, useState } from "react";
import { Star, Trash2, Loader2, MapPin } from "lucide-react";
import { supabase } from "@/lib/supabase";
import type { SavedLocation } from "@/lib/types";

interface SavedLocationsProps {
  onSelect: (location: SavedLocation) => void;
  activeLocation?: { latitude: number; longitude: number };
  refreshKey: number;
}

export function SavedLocations({ onSelect, activeLocation, refreshKey }: SavedLocationsProps) {
  const [locations, setLocations] = useState<SavedLocation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      const { data, error } = await supabase
        .from("saved_locations")
        .select("*")
        .order("created_at", { ascending: false });

      if (!cancelled) {
        if (error) {
          console.error("Failed to load saved locations:", error);
        }
        setLocations(data ?? []);
        setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, [refreshKey]);

  async function handleDelete(id: string, e: React.MouseEvent) {
    e.stopPropagation();
    const { error } = await supabase.from("saved_locations").delete().eq("id", id);
    if (error) {
      console.error("Failed to delete location:", error);
      return;
    }
    setLocations((prev) => prev.filter((l) => l.id !== id));
  }

  if (loading) {
    return (
      <div className="bg-white/10 backdrop-blur-md rounded-3xl p-5 border border-white/10 flex items-center justify-center min-h-[120px]">
        <Loader2 className="w-5 h-5 text-white/60 animate-spin" />
      </div>
    );
  }

  if (locations.length === 0) {
    return (
      <div className="bg-white/10 backdrop-blur-md rounded-3xl p-5 border border-white/10">
        <h3 className="text-white/80 text-sm font-medium mb-2">Saved Locations</h3>
        <p className="text-sm text-white/50">
          Star a location to save it here for quick access.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-3xl p-5 border border-white/10">
      <h3 className="text-white/80 text-sm font-medium mb-3 flex items-center gap-2">
        <Star className="w-4 h-4" />
        Saved Locations
      </h3>
      <div className="flex flex-col gap-1">
        {locations.map((loc) => {
          const isActive =
            activeLocation &&
            Math.abs(activeLocation.latitude - loc.latitude) < 0.01 &&
            Math.abs(activeLocation.longitude - loc.longitude) < 0.01;

          return (
            <button
              key={loc.id}
              onClick={() => onSelect(loc)}
              className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors text-left w-full ${
                isActive ? "bg-white/20" : "hover:bg-white/10"
              }`}
            >
              <MapPin className="w-4 h-4 text-white/50 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">{loc.name}</p>
                {loc.country && (
                  <p className="text-xs text-white/50 truncate">{loc.country}</p>
                )}
              </div>
              <span
                onClick={(e) => handleDelete(loc.id, e)}
                className="opacity-0 group-hover:opacity-100 text-white/40 hover:text-red-300 transition-all p-1 cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
