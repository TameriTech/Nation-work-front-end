// hooks/applications/useCandidatures.ts

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/app/components/ui/use-toast';
import * as candidatureService from '@/app/services/candidatures.service';
import type { 
  Candidature, 
  CreateCandidatureDto, 
  UpdateCandidatureStatusDto,
  CandidatureStatus 
} from '@/app/types/candidatures';

// ==================== CLÉS DE QUERY ====================

export const candidatureKeys = {
  all: ['candidatures'] as const,
  lists: () => [...candidatureKeys.all, 'list'] as const,
  list: (filters: any) => [...candidatureKeys.lists(), filters] as const,
  details: () => [...candidatureKeys.all, 'detail'] as const,
  detail: (id: number) => [...candidatureKeys.details(), id] as const,
  byFreelancer: (freelancerId: number) => [...candidatureKeys.all, 'freelancer', freelancerId] as const,
  byService: (serviceId: number) => [...candidatureKeys.all, 'service', serviceId] as const,
  stats: (freelancerId?: number) => [...candidatureKeys.all, 'stats', freelancerId] as const,
};

// ==================== HOOK PRINCIPAL ====================

export const useCandidatures = (options?: {
  freelancerId?: number;
  serviceId?: number;
}) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { freelancerId, serviceId } = options || {};

  // ==================== QUERIES ====================

  /**
   * Récupère les candidatures d'un freelancer
   */
  const freelancerCandidaturesQuery = useQuery({
    queryKey: candidatureKeys.byFreelancer(freelancerId || 0),
    queryFn: () => candidatureService.getCandidaturesByFreelancer(freelancerId!),
    enabled: !!freelancerId,
    staleTime: 5 * 60 * 1000,
  });

  /**
   * Récupère les candidatures pour un service
   */
  const serviceCandidaturesQuery = useQuery({
    queryKey: candidatureKeys.byService(serviceId || 0),
    queryFn: () => candidatureService.getServiceCandidatures(serviceId!),
    enabled: !!serviceId,
    staleTime: 2 * 60 * 1000,
  });

  /**
   * Récupère une candidature par son ID
   */
  const getCandidatureById = (id: number) => {
    return useQuery({
      queryKey: candidatureKeys.detail(id),
      queryFn: () => candidatureService.getCandidatureById(id),
      enabled: !!id,
      staleTime: 5 * 60 * 1000,
    });
  };

  /**
   * Récupère les statistiques des candidatures
   */
  const statsQuery = useQuery({
    queryKey: candidatureKeys.stats(freelancerId),
    queryFn: () => candidatureService.getFreelancerCandidatureStats(freelancerId!),
    enabled: !!freelancerId,
    staleTime: 10 * 60 * 1000,
  });

  // ==================== MUTATIONS ====================

  /**
   * Crée une nouvelle candidature
   */
  const createCandidatureMutation = useMutation({
    mutationFn: (data: CreateCandidatureDto) => 
      candidatureService.createCandidature(data),
    onSuccess: (newCandidature) => {
      // Invalider les listes concernées
      queryClient.invalidateQueries({ 
        queryKey: candidatureKeys.byFreelancer(newCandidature.freelancer_id) 
      });
      queryClient.invalidateQueries({ 
        queryKey: candidatureKeys.byService(newCandidature.service_id) 
      });
      queryClient.invalidateQueries({ 
        queryKey: candidatureKeys.stats(newCandidature.freelancer_id) 
      });
      
      toast({
        title: "Candidature envoyée",
        description: "Votre candidature a été soumise avec succès",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: error.message || "Impossible de créer la candidature",
        variant: "destructive",
      });
    },
  });

  /**
   * Met à jour le statut d'une candidature
   */
  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status, options }: { 
      id: number; 
      status: CandidatureStatus;
      options?: { rejection_reason?: string; message?: string };
    }) => candidatureService.updateCandidatureStatus(id, status, options),
    onSuccess: (updatedCandidature) => {
      // Invalider les listes
      queryClient.invalidateQueries({ 
        queryKey: candidatureKeys.byFreelancer(updatedCandidature.freelancer_id) 
      });
      queryClient.invalidateQueries({ 
        queryKey: candidatureKeys.byService(updatedCandidature.service_id) 
      });
      queryClient.setQueryData(
        candidatureKeys.detail(updatedCandidature.id), 
        updatedCandidature
      );
      
      toast({
        title: "Statut mis à jour",
        description: `La candidature est maintenant ${updatedCandidature.status}`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: error.message || "Impossible de mettre à jour le statut",
        variant: "destructive",
      });
    },
  });

  /**
   * Accepte une candidature
   */
  const acceptCandidatureMutation = useMutation({
    mutationFn: ({ id, message }: { id: number; message?: string }) =>
      candidatureService.acceptCandidature(id, message),
    onSuccess: (updatedCandidature) => {
      queryClient.invalidateQueries({ 
        queryKey: candidatureKeys.byService(updatedCandidature.service_id) 
      });
      
      toast({
        title: "Candidature acceptée",
        description: "Le freelancer a été notifié",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: error.message || "Impossible d'accepter la candidature",
        variant: "destructive",
      });
    },
  });

  /**
   * Refuse une candidature
   */
  const rejectCandidatureMutation = useMutation({
    mutationFn: ({ id, reason }: { id: number; reason?: string }) =>
      candidatureService.rejectCandidature(id, reason),
    onSuccess: (updatedCandidature) => {
      queryClient.invalidateQueries({ 
        queryKey: candidatureKeys.byService(updatedCandidature.service_id) 
      });
      
      toast({
        title: "Candidature refusée",
        description: "Le freelancer a été notifié",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: error.message || "Impossible de refuser la candidature",
        variant: "destructive",
      });
    },
  });

  /**
   * Met une candidature en attente
   */
  const pendCandidatureMutation = useMutation({
    mutationFn: (id: number) => candidatureService.pendCandidature(id),
    onSuccess: (updatedCandidature) => {
      queryClient.invalidateQueries({ 
        queryKey: candidatureKeys.byService(updatedCandidature.service_id) 
      });
      
      toast({
        title: "Candidature mise en attente",
        description: "Le statut a été modifié",
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

  /**
   * Supprime une candidature
   */
  const deleteCandidatureMutation = useMutation({
    mutationFn: (id: number) => candidatureService.deleteCandidature(id),
    onSuccess: (_, deletedId) => {
      // Invalider les listes
      queryClient.invalidateQueries({ queryKey: candidatureKeys.lists() });
      queryClient.removeQueries({ queryKey: candidatureKeys.detail(deletedId) });
      
      toast({
        title: "Candidature supprimée",
        description: "La candidature a été retirée",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: error.message || "Impossible de supprimer la candidature",
        variant: "destructive",
      });
    },
  });

  // ==================== RETOUR DU HOOK ====================

  // Déterminer quelles données retourner selon les options
  const candidatures = freelancerId 
    ? freelancerCandidaturesQuery.data 
    : serviceId 
      ? serviceCandidaturesQuery.data 
      : [];

  const isLoading = freelancerId 
    ? freelancerCandidaturesQuery.isLoading 
    : serviceId 
      ? serviceCandidaturesQuery.isLoading 
      : false;

  const error = freelancerId 
    ? freelancerCandidaturesQuery.error 
    : serviceId 
      ? serviceCandidaturesQuery.error 
      : null;

  return {
    // Données
    candidatures: candidatures || [],
    isLoading,
    error,
    stats: statsQuery.data,
    isLoadingStats: statsQuery.isLoading,

    // Récupération par ID
    getCandidatureById,

    // Mutations
    createCandidature: createCandidatureMutation.mutate,
    isCreating: createCandidatureMutation.isPending,

    updateStatus: updateStatusMutation.mutate,
    isUpdatingStatus: updateStatusMutation.isPending,

    acceptCandidature: acceptCandidatureMutation.mutate,
    isAccepting: acceptCandidatureMutation.isPending,

    rejectCandidature: rejectCandidatureMutation.mutate,
    isRejecting: rejectCandidatureMutation.isPending,

    pendCandidature: pendCandidatureMutation.mutate,
    isPending: pendCandidatureMutation.isPending,

    deleteCandidature: deleteCandidatureMutation.mutate,
    isDeleting: deleteCandidatureMutation.isPending,

    // Rafraîchissement
    refetch: () => {
      if (freelancerId) {
        queryClient.invalidateQueries({ 
          queryKey: candidatureKeys.byFreelancer(freelancerId) 
        });
      }
      if (serviceId) {
        queryClient.invalidateQueries({ 
          queryKey: candidatureKeys.byService(serviceId) 
        });
      }
    },
  };
};
