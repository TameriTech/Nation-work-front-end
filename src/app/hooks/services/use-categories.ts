// hooks/categories/useCategories.ts

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/components/ui/use-toast';
import * as categoryService from '@/services/category.service';
import type { Category, CategoryFilters, PaginatedResponse } from '@/app/types/category';

// ==================== CLÉS DE QUERY ====================

export const categoryKeys = {
  all: ['categories'] as const,
  lists: () => [...categoryKeys.all, 'list'] as const,
  list: (filters: any) => [...categoryKeys.lists(), filters] as const,
  details: () => [...categoryKeys.all, 'detail'] as const,
  detail: (id: number) => [...categoryKeys.details(), id] as const,
  stats: () => [...categoryKeys.all, 'stats'] as const,
  admin: (filters: any) => [...categoryKeys.all, 'admin', filters] as const,
};

// ==================== HOOK PRINCIPAL ====================

export const useCategories = (filters?: CategoryFilters, isAdmin: boolean = false) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // ==================== QUERIES ====================

  /**
   * Récupère toutes les catégories (public)
   */
  const categoriesQuery = useQuery({
    queryKey: isAdmin ? categoryKeys.admin(filters) : categoryKeys.list(filters),
    queryFn: () => isAdmin 
      ? categoryService.getAllCategories(filters)
      : categoryService.getCategories(filters),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });

  /**
   * Récupère une catégorie par son ID
   */
  const getCategoryById = (id: number) => {
    return useQuery({
      queryKey: categoryKeys.detail(id),
      queryFn: () => categoryService.getCategoryById(id),
      enabled: !!id,
      staleTime: 10 * 60 * 1000,
    });
  };

  /**
   * Récupère les statistiques des catégories
   */
  const statsQuery = useQuery({
    queryKey: categoryKeys.stats(),
    queryFn: () => categoryService.getCategoryStats(),
    staleTime: 30 * 60 * 1000, // 30 minutes
  });

  // ==================== MUTATIONS ADMIN ====================

  /**
   * Crée une nouvelle catégorie (admin)
   */
  const createCategoryMutation = useMutation({
    mutationFn: (data: Omit<Category, 'id' | 'created_at' | 'updated_at'>) =>
      categoryService.createCategory(data),
    onSuccess: (newCategory) => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.admin({}) });
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() });
      
      toast({
        title: "Catégorie créée",
        description: `La catégorie "${newCategory.name}" a été créée`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: error.message || "Impossible de créer la catégorie",
        variant: "destructive",
      });
    },
  });

  /**
   * Met à jour une catégorie (admin)
   */
  const updateCategoryMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Category> }) =>
      categoryService.updateCategory(id, data),
    onSuccess: (updatedCategory) => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.admin({}) });
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() });
      queryClient.setQueryData(categoryKeys.detail(updatedCategory.id), updatedCategory);
      
      toast({
        title: "Catégorie mise à jour",
        description: `La catégorie "${updatedCategory.name}" a été modifiée`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: error.message || "Impossible de mettre à jour la catégorie",
        variant: "destructive",
      });
    },
  });

  /**
   * Supprime une catégorie (admin)
   */
  const deleteCategoryMutation = useMutation({
    mutationFn: (id: number) => categoryService.deleteCategory(id),
    onSuccess: (_, deletedId) => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.admin({}) });
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() });
      queryClient.removeQueries({ queryKey: categoryKeys.detail(deletedId) });
      
      toast({
        title: "Catégorie supprimée",
        description: "La catégorie a été supprimée",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: error.message || "Impossible de supprimer la catégorie",
        variant: "destructive",
      });
    },
  });

  /**
   * Active/désactive une catégorie (admin)
   */
  const toggleCategoryStatusMutation = useMutation({
    mutationFn: ({ id, isActive }: { id: number; isActive: boolean }) =>
      categoryService.toggleCategoryStatus(id, isActive),
    onSuccess: (updatedCategory) => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.admin({}) });
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() });
      
      toast({
        title: updatedCategory.is_active ? "Catégorie activée" : "Catégorie désactivée",
        description: `La catégorie "${updatedCategory.name}" est maintenant ${
          updatedCategory.is_active ? 'active' : 'inactive'
        }`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: error.message || "Impossible de changer le statut",
        variant: "destructive",
      });
    },
  });

  // ==================== RETOUR DU HOOK ====================

  return {
    // Données
    categories: categoriesQuery.data?.categories || categoriesQuery.data || [],
    pagination: categoriesQuery.data && 'pagination' in categoriesQuery.data 
      ? categoriesQuery.data.pagination 
      : null,
    isLoading: categoriesQuery.isLoading,
    error: categoriesQuery.error,
    stats: statsQuery.data,
    isLoadingStats: statsQuery.isLoading,

    // Récupération par ID
    getCategoryById,

    // Mutations (disponibles seulement en mode admin)
    ...(isAdmin && {
      createCategory: createCategoryMutation.mutate,
      isCreating: createCategoryMutation.isPending,

      updateCategory: updateCategoryMutation.mutate,
      isUpdating: updateCategoryMutation.isPending,

      deleteCategory: deleteCategoryMutation.mutate,
      isDeleting: deleteCategoryMutation.isPending,

      toggleCategoryStatus: toggleCategoryStatusMutation.mutate,
      isToggling: toggleCategoryStatusMutation.isPending,
    }),

    // Rafraîchissement
    refetch: () => queryClient.invalidateQueries({ 
      queryKey: isAdmin ? categoryKeys.admin(filters) : categoryKeys.list(filters) 
    }),
  };
};
