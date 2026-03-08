// services/admin/payments.service.ts

import { ApiResponse, PaginatedResponse, Payment, PaymentSummary, Payout } from "@/app/types";
import { handleResponse } from '@/app/lib/error-handler';

// ==================== RÉSUMÉ DES PAIEMENTS ====================

/**
 * Récupère le résumé des paiements
 */
export async function getPaymentSummary(): Promise<PaymentSummary> {
  try {
    const res = await fetch('/api/admin/payments/summary', {
      method: 'GET',
      cache: 'no-store',
    });

    return await handleResponse<PaymentSummary>(res);
  } catch (error) {
    console.error('Erreur getPaymentSummary:', error);
    throw error;
  }
}

// ==================== TRANSACTIONS ====================

/**
 * Récupère la liste des transactions
 */
export async function getTransactions(filters?: {
  status?: string;
  client_id?: number;
  freelancer_id?: number;
  date_from?: string;
  date_to?: string;
  page?: number;
  per_page?: number;
}): Promise<PaginatedResponse<Payment>> {
  try {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, String(value));
        }
      });
    }

    const res = await fetch(`/api/admin/payments/transactions?${params.toString()}`, {
      method: 'GET',
      cache: 'no-store',
    });

    return await handleResponse<PaginatedResponse<Payment>>(res);
  } catch (error) {
    console.error('Erreur getTransactions:', error);
    throw error;
  }
}

/**
 * Récupère une transaction par son ID
 */
export async function getTransactionById(transactionId: string): Promise<Payment> {
  try {
    const res = await fetch(`/api/admin/payments/transactions/${transactionId}`, {
      method: 'GET',
      cache: 'no-store',
    });

    return await handleResponse<Payment>(res);
  } catch (error) {
    console.error(`Erreur getTransactionById ${transactionId}:`, error);
    throw error;
  }
}

/**
 * Marquer un paiement comme effectué
 */
export async function markPaymentAsPaid(
  transactionId: string,
  data?: {
    transaction_id?: string;
    notes?: string;
  }
): Promise<{ message: string; payment: Payment }> {
  try {
    const res = await fetch(`/api/admin/payments/transactions/${transactionId}/mark-paid`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data || {}),
    });

    return await handleResponse<{ message: string; payment: Payment }>(res);
  } catch (error) {
    console.error(`Erreur markPaymentAsPaid ${transactionId}:`, error);
    throw error;
  }
}

/**
 * Rembourser une transaction
 */
export async function refundTransaction(
  transactionId: string,
  data: {
    amount?: number;
    reason: string;
    notify_users?: boolean;
  }
): Promise<{ message: string; refund_id: string }> {
  try {
    const res = await fetch(`/api/admin/payments/transactions/${transactionId}/refund`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
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
 */
export async function getPayouts(filters?: {
  status?: string;
  freelancer_id?: number;
  date_from?: string;
  date_to?: string;
  page?: number;
  per_page?: number;
}): Promise<PaginatedResponse<Payout>> {
  try {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, String(value));
        }
      });
    }

    const res = await fetch(`/api/admin/payments/payouts?${params.toString()}`, {
      method: 'GET',
      cache: 'no-store',
    });

    return await handleResponse<PaginatedResponse<Payout>>(res);
  } catch (error) {
    console.error('Erreur getPayouts:', error);
    throw error;
  }
}

/**
 * Récupère un reversement par son ID
 */
export async function getPayoutById(payoutId: string): Promise<Payout> {
  try {
    const res = await fetch(`/api/admin/payments/payouts/${payoutId}`, {
      method: 'GET',
      cache: 'no-store',
    });

    return await handleResponse<Payout>(res);
  } catch (error) {
    console.error(`Erreur getPayoutById ${payoutId}:`, error);
    throw error;
  }
}

/**
 * Traiter un reversement
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
      headers: {
        'Content-Type': 'application/json',
      },
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
 */
export async function generateInvoice(transactionId: string): Promise<Blob> {
  try {
    const res = await fetch(`/api/admin/payments/transactions/${transactionId}/invoice`, {
      method: 'GET',
      headers: {
        'Accept': 'application/pdf',
      },
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw {
        status: res.status,
        message: errorData.message || 'Erreur lors de la génération de la facture',
      };
    }

    return await res.blob();
  } catch (error) {
    console.error(`Erreur generateInvoice ${transactionId}:`, error);
    throw error;
  }
}

/**
 * Récupérer l'URL de la facture pour téléchargement direct
 */
export async function getInvoiceUrl(transactionId: string): Promise<string> {
  try {
    const res = await fetch(`/api/admin/payments/transactions/${transactionId}/invoice`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
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
 */
export async function exportTransactions(filters?: {
  status?: string;
  client_id?: number;
  freelancer_id?: number;
  date_from?: string;
  date_to?: string;
}): Promise<Blob> {
  try {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, String(value));
        }
      });
    }

    const res = await fetch(`/api/admin/payments/export?${params.toString()}`, {
      method: 'GET',
      headers: {
        'Accept': 'text/csv',
      },
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw {
        status: res.status,
        message: errorData.message || 'Erreur lors de l\'export',
      };
    }

    return await res.blob();
  } catch (error) {
    console.error('Erreur exportTransactions:', error);
    throw error;
  }
}

/**
 * Exporter les transactions au format spécifié
 */
export async function exportTransactionsAs(
  format: 'csv' | 'excel' | 'pdf',
  filters?: {
    status?: string;
    client_id?: number;
    freelancer_id?: number;
    date_from?: string;
    date_to?: string;
  }
): Promise<Blob> {
  try {
    const params = new URLSearchParams({ format });
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, String(value));
        }
      });
    }

    const acceptHeader = 
      format === 'csv' ? 'text/csv' :
      format === 'excel' ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' :
      'application/pdf';

    const res = await fetch(`/api/admin/payments/export?${params.toString()}`, {
      method: 'GET',
      headers: {
        'Accept': acceptHeader,
      },
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw {
        status: res.status,
        message: errorData.message || 'Erreur lors de l\'export',
      };
    }

    return await res.blob();
  } catch (error) {
    console.error('Erreur exportTransactionsAs:', error);
    throw error;
  }
}

// ==================== STATISTIQUES ====================

/**
 * Récupère les statistiques des paiements
 */
export async function getPaymentStats(filters?: {
  date_from?: string;
  date_to?: string;
  period?: 'day' | 'week' | 'month' | 'year';
}): Promise<{
  total_revenue: number;
  platform_fees: number;
  pending_payments: number;
  completed_payments: number;
  refunded_payments: number;
  average_transaction: number;
  revenue_by_day: Array<{ date: string; amount: number }>;
}> {
  try {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, String(value));
        }
      });
    }

    const res = await fetch(`/api/admin/payments/stats?${params.toString()}`, {
      method: 'GET',
      cache: 'no-store',
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
