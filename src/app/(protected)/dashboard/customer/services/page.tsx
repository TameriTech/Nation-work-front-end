// app/dashboard/customer/services/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { Icon } from "@iconify/react";
import { useClientServices } from "@/app/hooks/services/use-client-service";
import { ServiceFilters, ServiceStatus } from "@/app/types/services";
import ServicesLoading from "./loading";
import ServicesError from "./error";

// Configuration des statuts pour l'affichage
const statusConfig: Record<
  string,
  { label: string; color: string; bgColor: string }
> = {
  published: {
    label: "Publié",
    color: "text-blue-700",
    bgColor: "bg-blue-100",
  },
  assigned: {
    label: "Assigné",
    color: "text-purple-700",
    bgColor: "bg-purple-100",
  },
  in_progress: {
    label: "En cours",
    color: "text-yellow-700",
    bgColor: "bg-yellow-100",
  },
  completed: {
    label: "Terminé",
    color: "text-green-700",
    bgColor: "bg-green-100",
  },
  canceled: {
    label: "Annulé",
    color: "text-red-700",
    bgColor: "bg-red-100",
  },
  draft: {
    label: "Brouillon",
    color: "text-gray-700",
    bgColor: "bg-gray-100",
  },
};

export default function CustomerServicesPage() {
  // États pour les filtres
  const [filters, setFilters] = useState<ServiceFilters>({
    page: 1,
    per_page: 10,
  });

  const [searchInput, setSearchInput] = useState("");

  // Hook personnalisé
  const {
    services,
    pagination,
    isLoading,
    error,
    deleteService,
    isDeleting,
    refetch,
  } = useClientServices(filters);

  // Debounce pour la recherche
  const handleSearch = (value: string) => {
    setSearchInput(value);
    const timer = setTimeout(() => {
      setFilters((prev) => ({ ...prev, search: value || undefined, page: 1 }));
    }, 500);
    return () => clearTimeout(timer);
  };

  // Gestionnaire de suppression
  const handleDelete = async (serviceId: number) => {
    if (
      !confirm(
        "Êtes-vous sûr de vouloir supprimer ce service ? Cette action est irréversible.",
      )
    ) {
      return;
    }
    await deleteService(serviceId);
  };

  // Classes CSS
  const inputClass =
    "w-full px-4 py-2 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500";
  const tableHeaderClass =
    "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider";

  // États de chargement et d'erreur
  if (isLoading) return <ServicesLoading />;
  if (error) return <ServicesError error={error} reset={refetch} />;

  const totalServices = pagination?.total || 0;
  const currentPage = filters.page || 1;
  const totalPages = pagination?.pages || 1;

  return (
    <div className="min-h-screen bg-white/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header avec titre et bouton de création */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Mes services</h1>
            <p className="text-sm text-gray-500 mt-1">
              Gérez tous vos services publiés
            </p>
          </div>

          <Link
            href="/dashboard/customer/services/create"
            className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
          >
            <Icon icon="mdi:plus" className="h-5 w-5" />
            Publier un nouveau service
          </Link>
        </div>

        {/* Filtres et recherche */}
        <div className="bg-white rounded-xl p-4 mb-6 shadow-sm">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Recherche */}
            <div className="flex-1 relative">
              <Icon
                icon="mdi:magnify"
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5"
              />
              <input
                type="text"
                placeholder="Rechercher un service..."
                value={searchInput}
                onChange={(e) => handleSearch(e.target.value)}
                className={`${inputClass} pl-10`}
              />
              {searchInput && (
                <button
                  onClick={() => {
                    setSearchInput("");
                    setFilters((prev) => ({
                      ...prev,
                      search: undefined,
                      page: 1,
                    }));
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <Icon icon="mdi:close" className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Filtre par statut */}
            <div className="sm:w-48">
              <select
                value={filters.status?.[0] || ""}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    status: e.target.value
                      ? [e.target.value as ServiceStatus]
                      : undefined,
                    page: 1,
                  }))
                }
                className={inputClass}
              >
                <option value="">Tous les statuts</option>
                <option value="published">Publié</option>
                <option value="assigned">Assigné</option>
                <option value="in_progress">En cours</option>
                <option value="completed">Terminé</option>
                <option value="canceled">Annulé</option>
                <option value="draft">Brouillon</option>
              </select>
            </div>
          </div>
        </div>

        {/* Statistiques rapides */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <StatCard label="Total services" value={totalServices} color="gray" />
          <StatCard
            label="En cours"
            value={services.filter((s) => s.status === "in_progress").length}
            color="yellow"
          />
          <StatCard
            label="Terminés"
            value={services.filter((s) => s.status === "completed").length}
            color="green"
          />
          <StatCard
            label="Total candidatures"
            value={services.reduce((acc, s) => acc + (s.id || 0), 0)}
            color="blue"
          />
        </div>

        {/* Tableau des services */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {services.length === 0 ? (
            <EmptyState
              hasFilters={!!(filters.search || filters.status)}
              onClearFilters={() => {
                setSearchInput("");
                setFilters({ page: 1, per_page: 10 });
              }}
            />
          ) : (
            <>
              {/* Version desktop */}
              <DesktopTable
                services={services}
                onViewDetails={(id: number) =>
                  (window.location.href = `/dashboard/customer/services/${id}`)
                }
                onEdit={(id: number) =>
                  (window.location.href = `/dashboard/customer/services/${id}/edit`)
                }
                onDelete={handleDelete}
                isDeleting={isDeleting}
                onViewCandidatures={(id: number) =>
                  (window.location.href = `/dashboard/customer/services/${id}/candidatures`)
                }
                statusConfig={statusConfig}
                tableHeaderClass={tableHeaderClass}
              />

              {/* Version mobile */}
              <MobileCards
                services={services}
                onViewDetails={(id: number) =>
                  (window.location.href = `/dashboard/customer/services/${id}`)
                }
                onEdit={(id: number) =>
                  (window.location.href = `/dashboard/customer/services/${id}/edit`)
                }
                onDelete={handleDelete}
                isDeleting={isDeleting}
                onViewCandidatures={(id: number) =>
                  (window.location.href = `/dashboard/customer/services/${id}/candidatures`)
                }
                statusConfig={statusConfig}
              />
            </>
          )}

          {/* Pagination */}
          {services.length > 0 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={totalServices}
              pageSize={filters.per_page || 10}
              onPageChange={(page: number) =>
                setFilters((prev) => ({ ...prev, page }))
              }
            />
          )}
        </div>
      </div>
    </div>
  );
}

// ==================== COMPOSANTS ====================

function StatCard({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: "gray" | "yellow" | "green" | "blue";
}) {
  const colors = {
    gray: "text-gray-900",
    yellow: "text-yellow-600",
    green: "text-green-600",
    blue: "text-blue-600",
  };

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm">
      <p className="text-sm text-gray-500">{label}</p>
      <p className={`text-2xl font-bold ${colors[color]}`}>{value}</p>
    </div>
  );
}

function EmptyState({
  hasFilters,
  onClearFilters,
}: {
  hasFilters: boolean;
  onClearFilters: () => void;
}) {
  return (
    <div className="text-center py-20">
      <Icon
        icon="mdi:package-variant"
        className="text-6xl text-gray-300 mx-auto mb-4"
      />
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        Aucun service trouvé
      </h3>
      <p className="text-gray-500 mb-6">
        {hasFilters
          ? "Aucun service ne correspond à vos filtres"
          : "Vous n'avez pas encore publié de service"}
      </p>
      {hasFilters && (
        <button
          onClick={onClearFilters}
          className="text-blue-600 hover:text-blue-800"
        >
          Effacer les filtres
        </button>
      )}
    </div>
  );
}

function DesktopTable({
  services,
  onViewDetails,
  onEdit,
  onDelete,
  isDeleting,
  onViewCandidatures,
  statusConfig,
  tableHeaderClass,
}: any) {
  return (
    <div className="hidden md:block">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className={tableHeaderClass}>Service</th>
            <th className={tableHeaderClass}>Statut</th>
            <th className={tableHeaderClass}>Budget</th>
            <th className={tableHeaderClass}>Candidatures</th>
            <th className={tableHeaderClass}>Prestataire</th>
            <th className={tableHeaderClass}>Date</th>
            <th className={tableHeaderClass}>Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {services.map((service: any) => {
            const status = statusConfig[service.status] || statusConfig.draft;
            return (
              <tr key={service.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <ServiceImage image={service.images?.[0]} />
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {service.title}
                      </div>
                      <div className="text-sm text-gray-500">
                        {service.short_description?.substring(0, 50)}
                        {service.short_description?.length > 50 ? "..." : ""}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <StatusBadge status={status} />
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {service.proposed_amount?.toLocaleString()} FCFA
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => onViewCandidatures(service.id)}
                    className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800"
                  >
                    <span className="font-medium">
                      {service.candidatures_count || 0}
                    </span>
                    <Icon icon="mdi:chevron-right" className="h-4 w-4" />
                  </button>
                </td>
                <td className="px-6 py-4">
                  <FreelancerInfo freelancer={service.freelancer} />
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {new Date(service.created_at).toLocaleDateString("fr-FR")}
                </td>
                <td className="px-6 py-4">
                  <ActionButtons
                    serviceId={service.id}
                    onView={onViewDetails}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    isDeleting={isDeleting === service.id}
                  />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function MobileCards({
  services,
  onViewDetails,
  onEdit,
  onDelete,
  isDeleting,
  statusConfig,
}: any) {
  return (
    <div className="md:hidden space-y-4 p-4">
      {services.map((service: any) => {
        const status = statusConfig[service.status] || statusConfig.draft;
        return (
          <div
            key={service.id}
            className="bg-white border rounded-lg p-4 space-y-3"
          >
            <div className="flex justify-between items-start">
              <h3 className="font-medium text-gray-900">{service.title}</h3>
              <StatusBadge status={status} />
            </div>
            <p className="text-sm text-gray-500">{service.short_description}</p>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <InfoItem
                label="Budget"
                value={`${service.proposed_amount?.toLocaleString()} FCFA`}
              />
              <InfoItem
                label="Candidatures"
                value={service.candidatures_count || 0}
              />
              <InfoItem
                label="Date"
                value={new Date(service.created_at).toLocaleDateString("fr-FR")}
              />
              <InfoItem
                label="Prestataire"
                value={service.freelancer?.name || "-"}
              />
            </div>
            <div className="flex justify-end gap-2 pt-2 border-t">
              <ActionButtons
                serviceId={service.id}
                onView={onViewDetails}
                onEdit={onEdit}
                onDelete={onDelete}
                isDeleting={isDeleting === service.id}
                isMobile
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ==================== SOUS-COMPOSANTS ====================

function ServiceImage({ image }: { image?: string }) {
  if (image) {
    return (
      <img
        src={image}
        alt=""
        className="h-10 w-10 rounded-lg object-cover mr-3"
      />
    );
  }
  return (
    <div className="h-10 w-10 rounded-lg bg-gray-200 flex items-center justify-center mr-3">
      <Icon icon="mdi:image" className="text-gray-400" />
    </div>
  );
}

function StatusBadge({
  status,
}: {
  status: { label: string; bgColor: string; color: string };
}) {
  return (
    <span
      className={`px-2 py-1 text-xs font-medium rounded-full ${status.bgColor} ${status.color}`}
    >
      {status.label}
    </span>
  );
}

function FreelancerInfo({ freelancer }: { freelancer?: any }) {
  if (!freelancer) {
    return <span className="text-sm text-gray-400">Non assigné</span>;
  }
  return (
    <div className="flex items-center">
      {freelancer.avatar ? (
        <img
          src={freelancer.avatar}
          alt=""
          className="h-8 w-8 rounded-full mr-2"
        />
      ) : (
        <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center mr-2">
          <Icon icon="mdi:account" className="text-gray-500" />
        </div>
      )}
      <span className="text-sm text-gray-900">{freelancer.name}</span>
    </div>
  );
}

function InfoItem({ label, value }: { label: string; value: string | number }) {
  return (
    <div>
      <span className="text-gray-500">{label}:</span>
      <span className="ml-1 text-gray-900 font-medium">{value}</span>
    </div>
  );
}

function ActionButtons({
  serviceId,
  onView,
  onEdit,
  onDelete,
  isDeleting,
  isMobile,
}: any) {
  const buttonClass = isMobile
    ? "p-2 hover:bg-gray-100 rounded-lg"
    : "p-1 hover:bg-gray-100 rounded";

  return (
    <>
      <button
        onClick={() => onView(serviceId)}
        className={buttonClass}
        title="Voir détails"
      >
        <Icon icon="mdi:eye" className="h-5 w-5 text-gray-500" />
      </button>
      <button
        onClick={() => onEdit(serviceId)}
        className={buttonClass}
        title="Modifier"
      >
        <Icon icon="mdi:pen" className="h-5 w-5 text-gray-500" />
      </button>
      <button
        onClick={() => onDelete(serviceId)}
        disabled={isDeleting}
        className={`${buttonClass} disabled:opacity-50`}
        title="Supprimer"
      >
        {isDeleting ? (
          <Icon
            icon="mdi:loading"
            className="animate-spin h-5 w-5 text-red-500"
          />
        ) : (
          <Icon icon="mdi:trash" className="h-5 w-5 text-red-500" />
        )}
      </button>
    </>
  );
}

function Pagination({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
}: any) {
  if (totalPages <= 1) return null;

  return (
    <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
      {/* Version mobile */}
      <div className="flex-1 flex justify-between sm:hidden">
        <PaginationButton
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Précédent
        </PaginationButton>
        <PaginationButton
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Suivant
        </PaginationButton>
      </div>

      {/* Version desktop */}
      <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-gray-700">
            Affichage de{" "}
            <span className="font-medium">
              {(currentPage - 1) * pageSize + 1}
            </span>{" "}
            à{" "}
            <span className="font-medium">
              {Math.min(currentPage * pageSize, totalItems)}
            </span>{" "}
            sur <span className="font-medium">{totalItems}</span> résultats
          </p>
        </div>
        <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
          <PaginationArrow
            onClick={() => onPageChange(1)}
            disabled={currentPage === 1}
            icon="mdi:chevron-double-left"
          />
          <PaginationArrow
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            icon="mdi:chevron-left"
          />

          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            let pageNum;
            if (totalPages <= 5) {
              pageNum = i + 1;
            } else if (currentPage <= 3) {
              pageNum = i + 1;
            } else if (currentPage >= totalPages - 2) {
              pageNum = totalPages - 4 + i;
            } else {
              pageNum = currentPage - 2 + i;
            }

            return (
              <PaginationNumber
                key={pageNum}
                page={pageNum}
                isActive={currentPage === pageNum}
                onClick={() => onPageChange(pageNum)}
              />
            );
          })}

          <PaginationArrow
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            icon="mdi:chevron-right"
          />
          <PaginationArrow
            onClick={() => onPageChange(totalPages)}
            disabled={currentPage === totalPages}
            icon="mdi:chevron-double-right"
          />
        </nav>
      </div>
    </div>
  );
}

function PaginationButton({ onClick, disabled, children }: any) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {children}
    </button>
  );
}

function PaginationArrow({ onClick, disabled, icon }: any) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
    >
      <Icon icon={icon} className="h-5 w-5" />
    </button>
  );
}

function PaginationNumber({ page, isActive, onClick }: any) {
  return (
    <button
      onClick={onClick}
      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
        isActive
          ? "z-10 bg-blue-50 border-blue-500 text-blue-600"
          : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
      }`}
    >
      {page}
    </button>
  );
}
