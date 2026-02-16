import { PaginatedResponse, SupportTicket } from '../types/admin';

/**
 * Récupère les tickets de support
 */
export async function getSupportTickets(filters?: {
  status?: string;
  priority?: string;
  user_id?: number;
  assigned_to?: number;
  date_from?: string;
  date_to?: string;
  page?: number;
  per_page?: number;
}): Promise<PaginatedResponse<SupportTicket>> {
  try {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, String(value));
        }
      });
    }

    const res = await fetch(`/api/admin/support/tickets?${params.toString()}`, {
      method: 'GET',
      cache: 'no-store',
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || 'Erreur lors du chargement des tickets');
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error('Erreur getSupportTickets:', error);
    throw error;
  }
}

/**
 * Récupère un ticket par son ID
 */
export async function getSupportTicketById(ticketId: string): Promise<SupportTicket> {
  try {
    const res = await fetch(`/api/admin/support/tickets/${ticketId}`, {
      method: 'GET',
      cache: 'no-store',
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || 'Ticket non trouvé');
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error(`Erreur getSupportTicketById ${ticketId}:`, error);
    throw error;
  }
}

/**
 * Assigner un ticket à un admin
 */
export async function assignTicket(
  ticketId: string,
  adminId: number
): Promise<{ message: string; ticket: SupportTicket }> {
  try {
    const res = await fetch(`/api/admin/support/tickets/${ticketId}/assign`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ assigned_to: adminId }),
    });

    const responseData = await res.json();

    if (!res.ok) {
      throw {
        message: responseData.message || 'Erreur lors de l\'assignation',
      };
    }

    return responseData;
  } catch (error) {
    console.error(`Erreur assignTicket ${ticketId}:`, error);
    throw error;
  }
}

/**
 * Répondre à un ticket
 */
export async function replyToTicket(
  ticketId: string,
  message: string,
  is_private: boolean = false
): Promise<{ message: string; timestamp: string }> {
  try {
    const res = await fetch(`/api/admin/support/tickets/${ticketId}/reply`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message, is_private }),
    });

    const responseData = await res.json();

    if (!res.ok) {
      throw {
        message: responseData.message || 'Erreur lors de l\'envoi de la réponse',
      };
    }

    return responseData;
  } catch (error) {
    console.error(`Erreur replyToTicket ${ticketId}:`, error);
    throw error;
  }
}

/**
 * Fermer un ticket
 */
export async function closeTicket(
  ticketId: string,
  resolution: string
): Promise<{ message: string; ticket: SupportTicket }> {
  try {
    const res = await fetch(`/api/admin/support/tickets/${ticketId}/close`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ resolution }),
    });

    const responseData = await res.json();

    if (!res.ok) {
      throw {
        message: responseData.message || 'Erreur lors de la fermeture',
      };
    }

    return responseData;
  } catch (error) {
    console.error(`Erreur closeTicket ${ticketId}:`, error);
    throw error;
  }
}

/**
 * Rouvrir un ticket
 */
export async function reopenTicket(ticketId: string): Promise<{ message: string; ticket: SupportTicket }> {
  try {
    const res = await fetch(`/api/admin/support/tickets/${ticketId}/reopen`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const responseData = await res.json();

    if (!res.ok) {
      throw {
        message: responseData.message || 'Erreur lors de la réouverture',
      };
    }

    return responseData;
  } catch (error) {
    console.error(`Erreur reopenTicket ${ticketId}:`, error);
    throw error;
  }
}

/**
 * Récupère les statistiques du support
 */
export async function getSupportStats(): Promise<{
  open_tickets: number;
  avg_response_time: string;
  tickets_by_priority: Record<string, number>;
  tickets_by_status: Record<string, number>;
}> {
  try {
    const res = await fetch('/api/admin/support/stats', {
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
    console.error('Erreur getSupportStats:', error);
    throw error;
  }
}