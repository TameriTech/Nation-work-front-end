// app/(dashboard)/provider/jobs/page.tsx
"use client";

import { useState, useCallback, useMemo } from "react";
import { Icon } from "@iconify/react";
import Link from "next/link";
import { useproviderServices } from "@/app/hooks/services/use-provider-service";
import { usePublicCategories } from "@/app/hooks/services/use-categories";
import { MissionCard } from "@/app/components/ui/Cards/mission";
import { MissionFilters } from "@/app/components/ui/mission-filters";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/app/components/ui/sheet";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import { SkeletonCard } from "@/app/components/ui/Cards/skeleton-card";
import { DurationUnit } from "@/app/types";
import { cn } from "@/app/lib/utils";
import { useWishlist } from "@/app/hooks/services/use-wishlist";

export default function providerJobsPage() {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("created_at");

  const {
    availableServices,
    availablePagination,
    isLoadingAvailable,
    filters,
    updateFilters,
    applyToService,
    isApplying,
  } = useproviderServices({
    initialFilters: {
      page: 1,
      per_page: 12,
      sort_by: "created_at",
      sort_order: "desc",
    },
  });

  const {
    toggleWishlist: toggleFavorite,
    wishlist,
  } = useWishlist();

  console.log("Liste de missions: ", availableServices); // Debug log to check the structure of available services

  const { categories } = usePublicCategories();

  // IDs des favoris
  const favoritesCount = wishlist?.length || 0;

  // Appliquer les filtres
  const handleSearch = () => {
    updateFilters({
      search: searchInput || undefined,
      category_id: selectedCategory !== "all" ? Number(selectedCategory) : undefined,
      page: 1,
    });
  };

  const handleSortChange = (value: string) => {
    setSortBy(value);
    updateFilters({
      sort_by: value === "price_asc" || value === "price_desc" ? "proposed_amount" : "created_at",
      sort_order: value === "price_asc" ? "asc" : "desc",
      page: 1,
    });
  };

  const handlePageChange = (page: number) => {
    updateFilters({ page });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-background dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-16">
        
        {/* Header with navigation to other sections */}
        <div className="mb-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-bold text-text-primary dark:text-gray-100">
                Trouvez votre mission idéale
              </h1>
              <p className="text-text-secondary dark:text-gray-400 mt-2">
                Parcourez les offres et trouvez celle qui correspond à vos compétences
              </p>
            </div>
            
            {/* Navigation to other sections */}
            <div className="flex gap-3">
              <Link href="/dashboard/provider/missions/favorites">
                <Button variant="default" className="relative rounded-xl border-primary/20 hover:border-primary/40 dark:border-primary-400/30 dark:hover:border-primary-400/50">
                  <Icon icon="ph:heart" className="w-4 h-4 mr-2 text-white dark:text-primary-400" />
                  Favoris
                  {favoritesCount > 0 && (
                    <span className="absolute -top-2 -right-2 w-5 h-5 bg-error dark:bg-red-600 text-white text-xs rounded-full flex items-center justify-center">
                      {favoritesCount}
                    </span>
                  )}
                </Button>
              </Link>
              <Link href="/dashboard/provider/missions/history">
                <Button variant="default" className="rounded-xl border-primary/20 hover:border-primary/40 dark:border-primary-400/30 dark:hover:border-primary-400/50">
                  <Icon icon="ph:clock-counter-clockwise" className="w-4 h-4 mr-2 text-white dark:text-primary-400" />
                  Historique
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          {/* Search Input */}
          <div className="flex-1 relative">
            <Input
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="Rechercher une mission (titre, compétence...)"
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
            {searchInput && (
              <button
                onClick={() => {
                  setSearchInput("");
                  updateFilters({ search: undefined, page: 1 });
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                <Icon icon="ph:x" className="w-4 h-4 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300" />
              </button>
            )}
          </div>

          {/* Category Filter (Desktop) */}
          <div className="hidden md:block w-64">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="h-12 rounded-xl border-gray-200 dark:border-gray-700 bg-surface dark:bg-gray-800 focus:ring-primary text-text-primary dark:text-gray-100">
                <SelectValue placeholder="Toutes catégories" />
              </SelectTrigger>
              <SelectContent className="bg-surface dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                <SelectItem value="all">Toutes catégories</SelectItem>
                {categories?.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id.toString()}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Search Button */}
          <Button
            onClick={handleSearch}
            className="h-12 px-6 bg-primary hover:bg-primary/90 text-white rounded-xl"
          >
            <Icon icon="ph:magnifying-glass" className="w-5 h-5 mr-2" />
            Rechercher
          </Button>

          {/* Mobile Filter Button */}
          <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" className="md:hidden h-12 rounded-xl border-primary/20 hover:border-primary/40 dark:border-primary-400/30 dark:hover:border-primary-400/50">
                <Icon icon="ph:funnel" className="w-5 h-5 mr-2 text-primary dark:text-primary-400" />
                Filtres
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-full max-w-sm p-0 dark:bg-gray-800">
              <MissionFilters
                filters={filters}
                onApplyFilters={(newFilters) => {
                  updateFilters(newFilters);
                  setIsFilterOpen(false);
                }}
                categories={categories}
              />
            </SheetContent>
          </Sheet>
        </div>

        {/* Results Section */}
        <div className="flex gap-8">
          {/* Desktop Filters Sidebar */}
          <div className="hidden md:block w-80 flex-shrink-0">
            <div className="sticky top-24">
              <MissionFilters
                filters={filters}
                onApplyFilters={updateFilters}
                categories={categories}
              />
            </div>
          </div>

          {/* Results */}
          <div className="flex-1">
            {/* Results count */}
            <div className="flex justify-between items-center mb-4">
              <p className="text-sm text-text-secondary dark:text-gray-400">
                {isLoadingAvailable ? (
                  "Chargement..."
                ) : (
                  <>
                    <span className="font-semibold text-text-primary dark:text-gray-100">
                      {availablePagination?.total || 0}
                    </span>{" "}
                    mission{availablePagination?.total !== 1 ? "s" : ""} disponible{availablePagination?.total !== 1 ? "s" : ""}
                  </>
                )}
              </p>
            </div>

            {/* Job Cards Grid */}
            {isLoadingAvailable ? (
              <div className="grid grid-cols-1 gap-5">
                {[...Array(6)].map((_, i) => (
                  <SkeletonCard key={i} />
                ))}
              </div>
            ) : availableServices?.length === 0 ? (
              <div className="text-center py-16 bg-surface dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700">
                <Icon icon="ph:package" className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-text-primary dark:text-gray-100 mb-2">
                  Aucune mission trouvée
                </h3>
                <p className="text-text-secondary dark:text-gray-400">
                  Essayez de modifier vos critères de recherche
                </p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 gap-5">
                  {availableServices?.map((service) => (
                    <MissionCard
                      key={service.id}
                      service={service}
                      variant="provider"
                      hasApplied={service.user_candidature_id}
                      isFavorite={service.is_favorited}
                      onFavoriteClick={() => toggleFavorite(service.code, service.is_favorited)}
                      onApply={() =>
                        applyToService({
                          service_code: service.code,
                          proposed_price: undefined,
                          cover_letter: undefined,
                          availability_confirmed: true,
                          estimated_duration: "",
                          estimated_duration_unit: "days" as DurationUnit,
                          proposed_start_date: undefined,
                        })
                      }
                      isApplying={isApplying}
                    />
                  ))}
                </div>

                {/* Pagination */}
                {availablePagination && availablePagination.totalPages > 1 && (
                  <div className="flex justify-center mt-8">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handlePageChange(availablePagination.page - 1)}
                        disabled={availablePagination.page === 1}
                        className="w-10 h-10 rounded-xl border border-gray-200 dark:border-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                      >
                        <Icon icon="ph:caret-left" className="w-4 h-4 mx-auto dark:text-gray-400" />
                      </button>
                      
                      {Array.from({ length: Math.min(5, availablePagination.totalPages) }, (_, i) => {
                        let pageNum: number;
                        const totalPages = availablePagination.totalPages;
                        const currentPage = availablePagination.page;
                        
                        if (totalPages <= 5) {
                          pageNum = i + 1;
                        } else if (currentPage <= 3) {
                          pageNum = i + 1;
                        } else if (currentPage >= totalPages - 2) {
                          pageNum = totalPages - 4 + i;
                        } else {
                          pageNum = currentPage - 2 + i;
                        }
                        
                        return (
                          <button
                            key={pageNum}
                            onClick={() => handlePageChange(pageNum)}
                            className={cn(
                              "w-10 h-10 rounded-xl font-medium transition-all",
                              currentPage === pageNum
                                ? "bg-primary text-white shadow-md"
                                : "border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 text-text-primary dark:text-gray-300"
                            )}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                      
                      <button
                        onClick={() => handlePageChange(availablePagination.page + 1)}
                        disabled={availablePagination.page === availablePagination.totalPages}
                        className="w-10 h-10 rounded-xl border border-gray-200 dark:border-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                      >
                        <Icon icon="ph:caret-right" className="w-4 h-4 mx-auto dark:text-gray-400" />
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}