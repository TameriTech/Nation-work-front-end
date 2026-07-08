// services/admin/payments.service.ts
import { 
  PaymentListResponse,
  PaymentSummary,
  Payout,
  Transaction,
  PaymentStats,
  PayoutStats,
  Invoice,
  PaymentEligibility,
  PaginatedResponse,
  PaymentStatsResponse,
  CreatePaymentDto,
  UpdatePaymentDto,
  ProcessPaymentDto,
  RefundPaymentDto,
  InitiatePaymentDto,
  CreatePayoutDto,
  UpdatePayoutDto,
  BatchPayoutDto,
  PaymentStatus,
  PayoutStatus,
  PaymentDetailResponse
} from "@/app/types";
import { 
  PaymentFiltersFormData,
  PayoutFiltersFormData,
  ExportTransactionsFormData,
  PaymentStatsFiltersFormData,
  MarkPaymentAsPaidFormData,
  RefundPaymentFormData,
  CreatePayoutFormData,
  BatchPayoutFormData,
  PaymentFiltersSchema,
  PayoutFiltersSchema,
  ExportTransactionsSchema,
  PaymentStatsFiltersSchema,
  MarkPaymentAsPaidSchema,
  RefundPaymentSchema,
  CreatePayoutSchema,
  BatchPayoutSchema
} from "@/app/lib/validators/payment.validator";
import { handleResponse } from '@/app/lib/error-handler';

// ==================== RÉSUMÉ DES PAIEMENTS ====================

/**
 * Récupère le résumé des paiements
 * GET /api/admin/payments/summary
 */
export async function getPaymentSummary(): Promise<PaymentSummary> {
  try {
    const res = await fetch('/api/admin/payments/summary', {
      method: 'GET',
      cache: 'no-store',
      headers: { 'Content-Type': 'application/json' },
    });
    return await handleResponse<PaymentSummary>(res);
  } catch (error) {
    console.error('Erreur getPaymentSummary:', error);
    throw error;
  }
}

/**
 * Récupère le résumé des paiements de l'utilisateur connecté
 * GET /api/payments/summary 
 */

export async function getUserPaymentSummary(): Promise<PaymentSummary> {
  try {
    const res = await fetch('/api/payments/summary', {
      method: 'GET',
      cache: 'no-store',
      headers: { 'Content-Type': 'application/json' },
    });
    return await handleResponse<PaymentSummary>(res);
  } catch (error) {
    console.error('Erreur getUserPaymentSummary:', error);
    throw error;
  }
}

// ==================== TRANSACTIONS ====================

/**
 * Récupère la liste des transactions
 * GET /api/admin/payments/transactions
 */
export async function getTransactions(
  filters?: PaymentFiltersFormData
): Promise<PaginatedResponse<PaymentListResponse>> {
  try {
    const validatedFilters = filters ? PaymentFiltersSchema.parse(filters) : { page: 1, per_page: 20 };
    const params = new URLSearchParams();
    
    Object.entries(validatedFilters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, String(value));
      }
    });

    const res = await fetch(`/api/admin/payments/transactions?${params.toString()}`, {
      method: 'GET',
      cache: 'no-store',
      headers: { 'Content-Type': 'application/json' },
    });

    return await handleResponse<PaginatedResponse<PaymentListResponse>>(res);
  } catch (error) {
    console.error('Erreur getTransactions:', error);
    throw error;
  }
}


/**
 * Récupère les historiques de paiements de l'utilisateur connecté
 */
export async function getUserPaymentHistory(): Promise<PaymentListResponse[]> {
  try {
    const res = await fetch(`/api/payments/transactions?history=true`, {
      method: 'GET',
      cache: 'no-store',
      headers: { 'Content-Type': 'application/json' },
    });
    return await handleResponse<PaymentListResponse[]>(res);
  } catch (error) {
    console.error('Erreur getUserPaymentHistory:', error);
    throw error;
  }
}


// Transform API response to front-end Payment type
function transformPaymentDetail(response: PaymentDetailResponse): PaymentDetailResponse {
  return {
    id: response.id,
    invoice_number: response.invoice_number,
    amount: response.amount,
    status: response.status,
    payment_method: response.payment_method,
    platform_fee: response.platform_fee,
    platform_fee_percentage: response.platform_fee_percentage,
    provider_payout: response.provider_payout,
    created_at: response.created_at,
    paid_at: response.payment_date,
    transaction_id: response.transaction_id,
    payment_intent_id: response.payment_intent_id,
    escrow_release_date: response.escrow_release_date,
    refund_reason: response.refund_reason,
    refunded_at: response.refund_date,
    refund_amount: response.refund_amount,
    notes: response.notes,
    service_id: response.service?.id ,
    service_title: response.service?.title,
    client: response.client ? {
      id: response.client.id,
      name: response.client.full_name || response.client.username || 'N/A',
      email: response.client.email,
      username: response.client.username,
      full_name: response.client.full_name,
      profile_picture: response.client.profile_picture,
    } : { id: 0, name: 'N/A' },
    provider: response.provider ? {
      id: response.provider.id,
      name: response.provider.full_name || response.provider.username || 'N/A',
      email: response.provider.email,
      username: response.provider.username,
      full_name: response.provider.full_name,
      profile_picture: response.provider.profile_picture,
    } : undefined,
    service: response.service ? {
      id: response.service.id,
      title: response.service.title,
      code: response.service.code,
      status: response.service.status,
    } : { id: 0, title: 'N/A', code: '', status: '' },
    transactions: response.transactions?.map(t => ({
      id: t.id,
      payment_id: t.payment_id,
      transaction_type: t.transaction_type,
      amount: t.amount,
      currency: t.currency,
      status: t.status,
      gateway_transaction_id: t.gateway_transaction_id,
      created_at: t.created_at,
    })),
    payout: response.payout ? {
      id: response.payout.id,
      payment_id: response.payout.payment_id,
      provider_id: response.payout.provider_id,
      amount: response.payout.amount,
      currency: response.payout.currency,
      status: response.payout.status,
      payout_method: response.payout.payout_method,
      batch_id: response.payout.batch_id,
      requested_at: response.payout.requested_at,
      processed_at: response.payout.processed_at,
      completed_at: response.payout.completed_at,
    } : undefined,
  };
}

/**
 * Récupère une transaction par son ID
 * GET /api/admin/payments/transactions/{transactionId}
 */
export async function getTransactionById(transactionId: string): Promise<PaymentDetailResponse> {
  try {
    const res = await fetch(`/api/admin/payments/transactions/${transactionId}`, {
      method: 'GET',
      cache: 'no-store',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });
    const data = await handleResponse<PaymentDetailResponse>(res);
    return transformPaymentDetail(data);
  } catch (error) {
    console.error(`Erreur getTransactionById ${transactionId}:`, error);
    throw error;
  }
}

/**
 * Marquer un paiement comme effectué
 * POST /api/admin/payments/transactions/{transactionId}/mark-paid
 */
export async function markPaymentAsPaid(
  transactionId: string,
  data?: MarkPaymentAsPaidFormData
): Promise<{ message: string; payment: PaymentDetailResponse }> {
  try {
    const validatedData = data ? MarkPaymentAsPaidSchema.parse(data) : {};
    const res = await fetch(`/api/admin/payments/transactions/${transactionId}/mark-paid`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(validatedData),
    });
    return await handleResponse<{ message: string; payment: PaymentDetailResponse }>(res);
  } catch (error) {
    console.error(`Erreur markPaymentAsPaid ${transactionId}:`, error);
    throw error;
  }
}

/**
 * Rembourser une transaction
 * POST /api/admin/payments/transactions/{transactionId}/refund
 */
export async function refundTransaction(
  transactionId: string,
  data: RefundPaymentFormData
): Promise<{ message: string; refund_id: string }> {
  try {
    const validatedData = RefundPaymentSchema.parse(data);
    const res = await fetch(`/api/admin/payments/transactions/${transactionId}/refund`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(validatedData),
    });
    return await handleResponse<{ message: string; refund_id: string }>(res);
  } catch (error) {
    console.error(`Erreur refundTransaction ${transactionId}:`, error);
    throw error;
  }
}

// ==================== REVERSEMENTS ====================

/**
 * Récupère la liste des reversements
 * GET /api/admin/payments/payouts
 */
export async function getPayouts(
  filters?: PayoutFiltersFormData
): Promise<PaginatedResponse<Payout>> {
  try {
    const validatedFilters = filters ? PayoutFiltersSchema.parse(filters) : { page: 1, per_page: 20 };
    const params = new URLSearchParams();
    
    Object.entries(validatedFilters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, String(value));
      }
    });

    const res = await fetch(`/api/admin/payments/payouts?${params.toString()}`, {
      method: 'GET',
      cache: 'no-store',
      headers: { 'Content-Type': 'application/json' },
    });

    return await handleResponse<PaginatedResponse<Payout>>(res);
  } catch (error) {
    console.error('Erreur getPayouts:', error);
    throw error;
  }
}

/**
 * Récupère un reversement par son ID
 * GET /api/admin/payments/payouts/{payoutId}
 */
export async function getPayoutById(payoutId: string): Promise<Payout> {
  try {
    const res = await fetch(`/api/admin/payments/payouts/${payoutId}`, {
      method: 'GET',
      cache: 'no-store',
      headers: { 'Content-Type': 'application/json' },
    });
    return await handleResponse<Payout>(res);
  } catch (error) {
    console.error(`Erreur getPayoutById ${payoutId}:`, error);
    throw error;
  }
}

/**
 * Traiter un reversement
 * POST /api/admin/payments/payouts/{payoutId}/process
 */
export async function processPayout(
  payoutId: string,
  data: {
    transaction_id?: string;
    notes?: string;
  }
): Promise<{ message: string; payout: Payout }> {
  try {
    const res = await fetch(`/api/admin/payments/payouts/${payoutId}/process`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return await handleResponse<{ message: string; payout: Payout }>(res);
  } catch (error) {
    console.error(`Erreur processPayout ${payoutId}:`, error);
    throw error;
  }
}

// ==================== FACTURES ====================

/**
 * Générer une facture
 * GET /api/admin/payments/transactions/{transactionId}/invoice
 */
export async function generateInvoice(transactionId: string): Promise<Blob> {
  try {
    const res = await fetch(`/api/admin/payments/transactions/${transactionId}/invoice`, {
      method: 'GET',
      headers: { 'Accept': 'application/pdf' },
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || 'Erreur lors de la génération de la facture');
    }

    return await res.blob();
  } catch (error) {
    console.error(`Erreur generateInvoice ${transactionId}:`, error);
    throw error;
  }
}

/**
 * Récupérer l'URL de la facture pour téléchargement direct
 * GET /api/admin/payments/transactions/{transactionId}/invoice?format=json
 */
export async function getInvoiceUrl(transactionId: string): Promise<string> {
  try {
    const res = await fetch(`/api/admin/payments/transactions/${transactionId}/invoice?format=json`, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
    });

    const data = await handleResponse<{ url: string }>(res);
    return data.url;
  } catch (error) {
    console.error(`Erreur getInvoiceUrl ${transactionId}:`, error);
    throw error;
  }
}

// ==================== EXPORT ====================

/**
 * Exporter les transactions (CSV)
 * GET /api/admin/payments/export
 */
export async function exportTransactions(
  filters?: ExportTransactionsFormData
): Promise<Blob> {
  try {
    const validatedFilters = filters ? ExportTransactionsSchema.parse(filters) : { format: 'csv' };
    const params = new URLSearchParams();
    
    Object.entries(validatedFilters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, String(value));
      }
    });

    const acceptHeader = 
      validatedFilters.format === 'csv' ? 'text/csv' :
      validatedFilters.format === 'excel' ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' :
      'application/pdf';

    const res = await fetch(`/api/admin/payments/export?${params.toString()}`, {
      method: 'GET',
      headers: { 'Accept': acceptHeader },
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || 'Erreur lors de l\'export');
    }

    return await res.blob();
  } catch (error) {
    console.error('Erreur exportTransactions:', error);
    throw error;
  }
}

/**
 * Exporter les transactions au format spécifié
 * GET /api/admin/payments/export?format={format}
 */
export async function exportTransactionsAs(
  format: 'csv' | 'excel' | 'pdf',
  filters?: Omit<ExportTransactionsFormData, 'format'>
): Promise<Blob> {
  return exportTransactions({ format, ...filters });
}

// ==================== STATISTIQUES ====================

/**
 * Récupère les statistiques des paiements
 * GET /api/admin/payments/stats
 */
export async function getPaymentStats(
  filters?: PaymentStatsFiltersFormData
): Promise<{
  total_revenue: number;
  platform_fees: number;
  pending_payments: number;
  completed_payments: number;
  refunded_payments: number;
  average_transaction: number;
  revenue_by_day: Array<{ date: string; amount: number }>;
}> {
  try {
    const validatedFilters = filters ? PaymentStatsFiltersSchema.parse(filters) : {};
    const params = new URLSearchParams();
    
    Object.entries(validatedFilters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, String(value));
      }
    });

    const res = await fetch(`/api/admin/payments/stats?${params.toString()}`, {
      method: 'GET',
      cache: 'no-store',
      headers: { 'Content-Type': 'application/json' },
    });

    return await handleResponse<{
      total_revenue: number;
      platform_fees: number;
      pending_payments: number;
      completed_payments: number;
      refunded_payments: number;
      average_transaction: number;
      revenue_by_day: Array<{ date: string; amount: number }>;
    }>(res);
  } catch (error) {
    console.error('Erreur getPaymentStats:', error);
    throw error;
  }
}

// ==================== ADMIN PAYMENTS ====================

/**
 * Récupère tous les paiements (admin)
 * GET /api/admin/payments/all
 */
export async function getAllPayments(
  filters?: PaymentFiltersFormData & { include_stats?: boolean }
): Promise<PaymentStatsResponse> {
  try {
    const params = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, String(value));
        }
      });
    }

    const res = await fetch(`/api/admin/payments/all?${params.toString()}`, {
      method: 'GET',
      cache: 'no-store',
      headers: { 'Content-Type': 'application/json' },
    });

    return await handleResponse<PaymentStatsResponse>(res);
  } catch (error) {
    console.error('Erreur getAllPayments:', error);
    throw error;
  }
}

/**
 * Récupère les statistiques globales des paiements (admin)
 * GET /api/admin/payments/stats/overview
 */
export async function getPaymentStatsOverview(): Promise<PaymentStats> {
  try {
    const res = await fetch('/api/admin/payments/stats/overview', {
      method: 'GET',
      cache: 'no-store',
      headers: { 'Content-Type': 'application/json' },
    });
    return await handleResponse<PaymentStats>(res);
  } catch (error) {
    console.error('Erreur getPaymentStatsOverview:', error);
    throw error;
  }
}

/**
 * Récupère les paiements d'un utilisateur spécifique (admin)
 * GET /api/admin/payments/user/{userId}
 */
export async function getUserPaymentsAdmin(
  userId: number,
  filters?: {
    status?: PaymentStatus;
    page?: number;
    per_page?: number;
  }
): Promise<PaginatedResponse<PaymentListResponse>> {
  try {
    const params = new URLSearchParams();
    
    if (filters?.status) params.append('status', filters.status);
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.per_page) params.append('per_page', filters.per_page.toString());

    const res = await fetch(`/api/admin/payments/user/${userId}?${params.toString()}`, {
      method: 'GET',
      cache: 'no-store',
      headers: { 'Content-Type': 'application/json' },
    });

    return await handleResponse<PaginatedResponse<PaymentListResponse>>(res);
  } catch (error) {
    console.error(`Erreur getUserPaymentsAdmin ${userId}:`, error);
    throw error;
  }
}

/**
 * Supprimer un paiement (admin)
 * DELETE /api/admin/payments/{paymentId}
 */
export async function deletePayment(
  paymentId: number,
  hard_delete: boolean = false
): Promise<{ message: string }> {
  try {
    const url = hard_delete 
      ? `/api/admin/payments/${paymentId}?hard_delete=true`
      : `/api/admin/payments/${paymentId}`;
    
    const res = await fetch(url, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    });
    return await handleResponse<{ message: string }>(res);
  } catch (error) {
    console.error(`Erreur deletePayment ${paymentId}:`, error);
    throw error;
  }
}

// ==================== PAYOUT ADMIN ====================

/**
 * Créer un reversement (admin)
 * POST /api/admin/payments/payouts
 */
export async function createPayout(
  data: CreatePayoutFormData
): Promise<Payout> {
  try {
    const validatedData = CreatePayoutSchema.parse(data);
    const res = await fetch('/api/admin/payments/payouts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(validatedData),
    });
    return await handleResponse<Payout>(res);
  } catch (error) {
    console.error('Erreur createPayout:', error);
    throw error;
  }
}

/**
 * Mettre à jour un reversement (admin)
 * PATCH /api/admin/payments/payouts/{payoutId}
 */
export async function updatePayout(
  payoutId: string,
  data: UpdatePayoutDto
): Promise<Payout> {
  try {
    const res = await fetch(`/api/admin/payments/payouts/${payoutId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return await handleResponse<Payout>(res);
  } catch (error) {
    console.error(`Erreur updatePayout ${payoutId}:`, error);
    throw error;
  }
}

/**
 * Traiter plusieurs reversements en lot
 * POST /api/admin/payments/payouts/batch/process
 */
export async function processBatchPayouts(
  data: BatchPayoutFormData
): Promise<Payout[]> {
  try {
    const validatedData = BatchPayoutSchema.parse(data);
    const res = await fetch('/api/admin/payments/payouts/batch/process', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(validatedData),
    });
    return await handleResponse<Payout[]>(res);
  } catch (error) {
    console.error('Erreur processBatchPayouts:', error);
    throw error;
  }
}

/**
 * Marquer un reversement comme terminé
 * POST /api/admin/payments/payouts/{payoutId}/complete
 */
export async function completePayout(
  payoutId: string,
  data: {
    transaction_id: string;
    gateway_response?: Record<string, any>;
  }
): Promise<Payout> {
  try {
    const res = await fetch(`/api/admin/payments/payouts/${payoutId}/complete`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return await handleResponse<Payout>(res);
  } catch (error) {
    console.error(`Erreur completePayout ${payoutId}:`, error);
    throw error;
  }
}

/**
 * Récupère les statistiques des reversements
 * GET /api/admin/payments/payouts/stats
 */
export async function getPayoutStats(): Promise<PayoutStats> {
  try {
    const res = await fetch('/api/admin/payments/payouts/stats', {
      method: 'GET',
      cache: 'no-store',
      headers: { 'Content-Type': 'application/json' },
    });
    return await handleResponse<PayoutStats>(res);
  } catch (error) {
    console.error('Erreur getPayoutStats:', error);
    throw error;
  }
}

// ==================== FILTRES RAPIDES ====================

/**
 * Récupère les paiements en attente
 */
export async function getPendingPayments(limit: number = 20): Promise<PaymentListResponse[]> {
  try {
    const response = await getTransactions({ 
      status: PaymentStatus.PENDING, 
      per_page: limit,
      page: 1,
      sort_by: 'created_at',
      sort_order: 'desc'
    });
    return response.items;
  } catch (error) {
    console.error('Erreur getPendingPayments:', error);
    throw error;
  }
}

/**
 * Récupère les reversements en attente
 */
export async function getPendingPayouts(limit: number = 20): Promise<Payout[]> {
  try {
    const response = await getPayouts({ 
      status: PayoutStatus.PENDING, 
      per_page: limit,
      page: 1
    });
    return response.items;
  } catch (error) {
    console.error('Erreur getPendingPayouts:', error);
    throw error;
  }
}
