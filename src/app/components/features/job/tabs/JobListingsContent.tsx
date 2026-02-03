"use client";
import { Icon } from "@iconify/react";
import { Input } from "@/app/components/ui/input";
import { Button } from "@/app/components/ui/button";
import { JobCard } from "../JobCard";
import { useEffect, useState } from "react";
import { getServices } from "@/app/services/service.service";
import { Service, ServiceStatus, ServiceType } from "@/app/types/services";
import { User } from "@/app/types/user";
import { sampleServices } from "@/data/mock";

interface JobListingsContentProps {
  favorites: number[];
  toggleFavorite: (id: number) => void;
}

export function JobListingsContent({
  favorites,
  toggleFavorite,
}: JobListingsContentProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryQuery, setCategoryQuery] = useState("");

  const [services, setServices] = useState<Service[]>(sampleServices);

  useEffect(() => {
    const fetchAndFilterServices = async () => {
      try {
        const allServices = await getServices(); // await the Promise

        let filteredServices = allServices;

        if (searchQuery) {
          filteredServices = filteredServices.filter((job: Service) =>
            job.title.toLowerCase().includes(searchQuery.toLowerCase()),
          );
        }

        if (categoryQuery) {
          filteredServices = filteredServices.filter((job: Service) =>
            job.required_skills.some((skill) =>
              skill.toLowerCase().includes(categoryQuery.toLowerCase()),
            ),
          );
        }

        setServices(filteredServices);
      } catch (error) {
        console.error("Failed to fetch services:", error);
      }
    };

    fetchAndFilterServices();
  }, [searchQuery, categoryQuery]);

  return (
    <>
      {/* Title */}
      <h1 className="text-3xl font-bold text-gray-800 mb-4">
        Trouvez votre parfait Job
      </h1>
      {/* Search Bars */}
      <div className="flex gap-4 mb-0">
        <div className="flex-1 relative">
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Recherchez une offre"
            className="pr-16 h-12 text-gray-600 focus:right-0 rounded-full focus:outline-none border-gray-400 bg-white"
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="p-1 hover:bg-gray-400 rounded"
              >
                <Icon icon={"bi:x"} className="w-4 h-4 text-gray-400" />
              </button>
            )}
            <Icon icon={"bi:search"} className="w-5 h-5 text-gray-400" />
          </div>
        </div>
        <div className="flex-1 relative">
          <Input
            value={categoryQuery}
            onChange={(e) => setCategoryQuery(e.target.value)}
            placeholder="Catégories prioritaires"
            className="pr-16 h-12 rounded-full border-gray-400 bg-white text-gray-600 focus:right-0 focus:outline-none"
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
            {categoryQuery && (
              <button
                onClick={() => setCategoryQuery("")}
                className="p-1 hover:bg-muted rounded"
              >
                <Icon icon={"bi:x"} className="w-4 h-4 text-slate-400" />
              </button>
            )}
            <button className="p-1 hover:bg-muted rounded border border-border">
              <Icon icon={"bi:plus"} className="w-4 h-4 text-gray-600" />
            </button>
          </div>
        </div>
        <Button className="h-12 px-6 bg-blue-900 hover:bg-blue-900/90 text-white rounded-full">
          Rechercher
        </Button>
      </div>
      ;{/* Job Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {services.map((job) => (
          <JobCard
            key={job.id}
            service={job}
            showRate={true}
            isFavorite={favorites.includes(job.id)}
            onFavoriteClick={() => toggleFavorite(job.id)}
          />
        ))}
      </div>
    </>
  );
}
