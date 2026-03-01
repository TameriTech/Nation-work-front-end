// hooks/services/useServices.ts

import { useMutation, useQuery, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import { useToast } from '@/app/components/ui/use-toast';
import * as serviceService from '@/app/services/service.service';
import type { 
  Service, 
  CreateServiceDto, 
  ServiceFilters,
  PaginatedResponse,
  ServiceStatus
} from '@/app/types/services';

// ==================== CLÉS DE QUERY ====================

export const serviceKeys = {
  all: ['services'] as const,
  lists: () => [...serviceKeys.all, 'list'] as const,
  list: (filters: any) => [...serviceKeys.lists(), filters] as const,
  details: () => [...serviceKeys.all, 'detail'] as const,
  detail: (id: number) => [...serviceKeys.details(), id] as const,
  search: (query: string) => [...serviceKeys.all, 'search', query] as const,
};

// ==================== HOOK PRINCIPAL ====================

export const useServices = (filters?: ServiceFilters) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // ==================== QUERIES ====================

  /**
   * Récupère tous les services avec pagination et filtres
   */
  const servicesQuery = useQuery({
    queryKey: serviceKeys.list(filters),
    queryFn: () => serviceService.searchServices(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  /**
   * Récupère un service par son ID
   */
  const getServiceById = (id: number) => {
    return useQuery({
      queryKey: serviceKeys.detail(id),
      queryFn: () => serviceService.getServiceDetails(id),
      enabled: !!id,
      staleTime: 5 * 60 * 1000,
    });
  };

  // ==================== MUTATIONS ====================

  /**
   * Crée un nouveau service
   */
  const createServiceMutation = useMutation({
    mutationFn: (data: CreateServiceDto) => serviceService.publishService(data),
    onSuccess: (newService) => {
      // Invalider les listes
      queryClient.invalidateQueries({ queryKey: serviceKeys.lists() });
      
      // Ajouter le nouveau service au cache
      queryClient.setQueryData(serviceKeys.detail(newService.id), newService);
      
      toast({
        title: "Service créé",
        description: "Votre service a été publié avec succès",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: error.message || "Impossible de créer le service",
        variant: "destructive",
      });
    },
  });

  /**
   * Met à jour un service
   */
  const updateServiceMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<CreateServiceDto> }) =>
      serviceService.updateService(id, data),
    onSuccess: (updatedService) => {
      // Invalider les listes et le détail
      queryClient.invalidateQueries({ queryKey: serviceKeys.lists() });
      queryClient.setQueryData(serviceKeys.detail(updatedService.id), updatedService);
      
      toast({
        title: "Service mis à jour",
        description: "Les modifications ont été enregistrées",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: error.message || "Impossible de mettre à jour le service",
        variant: "destructive",
      });
    },
  });

  /**
   * Supprime un service
   */
  const deleteServiceMutation = useMutation({
    mutationFn: (id: number) => serviceService.deleteService(id),
    onSuccess: (_, deletedId) => {
      // Invalider les listes et retirer du cache
      queryClient.invalidateQueries({ queryKey: serviceKeys.lists() });
      queryClient.removeQueries({ queryKey: serviceKeys.detail(deletedId) });
      
      toast({
        title: "Service supprimé",
        description: "Le service a été supprimé avec succès",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: error.message || "Impossible de supprimer le service",
        variant: "destructive",
      });
    },
  });

  /**
   * Change le statut d'un service
   */
  const changeStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: ServiceStatus }) =>
      serviceService.updateServiceStatus(id, status),
    onSuccess: (updatedService) => {
      queryClient.invalidateQueries({ queryKey: serviceKeys.lists() });
      queryClient.setQueryData(serviceKeys.detail(updatedService.service.id), updatedService);
      
      toast({
        title: "Statut mis à jour",
        description: `Le service est maintenant ${updatedService.service.status}`,
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

  // ==================== RECHERCHE ====================

  /**
   * Recherche de services avec pagination infinie
   */
  const searchInfiniteQuery = useInfiniteQuery({
    queryKey: serviceKeys.search(''),
    queryFn: ({ pageParam = 1 }) => 
      serviceService.searchServices({ page: pageParam, limit: 10 }),
    getNextPageParam: (lastPage, allPages) => {
      if (!Math.ceil(lastPage.total / lastPage.per_page) || lastPage.page >= Math.ceil(lastPage.total / lastPage.per_page)) return undefined;
      return allPages.length + 1;
    },
    initialPageParam: 1,
    enabled: false,
  });

  /**
   * Recherche avec filtres
   */
  const search = async (searchFilters: ServiceFilters) => {
    try {
      const results = await serviceService.searchServices(searchFilters);
      queryClient.setQueryData(serviceKeys.list(searchFilters), results);
      return results;
    } catch (error: any) {
      toast({
        title: "Erreur de recherche",
        description: error.message || "Impossible d'effectuer la recherche",
        variant: "destructive",
      });
      throw error;
    }
  };

  // ==================== RETOUR DU HOOK ====================

  return {
    // Données
    services: servicesQuery.data?.services || [],
    pagination: servicesQuery.data ? {
      total: servicesQuery.data.total,
      page: servicesQuery.data.page,
      pages: Math.ceil(servicesQuery.data.total / servicesQuery.data.per_page),
      perPage: servicesQuery.data.per_page,
    } : null,
    isLoading: servicesQuery.isLoading,
    error: servicesQuery.error,
    refetch: servicesQuery.refetch,

    // Récupération par ID
    getServiceById,

    // Mutations
    createService: createServiceMutation.mutate,
    isCreating: createServiceMutation.isPending,
    
    updateService: updateServiceMutation.mutate,
    isUpdating: updateServiceMutation.isPending,
    
    deleteService: deleteServiceMutation.mutate,
    isDeleting: deleteServiceMutation.isPending,
    
    changeStatus: changeStatusMutation.mutate,
    isChangingStatus: changeStatusMutation.isPending,

    // Recherche
    search,
    searchResults: searchInfiniteQuery.data?.pages.flatMap(p => p.services) || [],
    hasMore: searchInfiniteQuery.hasNextPage,
    loadMore: searchInfiniteQuery.fetchNextPage,
    isSearching: searchInfiniteQuery.isFetching,
  };
};