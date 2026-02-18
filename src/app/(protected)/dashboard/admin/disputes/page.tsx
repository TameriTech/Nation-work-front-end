"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Scale,
  AlertCircle,
  Clock,
  CheckCircle,
  XCircle,
  ArrowUp,
  ArrowDown,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Eye,
  RefreshCw,
  Loader2,
  ArrowUpDown,
  User,
  Briefcase,
  Calendar,
  Tag,
  Flag,
  MoreHorizontal,
  Shield,
  Zap,
  AlertTriangle,
  Info,
} from "lucide-react";

import {
  getDisputes,
  getDisputeStats,
  assignDispute,
} from "@/app/services/disputes.service";
import type {
  Dispute,
  DisputeFilters,
  PaginatedResponse,
  DisputeStats,
} from "@/app/types/admin";
import { disputes as mockDisputes } from "@/data/admin-mock-data";

// Composant de carte de statistiques
const StatsCard = ({
  title,
  value,
  subValue,
  icon: Icon,
  color,
  trend,
}: {
  title: string;
  value: number | string;
  subValue?: string;
  icon: any;
  color: string;
  trend?: number;
}) => (
  <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-slate-700">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{title}</p>
        <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">
          {value}
        </p>
        {subValue && (
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {subValue}
          </p>
        )}
      </div>
      <div
        className={`w-12 h-12 ${color} rounded-lg flex items-center justify-center text-white shadow-lg`}
      >
        <Icon className="w-6 h-6" />
      </div>
    </div>
    {trend !== undefined && (
      <div className="mt-4 flex items-center text-sm">
        {trend >= 0 ? (
          <ArrowUp className="w-4 h-4 text-red-500 dark:text-red-400 mr-1" />
        ) : (
          <ArrowDown className="w-4 h-4 text-green-500 dark:text-green-400 mr-1" />
        )}
        <span
          className={
            trend >= 0
              ? "text-red-600 dark:text-red-400"
              : "text-green-600 dark:text-green-400"
          }
        >
          {Math.abs(trend)}% par rapport au mois dernier
        </span>
      </div>
    )}
  </div>
);

// Composant de filtre
const DisputeFilters = ({
  filters,
  onFilterChange,
  onSearch,
}: {
  filters: DisputeFilters;
  onFilterChange: (filters: DisputeFilters) => void;
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
              placeholder="ID litige, service, client, freelancer..."
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
            <option value="open">Ouvert</option>
            <option value="in_progress">En cours</option>
            <option value="resolved">Résolu</option>
            <option value="dismissed">Rejeté</option>
            <option value="escalated">Escaladé</option>
          </select>
        </div>

        {/* Filtre par priorité */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Priorité
          </label>
          <select
            value={filters.priority || ""}
            onChange={(e) =>
              onFilterChange({
                ...filters,
                priority: e.target.value || undefined,
              })
            }
            className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100"
          >
            <option value="">Toutes les priorités</option>
            <option value="low">Basse</option>
            <option value="normal">Normale</option>
            <option value="high">Haute</option>
            <option value="urgent">Urgente</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        {/* Date début */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Date début
          </label>
          <input
            type="date"
            value={filters.date_from || ""}
            onChange={(e) =>
              onFilterChange({
                ...filters,
                date_from: e.target.value || undefined,
              })
            }
            className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100"
          />
        </div>

        {/* Date fin */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Date fin
          </label>
          <input
            type="date"
            value={filters.date_to || ""}
            onChange={(e) =>
              onFilterChange({
                ...filters,
                date_to: e.target.value || undefined,
              })
            }
            className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100"
          />
        </div>

        {/* Ouvert par */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Ouvert par
          </label>
          <select
            value={filters.opened_by || ""}
            onChange={(e) =>
              onFilterChange({
                ...filters,
                opened_by: e.target.value || undefined,
              })
            }
            className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100"
          >
            <option value="">Tous</option>
            <option value="client">Client</option>
            <option value="freelancer">Freelancer</option>
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

// Composant de tableau
const DisputeTable = ({
  disputes,
  onSort,
  sortBy,
  sortOrder,
  onView,
  onAssign,
  loading,
}: {
  disputes: Dispute[];
  onSort: (field: string) => void;
  sortBy: string;
  sortOrder: "asc" | "desc";
  onView: (dispute: Dispute) => void;
  onAssign: (dispute: Dispute) => void;
  loading: boolean;
}) => {
  const getPriorityBadge = (priority: string) => {
    const badges: Record<string, { color: string; icon: any; label: string }> =
      {
        urgent: {
          color:
            "bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800",
          icon: AlertTriangle,
          label: "Urgente",
        },
        high: {
          color:
            "bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-800",
          icon: AlertCircle,
          label: "Haute",
        },
        normal: {
          color:
            "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800",
          icon: Info,
          label: "Normale",
        },
        low: {
          color:
            "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800",
          icon: Clock,
          label: "Basse",
        },
      };
    const badge = badges[priority] || badges.normal;
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

  const getStatusBadge = (status: string) => {
    const badges: Record<string, { color: string; icon: any; label: string }> =
      {
        open: {
          color:
            "bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800",
          icon: AlertCircle,
          label: "Ouvert",
        },
        in_progress: {
          color:
            "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800",
          icon: Clock,
          label: "En cours",
        },
        resolved: {
          color:
            "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800",
          icon: CheckCircle,
          label: "Résolu",
        },
        dismissed: {
          color:
            "bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700",
          icon: XCircle,
          label: "Rejeté",
        },
        escalated: {
          color:
            "bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-800",
          icon: Shield,
          label: "Escaladé",
        },
      };
    const badge = badges[status] || badges.open;
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return "Aujourd'hui";
    } else if (diffDays === 1) {
      return "Hier";
    } else if (diffDays < 7) {
      return `Il y a ${diffDays} jours`;
    } else {
      return date.toLocaleDateString("fr-FR");
    }
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
                onClick={() => onSort("id")}
              >
                <div className="flex items-center">
                  ID
                  <SortIcon field="id" />
                </div>
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-600 transition"
                onClick={() => onSort("service")}
              >
                <div className="flex items-center">
                  Service
                  <SortIcon field="service" />
                </div>
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-600 transition"
                onClick={() => onSort("client")}
              >
                <div className="flex items-center">
                  Client
                  <SortIcon field="client" />
                </div>
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-600 transition"
                onClick={() => onSort("freelancer")}
              >
                <div className="flex items-center">
                  Freelancer
                  <SortIcon field="freelancer" />
                </div>
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-600 transition"
                onClick={() => onSort("priority")}
              >
                <div className="flex items-center">
                  Priorité
                  <SortIcon field="priority" />
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
                onClick={() => onSort("created_at")}
              >
                <div className="flex items-center">
                  Ouvert le
                  <SortIcon field="created_at" />
                </div>
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-600 transition"
                onClick={() => onSort("assigned_to")}
              >
                <div className="flex items-center">
                  Assigné à
                  <SortIcon field="assigned_to" />
                </div>
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-slate-800 divide-y divide-gray-200 dark:divide-slate-700">
            {disputes.length === 0 ? (
              <tr>
                <td
                  colSpan={9}
                  className="px-6 py-12 text-center text-gray-500 dark:text-gray-400"
                >
                  Aucun litige trouvé
                </td>
              </tr>
            ) : (
              disputes.map((dispute) => (
                <tr
                  key={dispute.id}
                  className="hover:bg-gray-50 dark:hover:bg-slate-700/50 transition"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {dispute.id}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-gray-100">
                      {dispute.service.title}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      #{dispute.service.id}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {dispute.client.avatar ? (
                        <img
                          src={dispute.client.avatar}
                          alt={dispute.client.name}
                          className="w-6 h-6 rounded-full mr-2 object-cover"
                        />
                      ) : (
                        <div className="w-6 h-6 rounded-full bg-gray-200 dark:bg-slate-700 flex items-center justify-center mr-2">
                          <User className="w-3 h-3 text-gray-500 dark:text-gray-400" />
                        </div>
                      )}
                      <span className="text-sm text-gray-900 dark:text-gray-100">
                        {dispute.client.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {dispute.freelancer.avatar ? (
                        <img
                          src={dispute.freelancer.avatar}
                          alt={dispute.freelancer.name}
                          className="w-6 h-6 rounded-full mr-2 object-cover"
                        />
                      ) : (
                        <div className="w-6 h-6 rounded-full bg-gray-200 dark:bg-slate-700 flex items-center justify-center mr-2">
                          <User className="w-3 h-3 text-gray-500 dark:text-gray-400" />
                        </div>
                      )}
                      <span className="text-sm text-gray-900 dark:text-gray-100">
                        {dispute.freelancer.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getPriorityBadge(dispute.priority)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(dispute.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {formatDate(dispute.created_at)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {dispute.assigned_to ? (
                      <div className="flex items-center">
                        {dispute.assigned_to.avatar ? (
                          <img
                            src={dispute.assigned_to.avatar}
                            alt={dispute.assigned_to.name}
                            className="w-6 h-6 rounded-full mr-2 object-cover"
                          />
                        ) : (
                          <div className="w-6 h-6 rounded-full bg-gray-200 dark:bg-slate-700 flex items-center justify-center mr-2">
                            <User className="w-3 h-3 text-gray-500 dark:text-gray-400" />
                          </div>
                        )}
                        <span className="text-sm text-gray-900 dark:text-gray-100">
                          {dispute.assigned_to.name}
                        </span>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-400 dark:text-gray-500">
                        Non assigné
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => onView(dispute)}
                        className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 p-1 rounded hover:bg-blue-50 dark:hover:bg-blue-900/30 transition"
                        title="Voir détails"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      {!dispute.assigned_to && (
                        <button
                          onClick={() => onAssign(dispute)}
                          className="text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 p-1 rounded hover:bg-green-50 dark:hover:bg-green-900/30 transition"
                          title="Assigner"
                        >
                          <User className="w-4 h-4" />
                        </button>
                      )}
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
      <div className="text-sm text-gray-700 dark:text-gray-300">
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

// Modal d'assignation
const AssignModal = ({
  isOpen,
  onClose,
  dispute,
  admins,
  onConfirm,
}: {
  isOpen: boolean;
  onClose: () => void;
  dispute: Dispute | null;
  admins: Array<{ id: number; name: string; avatar?: string }>;
  onConfirm: (adminId: number, notes?: string) => void;
}) => {
  const [selectedAdmin, setSelectedAdmin] = useState<number>(0);
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");

  if (!isOpen || !dispute) return null;

  const handleSubmit = () => {
    if (!selectedAdmin) {
      setError("Veuillez sélectionner un administrateur");
      return;
    }
    onConfirm(selectedAdmin, notes);
    setSelectedAdmin(0);
    setNotes("");
    setError("");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl max-w-md w-full p-6 border border-gray-200 dark:border-slate-700">
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
          Assigner le litige {dispute.id}
        </h3>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Administrateur *
          </label>
          <select
            value={selectedAdmin}
            onChange={(e) => setSelectedAdmin(Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100"
          >
            <option value={0}>Sélectionner un admin</option>
            {admins.map((admin) => (
              <option key={admin.id} value={admin.id}>
                {admin.name}
              </option>
            ))}
          </select>
          {error && (
            <p className="text-red-600 dark:text-red-400 text-sm mt-1">
              {error}
            </p>
          )}
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Notes (optionnel)
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100"
            placeholder="Instructions ou commentaires..."
          />
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
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Assigner
          </button>
        </div>
      </div>
    </div>
  );
};

// Page principale
export default function DisputesPage() {
  const router = useRouter();

  // États
  const [loading, setLoading] = useState(true);
  const [disputes, setDisputes] = useState<Dispute[]>([]);
  const [stats, setStats] = useState<DisputeStats | null>(null);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    per_page: 10,
    total_pages: 1,
  });
  const [filters, setFilters] = useState<DisputeFilters>({
    page: 1,
    per_page: 10,
    sort_by: "created_at",
    sort_order: "desc",
  });
  const [assignModal, setAssignModal] = useState<{
    isOpen: boolean;
    dispute: Dispute | null;
  }>({
    isOpen: false,
    dispute: null,
  });

  // Admins mock pour l'assignation
  const admins = [
    {
      id: 1,
      name: "Jean Martin",
      avatar: "https://randomuser.me/api/portraits/men/1.jpg",
    },
    {
      id: 2,
      name: "Anne Bernard",
      avatar: "https://randomuser.me/api/portraits/women/3.jpg",
    },
    {
      id: 3,
      name: "Paul Dubois",
      avatar: "https://randomuser.me/api/portraits/men/2.jpg",
    },
  ];

  // Charger les données
  const loadDisputes = async () => {
    try {
      setLoading(true);

      // Utiliser les mock data
      const mockResponse = {
        items: mockDisputes.list as Dispute[],
        total: mockDisputes.list.length,
        page: filters.page || 1,
        per_page: filters.per_page || 10,
        total_pages: Math.ceil(
          mockDisputes.list.length / (filters.per_page || 10),
        ),
      };
      setDisputes(mockResponse.items);
      setPagination(mockResponse);
      setStats(mockDisputes.stats as DisputeStats);
    } catch (error) {
      console.error("Erreur chargement litiges:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDisputes();
  }, [filters.page, filters.per_page, filters.sort_by, filters.sort_order]);

  // Gestionnaires d'événements
  const handleFilterChange = (newFilters: DisputeFilters) => {
    setFilters({ ...filters, ...newFilters, page: 1 });
  };

  const handleSearch = () => {
    loadDisputes();
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

  const handleViewDispute = (dispute: Dispute) => {
    router.push(`/dashboard/admin/disputes/${dispute.id}`);
  };

  const handleAssign = async (adminId: number, notes?: string) => {
    if (!assignModal.dispute) return;
    try {
      await assignDispute(assignModal.dispute.id, {
        assigned_to: adminId,
        notes,
      });
      loadDisputes();
    } catch (error) {
      console.error("Erreur assignation:", error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950">
      <div className="container mx-auto">
        {/* En-tête */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-100 flex items-center">
            <Scale className="w-6 h-6 mr-2 text-blue-400" />
            Gestion des litiges
          </h1>
          <p className="text-gray-400 mt-1">
            Gérez les conflits entre clients et freelancers
          </p>
        </div>

        {/* Cartes de statistiques */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <StatsCard
              title="Litiges ouverts"
              value={stats.open}
              subValue={`${stats.in_progress} en cours`}
              icon={AlertCircle}
              color="bg-red-500"
            />
            <StatsCard
              title="Priorité haute/urgente"
              value={stats.by_priority.high + stats.by_priority.urgent}
              subValue={`${stats.by_priority.urgent} urgents`}
              icon={AlertTriangle}
              color="bg-orange-500"
            />
            <StatsCard
              title="Résolus ce mois"
              value={stats.resolved}
              subValue={`Temps moyen: ${stats.avg_resolution_time}`}
              icon={CheckCircle}
              color="bg-green-500"
            />
            <StatsCard
              title="Total litiges"
              value={stats.total}
              subValue={`${stats.escalated} escaladés`}
              icon={Scale}
              color="bg-blue-500"
            />
          </div>
        )}

        {/* Actions rapides */}
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-4 mb-6 flex flex-col sm:flex-row justify-between items-center gap-4 border border-gray-200 dark:border-slate-700">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={loadDisputes}
              className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 border border-gray-300 dark:border-slate-600 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 flex items-center transition"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Actualiser
            </button>
          </div>
          <div className="flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400">
            <span className="flex items-center">
              <div className="w-2 h-2 rounded-full bg-red-500 mr-1"></div>
              Ouverts: {stats?.open || 0}
            </span>
            <span className="flex items-center">
              <div className="w-2 h-2 rounded-full bg-yellow-500 mr-1"></div>
              En cours: {stats?.in_progress || 0}
            </span>
            <span className="flex items-center">
              <div className="w-2 h-2 rounded-full bg-green-500 mr-1"></div>
              Résolus: {stats?.resolved || 0}
            </span>
          </div>
        </div>

        {/* Filtres */}
        <DisputeFilters
          filters={filters}
          onFilterChange={handleFilterChange}
          onSearch={handleSearch}
        />

        {/* Tableau */}
        <DisputeTable
          disputes={disputes}
          onSort={handleSort}
          sortBy={filters.sort_by || "created_at"}
          sortOrder={filters.sort_order || "desc"}
          onView={handleViewDispute}
          onAssign={(dispute) => setAssignModal({ isOpen: true, dispute })}
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

      {/* Modal d'assignation */}
      <AssignModal
        isOpen={assignModal.isOpen}
        onClose={() => setAssignModal({ isOpen: false, dispute: null })}
        dispute={assignModal.dispute}
        admins={admins}
        onConfirm={handleAssign}
      />
    </div>
  );
}
