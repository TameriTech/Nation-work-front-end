// hooks/useCategories.ts
"use client";

import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/app/components/ui/use-toast';
import * as categoryService from '@/app/services/category.service';
import { CategoryFilters, PaginatedResponse, Category } from '@/app/types/admin';
import { Category as UserCategory } from '@/app/types/category';

interface UseCategoriesProps {
  initialFilters?: CategoryFilters;
  mode?: 'admin' | 'public';
  autoLoad?: boolean;
}

export const useCategories = ({ 
  initialFilters = {}, 
  mode = 'public',
  autoLoad = true 
}: UseCategoriesProps = {}) => {
  const [categories, setCategories] = useState<UserCategory[]>([]);
  const [adminCategories, setAdminCategories] = useState<PaginatedResponse<Category> | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [filters, setFilters] = useState<CategoryFilters>(initialFilters);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { toast } = useToast();

  // ==================== CHARGEMENT DES CATÉGORIES ====================

  const loadCategories = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      let data: UserCategory[] | PaginatedResponse<Category>;
      if (mode === 'admin') {
        data = await categoryService.getAllCategories(filters);
        setAdminCategories(data);
        setCategories(data.items);
      } else {
        data = await categoryService.getCategories(filters);
        setCategories(data);
      }
      
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors du chargement des catégories';
      setError(errorMessage);
      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive"
      });
      throw err;
    } finally {
      setLoading(false);
    }
  }, [filters, mode, toast]);

  // Chargement initial
  useEffect(() => {
    if (autoLoad) {
      loadCategories();
    }
  }, [loadCategories, autoLoad]);

  // ==================== ACTIONS ADMIN ====================

  const createCategory = useCallback(async (categoryData: {
    name: string;
    description: string;
    icon: string;
    color: string;
    is_active: boolean;
    parent_id?: number;
  }) => {
    try {
      setLoading(true);
      const newCategory = await categoryService.createCategory(categoryData);
      
      // Mettre à jour la liste
      setAdminCategories(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          categories: [newCategory, ...prev.items],
          total: prev.total + 1
        };
      });
      
      toast({
        title: "Succès",
        description: "Catégorie créée avec succès"
      });
      
      return newCategory;
    } catch (err: any) {
      const errorMessage = err.message || 'Erreur lors de la création';
      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive"
      });
      throw err;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const updateCategory = useCallback(async (categoryId: number, data: Partial<Category>) => {
    try {
      setLoading(true);
      const updatedCategory = await categoryService.updateCategory(categoryId, data);
      
      // Mettre à jour la liste
      setAdminCategories(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          categories: prev.items.map(cat => 
            cat.id === categoryId ? updatedCategory : cat
          )
        };
      });
      
      // Mettre à jour la catégorie sélectionnée si c'est la même
      if (selectedCategory?.id === categoryId) {
        setSelectedCategory(updatedCategory);
      }
      
      toast({
        title: "Succès",
        description: "Catégorie mise à jour avec succès"
      });
      
      return updatedCategory;
    } catch (err: any) {
      const errorMessage = err.message || 'Erreur lors de la mise à jour';
      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive"
      });
      throw err;
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, toast]);

  const deleteCategory = useCallback(async (categoryId: number) => {
    try {
      setLoading(true);
      const result = await categoryService.deleteCategory(categoryId);
      
      // Mettre à jour la liste
      setAdminCategories(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          categories: prev.items.filter(cat => cat.id !== categoryId),
          total: prev.total - 1
        };
      });
      
      // Réinitialiser la catégorie sélectionnée si c'est la même
      if (selectedCategory?.id === categoryId) {
        setSelectedCategory(null);
      }
      
      toast({
        title: "Succès",
        description: result.message || "Catégorie supprimée avec succès"
      });
      
      return result;
    } catch (err: any) {
      const errorMessage = err.message || 'Erreur lors de la suppression';
      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive"
      });
      throw err;
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, toast]);

  const toggleCategoryStatus = useCallback(async (categoryId: number, is_active: boolean) => {
    try {
      setLoading(true);
      const result = await categoryService.toggleCategoryStatus(categoryId, is_active);
      
      // Mettre à jour la liste
      setAdminCategories(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          categories: prev.items.map(cat => 
            cat.id === categoryId ? result.category : cat
          )
        };
      });
      
      // Mettre à jour la catégorie sélectionnée si c'est la même
      if (selectedCategory?.id === categoryId) {
        setSelectedCategory(result.category);
      }
      
      toast({
        title: "Succès",
        description: result.message || `Catégorie ${is_active ? 'activée' : 'désactivée'} avec succès`
      });
      
      return result;
    } catch (err: any) {
      const errorMessage = err.message || 'Erreur lors du changement de statut';
      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive"
      });
      throw err;
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, toast]);

  // ==================== GESTION DES FILTRES ====================

  const updateFilters = useCallback((newFilters: Partial<CategoryFilters>) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters,
      page: 1 // Reset à la première page quand on filtre
    }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({ page: 1, per_page: 10 });
  }, []);

  // ==================== PAGINATION ====================

  const nextPage = useCallback(() => {
    if (adminCategories && adminCategories.page < Math.ceil(adminCategories.total / adminCategories.per_page)) {
      setFilters(prev => ({ ...prev, page: (prev.page || 1) + 1 }));
    }
  }, [adminCategories]);

  const prevPage = useCallback(() => {
    if (adminCategories && adminCategories.page > 1) {
      setFilters(prev => ({ ...prev, page: (prev.page || 1) - 1 }));
    }
  }, [adminCategories]);

  const goToPage = useCallback((page: number) => {
    setFilters(prev => ({ ...prev, page }));
  }, []);

  // ==================== SÉLECTION ====================

  const selectCategory = useCallback((category: Category | null) => {
    setSelectedCategory(category);
  }, []);

  const getCategoryById = useCallback((id: number) => {
    if (mode === 'admin' && adminCategories) {
      return adminCategories.items.find(cat => cat.id === id);
    }
    return categories.find(cat => cat.id === id);
  }, [adminCategories, categories, mode]);

  // ==================== RECHERCHE ====================

  const searchCategories = useCallback(async (query: string) => {
    try {
      setLoading(true);
      const results = await categoryService.getCategories({ 
        search: query,
        per_page: 20 
      });
      return results;
    } catch (err) {
      console.error('Search categories error:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // ==================== STATISTIQUES ====================

  const getStatistics = useCallback(() => {
    if (mode === 'admin' && adminCategories) {
        
      return {
        total: adminCategories.total,
        active: adminCategories.items.filter(c => c.is_active).length,
        inactive: adminCategories.items.filter(c => !c.is_active).length,
        pages: Math.ceil(adminCategories.total / adminCategories.per_page),
        currentPage: adminCategories.page,
      };
    }
    
    return {
      total: categories.length,
      active: categories.filter(c => c.is_active).length,
      inactive: categories.filter(c => !c.is_active).length,
    };
  }, [adminCategories, categories, mode]);

  // ==================== FORMULAIRES ====================

  const getCategoryFormData = useCallback((category?: Partial<Category>) => {
    return {
      name: category?.name || '',
      description: category?.description || '',
      icon: category?.icon || 'bi:folder',
      color: category?.color || '#05579B',
      is_active: category?.is_active ?? true,
      parent_id: category?.parent_id,
    };
  }, []);

  return {
    // Données
    categories,
    adminCategories: adminCategories?.items || [],
    selectedCategory,
    filters,
    loading,
    error,
    pagination: adminCategories ? {
      total: adminCategories.total,
      page: adminCategories.page,
      pages: Math.ceil(adminCategories.total / adminCategories.per_page),
      perPage: adminCategories.per_page,
    } : null,
    statistics: getStatistics(),

    // Actions de chargement
    loadCategories,
    refresh: loadCategories,

    // Actions de filtrage
    updateFilters,
    resetFilters,

    // Pagination
    nextPage,
    prevPage,
    goToPage,

    // Sélection
    selectCategory,
    getCategoryById,

    // Recherche
    searchCategories,

    // Actions CRUD (admin)
    createCategory,
    updateCategory,
    deleteCategory,
    toggleCategoryStatus,

    // Utilitaires
    getCategoryFormData,
  };
};

// ==================== HOOK POUR LA HIÉRARCHIE ====================
/*
export const useCategoryHierarchy = () => {
  const { categories, loading } = useCategories({ mode: 'admin', autoLoad: true });

  const buildHierarchy = useCallback((parentId: number | null = null): Category[] => {
    return categories
      .filter(cat => cat.parent_id === parentId)
      .map(cat => ({
        ...cat,
        children: buildHierarchy(cat.id)
      }));
  }, [categories]);

  const getRootCategories = useCallback(() => {
    return categories.filter(cat => !cat.parent_id);
  }, [categories]);

  const getCategoryPath = useCallback((categoryId: number): Category[] => {
    const path: Category[] = [];
    let current = categories.find(c => c.id === categoryId);
    
    while (current) {
      path.unshift(current);
      current = categories.find(c => c.id === current?.parent_id);
    }
    
    return path;
  }, [categories]);

  const getChildCategories = useCallback((parentId: number): Category[] => {
    return categories.filter(cat => cat.parent_id === parentId);
  }, [categories]);

  const hasChildren = useCallback((categoryId: number): boolean => {
    return categories.some(cat => cat.parent_id === categoryId);
  }, [categories]);

  return {
    hierarchy: buildHierarchy(),
    rootCategories: getRootCategories(),
    getCategoryPath,
    getChildCategories,
    hasChildren,
    loading,
  };
};*/
