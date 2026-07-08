// src/app/lib/validators/notification.validator.ts
import { z } from 'zod';
import { 
  NotificationType, 
  NotificationPriority, 
  NotificationChannel 
} from '../../types/enums';

// ==================== CREATE SCHEMAS ====================

export const NotificationBaseSchema = z.object({
  title: z.string({
    error: "Le titre doit être une chaîne de caractères"
  }).min(1, "Le titre est requis")
    .max(255, "Le titre ne peut pas dépasser 255 caractères"),
  
  message: z.string({
    error: "Le message doit être une chaîne de caractères"
  }).min(1, "Le message est requis")
    .max(2000, "Le message ne peut pas dépasser 2000 caractères"),
  
  short_message: z.string({
    error: "Le message court doit être une chaîne de caractères"
  }).max(255, "Le message court ne peut pas dépasser 255 caractères")
    .optional(),
  
  notification_type: z.nativeEnum(NotificationType, {
    error: "Le type de notification doit être valide"
  }).default(NotificationType.INFO),
  
  priority: z.nativeEnum(NotificationPriority, {
    error: "La priorité doit être valide"
  }).default(NotificationPriority.NORMAL),
  
  icon: z.string().max(100).optional(),
  
  image_url: z.string().url("L'URL de l'image doit être valide").max(500).optional(),
  
  action_url: z.string().url("L'URL d'action doit être valide").max(500).optional(),
  
  action_label: z.string().max(100).optional(),
  
  action_data: z.record(z.string(), z.any()).optional(),
  
  channel: z.nativeEnum(NotificationChannel, {
    error: "Le canal doit être valide"
  }).default(NotificationChannel.IN_APP)
});

export const CreateNotificationSchema = NotificationBaseSchema.extend({
  user_id: z.number({
    error: "L'ID de l'utilisateur doit être un nombre"
  }).refine(val => val !== undefined && val !== null, {
    message: "L'ID de l'utilisateur est requis"
  }),
  
  scheduled_for: z.string().datetime("Format de date invalide").optional(),
  
  expires_at: z.string().datetime("Format de date invalide").optional(),
  
  metadata: z.record(z.string(), z.any()).optional()
});

export type CreateNotificationFormData = z.infer<typeof CreateNotificationSchema>;

export const UpdateNotificationSchema = z.object({
  title: z.string().min(1).max(255).optional(),
  message: z.string().min(1).max(2000).optional(),
  short_message: z.string().max(255).optional(),
  notification_type: z.nativeEnum(NotificationType).optional(),
  priority: z.nativeEnum(NotificationPriority).optional(),
  icon: z.string().max(100).optional(),
  image_url: z.string().url().max(500).optional(),
  action_url: z.string().url().max(500).optional(),
  action_label: z.string().max(100).optional(),
  action_data: z.record(z.string(), z.any()).optional(),
  expires_at: z.string().datetime().optional(),
  metadata: z.record(z.string(), z.any()).optional()
});

export type UpdateNotificationFormData = z.infer<typeof UpdateNotificationSchema>;

// ==================== BROADCAST SCHEMAS ====================

export const BroadcastNotificationSchema = NotificationBaseSchema.extend({
  target_role: z.string().optional(),
  user_ids: z.array(z.number()).optional()
}).refine(data => {
  // Au moins un des deux champs doit être fourni
  return data.target_role !== undefined || (data.user_ids && data.user_ids.length > 0);
}, {
  message: "Vous devez spécifier soit un rôle cible, soit une liste d'IDs d'utilisateurs",
  path: ['target_role']
});

export type BroadcastNotificationFormData = z.infer<typeof BroadcastNotificationSchema>;

export const SendToAdminSchema = NotificationBaseSchema;

export type SendToAdminFormData = z.infer<typeof SendToAdminSchema>;

export const SendToMultipleAdminsSchema = z.object({
  admin_ids: z.array(z.number()).min(1, "Au moins un admin doit être sélectionné"),
  title: z.string().min(1).max(255),
  message: z.string().min(1).max(2000),
  short_message: z.string().max(255).optional(),
  notification_type: z.nativeEnum(NotificationType).default(NotificationType.INFO),
  priority: z.nativeEnum(NotificationPriority).default(NotificationPriority.NORMAL),
  icon: z.string().max(100).optional(),
  image_url: z.string().url().max(500).optional(),
  action_url: z.string().url().max(500).optional(),
  action_label: z.string().max(100).optional(),
  action_data: z.record(z.string(), z.any()).optional(),
  expires_at: z.string().datetime().optional()
});

export type SendToMultipleAdminsFormData = z.infer<typeof SendToMultipleAdminsSchema>;

// ==================== BULK OPERATIONS SCHEMAS ====================

export const BulkUpdateNotificationsSchema = z.object({
  mark_all_read: z.boolean().default(false),
  archive_ids: z.array(z.number()).optional(),
  mark_read_ids: z.array(z.number()).optional()
});

export type BulkUpdateNotificationsFormData = z.infer<typeof BulkUpdateNotificationsSchema>;

export const MarkNotificationsReadSchema = z.object({
  notification_ids: z.array(z.number()).min(1, "Au moins une notification doit être sélectionnée"),
  mark_all: z.boolean().default(false)
});

export type MarkNotificationsReadFormData = z.infer<typeof MarkNotificationsReadSchema>;

export const ClearOldNotificationsSchema = z.object({
  days_old: z.number().min(1).max(365).default(30)
});

export type ClearOldNotificationsFormData = z.infer<typeof ClearOldNotificationsSchema>;

// ==================== FILTERS SCHEMAS ====================

export const NotificationFiltersSchema = z.object({
  unread_only: z.boolean().optional(),
  notification_type: z.nativeEnum(NotificationType).optional(),
  priority: z.nativeEnum(NotificationPriority).optional(),
  limit: z.number().min(1).max(200).default(50),
  skip: z.number().min(0).default(0),
  include_archived: z.boolean().default(false),
  from_date: z.string().datetime().optional(),
  to_date: z.string().datetime().optional()
});

export type NotificationFiltersFormData = z.infer<typeof NotificationFiltersSchema>;

// ==================== PREFERENCES SCHEMAS ====================

export const NotificationPreferencesSchema = z.object({
  email_notifications: z.boolean().default(true),
  push_notifications: z.boolean().default(true),
  sms_notifications: z.boolean().default(false),
  chat_notifications: z.boolean().default(true),
  service_notifications: z.boolean().default(true),
  payment_notifications: z.boolean().default(true),
  marketing_notifications: z.boolean().default(false)
});

export type NotificationPreferencesFormData = z.infer<typeof NotificationPreferencesSchema>;

// ==================== TEST SCHEMAS ====================

export const TestNotificationSchema = z.object({
  user_id: z.number({
    error: "L'ID de l'utilisateur doit être un nombre"
  }).refine(val => val !== undefined && val !== null, {
    message: "L'ID de l'utilisateur est requis"
  }),
  
  notification_type: z.nativeEnum(NotificationType).default(NotificationType.INFO),
  
  custom_title: z.string().max(255).optional(),
  
  custom_message: z.string().max(2000).optional()
});

export type TestNotificationFormData = z.infer<typeof TestNotificationSchema>;
