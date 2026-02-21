"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Activity,
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
  ArrowUp,
  ArrowDown,
  User,
  Briefcase,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Info,
  Shield,
  DollarSign,
  MessageSquare,
  Scale,
  Settings,
  LogIn,
  LogOut,
  UserPlus,
  UserMinus,
  Edit,
  Trash2,
  Download,
  FileText,
  Mail,
  Phone,
  Globe,
  Server,
  Database,
  Lock,
  Unlock,
  CreditCard,
  Home,
  HelpCircle,
  MapPin,
} from "lucide-react";

// ==================== TYPES ====================

interface ActivityLog {
  id: number;
  user_id: number;
  user_name: string;
  user_email: string;
  user_role: "client" | "freelancer" | "admin";
  user_avatar?: string;
  action: string;
  category:
    | "auth"
    | "user"
    | "service"
    | "payment"
    | "dispute"
    | "message"
    | "admin"
    | "system";
  description: string;
  details?: Record<string, any>;
  ip_address?: string;
  user_agent?: string;
  location?: string;
  status: "success" | "warning" | "error" | "info";
  created_at: string;
  resource_id?: number;
  resource_type?: string;
}

interface ActivityFilters {
  page?: number;
  per_page?: number;
  search?: string;
  user_id?: number;
  category?: string;
  status?: string;
  date_from?: string;
  date_to?: string;
  sort_by?: string;
  sort_order?: "asc" | "desc";
}

interface ActivityStats {
  total: number;
  today: number;
  this_week: number;
  this_month: number;
  by_category: Record<string, number>;
  by_status: Record<string, number>;
  top_users: Array<{ user_id: number; user_name: string; count: number }>;
}

// ==================== COMPOSANTS ====================

const StatsCard = ({
  title,
  value,
  subValue,
  icon: Icon,
  color,
}: {
  title: string;
  value: number | string;
  subValue?: string;
  icon: any;
  color: string;
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
  </div>
);

const ActivityFilters = ({
  filters,
  onFilterChange,
  onSearch,
  users,
}: {
  filters: ActivityFilters;
  onFilterChange: (filters: ActivityFilters) => void;
  onSearch: () => void;
  users: Array<{ id: number; name: string; email: string }>;
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
              placeholder="Action, description, email..."
              className="pl-10 w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100"
            />
          </div>
        </div>

        {/* Filtre par utilisateur */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Utilisateur
          </label>
          <select
            value={filters.user_id || ""}
            onChange={(e) =>
              onFilterChange({
                ...filters,
                user_id: e.target.value ? Number(e.target.value) : undefined,
              })
            }
            className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100"
          >
            <option value="">Tous les utilisateurs</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name} ({user.email})
              </option>
            ))}
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
            <option value="auth">Authentification</option>
            <option value="user">Utilisateurs</option>
            <option value="service">Services</option>
            <option value="payment">Paiements</option>
            <option value="dispute">Litiges</option>
            <option value="message">Messages</option>
            <option value="admin">Administration</option>
            <option value="system">Système</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
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
            <option value="success">Succès</option>
            <option value="warning">Avertissement</option>
            <option value="error">Erreur</option>
            <option value="info">Information</option>
          </select>
        </div>

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

const ActivityTable = ({
  activities,
  onSort,
  sortBy,
  sortOrder,
  onViewDetails,
  loading,
}: {
  activities: ActivityLog[];
  onSort: (field: string) => void;
  sortBy: string;
  sortOrder: "asc" | "desc";
  onViewDetails: (activity: ActivityLog) => void;
  loading: boolean;
}) => {
  const getCategoryIcon = (category: string) => {
    const icons: Record<string, any> = {
      auth: LogIn,
      user: User,
      service: Briefcase,
      payment: DollarSign,
      dispute: Scale,
      message: MessageSquare,
      admin: Settings,
      system: Server,
    };
    const Icon = icons[category] || Activity;
    return <Icon className="w-4 h-4" />;
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      auth: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
      user: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
      service:
        "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
      payment:
        "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
      dispute: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
      message:
        "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400",
      admin: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400",
      system:
        "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400",
    };
    return (
      colors[category] ||
      "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400"
    );
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "warning":
        return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      case "error":
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Info className="w-4 h-4 text-blue-500" />;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffMinutes = Math.floor(diffTime / (1000 * 60));
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffMinutes < 1) return "À l'instant";
    if (diffMinutes < 60) return `Il y a ${diffMinutes} min`;
    if (diffHours < 24) return `Il y a ${diffHours} h`;
    if (diffDays === 1) return "Hier";
    if (diffDays < 7) return `Il y a ${diffDays} jours`;
    return date.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
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

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20 bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
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
                onClick={() => onSort("created_at")}
              >
                <div className="flex items-center">
                  Date/Heure
                  <SortIcon field="created_at" />
                </div>
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-600 transition"
                onClick={() => onSort("user_name")}
              >
                <div className="flex items-center">
                  Utilisateur
                  <SortIcon field="user_name" />
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
                onClick={() => onSort("action")}
              >
                <div className="flex items-center">
                  Action
                  <SortIcon field="action" />
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Description
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
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-slate-800 divide-y divide-gray-200 dark:divide-slate-700">
            {activities.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="px-6 py-12 text-center text-gray-500 dark:text-gray-400"
                >
                  <Activity className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <p>Aucune activité trouvée</p>
                </td>
              </tr>
            ) : (
              activities.map((activity) => (
                <tr
                  key={activity.id}
                  className="hover:bg-gray-50 dark:hover:bg-slate-700/50 transition"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-gray-100">
                      {formatDate(activity.created_at)}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(activity.created_at).toLocaleTimeString(
                        "fr-FR",
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {activity.user_avatar ? (
                        <img
                          src={activity.user_avatar}
                          alt={activity.user_name}
                          className="w-8 h-8 rounded-full mr-3 object-cover"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-slate-700 flex items-center justify-center mr-3">
                          <User className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                        </div>
                      )}
                      <div>
                        <Link
                          href={`/admin/users/${activity.user_id}`}
                          className="text-sm font-medium text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400"
                        >
                          {activity.user_name}
                        </Link>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {activity.user_role}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(activity.category)}`}
                    >
                      {getCategoryIcon(activity.category)}
                      <span className="ml-1">{activity.category}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {activity.action}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-600 dark:text-gray-400 max-w-xs truncate">
                      {activity.description}
                    </div>
                    {activity.resource_id && (
                      <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                        {activity.resource_type} #{activity.resource_id}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {getStatusIcon(activity.status)}
                      <span className="ml-1 text-sm text-gray-600 dark:text-gray-400">
                        {activity.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => onViewDetails(activity)}
                      className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 p-1 rounded hover:bg-blue-50 dark:hover:bg-blue-900/30 transition"
                      title="Voir détails"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
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
        activités
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

const ActivityDetailsModal = ({
  isOpen,
  onClose,
  activity,
}: {
  isOpen: boolean;
  onClose: () => void;
  activity: ActivityLog | null;
}) => {
  if (!isOpen || !activity) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl max-w-2xl w-full p-6 border border-gray-200 dark:border-slate-700">
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
          Détails de l'activité
        </h3>

        <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
          {/* En-tête avec statut */}
          <div className="bg-gray-50 dark:bg-slate-700/50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                {activity.status === "success" && (
                  <CheckCircle className="w-6 h-6 text-green-500 mr-2" />
                )}
                {activity.status === "warning" && (
                  <AlertCircle className="w-6 h-6 text-yellow-500 mr-2" />
                )}
                {activity.status === "error" && (
                  <XCircle className="w-6 h-6 text-red-500 mr-2" />
                )}
                {activity.status === "info" && (
                  <Info className="w-6 h-6 text-blue-500 mr-2" />
                )}
                <div>
                  <p className="text-lg font-medium text-gray-900 dark:text-gray-100">
                    {activity.action}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {activity.category} • {activity.status}
                  </p>
                </div>
              </div>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                ID: {activity.id}
              </span>
            </div>
          </div>

          {/* Description */}
          <div className="bg-gray-50 dark:bg-slate-700/50 rounded-lg p-4">
            <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">
              Description
            </h4>
            <p className="text-gray-900 dark:text-gray-100">
              {activity.description}
            </p>
          </div>

          {/* Utilisateur */}
          <div className="bg-gray-50 dark:bg-slate-700/50 rounded-lg p-4">
            <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-3">
              Utilisateur
            </h4>
            <div className="flex items-center">
              {activity.user_avatar ? (
                <img
                  src={activity.user_avatar}
                  alt={activity.user_name}
                  className="w-12 h-12 rounded-full mr-3 object-cover"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-slate-700 flex items-center justify-center mr-3">
                  <User className="w-6 h-6 text-gray-500 dark:text-gray-400" />
                </div>
              )}
              <div>
                <Link
                  href={`/admin/users/${activity.user_id}`}
                  className="text-lg font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  {activity.user_name}
                </Link>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {activity.user_email} • {activity.user_role}
                </p>
              </div>
            </div>
          </div>

          {/* Détails supplémentaires */}
          {activity.details && Object.keys(activity.details).length > 0 && (
            <div className="bg-gray-50 dark:bg-slate-700/50 rounded-lg p-4">
              <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-3">
                Détails supplémentaires
              </h4>
              <div className="space-y-2">
                {Object.entries(activity.details).map(([key, value]) => (
                  <div key={key} className="flex">
                    <span className="w-1/3 text-sm text-gray-500 dark:text-gray-400">
                      {key}:
                    </span>
                    <span className="w-2/3 text-sm text-gray-900 dark:text-gray-100">
                      {typeof value === "object"
                        ? JSON.stringify(value)
                        : String(value)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Informations techniques */}
          <div className="bg-gray-50 dark:bg-slate-700/50 rounded-lg p-4">
            <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-3">
              Informations techniques
            </h4>
            <div className="space-y-2">
              {activity.ip_address && (
                <div className="flex items-center">
                  <Globe className="w-4 h-4 text-gray-400 mr-2" />
                  <span className="text-sm text-gray-900 dark:text-gray-100">
                    IP: {activity.ip_address}
                  </span>
                </div>
              )}
              {activity.location && (
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 text-gray-400 mr-2" />
                  <span className="text-sm text-gray-900 dark:text-gray-100">
                    Localisation: {activity.location}
                  </span>
                </div>
              )}
              {activity.user_agent && (
                <div className="flex items-start">
                  <HelpCircle className="w-4 h-4 text-gray-400 mr-2 mt-0.5" />
                  <span className="text-sm text-gray-900 dark:text-gray-100">
                    {activity.user_agent}
                  </span>
                </div>
              )}
              <div className="flex items-center">
                <Clock className="w-4 h-4 text-gray-400 mr-2" />
                <span className="text-sm text-gray-900 dark:text-gray-100">
                  Date: {formatDate(activity.created_at)}
                </span>
              </div>
            </div>
          </div>

          {/* Ressource liée */}
          {activity.resource_id && activity.resource_type && (
            <div className="bg-gray-50 dark:bg-slate-700/50 rounded-lg p-4">
              <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-3">
                Ressource liée
              </h4>
              <Link
                href={`/dashboard/admin/${activity.resource_type}s/${activity.resource_id}`}
                className="inline-flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                <Eye className="w-4 h-4 mr-2" />
                Voir {activity.resource_type} #{activity.resource_id}
              </Link>
            </div>
          )}
        </div>

        <div className="flex justify-end mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};

// ==================== PAGE PRINCIPALE ====================

export default function ActivityLogsPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [stats, setStats] = useState<ActivityStats | null>(null);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    per_page: 20,
    total_pages: 1,
  });
  const [filters, setFilters] = useState<ActivityFilters>({
    page: 1,
    per_page: 20,
    sort_by: "created_at",
    sort_order: "desc",
  });
  const [selectedActivity, setSelectedActivity] = useState<ActivityLog | null>(
    null,
  );
  const [detailsModal, setDetailsModal] = useState(false);

  // Liste des utilisateurs pour le filtre
  const [users] = useState([
    { id: 1, name: "Jean Dupont", email: "jean.dupont@email.com" },
    { id: 2, name: "Marie Martin", email: "marie.martin@email.com" },
    { id: 3, name: "Pierre Durand", email: "pierre.durand@email.com" },
  ]);

  // Données mockées
  useEffect(() => {
    const mockActivities: ActivityLog[] = [
      {
        id: 1,
        user_id: 1,
        user_name: "Jean Dupont",
        user_email: "jean.dupont@email.com",
        user_role: "admin",
        action: "Connexion réussie",
        category: "auth",
        description: "Connexion à l'interface d'administration",
        ip_address: "192.168.1.100",
        user_agent:
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0",
        location: "Paris, France",
        status: "success",
        created_at: "2024-03-15T09:30:00Z",
      },
      {
        id: 2,
        user_id: 2,
        user_name: "Marie Martin",
        user_email: "marie.martin@email.com",
        user_role: "freelancer",
        action: "Service créé",
        category: "service",
        description: "Création d'un nouveau service de développement web",
        details: {
          service_id: 10001,
          service_title: "Développement site e-commerce",
          category: "Développement",
          amount: 2500,
        },
        resource_id: 10001,
        resource_type: "service",
        ip_address: "192.168.1.101",
        status: "success",
        created_at: "2024-03-15T10:15:00Z",
      },
      {
        id: 3,
        user_id: 3,
        user_name: "Pierre Durand",
        user_email: "pierre.durand@email.com",
        user_role: "client",
        action: "Tentative de paiement échouée",
        category: "payment",
        description: "Échec du paiement par carte bancaire",
        details: {
          amount: 450,
          payment_method: "card",
          error: "Fonds insuffisants",
        },
        ip_address: "192.168.1.102",
        status: "error",
        created_at: "2024-03-15T11:45:00Z",
      },
      {
        id: 4,
        user_id: 1,
        user_name: "Jean Dupont",
        user_email: "jean.dupont@email.com",
        user_role: "admin",
        action: "Litige résolu",
        category: "dispute",
        description: "Résolution du litige #45 en faveur du client",
        details: {
          dispute_id: 45,
          service_id: 102,
          resolution: "Remboursement partiel de 50%",
        },
        resource_id: 45,
        resource_type: "dispute",
        ip_address: "192.168.1.100",
        status: "success",
        created_at: "2024-03-15T14:20:00Z",
      },
      {
        id: 5,
        user_id: 2,
        user_name: "Marie Martin",
        user_email: "marie.martin@email.com",
        user_role: "freelancer",
        action: "Message envoyé",
        category: "message",
        description: "Nouveau message dans la conversation #78",
        details: {
          conversation_id: 78,
          recipient: "Pierre Durand",
        },
        ip_address: "192.168.1.101",
        status: "info",
        created_at: "2024-03-15T15:30:00Z",
      },
      {
        id: 6,
        user_id: 3,
        user_name: "Pierre Durand",
        user_email: "pierre.durand@email.com",
        user_role: "client",
        action: "Service évalué",
        category: "service",
        description: "Évaluation du service #10001 avec note 5/5",
        details: {
          service_id: 10001,
          rating: 5,
          comment: "Excellent travail !",
        },
        resource_id: 10001,
        resource_type: "service",
        ip_address: "192.168.1.102",
        status: "success",
        created_at: "2024-03-15T16:45:00Z",
      },
    ];

    const mockStats: ActivityStats = {
      total: 1250,
      today: 45,
      this_week: 280,
      this_month: 950,
      by_category: {
        auth: 320,
        user: 180,
        service: 250,
        payment: 190,
        dispute: 85,
        message: 420,
        admin: 150,
        system: 55,
      },
      by_status: {
        success: 980,
        warning: 120,
        error: 45,
        info: 105,
      },
      top_users: [
        { user_id: 1, user_name: "Jean Dupont", count: 350 },
        { user_id: 2, user_name: "Marie Martin", count: 280 },
        { user_id: 3, user_name: "Pierre Durand", count: 190 },
      ],
    };

    setActivities(mockActivities);
    setStats(mockStats);
    setPagination({
      total: mockActivities.length,
      page: 1,
      per_page: 20,
      total_pages: 1,
    });
    setLoading(false);
  }, []);

  const handleFilterChange = (newFilters: ActivityFilters) => {
    setFilters({ ...filters, ...newFilters, page: 1 });
  };

  const handleSearch = () => {
    // Recharger avec les filtres
    setLoading(true);
    setTimeout(() => setLoading(false), 500);
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

  const handleExport = () => {
    // Exporter les logs en CSV
    const csv = activities
      .map(
        (a) =>
          `${a.id},${a.created_at},${a.user_name},${a.category},${a.action},${a.status}`,
      )
      .join("\n");

    const blob = new Blob(
      [`ID,Date,Utilisateur,Catégorie,Action,Statut\n${csv}`],
      {
        type: "text/csv",
      },
    );
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `activites-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  return (
    <div className="min-h-screen dark:bg-slate-950">
      <div className="container mx-auto">
        {/* En-tête */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-100 flex items-center">
              <Activity className="w-6 h-6 mr-2 text-blue-400" />
              Journal d'activités
            </h1>
            <p className="text-gray-400 mt-1">
              Consultez l'historique complet des actions sur la plateforme
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleExport}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center transition"
            >
              <Download className="w-4 h-4 mr-2" />
              Exporter CSV
            </button>
          </div>
        </div>

        {/* Statistiques */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <StatsCard
              title="Aujourd'hui"
              value={stats.today}
              subValue={`${stats.this_week} cette semaine`}
              icon={Activity}
              color="bg-blue-500"
            />
            <StatsCard
              title="Ce mois"
              value={stats.this_month}
              subValue={`${stats.total} au total`}
              icon={Calendar}
              color="bg-green-500"
            />
            <StatsCard
              title="Messages"
              value={stats.by_category.message}
              icon={MessageSquare}
              color="bg-purple-500"
            />
            <StatsCard
              title="Erreurs"
              value={stats.by_status.error}
              icon={XCircle}
              color="bg-red-500"
            />
          </div>
        )}

        {/* Graphiques simplifiés */}
        {stats && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Répartition par catégorie */}
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-slate-700">
              <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
                Répartition par catégorie
              </h3>
              <div className="space-y-3">
                {Object.entries(stats.by_category).map(([cat, count]) => (
                  <div key={cat}>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-gray-600 dark:text-gray-400">
                        {cat}
                      </span>
                      <span className="text-gray-900 dark:text-gray-100 font-medium">
                        {count}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2">
                      <div
                        className="h-2 rounded-full bg-blue-500"
                        style={{ width: `${(count / stats.total) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top utilisateurs */}
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-slate-700">
              <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
                Utilisateurs les plus actifs
              </h3>
              <div className="space-y-4">
                {stats.top_users.map((user, index) => (
                  <div key={user.user_id} className="flex items-center">
                    <span className="w-6 text-lg font-medium text-gray-400">
                      #{index + 1}
                    </span>
                    <Link
                      href={`/admin/users/${user.user_id}`}
                      className="flex-1 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                      {user.user_name}
                    </Link>
                    <span className="font-medium text-gray-900 dark:text-gray-100">
                      {user.count} actions
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Filtres */}
        <ActivityFilters
          filters={filters}
          onFilterChange={handleFilterChange}
          onSearch={handleSearch}
          users={users}
        />

        {/* Tableau des activités */}
        <ActivityTable
          activities={activities}
          onSort={handleSort}
          sortBy={filters.sort_by || "created_at"}
          sortOrder={filters.sort_order || "desc"}
          onViewDetails={(activity) => {
            setSelectedActivity(activity);
            setDetailsModal(true);
          }}
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

      {/* Modal des détails */}
      <ActivityDetailsModal
        isOpen={detailsModal}
        onClose={() => {
          setDetailsModal(false);
          setSelectedActivity(null);
        }}
        activity={selectedActivity}
      />

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #1e293b;
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #475569;
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #64748b;
        }
      `}</style>
    </div>
  );
}
