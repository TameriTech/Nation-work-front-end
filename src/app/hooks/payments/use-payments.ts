// hooks/payments/usePayments.ts

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/components/ui/use-toast';
import * as paymentService from '@/services/admin/payments.service';
import type { 
  Payment, 
  PaymentSummary, 
  Payout,
  PaginatedResponse 
} from '@/app/types/admin';

// ==================== CLÉS DE QUERY ====================

export const paymentKeys = {
  all: ['payments'] as const,
  summary: () => [...paymentKeys.all, 'summary'] as const,
  transactions: (filters?: any) => [...paymentKeys.all, 'transactions', filters] as const,
  transaction: (id: string) => [...paymentKeys.all, 'transaction', id] as const,
  payouts: (filters?: any) => [...paymentKeys.all, 'payouts', filters] as const,
  payout: (id: string) => [...paymentKeys.all, 'payout', id] as const,
  stats: (period?: string) => [...paymentKeys.all, 'stats', period] as const,
};

// ==================== HOOK PRINCIPAL ====================

export const usePayments = (isAdmin: boolean = false) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // ==================== QUERIES ====================

  /**
   * Récupère le résumé des paiements
   */
  const summaryQuery = useQuery({
    queryKey: paymentKeys.summary(),
    queryFn: () => paymentService.getPaymentSummary(),
    staleTime: 5 * 60 * 1000,
  });

  /**
   * Récupère la liste des transactions
   */
  const transactionsQuery = (filters?: any) => {
    return useQuery({
      queryKey: paymentKeys.transactions(filters),
      queryFn: () => paymentService.getTransactions(filters),
      staleTime: 2 * 60 * 1000,
    });
  };

  /**
   * Récupère une transaction par son ID
   */
  const transactionQuery = (transactionId: string) => {
    return useQuery({
      queryKey: paymentKeys.transaction(transactionId),
      queryFn: () => paymentService.getTransactionById(transactionId),
      enabled: !!transactionId,
      staleTime: 5 * 60 * 1000,
    });
  };

  /**
   * Récupère la liste des reversements
   */
  const payoutsQuery = (filters?: any) => {
    return useQuery({
      queryKey: paymentKeys.payouts(filters),
      queryFn: () => paymentService.getPayouts(filters),
      enabled: isAdmin,
      staleTime: 2 * 60 * 1000,
    });
  };

  /**
   * Récupère un reversement par son ID
   */
  const payoutQuery = (payoutId: string) => {
    return useQuery({
      queryKey: paymentKeys.payout(payoutId),
      queryFn: () => paymentService.getPayoutById(payoutId),
      enabled: isAdmin && !!payoutId,
      staleTime: 5 * 60 * 1000,
    });
  };

  /**
   * Récupère les statistiques des paiements
   */
  const statsQuery = (period: 'day' | 'week' | 'month' | 'year' = 'month') => {
    return useQuery({
      queryKey: paymentKeys.stats(period),
      queryFn: () => paymentService.getPaymentStats({ period }),
      enabled: isAdmin,
      staleTime: 10 * 60 * 1000,
    });
  };

  // ==================== MUTATIONS ADMIN ====================

  /**
   * Marque un paiement comme effectué (admin)
   */
  const markAsPaidMutation = useMutation({
    mutationFn: ({ transactionId, data }: { 
      transactionId: string; 
      data?: { transaction_id?: string; notes?: string } 
    }) => paymentService.markPaymentAsPaid(transactionId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: paymentKeys.transactions() });
      queryClient.invalidateQueries({ 
        queryKey: paymentKeys.transaction(variables.transactionId) 
      });
      queryClient.invalidateQueries({ queryKey: paymentKeys.summary() });
      
      toast({
        title: "Paiement marqué comme effectué",
        description: "Le statut a été mis à jour",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: error.message || "Impossible de mettre à jour le paiement",
        variant: "destructive",
      });
    },
  });

  /**
   * Rembourse une transaction (admin)
   */
  const refundTransactionMutation = useMutation({
    mutationFn: ({ transactionId, data }: { 
      transactionId: string; 
      data: { amount?: number; reason: string; notify_users?: boolean } 
    }) => paymentService.refundTransaction(transactionId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: paymentKeys.transactions() });
      queryClient.invalidateQueries({ 
        queryKey: paymentKeys.transaction(variables.transactionId) 
      });
      queryClient.invalidateQueries({ queryKey: paymentKeys.summary() });
      
      toast({
        title: "Remboursement effectué",
        description: "La transaction a été remboursée",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: error.message || "Impossible de rembourser",
        variant: "destructive",
      });
    },
  });

  /**
   * Traite un reversement (admin)
   */
  const processPayoutMutation = useMutation({
    mutationFn: ({ payoutId, data }: { 
      payoutId: string; 
      data: { transaction_id?: string; notes?: string } 
    }) => paymentService.processPayout(payoutId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: paymentKeys.payouts() });
      queryClient.invalidateQueries({ 
        queryKey: paymentKeys.payout(variables.payoutId) 
      });
      
      toast({
        title: "Reversement traité",
        description: "Le paiement a été effectué",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: error.message || "Impossible de traiter le reversement",
        variant: "destructive",
      });
    },
  });

  // ==================== FONCTIONS UTILITAIRES ====================

  /**
   * Génère une facture
   */
  const generateInvoice = async (transactionId: string): Promise<void> => {
    try {
      const blob = await paymentService.generateInvoice(transactionId);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `facture-${transactionId}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Impossible de générer la facture",
        variant: "destructive",
      });
    }
  };

  /**
   * Exporte les transactions
   */
  const exportTransactions = async (
    format: 'csv' | 'excel' | 'pdf',
    filters?: any
  ): Promise<void> => {
    try {
      const blob = await paymentService.exportTransactionsAs(format, filters);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `transactions.${format === 'excel' ? 'xlsx' : format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Impossible d'exporter les transactions",
        variant: "destructive",
      });
    }
  };

  /**
   * Formate un montant
   */
  const formatAmount = (amount: number, currency: string = 'FCFA'): string => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XAF',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount).replace('XAF', currency);
  };

  // ==================== RETOUR DU HOOK ====================

  return {
    // Données
    summary: summaryQuery.data,
    isLoadingSummary: summaryQuery.isLoading,

    // Transactions
    transactions: transactionsQuery,
    transaction: transactionQuery,
    
    // Reversements (admin)
    payouts: payoutsQuery,
    payout: payoutQuery,
    
    // Statistiques (admin)
    stats: statsQuery,

    // Utilitaires
    formatAmount,

    // Actions (admin)
    ...(isAdmin && {
      markAsPaid: markAsPaidMutation.mutate,
      isMarkingAsPaid: markAsPaidMutation.isPending,

      refundTransaction: refundTransactionMutation.mutate,
      isRefunding: refundTransactionMutation.isPending,

      processPayout: processPayoutMutation.mutate,
      isProcessingPayout: processPayoutMutation.isPending,
    }),

    // Actions publiques
    generateInvoice,
    exportTransactions,

    // Rafraîchissement
    refetchSummary: () => queryClient.invalidateQueries({ queryKey: paymentKeys.summary() }),
    refetchTransactions: (filters?: any) => queryClient.invalidateQueries({ 
      queryKey: paymentKeys.transactions(filters) 
    }),
  };
};
