"use client";
import { useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/app/components/ui/tabs";
import { TabsContent } from "@radix-ui/react-tabs";
import { JobListingsContent } from "./tabs/JobListingsContent";
import { FavoritesJobsContent } from "./tabs/FavoritesJobsContent";
import { JobHistoryContent } from "./tabs/JobHistoriqueList";
import { CreateCandidatureDto, Service } from "@/app/types/services";

interface JobListingsProps {
  availableServices: Service[];
  isLoading: boolean;
  onApply: (params: CreateCandidatureDto) => void;
  isApplying: boolean;
  pagination: any;
  applications: Service[];
  toggleFavorite?: (id: number) => void;
  isFavorite?: (id: number) => boolean;
  favorites?: number[];
}

export function JobListings({
  availableServices,
  isLoading,
  onApply,
  isApplying,
  pagination,
  applications,
  toggleFavorite,
  isFavorite,
  favorites = [],
}: JobListingsProps) {
  const [activeTab, setActiveTab] = useState("liste");

  return (
    <div className="flex-1 p-6 overflow-auto">
      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList className="w-full bg-transparent flex gap-2 overflow-x-auto whitespace-nowrap scrollbar-hide justify-start h-auto p-0 md:gap-8">
          <TabsTrigger
            value="liste"
            className="data-[state=active]:text-orange-500 text-gray-800 data-[state=active]:border-b-2 px-4 data-[state=active]:bg-transparent data-[state=active]:border-orange-500 border-0 rounded-none pb-3"
          >
            Liste d'emploi
          </TabsTrigger>
          <TabsTrigger
            value="favorites"
            className="data-[state=active]:text-orange-500 text-gray-800 data-[state=active]:border-b-2 px-4 data-[state=active]:bg-transparent data-[state=active]:border-orange-500 border-0 rounded-none pb-3"
          >
            Favorites ({favorites.length})
          </TabsTrigger>
          <TabsTrigger
            value="history"
            className="data-[state=active]:text-orange-500 text-gray-800 data-[state=active]:border-b-2 px-4 data-[state=active]:bg-transparent data-[state=active]:border-orange-500 border-0 rounded-none pb-3"
          >
            Historique
          </TabsTrigger>
        </TabsList>

        <TabsContent value="liste" className="mt-6">
          <JobListingsContent
            services={availableServices}
            isLoading={isLoading}
            onApply={onApply}
            isApplying={isApplying}
            pagination={pagination}
            toggleFavorite={toggleFavorite}
            isFavorite={isFavorite}
          />
        </TabsContent>

        <TabsContent value="favorites" className="mt-6">
          <FavoritesJobsContent
            services={availableServices}
            isLoading={isLoading}
            toggleFavorite={toggleFavorite}
            isFavorite={isFavorite}
            favorites={favorites}
          />
        </TabsContent>

        <TabsContent value="history" className="mt-6">
          <JobHistoryContent
            services={applications}
            isLoading={isLoading}
            toggleFavorite={toggleFavorite}
            isFavorite={isFavorite}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
