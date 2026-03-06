"use client";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/app/components/ui/accordion";
import { JobFilters } from "@/app/components/features/job/JobFilters";
import { JobListings } from "@/app/components/features/job/JobListingsTab";
import { Icon } from "@iconify/react";
import { useFreelancerServices } from "@/app/hooks/services/use-freelancer-service";
import { useCategories } from "@/app/hooks/use-categories";

export default function JobListingsPage() {
  const {
    availableServices,
    availablePagination,
    isLoadingAvailable,
    filters,
    updateFilters,
    applyToService,
    isApplying,
    applications,
    wishlist, // À ajouter dans le hook si nécessaire
    toggleFavorite, // À ajouter dans le hook si nécessaire
    isFavorite, // À ajouter dans le hook si nécessaire
    isLoading,
  } = useFreelancerServices({
    initialFilters: {
      page: 1,
      per_page: 10,
      sort_by: "date",
      sort_order: "desc",
    },
  });
  // keep only the ids
  const favorites = wishlist.map((item) => item.service_id);
  const { categories, loading: categoriesLoading } = useCategories();

  return (
    <div className="min-h-screen bg-white mt-5 rounded-3xl flex flex-col lg:flex-row">
      {/* Filters sidebar */}
      <div className="hidden lg:block border-r">
        <JobFilters
          filters={filters}
          onApplyFilters={updateFilters}
          categories={categories}
        />
      </div>

      {/* Mobile filters accordion */}
      <div className="lg:hidden w-full px-8">
        <Accordion type="single" collapsible>
          <AccordionItem value="filters">
            <AccordionTrigger>
              <span className="flex items-center gap-2">
                <Icon icon="bi:filter" /> Filtres
              </span>
            </AccordionTrigger>
            <AccordionContent>
              <JobFilters
                filters={filters}
                onApplyFilters={updateFilters}
                categories={categories}
              />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      {/* Results */}
      <JobListings
        availableServices={availableServices}
        isLoading={isLoadingAvailable}
        onApply={applyToService}
        isApplying={isApplying}
        pagination={availablePagination}
        applications={applications}
        toggleFavorite={toggleFavorite}
        isFavorite={isFavorite}
        favorites={favorites}
      />
    </div>
  );
}
