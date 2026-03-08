// hooks/categories/useCategories.ts

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/app/components/ui/use-toast';
import * as categoryService from '@/app/services/category.service';
import type { Category, CategoryFilters, CreateCategoryDTO, PaginatedResponse } from '@/app/types';
import { CategoryFormData } from '@/app/lib/validators';

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

// ==================== HOOK PUBLIC ====================

/**
 * Hook pour les utilisateurs publics - retourne les catégories actives sans mutations
 */
export const usePublicCategories = (filters?: CategoryFilters) => {
  const categoriesQuery = useQuery({
    queryKey: categoryKeys.list(filters),
    queryFn: async () => {
      const response = await categoryService.getCategories();
      return response;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  });

  return {
    categories: categoriesQuery.data || [],
    isLoading: categoriesQuery.isLoading,
    error: categoriesQuery.error,
    refetch: categoriesQuery.refetch,
  };
};

// ==================== HOOK ADMIN ====================

/**
 * Hook pour les administrateurs - inclut toutes les catégories et les mutations
 */
export const useAdminCategories = (filters?: CategoryFilters) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Query pour les catégories (admin)
  const categoriesQuery = useQuery({
    queryKey: categoryKeys.admin(filters),
    queryFn: async () => {
      const response = await categoryService.getAllCategories(filters || {});
      return {
        items: response.items || [],
        total: response.total || 0,
        page: response.page || 1,
        per_page: response.per_page || 10,
        total_pages: response.total_pages || 1
      };
    },
    staleTime: 10 * 60 * 1000,
  });

  // Query pour les statistiques
  const statsQuery = useQuery({
    queryKey: categoryKeys.stats(),
    queryFn: async () => {
      const response = await categoryService.getCategoryStats();
      return response;
    },
    staleTime: 30 * 60 * 1000, // 30 minutes
  });

  // Fonction pour récupérer une catégorie par ID
  const useGetCategoryById = (id: number) => {
    return useQuery({
      queryKey: categoryKeys.detail(id),
      queryFn: () => categoryService.getCategoryById(id),
      enabled: !!id,
      staleTime: 10 * 60 * 1000,
    });
  };

  // Mutation pour créer une catégorie
  const createCategoryMutation = useMutation({
    mutationFn: (data: CreateCategoryDTO) => categoryService.createCategory(data),
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

  // Mutation pour mettre à jour une catégorie
  const updateCategoryMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: CategoryFormData }) =>
      categoryService.updateCategory(id, data),
    onSuccess: (updatedCategory) => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.admin({}) });
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() });
      queryClient.invalidateQueries({ queryKey: categoryKeys.detail(updatedCategory.id) });
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

  // Mutation pour supprimer une catégorie
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

  // Mutation pour activer/désactiver une catégorie
  const toggleCategoryStatusMutation = useMutation({
    mutationFn: ({ id, isActive }: { id: number; isActive: boolean }) =>
      categoryService.toggleCategoryStatus(id, isActive),
    onSuccess: (updatedCategory) => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.admin({}) });
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() });
      toast({
        title: updatedCategory.category.is_active ? "Catégorie activée" : "Catégorie désactivée",
        description: `La catégorie "${updatedCategory.category.name}" est maintenant ${
          updatedCategory.category.is_active ? 'active' : 'inactive'
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

  return {
    // Données
    categories: categoriesQuery.data?.items || [],
    pagination: categoriesQuery.data ? {
      total: categoriesQuery.data.total,
      page: categoriesQuery.data.page,
      perPage: categoriesQuery.data.per_page,
      totalPages: categoriesQuery.data.total_pages,
    } : null,
    isLoading: categoriesQuery.isLoading,
    error: categoriesQuery.error,
    
    // Statistiques
    stats: statsQuery.data,
    isLoadingStats: statsQuery.isLoading,
    statsError: statsQuery.error,

    // Récupération par ID
    useGetCategoryById,

    // Mutations admin
    createCategory: createCategoryMutation.mutate,
    isCreating: createCategoryMutation.isPending,

    updateCategory: updateCategoryMutation.mutate,
    isUpdating: updateCategoryMutation.isPending,

    deleteCategory: deleteCategoryMutation.mutate,
    isDeleting: deleteCategoryMutation.isPending,

    toggleCategoryStatus: toggleCategoryStatusMutation.mutate,
    isToggling: toggleCategoryStatusMutation.isPending,

    // Rafraîchissement
    refetch: () => queryClient.invalidateQueries({ 
      queryKey: categoryKeys.admin(filters) 
    }),
    refetchStats: () => queryClient.invalidateQueries({ 
      queryKey: categoryKeys.stats() 
    }),
  };
};

// ==================== HOOK UNIFIÉ (RÉTROCOMPATIBILITÉ) ====================

/**
 * Hook unifié pour la rétrocompatibilité
 */
export const useCategories = (filters?: CategoryFilters, isAdmin: boolean = false) => {
  const publicHook = usePublicCategories(filters);
  const adminHook = useAdminCategories(filters);

  if (isAdmin) {
    return {
      ...adminHook,
      // S'assurer que toutes les propriétés nécessaires sont présentes
      categories: adminHook.categories,
      pagination: adminHook.pagination,
      isLoading: adminHook.isLoading,
      error: adminHook.error,
      stats: adminHook.stats,
      isLoadingStats: adminHook.isLoadingStats,
      createCategory: adminHook.createCategory,
      isCreating: adminHook.isCreating,
      updateCategory: adminHook.updateCategory,
      isUpdating: adminHook.isUpdating,
      deleteCategory: adminHook.deleteCategory,
      isDeleting: adminHook.isDeleting,
      toggleCategoryStatus: adminHook.toggleCategoryStatus,
      isToggling: adminHook.isToggling,
      refetch: adminHook.refetch,
      refetchStats: adminHook.refetchStats,
      useGetCategoryById: adminHook.useGetCategoryById,
    };
  }

  return {
    ...publicHook,
    // Propriétés admin undefined pour le typage
    stats: undefined,
    isLoadingStats: false,
    createCategory: undefined,
    isCreating: false,
    updateCategory: undefined,
    isUpdating: false,
    deleteCategory: undefined,
    isDeleting: false,
    toggleCategoryStatus: undefined,
    isToggling: false,
    refetchStats: undefined,
    useGetCategoryById: undefined,
  };
};
