"use client";
import { Slider } from "@/app/components/ui/slider";
import { Checkbox } from "@/app/components/ui/checkbox";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Icon } from "@iconify/react";
import { useState, useEffect } from "react";
import { ServiceFilters, ServiceType } from "@/app/types/services";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";

interface JobFiltersProps {
  filters: ServiceFilters;
  onApplyFilters: (filters: Partial<ServiceFilters>) => void;
  categories?: { id: number; name: string }[];
}

export function JobFilters({
  filters,
  onApplyFilters,
  categories = [],
}: JobFiltersProps) {
  const [localFilters, setLocalFilters] = useState<Partial<ServiceFilters>>({
    min_price: filters.min_price || 0,
    max_price: filters.max_price || 200000,
    radius_km: filters.radius_km || 10,
    service_types: filters.service_types || [],
    date_pratique: filters.date_pratique || "",
    start_time_from: filters.start_time_from || "08:00",
    start_time_to: filters.start_time_to || "20:00",
    duration: filters.duration || [],
    skills: filters.skills || [],
    city: filters.city || "",
    quarter: filters.quarter || "",
  });

  // Options de durée
  const durationOptions = ["1h", "2h", "3h", "4h", "5h", "6h+"];

  // Options de type de service
  const serviceTypeOptions: { value: ServiceType; label: string }[] = [
    { value: "standard", label: "Standard" },
    { value: "premium", label: "Premium" },
    { value: "candidature", label: "Candidature" },
    { value: "direct", label: "Direct" },
  ];

  const handleApply = () => {
    // Nettoyer les filtres vides
    const cleanedFilters = Object.fromEntries(
      Object.entries(localFilters).filter(
        ([_, value]) =>
          value !== undefined &&
          value !== "" &&
          !(Array.isArray(value) && value.length === 0),
      ),
    );
    onApplyFilters(cleanedFilters);
  };

  const handleReset = () => {
    setLocalFilters({
      min_price: 0,
      max_price: 200000,
      radius_km: 10,
      service_types: [],
      date_pratique: "",
      start_time_from: "08:00",
      start_time_to: "20:00",
      duration: [],
      skills: [],
      city: "",
      quarter: "",
    });
    onApplyFilters({});
  };

  return (
    <div className="w-full lg:w-[312px] p-0 lg:p-6 space-y-6 flex-shrink-0">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-blue-900">
          Filtres de recherche
        </h2>
        <p className="text-gray-500 text-sm mt-1">
          Affinez votre recherche d'emploi
        </p>
      </div>

      {/* Prix */}
      <div className="space-y-3">
        <h3 className="font-semibold text-gray-800">Budget (FCFA)</h3>
        <div className="flex items-center justify-between text-sm text-blue-900 font-medium">
          <span>{localFilters.min_price?.toLocaleString()} FCFA</span>
          <span>{localFilters.max_price?.toLocaleString()} FCFA</span>
        </div>
        <Slider
          value={[
            localFilters.min_price || 0,
            localFilters.max_price || 200000,
          ]}
          onValueChange={(value) =>
            setLocalFilters((prev) => ({
              ...prev,
              min_price: value[0],
              max_price: value[1],
            }))
          }
          min={0}
          max={500000}
          step={5000}
          className="flex-1"
        />
      </div>

      {/* Catégorie */}
      <div className="space-y-3">
        <h3 className="font-semibold text-gray-800">Catégorie</h3>
        <Select
          value={filters.category_id?.toString() || ""}
          onValueChange={(value) =>
            setLocalFilters((prev) => ({
              ...prev,
              category_id: value ? parseInt(value) : undefined,
            }))
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Toutes les catégories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="0">Toutes les catégories</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat.id} value={cat.id.toString()}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Localisation */}
      <div className="space-y-3">
        <h3 className="font-semibold text-gray-800">Localisation</h3>
        <Input
          placeholder="Ville"
          value={localFilters.city}
          onChange={(e) =>
            setLocalFilters((prev) => ({ ...prev, city: e.target.value }))
          }
          className="mb-2"
        />
        <Input
          placeholder="Quartier"
          value={localFilters.quarter}
          onChange={(e) =>
            setLocalFilters((prev) => ({ ...prev, quarter: e.target.value }))
          }
        />

        {/* Rayon de recherche */}
        <div className="pt-2">
          <div className="flex justify-between text-sm mb-1">
            <span>Rayon: {localFilters.radius_km} km</span>
          </div>
          <Slider
            value={[localFilters.radius_km || 10]}
            onValueChange={(value) =>
              setLocalFilters((prev) => ({ ...prev, radius_km: value[0] }))
            }
            min={1}
            max={50}
            step={1}
          />
        </div>
      </div>

      {/* Date et Heure */}
      <div className="space-y-3">
        <h3 className="font-semibold text-gray-800">Date et Heure</h3>

        <div>
          <label className="text-sm text-gray-600 mb-1 block">Date</label>
          <Input
            type="date"
            value={localFilters.date_pratique}
            onChange={(e) =>
              setLocalFilters((prev) => ({
                ...prev,
                date_pratique: e.target.value,
              }))
            }
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-sm text-gray-600 mb-1 block">
              À partir de
            </label>
            <Input
              type="time"
              value={localFilters.start_time_from}
              onChange={(e) =>
                setLocalFilters((prev) => ({
                  ...prev,
                  start_time_from: e.target.value,
                }))
              }
            />
          </div>
          <div>
            <label className="text-sm text-gray-600 mb-1 block">Jusqu'à</label>
            <Input
              type="time"
              value={localFilters.start_time_to}
              onChange={(e) =>
                setLocalFilters((prev) => ({
                  ...prev,
                  start_time_to: e.target.value,
                }))
              }
            />
          </div>
        </div>
      </div>

      {/* Durée */}
      <div className="space-y-3">
        <h3 className="font-semibold text-gray-800">Durée</h3>
        <div className="grid grid-cols-3 gap-2">
          {durationOptions.map((duration) => (
            <label
              key={duration}
              className="flex items-center gap-2 cursor-pointer"
            >
              <Checkbox
                checked={localFilters.duration?.includes(duration)}
                onCheckedChange={(checked) => {
                  setLocalFilters((prev) => ({
                    ...prev,
                    duration: checked
                      ? [...(prev.duration || []), duration]
                      : (prev.duration || []).filter((d) => d !== duration),
                  }));
                }}
                className="data-[state=checked]:bg-blue-900"
              />
              <span className="text-sm">{duration}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Type de service */}
      <div className="space-y-3">
        <h3 className="font-semibold text-gray-800">Type de service</h3>
        <div className="grid grid-cols-2 gap-2">
          {serviceTypeOptions.map((type) => (
            <label
              key={type.value}
              className="flex items-center gap-2 cursor-pointer"
            >
              <Checkbox
                checked={localFilters.service_types?.includes(type.value)}
                onCheckedChange={(checked) => {
                  setLocalFilters((prev) => ({
                    ...prev,
                    service_types: checked
                      ? [...(prev.service_types || []), type.value]
                      : (prev.service_types || []).filter(
                          (t) => t !== type.value,
                        ),
                  }));
                }}
                className="data-[state=checked]:bg-blue-900"
              />
              <span className="text-sm">{type.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Compétences */}
      <div className="space-y-3">
        <h3 className="font-semibold text-gray-800">Compétences</h3>
        <Input
          placeholder="Ex: Java, Python, Design..."
          value={localFilters.skills?.join(", ")}
          onChange={(e) =>
            setLocalFilters((prev) => ({
              ...prev,
              skills: e.target.value
                .split(",")
                .map((s) => s.trim())
                .filter(Boolean),
            }))
          }
        />
        <p className="text-xs text-gray-500">
          Séparez les compétences par des virgules
        </p>
      </div>

      {/* Boutons d'action */}
      <div className="flex gap-2 pt-4">
        <Button
          onClick={handleApply}
          className="flex-1 bg-blue-900 hover:bg-blue-800/90 text-white rounded-full"
        >
          <Icon icon="bi:filter" className="w-4 h-4 mr-2" />
          Appliquer
        </Button>
        <Button
          onClick={handleReset}
          variant="outline"
          className="flex-1 rounded-full"
        >
          Réinitialiser
        </Button>
      </div>
    </div>
  );
}
