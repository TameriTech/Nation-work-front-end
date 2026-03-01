// hooks/admin/useDisputes.ts

import { useMutation, useQuery, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import { useToast } from '@/components/ui/use-toast';
import * as disputeService from '@/services/admin/disputes.service';
import type { 
  Dispute, 
  DisputeStats, 
  DisputeHistoryEntry,
  PaginatedResponse,
  RejectData 
} from '@/app/types/admin';

// ==================== CLÉS DE QUERY ====================

export const disputeKeys = {
  all: ['disputes'] as const,
  lists: () => [...disputeKeys.all, 'list'] as const,
  list: (filters: any) => [...disputeKeys.lists(), filters] as const,
  details: () => [...disputeKeys.all, 'detail'] as const,
  detail: (id: number) => [...disputeKeys.details(), id] as const,
  stats: () => [...disputeKeys.all, 'stats'] as const,
  history: (id: number) => [...disputeKeys.all, 'history', id] as const,
  messages: (id: number) => [...disputeKeys.all, 'messages', id] as const,
  urgent: () => [...disputeKeys.all, 'urgent'] as const,
};

// ==================== HOOK PRINCIPAL ====================

export const useDisputes = (filters?: {
  status?: string;
  priority?: string;
  assigned_to?: number;
  page?: number;
  per_page?: number;
}) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // ==================== QUERIES ====================

  /**
   * Récupère la liste des litiges avec pagination
   */
  const disputesQuery = useInfiniteQuery({
    queryKey: disputeKeys.list(filters),
    queryFn: ({ pageParam = 1 }) => 
      disputeService.getDisputes({ ...filters, page: pageParam }),
    getNextPageParam: (lastPage) => {
      if (lastPage.page >= lastPage.pages) return undefined;
      return lastPage.page + 1;
    },
    initialPageParam: 1,
    staleTime: 2 * 60 * 1000,
  });

  /**
   * Récupère un litige par son ID
   */
  const disputeQuery = (id: number) => {
    return useQuery({
      queryKey: disputeKeys.detail(id),
      queryFn: () => disputeService.getDisputeById(id),
      enabled: !!id,
      staleTime: 5 * 60 * 1000,
    });
  };

  /**
   * Récupère les statistiques des litiges
   */
  const statsQuery = useQuery({
    queryKey: disputeKeys.stats(),
    queryFn: () => disputeService.getDisputeStats(),
    staleTime: 10 * 60 * 1000,
  });

  /**
   * Récupère l'historique d'un litige
   */
  const historyQuery = (id: number) => {
    return useQuery({
      queryKey: disputeKeys.history(id),
      queryFn: () => disputeService.getDisputeHistory(id),
      enabled: !!id,
      staleTime: 2 * 60 * 1000,
    });
  };

  /**
   * Récupère les messages d'un litige
   */
  const messagesQuery = (id: number) => {
    return useQuery({
      queryKey: disputeKeys.messages(id),
      queryFn: () => disputeService.getDisputeMessages(id),
      enabled: !!id,
      staleTime: 30 * 1000, // 30 secondes
    });
  };

  /**
   * Récupère les litiges urgents
   */
  const urgentDisputesQuery = useQuery({
    queryKey: disputeKeys.urgent(),
    queryFn: () => disputeService.getUrgentDisputes(5),
    staleTime: 30 * 1000,
  });

  // ==================== MUTATIONS ====================

  /**
   * Assigne un litige à un admin
   */
  const assignDisputeMutation = useMutation({
    mutationFn: ({ disputeId, adminId, notes }: { 
      disputeId: number; 
      adminId: number; 
      notes?: string 
    }) => disputeService.assignDispute(disputeId, adminId, notes),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: disputeKeys.lists() });
      queryClient.invalidateQueries({ 
        queryKey: disputeKeys.detail(variables.disputeId) 
      });
      
      toast({
        title: "Litige assigné",
        description: `Le litige a été assigné à l'admin #${variables.adminId}`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: error.message || "Impossible d'assigner le litige",
        variant: "destructive",
      });
    },
  });

  /**
   * Ajoute un message à un litige
   */
  const addMessageMutation = useMutation({
    mutationFn: ({ disputeId, message, isPrivate }: { 
      disputeId: number; 
      message: string; 
      isPrivate?: boolean 
    }) => disputeService.addDisputeMessage(disputeId, { message, is_private: isPrivate }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ 
        queryKey: disputeKeys.messages(variables.disputeId) 
      });
      queryClient.invalidateQueries({ 
        queryKey: disputeKeys.history(variables.disputeId) 
      });
    },
  });

  /**
   * Résout un litige
   */
  const resolveDisputeMutation = useMutation({
    mutationFn: ({ disputeId, data }: { 
      disputeId: number; 
      data: { resolution: string; refund_percentage?: number; notify_users?: boolean } 
    }) => disputeService.resolveDispute(disputeId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: disputeKeys.lists() });
      queryClient.invalidateQueries({ 
        queryKey: disputeKeys.detail(variables.disputeId) 
      });
      queryClient.invalidateQueries({ queryKey: disputeKeys.stats() });
      
      toast({
        title: "Litige résolu",
        description: "Le litige a été marqué comme résolu",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: error.message || "Impossible de résoudre le litige",
        variant: "destructive",
      });
    },
  });

  /**
   * Rejette un litige
   */
  const rejectDisputeMutation = useMutation({
    mutationFn: ({ disputeId, data }: { disputeId: number; data: RejectData }) =>
      disputeService.rejectDispute(disputeId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: disputeKeys.lists() });
      queryClient.invalidateQueries({ 
        queryKey: disputeKeys.detail(variables.disputeId) 
      });
      queryClient.invalidateQueries({ queryKey: disputeKeys.stats() });
      
      toast({
        title: "Litige rejeté",
        description: "Le litige a été rejeté",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: error.message || "Impossible de rejeter le litige",
        variant: "destructive",
      });
    },
  });

  /**
   * Escalade un litige
   */
  const escalateDisputeMutation = useMutation({
    mutationFn: ({ disputeId, reason, priority }: { 
      disputeId: number; 
      reason: string; 
      priority?: 'high' | 'urgent' 
    }) => disputeService.escalateDispute(disputeId, reason, priority),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: disputeKeys.lists() });
      queryClient.invalidateQueries({ 
        queryKey: disputeKeys.detail(variables.disputeId) 
      });
      
      toast({
        title: "Litige escaladé",
        description: `Le litige a été escaladé avec priorité ${variables.priority || 'normale'}`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: error.message || "Impossible d'escalader le litige",
        variant: "destructive",
      });
    },
  });

  /**
   * Met un litige en attente
   */
  const holdDisputeMutation = useMutation({
    mutationFn: ({ disputeId, reason, holdUntil }: { 
      disputeId: number; 
      reason: string; 
      holdUntil?: string 
    }) => disputeService.holdDispute(disputeId, reason, holdUntil),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ 
        queryKey: disputeKeys.detail(variables.disputeId) 
      });
      
      toast({
        title: "Litige mis en attente",
        description: "Le litige a été mis en attente",
      });
    },
  });

  /**
   * Traitement par lots
   */
  const bulkProcessMutation = useMutation({
    mutationFn: ({ disputeIds, action, data }: { 
      disputeIds: number[]; 
      action: 'assign' | 'resolve' | 'reject' | 'escalate';
      data?: any 
    }) => disputeService.bulkProcessDisputes(disputeIds, action, data),
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: disputeKeys.lists() });
      
      toast({
        title: "Traitement par lots effectué",
        description: `${result.processed_count} litige(s) traité(s)`,
      });
    },
  });

  // ==================== FONCTIONS UTILITAIRES ====================

  /**
   * Filtre les litiges par statut
   */
  const filterByStatus = (status: string) => {
    const allDisputes = disputesQuery.data?.pages.flatMap(p => p.items) || [];
    return allDisputes.filter(d => d.status === status);
  };

  /**
   * Calcule le temps moyen de résolution
   */
  const getAverageResolutionTime = (): number => {
    const resolvedDisputes = filterByStatus('resolved');
    if (resolvedDisputes.length === 0) return 0;
    
    const totalTime = resolvedDisputes.reduce((acc, d) => {
      const created = new Date(d.created_at).getTime();
      const resolved = new Date(d.resolved_at || d.updated_at).getTime();
      return acc + (resolved - created);
    }, 0);
    
    return totalTime / resolvedDisputes.length / (1000 * 60 * 60 * 24); // en jours
  };

  /**
   * Récupère les litiges par priorité
   */
  const getDisputesByPriority = () => {
    const allDisputes = disputesQuery.data?.pages.flatMap(p => p.items) || [];
    return {
      low: allDisputes.filter(d => d.priority === 'low'),
      normal: allDisputes.filter(d => d.priority === 'normal'),
      high: allDisputes.filter(d => d.priority === 'high'),
      urgent: allDisputes.filter(d => d.priority === 'urgent'),
    };
  };

  // ==================== RETOUR DU HOOK ====================

  return {
    // Données
    disputes: disputesQuery.data?.pages.flatMap(p => p.items) || [],
    pagination: disputesQuery.data?.pages[disputesQuery.data.pages.length - 1],
    isLoading: disputesQuery.isLoading,
    error: disputesQuery.error,
    hasMore: disputesQuery.hasNextPage,
    loadMore: disputesQuery.fetchNextPage,

    // Requêtes spécifiques
    getDispute: disputeQuery,
    getHistory: historyQuery,
    getMessages: messagesQuery,
    
    stats: statsQuery.data,
    isLoadingStats: statsQuery.isLoading,
    
    urgentDisputes: urgentDisputesQuery.data || [],
    isLoadingUrgent: urgentDisputesQuery.isLoading,

    // Utilitaires
    filterByStatus,
    getAverageResolutionTime,
    getDisputesByPriority,

    // Mutations
    assignDispute: assignDisputeMutation.mutate,
    isAssigning: assignDisputeMutation.isPending,

    addMessage: addMessageMutation.mutate,
    isAddingMessage: addMessageMutation.isPending,

    resolveDispute: resolveDisputeMutation.mutate,
    isResolving: resolveDisputeMutation.isPending,

    rejectDispute: rejectDisputeMutation.mutate,
    isRejecting: rejectDisputeMutation.isPending,

    escalateDispute: escalateDisputeMutation.mutate,
    isEscalating: escalateDisputeMutation.isPending,

    holdDispute: holdDisputeMutation.mutate,
    isHolding: holdDisputeMutation.isPending,

    bulkProcess: bulkProcessMutation.mutate,
    isBulkProcessing: bulkProcessMutation.isPending,

    // Rafraîchissement
    refetch: () => queryClient.invalidateQueries({ queryKey: disputeKeys.lists() }),
    refetchStats: () => queryClient.invalidateQueries({ queryKey: disputeKeys.stats() }),
  };
};
