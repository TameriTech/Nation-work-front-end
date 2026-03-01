// hooks/services/useFreelancerServices.ts

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/components/ui/use-toast';
import * as serviceService from '@/services/service.service';
import * as candidatureService from '@/services/candidatures.service';
import type { 
  Service, 
  ServiceFilters,
  PaginatedResponse 
} from '@/app/types/services';

// ==================== CLÉS DE QUERY ====================

export const freelancerServiceKeys = {
  all: ['freelancer-services'] as const,
  assigned: (filters: any) => [...freelancerServiceKeys.all, 'assigned', filters] as const,
  available: (filters: any) => [...freelancerServiceKeys.all, 'available', filters] as const,
  applications: (filters: any) => [...freelancerServiceKeys.all, 'applications', filters] as const,
};


export const useServiceDetails = (serviceId: number) => {
  return useQuery({
    queryKey: serviceKeys.detail(serviceId),
    queryFn: () => serviceService.getServiceDetails(serviceId),
    enabled: !!serviceId,
    staleTime: 5 * 60 * 1000,
  });
};

// ==================== HOOK PRINCIPAL ====================

export const useFreelancerServices = (filters?: ServiceFilters) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // ==================== QUERIES ====================

  /**
   * Récupère les services assignés au freelancer
   */
  const assignedServicesQuery = useQuery({
    queryKey: freelancerServiceKeys.assigned(filters),
    queryFn: () => serviceService.getFreelancerServices({ ...filters, status: 'assigned' }),
    staleTime: 5 * 60 * 1000,
  });

  /**
   * Récupère les services disponibles (pour postuler)
   */
  const availableServicesQuery = useQuery({
    queryKey: freelancerServiceKeys.available(filters),
    queryFn: () => serviceService.searchServices(filters),
    staleTime: 5 * 60 * 1000,
  });

  /**
   * Récupère les services auxquels le freelancer a postulé
   */
  const applicationsQuery = useQuery({
    queryKey: freelancerServiceKeys.applications(filters),
    queryFn: async () => {
      // Récupérer d'abord les candidatures du freelancer
      const candidatures = await candidatureService.getCandidaturesByFreelancer(0); // ID sera géré côté API
      // Récupérer les détails de chaque service
      const services = await Promise.all(
        candidatures.map(c => serviceService.getServiceDetails(c.service_id))
      );
      return services;
    },
    staleTime: 5 * 60 * 1000,
  });

  // ==================== MUTATIONS ====================

  /**
   * Postuler à un service
   */
  const applyToServiceMutation = useMutation({
    mutationFn: ({ serviceId, message, proposedAmount }: { 
      serviceId: number; 
      message?: string; 
      proposedAmount?: number;
    }) => candidatureService.createCandidature({
      service_id: serviceId,
      freelancer_id: 0, // Sera géré côté API
      message,
      proposed_amount: proposedAmount,
    }),
    onSuccess: (_, variables) => {
      // Invalider les listes
      queryClient.invalidateQueries({ 
        queryKey: freelancerServiceKeys.applications(filters) 
      });
      
      toast({
        title: "Candidature envoyée",
        description: "Votre candidature a été soumise avec succès",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: error.message || "Impossible de postuler",
        variant: "destructive",
      });
    },
  });

  /**
   * Retirer sa candidature
   */
  const withdrawApplicationMutation = useMutation({
    mutationFn: (candidatureId: number) => 
      candidatureService.deleteCandidature(candidatureId),
    onSuccess: () => {
      queryClient.invalidateQueries({ 
        queryKey: freelancerServiceKeys.applications(filters) 
      });
      
      toast({
        title: "Candidature retirée",
        description: "Votre candidature a été retirée",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: error.message || "Impossible de retirer la candidature",
        variant: "destructive",
      });
    },
  });

  /**
   * Accepter une mission (service assigné)
   */
  const acceptMissionMutation = useMutation({
    mutationFn: (serviceId: number) => 
      serviceService.updateServiceStatus(serviceId, 'in_progress'),
    onSuccess: (updatedService) => {
      queryClient.invalidateQueries({ 
        queryKey: freelancerServiceKeys.assigned(filters) 
      });
      
      toast({
        title: "Mission acceptée",
        description: "Vous avez accepté la mission",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: error.message || "Impossible d'accepter la mission",
        variant: "destructive",
      });
    },
  });

  /**
   * Marquer une mission comme terminée
   */
  const completeMissionMutation = useMutation({
    mutationFn: (serviceId: number) => serviceService.completeService(serviceId),
    onSuccess: (updatedService) => {
      queryClient.invalidateQueries({ 
        queryKey: freelancerServiceKeys.assigned(filters) 
      });
      
      toast({
        title: "Mission terminée",
        description: "La mission a été marquée comme terminée",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: error.message || "Impossible de terminer la mission",
        variant: "destructive",
      });
    },
  });

  // ==================== STATISTIQUES ====================

  const getStats = () => {
    const assigned = assignedServicesQuery.data?.services || [];
    const applications = applicationsQuery.data || [];

    return {
      assignedCount: assigned.length,
      inProgressCount: assigned.filter(s => s.status === 'in_progress').length,
      completedCount: assigned.filter(s => s.status === 'completed').length,
      applicationsCount: applications.length,
      pendingApplications: applications.filter(s => s.status === 'published').length,
    };
  };
  

  // ==================== RETOUR DU HOOK ====================

  return {
    // Données
    assignedServices: assignedServicesQuery.data?.services || [],
    assignedPagination: assignedServicesQuery.data ? {
      total: assignedServicesQuery.data.total,
      page: assignedServicesQuery.data.page,
      pages: assignedServicesQuery.data.pages,
      perPage: assignedServicesQuery.data.per_page,
    } : null,
    isLoadingAssigned: assignedServicesQuery.isLoading,

    availableServices: availableServicesQuery.data?.services || [],
    availablePagination: availableServicesQuery.data ? {
      total: availableServicesQuery.data.total,
      page: availableServicesQuery.data.page,
      pages: availableServicesQuery.data.pages,
      perPage: availableServicesQuery.data.per_page,
    } : null,
    isLoadingAvailable: availableServicesQuery.isLoading,

    applications: applicationsQuery.data || [],
    isLoadingApplications: applicationsQuery.isLoading,

    stats: getStats(),
    isLoading: assignedServicesQuery.isLoading || 
                availableServicesQuery.isLoading || 
                applicationsQuery.isLoading,

    // Mutations
    applyToService: applyToServiceMutation.mutate,
    isApplying: applyToServiceMutation.isPending,

    withdrawApplication: withdrawApplicationMutation.mutate,
    isWithdrawing: withdrawApplicationMutation.isPending,

    acceptMission: acceptMissionMutation.mutate,
    isAccepting: acceptMissionMutation.isPending,

    completeMission: completeMissionMutation.mutate,
    isCompleting: completeMissionMutation.isPending,

    // Rafraîchissement
    refetchAssigned: () => queryClient.invalidateQueries({ 
      queryKey: freelancerServiceKeys.assigned(filters) 
    }),
    refetchAvailable: () => queryClient.invalidateQueries({ 
      queryKey: freelancerServiceKeys.available(filters) 
    }),
    refetchApplications: () => queryClient.invalidateQueries({ 
      queryKey: freelancerServiceKeys.applications(filters) 
    }),
  };
};


