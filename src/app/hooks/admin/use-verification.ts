// hooks/admin/use-admin-verifications.ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/app/components/ui/use-toast';
import * as adminService from '@/app/services/users.service';
import { useState, useEffect } from 'react';

export const adminVerificationKeys = {
  all: ['admin-verifications'] as const,
  lists: () => [...adminVerificationKeys.all, 'list'] as const,
  list: (filters?: any) => [...adminVerificationKeys.lists(), filters] as const,
  stats: () => [...adminVerificationKeys.all, 'stats'] as const,
};

export const useAdminVerifications = (initialFilters?: any) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  // Use the passed filters directly
  const filters = initialFilters || {};

  // Query pour récupérer les vérifications avec filtres
  const verificationsQuery = useQuery({
    queryKey: adminVerificationKeys.list(filters),
    queryFn: () => adminService.getVerifications(filters),
    staleTime: 2 * 60 * 1000, // 2 minutes
    enabled: true, // Always enabled
  });

  // Query pour les statistiques (indépendante des filtres)
  const statsQuery = useQuery({
    queryKey: adminVerificationKeys.stats(),
    queryFn: () => adminService.getVerificationStats(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    placeholderData: {
      pending: 0,
      approved: 0,
      rejected: 0,
      total: 0,
    },
  });

  // Mutation pour approuver une vérification
  const approveMutation = useMutation({
    mutationFn: ({ id, notes }: { id: number; notes?: string }) =>
      adminService.validateDocument(id, true, notes),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: adminVerificationKeys.lists() });
      queryClient.invalidateQueries({ queryKey: adminVerificationKeys.stats() });
      toast({
        title: "Vérification approuvée",
        description: `Le document #${variables.id} a été approuvé avec succès`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: error.message || "Impossible d'approuver la vérification",
        variant: "destructive",
      });
    },
  });

  // Mutation pour rejeter une vérification
  const rejectMutation = useMutation({
    mutationFn: ({ id, reason }: { id: number; reason: string }) =>
      adminService.rejectDocument(id, reason),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: adminVerificationKeys.lists() });
      queryClient.invalidateQueries({ queryKey: adminVerificationKeys.stats() });
      toast({
        title: "Vérification rejetée",
        description: `Le document #${variables.id} a été rejeté`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: error.message || "Impossible de rejeter la vérification",
        variant: "destructive",
      });
    },
  });

  return {
    // Données
    verifications: verificationsQuery.data || [],
    isLoading: verificationsQuery.isLoading,
    isFetching: verificationsQuery.isFetching,
    error: verificationsQuery.error,
    stats: statsQuery.data,
    statsLoading: statsQuery.isLoading,
    refetch: verificationsQuery.refetch,

    // Mutations
    approveVerification: approveMutation.mutate,
    isApproving: approveMutation.isPending,
    rejectVerification: rejectMutation.mutate,
    isRejecting: rejectMutation.isPending,
  };
};
