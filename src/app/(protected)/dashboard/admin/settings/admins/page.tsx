"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  Shield,
  Search,
  Filter,
  Plus,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Eye,
  Edit,
  Trash2,
  RefreshCw,
  Loader2,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  User,
  Mail,
  Phone,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Ban,
  Unlock,
  Lock,
  Key,
  ShieldAlert,
  ShieldCheck,
  MoreHorizontal,
  Download,
  Copy,
  Check,
  Save,
  UserPlus,
  UserMinus,
  UserCheck,
  UserX,
  Settings,
  Globe,
  Smartphone,
  Laptop,
  LogInIcon,
  EyeOff,
} from "lucide-react";

// ==================== TYPES ====================

interface Admin {
  id: number;
  username: string;
  email: string;
  password?: string; // Seulement pour la création/modification
  role: "super_admin" | "admin" | "moderator";
  permissions: string[];
  is_active: boolean;
  is_blocked: boolean;
  blocked_at?: string;
  blocked_reason?: string;
  last_login_at?: string;
  last_login_ip?: string;
  login_count: number;
  avatar?: string;
  phone?: string;
  department?: string;
  created_at: string;
  updated_at?: string;
  created_by?: number;
  created_by_name?: string;
}

interface AdminFilters {
  page?: number;
  per_page?: number;
  search?: string;
  role?: string;
  is_active?: boolean;
  is_blocked?: boolean;
  department?: string;
  sort_by?: string;
  sort_order?: "asc" | "desc";
}

interface AdminStats {
  total: number;
  active: number;
  blocked: number;
  super_admins: number;
  admins: number;
  moderators: number;
  recent_logins: number;
  never_logged: number;
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

const AdminFilters = ({
  filters,
  onFilterChange,
  onSearch,
}: {
  filters: AdminFilters;
  onFilterChange: (filters: AdminFilters) => void;
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
              placeholder="Nom, email, département..."
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
              onFilterChange({
                ...filters,
                role: e.target.value || undefined,
              })
            }
            className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100"
          >
            <option value="">Tous les rôles</option>
            <option value="super_admin">Super Admin</option>
            <option value="admin">Admin</option>
            <option value="moderator">Modérateur</option>
          </select>
        </div>

        {/* Filtre par statut */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Statut
          </label>
          <select
            value={
              filters.is_blocked !== undefined
                ? filters.is_blocked
                  ? "blocked"
                  : filters.is_active !== undefined
                    ? "active"
                    : ""
                : ""
            }
            onChange={(e) => {
              const value = e.target.value;
              if (value === "active") {
                onFilterChange({
                  ...filters,
                  is_active: true,
                  is_blocked: false,
                });
              } else if (value === "blocked") {
                onFilterChange({
                  ...filters,
                  is_active: false,
                  is_blocked: true,
                });
              } else {
                onFilterChange({
                  ...filters,
                  is_active: undefined,
                  is_blocked: undefined,
                });
              }
            }}
            className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100"
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

const AdminTable = ({
  admins,
  onSort,
  sortBy,
  sortOrder,
  onView,
  onEdit,
  onBlock,
  onUnblock,
  onDelete,
  loading,
}: {
  admins: Admin[];
  onSort: (field: string) => void;
  sortBy: string;
  sortOrder: "asc" | "desc";
  onView: (admin: Admin) => void;
  onEdit: (admin: Admin) => void;
  onBlock: (admin: Admin) => void;
  onUnblock: (admin: Admin) => void;
  onDelete: (admin: Admin) => void;
  loading: boolean;
}) => {
  const getRoleBadge = (role: string) => {
    const badges: Record<string, { color: string; icon: any; label: string }> =
      {
        super_admin: {
          color:
            "bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-800",
          icon: ShieldAlert,
          label: "Super Admin",
        },
        admin: {
          color:
            "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800",
          icon: Shield,
          label: "Admin",
        },
        moderator: {
          color:
            "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800",
          icon: ShieldCheck,
          label: "Modérateur",
        },
      };
    const badge = badges[role] || badges.moderator;
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

  const getStatusBadge = (admin: Admin) => {
    if (admin.is_blocked) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800">
          <Ban className="w-3 h-3 mr-1" />
          Bloqué
        </span>
      );
    }
    if (admin.is_active) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800">
          <UserCheck className="w-3 h-3 mr-1" />
          Actif
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700">
        <UserMinus className="w-3 h-3 mr-1" />
        Inactif
      </span>
    );
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "-";
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
                onClick={() => onSort("username")}
              >
                <div className="flex items-center">
                  Administrateur
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
                onClick={() => onSort("department")}
              >
                <div className="flex items-center">
                  Département
                  <SortIcon field="department" />
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Statut
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-600 transition"
                onClick={() => onSort("last_login_at")}
              >
                <div className="flex items-center">
                  Dernière connexion
                  <SortIcon field="last_login_at" />
                </div>
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-600 transition"
                onClick={() => onSort("login_count")}
              >
                <div className="flex items-center">
                  Connexions
                  <SortIcon field="login_count" />
                </div>
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-slate-800 divide-y divide-gray-200 dark:divide-slate-700">
            {admins.length === 0 ? (
              <tr>
                <td
                  colSpan={8}
                  className="px-6 py-12 text-center text-gray-500 dark:text-gray-400"
                >
                  <Shield className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <p>Aucun administrateur trouvé</p>
                </td>
              </tr>
            ) : (
              admins.map((admin) => (
                <tr
                  key={admin.id}
                  className={`hover:bg-gray-50 dark:hover:bg-slate-700/50 transition ${
                    admin.is_blocked ? "opacity-60" : ""
                  }`}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {admin.avatar ? (
                        <img
                          src={admin.avatar}
                          alt={admin.username}
                          className="w-10 h-10 rounded-full mr-3 object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-slate-700 flex items-center justify-center mr-3">
                          <User className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                        </div>
                      )}
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {admin.username}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          ID: {admin.id}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-gray-100">
                      {admin.email}
                    </div>
                    {admin.phone && (
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {admin.phone}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getRoleBadge(admin.role)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-gray-100">
                      {admin.department || "-"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(admin)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-gray-100">
                      {admin.last_login_at
                        ? formatDate(admin.last_login_at)
                        : "-"}
                    </div>
                    {admin.last_login_ip && (
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {admin.last_login_ip}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-gray-100">
                      {admin.login_count}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => onView(admin)}
                        className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 p-1 rounded hover:bg-blue-50 dark:hover:bg-blue-900/30 transition"
                        title="Voir détails"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onEdit(admin)}
                        className="text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 p-1 rounded hover:bg-green-50 dark:hover:bg-green-900/30 transition"
                        title="Modifier"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      {admin.is_blocked ? (
                        <button
                          onClick={() => onUnblock(admin)}
                          className="text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 p-1 rounded hover:bg-green-50 dark:hover:bg-green-900/30 transition"
                          title="Débloquer"
                        >
                          <Unlock className="w-4 h-4" />
                        </button>
                      ) : (
                        <button
                          onClick={() => onBlock(admin)}
                          className="text-gray-600 dark:text-gray-400 hover:text-orange-600 dark:hover:text-orange-400 p-1 rounded hover:bg-orange-50 dark:hover:bg-orange-900/30 transition"
                          title="Bloquer"
                        >
                          <Lock className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => onDelete(admin)}
                        className="text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 p-1 rounded hover:bg-red-50 dark:hover:bg-red-900/30 transition"
                        title="Supprimer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
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
        administrateurs
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

// Modal de création/modification
const AdminFormModal = ({
  isOpen,
  onClose,
  admin,
  onSave,
}: {
  isOpen: boolean;
  onClose: () => void;
  admin?: Admin | null;
  onSave: (data: Partial<Admin>) => Promise<void>;
}) => {
  const [formData, setFormData] = useState<Partial<Admin>>({
    username: "",
    email: "",
    password: "",
    role: "admin",
    permissions: [],
    department: "",
    phone: "",
    is_active: true,
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);

  const availablePermissions = [
    { id: "users.view", label: "Voir les utilisateurs" },
    { id: "users.create", label: "Créer des utilisateurs" },
    { id: "users.edit", label: "Modifier les utilisateurs" },
    { id: "users.delete", label: "Supprimer les utilisateurs" },
    { id: "users.block", label: "Bloquer/Débloquer les utilisateurs" },
    { id: "services.view", label: "Voir les services" },
    { id: "services.create", label: "Créer des services" },
    { id: "services.edit", label: "Modifier les services" },
    { id: "services.delete", label: "Supprimer les services" },
    { id: "services.validate", label: "Valider les services" },
    { id: "payments.view", label: "Voir les paiements" },
    { id: "payments.refund", label: "Rembourser les paiements" },
    { id: "disputes.view", label: "Voir les litiges" },
    { id: "disputes.resolve", label: "Résoudre les litiges" },
    { id: "messages.view", label: "Voir les messages" },
    { id: "messages.delete", label: "Supprimer les messages" },
    { id: "settings.view", label: "Voir les paramètres" },
    { id: "settings.edit", label: "Modifier les paramètres" },
    { id: "admins.view", label: "Voir les administrateurs" },
    { id: "admins.create", label: "Créer des administrateurs" },
    { id: "admins.edit", label: "Modifier les administrateurs" },
    { id: "admins.delete", label: "Supprimer des administrateurs" },
  ];

  useEffect(() => {
    if (admin) {
      setFormData({
        username: admin.username,
        email: admin.email,
        role: admin.role,
        permissions: admin.permissions,
        department: admin.department,
        phone: admin.phone,
        is_active: admin.is_active,
      });
      setSelectedPermissions(admin.permissions || []);
    } else {
      setFormData({
        username: "",
        email: "",
        password: "",
        role: "admin",
        permissions: [],
        department: "",
        phone: "",
        is_active: true,
      });
      setSelectedPermissions([]);
    }
  }, [admin, isOpen]);

  if (!isOpen) return null;

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.username?.trim()) {
      newErrors.username = "Le nom d'utilisateur est requis";
    }
    if (!formData.email?.trim()) {
      newErrors.email = "L'email est requis";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Email invalide";
    }
    if (!admin && !formData.password) {
      newErrors.password = "Le mot de passe est requis";
    }
    return newErrors;
  };

  const handleSubmit = async () => {
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setLoading(true);
      await onSave({
        ...formData,
        permissions: selectedPermissions,
      });
      onClose();
    } catch (error) {
      console.error("Erreur sauvegarde:", error);
    } finally {
      setLoading(false);
    }
  };

  const togglePermission = (permissionId: string) => {
    setSelectedPermissions((prev) =>
      prev.includes(permissionId)
        ? prev.filter((p) => p !== permissionId)
        : [...prev, permissionId],
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl max-w-4xl w-full p-6 border border-gray-200 dark:border-slate-700 max-h-[90vh] overflow-y-auto custom-scrollbar">
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
          {admin ? "Modifier l'administrateur" : "Nouvel administrateur"}
        </h3>

        <div className="space-y-4">
          {/* Informations de base */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Nom d'utilisateur *
              </label>
              <input
                type="text"
                value={formData.username || ""}
                onChange={(e) =>
                  setFormData({ ...formData, username: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100"
                placeholder="jdupont"
              />
              {errors.username && (
                <p className="text-red-600 dark:text-red-400 text-sm mt-1">
                  {errors.username}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email *
              </label>
              <input
                type="email"
                value={formData.email || ""}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100"
                placeholder="admin@exemple.com"
              />
              {errors.email && (
                <p className="text-red-600 dark:text-red-400 text-sm mt-1">
                  {errors.email}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Rôle
              </label>
              <select
                value={formData.role || "admin"}
                onChange={(e) =>
                  setFormData({ ...formData, role: e.target.value as any })
                }
                className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100"
              >
                <option value="super_admin">Super Admin</option>
                <option value="admin">Admin</option>
                <option value="moderator">Modérateur</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Mot de passe {!admin && "*"}
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={formData.password || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100"
                  placeholder={admin ? "••••••••" : "Mot de passe"}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-600 dark:text-red-400 text-sm mt-1">
                  {errors.password}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Téléphone
              </label>
              <input
                type="tel"
                value={formData.phone || ""}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100"
                placeholder="+33 6 12 34 56 78"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Département
              </label>
              <input
                type="text"
                value={formData.department || ""}
                onChange={(e) =>
                  setFormData({ ...formData, department: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100"
                placeholder="Support, Technique, etc."
              />
            </div>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="is_active"
              checked={formData.is_active}
              onChange={(e) =>
                setFormData({ ...formData, is_active: e.target.checked })
              }
              className="rounded border-gray-300 dark:border-gray-600 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 dark:bg-slate-700"
            />
            <label
              htmlFor="is_active"
              className="ml-2 text-sm text-gray-700 dark:text-gray-300"
            >
              Compte actif
            </label>
          </div>

          {/* Permissions */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Permissions
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 p-4 bg-gray-50 dark:bg-slate-700/50 rounded-lg max-h-60 overflow-y-auto custom-scrollbar">
              {availablePermissions.map((permission) => (
                <label
                  key={permission.id}
                  className="flex items-center space-x-2"
                >
                  <input
                    type="checkbox"
                    checked={selectedPermissions.includes(permission.id)}
                    onChange={() => togglePermission(permission.id)}
                    className="rounded border-gray-300 dark:border-gray-600 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 dark:bg-slate-700"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    {permission.label}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-300 transition"
          >
            Annuler
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center transition"
          >
            {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            <Save className="w-4 h-4 mr-2" />
            {admin ? "Mettre à jour" : "Créer"}
          </button>
        </div>
      </div>
    </div>
  );
};

// Modal de blocage
const BlockModal = ({
  isOpen,
  onClose,
  admin,
  onConfirm,
}: {
  isOpen: boolean;
  onClose: () => void;
  admin: Admin | null;
  onConfirm: (reason: string) => void;
}) => {
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");

  if (!isOpen || !admin) return null;

  const handleSubmit = () => {
    if (!reason.trim()) {
      setError("La raison du blocage est requise");
      return;
    }
    onConfirm(reason);
    setReason("");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl max-w-md w-full p-6 border border-gray-200 dark:border-slate-700">
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
          Bloquer l'administrateur
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Vous êtes sur le point de bloquer{" "}
          <span className="font-medium text-gray-900 dark:text-gray-100">
            {admin.username}
          </span>
        </p>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Raison du blocage *
          </label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100"
            placeholder="Expliquez la raison du blocage..."
          />
          {error && (
            <p className="text-red-600 dark:text-red-400 text-sm mt-1">
              {error}
            </p>
          )}
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
            Bloquer
          </button>
        </div>
      </div>
    </div>
  );
};

// Modal de détails
const AdminDetailsModal = ({
  isOpen,
  onClose,
  admin,
}: {
  isOpen: boolean;
  onClose: () => void;
  admin: Admin | null;
}) => {
  if (!isOpen || !admin) return null;

  const formatDate = (dateString?: string) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("fr-FR", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getPermissionLabel = (permissionId: string) => {
    const permissions: Record<string, string> = {
      "users.view": "Voir les utilisateurs",
      "users.create": "Créer des utilisateurs",
      "users.edit": "Modifier les utilisateurs",
      "users.delete": "Supprimer les utilisateurs",
      "users.block": "Bloquer/Débloquer les utilisateurs",
      "services.view": "Voir les services",
      "services.create": "Créer des services",
      "services.edit": "Modifier les services",
      "services.delete": "Supprimer les services",
      "services.validate": "Valider les services",
      "payments.view": "Voir les paiements",
      "payments.refund": "Rembourser les paiements",
      "disputes.view": "Voir les litiges",
      "disputes.resolve": "Résoudre les litiges",
      "messages.view": "Voir les messages",
      "messages.delete": "Supprimer les messages",
      "settings.view": "Voir les paramètres",
      "settings.edit": "Modifier les paramètres",
      "admins.view": "Voir les administrateurs",
      "admins.create": "Créer des administrateurs",
      "admins.edit": "Modifier les administrateurs",
      "admins.delete": "Supprimer des administrateurs",
    };
    return permissions[permissionId] || permissionId;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl max-w-2xl w-full p-6 border border-gray-200 dark:border-slate-700 max-h-[90vh] overflow-y-auto custom-scrollbar">
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
          Détails de l'administrateur
        </h3>

        <div className="space-y-4">
          {/* En-tête */}
          <div className="bg-gray-50 dark:bg-slate-700/50 rounded-lg p-4">
            <div className="flex items-center">
              {admin.avatar ? (
                <img
                  src={admin.avatar}
                  alt={admin.username}
                  className="w-16 h-16 rounded-full mr-4 object-cover"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-gray-200 dark:bg-slate-700 flex items-center justify-center mr-4">
                  <User className="w-8 h-8 text-gray-500 dark:text-gray-400" />
                </div>
              )}
              <div>
                <h4 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  {admin.username}
                </h4>
                <p className="text-gray-600 dark:text-gray-400">
                  {admin.email}
                </p>
                <div className="flex items-center mt-2 space-x-2">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      admin.role === "super_admin"
                        ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400"
                        : admin.role === "admin"
                          ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                          : "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                    }`}
                  >
                    {admin.role === "super_admin" && "Super Admin"}
                    {admin.role === "admin" && "Admin"}
                    {admin.role === "moderator" && "Modérateur"}
                  </span>
                  {admin.is_blocked ? (
                    <span className="px-2 py-1 bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 rounded-full text-xs font-medium">
                      Bloqué
                    </span>
                  ) : admin.is_active ? (
                    <span className="px-2 py-1 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded-full text-xs font-medium">
                      Actif
                    </span>
                  ) : (
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400 rounded-full text-xs font-medium">
                      Inactif
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Informations générales */}
          <div className="bg-gray-50 dark:bg-slate-700/50 rounded-lg p-4">
            <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-3">
              Informations générales
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">ID</p>
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  #{admin.id}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Département
                </p>
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {admin.department || "-"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Téléphone
                </p>
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {admin.phone || "-"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Créé le
                </p>
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {formatDate(admin.created_at)}
                </p>
              </div>
              {admin.created_by_name && (
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Créé par
                  </p>
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {admin.created_by_name}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Connexions */}
          <div className="bg-gray-50 dark:bg-slate-700/50 rounded-lg p-4">
            <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-3">
              Connexions
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Dernière connexion
                </p>
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {formatDate(admin.last_login_at)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">IP</p>
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {admin.last_login_ip || "-"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Nombre de connexions
                </p>
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {admin.login_count}
                </p>
              </div>
            </div>
          </div>

          {/* Blocage */}
          {admin.is_blocked && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <h4 className="font-medium text-red-700 dark:text-red-400 mb-3 flex items-center">
                <Ban className="w-4 h-4 mr-2" />
                Information de blocage
              </h4>
              <div className="space-y-2">
                <p className="text-sm text-red-600 dark:text-red-300">
                  <span className="font-medium">Raison:</span>{" "}
                  {admin.blocked_reason}
                </p>
                <p className="text-sm text-red-600 dark:text-red-300">
                  <span className="font-medium">Date:</span>{" "}
                  {formatDate(admin.blocked_at)}
                </p>
              </div>
            </div>
          )}

          {/* Permissions */}
          {admin.permissions && admin.permissions.length > 0 && (
            <div className="bg-gray-50 dark:bg-slate-700/50 rounded-lg p-4">
              <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-3">
                Permissions ({admin.permissions.length})
              </h4>
              <div className="grid grid-cols-2 gap-2">
                {admin.permissions.map((permission) => (
                  <div
                    key={permission}
                    className="flex items-center text-sm text-gray-600 dark:text-gray-400"
                  >
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    {getPermissionLabel(permission)}
                  </div>
                ))}
              </div>
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

// Modal de suppression
const DeleteModal = ({
  isOpen,
  onClose,
  admin,
  onConfirm,
}: {
  isOpen: boolean;
  onClose: () => void;
  admin: Admin | null;
  onConfirm: () => void;
}) => {
  if (!isOpen || !admin) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl max-w-md w-full p-6 border border-gray-200 dark:border-slate-700">
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
          Supprimer l'administrateur
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Êtes-vous sûr de vouloir supprimer définitivement{" "}
          <span className="font-medium text-gray-900 dark:text-gray-100">
            {admin.username}
          </span>{" "}
          ? Cette action est irréversible.
        </p>

        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3 mb-4">
          <p className="text-sm text-yellow-700 dark:text-yellow-400 flex items-center">
            <AlertCircle className="w-4 h-4 mr-2" />
            La suppression d'un administrateur est une action critique.
          </p>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-300 transition"
          >
            Annuler
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
          >
            Supprimer
          </button>
        </div>
      </div>
    </div>
  );
};

// ==================== PAGE PRINCIPALE ====================

export default function AdminsPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    per_page: 10,
    total_pages: 1,
  });
  const [filters, setFilters] = useState<AdminFilters>({
    page: 1,
    per_page: 10,
    sort_by: "created_at",
    sort_order: "desc",
  });

  const [selectedAdmin, setSelectedAdmin] = useState<Admin | null>(null);
  const [formModal, setFormModal] = useState(false);
  const [detailsModal, setDetailsModal] = useState(false);
  const [blockModal, setBlockModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);

  // Données mockées
  useEffect(() => {
    const mockAdmins: Admin[] = [
      {
        id: 1,
        username: "jean.dupont",
        email: "jean.dupont@admin.com",
        role: "super_admin",
        permissions: [
          "users.view",
          "users.create",
          "users.edit",
          "users.delete",
          "users.block",
          "services.view",
          "services.create",
          "services.edit",
          "services.delete",
          "services.validate",
          "payments.view",
          "payments.refund",
          "disputes.view",
          "disputes.resolve",
          "messages.view",
          "messages.delete",
          "settings.view",
          "settings.edit",
          "admins.view",
          "admins.create",
          "admins.edit",
          "admins.delete",
        ],
        is_active: true,
        is_blocked: false,
        login_count: 245,
        last_login_at: "2024-03-15T09:30:00Z",
        last_login_ip: "192.168.1.100",
        avatar: "https://randomuser.me/api/portraits/men/1.jpg",
        phone: "+33 6 12 34 56 78",
        department: "Direction",
        created_at: "2023-01-15T10:00:00Z",
      },
      {
        id: 2,
        username: "marie.martin",
        email: "marie.martin@admin.com",
        role: "admin",
        permissions: [
          "users.view",
          "users.edit",
          "services.view",
          "services.edit",
          "services.validate",
          "payments.view",
          "disputes.view",
          "disputes.resolve",
          "messages.view",
        ],
        is_active: true,
        is_blocked: false,
        login_count: 156,
        last_login_at: "2024-03-14T14:20:00Z",
        last_login_ip: "192.168.1.101",
        avatar: "https://randomuser.me/api/portraits/women/1.jpg",
        phone: "+33 6 98 76 54 32",
        department: "Support",
        created_at: "2023-03-20T11:30:00Z",
      },
      {
        id: 3,
        username: "pierre.durand",
        email: "pierre.durand@admin.com",
        role: "moderator",
        permissions: [
          "users.view",
          "services.view",
          "services.validate",
          "disputes.view",
          "messages.view",
        ],
        is_active: false,
        is_blocked: true,
        blocked_at: "2024-03-10T08:15:00Z",
        blocked_reason: "Non-respect des règles de modération",
        login_count: 45,
        last_login_at: "2024-03-09T16:45:00Z",
        last_login_ip: "192.168.1.102",
        department: "Modération",
        created_at: "2023-06-10T09:15:00Z",
      },
      {
        id: 4,
        username: "sophie.bernard",
        email: "sophie.bernard@admin.com",
        role: "admin",
        permissions: [
          "users.view",
          "users.edit",
          "services.view",
          "services.edit",
          "payments.view",
          "disputes.view",
          "messages.view",
        ],
        is_active: true,
        is_blocked: false,
        login_count: 89,
        last_login_at: "2024-03-13T11:10:00Z",
        last_login_ip: "192.168.1.103",
        department: "Technique",
        created_at: "2023-09-05T14:20:00Z",
      },
      {
        id: 5,
        username: "thomas.petit",
        email: "thomas.petit@admin.com",
        role: "moderator",
        permissions: [
          "users.view",
          "services.view",
          "disputes.view",
          "messages.view",
        ],
        is_active: true,
        is_blocked: false,
        login_count: 23,
        last_login_at: "2024-03-12T10:30:00Z",
        last_login_ip: "192.168.1.104",
        department: "Modération",
        created_at: "2023-11-18T16:45:00Z",
      },
    ];

    const mockStats: AdminStats = {
      total: mockAdmins.length,
      active: mockAdmins.filter((a) => a.is_active && !a.is_blocked).length,
      blocked: mockAdmins.filter((a) => a.is_blocked).length,
      super_admins: mockAdmins.filter((a) => a.role === "super_admin").length,
      admins: mockAdmins.filter((a) => a.role === "admin").length,
      moderators: mockAdmins.filter((a) => a.role === "moderator").length,
      recent_logins: mockAdmins.filter((a) => {
        const lastLogin = a.last_login_at ? new Date(a.last_login_at) : null;
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        return lastLogin && lastLogin > sevenDaysAgo;
      }).length,
      never_logged: mockAdmins.filter((a) => !a.last_login_at).length,
    };

    setAdmins(mockAdmins);
    setStats(mockStats);
    setPagination({
      total: mockAdmins.length,
      page: 1,
      per_page: 10,
      total_pages: 1,
    });
    setLoading(false);
  }, []);

  const handleFilterChange = (newFilters: AdminFilters) => {
    setFilters({ ...filters, ...newFilters, page: 1 });
  };

  const handleSearch = () => {
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

  const handleSaveAdmin = async (data: Partial<Admin>) => {
    // Simuler une sauvegarde
    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (selectedAdmin) {
      // Mise à jour
      setAdmins(
        admins.map((a) => (a.id === selectedAdmin.id ? { ...a, ...data } : a)),
      );
    } else {
      // Création
      const newAdmin: Admin = {
        id: Math.max(...admins.map((a) => a.id)) + 1,
        username: data.username || "",
        email: data.email || "",
        role: data.role || "admin",
        permissions: data.permissions || [],
        is_active: data.is_active ?? true,
        is_blocked: false,
        login_count: 0,
        department: data.department,
        phone: data.phone,
        created_at: new Date().toISOString(),
      };
      setAdmins([...admins, newAdmin]);
    }
  };

  const handleBlock = async (reason: string) => {
    if (!selectedAdmin) return;
    setAdmins(
      admins.map((a) =>
        a.id === selectedAdmin.id
          ? {
              ...a,
              is_blocked: true,
              blocked_at: new Date().toISOString(),
              blocked_reason: reason,
            }
          : a,
      ),
    );
  };

  const handleUnblock = async (admin: Admin) => {
    setAdmins(
      admins.map((a) =>
        a.id === admin.id
          ? {
              ...a,
              is_blocked: false,
              blocked_at: undefined,
              blocked_reason: undefined,
            }
          : a,
      ),
    );
  };

  const handleDelete = async () => {
    if (!selectedAdmin) return;
    setAdmins(admins.filter((a) => a.id !== selectedAdmin.id));
  };

  const handleExport = () => {
    const csv = admins
      .map(
        (a) =>
          `${a.id},${a.username},${a.email},${a.role},${a.department || ""},${a.is_blocked ? "Bloqué" : a.is_active ? "Actif" : "Inactif"},${a.last_login_at || ""}`,
      )
      .join("\n");

    const blob = new Blob(
      [`ID,Username,Email,Rôle,Département,Statut,Dernière connexion\n${csv}`],
      {
        type: "text/csv",
      },
    );
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `administrateurs-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  return (
    <div className="min-h-screen dark:bg-slate-950">
      <div className="container mx-auto">
        {/* En-tête */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-100 flex items-center">
              <Shield className="w-6 h-6 mr-2 text-blue-400" />
              Gestion des administrateurs
            </h1>
            <p className="text-gray-400 mt-1">
              Gérez les comptes administrateurs et leurs permissions
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
            <button
              onClick={() => {
                setSelectedAdmin(null);
                setFormModal(true);
              }}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center transition"
            >
              <UserPlus className="w-4 h-4 mr-2" />
              Nouvel administrateur
            </button>
          </div>
        </div>

        {/* Statistiques */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <StatsCard
              title="Total administrateurs"
              value={stats.total}
              subValue={`${stats.active} actifs`}
              icon={Shield}
              color="bg-blue-500"
            />
            <StatsCard
              title="Super Admins"
              value={stats.super_admins}
              icon={ShieldAlert}
              color="bg-purple-500"
            />
            <StatsCard
              title="Bloqués"
              value={stats.blocked}
              icon={Ban}
              color="bg-red-500"
            />
            <StatsCard
              title="Connexions récentes"
              value={stats.recent_logins}
              subValue={`${stats.never_logged} jamais connectés`}
              icon={LogInIcon}
              color="bg-green-500"
            />
          </div>
        )}

        {/* Filtres */}
        <AdminFilters
          filters={filters}
          onFilterChange={handleFilterChange}
          onSearch={handleSearch}
        />

        {/* Tableau */}
        <AdminTable
          admins={admins}
          onSort={handleSort}
          sortBy={filters.sort_by || "created_at"}
          sortOrder={filters.sort_order || "desc"}
          onView={(admin) => {
            setSelectedAdmin(admin);
            setDetailsModal(true);
          }}
          onEdit={(admin) => {
            setSelectedAdmin(admin);
            setFormModal(true);
          }}
          onBlock={(admin) => {
            setSelectedAdmin(admin);
            setBlockModal(true);
          }}
          onUnblock={handleUnblock}
          onDelete={(admin) => {
            setSelectedAdmin(admin);
            setDeleteModal(true);
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

      {/* Modals */}
      <AdminFormModal
        isOpen={formModal}
        onClose={() => {
          setFormModal(false);
          setSelectedAdmin(null);
        }}
        admin={selectedAdmin}
        onSave={handleSaveAdmin}
      />

      <AdminDetailsModal
        isOpen={detailsModal}
        onClose={() => {
          setDetailsModal(false);
          setSelectedAdmin(null);
        }}
        admin={selectedAdmin}
      />

      <BlockModal
        isOpen={blockModal}
        onClose={() => {
          setBlockModal(false);
          setSelectedAdmin(null);
        }}
        admin={selectedAdmin}
        onConfirm={handleBlock}
      />

      <DeleteModal
        isOpen={deleteModal}
        onClose={() => {
          setDeleteModal(false);
          setSelectedAdmin(null);
        }}
        admin={selectedAdmin}
        onConfirm={handleDelete}
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
