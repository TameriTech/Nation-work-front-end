// app/(protected)/dashboard/admin/categories/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Tag,
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  CheckCircle,
  XCircle,
  Loader2,
  RefreshCw,
  Download,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  MoreHorizontal,
  FolderTree,
  Folder,
  FolderOpen,
  FileText,
  DollarSign,
  Users,
  Briefcase,
  AlertCircle,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { useCategories } from "@/app/hooks/services/use-categories";
import type { Category, CategoryFilters } from "@/app/types";
import { icons, colors } from "@/data/constants";
import CategoriesLoading from "./loading";
import CategoriesError from "./error";
import { toast } from "sonner";
import { useAdminCategories } from "@/app/hooks/services/use-categories";

// Modal de création/édition avec React Hook Form
// Schéma de validation pour le formulaire de catégorie - CORRIGÉ
const categorySchema = z.object({
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  description: z
    .string()
    .min(10, "La description doit contenir au moins 10 caractères"),
  icon: z.string().default("📁"),
  color: z.string().default("#3b82f6"),
  is_active: z.boolean().default(true),
  parent_id: z.number().optional().nullable(),
});

// Type explicite pour le formulaire
type CategoryFormData = {
  name: string;
  description: string;
  icon: string;
  color: string;
  is_active: boolean;
  parent_id?: number | null;
};

// Modal de création/édition avec React Hook Form
const CategoryModal = ({
  isOpen,
  onClose,
  category,
  onSave,
  isSaving,
}: {
  isOpen: boolean;
  onClose: () => void;
  category?: Category | null;
  onSave: (data: CategoryFormData) => Promise<void>;
  isSaving?: boolean | undefined;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema) as any, // Solution temporaire avec "as any"
    defaultValues: {
      name: "",
      description: "",
      icon: "📁",
      color: "#3b82f6",
      is_active: true,
      parent_id: null,
    },
  });

  const selectedColor = watch("color");
  const selectedIcon = watch("icon");

  // Mettre à jour le formulaire quand la catégorie change
  useEffect(() => {
    if (category) {
      setValue("name", category.name);
      setValue("description", category.description || "");
      setValue("icon", category.icon || "");
      setValue("color", category.color || "");
      setValue("is_active", category.is_active);
      setValue("parent_id", category.parent_id || null);
    } else {
      reset(); // Reset aux valeurs par défaut
    }
  }, [category, setValue, reset]);

  // Reset quand la modal se ferme
  useEffect(() => {
    if (!isOpen) {
      reset();
    }
  }, [isOpen, reset]);

  if (!isOpen) return null;

  const onSubmit = async (data: CategoryFormData) => {
    await onSave(data);
    // Ne pas reset ici, le parent va fermer la modal
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl max-w-2xl w-full p-6 border border-gray-200 dark:border-slate-700">
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
          {category ? "Modifier la catégorie" : "Nouvelle catégorie"}
        </h3>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Nom */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Nom *
            </label>
            <input
              type="text"
              {...register("name")}
              className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100"
              placeholder="ex: Plomberie"
              disabled={isSaving}
            />
            {errors.name && (
              <p className="text-red-600 dark:text-red-400 text-sm mt-1">
                {errors.name.message}
              </p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Description *
            </label>
            <textarea
              {...register("description")}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100"
              placeholder="Description de la catégorie..."
              disabled={isSaving}
            />
            {errors.description && (
              <p className="text-red-600 dark:text-red-400 text-sm mt-1">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Icône et Couleur */}
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Icône
              </label>
              <select
                {...register("icon")}
                className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100"
                disabled={isSaving}
              >
                {icons.map((icon) => (
                  <option key={icon} value={icon}>
                    {icon}
                  </option>
                ))}
              </select>
              <div className="mt-2 text-3xl text-center bg-gray-50 dark:bg-slate-700 p-2 rounded">
                {selectedIcon}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Couleur
              </label>
              <div className="flex flex-wrap gap-2 max-h-24 overflow-y-auto p-2 border border-gray-200 dark:border-slate-700 rounded">
                {colors.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setValue("color", color)}
                    className={`w-8 h-8 rounded-full border-2 transition ${
                      selectedColor === color
                        ? "border-blue-500 ring-2 ring-blue-300 dark:ring-blue-700"
                        : "border-transparent hover:scale-110"
                    }`}
                    style={{ backgroundColor: color }}
                    disabled={isSaving}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Statut actif */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="is_active"
              {...register("is_active")}
              className="rounded border-gray-300 dark:border-gray-600 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 dark:bg-slate-700"
              disabled={isSaving}
            />
            <label
              htmlFor="is_active"
              className="ml-2 text-sm text-gray-700 dark:text-gray-300"
            >
              Catégorie active
            </label>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={() => {
                reset();
                onClose();
              }}
              disabled={isSaving}
              className="px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-300 transition disabled:opacity-50"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center transition"
            >
              {isSaving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {category ? "Modifier" : "Créer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Statistiques rapides
const StatsCard = ({ icon: Icon, title, value, color, loading }: any) => (
  <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-slate-700">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-600 dark:text-gray-400">{title}</p>
        <p className="text-2xl font-bold text-gray-800 dark:text-gray-200">
          {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : value}
        </p>
      </div>
      <div
        className={`w-12 h-12 ${color} rounded-lg flex items-center justify-center text-white`}
      >
        <Icon className="w-6 h-6" />
      </div>
    </div>
  </div>
);

// Page principale
export default function CategoriesPage() {
  const router = useRouter();

  const [filters, setFilters] = useState<CategoryFilters>({
    page: 1,
    per_page: 12,
    search: "",
  });
  const [searchInput, setSearchInput] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  // Hook personnalisé
  const {
    categories,
    pagination,
    isLoading,
    error,
    stats,
    isLoadingStats,
    createCategory,
    isCreating,
    updateCategory,
    isUpdating,
    deleteCategory,
    isDeleting,
    toggleCategoryStatus,
    isToggling,
    refetch,
  } = useAdminCategories({
    page: filters.page,
    per_page: filters.per_page,
    search: filters.search,
  }); // Pas besoin de paramètre isAdmin

  const handleSearch = () => {
    setFilters({ ...filters, search: searchInput, page: 1 });
    refetch();
  };

  const handleSave = async (data: CategoryFormData) => {
    if (editingCategory) {
      if (!updateCategory) {
        toast.error("Fonction de mise à jour non disponible");
        return;
      }
      await updateCategory({
        id: editingCategory.id,
        data,
      });
    } else {
      if (!createCategory) {
        toast.error("Fonction de création non disponible");
        return;
      }
      await createCategory(data);
    }
  };

  const handleToggleStatus = async (category: Category) => {
    if (!toggleCategoryStatus) {
      toast.error("Fonction de changement de statut non disponible");
      return;
    }

    if (
      confirm(
        `${category.is_active ? "Désactiver" : "Activer"} la catégorie "${category.name}" ?`,
      )
    ) {
      await toggleCategoryStatus({
        id: category.id,
        isActive: !category.is_active,
      });
    }
  };

  const handleDelete = async (category: Category) => {
    if (!deleteCategory) {
      toast.error("Fonction de changement de statut non disponible");
      return;
    }
    if (category.services_count && category.services_count > 0) {
      toast.error(
        "Impossible de supprimer une catégorie qui contient des services",
      );
      return;
    }

    if (confirm(`Supprimer définitivement la catégorie "${category.name}" ?`)) {
      await deleteCategory(category.id);
    }
  };

  const handlePageChange = (page: number) => {
    setFilters({ ...filters, page });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (error) {
    return <CategoriesError error={error} onRetry={refetch} />;
  }

  const totalPages = pagination?.total || 1;
  const currentPage = filters.page || 1;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950">
      <div className="container mx-auto px-4 py-8">
        {/* En-tête */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center">
            <FolderTree className="w-6 h-6 mr-2 text-blue-600 dark:text-blue-400" />
            Gestion des catégories
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Gérez les catégories de services de la plateforme
          </p>
        </div>

        {/* Statistiques */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <StatsCard
              icon={FolderTree}
              title="Total catégories"
              value={stats.total_categories}
              color="bg-blue-500"
              loading={isLoadingStats}
            />
            <StatsCard
              icon={CheckCircle}
              title="Actives"
              value={stats.active_categories}
              color="bg-green-500"
              loading={isLoadingStats}
            />
            <StatsCard
              icon={XCircle}
              title="Inactives"
              value={stats.inactive_categories}
              color="bg-yellow-500"
              loading={isLoadingStats}
            />
            <StatsCard
              icon={Briefcase}
              title="Services par cat."
              value={Math.round(stats.total_services)}
              color="bg-purple-500"
              loading={isLoadingStats}
            />
          </div>
        )}

        {/* Actions rapides */}
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-4 mb-6 flex flex-col sm:flex-row justify-between items-center gap-4 border border-gray-200 dark:border-slate-700">
          <div className="flex flex-wrap gap-2">
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
              onClick={() => {
                setEditingCategory(null);
                setModalOpen(true);
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center transition"
            >
              <Plus className="w-4 h-4 mr-2" />
              Nouvelle catégorie
            </button>
          </div>

          {/* Recherche */}
          <div className="flex w-full sm:w-auto gap-2">
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-4 h-4" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                placeholder="Rechercher..."
                className="pl-10 w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100"
              />
            </div>
            <button
              onClick={handleSearch}
              className="px-4 py-2 bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-slate-600 border border-gray-300 dark:border-slate-600"
            >
              <Search className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Liste des catégories */}
        {isLoading ? (
          <CategoriesLoading />
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories?.map((category: Category) => (
                <div
                  key={category.id}
                  className="bg-white dark:bg-slate-800 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition border border-gray-200 dark:border-slate-700"
                >
                  <div
                    className="h-2"
                    style={{ backgroundColor: category.color }}
                  />
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center">
                        <div
                          className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl"
                          style={{ backgroundColor: `${category.color}20` }}
                        >
                          {category.icon}
                        </div>
                        <div className="ml-4">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {category.name}
                          </h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            ID: {category.id}
                          </p>
                        </div>
                      </div>
                      {category.is_active ? (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border border-green-200 dark:border-green-800">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Actif
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400 border border-gray-200 dark:border-gray-700">
                          <XCircle className="w-3 h-3 mr-1" />
                          Inactif
                        </span>
                      )}
                    </div>

                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                      {category.description}
                    </p>

                    <div className="grid grid-cols-3 gap-2 mb-4">
                      <div className="text-center p-2 bg-gray-50 dark:bg-slate-700/50 rounded">
                        <Briefcase className="w-4 h-4 mx-auto mb-1 text-blue-600 dark:text-blue-400" />
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Services
                        </p>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {category.services_count || 0}
                        </p>
                      </div>
                      <div className="text-center p-2 bg-gray-50 dark:bg-slate-700/50 rounded">
                        <Users className="w-4 h-4 mx-auto mb-1 text-green-600 dark:text-green-400" />
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Freelancers
                        </p>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {category.freelancers_count || 0}
                        </p>
                      </div>
                      <div className="text-center p-2 bg-gray-50 dark:bg-slate-700/50 rounded">
                        <DollarSign className="w-4 h-4 mx-auto mb-1 text-purple-600 dark:text-purple-400" />
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Prix moy.
                        </p>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {category.average_price || 0}€
                        </p>
                      </div>
                    </div>

                    <div className="flex justify-end space-x-2 pt-4 border-t border-gray-200 dark:border-slate-700">
                      <button
                        onClick={() => {
                          setEditingCategory(category);
                          setModalOpen(true);
                        }}
                        disabled={isUpdating}
                        className="p-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded transition disabled:opacity-50"
                        title="Modifier"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleToggleStatus(category)}
                        disabled={isToggling}
                        className="p-2 text-gray-600 dark:text-gray-400 hover:text-yellow-600 dark:hover:text-yellow-400 hover:bg-yellow-50 dark:hover:bg-yellow-900/30 rounded transition disabled:opacity-50"
                        title={category.is_active ? "Désactiver" : "Activer"}
                      >
                        {category.is_active ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                      <button
                        onClick={() => handleDelete(category)}
                        disabled={
                          isDeleting || (category.services_count || 0) > 0
                        }
                        className="p-2 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded transition disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Supprimer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {categories?.length > 0 && totalPages > 1 && (
              <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-4 mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 border border-gray-200 dark:border-slate-700">
                <div className="text-sm text-gray-700 dark:text-gray-400">
                  Affichage de{" "}
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    {(currentPage - 1) * (filters.per_page || 12) + 1}
                  </span>{" "}
                  à{" "}
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    {Math.min(
                      currentPage * (filters.per_page || 12),
                      pagination?.total || 0,
                    )}
                  </span>{" "}
                  sur{" "}
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    {pagination?.total || 0}
                  </span>{" "}
                  catégories
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handlePageChange(1)}
                    disabled={currentPage === 1 || isLoading}
                    className="p-2 border border-gray-300 dark:border-slate-600 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition text-gray-600 dark:text-gray-400"
                  >
                    <ChevronsLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1 || isLoading}
                    className="p-2 border border-gray-300 dark:border-slate-600 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition text-gray-600 dark:text-gray-400"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-medium">
                    {currentPage} / {totalPages}
                  </span>
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages || isLoading}
                    className="p-2 border border-gray-300 dark:border-slate-600 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition text-gray-600 dark:text-gray-400"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handlePageChange(totalPages)}
                    disabled={currentPage === totalPages || isLoading}
                    className="p-2 border border-gray-300 dark:border-slate-600 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition text-gray-600 dark:text-gray-400"
                  >
                    <ChevronsRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Modal */}
      <CategoryModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingCategory(null);
        }}
        category={editingCategory}
        onSave={handleSave}
        isSaving={isCreating || isUpdating || undefined}
      />
    </div>
  );
}
