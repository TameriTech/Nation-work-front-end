// src/app/types/notifications/index.ts

import { NotificationChannel, NotificationPriority, NotificationType } from "../enums";

// ==================== BASE TYPES ====================

export interface NotificationBase {
  title: string;
  message: string;
  short_message?: string;
  notification_type: NotificationType;
  priority: NotificationPriority;
  icon?: string;
  image_url?: string;
  action_url?: string;
  action_label?: string;
  action_data?: Record<string, any>;
  channel: NotificationChannel;
}

// ==================== CREATE/UPDATE DTOs ====================

export interface CreateNotificationDto extends NotificationBase {
  user_id: number;
  scheduled_for?: string;
  expires_at?: string;
}

export interface UpdateNotificationDto {
  title?: string;
  message?: string;
  short_message?: string;
  notification_type?: NotificationType;
  priority?: NotificationPriority;
  icon?: string;
  image_url?: string;
  action_url?: string;
  action_label?: string;
  action_data?: Record<string, any>;
  expires_at?: string;
  metadata?: Record<string, any>;
}

export interface BulkUpdateNotificationsDto {
  mark_all_read?: boolean;
  archive_ids?: number[];
  mark_read_ids?: number[];
}

export interface MarkNotificationsReadDto {
  notification_ids: number[];
  mark_all: boolean;
}

// ==================== NOTIFICATION RESPONSE ====================

export interface Notification {
  id: number;
  user_id: number;
  title: string;
  message: string;
  short_message?: string;
  notification_type: string;
  priority: string;
  icon?: string;
  image_url?: string;
  action_url?: string;
  action_label?: string;
  action_data?: Record<string, any>;
  channel: string;
  is_read: boolean;
  is_archived: boolean;
  is_delivered: boolean;
  is_clicked: boolean;
  created_at: string;
  read_at?: string;
  delivered_at?: string;
  clicked_at?: string;
  expires_at?: string;
  metadata?: Record<string, any>;
}

export interface AdminNotification extends Notification {
  // Les notifications admin peuvent avoir des champs supplémentaires
  target_role?: string;
  broadcast_id?: string;
}

export interface NotificationCount {
  unread_count: number;
}

// ==================== STATISTICS ====================

export interface NotificationStats {
  total: number;
  unread: number;
  unread_percentage: number;
  by_type: Record<string, number>;
  by_priority: Record<string, number>;
  recent_count: number;
  daily_trend: Array<{ date: string; count: number }>;
  average_read_time_hours?: number;
}

export interface AdminNotificationStats {
  total_notifications: number;
  total_unread: number;
  average_per_user: number;
  most_active_users: Array<{ user_id: number; username: string; count: number }>;
  by_channel: Record<string, number>;
}

// ==================== PREFERENCES ====================

export interface NotificationPreferences {
  email_notifications: boolean;
  push_notifications: boolean;
  sms_notifications: boolean;
  chat_notifications: boolean;
  service_notifications: boolean;
  payment_notifications: boolean;
  marketing_notifications: boolean;
}

// ==================== BROADCAST ====================

export interface BroadcastNotificationDto extends NotificationBase {
  target_role?: string;
  user_ids?: number[];
}

export interface BroadcastNotificationResponse {
  message: string;
  notification_id: string;
  recipient_count: number;
}

export interface SendNotificationResponse {
  message: string;
  notification_id: string;
}

export interface SendMultipleNotificationResponse {
  message: string;
  sent_count: number;
}

// ==================== BULK OPERATIONS ====================

export interface BulkDeleteResponse {
  message: string;
  deleted_count: number;
}

export interface BulkMarkReadResponse {
  message: string;
  count: number;
}

export interface ClearOldNotificationsResponse {
  message: string;
  deleted_count: number;
}

// ==================== TEST NOTIFICATION ====================

export interface TestNotificationDto {
  user_id: number;
  notification_type: NotificationType;
  custom_title?: string;
  custom_message?: string;
}

// ==================== FILTERS ====================

export interface NotificationFilters {
  unread_only?: boolean;
  notification_type?: NotificationType;
  priority?: NotificationPriority;
  limit?: number;
  skip?: number;
  include_archived?: boolean;
  from_date?: string;
  to_date?: string;
}

export interface AdminNotificationFilters extends NotificationFilters {
  user_role?: string;
}

// ==================== PAGINATED RESPONSE ====================

export interface PaginatedNotificationsResponse {
  items: Notification[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
  unread_count?: number;
}
