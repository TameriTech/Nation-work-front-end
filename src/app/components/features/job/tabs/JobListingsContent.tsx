"use client";
import { Icon } from "@iconify/react";
import { Input } from "@/app/components/ui/input";
import { Button } from "@/app/components/ui/button";
import { JobCard } from "../JobCard";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import { useCategories } from "@/app/hooks/use-categories";
import { CreateCandidatureDto, Service } from "@/app/types";
import { Pagination } from "@/app/components/ui/pagination";

interface JobListingsContentProps {
  services: Service[];
  isLoading: boolean;
  onApply: (params: CreateCandidatureDto) => void;
  isApplying: boolean;
  pagination?: {
    total: number;
    page: number;
    pages: number;
    perPage: number;
  };
  toggleFavorite?: (id: number) => void;
  isFavorite?: (id: number) => boolean;
}

export function JobListingsContent({
  services,
  isLoading,
  onApply,
  isApplying,
  pagination,
  toggleFavorite,
  isFavorite,
}: JobListingsContentProps) {
  const { categories } = useCategories();
  const [searchInput, setSearchInput] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("0");
  const [currentPage, setCurrentPage] = useState(1);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [selectedService, setSelectedService] = useState<number | null>(null);
  const [applyMessage, setApplyMessage] = useState("");
  const [applyAmount, setApplyAmount] = useState<number | undefined>();

  const handleApplyClick = (serviceId: number) => {
    setSelectedService(serviceId);
    setShowApplyModal(true);
  };

  const handleApplySubmit = () => {
    if (selectedService) {
      onApply({
        service_id: selectedService,
        //freelancer_id: 0, // À remplacer par l'ID réel du freelancer connecté
        cover_letter: applyMessage,
        proposed_amount: applyAmount,
      });
      setShowApplyModal(false);
      setApplyMessage("");
      setApplyAmount(undefined);
      setSelectedService(null);
    }
  };

  if (isLoading) {
    return <div className="text-center py-8">Chargement...</div>;
  }

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
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Recherchez une offre"
            className="pr-16 h-12 text-gray-600 rounded-full border-gray-400 bg-white"
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
            {searchInput && (
              <button
                onClick={() => setSearchInput("")}
                className="p-1 hover:bg-gray-400 rounded"
              >
                <Icon icon="bi:x" className="w-4 h-4 text-gray-400" />
              </button>
            )}
            <Icon icon="bi:search" className="w-5 h-5 text-gray-400" />
          </div>
        </div>

        <div className="flex-1 relative">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
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
          onClick={() =>
            console.log("Recherche avec", { searchInput, selectedCategory })
          }
          className="h-12 px-6 bg-blue-900 hover:bg-blue-900/90 text-white rounded-full"
        >
          Rechercher
        </Button>
      </div>

      {/* Job Cards Grid */}
      {services.length === 0 ? (
        <div className="text-center py-12">
          <Icon
            icon="bi:search"
            className="w-16 h-16 text-gray-300 mx-auto mb-4"
          />
          <p className="text-gray-500">Aucun service trouvé</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {services.map((job) => (
              <div key={job.id} className="relative">
                <JobCard
                  service={job}
                  showRate={true}
                  isFavorite={isFavorite ? isFavorite(job.id) : false}
                  onFavoriteClick={
                    toggleFavorite ? () => toggleFavorite(job.id) : undefined
                  }
                />
                <Button
                  onClick={() => handleApplyClick(job.id)}
                  disabled={isApplying}
                  className="absolute bottom-4 right-4 bg-green-600 hover:bg-green-700 text-white rounded-full px-4 py-2 text-sm"
                >
                  {isApplying ? "Envoi..." : "Postuler"}
                </Button>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {pagination && pagination.pages > 1 && (
            <div className="mt-8 flex justify-center">
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(1, prev - 1))
                  }
                  disabled={currentPage === 1}
                >
                  Précédent
                </Button>
                <span className="py-2 px-4">
                  Page {currentPage} sur {pagination.pages}
                </span>
                <Button
                  variant="outline"
                  onClick={() =>
                    setCurrentPage((prev) =>
                      Math.min(pagination.pages, prev + 1),
                    )
                  }
                  disabled={currentPage === pagination.pages}
                >
                  Suivant
                </Button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Modal de candidature */}
      {showApplyModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Postuler à l'offre</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Message (optionnel)
                </label>
                <textarea
                  value={applyMessage}
                  onChange={(e) => setApplyMessage(e.target.value)}
                  placeholder="Parlez de votre motivation..."
                  className="w-full p-2 border rounded-lg"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Montant proposé (optionnel)
                </label>
                <input
                  type="number"
                  value={applyAmount || ""}
                  onChange={(e) =>
                    setApplyAmount(
                      e.target.value ? Number(e.target.value) : undefined,
                    )
                  }
                  placeholder="Votre proposition"
                  className="w-full p-2 border rounded-lg"
                />
              </div>

              <div className="flex gap-2 justify-end">
                <Button
                  variant="outline"
                  onClick={() => setShowApplyModal(false)}
                >
                  Annuler
                </Button>
                <Button onClick={handleApplySubmit} disabled={isApplying}>
                  {isApplying ? "Envoi..." : "Envoyer"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
