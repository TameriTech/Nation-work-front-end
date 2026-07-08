// hooks/categories/use-categories.ts

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/app/components/ui/use-toast";
import * as categoryService from "@/app/services/category.service";
import type {
  CategoryFiltersFormData,
  CategoryCreateFormData,
  CategoryUpdateFormData,
} from "@/app/lib/validators/category.validator";

// ==================== QUERY KEYS ====================

export const categoryKeys = {
  all: ["categories"] as const,
  lists: () => [...categoryKeys.all, "list"] as const,
  list: (filters?: CategoryFiltersFormData) => [...categoryKeys.lists(), filters] as const,
  details: () => [...categoryKeys.all, "detail"] as const,
  detail: (id: string) => [...categoryKeys.details(), id] as const,
  tree: () => [...categoryKeys.all, "tree"] as const,
  options: () => [...categoryKeys.all, "options"] as const,
  stats: () => [...categoryKeys.all, "stats"] as const,
  providerCategories: (providerId: string) => [...categoryKeys.all, "provider", providerId] as const,
};

// ==================== HOOK PRINCIPAL ====================

export const useCategories = (filters?: CategoryFiltersFormData) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // ==================== QUERIES ====================

  /**
   * Récupérer la liste des catégories
   */
  const categoriesQuery = useQuery({
    queryKey: categoryKeys.list(filters),
    queryFn: () => categoryService.getCategories(filters),
    staleTime: 5 * 60 * 1000,
  });

  /**
   * Récupérer l'arborescence des catégories
   */
  const treeQuery = useQuery({
    queryKey: categoryKeys.tree(),
    queryFn: () => categoryService.getCategoryTree(),
    staleTime: 10 * 60 * 1000,
  });

  /**
   * Récupérer les options pour les sélecteurs
   */
  const optionsQuery = useQuery({
    queryKey: categoryKeys.options(),
    queryFn: () => categoryService.getCategoryOptions(),
    staleTime: 10 * 60 * 1000,
  });

  
  // ==================== MUTATIONS ====================

  /**
   * Créer une catégorie
   */
  const createCategoryMutation = useMutation({
    mutationFn: (data: CategoryCreateFormData) => categoryService.createCategory(data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() });
      queryClient.invalidateQueries({ queryKey: categoryKeys.tree() });
      queryClient.invalidateQueries({ queryKey: categoryKeys.options() });
      queryClient.invalidateQueries({ queryKey: categoryKeys.stats() });
      
      toast({
        title: "Catégorie créée",
        description: response.message || "La catégorie a été créée avec succès",
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
   * Mettre à jour une catégorie
   */
  const updateCategoryMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: CategoryUpdateFormData }) =>
      categoryService.updateCategory(id, data),
    onSuccess: (response, variables) => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() });
      queryClient.invalidateQueries({ queryKey: categoryKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: categoryKeys.tree() });
      queryClient.invalidateQueries({ queryKey: categoryKeys.options() });
      
      toast({
        title: "Catégorie mise à jour",
        description: response.message || "La catégorie a été mise à jour avec succès",
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
   * Supprimer une catégorie
   */
  const deleteCategoryMutation = useMutation({
    mutationFn: (id: string) => categoryService.deleteCategory(id),
    onSuccess: (response, variables) => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() });
      queryClient.invalidateQueries({ queryKey: categoryKeys.detail(variables) });
      queryClient.invalidateQueries({ queryKey: categoryKeys.tree() });
      queryClient.invalidateQueries({ queryKey: categoryKeys.options() });
      queryClient.invalidateQueries({ queryKey: categoryKeys.stats() });
      
      toast({
        title: "Catégorie supprimée",
        description: response.message || "La catégorie a été supprimée avec succès",
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
   * Activer/Désactiver une catégorie
   */
  const toggleActiveMutation = useMutation({
    mutationFn: (id: string) => categoryService.toggleCategoryActive(id),
    onSuccess: (response, variables) => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() });
      queryClient.invalidateQueries({ queryKey: categoryKeys.detail(variables) });
      queryClient.invalidateQueries({ queryKey: categoryKeys.tree() });
      queryClient.invalidateQueries({ queryKey: categoryKeys.options() });
      queryClient.invalidateQueries({ queryKey: categoryKeys.stats() });
      
      toast({
        title: "Statut modifié",
        description: response.message || "Le statut de la catégorie a été modifié",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: error.message || "Impossible de modifier le statut",
        variant: "destructive",
      });
    },
  });

  return {
    // Données
    categories: categoriesQuery.data?.items || [],
    pagination: categoriesQuery ? {
      page: categoriesQuery.data?.page,
      total: categoriesQuery.data?.total,
      total_pages: categoriesQuery.data?.total_pages,
      per_page: categoriesQuery.data?.per_page,
    } : null,
    isLoading: categoriesQuery.isLoading,
    isError: categoriesQuery.isError,
    error: categoriesQuery.error,
    refetch: categoriesQuery.refetch,

    // Arbre
    tree: treeQuery.data?.data || [],
    treeLoading: treeQuery.isLoading,

    // Options
    options: optionsQuery.data?.data || [],
    optionsLoading: optionsQuery.isLoading,

    // Mutations
    createCategory: createCategoryMutation.mutate,
    isCreating: createCategoryMutation.isPending,
    createError: createCategoryMutation.error,

    updateCategory: updateCategoryMutation.mutate,
    isUpdating: updateCategoryMutation.isPending,
    updateError: updateCategoryMutation.error,

    deleteCategory: deleteCategoryMutation.mutate,
    isDeleting: deleteCategoryMutation.isPending,
    deleteError: deleteCategoryMutation.error,

    toggleActive: toggleActiveMutation.mutate,
    isToggling: toggleActiveMutation.isPending,
    toggleError: toggleActiveMutation.error,
  };
};

// ==================== HOOK POUR UNE CATÉGORIE SPÉCIFIQUE ====================

export const useCategory = (categoryId: string) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const categoryQuery = useQuery({
    queryKey: categoryKeys.detail(categoryId),
    queryFn: () => categoryService.getCategoryById(categoryId),
    enabled: !!categoryId,
    staleTime: 5 * 60 * 1000,
  });

  return {
    category: categoryQuery.data?.data || null,
    isLoading: categoryQuery.isLoading,
    isError: categoryQuery.isError,
    error: categoryQuery.error,
    refetch: categoryQuery.refetch,
  };
};

// ==================== HOOK POUR LES CATÉGORIES D'UN PROVIDER ====================

export const useProviderCategories = (providerId: string) => {
  const queryClient = useQueryClient();

  const providerCategoriesQuery = useQuery({
    queryKey: categoryKeys.providerCategories(providerId),
    queryFn: () => categoryService.getProviderCategories(providerId),
    enabled: !!providerId,
    staleTime: 5 * 60 * 1000,
  });

  return {
    categories: providerCategoriesQuery.data?.data || [],
    isLoading: providerCategoriesQuery.isLoading,
    isError: providerCategoriesQuery.isError,
    error: providerCategoriesQuery.error,
    refetch: providerCategoriesQuery.refetch,
  };
};

// ==================== HOOK ADMIN ====================

export const useAdminCategories = (filters?: CategoryFiltersFormData) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const adminCategoriesQuery = useQuery({
    queryKey: [...categoryKeys.lists(), "admin", filters],
    queryFn: () => categoryService.getCategories(filters),
    staleTime: 5 * 60 * 1000,
  });

  /**
   * Récupérer les statistiques des catégories
   */
  const statsQuery = useQuery({
    queryKey: categoryKeys.stats(),
    queryFn: () => categoryService.getCategoryStats(),
    staleTime: 5 * 60 * 1000,
  });


  const createCategoryMutation = useMutation({
    mutationFn: (data: CategoryCreateFormData) => categoryService.createCategory(data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() });
      queryClient.invalidateQueries({ queryKey: categoryKeys.tree() });
      queryClient.invalidateQueries({ queryKey: categoryKeys.options() });
      queryClient.invalidateQueries({ queryKey: categoryKeys.stats() });
      
      toast({
        title: "Catégorie créée",
        description: response.message || "La catégorie a été créée avec succès",
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

  const updateCategoryMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: CategoryUpdateFormData }) =>
      categoryService.updateCategory(id, data),
    onSuccess: (response, variables) => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() });
      queryClient.invalidateQueries({ queryKey: categoryKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: categoryKeys.tree() });
      queryClient.invalidateQueries({ queryKey: categoryKeys.options() });
      
      toast({
        title: "Catégorie mise à jour",
        description: response.message || "La catégorie a été mise à jour avec succès",
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

  const deleteCategoryMutation = useMutation({
    mutationFn: (id: string) => categoryService.deleteCategory(id),
    onSuccess: (response, variables) => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() });
      queryClient.invalidateQueries({ queryKey: categoryKeys.detail(variables) });
      queryClient.invalidateQueries({ queryKey: categoryKeys.tree() });
      queryClient.invalidateQueries({ queryKey: categoryKeys.options() });
      queryClient.invalidateQueries({ queryKey: categoryKeys.stats() });
      
      toast({
        title: "Catégorie supprimée",
        description: response.message || "La catégorie a été supprimée avec succès",
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

  const toggleActiveMutation = useMutation({
    mutationFn: (id: string) => categoryService.toggleCategoryActive(id),
    onSuccess: (response, variables) => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() });
      queryClient.invalidateQueries({ queryKey: categoryKeys.detail(variables) });
      queryClient.invalidateQueries({ queryKey: categoryKeys.tree() });
      queryClient.invalidateQueries({ queryKey: categoryKeys.options() });
      queryClient.invalidateQueries({ queryKey: categoryKeys.stats() });
      
      toast({
        title: "Statut modifié",
        description: response.message || "Le statut de la catégorie a été modifié",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: error.message || "Impossible de modifier le statut",
        variant: "destructive",
      });
    },
  });

  return {
    categories: adminCategoriesQuery.data?.items || [],
    pagination: adminCategoriesQuery ? {
      page: adminCategoriesQuery.data?.page,
      total: adminCategoriesQuery.data?.total,
      total_pages: adminCategoriesQuery.data?.total_pages,
      per_page: adminCategoriesQuery.data?.per_page,
    } : null,
    isLoading: adminCategoriesQuery.isLoading,
    isError: adminCategoriesQuery.isError,
    error: adminCategoriesQuery.error,
    refetch: adminCategoriesQuery.refetch,
    
    // Statistiques
    stats: statsQuery.data?.data || null,
    statsLoading: statsQuery.isLoading,

    createCategory: createCategoryMutation.mutate,
    isCreating: createCategoryMutation.isPending,

    updateCategory: updateCategoryMutation.mutate,
    isUpdating: updateCategoryMutation.isPending,

    deleteCategory: deleteCategoryMutation.mutate,
    isDeleting: deleteCategoryMutation.isPending,

    toggleActive: toggleActiveMutation.mutate,
    isToggling: toggleActiveMutation.isPending,
  };
};
