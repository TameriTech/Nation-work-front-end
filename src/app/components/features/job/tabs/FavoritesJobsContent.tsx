"use client";
import { Icon } from "@iconify/react";
import { Input } from "@/app/components/ui/input";
import { Button } from "@/app/components/ui/button";
import { JobCard } from "../JobCard";
import { useState, useEffect } from "react";
import { useServices } from "@/app/hooks/services/use-services";
import { Service } from "@/app/types/services";

interface FavoritesJobsContentProps {
  toggleFavorite: (id: number) => void;
  isFavorite: (id: number) => boolean;
}

export function FavoritesJobsContent({
  toggleFavorite,
  isFavorite,
}: FavoritesJobsContentProps) {
  const { services, loading } = useServices();
  const [favoriteServices, setFavoriteServices] = useState<Service[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    // Filtrer les services pour ne garder que les favoris
    const favorites = services.filter((s) => isFavorite(s.id));

    // Appliquer la recherche
    if (searchQuery) {
      setFavoriteServices(
        favorites.filter((s) =>
          s.title.toLowerCase().includes(searchQuery.toLowerCase()),
        ),
      );
    } else {
      setFavoriteServices(favorites);
    }
  }, [services, isFavorite, searchQuery]);

  return (
    <>
      <h1 className="text-3xl font-bold text-gray-800 mb-4">
        Travaux enregistrés dans vos favoris
      </h1>

      <div className="flex gap-4 mb-6">
        <div className="flex-1 relative">
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Recherchez dans vos favoris"
            className="pr-16 h-12 text-gray-600 rounded-full border-gray-400 bg-white"
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="p-1 hover:bg-gray-400 rounded"
              >
                <Icon icon="bi:x" className="w-4 h-4 text-gray-400" />
              </button>
            )}
            <Icon icon="bi:search" className="w-5 h-5 text-gray-400" />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-8">Chargement...</div>
      ) : favoriteServices.length === 0 ? (
        <div className="text-center py-12">
          <Icon
            icon="bi:heart"
            className="w-16 h-16 text-gray-300 mx-auto mb-4"
          />
          <p className="text-gray-500">Vous n'avez pas encore de favoris</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {favoriteServices.map((job) => (
            <JobCard
              key={job.id}
              service={job}
              isFavorite={true}
              onFavoriteClick={() => toggleFavorite(job.id)}
            />
          ))}
        </div>
      )}
    </>
  );
}
