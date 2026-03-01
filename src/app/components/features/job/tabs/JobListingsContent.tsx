"use client";
import { Icon } from "@iconify/react";
import { Input } from "@/app/components/ui/input";
import { Button } from "@/app/components/ui/button";
import { JobCard } from "../JobCard";
import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import { useServices } from "@/app/hooks/services/use-services";
import { useCategories } from "@/app/hooks/use-categories";
import { Service } from "@/app/types/services";

interface JobListingsContentProps {
  services: Service[];
  toggleFavorite: (id: number) => void;
  isFavorite: (id: number) => boolean;
}

export function JobListingsContent({
  services,
  toggleFavorite,
  isFavorite,
}: JobListingsContentProps) {
  const { updateFilters, filters, loading } = useServices();
  const { categories } = useCategories();

  return (
    <>
      {/* Title */}
      <h1 className="text-3xl font-bold text-gray-800 mb-4">
        Trouvez votre parfait Job
      </h1>

      {/* Search Bars */}
      <div className="flex gap-4 mb-6">
        <div className="flex-1 relative">
          <Input
            value={filters.search || ""}
            onChange={(e) => updateFilters({ search: e.target.value })}
            placeholder="Recherchez une offre"
            className="pr-16 h-12 text-gray-600 rounded-full border-gray-400 bg-white"
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
            {filters.search && (
              <button
                onClick={() => updateFilters({ search: "" })}
                className="p-1 hover:bg-gray-400 rounded"
              >
                <Icon icon="bi:x" className="w-4 h-4 text-gray-400" />
              </button>
            )}
            <Icon icon="bi:search" className="w-5 h-5 text-gray-400" />
          </div>
        </div>

        <div className="flex-1 relative">
          <Select
            value={filters.category_id?.toString() || "0"}
            onValueChange={(value) =>
              updateFilters({
                category_id: value === "0" ? undefined : parseInt(value),
              })
            }
          >
            <SelectTrigger className="w-full rounded-full bg-transparent border-border">
              <SelectValue placeholder="Catégorie" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">Toutes les catégories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id.toString()}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button
          onClick={() => updateFilters({})}
          className="h-12 px-6 bg-blue-900 hover:bg-blue-900/90 text-white rounded-full"
        >
          Rechercher
        </Button>
      </div>

      {/* Job Cards Grid */}
      {loading ? (
        <div className="text-center py-8">Chargement...</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {services.map((job) => (
            <JobCard
              key={job.id}
              service={job}
              showRate={true}
              isFavorite={isFavorite(job.id)}
              onFavoriteClick={() => toggleFavorite(job.id)}
            />
          ))}
        </div>
      )}
    </>
  );
}
