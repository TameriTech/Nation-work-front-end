// services/support.service.ts

import { PaginatedResponse, SupportTicket } from '../types/admin';
import { handleResponse } from '../lib/error-handler';

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

    return await handleResponse<PaginatedResponse<SupportTicket>>(res);
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

    return await handleResponse<SupportTicket>(res);
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

    return await handleResponse<{ message: string; ticket: SupportTicket }>(res);
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

    return await handleResponse<{ message: string; timestamp: string }>(res);
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

    return await handleResponse<{ message: string; ticket: SupportTicket }>(res);
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

    return await handleResponse<{ message: string; ticket: SupportTicket }>(res);
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
    const res = await fetch('/api/admin/support/tickets/stats', {
      method: 'GET',
      cache: 'no-store',
    });

    return await handleResponse<{
      open_tickets: number;
      avg_response_time: string;
      tickets_by_priority: Record<string, number>;
      tickets_by_status: Record<string, number>;
    }>(res);
  } catch (error) {
    console.error('Erreur getSupportStats:', error);
    throw error;
  }
}

/**
 * Récupère l'historique d'un ticket
 */
export async function getTicketHistory(ticketId: string): Promise<{
  created_at: string;
  updated_at: string;
  actions: Array<{
    type: string;
    user: string;
    timestamp: string;
    details: string;
  }>;
}> {
  try {
    const res = await fetch(`/api/admin/support/tickets/${ticketId}/history`, {
      method: 'GET',
      cache: 'no-store',
    });

    return await handleResponse<{
      created_at: string;
      updated_at: string;
      actions: Array<{
        type: string;
        user: string;
        timestamp: string;
        details: string;
      }>;
    }>(res);
  } catch (error) {
    console.error(`Erreur getTicketHistory ${ticketId}:`, error);
    throw error;
  }
}
