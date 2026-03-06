// hooks/services/use-freelancer-service.ts

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/app/components/ui/use-toast';
import { useState, useCallback, useEffect } from 'react';
import * as serviceService from '@/app/services/service.service';
import * as candidatureService from '@/app/services/candidatures.service';
import type { 
  Service, 
  ServiceFilters,
  PaginatedResponse 
} from '@/app/types/services';
import { serviceKeys } from './use-services';
import { wishlistKeys } from './use-wishlist';

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

interface UseFreelancerServicesProps {
  initialFilters?: ServiceFilters;
}

export const useFreelancerServices = ({ initialFilters = {} }: UseFreelancerServicesProps = {}) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // État local pour les filtres
  const [filters, setFilters] = useState<ServiceFilters>(initialFilters);

  // ==================== INTÉGRATION DE LA WISHLIST ====================

  /**
   * Récupère la wishlist de l'utilisateur
   */
  const wishlistQuery = useQuery({
    queryKey: wishlistKeys.items(),
    queryFn: () => serviceService.getWishlist(),
    staleTime: 5 * 60 * 1000,
  });

  /**
   * Récupère le nombre d'éléments dans la wishlist
   */
  const countQuery = useQuery({
    queryKey: wishlistKeys.count(),
    queryFn: async () => {
      const wishlist = await serviceService.getWishlist();
      return wishlist.items.length;
    },
    staleTime: 5 * 60 * 1000,
  });

  /**
   * Vérifie si un service est dans la wishlist
   */
  const useIsInWishlist = (serviceId: number) => {
    return useQuery({
      queryKey: wishlistKeys.check(serviceId),
      queryFn: async () => {
        const wishlist = await serviceService.getWishlist();
        return wishlist.items.some(item => item.service_id === serviceId);
      },
      enabled: !!serviceId,
      staleTime: 5 * 60 * 1000,
    });
  };

  /**
   * Ajoute un service aux favoris
   */
  const addToWishlistMutation = useMutation({
    mutationFn: (serviceId: number) => serviceService.addToWishlist(serviceId),
    onSuccess: (_, serviceId) => {
      queryClient.invalidateQueries({ queryKey: wishlistKeys.items() });
      queryClient.invalidateQueries({ queryKey: wishlistKeys.count() });
      queryClient.invalidateQueries({ queryKey: wishlistKeys.check(serviceId) });
      
      toast({
        title: "Ajouté aux favoris",
        description: "Le service a été ajouté à votre liste",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: error.message || "Impossible d'ajouter aux favoris",
        variant: "destructive",
      });
    },
  });

  /**
   * Retire un service des favoris
   */
  const removeFromWishlistMutation = useMutation({
    mutationFn: (serviceId: number) => serviceService.removeFromWishlist(serviceId),
    onSuccess: (_, serviceId) => {
      queryClient.invalidateQueries({ queryKey: wishlistKeys.items() });
      queryClient.invalidateQueries({ queryKey: wishlistKeys.count() });
      queryClient.invalidateQueries({ queryKey: wishlistKeys.check(serviceId) });
      
      toast({
        title: "Retiré des favoris",
        description: "Le service a été retiré de votre liste",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: error.message || "Impossible de retirer des favoris",
        variant: "destructive",
      });
    },
  });

  /**
   * Vide la wishlist
   */
  const clearWishlistMutation = useMutation({
    mutationFn: async () => {
      const wishlist = await serviceService.getWishlist();
      await Promise.all(
        wishlist.items.map(item => serviceService.removeFromWishlist(item.service_id))
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: wishlistKeys.items() });
      queryClient.invalidateQueries({ queryKey: wishlistKeys.count() });
      
      toast({
        title: "Liste vidée",
        description: "Tous les favoris ont été supprimés",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: error.message || "Impossible de vider la liste",
        variant: "destructive",
      });
    },
  });

  /**
   * Vérifie si un service est en favori (synchrone pour les composants)
   */
  const isFavorite = useCallback((serviceId: number): boolean => {
    const wishlist = wishlistQuery.data?.items || [];
    return wishlist.some(item => item.service_id === serviceId);
  }, [wishlistQuery.data]);

  /**
   * Toggle un favori (ajoute ou retire)
   */
  const toggleFavorite = useCallback(async (serviceId: number) => {
    const isFav = isFavorite(serviceId);
    
    if (isFav) {
      await removeFromWishlistMutation.mutateAsync(serviceId);
    } else {
      await addToWishlistMutation.mutateAsync(serviceId);
    }
  }, [isFavorite, removeFromWishlistMutation, addToWishlistMutation]);

  // ==================== QUERIES PRINCIPALES ====================

  /**
   * Récupère les services assignés au freelancer
   */
  const assignedServicesQuery = useQuery({
    queryKey: freelancerServiceKeys.assigned(filters),
    queryFn: () => serviceService.getFreelancerServices({ 
      ...filters, 
      status: ['assigned'] 
    }),
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
      const candidatures = await candidatureService.getCandidaturesByFreelancer(0);
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
      cover_letter: message || '',
      proposed_amount: proposedAmount || undefined,
    }),
    onSuccess: (_, variables) => {
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
    onSuccess: () => {
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
    onSuccess: () => {
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

  // ==================== FONCTIONS DE FILTRAGE ====================

  const updateFilters = useCallback((newFilters: Partial<ServiceFilters>) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters,
      page: 1,
    }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({ page: 1, per_page: 10 });
  }, []);

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
      wishlistCount: wishlistQuery.data?.items.length || 0,
    };
  };

  // ==================== RETOUR DU HOOK ====================

  return {
    // Données principales
    assignedServices: assignedServicesQuery.data?.services || [],
    assignedPagination: assignedServicesQuery.data ? {
      total: assignedServicesQuery.data.total,
      page: assignedServicesQuery.data.page,
      pages: Math.ceil(assignedServicesQuery.data.total / assignedServicesQuery.data.per_page),
      perPage: assignedServicesQuery.data.per_page,
    } : null,
    isLoadingAssigned: assignedServicesQuery.isLoading,

    availableServices: availableServicesQuery.data?.services || [],
    availablePagination: availableServicesQuery.data ? {
      total: availableServicesQuery.data.total,
      page: availableServicesQuery.data.page,
      pages: Math.ceil(availableServicesQuery.data.total / availableServicesQuery.data.per_page),
      perPage: availableServicesQuery.data.per_page,
    } : null,
    isLoadingAvailable: availableServicesQuery.isLoading,

    applications: applicationsQuery.data || [],
    isLoadingApplications: applicationsQuery.isLoading,

    // Données de la wishlist
    wishlist: wishlistQuery.data?.items || [],
    wishlistTotal: wishlistQuery.data?.total || 0,
    isLoadingWishlist: wishlistQuery.isLoading,
    wishlistCount: countQuery.data || 0,
    useIsInWishlist,
    isFavorite,
    toggleFavorite,
    addToWishlist: addToWishlistMutation.mutate,
    removeFromWishlist: removeFromWishlistMutation.mutate,
    clearWishlist: clearWishlistMutation.mutate,
    isAddingToWishlist: addToWishlistMutation.isPending,
    isRemovingFromWishlist: removeFromWishlistMutation.isPending,
    isClearingWishlist: clearWishlistMutation.isPending,

    // Filtres
    filters,
    updateFilters,
    resetFilters,

    // Statistiques
    stats: getStats(),

    // États de chargement globaux
    isLoading: assignedServicesQuery.isLoading || 
                availableServicesQuery.isLoading || 
                applicationsQuery.isLoading ||
                wishlistQuery.isLoading,

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
    refetchWishlist: () => queryClient.invalidateQueries({ 
      queryKey: wishlistKeys.items() 
    }),
  };
};
