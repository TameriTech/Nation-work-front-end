// hooks/services/useClientServices.ts

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/app/components/ui/use-toast';
import * as serviceService from '@/app/services/service.service';
import type { 
  Service, 
  CreateServiceDto, 
  ServiceFilters,
  PaginatedResponse 
} from '@/app/types/services';

// ==================== CLÉS DE QUERY ====================

export const clientServiceKeys = {
  all: ['client-services'] as const,
  lists: () => [...clientServiceKeys.all, 'list'] as const,
  list: (filters: any) => [...clientServiceKeys.lists(), filters] as const,
  details: (id: number) => [...clientServiceKeys.all, 'detail', id] as const,
};

// ==================== HOOK PRINCIPAL ====================

export const useClientServices = (filters?: ServiceFilters) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // ==================== QUERIES ====================

  /**
   * Récupère les services du client connecté
   */
  const clientServicesQuery = useQuery({
    queryKey: clientServiceKeys.list(filters),
    queryFn: () => serviceService.getClientServices(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  /**
   * Récupère les détails d'un service client avec ses candidatures
   */
  const getClientServiceDetails = (serviceId: number) => {
    return useQuery({
      queryKey: clientServiceKeys.details(serviceId),
      queryFn: () => serviceService.getClientServiceDetails(serviceId),
      enabled: !!serviceId,
      staleTime: 2 * 60 * 1000, // 2 minutes
    });
  };

  // ==================== MUTATIONS ====================

  /**
   * Publie un nouveau service (client)
   */
  const publishServiceMutation = useMutation({
    mutationFn: (data: CreateServiceDto) => serviceService.publishService(data),
    onSuccess: (newService) => {
      // Invalider les listes
      queryClient.invalidateQueries({ queryKey: clientServiceKeys.lists() });
      
      toast({
        title: "Service publié",
        description: "Votre service a été publié avec succès",
      });
      
      // Rediriger vers la page du service
      return newService;
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: error.message || "Impossible de publier le service",
        variant: "destructive",
      });
    },
  });

  /**
   * Met à jour un service client
   */
  const updateClientServiceMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<CreateServiceDto> }) =>
      serviceService.updateService(id, data),
    onSuccess: (updatedService) => {
      queryClient.invalidateQueries({ queryKey: clientServiceKeys.lists() });
      queryClient.invalidateQueries({ 
        queryKey: clientServiceKeys.details(updatedService.id) 
      });
      
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
   * Supprime un service client
   */
  const deleteClientServiceMutation = useMutation({
    mutationFn: (id: number) => serviceService.deleteService(id),
    onSuccess: (_, deletedId) => {
      queryClient.invalidateQueries({ queryKey: clientServiceKeys.lists() });
      queryClient.removeQueries({ queryKey: clientServiceKeys.details(deletedId) });
      
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
   * Assigne un freelancer à un service
   */
  const assignFreelancerMutation = useMutation({
    mutationFn: ({ serviceId, freelancerId }: { serviceId: number; freelancerId: number }) =>
      serviceService.assignFreelancer(serviceId, freelancerId),
    onSuccess: (updatedService) => {
      queryClient.invalidateQueries({ queryKey: clientServiceKeys.lists() });
      queryClient.setQueryData(clientServiceKeys.details(updatedService.service.id), updatedService);
      
      toast({
        title: "Freelancer assigné",
        description: "Le freelancer a été assigné au service",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: error.message || "Impossible d'assigner le freelancer",
        variant: "destructive",
      });
    },
  });

  /**
   * Marque un service comme terminé
   */
  const completeServiceMutation = useMutation({
    mutationFn: (serviceId: number) => serviceService.completeService(serviceId),
    onSuccess: (updatedService) => {
      queryClient.invalidateQueries({ queryKey: clientServiceKeys.lists() });
      queryClient.setQueryData(clientServiceKeys.details(updatedService.service.id), updatedService);
      
      toast({
        title: "Service terminé",
        description: "Le service a été marqué comme terminé",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: error.message || "Impossible de terminer le service",
        variant: "destructive",
      });
    },
  });

  // ==================== RETOUR DU HOOK ====================

  return {
    // Données
    services: clientServicesQuery.data?.services || [],
    pagination: clientServicesQuery.data ? {
      total: clientServicesQuery.data.total,
      page: clientServicesQuery.data.page,
      pages: Math.ceil(clientServicesQuery.data.total / clientServicesQuery.data.per_page),
      perPage: clientServicesQuery.data.per_page,
    } : null,
    isLoading: clientServicesQuery.isLoading,
    error: clientServicesQuery.error,
    refetch: clientServicesQuery.refetch,

    // Détails
    getClientServiceDetails,

    // Mutations
    publishService: publishServiceMutation.mutate,
    isPublishing: publishServiceMutation.isPending,

    updateService: updateClientServiceMutation.mutate,
    isUpdating: updateClientServiceMutation.isPending,

    deleteService: deleteClientServiceMutation.mutate,
    isDeleting: deleteClientServiceMutation.isPending,

    assignFreelancer: assignFreelancerMutation.mutate,
    isAssigning: assignFreelancerMutation.isPending,

    completeService: completeServiceMutation.mutate,
    isCompleting: completeServiceMutation.isPending,
  };
};
