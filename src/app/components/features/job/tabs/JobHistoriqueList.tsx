"use client";
import { Icon } from "@iconify/react";
import { Input } from "@/app/components/ui/input";
import { Button } from "@/app/components/ui/button";
import { JobCard } from "../JobCard";
import { useState } from "react";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/app/components/ui/tabs";
import { Service } from "@/app/types/services";

interface JobHistoryContentProps {
  services: Service[];
  isLoading: boolean;
  toggleFavorite?: (id: number) => void;
  isFavorite?: (id: number) => boolean;
}

export function JobHistoryContent({
  services,
  isLoading,
  toggleFavorite,
  isFavorite,
}: JobHistoryContentProps) {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredServices = services
    .filter((s) => {
      if (activeTab === "all") return true;
      return s.status === activeTab;
    })
    .filter((s) =>
      searchQuery
        ? s.title.toLowerCase().includes(searchQuery.toLowerCase())
        : true,
    );

  if (isLoading) {
    return <div className="text-center py-8">Chargement...</div>;
  }

  return (
    <>
      <div className="flex gap-4 mb-6">
        <div className="flex-1 relative">
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher dans votre historique"
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

      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList>
          <TabsTrigger value="all">Tous</TabsTrigger>
          <TabsTrigger value="completed">Terminés</TabsTrigger>
          <TabsTrigger value="canceled">Annulés</TabsTrigger>
          <TabsTrigger value="in_progress">En cours</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-4">
          {filteredServices.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">Aucun service dans l'historique</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {filteredServices.map((job) => (
                <JobCard
                  key={job.id}
                  service={job}
                  show_status={true}
                  isFavorite={isFavorite ? isFavorite(job.id) : false}
                  onFavoriteClick={
                    toggleFavorite ? () => toggleFavorite(job.id) : undefined
                  }
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </>
  );
}
