"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Users,
  Search,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Eye,
  Ban,
  CheckCircle,
  Download,
  RefreshCw,
  UserCheck,
  UserX,
  UserMinus,
  Shield,
  Star,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { useAdminUsers } from "@/app/hooks/admin/use-admin-users";
import type { UserFilters } from "@/app/types";
import type { User } from "@/app/types";
import UsersLoading from "./loading";
import AdminUsersError from "./error";
import Link from "next/link";
import { SuspendFormData, suspendSchema } from "@/app/lib/validators";

// Composant de filtre
const UserFilters = ({
  filters,
  onFilterChange,
  onSearch,
  isSearching,
}: {
  filters: UserFilters;
  onFilterChange: (filters: UserFilters) => void;
  onSearch: () => void;
  isSearching?: boolean;
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
              disabled={isSearching}
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
            disabled={isSearching}
          >
            <option value="">Tous les rôles</option>
            <option value="client">Client</option>
            <option value="freelancer">Freelancer</option>
            <option value="admin">Admin</option>
            <option value="super_admin">Super Admin</option>
            <option value="moderator">Modérateur</option>
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
            disabled={isSearching}
          >
            <option value="">Tous les statuts</option>
            <option value="active">Actif</option>
            <option value="suspended">Suspendu</option>
          </select>
        </div>
      </div>

      <div className="flex justify-end mt-4 space-x-2">
        <button
          onClick={() => {
            onFilterChange({ page: 1, per_page: filters.per_page });
            setLocalSearch("");
            onSearch();
          }}
          className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 border border-gray-300 dark:border-slate-600 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition disabled:opacity-50"
          disabled={isSearching}
        >
          Réinitialiser
        </button>
        <button
          onClick={onSearch}
          disabled={isSearching}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center transition disabled:opacity-50"
        >
          <Search className="w-4 h-4 mr-2" />
          {isSearching ? "Recherche..." : "Rechercher"}
        </button>
      </div>
    </div>
  );
};

// Composant de tableau
const UserTable = ({
  users,
  onView,
  onSuspend,
  onActivate,
  onRoleChange,
  loading,
  isActivating,
  isSuspending,
  isChangingRole,
}: {
  users: User[];
  onView: (user: User) => void;
  onSuspend: (user: User) => void;
  onActivate: (user: User) => void;
  onRoleChange: (user: User, newRole: string) => void;
  loading: boolean;
  isActivating: boolean;
  isSuspending: boolean;
  isChangingRole: boolean;
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
    const colors: Record<string, string> = {
      super_admin:
        "bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-800",
      admin:
        "bg-indigo-100 text-indigo-700 border-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-400 dark:border-indigo-800",
      moderator:
        "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800",
      freelancer:
        "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800",
      client:
        "bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700",
    };

    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${colors[role] || colors.client}`}
      >
        {role === "super_admin" || role === "admin" || role === "moderator" ? (
          <Shield className="w-3 h-3 mr-1" />
        ) : role === "freelancer" ? (
          <Star className="w-3 h-3 mr-1" />
        ) : (
          <UserCheck className="w-3 h-3 mr-1" />
        )}
        {role === "super_admin"
          ? "Super Admin"
          : role === "moderator"
            ? "Modérateur"
            : role.charAt(0).toUpperCase() + role.slice(1)}
      </span>
    );
  };

  if (loading) {
    return <UsersLoading />;
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg overflow-hidden border border-gray-200 dark:border-slate-700">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-slate-700">
          <thead className="bg-gray-50 dark:bg-slate-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Utilisateur
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Rôle
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Statut
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Inscription
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Dernière connexion
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
                        {user.profile_picture ? (
                          <img
                            className="h-10 w-10 rounded-full object-cover"
                            src={user.profile_picture}
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
                    {user.phone_number && (
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {user.phone_number}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getRoleBadge(user.role)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(!user.is_blocked ? "active" : "inactive")}
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
                        disabled={loading}
                        className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 p-1 rounded hover:bg-blue-50 dark:hover:bg-blue-900/30 transition disabled:opacity-50"
                        title="Voir détails"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      {!user.is_blocked ? (
                        <button
                          onClick={() => onSuspend(user)}
                          disabled={isSuspending}
                          className="text-gray-600 dark:text-gray-400 hover:text-orange-600 dark:hover:text-orange-400 p-1 rounded hover:bg-orange-50 dark:hover:bg-orange-900/30 transition disabled:opacity-50"
                          title="Suspendre"
                        >
                          <Ban className="w-4 h-4" />
                        </button>
                      ) : (
                        <button
                          onClick={() => onActivate(user)}
                          disabled={isActivating}
                          className="text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 p-1 rounded hover:bg-green-50 dark:hover:bg-green-900/30 transition disabled:opacity-50"
                          title="Activer"
                        >
                          <CheckCircle className="w-4 h-4" />
                        </button>
                      )}
                      <select
                        value={user.role}
                        onChange={(e) => onRoleChange(user, e.target.value)}
                        disabled={isChangingRole}
                        className="text-xs border border-gray-300 dark:border-slate-600 rounded p-1 hover:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 disabled:opacity-50"
                      >
                        <option value="client">Client</option>
                        <option value="freelancer">Freelancer</option>
                        <option value="moderator">Modérateur</option>
                        <option value="admin">Admin</option>
                        <option value="super_admin">Super Admin</option>
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
  isLoading,
}: {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  perPage: number;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
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
          disabled={currentPage === 1 || isLoading}
          className="p-2 border border-gray-300 dark:border-slate-600 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition text-gray-600 dark:text-gray-400"
        >
          <ChevronsLeft className="w-4 h-4" />
        </button>
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1 || isLoading}
          className="p-2 border border-gray-300 dark:border-slate-600 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition text-gray-600 dark:text-gray-400"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <span className="px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-medium">
          {currentPage} / {totalPages}
        </span>
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages || isLoading}
          className="p-2 border border-gray-300 dark:border-slate-600 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition text-gray-600 dark:text-gray-400"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
        <button
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages || isLoading}
          className="p-2 border border-gray-300 dark:border-slate-600 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition text-gray-600 dark:text-gray-400"
        >
          <ChevronsRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

// Modal de suspension avec React Hook Form

const SuspendModal = ({
  isOpen,
  onClose,
  user,
  onConfirm,
  isSuspending,
}: {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  onConfirm: (data: SuspendFormData) => void;
  isSuspending: boolean;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<SuspendFormData>({
    resolver: zodResolver(suspendSchema),
    defaultValues: {
      notify_user: true, // Set default value for checkbox
    },
  });

  if (!isOpen || !user) return null;

  const onSubmit = (data: SuspendFormData) => {
    console.log("Sending data: ", data);
    console.log("User being suspended: ", user);

    // Make sure data is properly formatted
    const formattedData: SuspendFormData = {
      ...data,
      // Ensure block_until is in correct format if needed
      block_until: data.block_until
        ? new Date(data.block_until).toISOString()
        : null,
    };

    onConfirm(formattedData);
    // Don't reset and close immediately - wait for success
    // The parent component should handle closing after success
  };

  // Close handler that doesn't conflict with form submission
  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 flex items-center justify-center z-50"
      onClick={(e) => {
        // Prevent closing when clicking inside the modal
        e.stopPropagation();
      }}
    >
      <div
        className="bg-white dark:bg-slate-800 rounded-lg shadow-xl max-w-md w-full p-6 border border-gray-200 dark:border-slate-700"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
          Suspendre l'utilisateur
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Vous êtes sur le point de suspendre{" "}
          <span className="font-medium text-gray-900 dark:text-gray-100">
            {user?.username}
          </span>
        </p>

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Reason selection - FIXED duplicate values */}
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Raison de la suspension *
            </label>
            <select
              {...register("reason")}
              className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100"
              disabled={isSuspending}
            >
              <option value="">Sélectionnez une raison</option>
              <option value="fraud">Fraude</option>
              <option value="harassment">Harcèlement</option>
              <option value="inappropriate_content">Contenu inapproprié</option>
              <option value="spam">Spam</option>
              <option value="multiple_warnings">
                Avertissements multiples
              </option>
              <option value="non_payment">Non-paiement</option>
              <option value="abandoned_services">Services abandonnés</option>
              <option value="fake_reviews">Avis faux</option>
              <option value="terms_violation">Violation des conditions</option>
              <option value="other">Autre</option>
            </select>
            {errors.reason && (
              <p className="text-red-600 dark:text-red-400 text-sm mt-1">
                {errors.reason.message}
              </p>
            )}
          </div>

          {/* Block until date */}
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Suspendu jusqu'au *
            </label>
            <input
              type="date"
              {...register("block_until")}
              min={new Date().toISOString().split("T")[0]} // Can't select past dates
              className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100"
              disabled={isSuspending}
            />
            {errors.block_until && (
              <p className="text-red-600 dark:text-red-400 text-sm mt-1">
                {errors.block_until.message}
              </p>
            )}
          </div>

          {/* Reason text */}
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Description détaillée *
            </label>
            <textarea
              {...register("reason_text")}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100"
              placeholder="Expliquez la raison de la suspension..."
              disabled={isSuspending}
            />
            {errors.reason_text && (
              <p className="text-red-600 dark:text-red-400 text-sm mt-1">
                {errors.reason_text.message}
              </p>
            )}
          </div>

          {/* Notify user checkbox - FIXED missing register */}
          <div className="mb-6">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                {...register("notify_user")}
                className="w-4 h-4 rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                disabled={isSuspending}
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                Notifier l'utilisateur par email
              </span>
            </label>
          </div>

          {/* Action buttons */}
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={handleClose}
              disabled={isSuspending}
              className="px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-300 transition disabled:opacity-50"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isSuspending}
              className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition disabled:opacity-50 flex items-center"
            >
              {isSuspending ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Suspension en cours...
                </>
              ) : (
                "Suspendre"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Page principale
export default function UsersPage() {
  const router = useRouter();

  // États
  const [filters, setFilters] = useState<UserFilters>({
    page: 1,
    per_page: 10,
    search: "",
    role: undefined,
    status: undefined,
  });

  const [suspendModal, setSuspendModal] = useState<{
    isOpen: boolean;
    user: User | null;
  }>({
    isOpen: false,
    user: null,
  });

  // Hook personnalisé
  const {
    users,
    isLoading,
    error,
    suspendUser,
    isSuspending,
    activateUser,
    isActivating,
    changeUserRole,
    isChangingRole,
    refetch,
  } = useAdminUsers(filters);

  // Calculs de pagination
  const totalPages = Math.ceil((users?.length || 0) / (filters.per_page || 10));
  const paginatedUsers = useMemo(() => {
    const start = ((filters.page || 1) - 1) * (filters.per_page || 10);
    const end = start + (filters.per_page || 10);
    return (users || []).slice(start, end);
  }, [users, filters.page, filters.per_page]);

  // Gestionnaires d'événements
  const handleFilterChange = (newFilters: UserFilters) => {
    setFilters({ ...filters, ...newFilters, page: 1 });
  };

  const handleSearch = () => {
    refetch();
  };

  const handlePageChange = (page: number) => {
    setFilters({ ...filters, page });
    // Scroll en haut de la page
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleViewUser = (user: User) => {
    router.push(`/dashboard/admin/users/${user.id}`);
  };

  const handleSuspend = async (data: SuspendFormData) => {
    if (!suspendModal.user) return;
    await suspendUser({
      userId: suspendModal.user.id,
      data,
    });
    setSuspendModal({ isOpen: false, user: null });
  };

  const handleActivate = async (user: User) => {
    if (confirm(`Êtes-vous sûr de vouloir réactiver ${user.username} ?`)) {
      await activateUser({
        userId: user.id,
        data: { reason: "Reactivate user", notify_user: true },
      });
    }
  };

  const handleRoleChange = async (user: User, newRole: string) => {
    if (confirm(`Changer le rôle de ${user.username} en ${newRole} ?`)) {
      await changeUserRole({
        userId: user.id,
        role: newRole,
      });
    }
  };

  const handleExport = () => {
    if (!users?.length) return;

    const csv = users
      .map(
        (u) =>
          `${u.id},${u.username},${u.email},${u.role},${u.is_active ? "actif" : "inactif"},${new Date(u.created_at).toLocaleDateString()}`,
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
    window.URL.revokeObjectURL(url);
  };

  if (error) {
    return <AdminUsersError error={error} onRetry={refetch} />;
  }

  return (
    <div className="min-h-screen dark:bg-slate-950">
      <div className="container mx-auto px-4 py-8">
        {/* En-tête */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center">
            <Users className="w-6 h-6 mr-2 text-blue-600 dark:text-blue-400" />
            Gestion des utilisateurs
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Gérez tous les utilisateurs de la plateforme
          </p>
        </div>

        {/* Actions rapides */}
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-4 mb-6 flex flex-col sm:flex-row justify-between items-center gap-4 border border-gray-200 dark:border-slate-700">
          <div className="flex space-x-2">
            <button
              onClick={() => refetch()}
              disabled={isLoading}
              className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 border border-gray-300 dark:border-slate-600 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 flex items-center transition disabled:opacity-50"
            >
              <RefreshCw
                className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`}
              />
              Actualiser
            </button>
            <button
              onClick={handleExport}
              disabled={!users?.length}
              className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 border border-gray-300 dark:border-slate-600 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 flex items-center transition disabled:opacity-50"
            >
              <Download className="w-4 h-4 mr-2" />
              Exporter CSV
            </button>
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Total:{" "}
            <span className="font-medium text-gray-900 dark:text-gray-200">
              {users?.length || 0}
            </span>{" "}
            utilisateurs
          </div>
        </div>

        {/* Filtres */}
        <UserFilters
          filters={filters}
          onFilterChange={handleFilterChange}
          onSearch={handleSearch}
          isSearching={isLoading}
        />

        {/* Tableau */}
        <UserTable
          users={paginatedUsers}
          onView={handleViewUser}
          onSuspend={(user) => setSuspendModal({ isOpen: true, user })}
          onActivate={handleActivate}
          onRoleChange={handleRoleChange}
          loading={isLoading}
          isActivating={isActivating}
          isSuspending={isSuspending}
          isChangingRole={isChangingRole}
        />

        {/* Pagination */}
        {totalPages > 1 && (
          <Pagination
            currentPage={filters.page || 1}
            totalPages={totalPages}
            totalItems={users?.length || 0}
            perPage={filters.per_page || 10}
            onPageChange={handlePageChange}
            isLoading={isLoading}
          />
        )}
      </div>

      {/* Modal de suspension */}
      <SuspendModal
        isOpen={suspendModal.isOpen}
        onClose={() => setSuspendModal({ isOpen: false, user: null })}
        user={suspendModal.user}
        onConfirm={handleSuspend}
        isSuspending={isSuspending}
      />
    </div>
  );
}
