"use client";
import { useState } from "react";
import { Input } from "@/app/components/ui/input";
import { Button } from "@/app/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/app/components/ui/tabs";
import { JobCard } from "./JobCard";
import { Icon } from "@iconify/react";
import { TabsContent } from "@radix-ui/react-tabs";
import { JobListingsContent } from "./JobListingsContent";
import { FavoritesJobsContent } from "./FavoritesJobsContent";

export function JobListings() {
  const [activeTab, setActiveTab] = useState("liste");
  const [favorites, setFavorites] = useState<number[]>([]);

  const toggleFavorite = (id: number) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((fid) => fid !== id) : [...prev, id]
    );
  };

  return (
    <div className="flex-1 p-6 overflow-auto">
      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList className="bg-transparent rounded-none w-full justify-start gap-8 h-auto p-0">
          <TabsTrigger
            value="liste"
            className="data-[state=active]:text-orange-500 text-gray-800 data-[state=active]:border-b-2 px-4 data-[state=active]:bg-transparent data-[state=active]:border-orange-500 border-0 rounded-none pb-3"
          >
            {"Liste d'emploi"}
          </TabsTrigger>
          <TabsTrigger
            value="carte"
            className="data-[state=active]:text-orange-500 text-gray-800 data-[state=active]:border-b-2 px-4 data-[state=active]:bg-transparent data-[state=active]:border-orange-500 border-0 rounded-none pb-3"
          >
            {"Carte d'emploi"}
          </TabsTrigger>
          <TabsTrigger
            value="favorites"
            className="data-[state=active]:text-orange-500 text-gray-800 data-[state=active]:border-b-2 px-4 data-[state=active]:bg-transparent data-[state=active]:border-orange-500 border-0 rounded-none pb-3"
          >
            Favorites
          </TabsTrigger>
        </TabsList>
        <TabsContent value="liste" className="mt-6">
          <JobListingsContent
            favorites={favorites}
            toggleFavorite={toggleFavorite}
          />
        </TabsContent>
        <TabsContent value="carte" className="mt-6">
          <div className="">comming soon</div>
        </TabsContent>
        <TabsContent value="favorites" className="mt-6">
          <FavoritesJobsContent toggleFavorite={toggleFavorite} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
