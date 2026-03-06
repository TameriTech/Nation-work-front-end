// hooks/admin/useSupportTickets.ts

import { useMutation, useQuery, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import { useToast } from '@/app/components/ui/use-toast';
import * as supportService from '@/app/services/support.service';
import type { 
  SupportTicket, 
  PaginatedResponse,
  TicketStats,
  TicketHistoryEntry
} from '@/app/types/admin';

// ==================== CLÉS DE QUERY ====================

export const ticketKeys = {
  all: ['support-tickets'] as const,
  lists: () => [...ticketKeys.all, 'list'] as const,
  list: (filters: any) => [...ticketKeys.lists(), filters] as const,
  details: () => [...ticketKeys.all, 'detail'] as const,
  detail: (id: number) => [...ticketKeys.details(), id] as const,
  stats: () => [...ticketKeys.all, 'stats'] as const,
  history: (id: number) => [...ticketKeys.all, 'history', id] as const,
  messages: (id: number) => [...ticketKeys.all, 'messages', id] as const,
  assigned: (adminId: number) => [...ticketKeys.all, 'assigned', adminId] as const,
};

// ==================== HOOK PRINCIPAL ====================

export const useSupportTickets = (filters?: {
  status?: string;
  priority?: string;
  assigned_to?: number;
  user_id?: number;
  page?: number;
  per_page?: number;
}) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // ==================== QUERIES ====================

  /**
   * Récupère la liste des tickets avec pagination
   */
  const ticketsQuery = useInfiniteQuery({
    queryKey: ticketKeys.list(filters),
    queryFn: ({ pageParam = 1 }) => 
      supportService.getSupportTickets({ ...filters, page: pageParam }),
    getNextPageParam: (lastPage:any) => {
      if (lastPage.page >= lastPage.pages) return undefined;
      return lastPage.page + 1;
    },
    initialPageParam: 1,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });

  /**
   * Récupère un ticket par son ID
   */
  const getTicketById = (id: number) => {
    return useQuery({
      queryKey: ticketKeys.detail(id),
      queryFn: () => supportService.getSupportTicketById(id),
      enabled: !!id,
      staleTime: 5 * 60 * 1000,
    });
  };

  /**
   * Récupère les statistiques des tickets
   */
  const statsQuery = useQuery({
    queryKey: ticketKeys.stats(),
    queryFn: () => supportService.getSupportStats(),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });

  /**
   * Récupère l'historique d'un ticket
   */
  const getTicketHistory = (id: number) => {
    return useQuery({
      queryKey: ticketKeys.history(id),
      queryFn: () => supportService.getTicketHistory(id),
      enabled: !!id,
      staleTime: 2 * 60 * 1000,
    });
  };

  /**
   * Récupère les tickets assignés à un admin
   */
  const getAssignedTickets = (adminId: number) => {
    return useQuery({
      queryKey: ticketKeys.assigned(adminId),
      queryFn: () => supportService.getSupportTickets({ assigned_to: adminId }),
      enabled: !!adminId,
      staleTime: 2 * 60 * 1000,
    });
  };

  // ==================== MUTATIONS ====================

  /**
   * Assigne un ticket à un admin
   */
  const assignTicketMutation = useMutation({
    mutationFn: ({ ticketId, adminId }: { ticketId: number; adminId: number }) =>
      supportService.assignTicket(ticketId, adminId),
    onSuccess: (_:any, variables:{ ticketId: number; adminId: number }) => {
      queryClient.invalidateQueries({ queryKey: ticketKeys.lists() });
      queryClient.invalidateQueries({ 
        queryKey: ticketKeys.detail(variables.ticketId) 
      });
      
      toast({
        title: "Ticket assigné",
        description: `Le ticket a été assigné à l'admin #${variables.adminId}`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: error.message || "Impossible d'assigner le ticket",
        variant: "destructive",
      });
    },
  });

  /**
   * Répond à un ticket
   */
  const replyToTicketMutation = useMutation({
    mutationFn: ({ ticketId, message, isPrivate }: { 
      ticketId: number; 
      message: string; 
      isPrivate?: boolean 
    }) => supportService.replyToTicket(ticketId, message, isPrivate),
    onSuccess: (_: any, variables: { ticketId: number; message: string; isPrivate?: boolean }) => {
      queryClient.invalidateQueries({ 
        queryKey: ticketKeys.detail(variables.ticketId) 
      });
      queryClient.invalidateQueries({ 
        queryKey: ticketKeys.history(variables.ticketId) 
      });
      
      toast({
        title: "Réponse envoyée",
        description: "Votre réponse a été ajoutée au ticket",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: error.message || "Impossible d'envoyer la réponse",
        variant: "destructive",
      });
    },
  });

  /**
   * Ferme un ticket
   */
  const closeTicketMutation = useMutation({
    mutationFn: ({ ticketId, resolution }: { ticketId: number; resolution: string }) =>
      supportService.closeTicket(ticketId, resolution),
    onSuccess: (_:any, variables:{ ticketId: number; resolution: string }) => {
      queryClient.invalidateQueries({ queryKey: ticketKeys.lists() });
      queryClient.invalidateQueries({ 
        queryKey: ticketKeys.detail(variables.ticketId) 
      });
      queryClient.invalidateQueries({ queryKey: ticketKeys.stats() });
      
      toast({
        title: "Ticket fermé",
        description: "Le ticket a été marqué comme résolu",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: error.message || "Impossible de fermer le ticket",
        variant: "destructive",
      });
    },
  });

  /**
   * Rouvre un ticket
   */
  const reopenTicketMutation = useMutation({
    mutationFn: (ticketId: number) => supportService.reopenTicket(ticketId),
    onSuccess: (_:any, ticketId: number) => {
      queryClient.invalidateQueries({ queryKey: ticketKeys.lists() });
      queryClient.invalidateQueries({ queryKey: ticketKeys.detail(ticketId) });
      queryClient.invalidateQueries({ queryKey: ticketKeys.stats() });
      
      toast({
        title: "Ticket réouvert",
        description: "Le ticket a été réouvert",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: error.message || "Impossible de rouvrir le ticket",
        variant: "destructive",
      });
    },
  });

  // ==================== FONCTIONS UTILITAIRES ====================

  /**
   * Filtre les tickets par statut
   */
  const filterByStatus = (status: string) => {
    const allTickets = ticketsQuery.data?.pages.flatMap(p => p.items) || [];
    return allTickets.filter(t => t.status === status);
  };

  /**
   * Filtre les tickets par priorité
   */
  const filterByPriority = (priority: string) => {
    const allTickets = ticketsQuery.data?.pages.flatMap(p => p.items) || [];
    return allTickets.filter(t => t.priority === priority);
  };

  /**
   * Calcule le temps de réponse moyen
   */
  const getAverageResponseTime = (): string => {
    if (!statsQuery.data?.avg_response_time) return 'N/A';
    return statsQuery.data.avg_response_time;
  };

  /**
   * Récupère la distribution des tickets
   */
  const getTicketDistribution = () => {
    const allTickets = ticketsQuery.data?.pages.flatMap(p => p.items) || [];
    
    return {
      byStatus: {
        open: allTickets.filter(t => t.status === 'open').length,
        in_progress: allTickets.filter(t => t.status === 'in_progress').length,
        resolved: allTickets.filter(t => t.status === 'resolved').length,
        closed: allTickets.filter(t => t.status === 'closed').length,
      },
      byPriority: {
        low: allTickets.filter(t => t.priority === 'low').length,
        normal: allTickets.filter(t => t.priority === 'normal').length,
        high: allTickets.filter(t => t.priority === 'high').length,
      },
    };
  };

  // ==================== RETOUR DU HOOK ====================

  return {
    // Données
    tickets: ticketsQuery.data?.pages.flatMap(p => p.items) || [],
    pagination: ticketsQuery.data?.pages[ticketsQuery.data.pages.length - 1],
    isLoading: ticketsQuery.isLoading,
    error: ticketsQuery.error,
    hasMore: ticketsQuery.hasNextPage,
    loadMore: ticketsQuery.fetchNextPage,

    // Requêtes spécifiques
    getTicketById,
    getTicketHistory,
    getAssignedTickets,
    
    stats: statsQuery.data,
    isLoadingStats: statsQuery.isLoading,

    // Utilitaires
    filterByStatus,
    filterByPriority,
    getAverageResponseTime,
    getTicketDistribution,

    // Mutations
    assignTicket: assignTicketMutation.mutate,
    isAssigning: assignTicketMutation.isPending,

    replyToTicket: replyToTicketMutation.mutate,
    isReplying: replyToTicketMutation.isPending,

    closeTicket: closeTicketMutation.mutate,
    isClosing: closeTicketMutation.isPending,

    reopenTicket: reopenTicketMutation.mutate,
    isReopening: reopenTicketMutation.isPending,

    // Rafraîchissement
    refetch: () => queryClient.invalidateQueries({ queryKey: ticketKeys.lists() }),
    refetchStats: () => queryClient.invalidateQueries({ queryKey: ticketKeys.stats() }),
  };
};
