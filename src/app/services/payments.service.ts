import { ApiResponse, PaginatedResponse, Payment, PaymentSummary, Payout } from '../types/admin';

/**
 * Récupère le résumé des paiements
 */
export async function getPaymentSummary(): Promise<PaymentSummary> {
  try {
    const res = await fetch('/api/admin/payments/summary', {
      method: 'GET',
      cache: 'no-store',
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || 'Erreur lors du chargement du résumé');
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error('Erreur getPaymentSummary:', error);
    throw error;
  }
}

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

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || 'Erreur lors du chargement des transactions');
    }

    const data = await res.json();
    return data;
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

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || 'Transaction non trouvée');
    }

    const data = await res.json();
    return data;
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

    const responseData = await res.json();

    if (!res.ok) {
      throw {
        message: responseData.message || 'Erreur lors de la mise à jour',
      };
    }

    return responseData;
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

    const responseData = await res.json();

    if (!res.ok) {
      throw {
        message: responseData.message || 'Erreur lors du remboursement',
        field: responseData.field,
      };
    }

    return responseData;
  } catch (error) {
    console.error(`Erreur refundTransaction ${transactionId}:`, error);
    throw error;
  }
}

/**
 * Récupère la liste des reversements
 */
export async function getPayouts(filters?: {
  status?: string;
  freelancer_id?: number;
  date_from?: string;
  date_to?: string;
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

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || 'Erreur lors du chargement des reversements');
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error('Erreur getPayouts:', error);
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

    const responseData = await res.json();

    if (!res.ok) {
      throw {
        message: responseData.message || 'Erreur lors du traitement',
      };
    }

    return responseData;
  } catch (error) {
    console.error(`Erreur processPayout ${payoutId}:`, error);
    throw error;
  }
}

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
      const error = await res.json();
      throw new Error(error.message || 'Erreur lors de la génération de la facture');
    }

    return await res.blob();
  } catch (error) {
    console.error(`Erreur generateInvoice ${transactionId}:`, error);
    throw error;
  }
}

/**
 * Exporter les transactions (CSV)
 */
export async function exportTransactions(filters?: any): Promise<Blob> {
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
      const error = await res.json();
      throw new Error(error.message || 'Erreur lors de l\'export');
    }

    return await res.blob();
  } catch (error) {
    console.error('Erreur exportTransactions:', error);
    throw error;
  }
}