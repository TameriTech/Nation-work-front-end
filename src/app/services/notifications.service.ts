// services/admin/notifications.service.ts
import { 
  AdminNotification,
  Notification,
  NotificationStats,
  AdminNotificationStats,
  NotificationCount,
  NotificationPreferences,
  BroadcastNotificationResponse,
  SendNotificationResponse,
  SendMultipleNotificationResponse,
  BulkDeleteResponse,
  BulkMarkReadResponse,
  ClearOldNotificationsResponse,
  PaginatedNotificationsResponse,
  CreateNotificationDto,
  UpdateNotificationDto,
  BroadcastNotificationDto,
  TestNotificationDto,
  NotificationFilters,
  BulkUpdateNotificationsDto,
  MarkNotificationsReadDto,
  NotificationPriority
} from "@/app/types";
import { 
  NotificationFiltersFormData,
  BroadcastNotificationFormData,
  SendToMultipleAdminsFormData,
  BulkUpdateNotificationsFormData,
  MarkNotificationsReadFormData,
  ClearOldNotificationsFormData,
  TestNotificationFormData,
  NotificationPreferencesFormData,
  NotificationFiltersSchema,
  BroadcastNotificationSchema,
  SendToMultipleAdminsSchema,
  BulkUpdateNotificationsSchema,
  MarkNotificationsReadSchema,
  ClearOldNotificationsSchema,
  TestNotificationSchema,
  NotificationPreferencesSchema
} from "@/app/lib/validators/notification.validator";
import { handleResponse } from '@/app/lib/error-handler';

// ==================== RÉCUPÉRATION DES NOTIFICATIONS ====================

/**
 * Récupère les notifications de l'admin avec filtres
 * GET /api/admin/notifications
 */
export async function getAdminNotifications(
  filters?: NotificationFiltersFormData
): Promise<PaginatedNotificationsResponse> {
  try {
    const validatedFilters = filters ? NotificationFiltersSchema.parse(filters) : { 
      limit: 50, 
      skip: 0,
      include_archived: false 
    };
    
    const params = new URLSearchParams();
    
    if (validatedFilters.unread_only) params.append('unread_only', String(validatedFilters.unread_only));
    if (validatedFilters.notification_type) params.append('notification_type', validatedFilters.notification_type);
    if (validatedFilters.priority) params.append('priority', validatedFilters.priority);
    if (validatedFilters.limit) params.append('limit', String(validatedFilters.limit));
    if (validatedFilters.skip) params.append('skip', String(validatedFilters.skip));
    if (validatedFilters.include_archived) params.append('include_archived', String(validatedFilters.include_archived));
    if (validatedFilters.from_date) params.append('from_date', validatedFilters.from_date);
    if (validatedFilters.to_date) params.append('to_date', validatedFilters.to_date);

    const res = await fetch(`/api/admin/notifications?${params.toString()}`, {
      method: 'GET',
      cache: 'no-store',
      headers: { 'Content-Type': 'application/json' },
    });

    return await handleResponse<PaginatedNotificationsResponse>(res);
  } catch (error) {
    console.error('Erreur getAdminNotifications:', error);
    throw error;
  }
}

/**
 * Récupère une notification par son ID
 * GET /api/admin/notifications/{notificationId}
 */
export async function getNotificationById(notificationId: string): Promise<AdminNotification> {
  try {
    const res = await fetch(`/api/admin/notifications/${notificationId}`, {
      method: 'GET',
      cache: 'no-store',
      headers: { 'Content-Type': 'application/json' },
    });
    return await handleResponse<AdminNotification>(res);
  } catch (error) {
    console.error(`Erreur getNotificationById ${notificationId}:`, error);
    throw error;
  }
}

/**
 * Récupère le nombre de notifications non lues
 * GET /api/admin/notifications/unread-count
 */
export async function getUnreadNotificationsCount(): Promise<NotificationCount> {
  try {
    const res = await fetch('/api/admin/notifications/unread-count', {
      method: 'GET',
      cache: 'no-store',
      headers: { 'Content-Type': 'application/json' },
    });
    return await handleResponse<NotificationCount>(res);
  } catch (error) {
    console.error('Erreur getUnreadNotificationsCount:', error);
    throw error;
  }
}

/**
 * Récupère les statistiques des notifications
 * GET /api/admin/notifications/stats
 */
export async function getNotificationStats(): Promise<NotificationStats> {
  try {
    const res = await fetch('/api/admin/notifications/stats', {
      method: 'GET',
      cache: 'no-store',
      headers: { 'Content-Type': 'application/json' },
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
 * POST /api/admin/notifications/{notificationId}/read
 */
export async function markNotificationAsRead(notificationId: string): Promise<{ message: string }> {
  try {
    const res = await fetch(`/api/admin/notifications/${notificationId}/read`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    return await handleResponse<{ message: string }>(res);
  } catch (error) {
    console.error(`Erreur markNotificationAsRead ${notificationId}:`, error);
    throw error;
  }
}

/**
 * Marquer toutes les notifications comme lues
 * POST /api/admin/notifications/read-all
 */
export async function markAllNotificationsAsRead(): Promise<BulkMarkReadResponse> {
  try {
    const res = await fetch('/api/admin/notifications/read-all', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    return await handleResponse<BulkMarkReadResponse>(res);
  } catch (error) {
    console.error('Erreur markAllNotificationsAsRead:', error);
    throw error;
  }
}

/**
 * Marquer plusieurs notifications comme lues
 * POST /api/admin/notifications/read-multiple
 */
export async function markMultipleNotificationsAsRead(
  data: MarkNotificationsReadFormData
): Promise<BulkMarkReadResponse> {
  try {
    const validatedData = MarkNotificationsReadSchema.parse(data);
    const res = await fetch('/api/admin/notifications/read-multiple', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(validatedData),
    });
    return await handleResponse<BulkMarkReadResponse>(res);
  } catch (error) {
    console.error('Erreur markMultipleNotificationsAsRead:', error);
    throw error;
  }
}

/**
 * Archiver une notification
 * PUT /api/admin/notifications/{notificationId}/archive
 */
export async function archiveNotification(notificationId: string): Promise<AdminNotification> {
  try {
    const res = await fetch(`/api/admin/notifications/${notificationId}/archive`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
    });
    return await handleResponse<AdminNotification>(res);
  } catch (error) {
    console.error(`Erreur archiveNotification ${notificationId}:`, error);
    throw error;
  }
}

/**
 * Marquer une notification comme cliquée
 * PUT /api/admin/notifications/{notificationId}/click
 */
export async function markNotificationAsClicked(notificationId: string): Promise<AdminNotification> {
  try {
    const res = await fetch(`/api/admin/notifications/${notificationId}/click`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
    });
    return await handleResponse<AdminNotification>(res);
  } catch (error) {
    console.error(`Erreur markNotificationAsClicked ${notificationId}:`, error);
    throw error;
  }
}

/**
 * Mise à jour groupée des notifications
 * POST /api/admin/notifications/bulk-update
 */
export async function bulkUpdateNotifications(
  data: BulkUpdateNotificationsFormData
): Promise<{ success: boolean; message: string; results: Record<string, number> }> {
  try {
    const validatedData = BulkUpdateNotificationsSchema.parse(data);
    const res = await fetch('/api/admin/notifications/bulk-update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(validatedData),
    });
    return await handleResponse<{ success: boolean; message: string; results: Record<string, number> }>(res);
  } catch (error) {
    console.error('Erreur bulkUpdateNotifications:', error);
    throw error;
  }
}

/**
 * Supprimer une notification
 * DELETE /api/admin/notifications/{notificationId}
 */
export async function deleteNotification(
  notificationId: string,
  hard_delete: boolean = false
): Promise<{ message: string }> {
  try {
    const url = hard_delete 
      ? `/api/admin/notifications/${notificationId}?hard_delete=true`
      : `/api/admin/notifications/${notificationId}`;
    
    const res = await fetch(url, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    });
    return await handleResponse<{ message: string }>(res);
  } catch (error) {
    console.error(`Erreur deleteNotification ${notificationId}:`, error);
    throw error;
  }
}

/**
 * Supprimer plusieurs notifications
 * POST /api/admin/notifications/bulk-delete
 */
export async function deleteMultipleNotifications(notificationIds: string[]): Promise<BulkDeleteResponse> {
  try {
    const res = await fetch('/api/admin/notifications/bulk-delete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ notification_ids: notificationIds }),
    });
    return await handleResponse<BulkDeleteResponse>(res);
  } catch (error) {
    console.error('Erreur deleteMultipleNotifications:', error);
    throw error;
  }
}

/**
 * Supprimer toutes les notifications lues (plus anciennes qu'une certaine date)
 * POST /api/admin/notifications/clear-old
 */
export async function clearOldNotifications(
  data?: ClearOldNotificationsFormData
): Promise<ClearOldNotificationsResponse> {
  try {
    const validatedData = data ? ClearOldNotificationsSchema.parse(data) : { days_old: 30 };
    const res = await fetch('/api/admin/notifications/clear-old', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(validatedData),
    });
    return await handleResponse<ClearOldNotificationsResponse>(res);
  } catch (error) {
    console.error('Erreur clearOldNotifications:', error);
    throw error;
  }
}

// ==================== ENVOI DE NOTIFICATIONS ====================

/**
 * Envoyer une notification à tous les admins
 * POST /api/admin/notifications/send-to-all
 */
export async function sendNotificationToAdmins(
  data: BroadcastNotificationFormData
): Promise<BroadcastNotificationResponse> {
  try {
    const validatedData = BroadcastNotificationSchema.parse(data);
    const res = await fetch('/api/admin/notifications/send-to-all', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(validatedData),
    });
    return await handleResponse<BroadcastNotificationResponse>(res);
  } catch (error) {
    console.error('Erreur sendNotificationToAdmins:', error);
    throw error;
  }
}

/**
 * Envoyer une notification à un admin spécifique
 * POST /api/admin/notifications/send/{adminId}
 */
export async function sendNotificationToAdmin(
  adminId: number,
  data: BroadcastNotificationFormData
): Promise<SendNotificationResponse> {
  try {
    const validatedData = BroadcastNotificationSchema.parse(data);
    const res = await fetch(`/api/admin/notifications/send/${adminId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(validatedData),
    });
    return await handleResponse<SendNotificationResponse>(res);
  } catch (error) {
    console.error(`Erreur sendNotificationToAdmin ${adminId}:`, error);
    throw error;
  }
}

/**
 * Envoyer une notification à plusieurs admins
 * POST /api/admin/notifications/send-multiple
 */
export async function sendNotificationToMultipleAdmins(
  data: SendToMultipleAdminsFormData
): Promise<SendMultipleNotificationResponse> {
  try {
    const validatedData = SendToMultipleAdminsSchema.parse(data);
    const res = await fetch('/api/admin/notifications/send-multiple', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(validatedData),
    });
    return await handleResponse<SendMultipleNotificationResponse>(res);
  } catch (error) {
    console.error('Erreur sendNotificationToMultipleAdmins:', error);
    throw error;
  }
}

// ==================== PARAMÈTRES DES NOTIFICATIONS ====================

/**
 * Mettre à jour les préférences de notifications pour un admin
 * PUT /api/admin/notifications/preferences/{adminId}
 */
export async function updateNotificationPreferences(
  adminId: number,
  preferences: NotificationPreferencesFormData
): Promise<{ message: string }> {
  try {
    const validatedData = NotificationPreferencesSchema.parse(preferences);
    const res = await fetch(`/api/admin/notifications/preferences/${adminId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(validatedData),
    });
    return await handleResponse<{ message: string }>(res);
  } catch (error) {
    console.error(`Erreur updateNotificationPreferences ${adminId}:`, error);
    throw error;
  }
}

/**
 * Récupérer les préférences de notifications d'un admin
 * GET /api/admin/notifications/preferences/{adminId}
 */
export async function getNotificationPreferences(adminId: number): Promise<NotificationPreferences> {
  try {
    const res = await fetch(`/api/admin/notifications/preferences/${adminId}`, {
      method: 'GET',
      cache: 'no-store',
      headers: { 'Content-Type': 'application/json' },
    });
    return await handleResponse<NotificationPreferences>(res);
  } catch (error) {
    console.error(`Erreur getNotificationPreferences ${adminId}:`, error);
    throw error;
  }
}

// ==================== STATISTIQUES ADMIN ====================

/**
 * Récupère les statistiques globales des notifications (admin)
 * GET /api/admin/notifications/admin/stats
 */
export async function getAdminNotificationStats(): Promise<AdminNotificationStats> {
  try {
    const res = await fetch('/api/admin/notifications/admin/stats', {
      method: 'GET',
      cache: 'no-store',
      headers: { 'Content-Type': 'application/json' },
    });
    return await handleResponse<AdminNotificationStats>(res);
  } catch (error) {
    console.error('Erreur getAdminNotificationStats:', error);
    throw error;
  }
}

// ==================== NOTIFICATIONS DE TEST ====================

/**
 * Envoyer une notification de test
 * POST /api/admin/notifications/admin/test/{user_id}
 */
export async function sendTestNotification(
  userId: number,
  data: TestNotificationFormData
): Promise<SendNotificationResponse> {
  try {
    const validatedData = TestNotificationSchema.parse({...data });
    const res = await fetch(`/api/admin/notifications/admin/test/${userId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(validatedData),
    });
    return await handleResponse<SendNotificationResponse>(res);
  } catch (error) {
    console.error(`Erreur sendTestNotification ${userId}:`, error);
    throw error;
  }
}

// ==================== NETTOYAGE ====================

/**
 * Nettoyer les notifications expirées (admin)
 * POST /api/admin/notifications/cleanup/expired
 */
export async function cleanupExpiredNotifications(): Promise<{ success: boolean; message: string; count: number }> {
  try {
    const res = await fetch('/api/admin/notifications/cleanup/expired', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    return await handleResponse<{ success: boolean; message: string; count: number }>(res);
  } catch (error) {
    console.error('Erreur cleanupExpiredNotifications:', error);
    throw error;
  }
}

/**
 * Nettoyer les anciennes notifications archivées (admin)
 * POST /api/admin/notifications/cleanup/old
 */
export async function cleanupOldNotifications(
  days: number = 90
): Promise<{ success: boolean; message: string; count: number }> {
  try {
    const res = await fetch(`/api/admin/notifications/cleanup/old?days=${days}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    return await handleResponse<{ success: boolean; message: string; count: number }>(res);
  } catch (error) {
    console.error('Erreur cleanupOldNotifications:', error);
    throw error;
  }
}

// ==================== FILTRES RAPIDES ====================

// services/admin/notifications.service.ts (extrait corrigé)

// ==================== FILTRES RAPIDES ====================

/**
 * Récupère les notifications non lues
 */
export async function getUnreadNotifications(limit: number = 20): Promise<AdminNotification[]> {
  try {
    // CORRECTION: Ajouter include_archived: false qui est requis
    const response = await getAdminNotifications({ 
      unread_only: true, 
      limit,
      skip: 0,
      include_archived: false // ← AJOUTÉ
    });
    return response.items as AdminNotification[];
  } catch (error) {
    console.error('Erreur getUnreadNotifications:', error);
    throw error;
  }
}

/**
 * Récupère les notifications urgentes
 */
export async function getUrgentNotifications(limit: number = 20): Promise<AdminNotification[]> {
  try {
    // CORRECTION: Ajouter include_archived: false qui est requis
    const response = await getAdminNotifications({ 
      priority: NotificationPriority.URGENT,
      limit,
      skip: 0,
      include_archived: false // ← AJOUTÉ
    });
    return response.items as AdminNotification[];
  } catch (error) {
    console.error('Erreur getUrgentNotifications:', error);
    throw error;
  }
}

