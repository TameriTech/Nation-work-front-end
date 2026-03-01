// hooks/notifications/useNotifications.ts

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/components/ui/use-toast';
import * as notificationService from '@/services/admin/notifications.service';
import type { AdminNotification, NotificationStats } from '@/app/types/admin';
import { useEffect, useState, useCallback } from 'react';

// ==================== CLÉS DE QUERY ====================

export const notificationKeys = {
  all: ['notifications'] as const,
  list: (includeRead?: boolean) => [...notificationKeys.all, 'list', { includeRead }] as const,
  unread: () => [...notificationKeys.all, 'unread'] as const,
  stats: () => [...notificationKeys.all, 'stats'] as const,
  detail: (id: string) => [...notificationKeys.all, 'detail', id] as const,
};

// ==================== HOOK PRINCIPAL ====================

export const useNotifications = (includeRead: boolean = false) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [isSubscribed, setIsSubscribed] = useState(false);

  // ==================== QUERIES ====================

  /**
   * Récupère toutes les notifications
   */
  const notificationsQuery = useQuery({
    queryKey: notificationKeys.list(includeRead),
    queryFn: () => notificationService.getAdminNotifications(includeRead),
    staleTime: 30 * 1000, // 30 secondes
  });

  /**
   * Récupère le nombre de notifications non lues
   */
  const unreadCountQuery = useQuery({
    queryKey: notificationKeys.unread(),
    queryFn: () => notificationService.getUnreadNotificationsCount(),
    staleTime: 30 * 1000,
  });

  /**
   * Récupère les statistiques des notifications
   */
  const statsQuery = useQuery({
    queryKey: notificationKeys.stats(),
    queryFn: () => notificationService.getNotificationStats(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  /**
   * Récupère une notification par son ID
   */
  const getNotificationById = (id: string) => {
    return useQuery({
      queryKey: notificationKeys.detail(id),
      queryFn: () => notificationService.getNotificationById(id),
      enabled: !!id,
      staleTime: 5 * 60 * 1000,
    });
  };

  // ==================== MUTATIONS ====================

  /**
   * Marque une notification comme lue
   */
  const markAsReadMutation = useMutation({
    mutationFn: (notificationId: string) => 
      notificationService.markNotificationAsRead(notificationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.list() });
      queryClient.invalidateQueries({ queryKey: notificationKeys.unread() });
      queryClient.invalidateQueries({ queryKey: notificationKeys.stats() });
    },
  });

  /**
   * Marque toutes les notifications comme lues
   */
  const markAllAsReadMutation = useMutation({
    mutationFn: () => notificationService.markAllNotificationsAsRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.list() });
      queryClient.invalidateQueries({ queryKey: notificationKeys.unread() });
      queryClient.invalidateQueries({ queryKey: notificationKeys.stats() });
      
      toast({
        title: "Notifications marquées comme lues",
        description: "Toutes les notifications ont été marquées comme lues",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: error.message || "Impossible de marquer les notifications",
        variant: "destructive",
      });
    },
  });

  /**
   * Supprime une notification
   */
  const deleteNotificationMutation = useMutation({
    mutationFn: (notificationId: string) => 
      notificationService.deleteNotification(notificationId),
    onSuccess: (_, deletedId) => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.list() });
      queryClient.invalidateQueries({ queryKey: notificationKeys.unread() });
      queryClient.removeQueries({ queryKey: notificationKeys.detail(deletedId) });
      
      toast({
        title: "Notification supprimée",
        description: "La notification a été supprimée",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: error.message || "Impossible de supprimer la notification",
        variant: "destructive",
      });
    },
  });

  /**
   * Supprime plusieurs notifications
   */
  const deleteMultipleMutation = useMutation({
    mutationFn: (notificationIds: string[]) => 
      notificationService.deleteMultipleNotifications(notificationIds),
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.list() });
      queryClient.invalidateQueries({ queryKey: notificationKeys.unread() });
      
      toast({
        title: "Notifications supprimées",
        description: `${result.deleted_count} notification(s) supprimée(s)`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: error.message || "Impossible de supprimer les notifications",
        variant: "destructive",
      });
    },
  });

  /**
   * Envoie une notification (admin)
   */
  const sendNotificationMutation = useMutation({
    mutationFn: (data: Parameters<typeof notificationService.sendNotificationToAdmins>[0]) =>
      notificationService.sendNotificationToAdmins(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.list() });
      
      toast({
        title: "Notification envoyée",
        description: "La notification a été envoyée aux administrateurs",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: error.message || "Impossible d'envoyer la notification",
        variant: "destructive",
      });
    },
  });

  /**
   * Nettoie les anciennes notifications
   */
  const clearOldNotificationsMutation = useMutation({
    mutationFn: (daysOld: number = 30) => 
      notificationService.clearOldNotifications(daysOld),
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.list() });
      
      toast({
        title: "Notifications nettoyées",
        description: `${result.deleted_count} ancienne(s) notification(s) supprimée(s)`,
      });
    },
  });

  // ==================== POLLING / WEBSOCKET ====================

  /**
   * Configure le polling pour les notifications en temps réel
   */
  const startPolling = useCallback((interval: number = 30000) => {
    const intervalId = setInterval(() => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.unread() });
    }, interval);

    return () => clearInterval(intervalId);
  }, [queryClient]);

  /**
   * Configure l'écoute des événements SSE/WebSocket
   */
  const subscribeToNotifications = useCallback(() => {
    if (isSubscribed) return () => {};

    // Exemple avec EventSource (SSE)
    const eventSource = new EventSource('/api/notifications/stream');

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      
      // Invalider les queries
      queryClient.invalidateQueries({ queryKey: notificationKeys.list() });
      queryClient.invalidateQueries({ queryKey: notificationKeys.unread() });
      
      // Afficher une notification toast pour les nouvelles
      if (data.type === 'new') {
        toast({
          title: data.notification.title,
          description: data.notification.message,
        });
      }
    };

    eventSource.onerror = () => {
      console.error('SSE connection error');
      eventSource.close();
    };

    setIsSubscribed(true);

    return () => {
      eventSource.close();
      setIsSubscribed(false);
    };
  }, [queryClient, toast, isSubscribed]);

  // ==================== FONCTIONS UTILITAIRES ====================

  /**
   * Groupe les notifications par date
   */
  const getGroupedNotifications = () => {
    const notifications = notificationsQuery.data || [];
    const groups: Record<string, AdminNotification[]> = {};
    
    notifications.forEach(notif => {
      const date = new Date(notif.created_at).toLocaleDateString('fr-FR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
      
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(notif);
    });
    
    return groups;
  };

  /**
   * Filtre les notifications par type
   */
  const filterByType = (type: string) => {
    const notifications = notificationsQuery.data || [];
    return notifications.filter(n => n.notification_type === type);
  };

  /**
   * Filtre les notifications par priorité
   */
  const filterByPriority = (priority: 'low' | 'normal' | 'high' | 'urgent') => {
    const notifications = notificationsQuery.data || [];
    return notifications.filter(n => n.priority === priority);
  };

  // ==================== RETOUR DU HOOK ====================

  return {
    // Données
    notifications: notificationsQuery.data || [],
    isLoading: notificationsQuery.isLoading,
    error: notificationsQuery.error,

    unreadCount: unreadCountQuery.data?.count || 0,
    isLoadingUnread: unreadCountQuery.isLoading,

    stats: statsQuery.data,
    isLoadingStats: statsQuery.isLoading,

    // Récupération par ID
    getNotificationById,

    // Utilitaires
    getGroupedNotifications,
    filterByType,
    filterByPriority,

    // Mutations
    markAsRead: markAsReadMutation.mutate,
    isMarkingAsRead: markAsReadMutation.isPending,

    markAllAsRead: markAllAsReadMutation.mutate,
    isMarkingAllAsRead: markAllAsReadMutation.isPending,

    deleteNotification: deleteNotificationMutation.mutate,
    isDeleting: deleteNotificationMutation.isPending,

    deleteMultiple: deleteMultipleMutation.mutate,
    isDeletingMultiple: deleteMultipleMutation.isPending,

    sendNotification: sendNotificationMutation.mutate,
    isSending: sendNotificationMutation.isPending,

    clearOldNotifications: clearOldNotificationsMutation.mutate,
    isClearing: clearOldNotificationsMutation.isPending,

    // Temps réel
    subscribeToNotifications,
    startPolling,
    isSubscribed,

    // Rafraîchissement
    refetch: () => queryClient.invalidateQueries({ 
      queryKey: notificationKeys.list(includeRead) 
    }),
  };
};
