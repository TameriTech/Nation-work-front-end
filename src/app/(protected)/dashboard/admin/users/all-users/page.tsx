"use client";

import { useState, useRef, useEffect } from "react";
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

import { useAdminUsers } from "@/app/hooks/use-admin-users";
import type { User } from "@/app/types/auth/user";
import type { BlockUserFormData, UnblockFormData } from "@/app/lib/validators/user.validator";
import { BlockUserSchema, UnblockUserSchema } from "@/app/lib/validators/user.validator";
import UsersLoading from "./loading";
import AdminUsersError from "./error";

// Interface pour les filtres locaux
interface LocalFilters {
  search: string;
  role?: string;
  status?: string;
  page: number;
  per_page: number;
}

// Composant de filtre
const UserFilters = ({
  filters,
  onFilterChange,
  onSearch,
  isSearching,
}: {
  filters: LocalFilters;
  onFilterChange: (filters: LocalFilters) => void;
  onSearch: () => void;
  isSearching?: boolean;
}) => {
  const [localSearch, setLocalSearch] = useState(filters.search || "");

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setLocalSearch(newValue);
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = setTimeout(() => {
      onFilterChange({ ...filters, search: newValue, page: 1 });
      onSearch();
    }, 500);
  };

  useEffect(() => {
    if (!isSearching && inputRef.current) {
      inputRef.current.focus();
      const length = inputRef.current.value.length;
      inputRef.current.setSelectionRange(length, length);
    }
  }, [isSearching]);

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-4 mb-6 border border-gray-200 dark:border-slate-700">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Recherche
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-4 h-4" />
            <input
              type="text"
              ref={inputRef}
              value={localSearch}
              onChange={handleInputChange}
              placeholder="Nom, email, téléphone..."
              className="pl-10 w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100"
              disabled={isSearching}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Rôle
          </label>
          <select
            value={filters.role || ""}
            onChange={(e) =>
              onFilterChange({ ...filters, role: e.target.value || undefined, page: 1 })
            }
            className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100"
            disabled={isSearching}
          >
            <option value="">Tous les rôles</option>
            <option value="client">Client</option>
            <option value="provider">Provider</option>
            <option value="admin">Admin</option>
            <option value="moderator">Modérateur</option>
          </select>
        </div>

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
                page: 1,
              })
            }
            className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100"
            disabled={isSearching}
          >
            <option value="">Tous les statuts</option>
            <option value="active">Actif</option>
            <option value="blocked">Bloqué</option>
          </select>
        </div>
      </div>

      <div className="flex justify-end mt-4 space-x-2">
        <button
          onClick={() => {
            onFilterChange({ page: 1, per_page: filters.per_page, search: "" });
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
  onBlock,
  onUnblock,
  onRoleChange,
  loading,
  isBlocking,
  isUnblocking,
  isChangingRole,
}: {
  users: User[];
  onView: (user: User) => void;
  onBlock: (user: User) => void;
  onUnblock: (user: User) => void;
  onRoleChange: (user: User, newRole: string) => void;
  loading: boolean;
  isBlocking: boolean;
  isUnblocking: boolean;
  isChangingRole: boolean;
}) => {
  const getStatusBadge = (user: User) => {
    if (!user.is_active) {
      return {
        color:
          "bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800",
        icon: UserX,
        label: "Bloqué",
      };
    }
    return {
      color:
        "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800",
      icon: UserCheck,
      label: "Actif",
    };
  };

  const getRoleBadge = (role: string) => {
    const colors: Record<string, string> = {
      admin:
        "bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-800",
      moderator:
        "bg-indigo-100 text-indigo-700 border-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-400 dark:border-indigo-800",
      provider:
        "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800",
      client:
        "bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700",
    };

    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${colors[role] || colors.client}`}
      >
        {role === "admin" || role === "moderator" ? (
          <Shield className="w-3 h-3 mr-1" />
        ) : role === "provider" ? (
          <Star className="w-3 h-3 mr-1" />
        ) : (
          <UserCheck className="w-3 h-3 mr-1" />
        )}
        {role === "moderator"
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
              users.map((user) => {
                const statusBadge = getStatusBadge(user);
                const StatusIcon = statusBadge.icon;
                
                return (
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
                              alt={user.full_name}
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-slate-700 flex items-center justify-center">
                              <Users className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            {user.full_name}
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
                      {getRoleBadge(user.role)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusBadge.color}`}
                      >
                        <StatusIcon className="w-3 h-3 mr-1" />
                        {statusBadge.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {new Date(user.created_at).toLocaleDateString("fr-FR")}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {user.last_login_at ? (
                        <>
                          {new Date(user.last_login_at).toLocaleDateString("fr-FR")}
                          <span className="text-xs text-gray-400 dark:text-gray-500 block">
                            {new Date(user.last_login_at).toLocaleTimeString(
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
                        {user.is_active ? (
                          <button
                            onClick={() => onBlock(user)}
                            disabled={isBlocking}
                            className="text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 p-1 rounded hover:bg-red-50 dark:hover:bg-red-900/30 transition disabled:opacity-50"
                            title="Bloquer"
                          >
                            <Ban className="w-4 h-4" />
                          </button>
                        ) : (
                          <button
                            onClick={() => onUnblock(user)}
                            disabled={isUnblocking}
                            className="text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 p-1 rounded hover:bg-green-50 dark:hover:bg-green-900/30 transition disabled:opacity-50"
                            title="Débloquer"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                        )}
                        <select
                          value={user.role}
                          onChange={(e) => onRoleChange(user, e.target.value)}
                          disabled={isChangingRole || user.role === 'admin'}
                          className="text-xs border border-gray-300 dark:border-slate-600 rounded p-1 hover:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 disabled:opacity-50"
                        >
                          <option value="client">Client</option>
                          <option value="provider">Provider</option>
                          <option value="moderator">Modérateur</option>
                          <option value="admin">Admin</option>
                        </select>
                      </div>
                    </td>
                  </tr>
                );
              })
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

// Modal de blocage
const BlockModal = ({
  isOpen,
  onClose,
  user,
  onConfirm,
  isBlocking,
}: {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  onConfirm: (data: BlockUserFormData) => void;
  isBlocking: boolean;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<BlockUserFormData>({
    resolver: zodResolver(BlockUserSchema),
  });

  if (!isOpen || !user) return null;

  const onSubmit = (data: BlockUserFormData) => {
    onConfirm(data);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 flex items-center justify-center z-50"
      onClick={(e) => e.stopPropagation()}
    >
      <div
        className="bg-white dark:bg-slate-800 rounded-lg shadow-xl max-w-md w-full p-6 border border-gray-200 dark:border-slate-700"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
          Bloquer l'utilisateur
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Vous êtes sur le point de bloquer{" "}
          <span className="font-medium text-gray-900 dark:text-gray-100">
            {user?.full_name}
          </span>
        </p>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Raison (optionnelle)
            </label>
            <select
              {...register("reason")}
              className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100"
              disabled={isBlocking}
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
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Bloquer jusqu'au (optionnel)
            </label>
            <input
              type="datetime-local"
              {...register("block_until")}
              min={new Date().toISOString().split("T")[0]}
              className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100"
              disabled={isBlocking}
            />
            {errors.block_until && (
              <p className="text-red-600 dark:text-red-400 text-sm mt-1">
                {errors.block_until.message}
              </p>
            )}
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={handleClose}
              disabled={isBlocking}
              className="px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-300 transition disabled:opacity-50"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isBlocking}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:opacity-50 flex items-center"
            >
              {isBlocking ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Blocage en cours...
                </>
              ) : (
                "Bloquer"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Modal de déblocage
const UnblockModal = ({
  isOpen,
  onClose,
  user,
  onConfirm,
  isUnblocking,
}: {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  onConfirm: (data: UnblockFormData) => void;
  isUnblocking: boolean;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<UnblockFormData>({
    resolver: zodResolver(UnblockUserSchema),
  });

  if (!isOpen || !user) return null;

  const onSubmit = (data: UnblockFormData) => {
    onConfirm(data);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 flex items-center justify-center z-50"
      onClick={(e) => e.stopPropagation()}
    >
      <div
        className="bg-white dark:bg-slate-800 rounded-lg shadow-xl max-w-md w-full p-6 border border-gray-200 dark:border-slate-700"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
          Débloquer l'utilisateur
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Vous êtes sur le point de débloquer{" "}
          <span className="font-medium text-gray-900 dark:text-gray-100">
            {user?.full_name}
          </span>
        </p>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Raison (optionnelle)
            </label>
            <textarea
              {...register("reason")}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100"
              placeholder="Raison du déblocage..."
              disabled={isUnblocking}
            />
            {errors.reason && (
              <p className="text-red-600 dark:text-red-400 text-sm mt-1">
                {errors.reason.message}
              </p>
            )}
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={handleClose}
              disabled={isUnblocking}
              className="px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-300 transition disabled:opacity-50"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isUnblocking}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50 flex items-center"
            >
              {isUnblocking ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Déblocage en cours...
                </>
              ) : (
                "Débloquer"
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

  const [filters, setFilters] = useState<LocalFilters>({
    page: 1,
    per_page: 10,
    search: "",
    role: undefined,
    status: undefined,
  });

  const [blockModal, setBlockModal] = useState<{
    isOpen: boolean;
    user: User | null;
  }>({
    isOpen: false,
    user: null,
  });

  const [unblockModal, setUnblockModal] = useState<{
    isOpen: boolean;
    user: User | null;
  }>({
    isOpen: false,
    user: null,
  });

  // Convertir les filtres locaux en filtres backend
  const backendFilters = {
    search: filters.search || undefined,
    role: filters.role as any,
    is_active: filters.status === 'active' ? true : filters.status === 'blocked' ? false : undefined,
    page: filters.page,
    per_page: filters.per_page,
  };

  const {
    users: usersData,
    pagination,
    isLoading,
    error,
    blockUser,
    isBlocking,
    unblockUser,
    isUnblocking,
    changeRole,
    isChangingRole,
    refetch,
  } = useAdminUsers(backendFilters);

  const handleFilterChange = (newFilters: LocalFilters) => {
    setFilters(newFilters);
    console.log("Filters updated:", newFilters);
    console.log('usersData:', usersData);
  };

  const handleSearch = () => {
    refetch();
  };

  const handlePageChange = (page: number) => {
    setFilters({ ...filters, page });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleViewUser = (user: User) => {
    router.push(`/dashboard/admin/users/${user.id}`);
  };

  const handleBlock = async (data: BlockUserFormData) => {
    if (!blockModal.user) return;
    await blockUser({
      userId: blockModal.user.id,
      data,
    });
    setBlockModal({ isOpen: false, user: null });
  };

  const handleUnblock = async (data: UnblockFormData) => {
    if (!unblockModal.user) return;
    await unblockUser({
      userId: unblockModal.user.id,
      data,
    });
    setUnblockModal({ isOpen: false, user: null });
  };

  const handleRoleChange = async (user: User, newRole: string) => {
    if (user.role === 'admin') {
      alert("Impossible de changer le rôle d'un administrateur");
      return;
    }
    if (confirm(`Changer le rôle de ${user.full_name} en ${newRole} ?`)) {
      await changeRole({
        userId: user.id,
        data: { role: newRole as any },
      });
    }
  };

  const handleExport = () => {
    if (!usersData?.length) return;

    const csv = usersData
      .map(
        (u) =>
          `${u.id},${u.full_name},${u.email},${u.role},${u.is_active ? "actif" : "bloqué"},${new Date(u.created_at).toLocaleDateString()}`,
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
    <div className="min-h-screen max-w-[70rem] dark:bg-slate-950">
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
              disabled={!usersData?.length}
              className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 border border-gray-300 dark:border-slate-600 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 flex items-center transition disabled:opacity-50"
            >
              <Download className="w-4 h-4 mr-2" />
              Exporter CSV
            </button>
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Total:{" "}
            <span className="font-medium text-gray-900 dark:text-gray-200">
              {pagination?.total || 0}
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
          users={usersData || []}
          onView={handleViewUser}
          onBlock={(user) => setBlockModal({ isOpen: true, user })}
          onUnblock={(user) => setUnblockModal({ isOpen: true, user })}
          onRoleChange={handleRoleChange}
          loading={isLoading}
          isBlocking={isBlocking}
          isUnblocking={isUnblocking}
          isChangingRole={isChangingRole}
        />

        {/* Pagination */}
        {pagination && pagination.total_pages > 1 && (
          <Pagination
            currentPage={filters.page}
            totalPages={pagination.total_pages}
            totalItems={pagination.total}
            perPage={filters.per_page}
            onPageChange={handlePageChange}
            isLoading={isLoading}
          />
        )}
      </div>

      {/* Modal de blocage */}
      <BlockModal
        isOpen={blockModal.isOpen}
        onClose={() => setBlockModal({ isOpen: false, user: null })}
        user={blockModal.user}
        onConfirm={handleBlock}
        isBlocking={isBlocking}
      />

      {/* Modal de déblocage */}
      <UnblockModal
        isOpen={unblockModal.isOpen}
        onClose={() => setUnblockModal({ isOpen: false, user: null })}
        user={unblockModal.user}
        onConfirm={handleUnblock}
        isUnblocking={isUnblocking}
      />
    </div>
  );
}