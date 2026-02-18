"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Briefcase,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Eye,
  Edit,
  XCircle,
  CheckCircle,
  Clock,
  Download,
  RefreshCw,
  Loader2,
  AlertCircle,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  MapPin,
  Calendar,
  DollarSign,
  User,
  Users,
  Tag,
  MoreHorizontal,
  Ban,
  Trash2,
  FileText,
  MessageSquare,
  Scale,
  Star,
  Image as ImageIcon,
} from "lucide-react";

import {
  getServices,
  updateServiceStatus,
  cancelService,
  deleteService,
  //getServiceStats,
} from "@/app/services/service.service";
import type {
  Service,
  ServiceFilters,
  PaginatedResponse,
  ServiceStatus,
} from "@/app/types/admin";
import { services as mockServices } from "@/data/admin-mock-data";

// Composant de filtre
const ServiceFilters = ({
  filters,
  onFilterChange,
  onSearch,
}: {
  filters: ServiceFilters;
  onFilterChange: (filters: ServiceFilters) => void;
  onSearch: () => void;
}) => {
  const [localSearch, setLocalSearch] = useState(filters.search || "");

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      onFilterChange({ ...filters, search: localSearch });
      onSearch();
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-4 mb-6 border border-gray-200 dark:border-slate-700">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Recherche */}
        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Recherche
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-4 h-4" />
            <input
              type="text"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Titre du service, client, freelancer..."
              className="pl-10 w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100"
            />
          </div>
        </div>

        {/* Filtre par statut */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Statut
          </label>
          <select
            value={filters.status || ""}
            onChange={(e) =>
              onFilterChange({
                ...filters,
                status: e.target.value || undefined,
              })
            }
            className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100"
          >
            <option value="">Tous les statuts</option>
            <option value="published">Publié</option>
            <option value="assigned">Assigné</option>
            <option value="in_progress">En cours</option>
            <option value="completed">Terminé</option>
            <option value="cancelled">Annulé</option>
            <option value="disputed">Litige</option>
          </select>
        </div>

        {/* Filtre par catégorie */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Catégorie
          </label>
          <select
            value={filters.category || ""}
            onChange={(e) =>
              onFilterChange({
                ...filters,
                category: e.target.value || undefined,
              })
            }
            className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100"
          >
            <option value="">Toutes les catégories</option>
            <option value="Plomberie">Plomberie</option>
            <option value="Électricité">Électricité</option>
            <option value="Ménage">Ménage</option>
            <option value="Jardinage">Jardinage</option>
            <option value="Informatique">Informatique</option>
            <option value="Cours">Cours particuliers</option>
          </select>
        </div>
      </div>

      <div className="flex justify-end mt-4 space-x-2">
        <button
          onClick={() => {
            onFilterChange({});
            setLocalSearch("");
            onSearch();
          }}
          className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 border border-gray-300 dark:border-slate-600 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition"
        >
          Réinitialiser
        </button>
        <button
          onClick={onSearch}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center transition"
        >
          <Search className="w-4 h-4 mr-2" />
          Rechercher
        </button>
      </div>
    </div>
  );
};

// Badge de statut
const StatusBadge = ({ status }: { status: string }) => {
  const badges: Record<string, { color: string; icon: any; label: string }> = {
    published: {
      color:
        "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800",
      icon: Clock,
      label: "Publié",
    },
    assigned: {
      color:
        "bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-800",
      icon: User,
      label: "Assigné",
    },
    in_progress: {
      color:
        "bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800",
      icon: Loader2,
      label: "En cours",
    },
    completed: {
      color:
        "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800",
      icon: CheckCircle,
      label: "Terminé",
    },
    cancelled: {
      color:
        "bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700",
      icon: XCircle,
      label: "Annulé",
    },
    disputed: {
      color:
        "bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800",
      icon: Scale,
      label: "Litige",
    },
  };
  const badge = badges[status] || badges.published;
  const Icon = badge.icon;

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${badge.color}`}
    >
      <Icon className="w-3 h-3 mr-1" />
      {badge.label}
    </span>
  );
};

// Composant de tableau
const ServiceTable = ({
  services,
  onSort,
  sortBy,
  sortOrder,
  onView,
  onUpdateStatus,
  onCancel,
  loading,
}: {
  services: Service[];
  onSort: (field: string) => void;
  sortBy: string;
  sortOrder: "asc" | "desc";
  onView: (service: Service) => void;
  onUpdateStatus: (service: Service, status: ServiceStatus) => void;
  onCancel: (service: Service) => void;
  loading: boolean;
}) => {
  const SortIcon = ({ field }: { field: string }) => {
    if (sortBy !== field)
      return (
        <ArrowUpDown className="w-4 h-4 ml-1 text-gray-400 dark:text-gray-500" />
      );
    return sortOrder === "asc" ? (
      <ArrowUp className="w-4 h-4 ml-1 text-blue-600 dark:text-blue-400" />
    ) : (
      <ArrowDown className="w-4 h-4 ml-1 text-blue-600 dark:text-blue-400" />
    );
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20 bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700">
        <Loader2 className="w-8 h-8 text-blue-600 dark:text-blue-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg overflow-hidden border border-gray-200 dark:border-slate-700">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-slate-700">
          <thead className="bg-gray-50 dark:bg-slate-700">
            <tr>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-600 transition"
                onClick={() => onSort("title")}
              >
                <div className="flex items-center">
                  Service
                  <SortIcon field="title" />
                </div>
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-600 transition"
                onClick={() => onSort("client.name")}
              >
                <div className="flex items-center">
                  Client
                  <SortIcon field="client.name" />
                </div>
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-600 transition"
                onClick={() => onSort("freelancer.name")}
              >
                <div className="flex items-center">
                  Freelancer
                  <SortIcon field="freelancer.name" />
                </div>
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-600 transition"
                onClick={() => onSort("category")}
              >
                <div className="flex items-center">
                  Catégorie
                  <SortIcon field="category" />
                </div>
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-600 transition"
                onClick={() => onSort("status")}
              >
                <div className="flex items-center">
                  Statut
                  <SortIcon field="status" />
                </div>
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-600 transition"
                onClick={() => onSort("date")}
              >
                <div className="flex items-center">
                  Date
                  <SortIcon field="date" />
                </div>
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-600 transition"
                onClick={() => onSort("budget")}
              >
                <div className="flex items-center">
                  Budget
                  <SortIcon field="budget" />
                </div>
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-slate-800 divide-y divide-gray-200 dark:divide-slate-700">
            {services.length === 0 ? (
              <tr>
                <td
                  colSpan={8}
                  className="px-6 py-12 text-center text-gray-500 dark:text-gray-400"
                >
                  Aucun service trouvé
                </td>
              </tr>
            ) : (
              services.map((service) => (
                <tr
                  key={service.id}
                  className="hover:bg-gray-50 dark:hover:bg-slate-700/50 transition"
                >
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {service.title}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      ID: {service.id}
                    </div>
                    {service.priority === "high" && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border border-red-200 dark:border-red-800 mt-1">
                        <AlertCircle className="w-3 h-3 mr-1" />
                        Prioritaire
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-8 w-8">
                        {service.client.avatar ? (
                          <img
                            className="h-8 w-8 rounded-full object-cover"
                            src={service.client.avatar}
                            alt={service.client.name}
                          />
                        ) : (
                          <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-slate-700 flex items-center justify-center">
                            <User className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                          </div>
                        )}
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {service.client.name}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {service.freelancer ? (
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-8 w-8">
                          {service.freelancer.avatar ? (
                            <img
                              className="h-8 w-8 rounded-full object-cover"
                              src={service.freelancer.avatar}
                              alt={service.freelancer.name}
                            />
                          ) : (
                            <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-slate-700 flex items-center justify-center">
                              <User className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                            </div>
                          )}
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {service.freelancer.name}
                          </div>
                          {service.freelancer.rating && (
                            <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                              <Star className="w-3 h-3 mr-1 text-yellow-400 fill-current" />
                              {service.freelancer.rating}
                            </div>
                          )}
                        </div>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        Non assigné
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400 border border-purple-200 dark:border-purple-800">
                      <Tag className="w-3 h-3 mr-1" />
                      {service.category}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={service.status} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white">
                      {new Date(service.date).toLocaleDateString("fr-FR")}
                    </div>
                    {service.start_time && (
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {service.start_time}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {formatCurrency(service.budget)}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {service.candidatures_count} candidature(s)
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => onView(service)}
                        className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 p-1 rounded hover:bg-blue-50 dark:hover:bg-blue-900/30 transition"
                        title="Voir détails"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          /* Ouvrir modal d'édition */
                        }}
                        className="text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 p-1 rounded hover:bg-green-50 dark:hover:bg-green-900/30 transition"
                        title="Modifier"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      {service.status !== "cancelled" &&
                        service.status !== "completed" && (
                          <button
                            onClick={() => onCancel(service)}
                            className="text-gray-600 dark:text-gray-400 hover:text-orange-600 dark:hover:text-orange-400 p-1 rounded hover:bg-orange-50 dark:hover:bg-orange-900/30 transition"
                            title="Annuler"
                          >
                            <Ban className="w-4 h-4" />
                          </button>
                        )}
                      <select
                        value={service.status}
                        onChange={(e: any) =>
                          onUpdateStatus(
                            service,
                            e.target.value as ServiceStatus,
                          )
                        }
                        className="text-xs border border-gray-300 dark:border-slate-600 rounded p-1 hover:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100"
                      >
                        <option value="published">Publié</option>
                        <option value="assigned">Assigné</option>
                        <option value="in_progress">En cours</option>
                        <option value="completed">Terminé</option>
                        <option value="cancelled">Annulé</option>
                        <option value="disputed">Litige</option>
                      </select>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Composant de pagination
const Pagination = ({
  currentPage,
  totalPages,
  totalItems,
  perPage,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  perPage: number;
  onPageChange: (page: number) => void;
}) => {
  const start = (currentPage - 1) * perPage + 1;
  const end = Math.min(currentPage * perPage, totalItems);

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-4 mt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border border-gray-200 dark:border-slate-700">
      <div className="text-sm text-gray-700 dark:text-gray-400">
        Affichage de{" "}
        <span className="font-medium text-gray-900 dark:text-gray-100">
          {start}
        </span>{" "}
        à{" "}
        <span className="font-medium text-gray-900 dark:text-gray-100">
          {end}
        </span>{" "}
        sur{" "}
        <span className="font-medium text-gray-900 dark:text-gray-100">
          {totalItems}
        </span>{" "}
        résultats
      </div>
      <div className="flex space-x-2">
        <button
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          className="p-2 border border-gray-300 dark:border-slate-600 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition text-gray-600 dark:text-gray-400"
        >
          <ChevronsLeft className="w-4 h-4" />
        </button>
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-2 border border-gray-300 dark:border-slate-600 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition text-gray-600 dark:text-gray-400"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <span className="px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-medium">
          {currentPage} / {totalPages}
        </span>
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-2 border border-gray-300 dark:border-slate-600 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition text-gray-600 dark:text-gray-400"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
        <button
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          className="p-2 border border-gray-300 dark:border-slate-600 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition text-gray-600 dark:text-gray-400"
        >
          <ChevronsRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

// Modal d'annulation
const CancelModal = ({
  isOpen,
  onClose,
  service,
  onConfirm,
}: {
  isOpen: boolean;
  onClose: () => void;
  service: Service | null;
  onConfirm: (reason: string, notify: boolean) => void;
}) => {
  const [reason, setReason] = useState("");
  const [notify, setNotify] = useState(true);
  const [error, setError] = useState("");

  if (!isOpen || !service) return null;

  const handleSubmit = () => {
    if (!reason.trim()) {
      setError("La raison est requise");
      return;
    }
    onConfirm(reason, notify);
    setReason("");
    setNotify(true);
    setError("");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl max-w-md w-full p-6 border border-gray-200 dark:border-slate-700">
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
          Annuler le service
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Vous êtes sur le point d'annuler le service{" "}
          <span className="font-medium text-gray-900 dark:text-gray-100">
            {service?.title}
          </span>
        </p>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Raison de l'annulation *
          </label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100"
            placeholder="Expliquez la raison de l'annulation..."
          />
          {error && (
            <p className="text-red-600 dark:text-red-400 text-sm mt-1">
              {error}
            </p>
          )}
        </div>

        <div className="mb-6">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={notify}
              onChange={(e) => setNotify(e.target.checked)}
              className="rounded border-gray-300 dark:border-gray-600 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 dark:bg-slate-700"
            />
            <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
              Notifier les utilisateurs concernés
            </span>
          </label>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-300 transition"
          >
            Annuler
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition"
          >
            Confirmer l'annulation
          </button>
        </div>
      </div>
    </div>
  );
};

// Page principale
export default function ServicesPage() {
  const router = useRouter();

  // États
  const [loading, setLoading] = useState(true);
  const [services, setServices] = useState<Service[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    per_page: 10,
    total_pages: 1,
  });
  const [filters, setFilters] = useState<ServiceFilters>({
    page: 1,
    per_page: 10,
    sort_by: "created_at",
    sort_order: "desc",
  });
  const [cancelModal, setCancelModal] = useState<{
    isOpen: boolean;
    service: Service | null;
  }>({
    isOpen: false,
    service: null,
  });

  // Charger les données
  const loadServices = async () => {
    try {
      setLoading(true);
      // Utiliser les mock data pour l'instant
      const mockResponse = {
        items: mockServices.list as Service[],
        total: mockServices.list.length,
        page: filters.page || 1,
        per_page: filters.per_page || 10,
        total_pages: Math.ceil(
          mockServices.list.length / (filters.per_page || 10),
        ),
      };
      setServices(mockResponse.items);
      setPagination(mockResponse);

      // Charger les stats
      setStats(mockServices.stats);
    } catch (error) {
      console.error("Erreur chargement services:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadServices();
  }, [filters.page, filters.per_page, filters.sort_by, filters.sort_order]);

  // Gestionnaires d'événements
  const handleFilterChange = (newFilters: ServiceFilters) => {
    setFilters({ ...filters, ...newFilters, page: 1 });
  };

  const handleSearch = () => {
    loadServices();
  };

  const handleSort = (field: string) => {
    const order =
      filters.sort_by === field && filters.sort_order === "asc"
        ? "desc"
        : "asc";
    setFilters({ ...filters, sort_by: field, sort_order: order });
  };

  const handlePageChange = (page: number) => {
    setFilters({ ...filters, page });
  };

  const handleViewService = (service: Service) => {
    router.push(`/dashboard/admin/services/${service.id}`);
  };

  const handleUpdateStatus = async (
    service: Service,
    newStatus: ServiceStatus,
  ) => {
    if (service.status === newStatus) return;

    if (newStatus === "cancelled") {
      setCancelModal({ isOpen: true, service });
      return;
    }

    if (
      confirm(
        `Changer le statut du service "${service.title}" en ${newStatus} ?`,
      )
    ) {
      try {
        await updateServiceStatus(service.id, newStatus);
        loadServices();
      } catch (error) {
        console.error("Erreur changement statut:", error);
      }
    }
  };

  const handleCancel = async (reason: string, notify: boolean) => {
    if (!cancelModal.service) return;
    try {
      await cancelService(cancelModal.service.id, reason, notify);
      loadServices();
    } catch (error) {
      console.error("Erreur annulation:", error);
    }
  };

  const handleExport = () => {
    // Logique d'export CSV
    const csv = services
      .map(
        (s) =>
          `${s.id},${s.title},${s.client.name},${s.freelancer?.name || "Non assigné"},${s.category},${s.status},${new Date(s.date).toLocaleDateString()},${s.budget}`,
      )
      .join("\n");

    const blob = new Blob(
      [`ID,Titre,Client,Freelancer,Catégorie,Statut,Date,Budget\n${csv}`],
      {
        type: "text/csv",
      },
    );
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `services_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-slate-950">
      <div className="container mx-auto">
        {/* En-tête */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-100 flex items-center">
            <Briefcase className="w-6 h-6 mr-2 text-blue-400" />
            Gestion des services
          </h1>
          <p className="text-gray-400 mt-1">
            Gérez tous les services et missions de la plateforme
          </p>
        </div>

        {/* Statistiques */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-4 border border-gray-200 dark:border-slate-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Total services
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stats.total}
                  </p>
                </div>
                <Briefcase className="w-8 h-8 text-blue-500 opacity-50 dark:opacity-30" />
              </div>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-4 border border-gray-200 dark:border-slate-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    En cours
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stats.by_status?.in_progress || 0}
                  </p>
                </div>
                <Clock className="w-8 h-8 text-yellow-500 opacity-50 dark:opacity-30" />
              </div>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-4 border border-gray-200 dark:border-slate-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Chiffre d'affaires
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {formatCurrency(stats.total_revenue || 0)}
                  </p>
                </div>
                <DollarSign className="w-8 h-8 text-green-500 opacity-50 dark:opacity-30" />
              </div>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-4 border border-gray-200 dark:border-slate-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Taux de complétion
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stats.completion_rate || 0}%
                  </p>
                </div>
                <CheckCircle className="w-8 h-8 text-purple-500 opacity-50 dark:opacity-30" />
              </div>
            </div>
          </div>
        )}

        {/* Actions rapides */}
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-4 mb-6 flex flex-col sm:flex-row justify-between items-center gap-4 border border-gray-200 dark:border-slate-700">
          <div className="flex space-x-2">
            <button
              onClick={loadServices}
              className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 border border-gray-300 dark:border-slate-600 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 flex items-center transition"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Actualiser
            </button>
            <button
              onClick={handleExport}
              className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 border border-gray-300 dark:border-slate-600 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 flex items-center transition"
            >
              <Download className="w-4 h-4 mr-2" />
              Exporter CSV
            </button>
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Total:{" "}
            <span className="font-medium text-gray-700 dark:text-gray-300">
              {pagination.total}
            </span>{" "}
            services
          </div>
        </div>

        {/* Filtres */}
        <ServiceFilters
          filters={filters}
          onFilterChange={handleFilterChange}
          onSearch={handleSearch}
        />

        {/* Tableau */}
        <ServiceTable
          services={services}
          onSort={handleSort}
          sortBy={filters.sort_by || "created_at"}
          sortOrder={filters.sort_order || "desc"}
          onView={handleViewService}
          onUpdateStatus={handleUpdateStatus}
          onCancel={(service) => setCancelModal({ isOpen: true, service })}
          loading={loading}
        />

        {/* Pagination */}
        <Pagination
          currentPage={pagination.page}
          totalPages={pagination.total_pages}
          totalItems={pagination.total}
          perPage={pagination.per_page}
          onPageChange={handlePageChange}
        />
      </div>

      {/* Modal d'annulation */}
      <CancelModal
        isOpen={cancelModal.isOpen}
        onClose={() => setCancelModal({ isOpen: false, service: null })}
        service={cancelModal.service}
        onConfirm={handleCancel}
      />
    </div>
  );
}
