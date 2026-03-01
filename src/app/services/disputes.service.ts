// services/admin/disputes.service.ts

import { ApiResponse, PaginatedResponse, Dispute, DisputeStats, DisputeAction, RejectData, DisputeHistoryEntry } from '../types/admin';
import { handleResponse } from '@/app/lib/error-handler';

// ==================== LISTE DES LITIGES ====================

/**
 * Récupère la liste des litiges
 */
export async function getDisputes(filters?: {
  status?: string;
  priority?: string;
  opened_by?: string;
  date_from?: string;
  date_to?: string;
  assigned_to?: number;
  page?: number;
  per_page?: number;
}): Promise<PaginatedResponse<Dispute>> {
  try {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, String(value));
        }
      });
    }

    const res = await fetch(`/api/admin/disputes?${params.toString()}`, {
      method: 'GET',
      cache: 'no-store',
    });

    return await handleResponse<PaginatedResponse<Dispute>>(res);
  } catch (error) {
    console.error('Erreur getDisputes:', error);
    throw error;
  }
}

/**
 * Récupère un litige par son ID
 */
export async function getDisputeById(disputeId: number): Promise<Dispute> {
  try {
    const res = await fetch(`/api/admin/disputes/${disputeId}`, {
      method: 'GET',
      cache: 'no-store',
    });

    return await handleResponse<Dispute>(res);
  } catch (error) {
    console.error(`Erreur getDisputeById ${disputeId}:`, error);
    throw error;
  }
}

/**
 * Récupère les litiges assignés à un admin spécifique
 */
export async function getDisputesByAdmin(
  adminId: number,
  filters?: {
    status?: string;
    priority?: string;
    page?: number;
    per_page?: number;
  }
): Promise<PaginatedResponse<Dispute>> {
  try {
    const params = new URLSearchParams({ assigned_to: adminId.toString() });
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, String(value));
        }
      });
    }

    const res = await fetch(`/api/admin/disputes?${params.toString()}`, {
      method: 'GET',
      cache: 'no-store',
    });

    return await handleResponse<PaginatedResponse<Dispute>>(res);
  } catch (error) {
    console.error(`Erreur getDisputesByAdmin ${adminId}:`, error);
    throw error;
  }
}

// ==================== STATISTIQUES ====================

/**
 * Récupère les statistiques des litiges
 */
export async function getDisputeStats(): Promise<DisputeStats> {
  try {
    const res = await fetch('/api/admin/disputes/stats', {
      method: 'GET',
      cache: 'no-store',
    });

    return await handleResponse<DisputeStats>(res);
  } catch (error) {
    console.error('Erreur getDisputeStats:', error);
    throw error;
  }
}

// ==================== GESTION DES LITIGES ====================

/**
 * Assigner un litige à un admin
 */
export async function assignDispute(
  disputeId: number,
  adminId: number,
  notes?: string,
): Promise<{ message: string; dispute: Dispute }> {
  try {
    const res = await fetch(`/api/admin/disputes/${disputeId}/assign`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ assigned_to: adminId, notes: notes || null }),
    });

    return await handleResponse<{ message: string; dispute: Dispute }>(res);
  } catch (error) {
    console.error(`Erreur assignDispute ${disputeId}:`, error);
    throw error;
  }
}

/**
 * Réassigner un litige (changer l'admin assigné)
 */
export async function reassignDispute(
  disputeId: number,
  newAdminId: number,
  reason?: string
): Promise<{ message: string; dispute: Dispute }> {
  try {
    const res = await fetch(`/api/admin/disputes/${disputeId}/reassign`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ assigned_to: newAdminId, reason }),
    });

    return await handleResponse<{ message: string; dispute: Dispute }>(res);
  } catch (error) {
    console.error(`Erreur reassignDispute ${disputeId}:`, error);
    throw error;
  }
}

// ==================== MESSAGES ====================

/**
 * Ajouter un message à un litige
 */
export async function addDisputeMessage(
  disputeId: number,
  data: {
    message: string;
    is_private?: boolean;
  }
): Promise<{ message: string; timestamp: string; message_id: string }> {
  try {
    const res = await fetch(`/api/admin/disputes/${disputeId}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    return await handleResponse<{ message: string; timestamp: string; message_id: string }>(res);
  } catch (error) {
    console.error(`Erreur addDisputeMessage ${disputeId}:`, error);
    throw error;
  }
}

/**
 * Récupérer tous les messages d'un litige
 */
export async function getDisputeMessages(disputeId: number): Promise<Array<{
  id: string;
  user_id: number;
  user_name: string;
  message: string;
  is_private: boolean;
  created_at: string;
}>> {
  try {
    const res = await fetch(`/api/admin/disputes/${disputeId}/messages`, {
      method: 'GET',
      cache: 'no-store',
    });

    return await handleResponse<Array<{
      id: string;
      user_id: number;
      user_name: string;
      message: string;
      is_private: boolean;
      created_at: string;
    }>>(res);
  } catch (error) {
    console.error(`Erreur getDisputeMessages ${disputeId}:`, error);
    throw error;
  }
}

// ==================== RÉSOLUTION ====================

/**
 * Résoudre un litige
 */
export async function resolveDispute(
  disputeId: number,
  data: {
    resolution: string;
    refund_percentage?: number;
    refund_amount?: number;
    notify_users?: boolean;
  }
): Promise<{ message: string; dispute: Dispute }> {
  try {
    const res = await fetch(`/api/admin/disputes/${disputeId}/resolve`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    return await handleResponse<{ message: string; dispute: Dispute }>(res);
  } catch (error) {
    console.error(`Erreur resolveDispute ${disputeId}:`, error);
    throw error;
  }
}

/**
 * Rejeter un litige
 */
export async function rejectDispute(
  disputeId: number,
  data: RejectData
): Promise<{ message: string; dispute: Dispute }> {
  try {
    const res = await fetch(`/api/admin/disputes/${disputeId}/reject`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    return await handleResponse<{ message: string; dispute: Dispute }>(res);
  } catch (error) {
    console.error(`Erreur rejectDispute ${disputeId}:`, error);
    throw error;
  }
}

/**
 * Escalader un litige
 */
export async function escalateDispute(
  disputeId: number,
  reason: string,
  priority?: 'high' | 'urgent'
): Promise<{ message: string; dispute: Dispute }> {
  try {
    const res = await fetch(`/api/admin/disputes/${disputeId}/escalate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ reason, priority }),
    });

    return await handleResponse<{ message: string; dispute: Dispute }>(res);
  } catch (error) {
    console.error(`Erreur escalateDispute ${disputeId}:`, error);
    throw error;
  }
}

/**
 * Mettre en attente un litige
 */
export async function holdDispute(
  disputeId: number,
  reason: string,
  hold_until?: string
): Promise<{ message: string; dispute: Dispute }> {
  try {
    const res = await fetch(`/api/admin/disputes/${disputeId}/hold`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ reason, hold_until }),
    });

    return await handleResponse<{ message: string; dispute: Dispute }>(res);
  } catch (error) {
    console.error(`Erreur holdDispute ${disputeId}:`, error);
    throw error;
  }
}

// ==================== HISTORIQUE ====================

/**
 * Récupère l'historique d'un litige
 */
export async function getDisputeHistory(disputeId: number): Promise<DisputeHistoryEntry[]> {
  try {
    const res = await fetch(`/api/admin/disputes/${disputeId}/history`, {
      method: 'GET',
      cache: 'no-store',
    });

    return await handleResponse<DisputeHistoryEntry[]>(res);
  } catch (error) {
    console.error(`Erreur getDisputeHistory ${disputeId}:`, error);
    throw error;
  }
}

// ==================== ACTIONS GROUPÉES ====================

/**
 * Traiter plusieurs litiges en lot
 */
export async function bulkProcessDisputes(
  disputeIds: number[],
  action: 'assign' | 'resolve' | 'reject' | 'escalate',
  data?: any
): Promise<{ message: string; processed_count: number; results: any[] }> {
  try {
    const res = await fetch('/api/admin/disputes/bulk-process', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        dispute_ids: disputeIds,
        action,
        ...data
      }),
    });

    return await handleResponse<{ message: string; processed_count: number; results: any[] }>(res);
  } catch (error) {
    console.error('Erreur bulkProcessDisputes:', error);
    throw error;
  }
}

// ==================== FILTRES RAPIDES ====================

/**
 * Récupère les litiges urgents
 */
export async function getUrgentDisputes(limit: number = 10): Promise<Dispute[]> {
  try {
    const res = await fetch(`/api/admin/disputes?priority=urgent&status=open&per_page=${limit}`, {
      method: 'GET',
      cache: 'no-store',
    });

    const data = await handleResponse<PaginatedResponse<Dispute>>(res);
    return data.items;
  } catch (error) {
    console.error('Erreur getUrgentDisputes:', error);
    throw error;
  }
}

/**
 * Récupère les litiges en attente depuis plus de X jours
 */
export async function getStaleDisputes(days: number = 7): Promise<Dispute[]> {
  try {
    const date = new Date();
    date.setDate(date.getDate() - days);
    const date_from = date.toISOString().split('T')[0];

    const res = await fetch(`/api/admin/disputes?date_to=${date_from}&status=open&per_page=50`, {
      method: 'GET',
      cache: 'no-store',
    });

    const data = await handleResponse<PaginatedResponse<Dispute>>(res);
    return data.items;
  } catch (error) {
    console.error('Erreur getStaleDisputes:', error);
    throw error;
  }
}
