// app/(dashboard)/provider/jobs/favorites/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { Icon } from "@iconify/react";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { MissionCard } from "@/app/components/ui/Cards/mission";
import { useproviderServices } from "@/app/hooks/services/use-provider-service";
import { cn } from "@/app/lib/utils";

export default function FavoritesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const { wishlist, isLoadingAvailable, toggleFavorite, isFavorite } = useproviderServices();
  const filteredFavorites = wishlist?.filter((item: any) =>
    item.title?.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  
  console.log("Filtered Wishlist:", filteredFavorites); // Debug log to check the structure of wishlist

  return (
    <div className="min-h-screen bg-background dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-16">
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <Link 
                href="/dashboard/provider/missions" 
                className="text-primary hover:text-primary/80 dark:text-primary-400 dark:hover:text-primary-300 hover:underline mb-2 inline-flex items-center gap-1 text-sm"
              >
                <Icon icon="ph:arrow-left" className="w-4 h-4" />
                Retour aux missions
              </Link>
              <h1 className="text-3xl font-bold text-text-primary dark:text-gray-100 mt-2">
                Mes favoris
              </h1>
              <p className="text-text-secondary dark:text-gray-400 mt-2">
                Retrouvez toutes les missions que vous avez mises en favori
              </p>
            </div>
            
            <Link href="/dashboard/provider/missions/history">
              <Button variant="outline" className="rounded-xl border-primary/20 text-primary hover:bg-primary/10 hover:border-primary/40 dark:border-primary-400/30 dark:text-primary-400 dark:hover:bg-primary/20 dark:hover:border-primary-400/50">
                <Icon icon="ph:clock-counter-clockwise" className="w-4 h-4 mr-2" />
                Voir mon historique
              </Button>
            </Link>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher dans mes favoris..."
              className={cn(
                "pl-10 h-12 rounded-xl focus:ring-2 focus:ring-primary",
                "border-gray-200 dark:border-gray-700",
                "bg-surface dark:bg-gray-800",
                "text-text-primary dark:text-gray-100",
                "placeholder:text-text-secondary dark:placeholder:text-gray-500"
              )}
            />
            <Icon
              icon="ph:magnifying-glass"
              className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                <Icon icon="ph:x" className="w-4 h-4 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300" />
              </button>
            )}
          </div>
        </div>

        {/* Results */}
        {isLoadingAvailable ? (
          <div className="text-center py-16">
            <Icon icon="ph:spinner" className="w-12 h-12 text-primary dark:text-primary-400 animate-spin mx-auto" />
            <p className="mt-4 text-text-secondary dark:text-gray-400">Chargement des favoris...</p>
          </div>
        ) : filteredFavorites.length === 0 ? (
          <div className="text-center py-16 bg-surface dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700">
            <Icon icon="ph:heart" className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-text-primary dark:text-gray-100 mb-2">
              {searchQuery ? "Aucun résultat trouvé" : "Aucun favori"}
            </h3>
            <p className="text-text-secondary dark:text-gray-400 mb-6">
              {searchQuery 
                ? "Essayez une autre recherche" 
                : "Ajoutez des missions à vos favoris pour les retrouver ici"}
            </p>
            {!searchQuery && (
              <Link href="/dashboard/provider/missions">
                <Button className="bg-primary hover:bg-primary/90 text-white rounded-xl">
                  Explorer les missions
                </Button>
              </Link>
            )}
          </div>
        ) : (
          <>
            <div className="mb-4">
              <p className="text-sm text-text-secondary dark:text-gray-400">
                <span className="font-semibold text-text-primary dark:text-gray-100">
                  {filteredFavorites.length}
                </span>{" "}
                favori{filteredFavorites.length > 1 ? "s" : ""}
              </p>
            </div>
            <div className="grid grid-cols-1 gap-5">
              {filteredFavorites.map((item: any) => (
                <MissionCard
                  key={item.id}
                  service={item}
                  variant="provider"
                  hasApplied={false}
                  isFavorite={isFavorite(item.code)}
                  onFavoriteClick={() => toggleFavorite(item.code)}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}