// ===== FILE: app/dashboard/customer/services/page.tsx =====

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Icon } from "@iconify/react";
import { toast } from "sonner";

import {
  getClientServices,
  deleteService,
} from "@/app/services/service.service";
import { Service } from "@/app/types/services";

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
  en_cours: {
    label: "En cours",
    color: "text-yellow-700",
    bgColor: "bg-yellow-100",
  },
  terminé: {
    label: "Terminé",
    color: "text-green-700",
    bgColor: "bg-green-100",
  },
  annulé: {
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
  const router = useRouter();

  // États
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // États pour les filtres
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalServices, setTotalServices] = useState(0);

  // État pour le service en cours de suppression
  const [deletingId, setDeletingId] = useState<number | null>(null);

  // Charger les services
  const loadServices = async () => {
    try {
      setLoading(true);
      const response = await getClientServices({
        status: statusFilter || undefined,
        search: searchQuery || undefined,
        page: currentPage,
        per_page: 10,
      });

      setServices(response.services);
      setTotalPages(response.pages);
      setTotalServices(response.total);
    } catch (err: any) {
      setError(err.message || "Erreur lors du chargement des services");
      toast.error("Impossible de charger vos services");
    } finally {
      setLoading(false);
    }
  };

  // Charger au montage et quand les filtres changent
  useEffect(() => {
    loadServices();
  }, [statusFilter, currentPage, searchQuery]);

  // Debounce pour la recherche
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery !== undefined) {
        setCurrentPage(1); // Reset à la première page
        loadServices();
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Supprimer un service
  const handleDelete = async (serviceId: number) => {
    if (
      !confirm(
        "Êtes-vous sûr de vouloir supprimer ce service ? Cette action est irréversible.",
      )
    ) {
      return;
    }

    try {
      setDeletingId(serviceId);
      await deleteService(serviceId);
      toast.success("Service supprimé avec succès");

      // Recharger la liste
      if (services.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      } else {
        loadServices();
      }
    } catch (error: any) {
      toast.error(error.message || "Erreur lors de la suppression");
    } finally {
      setDeletingId(null);
    }
  };

  // Voir les détails
  const handleViewDetails = (serviceId: number) => {
    router.push(`/dashboard/customer/services/${serviceId}`);
  };

  // Éditer un service
  const handleEdit = (serviceId: number) => {
    router.push(`/dashboard/customer/services/${serviceId}/edit`);
  };

  // Voir les candidatures
  const handleViewCandidatures = (serviceId: number) => {
    router.push(`/dashboard/customer/services/${serviceId}/candidatures`);
  };

  // Classes CSS
  const inputClass =
    "w-full px-4 py-2 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500";
  const buttonClass =
    "px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2";
  const tableHeaderClass =
    "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider";

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
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`${inputClass} pl-10`}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <Icon icon="mdi:close" className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Filtre par statut */}
            <div className="sm:w-48">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className={inputClass}
              >
                <option value="">Tous les statuts</option>
                <option value="published">Publié</option>
                <option value="assigned">Assigné</option>
                <option value="en_cours">En cours</option>
                <option value="terminé">Terminé</option>
                <option value="annulé">Annulé</option>
                <option value="draft">Brouillon</option>
              </select>
            </div>
          </div>
        </div>

        {/* Statistiques rapides */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <p className="text-sm text-gray-500">Total services</p>
            <p className="text-2xl font-bold text-gray-900">{totalServices}</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <p className="text-sm text-gray-500">En cours</p>
            <p className="text-2xl font-bold text-yellow-600">
              {services.filter((s) => s.status === "en_cours").length}
            </p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <p className="text-sm text-gray-500">Terminés</p>
            <p className="text-2xl font-bold text-green-600">
              {services.filter((s) => s.status === "terminé").length}
            </p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <p className="text-sm text-gray-500">Total candidatures</p>
            <p className="text-2xl font-bold text-blue-600">
              {services.reduce(
                (acc, s) => acc + (s.candidatures_count || 0),
                0,
              )}
            </p>
          </div>
        </div>

        {/* Tableau des services */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Icon
                icon="mdi:loading"
                className="animate-spin text-4xl text-blue-600"
              />
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <Icon
                icon="mdi:alert-circle"
                className="text-4xl text-red-500 mx-auto mb-4"
              />
              <p className="text-gray-600">{error}</p>
              <button
                onClick={loadServices}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Réessayer
              </button>
            </div>
          ) : services.length === 0 ? (
            <div className="text-center py-20">
              <Icon
                icon="mdi:package-variant"
                className="text-6xl text-gray-300 mx-auto mb-4"
              />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Aucun service trouvé
              </h3>
              <p className="text-gray-500 mb-6">
                {searchQuery || statusFilter
                  ? "Aucun service ne correspond à vos filtres"
                  : "Vous n'avez pas encore publié de service"}
              </p>
              {(searchQuery || statusFilter) && (
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setStatusFilter("");
                  }}
                  className="text-blue-600 hover:text-blue-800"
                >
                  Effacer les filtres
                </button>
              )}
            </div>
          ) : (
            <>
              {/* En-tête du tableau (desktop) */}
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
                    {services.map((service) => {
                      const status =
                        statusConfig[service.status] || statusConfig.draft;

                      return (
                        <tr key={service.id} className="hover:bg-gray-50">
                          {/* Titre du service */}
                          <td className="px-6 py-4">
                            <div className="flex items-center">
                              {service.images && service.images.length > 0 ? (
                                <img
                                  src={service.images[0]}
                                  alt=""
                                  className="h-10 w-10 rounded-lg object-cover mr-3"
                                />
                              ) : (
                                <div className="h-10 w-10 rounded-lg bg-gray-200 flex items-center justify-center mr-3">
                                  <Icon
                                    icon="mdi:image"
                                    className="text-gray-400"
                                  />
                                </div>
                              )}
                              <div>
                                <div className="text-sm font-medium text-gray-900">
                                  {service.title}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {service.short_description?.substring(0, 50)}
                                  {service.short_description?.length > 50
                                    ? "..."
                                    : ""}
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* Statut */}
                          <td className="px-6 py-4">
                            <span
                              className={`px-2 py-1 text-xs font-medium rounded-full ${status.bgColor} ${status.color}`}
                            >
                              {status.label}
                            </span>
                          </td>

                          {/* Budget */}
                          <td className="px-6 py-4 text-sm text-gray-900">
                            {service.proposed_amount?.toLocaleString()} FCFA
                          </td>

                          {/* Candidatures */}
                          <td className="px-6 py-4">
                            <button
                              onClick={() => handleViewCandidatures(service.id)}
                              className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800"
                            >
                              <span className="font-medium">
                                {service.candidatures_count || 0}
                              </span>
                              <Icon
                                icon="mdi:chevron-right"
                                className="h-4 w-4"
                              />
                            </button>
                          </td>

                          {/* Prestataire assigné */}
                          <td className="px-6 py-4">
                            {service.freelancer ? (
                              <div className="flex items-center">
                                {service.freelancer.avatar ? (
                                  <img
                                    src={service.freelancer.avatar}
                                    alt=""
                                    className="h-8 w-8 rounded-full mr-2"
                                  />
                                ) : (
                                  <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center mr-2">
                                    <Icon
                                      icon="mdi:account"
                                      className="text-gray-500"
                                    />
                                  </div>
                                )}
                                <span className="text-sm text-gray-900">
                                  {service.freelancer.name}
                                </span>
                              </div>
                            ) : (
                              <span className="text-sm text-gray-400">
                                Non assigné
                              </span>
                            )}
                          </td>

                          {/* Date */}
                          <td className="px-6 py-4 text-sm text-gray-500">
                            {new Date(service.created_at).toLocaleDateString(
                              "fr-FR",
                            )}
                          </td>

                          {/* Actions */}
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleViewDetails(service.id)}
                                className="p-1 hover:bg-gray-100 rounded"
                                title="Voir détails"
                              >
                                <Icon
                                  icon="mdi:eye"
                                  className="h-5 w-5 text-gray-500"
                                />
                              </button>
                              <button
                                onClick={() => handleEdit(service.id)}
                                className="p-1 hover:bg-gray-100 rounded"
                                title="Modifier"
                              >
                                <Icon
                                  icon="mdi:pen"
                                  className="h-5 w-5 text-gray-500"
                                />
                              </button>
                              <button
                                onClick={() => handleDelete(service.id)}
                                disabled={deletingId === service.id}
                                className="p-1 hover:bg-gray-100 rounded disabled:opacity-50"
                                title="Supprimer"
                              >
                                {deletingId === service.id ? (
                                  <Icon
                                    icon="mdi:loading"
                                    className="animate-spin h-5 w-5 text-red-500"
                                  />
                                ) : (
                                  <Icon
                                    icon="mdi:trash"
                                    className="h-5 w-5 text-red-500"
                                  />
                                )}
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Vue mobile (cartes) */}
              <div className="md:hidden space-y-4 p-4">
                {services.map((service) => {
                  const status =
                    statusConfig[service.status] || statusConfig.draft;

                  return (
                    <div
                      key={service.id}
                      className="bg-white border rounded-lg p-4 space-y-3"
                    >
                      {/* En-tête avec titre et statut */}
                      <div className="flex justify-between items-start">
                        <h3 className="font-medium text-gray-900">
                          {service.title}
                        </h3>
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${status.bgColor} ${status.color}`}
                        >
                          {status.label}
                        </span>
                      </div>

                      {/* Description courte */}
                      <p className="text-sm text-gray-500">
                        {service.short_description}
                      </p>

                      {/* Détails */}
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="text-gray-500">Budget:</span>
                          <span className="ml-1 text-gray-900 font-medium">
                            {service.proposed_amount?.toLocaleString()} FCFA
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500">Candidatures:</span>
                          <span className="ml-1 text-gray-900 font-medium">
                            {service.candidatures_count || 0}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500">Date:</span>
                          <span className="ml-1 text-gray-900">
                            {new Date(service.created_at).toLocaleDateString(
                              "fr-FR",
                            )}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500">Prestataire:</span>
                          <span className="ml-1 text-gray-900">
                            {service.freelancer?.name || "-"}
                          </span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex justify-end gap-2 pt-2 border-t">
                        <button
                          onClick={() => handleViewDetails(service.id)}
                          className="p-2 hover:bg-gray-100 rounded-lg"
                        >
                          <Icon
                            icon="mdi:eye"
                            className="h-5 w-5 text-gray-600"
                          />
                        </button>
                        <button
                          onClick={() => handleEdit(service.id)}
                          className="p-2 hover:bg-gray-100 rounded-lg"
                        >
                          <Icon
                            icon="mdi:pen"
                            className="h-5 w-5 text-gray-600"
                          />
                        </button>
                        <button
                          onClick={() => handleDelete(service.id)}
                          disabled={deletingId === service.id}
                          className="p-2 hover:bg-gray-100 rounded-lg disabled:opacity-50"
                        >
                          {deletingId === service.id ? (
                            <Icon
                              icon="mdi:loading"
                              className="animate-spin h-5 w-5 text-red-500"
                            />
                          ) : (
                            <Icon
                              icon="mdi:trash"
                              className="h-5 w-5 text-red-500"
                            />
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}

          {/* Pagination */}
          {!loading && !error && services.length > 0 && (
            <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
              <div className="flex-1 flex justify-between sm:hidden">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Précédent
                </button>
                <button
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Suivant
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Affichage de{" "}
                    <span className="font-medium">
                      {(currentPage - 1) * 10 + 1}
                    </span>{" "}
                    à{" "}
                    <span className="font-medium">
                      {Math.min(currentPage * 10, totalServices)}
                    </span>{" "}
                    sur <span className="font-medium">{totalServices}</span>{" "}
                    résultats
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                    <button
                      onClick={() => setCurrentPage(1)}
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                    >
                      <Icon
                        icon="mdi:chevron-double-left"
                        className="h-5 w-5"
                      />
                    </button>
                    <button
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                    >
                      <Icon icon="mdi:chevron-left" className="h-5 w-5" />
                    </button>

                    {/* Numéros de page */}
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
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                            currentPage === pageNum
                              ? "z-10 bg-blue-50 border-blue-500 text-blue-600"
                              : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}

                    <button
                      onClick={() =>
                        setCurrentPage((p) => Math.min(totalPages, p + 1))
                      }
                      disabled={currentPage === totalPages}
                      className="relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                    >
                      <Icon icon="mdi:chevron-right" className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => setCurrentPage(totalPages)}
                      disabled={currentPage === totalPages}
                      className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                    >
                      <Icon
                        icon="mdi:chevron-double-right"
                        className="h-5 w-5"
                      />
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
