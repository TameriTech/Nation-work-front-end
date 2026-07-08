// app/(protected)/dashboard/admin/missions/page.tsx

"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Briefcase,
  Search,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Eye,
  RefreshCw,
  Loader2,
  AlertCircle,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  User,
  Tag,
  Ban,
  Trash2,
  Scale,
  Star,
  DollarSignIcon,
  CheckCircle,
  XCircle,
  Clock,
  Download,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";

import { useAdminMissions } from "@/app/hooks/use-missions";
import type { Mission, MissionFilter, MissionStatus } from "@/app/types";
import MissionsLoading from "./loading";
import MissionsError from "./error";
import { useAdminCategories } from "@/app/hooks/use-categories";
import { MissionFiltersFormData } from "@/app/lib/validators";

// Schéma de validation pour l'annulation
const cancelSchema = z.object({
  reason: z.string().min(10, "La raison doit contenir au moins 10 caractères"),
  notify: z.boolean().default(true),
});

type CancelFormData = z.infer<typeof cancelSchema>;


// ==================== COMPOSANTS ====================

// Composant de filtre
const MissionFiltersComponent = ({
  filters,
  onFilterChange,
  onSearch,
  isSearching,
  categories,
}: {
  filters: MissionFilter;
  onFilterChange: (filters: MissionFilter) => void;
  onSearch: () => void;
  isSearching?: boolean;
  categories: any[];
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
      onFilterChange({ ...filters, search: newValue });
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
              placeholder="Titre de la mission, client, prestataire..."
              className="pl-10 w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100"
              disabled={isSearching}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Statut
          </label>
          <select
            value={filters.status || ""}
            onChange={(e) => {
              const value = e.target.value;
              onFilterChange({
                ...filters,
                status: value ? (value as MissionStatus) : undefined,
                page: 1,
              });
            }}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            disabled={isSearching}
          >
            <option value="">Tous les statuts</option>
            {[
              { value: "open", label: "Ouverte" },
              { value: "in_progress", label: "En cours" },
              { value: "completed", label: "Terminée" },
              { value: "cancelled", label: "Annulée" },
            ].map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Catégorie
          </label>
          <select
            value={filters.category_id || ""}
            onChange={(e) =>
              onFilterChange({
                ...filters,
                category_id: e.target.value || undefined,
                page: 1,
              })
            }
            className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100"
            disabled={isSearching}
          >
            <option value="">Toutes les catégories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex justify-end mt-4 space-x-2">
        <button
          onClick={() => {
            onFilterChange({ ...filters, search: "", page: 1 });
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

// Badge de statut
const StatusBadge = ({ status }: { status: string }) => {
  const badges: Record<string, { color: string; icon: any; label: string }> = {
    open: {
      color: "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800",
      icon: Clock,
      label: "Ouverte",
    },
    in_progress: {
      color: "bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800",
      icon: Loader2,
      label: "En cours",
    },
    completed: {
      color: "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800",
      icon: CheckCircle,
      label: "Terminée",
    },
    cancelled: {
      color: "bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700",
      icon: XCircle,
      label: "Annulée",
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

// Composant de tableau
const MissionTable = ({
  missions,
  onSort,
  sortBy,
  sortOrder,
  onView,
  onUpdateStatus,
  onCancel,
  onDelete,
  loading,
  isChangingStatus,
  isDeleting,
}: {
  missions: Mission[];
  onSort: (field: string) => void;
  sortBy: string;
  sortOrder: "asc" | "desc";
  onView: (mission: Mission) => void;
  onUpdateStatus: (mission: Mission, status: MissionStatus) => void;
  onCancel: (mission: Mission) => void;
  onDelete: (mission: Mission) => void;
  loading: boolean;
  isChangingStatus: boolean;
  isDeleting: boolean;
}) => {
  const router = useRouter();

  const SortIcon = ({ field }: { field: string }) => {
    if (sortBy !== field)
      return <ArrowUpDown className="w-4 h-4 ml-1 text-gray-400 dark:text-gray-500" />;
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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-600 transition" onClick={() => onSort("title")}>
                <div className="flex items-center">Mission <SortIcon field="title" /></div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-600 transition" onClick={() => onSort("client")}>
                <div className="flex items-center">Client <SortIcon field="client" /></div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-600 transition" onClick={() => onSort("category")}>
                <div className="flex items-center">Catégorie <SortIcon field="category" /></div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-600 transition" onClick={() => onSort("status")}>
                <div className="flex items-center">Statut <SortIcon field="status" /></div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-600 transition" onClick={() => onSort("scheduled_at")}>
                <div className="flex items-center">Date <SortIcon field="scheduled_at" /></div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-600 transition" onClick={() => onSort("budget_min")}>
                <div className="flex items-center">Budget <SortIcon field="budget_min" /></div>
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-slate-800 divide-y divide-gray-200 dark:divide-slate-700">
            {missions.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                  Aucune mission trouvée
                </td>
              </tr>
            ) : (
              missions.map((mission) => (
                <tr key={mission.id} className="hover:bg-gray-50 dark:hover:bg-slate-700/50 transition">
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">{mission.title}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">ID: {mission.id}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-8 w-8">
                        {mission.client?.avatar ? (
                          <img className="h-8 w-8 rounded-full object-cover" src={mission.client.avatar} alt={mission.client.full_name} />
                        ) : (
                          <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-slate-700 flex items-center justify-center">
                            <User className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                          </div>
                        )}
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {mission.client?.full_name || mission.client?.username || "N/A"}
                        </div>
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400 border border-purple-200 dark:border-purple-800">
                      <Tag className="w-3 h-3 mr-1" />
                      {mission.category?.name || "Non catégorisé"}
                    </span>
                  </td>
                  <td className="px-6 py-4"><StatusBadge status={mission.status} /></td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white">
                      {new Date(mission.scheduled_at ?? new Date()).toLocaleDateString("fr-FR")}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {formatCurrency(mission.budget_min || 0)} - {formatCurrency(mission.budget_max || 0)}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {mission.quotes_count || 0} candidature(s)
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => onView(mission)}
                        className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 p-1 rounded hover:bg-blue-50 dark:hover:bg-blue-900/30 transition"
                        title="Voir détails"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      {mission.status !== "cancelled" && mission.status !== "completed" && (
                        <button
                          onClick={() => onCancel(mission)}
                          disabled={isChangingStatus}
                          className="text-gray-600 dark:text-gray-400 hover:text-orange-600 dark:hover:text-orange-400 p-1 rounded hover:bg-orange-50 dark:hover:bg-orange-900/30 transition disabled:opacity-50"
                          title="Annuler"
                        >
                          <Ban className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => onDelete(mission)}
                        disabled={isDeleting}
                        className="text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 p-1 rounded hover:bg-red-50 dark:hover:bg-red-900/30 transition disabled:opacity-50"
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
        Affichage de <span className="font-medium text-gray-900 dark:text-gray-100">{start}</span> à{" "}
        <span className="font-medium text-gray-900 dark:text-gray-100">{end}</span> sur{" "}
        <span className="font-medium text-gray-900 dark:text-gray-100">{totalItems}</span> missions
      </div>
      <div className="flex space-x-2">
        <button onClick={() => onPageChange(1)} disabled={currentPage === 1 || isLoading} className="p-2 border border-gray-300 dark:border-slate-600 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition text-gray-600 dark:text-gray-400">
          <ChevronsLeft className="w-4 h-4" />
        </button>
        <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1 || isLoading} className="p-2 border border-gray-300 dark:border-slate-600 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition text-gray-600 dark:text-gray-400">
          <ChevronLeft className="w-4 h-4" />
        </button>
        <span className="px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-medium">
          {currentPage} / {totalPages}
        </span>
        <button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages || isLoading} className="p-2 border border-gray-300 dark:border-slate-600 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition text-gray-600 dark:text-gray-400">
          <ChevronRight className="w-4 h-4" />
        </button>
        <button onClick={() => onPageChange(totalPages)} disabled={currentPage === totalPages || isLoading} className="p-2 border border-gray-300 dark:border-slate-600 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition text-gray-600 dark:text-gray-400">
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
  mission,
  onConfirm,
  isCancelling,
}: {
  isOpen: boolean;
  onClose: () => void;
  mission: Mission | null;
  onConfirm: (data: CancelFormData) => Promise<void>;
  isCancelling: boolean;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
  } = useForm<CancelFormData>({
    resolver: zodResolver(cancelSchema),
    defaultValues: { notify: true },
  });

  if (!isOpen || !mission) return null;

  const onSubmit = async (data: CancelFormData) => {
    try {
      await onConfirm(data);
      reset();
      onClose();
    } catch (error) {
      setError("root", {
        type: "manual",
        message: error instanceof Error ? error.message : "Erreur lors de l'annulation",
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl max-w-md w-full p-6 border border-gray-200 dark:border-slate-700">
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Annuler la mission</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Vous êtes sur le point d'annuler la mission <span className="font-medium text-gray-900 dark:text-gray-100">{mission?.title}</span>
        </p>

        {errors.root && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400 text-sm">
            {errors.root.message}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Raison de l'annulation *</label>
            <textarea {...register("reason")} rows={3} className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100" placeholder="Expliquez la raison de l'annulation..." disabled={isCancelling} />
            {errors.reason && <p className="text-red-600 dark:text-red-400 text-sm mt-1">{errors.reason.message}</p>}
          </div>

          <div className="mb-6">
            <label className="flex items-center">
              <input type="checkbox" {...register("notify")} className="rounded border-gray-300 dark:border-gray-600 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 dark:bg-slate-700" disabled={isCancelling} />
              <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Notifier les utilisateurs concernés</span>
            </label>
          </div>

          <div className="flex justify-end space-x-3">
            <button type="button" onClick={() => { reset(); onClose(); }} disabled={isCancelling} className="px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-300 transition disabled:opacity-50">Annuler</button>
            <button type="submit" disabled={isCancelling} className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition disabled:opacity-50 flex items-center">
              {isCancelling ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Annulation...</> : "Confirmer l'annulation"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ==================== PAGE PRINCIPALE ====================

export default function MissionsPage() {
  const router = useRouter();

  const [filters, setFilters] = useState<MissionFiltersFormData>({
    page: 0,
    per_page: 10,
    sort_by: 'budget_min',
    sort_direction: 'asc',
    status: undefined,
    category_id: undefined,
    budget_min: undefined,
    budget_max: undefined,
    date_from: undefined,
    date_to: undefined,
    city: undefined,
    district: undefined,
    urgency: undefined,
    search: undefined,
  });

  const [cancelModal, setCancelModal] = useState<{
    isOpen: boolean;
    mission: Mission | null;
  }>({ isOpen: false, mission: null });

  const {
    missions,
    pagination,
    isLoading,
    updateStatus,
    isUpdatingStatus,
    error,
    refetch,
    deleteMission,
    isDeleting,
  } = useAdminMissions({
    page: filters.page,
    per_page: filters.per_page,
    sort_by: filters.sort_by,
    sort_direction: filters.sort_direction,
    status: filters.status,
    category_id: filters.category_id,
    budget_min: filters.budget_min,
    budget_max: filters.budget_max,
    date_from: filters.date_from,
    date_to: filters.date_to,
    city: filters.city,
    district: filters.district,
    urgency: filters.urgency,
    search: filters.search,
  });

  const { categories } = useAdminCategories();
  console.log('Missions: ', missions);

  const handleFilterChange = (newFilters: MissionFilter) => setFilters(newFilters);
  const handleSearch = () => refetch();

  const handleSort = (field: string) => {
    const order = filters.sort_by === field && filters.sort_direction === "asc" ? "desc" : "asc";
    setFilters({ ...filters, sort_direction: order, page: 1 });
  };

  const handlePageChange = (page: number) => {
    setFilters({ ...filters, page });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleViewMission = (mission: Mission) => {
    router.push(`/dashboard/admin/missions/${mission.id}`);
  };

  const handleUpdateStatus = async (mission: Mission, newStatus: MissionStatus) => {
    if (mission.status === newStatus) return;
    if (newStatus === "cancelled") {
      setCancelModal({ isOpen: true, mission });
      return;
    }
    if (confirm(`Changer le statut de la mission "${mission.title}" en ${newStatus} ?`)) {
      await updateStatus({ id: mission.id, data: { status: newStatus, notify: false } });
    }
  };

  const handleCancel = async (data: CancelFormData) => {
    if (!cancelModal.mission) return;
    await updateStatus({
      id: cancelModal.mission.id,
      data: { status: "cancelled" as MissionStatus, reason: data.reason, notify: data.notify },
    });
    setCancelModal({ isOpen: false, mission: null });
  };

  const handleDelete = async (mission: Mission) => {
    if (confirm(`Supprimer définitivement la mission "${mission.title}" ?`)) {
      await deleteMission({ id: mission.id });
    }
  };

  const handleExport = () => {
    if (!missions.length) return;
    const headers = "ID,Titre,Client,Prestataire,Catégorie,Statut,Date,Budget\n";
    const csv = missions.map((m) => {
      const clientName = m.client?.full_name || m.client?.username || "Non spécifié";
      const providerName = m.provider?.full_name || m.provider?.username || "Non assigné";
      const categoryName = m.category?.name || "Non catégorisé";
      return `${m.id},"${m.title}","${clientName}","${providerName}","${categoryName}","${m.status}","${new Date(m.scheduled_at ?? new Date()).toLocaleDateString()}",${m.budget_min || 0}`;
    }).join("\n");
    const blob = new Blob([headers + csv], { type: "text/csv;charset=utf-8;" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `missions_${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  if (error) return <MissionsError error={error} onRetry={refetch} />;

  return (
    <div className="min-h-screen max-w-[70 rem] bg-gray-50 dark:bg-slate-950">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center">
            <Briefcase className="w-6 h-6 mr-2 text-blue-600 dark:text-blue-400" />
            Gestion des missions
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Gérez toutes les missions de la plateforme</p>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-4 mb-6 flex flex-col sm:flex-row justify-between items-center gap-4 border border-gray-200 dark:border-slate-700">
          <div className="flex space-x-2">
            <button onClick={() => refetch()} disabled={isLoading} className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 border border-gray-300 dark:border-slate-600 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 flex items-center transition disabled:opacity-50">
              <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`} /> Actualiser
            </button>
            <button onClick={handleExport} disabled={!missions.length} className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 border border-gray-300 dark:border-slate-600 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 flex items-center transition disabled:opacity-50">
              <Download className="w-4 h-4 mr-2" /> Exporter CSV
            </button>
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Total: <span className="font-medium text-gray-700 dark:text-gray-300">{pagination?.total || 0}</span> missions
          </div>
        </div>

        <MissionFiltersComponent
          filters={filters}
          onFilterChange={handleFilterChange}
          onSearch={handleSearch}
          isSearching={isLoading}
          categories={categories}
        />

        <MissionTable
          missions={missions}
          onSort={handleSort}
          sortBy={filters.sort_by || "created_at"}
          sortOrder={filters.sort_direction || "desc"}
          onView={handleViewMission}
          onUpdateStatus={handleUpdateStatus}
          onCancel={(mission) => setCancelModal({ isOpen: true, mission })}
          onDelete={handleDelete}
          loading={isLoading}
          isChangingStatus={isUpdatingStatus}
          isDeleting={isDeleting}
        />

        {pagination && pagination.total_pages && pagination.total_pages > 1 && (
          <Pagination
            currentPage={filters.page || 1}
            totalPages={pagination.total_pages}
            totalItems={pagination.total || 0}
            perPage={filters.per_page || 10}
            onPageChange={handlePageChange}
            isLoading={isLoading}
          />
        )}
      </div>

      <CancelModal
        isOpen={cancelModal.isOpen}
        onClose={() => setCancelModal({ isOpen: false, mission: null })}
        mission={cancelModal.mission}
        onConfirm={handleCancel}
        isCancelling={isUpdatingStatus}
      />
    </div>
  );
}