// app/services/page.tsx
"use client";

import { useState, useEffect } from "react";
import { Header } from "@/app/components/layouts/headers/GuestHeader";
import { Footer } from "@/app/components/layouts/footer/GuestFooter";
import { Icon } from "@iconify/react";
import Link from "next/link";
import { usePublicCategories } from "@/app/hooks/services/use-categories";
import { useServices } from "@/app/hooks/services/use-services";
import { cn } from "@/app/lib/utils";

// Composant ServiceCard pour l'affichage des services
function ServiceCard({ service }: { service: any }) {
  return (
    <Link href={`/services/${service.code}`} className="group">
      <div className={cn(
        "bg-surface rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border h-full flex flex-col",
        "dark:bg-gray-800",
        "border-gray-100 dark:border-gray-700"
      )}>
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-md">
              <Icon icon="ph:briefcase" className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-text-primary dark:text-gray-100 group-hover:text-primary transition-colors">
                {service.title}
              </h3>
              <p className="text-xs text-text-secondary dark:text-gray-400">
                {service.category?.name || "Non catégorisé"}
              </p>
            </div>
          </div>
          
          {/* Badge Urgent */}
          {service.is_urgent && (
            <span className="px-2 py-1 bg-error/10 text-error dark:bg-red-900/30 dark:text-red-400 text-xs rounded-full flex items-center gap-1">
              <Icon icon="ph:warning" className="w-3 h-3" />
              Urgent
            </span>
          )}
        </div>

        {/* Description */}
        <p className="text-text-secondary dark:text-gray-400 text-sm leading-relaxed mb-4 line-clamp-2 flex-1">
          {service.short_description || service.description}
        </p>

        {/* Compétences requises */}
        {service.required_skills && service.required_skills.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {service.required_skills.slice(0, 3).map((skill: string, idx: number) => (
              <span
                key={idx}
                className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-text-secondary dark:text-gray-300 text-xs rounded-full"
              >
                {skill}
              </span>
            ))}
            {service.required_skills.length > 3 && (
              <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-text-secondary dark:text-gray-300 text-xs rounded-full">
                +{service.required_skills.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
          <div className="flex flex-col">
            <span className="text-lg font-bold text-primary dark:text-primary-400">
              {service.proposed_amount?.toLocaleString()}€
            </span>
            <span className="text-xs text-text-secondary dark:text-gray-400">Budget estimé</span>
          </div>
          
          <div className="flex items-center gap-3 text-xs text-text-secondary dark:text-gray-400">
            {service.location_type === "remote" ? (
              <span className="flex items-center gap-1">
                <Icon icon="ph:monitor" className="w-3 h-3" />
                Télétravail
              </span>
            ) : service.city && (
              <span className="flex items-center gap-1">
                <Icon icon="ph:map-pin" className="w-3 h-3" />
                {service.city}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

// Composant Skeleton pour le chargement
function ServiceSkeleton() {
  return (
    <div className="bg-surface dark:bg-gray-800 rounded-2xl p-6 shadow-sm animate-pulse border border-gray-100 dark:border-gray-700">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gray-200 dark:bg-gray-700" />
          <div>
            <div className="h-5 w-40 bg-gray-200 dark:bg-gray-700 rounded mb-2" />
            <div className="h-3 w-24 bg-gray-200 dark:bg-gray-700 rounded" />
          </div>
        </div>
        <div className="w-16 h-6 bg-gray-200 dark:bg-gray-700 rounded-full" />
      </div>
      <div className="space-y-2 mb-4">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full" />
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
      </div>
      <div className="flex gap-2 mb-4">
        <div className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded-full" />
        <div className="h-6 w-20 bg-gray-200 dark:bg-gray-700 rounded-full" />
      </div>
      <div className="flex justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
        <div>
          <div className="h-6 w-20 bg-gray-200 dark:bg-gray-700 rounded mb-1" />
          <div className="h-3 w-12 bg-gray-200 dark:bg-gray-700 rounded" />
        </div>
        <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded" />
      </div>
    </div>
  );
}

export default function ServicesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [budgetRange, setBudgetRange] = useState<[number, number]>([0, 500000]);
  const [locationType, setLocationType] = useState<string>("all");
  const [isUrgent, setIsUrgent] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const { categories, isLoading: categoriesLoading } = usePublicCategories();
  
  const { services, pagination, isLoading, refetch } = useServices(
    {
      page: currentPage,
      per_page: 12,
      search: searchQuery || undefined,
      category_id: selectedCategory !== "all" ? Number(selectedCategory) : undefined,
      budget_min: budgetRange[0] || undefined,
      budget_max: budgetRange[1] === 500000 ? undefined : budgetRange[1],
      location_type: locationType !== "all" ? locationType : undefined,
      is_urgent: isUrgent || undefined,
    },
  );

  // Appliquer les filtres (reset à la page 1)
  const applyFilters = () => {
    setCurrentPage(1);
    refetch();
  };

  // Réinitialiser tous les filtres
  const resetFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setBudgetRange([0, 500000]);
    setLocationType("all");
    setIsUrgent(false);
    setCurrentPage(1);
  };

  // Catégories populaires pour les raccourcis
  const popularCategories = categories?.slice(0, 6) || [];

  return (
    <>
      <main className="pt-20 bg-background dark:bg-gray-900 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
          {/* Hero Section */}
          <div className="text-center mb-10">
            <h1 className="text-3xl sm:text-4xl font-bold text-text-primary dark:text-gray-100 mb-3">
              Explorez nos{" "}
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                services
              </span>
            </h1>
            <p className="text-text-secondary dark:text-gray-400 max-w-2xl mx-auto">
              Découvrez des milliers de missions proposées par des clients vérifiés
            </p>
          </div>

          {/* Barre de recherche principale */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && applyFilters()}
                placeholder="Rechercher un service (ex: plomberie, ménage, développement...)"
                className={cn(
                  "w-full h-14 pl-12 pr-24 rounded-2xl outline-none transition-all",
                  "bg-surface dark:bg-gray-800",
                  "border border-gray-200 dark:border-gray-700",
                  "focus:border-primary focus:ring-2 focus:ring-primary",
                  "text-text-primary dark:text-gray-100 placeholder:text-text-secondary dark:placeholder:text-gray-500"
                )}
              />
              <Icon icon="ph:magnifying-glass" className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary dark:text-gray-400" />
              <button
                onClick={applyFilters}
                className="absolute right-2 top-1/2 -translate-y-1/2 px-5 py-2 bg-primary hover:bg-primary/90 text-white rounded-xl text-sm font-medium hover:shadow-lg transition-all"
              >
                Rechercher
              </button>
            </div>
          </div>

          {/* Catégories populaires - raccourcis */}
          {!categoriesLoading && popularCategories.length > 0 && (
            <div className="flex flex-wrap justify-center gap-2 mb-8">
              <button
                onClick={() => {
                  setSelectedCategory("all");
                  setCurrentPage(1);
                }}
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-medium transition-all",
                  selectedCategory === "all"
                    ? "bg-primary text-white shadow-md"
                    : "bg-surface dark:bg-gray-800 text-text-secondary dark:text-gray-300 hover:bg-primary/10 hover:text-primary border border-gray-200 dark:border-gray-700"
                )}
              >
                Tous
              </button>
              {popularCategories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => {
                    setSelectedCategory(cat.id.toString());
                    setCurrentPage(1);
                  }}
                  className={cn(
                    "px-4 py-2 rounded-full text-sm font-medium transition-all",
                    selectedCategory === cat.id.toString()
                      ? "bg-primary text-white shadow-md"
                      : "bg-surface dark:bg-gray-800 text-text-secondary dark:text-gray-300 hover:bg-primary/10 hover:text-primary border border-gray-200 dark:border-gray-700"
                  )}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          )}

          {/* Filtres mobiles - Bouton */}
          <div className="md:hidden mb-6">
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="w-full flex items-center justify-center gap-2 py-3 bg-surface dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700"
            >
              <Icon icon="ph:funnel" className="w-5 h-5 text-primary" />
              <span className="font-medium text-text-primary dark:text-gray-100">Filtres avancés</span>
              <Icon icon={isFilterOpen ? "ph:chevron-up" : "ph:chevron-down"} className="w-4 h-4 text-text-secondary dark:text-gray-400" />
            </button>
          </div>

          {/* Filtres - Version desktop et mobile */}
          <div className={`grid md:grid-cols-4 gap-6 mb-8 ${isFilterOpen ? "block" : "hidden md:grid"}`}>
            {/* Filtre catégorie */}
            <div>
              <label className="block text-sm font-medium text-text-primary dark:text-gray-300 mb-2">
                Catégorie
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-2 rounded-xl bg-surface dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:border-primary focus:ring-2 focus:ring-primary outline-none text-text-primary dark:text-gray-100"
              >
                <option value="all">Toutes les catégories</option>
                {categories?.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Filtre budget */}
            <div>
              <label className="block text-sm font-medium text-text-primary dark:text-gray-300 mb-2">
                Budget max
              </label>
              <select
                value={budgetRange[1]}
                onChange={(e) => setBudgetRange([budgetRange[0], Number(e.target.value)])}
                className="w-full px-4 py-2 rounded-xl bg-surface dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:border-primary focus:ring-2 focus:ring-primary outline-none text-text-primary dark:text-gray-100"
              >
                <option value={500000}>Illimité</option>
                <option value={50000}>Moins de 50 000€</option>
                <option value={100000}>Moins de 100 000€</option>
                <option value={200000}>Moins de 200 000€</option>
                <option value={300000}>Moins de 300 000€</option>
              </select>
            </div>

            {/* Filtre localisation */}
            <div>
              <label className="block text-sm font-medium text-text-primary dark:text-gray-300 mb-2">
                Localisation
              </label>
              <select
                value={locationType}
                onChange={(e) => setLocationType(e.target.value)}
                className="w-full px-4 py-2 rounded-xl bg-surface dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:border-primary focus:ring-2 focus:ring-primary outline-none text-text-primary dark:text-gray-100"
              >
                <option value="all">Tous</option>
                <option value="remote">Télétravail</option>
                <option value="on_site">Sur place</option>
              </select>
            </div>

            {/* Filtre urgent + boutons */}
            <div>
              <label className="block text-sm font-medium text-text-primary dark:text-gray-300 mb-2">
                Options
              </label>
              <div className="flex items-center gap-4 mb-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isUrgent}
                    onChange={(e) => setIsUrgent(e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300 dark:border-gray-600 text-primary focus:ring-primary focus:ring-2"
                  />
                  <span className="text-sm text-text-primary dark:text-gray-300">Urgent</span>
                </label>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={applyFilters}
                  className="flex-1 px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-xl text-sm font-medium hover:shadow-lg transition-all"
                >
                  Appliquer
                </button>
                <button
                  onClick={resetFilters}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-all text-text-secondary dark:text-gray-300"
                >
                  Reset
                </button>
              </div>
            </div>
          </div>

          {/* Résultats */}
          <div className="mb-4 flex justify-between items-center">
            <p className="text-sm text-text-secondary dark:text-gray-400">
              {isLoading ? (
                "Chargement..."
              ) : (
                <>
                  <span className="font-semibold text-text-primary dark:text-gray-100">{pagination?.total || 0}</span> services trouvés
                </>
              )}
            </p>
            
            {/* Tri */}
            <select className="text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-surface dark:bg-gray-800 text-text-primary dark:text-gray-100 px-3 py-1.5 focus:border-primary focus:ring-2 focus:ring-primary">
              <option>Plus récent</option>
              <option>Prix croissant</option>
              <option>Prix décroissant</option>
            </select>
          </div>

          {/* Grille des services */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <ServiceSkeleton key={i} />
              ))}
            </div>
          ) : services?.length === 0 ? (
            <div className="text-center py-16 bg-surface dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700">
              <Icon icon="ph:package" className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-text-primary dark:text-gray-100 mb-2">
                Aucun service trouvé
              </h3>
              <p className="text-text-secondary dark:text-gray-400">
                Essayez de modifier vos critères de recherche
              </p>
              <button
                onClick={resetFilters}
                className="mt-4 px-6 py-2 bg-primary hover:bg-primary/90 text-white rounded-xl text-sm font-medium transition-colors"
              >
                Réinitialiser les filtres
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {services?.map((service) => (
                  <ServiceCard key={service.id} service={service} />
                ))}
              </div>

              {/* Pagination */}
              {pagination && pagination.totalPages > 1 && (
                <div className="flex justify-center mt-10">
                  <div className="flex gap-2">
                    <button
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-text-primary dark:text-gray-300"
                    >
                      <Icon icon="ph:caret-left" className="w-4 h-4" />
                    </button>
                    
                    {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                      let pageNum: number;
                      if (pagination.totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= pagination.totalPages - 2) {
                        pageNum = pagination.totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }
                      
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={cn(
                            "w-10 h-10 rounded-xl font-medium transition-all",
                            currentPage === pageNum
                              ? "bg-primary text-white shadow-md"
                              : "border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 text-text-primary dark:text-gray-300"
                          )}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                    
                    <button
                      onClick={() => setCurrentPage((p) => Math.min(pagination.totalPages, p + 1))}
                      disabled={currentPage === pagination.totalPages}
                      className="px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-text-primary dark:text-gray-300"
                    >
                      <Icon icon="ph:caret-right" className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}

          {/* CTA Devenir freelance */}
          <div className="mt-16 bg-gradient-to-r from-primary to-secondary rounded-3xl p-8 text-center text-white">
            <h2 className="text-2xl font-bold mb-2">
              Vous êtes freelance ?
            </h2>
            <p className="text-primary-100 mb-4">
              Rejoignez notre communauté et trouvez des missions près de chez vous
            </p>
            <Link
              href="/devenir-freelance"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-primary rounded-xl font-semibold hover:shadow-lg transition-all"
            >
              Devenir freelance
              <Icon icon="ph:arrow-right" className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </main>

    </>
  );
}