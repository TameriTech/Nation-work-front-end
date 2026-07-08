// app/dashboard/customer/services/page.tsx
"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Icon } from "@iconify/react";
import { cn } from "@/app/lib/utils";
import { useClientServices } from "@/app/hooks/services/use-client-service";
import type { Service, ServiceFilters, ServiceStatus } from "@/app/types";
import ServicesLoading from "./loading";
import ServicesError from "./error";
import { useTheme } from "next-themes";

// Configuration des statuts
const statusConfig: Record<
  ServiceStatus,
  { label: string; color: string; bgColor: string; icon: string; borderColor: string }
> = {
  published: {
    label: "Publié",
    color: "text-green-700 dark:text-green-400",
    bgColor: "bg-green-50 dark:bg-green-900/20",
    icon: "ph:check-circle",
    borderColor: "border-green-200 dark:border-green-800",
  },
  assigned: {
    label: "Assigné",
    color: "text-purple-700 dark:text-purple-400",
    bgColor: "bg-purple-50 dark:bg-purple-900/20",
    icon: "ph:user-check",
    borderColor: "border-purple-200 dark:border-purple-800",
  },
  in_progress: {
    label: "En cours",
    color: "text-blue-700 dark:text-blue-400",
    bgColor: "bg-blue-50 dark:bg-blue-900/20",
    icon: "ph:clock",
    borderColor: "border-blue-200 dark:border-blue-800",
  },
  completed: {
    label: "Terminé",
    color: "text-gray-700 dark:text-gray-400",
    bgColor: "bg-gray-50 dark:bg-gray-800",
    icon: "ph:check",
    borderColor: "border-gray-200 dark:border-gray-700",
  },
  draft: {
    label: "Brouillon",
    color: "text-gray-500 dark:text-gray-500",
    bgColor: "bg-gray-50 dark:bg-gray-800",
    icon: "ph:file-text",
    borderColor: "border-gray-200 dark:border-gray-700",
  },
  cancelled: {
    label: "Annulé",
    color: "text-red-700 dark:text-red-400",
    bgColor: "bg-red-50 dark:bg-red-900/20",
    icon: "ph:x-circle",
    borderColor: "border-red-200 dark:border-red-800",
  },
};

export default function CustomerServicesPage() {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [filters, setFilters] = useState<ServiceFilters>({
    page: 1,
    per_page: 10,
    sort_by: "created_at",
    sort_order: "desc",
  });
  const [searchInput, setSearchInput] = useState("");
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const {
    services,
    pagination,
    isLoading,
    error,
    deleteService,
    refetch,
  } = useClientServices(filters);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSearch = useCallback((value: string) => {
    setSearchInput(value);
    const timer = setTimeout(() => {
      setFilters((prev) => ({ ...prev, search: value || undefined, page: 1 }));
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const handleDelete = useCallback(async (serviceId: number) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce service ? Cette action est irréversible.")) {
      return;
    }
    setDeletingId(serviceId);
    try {
      await deleteService(serviceId);
    } finally {
      setDeletingId(null);
    }
  }, [deleteService]);

  const stats = useMemo(() => {
    const total = pagination?.total || 0;
    const published = services.filter((s: Service) => s.status === "published").length;
    const inProgress = services.filter((s: Service) => s.status === "in_progress").length;
    const completed = services.filter((s: Service) => s.status === "completed").length;
    const totalCandidatures = services.reduce((acc: number, s: Service) => acc + (s.candidatures_count || 0), 0);
    
    return { total, published, inProgress, completed, totalCandidatures };
  }, [services, pagination]);

  if (isLoading) return <ServicesLoading />;
  if (error) return <ServicesError error={error} reset={refetch} />;

  const currentPage = filters.page || 1;
  const totalPages = pagination?.totalPages || 1;

  return (
    <main className="bg-background dark:bg-gray-900 min-h-screen transition-colors duration-300">
      {/* Header avec dégradé */}
      <div className="bg-gradient-to-r from-primary to-secondary px-6 py-8 rounded-b-3xl mb-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                Mes services
              </h1>
              <p className="text-primary-100">
                Gérez tous vos services : création, modification, suivi des candidatures
              </p>
            </div>
            <div className="flex items-center gap-3">
              {mounted && (
                <button
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-all backdrop-blur-sm"
                >
                  {theme === "dark" ? (
                    <Icon icon="ph:sun" className="w-5 h-5 text-white" />
                  ) : (
                    <Icon icon="ph:moon" className="w-5 h-5 text-white" />
                  )}
                </button>
              )}
              <Link
                href="/dashboard/customer/missions/create"
                className="inline-flex items-center gap-2 px-4 py-2 bg-white text-primary rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all"
              >
                <Icon icon="ph:plus" className="w-5 h-5" />
                Nouveau service
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        
        {/* Cartes de statistiques */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <StatCard 
            label="Total services" 
            value={stats.total} 
            icon="ph:briefcase" 
            color="from-primary to-primary/80" 
          />
          <StatCard 
            label="Publiés" 
            value={stats.published} 
            icon="ph:check-circle" 
            color="from-green-500 to-green-600" 
          />
          <StatCard 
            label="En cours" 
            value={stats.inProgress} 
            icon="ph:clock" 
            color="from-blue-500 to-blue-600" 
          />
          <StatCard 
            label="Terminés" 
            value={stats.completed} 
            icon="ph:check" 
            color="from-gray-500 to-gray-600" 
          />
          <StatCard 
            label="Candidatures" 
            value={stats.totalCandidatures} 
            icon="ph:users" 
            color="from-purple-500 to-purple-600" 
          />
        </div>

        {/* Barre de recherche et filtre */}
        <div className="bg-surface dark:bg-gray-800 rounded-2xl p-4 mb-6 shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Icon icon="ph:magnifying-glass" className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary dark:text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Rechercher un service..."
                value={searchInput}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-text-primary dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              />
            </div>
            <div className="sm:w-48">
              <select
                value={filters.status?.[0] || ""}
                onChange={(e) => setFilters((prev) => ({
                  ...prev,
                  status: e.target.value ? [e.target.value as ServiceStatus] : undefined,
                  page: 1,
                }))}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-text-primary dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all cursor-pointer"
              >
                <option value="">Tous les statuts</option>
                <option value="published">✓ Publié</option>
                <option value="assigned">👤 Assigné</option>
                <option value="in_progress">⏳ En cours</option>
                <option value="completed">✅ Terminé</option>
                <option value="cancelled">❌ Annulé</option>
                <option value="draft">📝 Brouillon</option>
              </select>
            </div>
          </div>
        </div>

        {/* Liste des services - Vue cartes style dashboard */}
        {services.length === 0 ? (
          <EmptyState hasFilters={!!(filters.search || filters.status)} />
        ) : (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {services.map((service: Service) => (
                <ServiceCard
                  key={service.id}
                  service={service}
                  onDelete={handleDelete}
                  isDeleting={deletingId === service.id}
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 flex justify-center">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  totalItems={pagination?.total || 0}
                  pageSize={filters.per_page || 10}
                  onPageChange={(page) => setFilters((prev) => ({ ...prev, page }))}
                />
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}

// ==================== COMPOSANTS ====================

function StatCard({ label, value, icon, color }: { label: string; value: number; icon: string; color: string }) {
  return (
    <div className="bg-surface dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all group">
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm text-text-secondary dark:text-gray-400">{label}</p>
        <div className={`w-8 h-8 bg-gradient-to-br ${color} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform`}>
          <Icon icon={icon} className="w-4 h-4 text-white" />
        </div>
      </div>
      <p className="text-2xl font-bold text-text-primary dark:text-gray-100">{value}</p>
    </div>
  );
}

function EmptyState({ hasFilters }: { hasFilters: boolean }) {
  const router = useRouter();
  
  return (
    <div className="text-center py-16 bg-surface dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700">
      <div className="w-20 h-20 mx-auto bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
        <Icon icon="ph:briefcase" className="text-4xl text-text-secondary dark:text-gray-500" />
      </div>
      <h3 className="text-lg font-semibold text-text-primary dark:text-gray-100 mb-2">
        {hasFilters ? "Aucun service trouvé" : "Aucun service publié"}
      </h3>
      <p className="text-text-secondary dark:text-gray-400 mb-6 max-w-md mx-auto">
        {hasFilters
          ? "Aucun service ne correspond à vos critères de recherche."
          : "Vous n'avez pas encore publié de service. Commencez dès maintenant !"}
      </p>
      {!hasFilters && (
        <button
          onClick={() => router.push("/dashboard/customer/services/create")}
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all"
        >
          <Icon icon="ph:plus" className="w-5 h-5" />
          Publier mon premier service
        </button>
      )}
    </div>
  );
}

function ServiceCard({ service, onDelete, isDeleting }: { service: Service; onDelete: (id: number) => void; isDeleting: boolean }) {
  const router = useRouter();
  const status = statusConfig[service.status] || statusConfig.draft;
  const hasCandidatures = (service.candidatures_count || 0) > 0;

  return (
    <div className={cn(
      "bg-surface dark:bg-gray-800 rounded-2xl shadow-sm border transition-all duration-300 hover:shadow-lg hover:-translate-y-1",
      status.borderColor
    )}>
      {/* En-tête avec statut */}
      <div className="p-5 border-b border-gray-100 dark:border-gray-700">
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1">
            <h3 className="font-bold text-lg text-text-primary dark:text-gray-100 line-clamp-1">
              {service.title}
            </h3>
            {service.code && (
              <p className="text-xs text-text-secondary dark:text-gray-400 mt-1">
                Réf: {service.code}
              </p>
            )}
          </div>
          <span className={cn("inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-full", status.bgColor, status.color)}>
            <Icon icon={status.icon} className="w-3.5 h-3.5" />
            {status.label}
          </span>
        </div>
        <p className="text-sm text-text-secondary dark:text-gray-400 line-clamp-2">
          {service.short_description || "Aucune description"}
        </p>
      </div>

      {/* Informations */}
      <div className="p-5 space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-sm text-text-secondary dark:text-gray-400">Budget</span>
          <span className="font-bold text-lg text-primary">
            {service.proposed_amount?.toLocaleString()} CFA
          </span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-sm text-text-secondary dark:text-gray-400">Candidatures</span>
          <button
            onClick={() => router.push(`/dashboard/customer/services/${service.id}/candidatures`)}
            className={cn(
              "flex items-center gap-1 font-medium transition-all",
              hasCandidatures 
                ? "text-primary hover:gap-2" 
                : "text-text-secondary"
            )}
          >
            <span>{service.candidatures_count || 0}</span>
            {hasCandidatures && <Icon icon="ph:arrow-right" className="w-3.5 h-3.5" />}
          </button>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-sm text-text-secondary dark:text-gray-400">Prestataire</span>
          <span className="text-sm text-text-primary dark:text-gray-100">
            {service.provider?.username || "—"}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-sm text-text-secondary dark:text-gray-400">Date création</span>
          <span className="text-sm text-text-primary dark:text-gray-100">
            {new Date(service.created_at).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" })}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="p-4 border-t border-gray-100 dark:border-gray-700 flex justify-between gap-2">
        <button
          onClick={() => router.push(`/dashboard/customer/missions/${service.id}`)}
          className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 text-text-secondary hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
        >
          <Icon icon="ph:eye" className="w-4 h-4" />
          <span className="text-sm font-medium">Voir</span>
        </button>
        
        {service.status !== "completed" && service.status !== "cancelled" && (
          <button
            onClick={() => router.push(`/dashboard/customer/missions/${service.id}/edit`)}
            className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 rounded-xl border border-primary/30 text-primary hover:bg-primary/10 transition-all"
          >
            <Icon icon="ph:pencil" className="w-4 h-4" />
            <span className="text-sm font-medium">Modifier</span>
          </button>
        )}
        
        {(service.status === "draft" || service.status === "published") && (
          <button
            onClick={() => onDelete(service.id)}
            disabled={isDeleting}
            className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 rounded-xl border border-red-200 dark:border-red-800 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all disabled:opacity-50"
          >
            {isDeleting ? (
              <Icon icon="ph:spinner" className="w-4 h-4 animate-spin" />
            ) : (
              <Icon icon="ph:trash" className="w-4 h-4" />
            )}
            <span className="text-sm font-medium">Supprimer</span>
          </button>
        )}
      </div>
    </div>
  );
}

function Pagination({ currentPage, totalPages, totalItems, pageSize, onPageChange }: any) {
  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push(-1);
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push(-1);
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push(-1);
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
        pages.push(-1);
        pages.push(totalPages);
      }
    }
    return pages;
  };

  return (
    <div className="flex items-center justify-center gap-2">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <Icon icon="ph:caret-left" className="w-4 h-4 text-text-secondary" />
      </button>
      
      {getPageNumbers().map((page, index) => (
        page === -1 ? (
          <span key={`dots-${index}`} className="px-2 text-text-secondary">...</span>
        ) : (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={cn(
              "w-9 h-9 rounded-lg text-sm font-medium transition-colors",
              currentPage === page
                ? "bg-primary text-white"
                : "hover:bg-gray-100 dark:hover:bg-gray-700 text-text-secondary"
            )}
          >
            {page}
          </button>
        )
      ))}
      
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <Icon icon="ph:caret-right" className="w-4 h-4 text-text-secondary" />
      </button>
    </div>
  );
}