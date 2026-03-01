"use client";
import { Icon } from "@iconify/react";
import { Input } from "@/app/components/ui/input";
import { Button } from "@/app/components/ui/button";
import { JobCard } from "../JobCard";
import { useState, useEffect } from "react";
import { useServices } from "@/app/hooks/services/use-services";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/app/components/ui/tabs";

interface JobHistoryContentProps {
  toggleFavorite: (id: number) => void;
  isFavorite: (id: number) => boolean;
}

export function JobHistoryContent({
  toggleFavorite,
  isFavorite,
}: JobHistoryContentProps) {
  const { services, loading } = useServices({
    mode: "client", // Historique des services du client
  });
  const [activeTab, setActiveTab] = useState("all");

  const filteredServices = services.filter((s) => {
    if (activeTab === "all") return true;
    return s.status === activeTab;
  });

  return (
    <>
      <div className="flex gap-4 mb-6">
        <div className="flex-1 relative">
          <Input
            placeholder="Rechercher dans votre historique"
            className="pr-16 h-12 text-gray-600 rounded-full border-gray-400 bg-white"
          />
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
          {loading ? (
            <div className="text-center py-8">Chargement...</div>
          ) : filteredServices.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">Aucun service dans l'historique</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {filteredServices.map((job) => (
                <JobCard
                  key={job.id}
                  service={job}
                  isFavorite={isFavorite(job.id)}
                  onFavoriteClick={() => toggleFavorite(job.id)}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </>
  );
}
