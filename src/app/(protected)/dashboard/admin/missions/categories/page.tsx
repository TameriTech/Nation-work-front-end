// app/(protected)/dashboard/admin/categories/page.tsx

"use client";

import { useEffect, useRef, useState } from "react";
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
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
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
import { toast } from "sonner";

import { useAdminCategories } from "@/app/hooks/use-categories";
import type { Category } from "@/app/types";
import {
  CategoryFiltersFormData,
  createCategorySchema,
  type CategoryCreateFormData,
  type CategoryUpdateFormData,
} from "@/app/lib/validators/category.validator";
import { icons, colors } from "@/data/constants";
import CategoriesLoading from "./loading";
import CategoriesError from "./error";

// ==================== TYPES ====================

interface CategoryFormData {
  name: string;
  icon: string | null;
  parent_id: string | null;
}

// ==================== MODAL ====================

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  category?: Category | null;
  onSave: (data: CategoryFormData) => Promise<void>;
  isSaving?: boolean;
  categories?: Category[];
}

const CategoryModal = ({
  isOpen,
  onClose,
  category,
  onSave,
  isSaving = false,
  categories = [],
}: CategoryModalProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<CategoryCreateFormData>({
    resolver: zodResolver(createCategorySchema),
    defaultValues: {
      name: "",
      icon: null,
      parent_id: null,
    },
  });

  const selectedIcon = watch("icon");

  useEffect(() => {
    if (category) {
      setValue("name", category.name || "");
      setValue("icon", category.icon || null);
      setValue("parent_id", category.parent_id || null);
    } else {
      reset();
    }
  }, [category, setValue, reset]);

  useEffect(() => {
    if (!isOpen) reset();
  }, [isOpen, reset]);

  if (!isOpen) return null;

  const onSubmit = async (data: CategoryFormData) => {
    await onSave(data);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl max-w-md w-full p-6 border border-gray-200 dark:border-slate-700 max-h-[90vh] overflow-y-auto">
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

          {/* Icône */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Icône
            </label>
            <div className="flex gap-2">
              <select
                {...register("icon")}
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100"
                disabled={isSaving}
              >
                <option value="">Aucune</option>
                {icons.map((icon) => (
                  <option key={icon} value={icon}>
                    {icon}
                  </option>
                ))}
              </select>
              {selectedIcon && (
                <div className="w-12 h-12 flex items-center justify-center bg-gray-100 dark:bg-slate-700 rounded-lg text-2xl">
                  {selectedIcon}
                </div>
              )}
            </div>
            {errors.icon && (
              <p className="text-red-600 dark:text-red-400 text-sm mt-1">
                {errors.icon.message}
              </p>
            )}
          </div>

          {/* Catégorie parente */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Catégorie parente
            </label>
            <select
              {...register("parent_id")}
              className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100"
              disabled={isSaving}
            >
              <option value="">Aucune (catégorie racine)</option>
              {categories
                .filter((cat) => cat.id !== category?.id)
                .map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
            </select>
            {errors.parent_id && (
              <p className="text-red-600 dark:text-red-400 text-sm mt-1">
                {errors.parent_id.message}
              </p>
            )}
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

// ==================== STATS CARD ====================

const StatsCard = ({ icon: Icon, title, value, color, loading }: any) => (
  <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-slate-700">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-600 dark:text-gray-400">{title}</p>
        <p className="text-2xl font-bold text-gray-800 dark:text-gray-200">
          {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : value ?? 0}
        </p>
      </div>
      <div className={`w-12 h-12 ${color} rounded-lg flex items-center justify-center text-white`}>
        <Icon className="w-6 h-6" />
      </div>
    </div>
  </div>
);

// ==================== PAGE PRINCIPALE ====================

export default function CategoriesPage() {
  const router = useRouter();

  const [filters, setFilters] = useState<CategoryFiltersFormData>({
    'sort_by': "name",
    'sort_direction': "asc",
    'page': 1,
    'per_page': 12,
    'search': "",
    'parent_id': null,
    'is_active': true,
  });
  
  const [searchInput, setSearchInput] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const {
    categories,
    pagination,
    isLoading,
    error,
    stats,
    statsLoading,
    createCategory,
    isCreating,
    updateCategory,
    isUpdating,
    deleteCategory,
    isDeleting,
    toggleActive,
    isToggling,
    refetch,
  } = useAdminCategories(filters);

  const handleSearch = () => {
    setFilters({ ...filters, search: searchInput, page: 1 });
  };

  const handleSave = async (data: CategoryFormData) => {
    try {
      if (editingCategory) {
        await updateCategory({
          id: editingCategory.id,
          data: data as CategoryUpdateFormData,
        });
      } else {
        await createCategory(data as CategoryCreateFormData);
      }
      setModalOpen(false);
      setEditingCategory(null);
    } catch (error) {
      // Error is handled by the hook's toast
    }
  };

  const handleToggleStatus = async (category: Category) => {
    if (confirm(`${category.is_active ? "Désactiver" : "Activer"} la catégorie "${category.name}" ?`)) {
      await toggleActive(category.id);
    }
  };

  const handleDelete = async (category: Category) => {
    if (category.children_count && category.children_count > 0) {
      toast.error("Impossible de supprimer une catégorie qui a des sous-catégories");
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

  const totalPages = pagination?.total_pages || 1;
  const currentPage = filters.page || 1;

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setSearchInput(newValue);
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = setTimeout(() => {
      setFilters({ ...filters, search: newValue, page: 1 });
    }, 500);
  };

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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <StatsCard
            icon={FolderTree}
            title="Total"
            value={stats?.total}
            color="bg-blue-500"
            loading={statsLoading}
          />
          <StatsCard
            icon={CheckCircle}
            title="Actives"
            value={stats?.active}
            color="bg-green-500"
            loading={statsLoading}
          />
          <StatsCard
            icon={XCircle}
            title="Inactives"
            value={stats?.inactive}
            color="bg-yellow-500"
            loading={statsLoading}
          />
        </div>

        {/* Actions rapides */}
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-4 mb-6 flex flex-col sm:flex-row justify-between items-center gap-4 border border-gray-200 dark:border-slate-700">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => refetch()}
              disabled={isLoading}
              className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 border border-gray-300 dark:border-slate-600 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 flex items-center transition disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
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
                ref={inputRef}
                value={searchInput}
                onChange={handleInputChange}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
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
                  />
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center">
                        <div
                          className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl"
                          
                        >
                          {category.icon}
                        </div>
                        <div className="ml-4">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {category.name}
                          </h3>
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

                    <div className="grid grid-cols-3 gap-2 mb-4">
                      <div className="text-center p-2 bg-gray-50 dark:bg-slate-700/50 rounded">
                        <Briefcase className="w-4 h-4 mx-auto mb-1 text-blue-600 dark:text-blue-400" />
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Services
                        </p>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {category.children_count || 0}
                        </p>
                      </div>
                      <div className="text-center p-2 bg-gray-50 dark:bg-slate-700/50 rounded">
                        <Users className="w-4 h-4 mx-auto mb-1 text-green-600 dark:text-green-400" />
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          providers
                        </p>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {category.mission_count || 0}
                        </p>
                      </div>
                      <div className="text-center p-2 bg-gray-50 dark:bg-slate-700/50 rounded">
                        <DollarSign className="w-4 h-4 mx-auto mb-1 text-purple-600 dark:text-purple-400" />
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Prix moy.
                        </p>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {category.provider_count || 0}€
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
                          isDeleting || (category.total_services || 0) > 0
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
                    {Math.min(currentPage * (filters.per_page || 12), pagination?.total || 0)}
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
        categories={categories}
        onSave={handleSave}
        isSaving={isCreating || isUpdating}
      />
    </div>
  );
}