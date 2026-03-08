// hooks/services/useServiceCandidatures.ts

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/app/components/ui/use-toast';
import * as candidatureService from '@/app/services/candidatures.service';
import type { Candidature, CandidatureStatus, UpdateCandidatureStatusDto } from '@/app/types';

export const useServiceCandidatures = (serviceId: number) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const candidaturesQuery = useQuery({
    queryKey: ['service-candidatures', serviceId],
    queryFn: () => candidatureService.getServiceCandidatures(serviceId),
    enabled: !!serviceId,
    staleTime: 2 * 60 * 1000,
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: CandidatureStatus }) =>
      candidatureService.updateCandidatureStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['service-candidatures', serviceId] });
      
      toast({
        title: "Statut mis à jour",
        description: "Le statut de la candidature a été modifié",
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

  return {
    candidatures: candidaturesQuery.data || [],
    isLoading: candidaturesQuery.isLoading,
    error: candidaturesQuery.error,
    updateStatus: updateStatusMutation.mutate,
    isUpdating: updateStatusMutation.isPending,
    refetch: candidaturesQuery.refetch,
  };
};
