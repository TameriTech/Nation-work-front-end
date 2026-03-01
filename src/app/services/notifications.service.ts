// services/admin/notifications.service.ts

import { AdminNotification, NotificationStats } from '../types/admin';
import { handleResponse } from '@/app/lib/error-handler';

// ==================== RÉCUPÉRATION DES NOTIFICATIONS ====================

/**
 * Récupère les notifications de l'admin
 */
export async function getAdminNotifications(include_read: boolean = false): Promise<AdminNotification[]> {
  try {
    const res = await fetch(`/api/admin/notifications?include_read=${include_read}`, {
      method: 'GET',
      cache: 'no-store',
    });

    return await handleResponse<AdminNotification[]>(res);
  } catch (error) {
    console.error('Erreur getAdminNotifications:', error);
    throw error;
  }
}

/**
 * Récupère une notification par son ID
 */
export async function getNotificationById(notificationId: string): Promise<AdminNotification> {
  try {
    const res = await fetch(`/api/admin/notifications/${notificationId}`, {
      method: 'GET',
      cache: 'no-store',
    });

    return await handleResponse<AdminNotification>(res);
  } catch (error) {
    console.error(`Erreur getNotificationById ${notificationId}:`, error);
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

    return await handleResponse<{ count: number }>(res);
  } catch (error) {
    console.error('Erreur getUnreadNotificationsCount:', error);
    throw error;
  }
}

/**
 * Récupère les statistiques des notifications
 */
export async function getNotificationStats(): Promise<NotificationStats> {
  try {
    const res = await fetch('/api/admin/notifications/stats', {
      method: 'GET',
      cache: 'no-store',
    });

    return await handleResponse<NotificationStats>(res);
  } catch (error) {
    console.error('Erreur getNotificationStats:', error);
    throw error;
  }
}

// ==================== GESTION DES NOTIFICATIONS ====================

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

    return await handleResponse<{ message: string }>(res);
  } catch (error) {
    console.error(`Erreur markNotificationAsRead ${notificationId}:`, error);
    throw error;
  }
}

/**
 * Marquer toutes les notifications comme lues
 */
export async function markAllNotificationsAsRead(): Promise<{ message: string; count: number }> {
  try {
    const res = await fetch('/api/admin/notifications/read-all', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return await handleResponse<{ message: string; count: number }>(res);
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

    return await handleResponse<{ message: string }>(res);
  } catch (error) {
    console.error(`Erreur deleteNotification ${notificationId}:`, error);
    throw error;
  }
}

/**
 * Supprimer plusieurs notifications
 */
export async function deleteMultipleNotifications(notificationIds: string[]): Promise<{ message: string; deleted_count: number }> {
  try {
    const res = await fetch('/api/admin/notifications/bulk-delete', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ notification_ids: notificationIds }),
    });

    return await handleResponse<{ message: string; deleted_count: number }>(res);
  } catch (error) {
    console.error('Erreur deleteMultipleNotifications:', error);
    throw error;
  }
}

// ==================== ENVOI DE NOTIFICATIONS ====================

/**
 * Envoyer une notification à tous les admins
 */
export async function sendNotificationToAdmins(data: {
  type: string;
  title: string;
  message: string;
  action_url?: string;
  priority?: 'low' | 'normal' | 'high' | 'urgent';
  icon?: string;
  expires_at?: string;
}): Promise<{ message: string; notification_id: string }> {
  try {
    const res = await fetch('/api/admin/notifications/send-to-all', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    return await handleResponse<{ message: string; notification_id: string }>(res);
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
    priority?: 'low' | 'normal' | 'high' | 'urgent';
    icon?: string;
    expires_at?: string;
  }
): Promise<{ message: string; notification_id: string }> {
  try {
    const res = await fetch(`/api/admin/notifications/send/${adminId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    return await handleResponse<{ message: string; notification_id: string }>(res);
  } catch (error) {
    console.error(`Erreur sendNotificationToAdmin ${adminId}:`, error);
    throw error;
  }
}

/**
 * Envoyer une notification à plusieurs admins
 */
export async function sendNotificationToMultipleAdmins(
  adminIds: number[],
  data: {
    type: string;
    title: string;
    message: string;
    action_url?: string;
    priority?: 'low' | 'normal' | 'high' | 'urgent';
    icon?: string;
    expires_at?: string;
  }
): Promise<{ message: string; sent_count: number }> {
  try {
    const res = await fetch('/api/admin/notifications/send-multiple', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        admin_ids: adminIds,
        ...data
      }),
    });

    return await handleResponse<{ message: string; sent_count: number }>(res);
  } catch (error) {
    console.error('Erreur sendNotificationToMultipleAdmins:', error);
    throw error;
  }
}

// ==================== PARAMÈTRES DES NOTIFICATIONS ====================

/**
 * Mettre à jour les préférences de notifications pour un admin
 */
export async function updateNotificationPreferences(
  adminId: number,
  preferences: {
    email_notifications: boolean;
    push_notifications: boolean;
    notification_types: string[];
  }
): Promise<{ message: string }> {
  try {
    const res = await fetch(`/api/admin/notifications/preferences/${adminId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(preferences),
    });

    return await handleResponse<{ message: string }>(res);
  } catch (error) {
    console.error(`Erreur updateNotificationPreferences ${adminId}:`, error);
    throw error;
  }
}

/**
 * Récupérer les préférences de notifications d'un admin
 */
export async function getNotificationPreferences(adminId: number): Promise<{
  email_notifications: boolean;
  push_notifications: boolean;
  notification_types: string[];
}> {
  try {
    const res = await fetch(`/api/admin/notifications/preferences/${adminId}`, {
      method: 'GET',
      cache: 'no-store',
    });

    return await handleResponse<{
      email_notifications: boolean;
      push_notifications: boolean;
      notification_types: string[];
    }>(res);
  } catch (error) {
    console.error(`Erreur getNotificationPreferences ${adminId}:`, error);
    throw error;
  }
}

// ==================== NETTOYAGE ====================

/**
 * Supprimer toutes les notifications lues (plus anciennes qu'une certaine date)
 */
export async function clearOldNotifications(days_old: number = 30): Promise<{ message: string; deleted_count: number }> {
  try {
    const res = await fetch('/api/admin/notifications/clear-old', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ days_old }),
    });

    return await handleResponse<{ message: string; deleted_count: number }>(res);
  } catch (error) {
    console.error('Erreur clearOldNotifications:', error);
    throw error;
  }
}
