import { AdminNotification } from '../types/admin';

/**
 * Récupère les notifications de l'admin
 */
export async function getAdminNotifications(include_read: boolean = false): Promise<AdminNotification[]> {
  try {
    const res = await fetch(`/api/admin/notifications?include_read=${include_read}`, {
      method: 'GET',
      cache: 'no-store',
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || 'Erreur lors du chargement des notifications');
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error('Erreur getAdminNotifications:', error);
    throw error;
  }
}

/**
 * Récupère le nombre de notifications non lues
 */
export async function getUnreadNotificationsCount(): Promise<{ count: number }> {
  try {
    const res = await fetch('/api/admin/notifications/unread-count', {
      method: 'GET',
      cache: 'no-store',
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || 'Erreur lors du chargement du compteur');
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error('Erreur getUnreadNotificationsCount:', error);
    throw error;
  }
}

/**
 * Marquer une notification comme lue
 */
export async function markNotificationAsRead(notificationId: string): Promise<{ message: string }> {
  try {
    const res = await fetch(`/api/admin/notifications/${notificationId}/read`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const responseData = await res.json();

    if (!res.ok) {
      throw {
        message: responseData.message || 'Erreur lors du marquage',
      };
    }

    return responseData;
  } catch (error) {
    console.error(`Erreur markNotificationAsRead ${notificationId}:`, error);
    throw error;
  }
}

/**
 * Marquer toutes les notifications comme lues
 */
export async function markAllNotificationsAsRead(): Promise<{ message: string }> {
  try {
    const res = await fetch('/api/admin/notifications/read-all', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const responseData = await res.json();

    if (!res.ok) {
      throw {
        message: responseData.message || 'Erreur lors du marquage',
      };
    }

    return responseData;
  } catch (error) {
    console.error('Erreur markAllNotificationsAsRead:', error);
    throw error;
  }
}

/**
 * Supprimer une notification
 */
export async function deleteNotification(notificationId: string): Promise<{ message: string }> {
  try {
    const res = await fetch(`/api/admin/notifications/${notificationId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const responseData = await res.json();

    if (!res.ok) {
      throw {
        message: responseData.message || 'Erreur lors de la suppression',
      };
    }

    return responseData;
  } catch (error) {
    console.error(`Erreur deleteNotification ${notificationId}:`, error);
    throw error;
  }
}

/**
 * Envoyer une notification à tous les admins
 */
export async function sendNotificationToAdmins(data: {
  type: string;
  title: string;
  message: string;
  action_url?: string;
  priority?: string;
}): Promise<{ message: string }> {
  try {
    const res = await fetch('/api/admin/notifications/send-to-all', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const responseData = await res.json();

    if (!res.ok) {
      throw {
        message: responseData.message || 'Erreur lors de l\'envoi',
      };
    }

    return responseData;
  } catch (error) {
    console.error('Erreur sendNotificationToAdmins:', error);
    throw error;
  }
}

/**
 * Envoyer une notification à un admin spécifique
 */
export async function sendNotificationToAdmin(
  adminId: number,
  data: {
    type: string;
    title: string;
    message: string;
    action_url?: string;
  }
): Promise<{ message: string }> {
  try {
    const res = await fetch(`/api/admin/notifications/send/${adminId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const responseData = await res.json();

    if (!res.ok) {
      throw {
        message: responseData.message || 'Erreur lors de l\'envoi',
      };
    }

    return responseData;
  } catch (error) {
    console.error(`Erreur sendNotificationToAdmin ${adminId}:`, error);
    throw error;
  }
}