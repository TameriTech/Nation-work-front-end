"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Users,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  MoreHorizontal,
  Eye,
  Edit,
  Ban,
  CheckCircle,
  XCircle,
  Mail,
  Shield,
  Star,
  Clock,
  Download,
  RefreshCw,
  Loader2,
  UserPlus,
  UserCheck,
  UserX,
  UserMinus,
  AlertCircle,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
} from "lucide-react";

import {
  getUsers,
  suspendUser,
  activateUser,
  deleteUser,
  changeUserRole,
} from "@/app/services/users.service";
import type { User, UserFilters, PaginatedResponse } from "@/app/types/admin";
import { users as mockUsers } from "@/data/admin-mock-data";

// Composant de filtre
const UserFilters = ({
  filters,
  onFilterChange,
  onSearch,
}: {
  filters: UserFilters;
  onFilterChange: (filters: UserFilters) => void;
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
              placeholder="Nom, email, téléphone..."
              className="pl-10 w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100"
            />
          </div>
        </div>

        {/* Filtre par rôle */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Rôle
          </label>
          <select
            value={filters.role || ""}
            onChange={(e) =>
              onFilterChange({ ...filters, role: e.target.value || undefined })
            }
            className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100"
          >
            <option value="">Tous les rôles</option>
            <option value="client">Client</option>
            <option value="freelancer">Freelancer</option>
            <option value="admin">Admin</option>
          </select>
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
            <option value="active">Actif</option>
            <option value="suspended">Suspendu</option>
            <option value="pending_verification">En attente</option>
            <option value="inactive">Inactif</option>
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
const UserTable = ({
  users,
  onSort,
  sortBy,
  sortOrder,
  onView,
  onSuspend,
  onActivate,
  onRoleChange,
  loading,
}: {
  users: User[];
  onSort: (field: string) => void;
  sortBy: string;
  sortOrder: "asc" | "desc";
  onView: (user: User) => void;
  onSuspend: (user: User) => void;
  onActivate: (user: User) => void;
  onRoleChange: (user: User, newRole: string) => void;
  loading: boolean;
}) => {
  const getStatusBadge = (status: string) => {
    const badges: Record<string, { color: string; icon: any; label: string }> =
      {
        active: {
          color:
            "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800",
          icon: UserCheck,
          label: "Actif",
        },
        suspended: {
          color:
            "bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800",
          icon: UserX,
          label: "Suspendu",
        },
        pending_verification: {
          color:
            "bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800",
          icon: AlertCircle,
          label: "En attente",
        },
        inactive: {
          color:
            "bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700",
          icon: UserMinus,
          label: "Inactif",
        },
      };
    const badge = badges[status] || badges.inactive;
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

  const getRoleBadge = (role: string) => {
    const badges: Record<string, { color: string; icon: any; label: string }> =
      {
        admin: {
          color:
            "bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-800",
          icon: Shield,
          label: "Admin",
        },
        freelancer: {
          color:
            "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800",
          icon: Star,
          label: "Freelancer",
        },
        client: {
          color:
            "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800",
          icon: UserCheck,
          label: "Client",
        },
      };
    const badge = badges[role] || badges.client;
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
                onClick={() => onSort("username")}
              >
                <div className="flex items-center">
                  Utilisateur
                  <SortIcon field="username" />
                </div>
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-600 transition"
                onClick={() => onSort("email")}
              >
                <div className="flex items-center">
                  Email
                  <SortIcon field="email" />
                </div>
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-600 transition"
                onClick={() => onSort("role")}
              >
                <div className="flex items-center">
                  Rôle
                  <SortIcon field="role" />
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
                  Inscription
                  <SortIcon field="created_at" />
                </div>
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-600 transition"
                onClick={() => onSort("last_login")}
              >
                <div className="flex items-center">
                  Dernière connexion
                  <SortIcon field="last_login" />
                </div>
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-slate-800 divide-y divide-gray-200 dark:divide-slate-700">
            {users.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="px-6 py-12 text-center text-gray-500 dark:text-gray-400"
                >
                  Aucun utilisateur trouvé
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr
                  key={user.id}
                  className="hover:bg-gray-50 dark:hover:bg-slate-700/50 transition"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        {user.avatar ? (
                          <img
                            className="h-10 w-10 rounded-full object-cover"
                            src={user.avatar}
                            alt={user.username}
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-slate-700 flex items-center justify-center">
                            <Users className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                          </div>
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {user.username}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          ID: {user.id}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-gray-100">
                      {user.email}
                    </div>
                    {user.phone && (
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {user.phone}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-wrap gap-1">
                      {getRoleBadge(user.role)}
                      {user.top_rated && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-800">
                          <Star className="w-3 h-3 mr-1 fill-current" />
                          Top
                        </span>
                      )}
                      {user.verified_badge && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Vérifié
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(user.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {new Date(user.created_at).toLocaleDateString("fr-FR")}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {user.last_login ? (
                      <>
                        {new Date(user.last_login).toLocaleDateString("fr-FR")}
                        <span className="text-xs text-gray-400 dark:text-gray-500 block">
                          {new Date(user.last_login).toLocaleTimeString(
                            "fr-FR",
                          )}
                        </span>
                      </>
                    ) : (
                      "-"
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => onView(user)}
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
                      <button
                        onClick={() => {
                          /* Envoyer email */
                        }}
                        className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 p-1 rounded hover:bg-purple-50 dark:hover:bg-purple-900/30 transition"
                        title="Envoyer un email"
                      >
                        <Mail className="w-4 h-4" />
                      </button>
                      {user.status === "active" ? (
                        <button
                          onClick={() => onSuspend(user)}
                          className="text-gray-600 dark:text-gray-400 hover:text-orange-600 dark:hover:text-orange-400 p-1 rounded hover:bg-orange-50 dark:hover:bg-orange-900/30 transition"
                          title="Suspendre"
                        >
                          <Ban className="w-4 h-4" />
                        </button>
                      ) : user.status === "suspended" ? (
                        <button
                          onClick={() => onActivate(user)}
                          className="text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 p-1 rounded hover:bg-green-50 dark:hover:bg-green-900/30 transition"
                          title="Activer"
                        >
                          <CheckCircle className="w-4 h-4" />
                        </button>
                      ) : null}
                      <select
                        value={user.role}
                        onChange={(e) => onRoleChange(user, e.target.value)}
                        className="text-xs border border-gray-300 dark:border-slate-600 rounded p-1 hover:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100"
                      >
                        <option value="client">Client</option>
                        <option value="freelancer">Freelancer</option>
                        <option value="admin">Admin</option>
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
        Affichage de <span className="font-medium">{start}</span> à{" "}
        <span className="font-medium">{end}</span> sur{" "}
        <span className="font-medium">{totalItems}</span> résultats
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

// Modal de suspension
const SuspendModal = ({
  isOpen,
  onClose,
  user,
  onConfirm,
}: {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  onConfirm: (reason: string, duration: number) => void;
}) => {
  const [reason, setReason] = useState("");
  const [duration, setDuration] = useState(7);
  const [error, setError] = useState("");

  if (!isOpen || !user) return null;

  const handleSubmit = () => {
    if (!reason.trim()) {
      setError("La raison est requise");
      return;
    }
    onConfirm(reason, duration);
    setReason("");
    setDuration(7);
    setError("");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl max-w-md w-full p-6 border border-gray-200 dark:border-slate-700">
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
          Suspendre l'utilisateur
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Vous êtes sur le point de suspendre{" "}
          <span className="font-medium text-gray-900 dark:text-gray-100">
            {user.username}
          </span>
        </p>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Raison de la suspension *
          </label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100"
            placeholder="Expliquez la raison de la suspension..."
          />
          {error && (
            <p className="text-red-600 dark:text-red-400 text-sm mt-1">
              {error}
            </p>
          )}
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Durée (jours)
          </label>
          <select
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100"
          >
            <option value={7}>7 jours</option>
            <option value={14}>14 jours</option>
            <option value={30}>30 jours</option>
            <option value={90}>90 jours</option>
            <option value={365}>1 an</option>
          </select>
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
            Suspendre
          </button>
        </div>
      </div>
    </div>
  );
};

// Page principale
export default function UsersPage() {
  const router = useRouter();

  // États
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    per_page: 10,
    total_pages: 1,
  });
  const [filters, setFilters] = useState<UserFilters>({
    page: 1,
    per_page: 10,
    sort_by: "created_at",
    sort_order: "desc",
  });
  const [suspendModal, setSuspendModal] = useState<{
    isOpen: boolean;
    user: User | null;
  }>({
    isOpen: false,
    user: null,
  });

  // Charger les données
  const loadUsers = async () => {
    try {
      setLoading(true);
      // Utiliser les mock data pour l'instant
      const mockResponse = {
        items: mockUsers.list as User[],
        total: mockUsers.list.length,
        page: filters.page || 1,
        per_page: filters.per_page || 10,
        total_pages: Math.ceil(
          mockUsers.list.length / (filters.per_page || 10),
        ),
      };
      setUsers(mockResponse.items);
      setPagination(mockResponse);
    } catch (error) {
      console.error("Erreur chargement utilisateurs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, [filters.page, filters.per_page, filters.sort_by, filters.sort_order]);

  // Gestionnaires d'événements
  const handleFilterChange = (newFilters: UserFilters) => {
    setFilters({ ...filters, ...newFilters, page: 1 });
  };

  const handleSearch = () => {
    loadUsers();
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

  const handleViewUser = (user: User) => {
    router.push(`/dashboard/admin/users/${user.id}`);
  };

  const handleSuspend = async (reason: string, duration: number) => {
    if (!suspendModal.user) return;
    try {
      await suspendUser(suspendModal.user.id, {
        reason,
        duration_days: duration,
      });
      loadUsers();
    } catch (error) {
      console.error("Erreur suspension:", error);
    }
  };

  const handleActivate = async (user: User) => {
    if (confirm(`Êtes-vous sûr de vouloir réactiver ${user.username} ?`)) {
      try {
        await activateUser(user.id);
        loadUsers();
      } catch (error) {
        console.error("Erreur activation:", error);
      }
    }
  };

  const handleRoleChange = async (user: User, newRole: string) => {
    if (confirm(`Changer le rôle de ${user.username} en ${newRole} ?`)) {
      try {
        await changeUserRole(user.id, newRole as any);
        loadUsers();
      } catch (error) {
        console.error("Erreur changement rôle:", error);
      }
    }
  };

  const handleExport = () => {
    // Logique d'export CSV
    const csv = users
      .map(
        (u) =>
          `${u.id},${u.username},${u.email},${u.role},${u.status},${new Date(u.created_at).toLocaleDateString()}`,
      )
      .join("\n");

    const blob = new Blob([`ID,Nom,Email,Rôle,Statut,Inscription\n${csv}`], {
      type: "text/csv",
    });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `utilisateurs_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  return (
    <div className="min-h-screen bg-slate-950">
      <div className="container mx-auto">
        {/* En-tête */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-100 flex items-center">
            <Users className="w-6 h-6 mr-2 text-blue-400" />
            Gestion des utilisateurs
          </h1>
          <p className="text-gray-400 mt-1">
            Gérez tous les utilisateurs de la plateforme
          </p>
        </div>

        {/* Actions rapides */}
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-4 mb-6 flex flex-col sm:flex-row justify-between items-center gap-4 border border-gray-200 dark:border-slate-700">
          <div className="flex space-x-2">
            <button
              onClick={loadUsers}
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
            utilisateurs
          </div>
        </div>

        {/* Filtres */}
        <UserFilters
          filters={filters}
          onFilterChange={handleFilterChange}
          onSearch={handleSearch}
        />

        {/* Tableau */}
        <UserTable
          users={users}
          onSort={handleSort}
          sortBy={filters.sort_by || "created_at"}
          sortOrder={filters.sort_order || "desc"}
          onView={handleViewUser}
          onSuspend={(user) => setSuspendModal({ isOpen: true, user })}
          onActivate={handleActivate}
          onRoleChange={handleRoleChange}
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

      {/* Modal de suspension */}
      <SuspendModal
        isOpen={suspendModal.isOpen}
        onClose={() => setSuspendModal({ isOpen: false, user: null })}
        user={suspendModal.user}
        onConfirm={handleSuspend}
      />
    </div>
  );
}
