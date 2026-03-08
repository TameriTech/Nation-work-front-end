// hooks/services/useServices.ts

import { useMutation, useQuery, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import { useToast } from '@/app/components/ui/use-toast';
import * as serviceService from '@/app/services/service.service';
import { useMemo } from 'react';
import type { 
  Service, 
  CreateServiceDto, 
  ServiceFilters,
  PaginatedResponse,
  ServiceStatus
} from '@/app/types';

// ==================== CLÉS DE QUERY ====================

export const serviceKeys = {
  all: ['services'] as const,
  lists: () => [...serviceKeys.all, 'list'] as const,
  list: (filters: any) => [...serviceKeys.lists(), filters] as const,
  details: () => [...serviceKeys.all, 'detail'] as const,
  detail: (id: number) => [...serviceKeys.details(), id] as const,
  search: (query: string) => [...serviceKeys.all, 'search', query] as const,
  stats: (mode?: string) => [...serviceKeys.all, 'stats', mode] as const,
};

// ==================== HOOK PRINCIPAL ====================

interface UseServicesProps {
  filters?: ServiceFilters;
  mode?: 'all' | 'client' | 'freelancer';
}

export const useServices = ({ filters, mode = 'all' }: UseServicesProps = {}) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // ==================== QUERIES ====================

  /**
   * Récupère les services selon le mode
   */
  const servicesQuery = useQuery({
    queryKey: serviceKeys.list({ ...filters, mode }),
    queryFn: () => {
      if (mode === 'client') {
        return serviceService.getClientServices(filters);
      } else if (mode === 'freelancer') {
        return serviceService.getFreelancerServices(filters);
      }
      return serviceService.getAdminServices(filters);
    },
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

  /**
   * Récupère un service par son ID
   */
  const getAdminServiceDetails = (id: number) => {
    return useQuery({
      queryKey: serviceKeys.detail(id),
      queryFn: () => serviceService.getAdminServiceDetails(id),
      enabled: !!id,
      staleTime: 5 * 60 * 1000,
    });
  };

  // ==================== STATISTIQUES ====================

  /**
   * Statistiques globales calculées à partir des services
   */
  const stats = useMemo(() => {
    const services = servicesQuery.data?.items || [];
    
    const published = services.filter(s => s.status === 'published').length;
    const inProgress = services.filter(s => s.status === 'in_progress').length;
    const assigned = services.filter(s => s.status === 'assigned').length;
    const completed = services.filter(s => s.status === 'completed').length;
    const canceled = services.filter(s => s.status === 'disputed').length;
    const draft = services.filter(s => s.status === 'cancelled').length;
    const total = services.length;

    // Montants totaux
    const totalProposedAmount = services.reduce((sum, s) => sum + (s.proposed_amount || 0), 0);
    const totalAcceptedAmount = services.reduce((sum, s) => sum + (s.accepted_amount || 0), 0);
    
    // Services avec candidatures
    const servicesWithCandidatures = services.filter(s => (s.candidatures_count || 0) > 0).length;
    const totalCandidatures = services.reduce((sum, s) => sum + (s.candidatures_count || 0), 0);

    // Prochain service à venir
    const upcomingServices = services
      .filter(s => s.status === 'assigned' || s.status === 'in_progress')
      .sort((a, b) => new Date(a.date_pratique).getTime() - new Date(b.date_pratique).getTime());
    
    const nextService = upcomingServices[0];

    // Distribution par statut pour les graphiques
    const distribution = [
      { name: 'Publié', value: published, color: '#1e40af' },
      { name: 'En cours', value: inProgress + assigned, color: '#f59e0b' },
      { name: 'Terminé', value: completed, color: '#10b981' },
      { name: 'Annulé', value: canceled, color: '#ef4444' },
      { name: 'Brouillon', value: draft, color: '#6b7280' },
    ].filter(item => item.value > 0);

    // Évolution par mois (pour les graphiques)
    const evolutionByMonth = services.reduce((acc, service) => {
      const date = new Date(service.created_at);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      if (!acc[monthKey]) {
        acc[monthKey] = { month: monthKey, count: 0, amount: 0 };
      }
      acc[monthKey].count += 1;
      acc[monthKey].amount += service.proposed_amount || 0;
      
      return acc;
    }, {} as Record<string, { month: string; count: number; amount: number }>);

    const evolution = Object.values(evolutionByMonth).sort((a, b) => a.month.localeCompare(b.month));

    return {
      // Compteurs par statut
      published,
      inProgress,
      assigned,
      completed,
      canceled,
      draft,
      total,
      
      // Pourcentages
      completionRate: total > 0 ? (completed / total) * 100 : 0,
      cancellationRate: total > 0 ? (canceled / total) * 100 : 0,
      inProgressRate: total > 0 ? ((inProgress + assigned) / total) * 100 : 0,
      
      // Montants
      totalProposedAmount,
      totalAcceptedAmount,
      averageProposedAmount: total > 0 ? totalProposedAmount / total : 0,
      averageAcceptedAmount: completed > 0 ? totalAcceptedAmount / completed : 0,
      
      // Candidatures
      servicesWithCandidatures,
      totalCandidatures,
      averageCandidaturesPerService: total > 0 ? totalCandidatures / total : 0,
      
      // Prochain service
      nextService,
      hasUpcomingServices: upcomingServices.length > 0,
      
      // Données pour graphiques
      distribution,
      evolution,
      
      // Résumé texte
      summary: {
        active: inProgress + assigned,
        totalValue: totalAcceptedAmount || totalProposedAmount,
        engagement: totalCandidatures > 0 ? 'Élevé' : 'Faible',
      },
    };
  }, [servicesQuery.data]);

  /**
   * Récupère les statistiques d'un service spécifique
   */
  const getServiceStats = (serviceId: number) => {
    const service = servicesQuery.data?.items.find(s => s.id === serviceId);
    if (!service) return null;

    return {
      candidaturesCount: service.candidatures_count || 0,
      views: service.views_count || 0,
      applications: service.candidatures_count || 0,
      timeSincePosted: service.created_at ? 
        Math.floor((Date.now() - new Date(service.created_at).getTime()) / (1000 * 60 * 60 * 24)) : 0,
      isExpiringSoon: service.date_pratique ? 
        new Date(service.date_pratique).getTime() - Date.now() < 7 * 24 * 60 * 60 * 1000 : false,
    };
  };

  // ==================== MUTATIONS ====================

  /**
   * Crée un nouveau service
   */
  const createServiceMutation = useMutation({
    mutationFn: (data: CreateServiceDto) => serviceService.publishService(data),
    onSuccess: (newService) => {
      queryClient.invalidateQueries({ queryKey: serviceKeys.lists() });
      queryClient.setQueryData(serviceKeys.detail(newService.id), newService);
      queryClient.invalidateQueries({ queryKey: serviceKeys.stats(mode) });
      
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
      queryClient.invalidateQueries({ queryKey: serviceKeys.lists() });
      queryClient.setQueryData(serviceKeys.detail(updatedService.id), updatedService);
      queryClient.invalidateQueries({ queryKey: serviceKeys.stats(mode) });
      
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
      queryClient.invalidateQueries({ queryKey: serviceKeys.lists() });
      queryClient.removeQueries({ queryKey: serviceKeys.detail(deletedId) });
      queryClient.invalidateQueries({ queryKey: serviceKeys.stats(mode) });
      
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
    mutationFn: ({ id, status, reason, notify }: { id: number; status: ServiceStatus; reason?: string; notify?: boolean }) =>
      serviceService.updateServiceStatus(id, status, reason, notify),
    onSuccess: (updatedService) => {
      queryClient.invalidateQueries({ queryKey: serviceKeys.lists() });
      queryClient.setQueryData(serviceKeys.detail(updatedService.service.id), updatedService);
      queryClient.invalidateQueries({ queryKey: serviceKeys.stats(mode) });
      
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
      serviceService.searchServices({ page: pageParam, per_page: 10 }),
    getNextPageParam: (lastPage, allPages) => {
      const totalPages = Math.ceil(lastPage.total / lastPage.per_page);
      if (lastPage.page >= totalPages) return undefined;
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
      queryClient.setQueryData(serviceKeys.list({ ...searchFilters, mode }), results);
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
    services: servicesQuery.data?.items || [],
    pagination: servicesQuery.data ? {
      total: servicesQuery.data.total,
      page: servicesQuery.data.page,
      pages: Math.ceil(servicesQuery.data.total / servicesQuery.data.per_page),
      perPage: servicesQuery.data.per_page,
    } : null,
    isLoading: servicesQuery.isLoading,
    error: servicesQuery.error,
    refetch: servicesQuery.refetch,

    // Statistiques
    stats,
    getServiceStats,

    // Récupération par ID
    getServiceById,

    // Recupereration par ID (admin)
    getAdminServiceDetails,

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
    searchResults: searchInfiniteQuery.data?.pages.flatMap(p => p.items) || [],
    hasMore: searchInfiniteQuery.hasNextPage,
    loadMore: searchInfiniteQuery.fetchNextPage,
    isSearching: searchInfiniteQuery.isFetching,
  };
};