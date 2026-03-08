// ============================================================================
// TYPES POUR LES NOTIFICATIONS
// ============================================================================

export interface AdminNotification {
  id: string;
  type: 'urgent' | 'warning' | 'info' | 'success';
  priority: 'low' | 'normal' | 'high' | 'urgent';
  title: string;
  message: string;
  action_url?: string;
  created_at: string;
  is_read: boolean;
}

export interface NotificationStats {
  total: number;
  unread: number;
  by_type: {
    urgent: number;
    warning: number;
    info: number;
    success: number;
  };
  recent: AdminNotification[];
}
