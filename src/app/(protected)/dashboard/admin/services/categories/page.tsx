"use client";

import { useState, useEffect } from "react";
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

import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  toggleCategoryStatus,
} from "@/app/services/service.service";
import type {
  Category,
  CategoryFilters,
  PaginatedResponse,
} from "@/app/types/admin";
import { services as mockServices } from "@/data/admin-mock-data";

// Modal de création/édition
const CategoryModal = ({
  isOpen,
  onClose,
  category,
  onSave,
}: {
  isOpen: boolean;
  onClose: () => void;
  category?: Category | null;
  onSave: (data: Partial<Category>) => Promise<void>;
}) => {
  const [formData, setFormData] = useState<Partial<Category>>({
    name: "",
    description: "",
    icon: "📁",
    color: "#3b82f6",
    is_active: true,
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (category) {
      setFormData(category);
    } else {
      setFormData({
        name: "",
        description: "",
        icon: "📁",
        color: "#3b82f6",
        is_active: true,
      });
    }
  }, [category, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name?.trim()) {
      newErrors.name = "Le nom est requis";
    }
    if (!formData.description?.trim()) {
      newErrors.description = "La description est requise";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setLoading(true);
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error("Erreur sauvegarde catégorie:", error);
    } finally {
      setLoading(false);
    }
  };

  const colors = [
    "#3b82f6", // bleu
    "#10b981", // vert
    "#f59e0b", // orange
    "#ef4444", // rouge
    "#8b5cf6", // violet
    "#ec4899", // rose
    "#06b6d4", // cyan
    "#84cc16", // lime
  ];

  const icons = [
    "📁",
    "🔧",
    "⚡",
    "🧹",
    "🌿",
    "💻",
    "📚",
    "📦",
    "🎨",
    "🎵",
    "🏠",
    "🚗",
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full p-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
          {category ? "Modifier la catégorie" : "Nouvelle catégorie"}
        </h3>

        <div className="space-y-4">
          {/* Nom */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Nom *
            </label>
            <input
              type="text"
              value={formData.name || ""}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="ex: Plomberie"
            />
            {errors.name && (
              <p className="text-red-600 text-sm mt-1">{errors.name}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Description *
            </label>
            <textarea
              value={formData.description || ""}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={3}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="Description de la catégorie..."
            />
            {errors.description && (
              <p className="text-red-600 text-sm mt-1">{errors.description}</p>
            )}
          </div>

          {/* Icône et Couleur */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Icône
              </label>
              <select
                value={formData.icon || "📁"}
                onChange={(e) =>
                  setFormData({ ...formData, icon: e.target.value })
                }
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                {icons.map((icon) => (
                  <option key={icon} value={icon}>
                    {icon}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Couleur
              </label>
              <div className="flex space-x-2">
                {colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setFormData({ ...formData, color })}
                    className={`w-8 h-8 rounded-full border-2 ${
                      formData.color === color
                        ? "border-blue-500 ring-2 ring-blue-300"
                        : "border-transparent"
                    }`}
                    style={{ backgroundColor: color }}
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
              checked={formData.is_active}
              onChange={(e) =>
                setFormData({ ...formData, is_active: e.target.checked })
              }
              className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            />
            <label
              htmlFor="is_active"
              className="ml-2 text-sm text-gray-700 dark:text-gray-300"
            >
              Catégorie active
            </label>
          </div>
        </div>

        <div className="flex justify-end space-x-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 dark:text-white"
          >
            Annuler
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center"
          >
            {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {category ? "Modifier" : "Créer"}
          </button>
        </div>
      </div>
    </div>
  );
};

// Page principale
export default function CategoriesPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    per_page: 10,
    total_pages: 1,
  });
  const [filters, setFilters] = useState<CategoryFilters>({
    page: 1,
    per_page: 10,
  });
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  // Charger les catégories
  const loadCategories = async () => {
    try {
      setLoading(true);
      // Utiliser les mock data
      const mockResponse = {
        items: mockServices.categories as Category[],
        total: mockServices.categories.length,
        page: filters.page || 1,
        per_page: filters.per_page || 10,
        total_pages: Math.ceil(
          mockServices.categories.length / (filters.per_page || 10),
        ),
      };
      setCategories(mockResponse.items);
      setPagination(mockResponse);

      // Version API
      // const data = await getCategories(filters);
      // setCategories(data.items);
      // setPagination(data);
    } catch (error) {
      console.error("Erreur chargement catégories:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, [filters.page, filters.per_page]);

  // Recherche
  const filteredCategories = categories.filter(
    (cat) =>
      cat.name.toLowerCase().includes(search.toLowerCase()) ||
      cat.description.toLowerCase().includes(search.toLowerCase()),
  );

  const handleSave = async (data: Partial<Category>) => {
    if (editingCategory) {
      await updateCategory(editingCategory.id, data);
    } else {
      await createCategory(data);
    }
    loadCategories();
  };

  const handleToggleStatus = async (category: Category) => {
    if (confirm(`Activer/désactiver la catégorie "${category.name}" ?`)) {
      try {
        await toggleCategoryStatus(category.id, !category.is_active);
        loadCategories();
      } catch (error) {
        console.error("Erreur changement statut:", error);
      }
    }
  };

  const handleDelete = async (category: Category) => {
    if (category.services_count > 0) {
      alert("Impossible de supprimer une catégorie qui contient des services");
      return;
    }

    if (confirm(`Supprimer définitivement la catégorie "${category.name}" ?`)) {
      try {
        await deleteCategory(category.id);
        loadCategories();
      } catch (error) {
        console.error("Erreur suppression:", error);
      }
    }
  };

  const handlePageChange = (page: number) => {
    setFilters({ ...filters, page });
  };

  return (
    <div
      className="min-h-screen overflow-x-auto bg-gray-50 dark:bg-gray-900"
      style={{ maxWidth: "calc(100vw - 300px)" }}
    >
      <div className="container mx-auto px-4 py-8">
        {/* En-tête */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center">
            <FolderTree className="w-6 h-6 mr-2 text-blue-600" />
            Gestion des catégories
          </h1>
          <p className="text-gray-600 mt-1 dark:text-gray-400">
            Gérez les catégories de services de la plateforme
          </p>
        </div>

        {/* Actions rapides */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 mb-6 flex justify-between items-center">
          <div className="flex space-x-2">
            <button
              onClick={loadCategories}
              className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Actualiser
            </button>
            <button
              onClick={() => setModalOpen(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
            >
              <Plus className="w-4 h-4 mr-2" />
              Nouvelle catégorie
            </button>
          </div>

          {/* Recherche */}
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-4 h-4" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher..."
              className="pl-10 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
        </div>

        {/* Liste des catégories */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCategories.map((category) => (
              <div
                key={category.id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition"
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
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Actif
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                        <XCircle className="w-3 h-3 mr-1" />
                        Inactif
                      </span>
                    )}
                  </div>

                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                    {category.description}
                  </p>

                  <div className="grid grid-cols-3 gap-2 mb-4">
                    <div className="text-center p-2 bg-gray-50 dark:bg-gray-700 rounded">
                      <Briefcase className="w-4 h-4 mx-auto mb-1 text-blue-600" />
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Services
                      </p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {category.services_count}
                      </p>
                    </div>
                    <div className="text-center p-2 bg-gray-50 dark:bg-gray-700 rounded">
                      <Users className="w-4 h-4 mx-auto mb-1 text-green-600" />
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Freelancers
                      </p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {category.freelancers_count}
                      </p>
                    </div>
                    <div className="text-center p-2 bg-gray-50 dark:bg-gray-700 rounded">
                      <DollarSign className="w-4 h-4 mx-auto mb-1 text-purple-600" />
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Prix moy.
                      </p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {category.average_price}€
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-2 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <button
                      onClick={() => {
                        setEditingCategory(category);
                        setModalOpen(true);
                      }}
                      className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded dark:text-gray-400 dark:hover:bg-blue-900/20"
                      title="Modifier"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleToggleStatus(category)}
                      className="p-2 text-gray-600 hover:text-yellow-600 hover:bg-yellow-50 rounded dark:text-gray-400 dark:hover:bg-yellow-900/20"
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
                      className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded dark:text-gray-400 dark:hover:bg-red-900/20"
                      title="Supprimer"
                      disabled={category.services_count > 0}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {filteredCategories.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 mt-6 flex items-center justify-between">
            <div className="text-sm text-gray-700 dark:text-gray-400">
              Affichage de{" "}
              <span className="font-medium">
                {(pagination.page - 1) * pagination.per_page + 1}
              </span>{" "}
              à{" "}
              <span className="font-medium">
                {Math.min(
                  pagination.page * pagination.per_page,
                  pagination.total,
                )}
              </span>{" "}
              sur <span className="font-medium">{pagination.total}</span>{" "}
              catégories
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => handlePageChange(1)}
                disabled={pagination.page === 1}
                className="p-2 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronsLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
                className="p-2 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="px-4 py-2 border rounded-lg bg-blue-50 text-blue-600 font-medium dark:bg-blue-900 dark:text-blue-100">
                {pagination.page} / {pagination.total_pages}
              </span>
              <button
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page === pagination.total_pages}
                className="p-2 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => handlePageChange(pagination.total_pages)}
                disabled={pagination.page === pagination.total_pages}
                className="p-2 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronsRight className="w-4 h-4" />
              </button>
            </div>
          </div>
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
      />
    </div>
  );
}
