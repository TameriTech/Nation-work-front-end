import { ApiResponse, PaginatedResponse, Dispute, DisputeStats, DisputeAction, RejectData } from '../types/admin';

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

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || 'Erreur lors du chargement des litiges');
    }

    const data = await res.json();
    return data;
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

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || 'Litige non trouvé');
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error(`Erreur getDisputeById ${disputeId}:`, error);
    throw error;
  }
}

/**
 * Récupère les statistiques des litiges
 */
export async function getDisputeStats(): Promise<DisputeStats> {
  try {
    const res = await fetch('/api/admin/disputes/stats', {
      method: 'GET',
      cache: 'no-store',
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || 'Erreur lors du chargement des statistiques');
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error('Erreur getDisputeStats:', error);
    throw error;
  }
}

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
      body: JSON.stringify(
        { assigned_to: adminId, note:notes ?? null }
      ),
    });

    const responseData = await res.json();

    if (!res.ok) {
      throw {
        message: responseData.message || 'Erreur lors de l\'assignation',
      };
    }

    return responseData;
  } catch (error) {
    console.error(`Erreur assignDispute ${disputeId}:`, error);
    throw error;
  }
}

/**
 * Ajouter un message à un litige
 */
export async function addDisputeMessage(
  disputeId: number,
  data: {
    message: string;
    is_private?: boolean;
  }
): Promise<{ message: string; timestamp: string }> {
  try {
    const res = await fetch(`/api/admin/disputes/${disputeId}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const responseData = await res.json();

    if (!res.ok) {
      throw {
        message: responseData.message || 'Erreur lors de l\'envoi du message',
      };
    }

    return responseData;
  } catch (error) {
    console.error(`Erreur addDisputeMessage ${disputeId}:`, error);
    throw error;
  }
}

/**
 * Résoudre un litige
 */
export async function resolveDispute(
  disputeId: number,
  data: {
    resolution: string;
    refund_percentage?: number;
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

    const responseData = await res.json();

    if (!res.ok) {
      throw {
        message: responseData.message || 'Erreur lors de la résolution',
        field: responseData.field,
      };
    }

    return responseData;
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
      body: JSON.stringify({ data }),
    });

    const responseData = await res.json();

    if (!res.ok) {
      throw {
        message: responseData.message || 'Erreur lors du rejet',
      };
    }

    return responseData;
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
  reason: string
): Promise<{ message: string; dispute: Dispute }> {
  try {
    const res = await fetch(`/api/admin/disputes/${disputeId}/escalate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ reason }),
    });

    const responseData = await res.json();

    if (!res.ok) {
      throw {
        message: responseData.message || 'Erreur lors de l\'escalade',
      };
    }

    return responseData;
  } catch (error) {
    console.error(`Erreur escalateDispute ${disputeId}:`, error);
    throw error;
  }
}

/**
 * Récupère l'historique d'un litige
 */
export async function getDisputeHistory(disputeId: number): Promise<any[]> {
  try {
    const res = await fetch(`/api/admin/disputes/${disputeId}/history`, {
      method: 'GET',
      cache: 'no-store',
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || 'Erreur lors du chargement de l\'historique');
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error(`Erreur getDisputeHistory ${disputeId}:`, error);
    throw error;
  }
}