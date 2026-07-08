// components/features/job/JobFilters.tsx - Version corrigée

"use client";
import { Slider } from "@/app/components/ui/slider";
import { Checkbox } from "@/app/components/ui/checkbox";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Icon } from "@iconify/react";
import { useState, useEffect } from "react";
import type { ServiceFiltersFormData } from "@/app/lib/validators/service.validator";
import { ServiceType, LocationType, PaymentType, ServiceStatus } from "@/app/types/enums";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import { Badge } from "@/app/components/ui/badge";
import { cn } from "@/app/lib/utils";

interface JobFiltersProps {
  filters: ServiceFiltersFormData;
  onApplyFilters: (filters: Partial<ServiceFiltersFormData>) => void;
  categories?: { id: number; name: string }[];
}

export function MissionFilters({
  filters,
  onApplyFilters,
  categories = [],
}: JobFiltersProps) {
  const [localFilters, setLocalFilters] = useState<Partial<ServiceFiltersFormData>>({
    category_id: filters.category_id,
    search: filters.search || "",
    budget_min: filters.budget_min || 0,
    budget_max: filters.budget_max || 200000,
    location_type: filters.location_type,
    is_urgent: filters.is_urgent,
    is_featured: filters.is_featured,
    service_type: filters.service_type,
    payment_type: filters.payment_type,
    status: filters.status,
    city: filters.city || "",
    date_from: filters.date_from || "",
    date_to: filters.date_to || "",
  });

  // Synchroniser localFilters avec les props filters
  useEffect(() => {
    setLocalFilters({
      category_id: filters.category_id,
      search: filters.search || "",
      budget_min: filters.budget_min || 0,
      budget_max: filters.budget_max || 200000,
      location_type: filters.location_type,
      is_urgent: filters.is_urgent,
      is_featured: filters.is_featured,
      service_type: filters.service_type,
      payment_type: filters.payment_type,
      status: filters.status,
      city: filters.city || "",
      date_from: filters.date_from || "",
      date_to: filters.date_to || "",
    });
  }, [filters]);

  // Active filters count
  const getActiveFiltersCount = () => {
    let count = 0;
    if (localFilters.category_id && localFilters.category_id !== 0) count++;
    if (localFilters.search && localFilters.search !== "") count++;
    if (localFilters.budget_min && localFilters.budget_min > 0) count++;
    if (localFilters.budget_max && localFilters.budget_max < 200000) count++;
    if (localFilters.location_type) count++;
    if (localFilters.is_urgent) count++;
    if (localFilters.is_featured) count++;
    if (localFilters.service_type) count++;
    if (localFilters.payment_type) count++;
    if (localFilters.status) count++;
    if (localFilters.city && localFilters.city !== "") count++;
    if (localFilters.date_from && localFilters.date_from !== "") count++;
    if (localFilters.date_to && localFilters.date_to !== "") count++;
    return count;
  };

  const activeFiltersCount = getActiveFiltersCount();

  // Options
  const serviceTypeOptions: { value: ServiceType; label: string; icon: string }[] = [
    { value: ServiceType.STANDARD, label: "Standard", icon: "ph:star" },
    { value: ServiceType.PREMIUM, label: "Premium", icon: "ph:crown" },
    { value: ServiceType.CANDIDATURE, label: "Candidature", icon: "ph:file-text" },
    { value: ServiceType.DIRECT, label: "Direct", icon: "ph:lightning" },
  ];

  const paymentTypeOptions: { value: PaymentType; label: string; icon: string }[] = [
    { value: PaymentType.FIXED, label: "Prix fixe", icon: "ph:currency-euro" },
    { value: PaymentType.HOURLY, label: "À l'heure", icon: "ph:clock" },
    { value: PaymentType.MILESTONE, label: "Par étape", icon: "ph:steps" },
  ];

  const locationTypeOptions: { value: LocationType; label: string; icon: string }[] = [
    { value: LocationType.REMOTE, label: "Télétravail", icon: "ph:monitor" },
    { value: LocationType.ONSITE, label: "Sur site", icon: "ph:building" },
    { value: LocationType.HYBRID, label: "Hybride", icon: "ph:arrows-left-right" },
  ];

  const statusOptions: { value: ServiceStatus; label: string; color: string }[] = [
    { value: ServiceStatus.PUBLISHED, label: "Publié", color: "text-green-600 dark:text-green-400" },
    { value: ServiceStatus.IN_PROGRESS, label: "En cours", color: "text-blue-600 dark:text-blue-400" },
    { value: ServiceStatus.COMPLETED, label: "Terminé", color: "text-purple-600 dark:text-purple-400" },
    { value: ServiceStatus.CANCELLED, label: "Annulé", color: "text-red-600 dark:text-red-400" },
  ];

  const handleApply = () => {
    const cleanedFilters = Object.fromEntries(
      Object.entries(localFilters).filter(
        ([key, value]) => {
          if (value === undefined || value === null) return false;
          if (value === "") return false;
          if (key === "category_id" && value === 0) return false;
          if (typeof value === "number" && value === 0 && key !== "budget_min" && key !== "budget_max") return false;
          return true;
        }
      ),
    );
    onApplyFilters(cleanedFilters);
  };

  const handleReset = () => {
    // Réinitialiser tous les filtres à leurs valeurs par défaut
    const resetFilters = {
      category_id: undefined,
      search: "",
      budget_min: 0,
      budget_max: 200000,
      location_type: undefined,
      is_urgent: undefined,
      is_featured: undefined,
      service_type: undefined,
      payment_type: undefined,
      status: undefined,
      city: "",
      date_from: "",
      date_to: "",
    };
    
    setLocalFilters(resetFilters);
    
    // Appliquer les filtres réinitialisés
    onApplyFilters({
      category_id: undefined,
      search: undefined,
      city: undefined,
      location_type: undefined,
      is_urgent: undefined,
      is_featured: undefined,
      service_type: undefined,
      payment_type: undefined,
      status: undefined,
      date_from: undefined,
      date_to: undefined,
      budget_min: undefined,
      budget_max: undefined,
      page: 1,
    });
  };

  const removeFilter = (key: string) => {
    setLocalFilters((prev) => ({
      ...prev,
      [key]: key === "budget_min" || key === "budget_max" ? 0 : undefined,
    }));
    
    // Appliquer immédiatement la suppression du filtre
    onApplyFilters({
      [key]: undefined,
      page: 1,
    });
  };

  // Valeur actuelle du select de catégorie
  const selectedCategoryValue = localFilters.category_id?.toString() || "all";

  return (
    <div className={cn(
      "w-full lg:w-[312px] p-4 lg:p-6 space-y-6 flex-shrink-0 rounded-2xl border",
      "bg-white dark:bg-gray-800",
      "border-gray-100 dark:border-gray-700"
    )}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Filtres
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Affinez votre recherche
          </p>
        </div>
        {activeFiltersCount > 0 && (
          <Badge variant="secondary" className="bg-primary/10 text-primary dark:bg-primary/20">
            {activeFiltersCount} actif{activeFiltersCount > 1 ? "s" : ""}
          </Badge>
        )}
      </div>

      {/* Active Filters Tags */}
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap gap-2 pb-2 border-b border-gray-100 dark:border-gray-700">
          {localFilters.search && localFilters.search !== "" && (
            <Badge variant="secondary" className="gap-1 dark:bg-gray-700 dark:text-gray-200">
              Recherche: {localFilters.search}
              <button onClick={() => removeFilter("search")} className="hover:text-primary">
                <Icon icon="ph:x" className="w-3 h-3 ml-1" />
              </button>
            </Badge>
          )}
          {localFilters.category_id && localFilters.category_id !== 0 && (
            <Badge variant="secondary" className="gap-1 dark:bg-gray-700 dark:text-gray-200">
              Catégorie: {categories.find(c => c.id === localFilters.category_id)?.name || "Sélectionnée"}
              <button onClick={() => removeFilter("category_id")} className="hover:text-primary">
                <Icon icon="ph:x" className="w-3 h-3 ml-1" />
              </button>
            </Badge>
          )}
          {localFilters.city && localFilters.city !== "" && (
            <Badge variant="secondary" className="gap-1 dark:bg-gray-700 dark:text-gray-200">
              Ville: {localFilters.city}
              <button onClick={() => removeFilter("city")} className="hover:text-primary">
                <Icon icon="ph:x" className="w-3 h-3 ml-1" />
              </button>
            </Badge>
          )}
          {localFilters.is_urgent && (
            <Badge variant="secondary" className="gap-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400">
              Urgent
              <button onClick={() => removeFilter("is_urgent")} className="hover:text-red-800 dark:hover:text-red-300">
                <Icon icon="ph:x" className="w-3 h-3 ml-1" />
              </button>
            </Badge>
          )}
          {localFilters.is_featured && (
            <Badge variant="secondary" className="gap-1 bg-secondary/10 text-secondary dark:bg-secondary/20">
              Mis en avant
              <button onClick={() => removeFilter("is_featured")} className="hover:text-secondary-dark">
                <Icon icon="ph:x" className="w-3 h-3 ml-1" />
              </button>
            </Badge>
          )}
        </div>
      )}

      {/* Search */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Recherche
        </label>
        <div className="relative">
          <Input
            value={localFilters.search || ""}
            onChange={(e) =>
              setLocalFilters((prev) => ({
                ...prev,
                search: e.target.value,
              }))
            }
            placeholder="Titre, compétence..."
            className="pl-10 h-10 rounded-lg border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary text-gray-900 dark:text-gray-100"
          />
          <Icon
            icon="ph:magnifying-glass"
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500"
          />
          {localFilters.search && (
            <button
              onClick={() => removeFilter("search")}
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              <Icon icon="ph:x" className="w-4 h-4 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300" />
            </button>
          )}
        </div>
      </div>

      {/* Budget Range */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Budget (€)
        </label>
        <div className="flex items-center justify-between text-sm">
          <span className="text-primary font-medium">
            {localFilters.budget_min?.toLocaleString()}€
          </span>
          <span className="text-gray-400 dark:text-gray-500">à</span>
          <span className="text-primary font-medium">
            {localFilters.budget_max?.toLocaleString()}€
          </span>
        </div>
        <Slider
          value={[
            localFilters.budget_min || 0,
            localFilters.budget_max || 200000,
          ]}
          onValueChange={(value) =>
            setLocalFilters((prev) => ({
              ...prev,
              budget_min: value[0],
              budget_max: value[1],
            }))
          }
          min={0}
          max={200000}
          step={5000}
          className="flex-1"
        />
      </div>

      {/* Category */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Catégorie
        </label>
        <Select 
          key={selectedCategoryValue}
          value={selectedCategoryValue} 
          onValueChange={(value) =>
            setLocalFilters((prev) => ({
              ...prev,
              category_id: value && value !== "all" ? Number(value) : undefined,
            }))
          }
        >
          <SelectTrigger className="h-10 rounded-lg bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <SelectValue placeholder="Toutes les catégories" />
          </SelectTrigger>
          <SelectContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <SelectItem value="all">Toutes les catégories</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat.id} value={cat.id.toString()}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Location */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Localisation
        </label>
        <Input
          placeholder="Ville, code postal..."
          value={localFilters.city || ""}
          onChange={(e) =>
            setLocalFilters((prev) => ({ ...prev, city: e.target.value }))
          }
          className="h-10 rounded-lg border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary text-gray-900 dark:text-gray-100"
        />
      </div>

      {/* Location Type */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Type de localisation
        </label>
        <div className="grid grid-cols-3 gap-2">
          {locationTypeOptions.map((type) => (
            <button
              key={type.value}
              onClick={() =>
                setLocalFilters((prev) => ({
                  ...prev,
                  location_type: prev.location_type === type.value ? undefined : type.value,
                }))
              }
              className={cn(
                "flex flex-col items-center gap-1 p-2 rounded-lg border transition-all",
                localFilters.location_type === type.value
                  ? "border-primary bg-primary/10 text-primary dark:bg-primary/20"
                  : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 text-gray-600 dark:text-gray-400"
              )}
            >
              <Icon icon={type.icon} className="w-4 h-4" />
              <span className="text-xs">{type.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Service Type */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Type de service
        </label>
        <div className="grid grid-cols-2 gap-2">
          {serviceTypeOptions.map((type) => (
            <label
              key={type.value}
              className="flex items-center gap-2 cursor-pointer p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300"
            >
              <Checkbox
                checked={localFilters.service_type === type.value}
                onCheckedChange={(checked) => {
                  setLocalFilters((prev) => ({
                    ...prev,
                    service_type: checked ? type.value : undefined,
                  }));
                }}
                className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
              />
              <Icon icon={type.icon} className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              <span className="text-sm">{type.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Payment Type */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Type de paiement
        </label>
        <div className="space-y-2">
          {paymentTypeOptions.map((type) => (
            <label
              key={type.value}
              className="flex items-center gap-2 cursor-pointer p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300"
            >
              <Checkbox
                checked={localFilters.payment_type === type.value}
                onCheckedChange={(checked) => {
                  setLocalFilters((prev) => ({
                    ...prev,
                    payment_type: checked ? type.value : undefined,
                  }));
                }}
                className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
              />
              <Icon icon={type.icon} className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              <span className="text-sm">{type.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Options */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Options
        </label>
        <div className="space-y-2">
          <label className="flex items-center gap-2 cursor-pointer p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300">
            <Checkbox
              checked={localFilters.is_urgent || false}
              onCheckedChange={(checked) =>
                setLocalFilters((prev) => ({
                  ...prev,
                  is_urgent: checked === true ? true : undefined,
                }))
              }
              className="data-[state=checked]:bg-red-600 data-[state=checked]:border-red-600"
            />
            <Icon icon="ph:warning" className="w-4 h-4 text-red-500 dark:text-red-400" />
            <span className="text-sm">Urgent</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300">
            <Checkbox
              checked={localFilters.is_featured || false}
              onCheckedChange={(checked) =>
                setLocalFilters((prev) => ({
                  ...prev,
                  is_featured: checked === true ? true : undefined,
                }))
              }
              className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
            />
            <Icon icon="ph:star" className="w-4 h-4 text-secondary dark:text-secondary-400" />
            <span className="text-sm">Mis en avant</span>
          </label>
        </div>
      </div>

      {/* Date Range */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Date de publication
        </label>
        <div className="grid grid-cols-2 gap-2">
          <Input
            type="date"
            value={localFilters.date_from || ""}
            onChange={(e) =>
              setLocalFilters((prev) => ({ ...prev, date_from: e.target.value }))
            }
            className="h-10 rounded-lg border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary text-gray-900 dark:text-gray-100"
            placeholder="Du"
          />
          <Input
            type="date"
            value={localFilters.date_to || ""}
            onChange={(e) =>
              setLocalFilters((prev) => ({ ...prev, date_to: e.target.value }))
            }
            className="h-10 rounded-lg border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary text-gray-900 dark:text-gray-100"
            placeholder="Au"
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 pt-4 border-t border-gray-100 dark:border-gray-700">
        <Button
          onClick={handleApply}
          className="flex-1 bg-primary hover:bg-primary/90 text-white rounded-lg h-10"
        >
          <Icon icon="ph:funnel" className="w-4 h-4 mr-2" />
          Appliquer
        </Button>
        <Button
          onClick={handleReset}
          variant="outline"
          className={cn(
            "flex-1 rounded-lg h-10",
            "border-gray-200 dark:border-gray-700",
            "hover:bg-gray-50 dark:hover:bg-gray-700",
            "text-gray-700 dark:text-gray-300"
          )}
        >
          <Icon icon="ph:arrow-counter-clockwise" className="w-4 h-4 mr-2" />
          Réinitialiser
        </Button>
      </div>
    </div>
  );
}