import { z } from 'zod';

// ==================== CATÉGORIE (ADMIN) ====================

export const categorySchema = z.object({
  name: z.string()
    .min(2, "Le nom de la catégorie est requis")
    .max(100, "Nom trop long"),
  description: z.string()
    .max(500, "La description ne doit pas dépasser 500 caractères")
    .optional()
    .nullable(),
  icon: z.string()
    .max(100, "Nom d'icône trop long")
    .optional()
    .nullable(),
  color: z.string()
    .regex(/^#[0-9A-F]{6}$/i, "Couleur invalide (format hexadécimal)")
    .optional()
    .nullable(),
  is_active: z.boolean(),
  parent_id: z.number()
    .positive("ID parent invalide")
    .optional()
    .nullable(),
});

// ==================== ADMINISTRATEUR ====================

export const adminUserSchema = z.object({
  name: z.string()
    .min(2, "Le nom est requis")
    .max(100, "Nom trop long"),
  email: z.string()
    .email("Email invalide"),
  role: z.enum(["admin", "super_admin", "moderator"]).refine((val) => true, {
    message: "Rôle invalide"
  }),
  permissions: z.array(z.string()).optional(),
});

// ==================== PARAMÈTRES ====================

export const generalSettingsSchema = z.object({
  app_name: z.string()
    .min(2, "Le nom de l'application est requis")
    .max(100, "Nom trop long"),
  contact_email: z.string()
    .email("Email de contact invalide"),
  maintenance_mode: z.boolean(),
});

export const feeSettingsSchema = z.object({
  service_fee_percentage: z.number()
    .min(0, "Le pourcentage ne peut pas être négatif")
    .max(100, "Le pourcentage ne peut pas dépasser 100"),
  min_withdrawal_fee: z.number()
    .min(0, "Les frais ne peuvent pas être négatifs"),
});

export const timingSettingsSchema = z.object({
  response_time_limit: z.number()
    .min(1, "Le délai minimum est de 1 heure")
    .max(720, "Le délai maximum est de 720 heures (30 jours)"),
  completion_time_limit: z.number()
    .min(1, "Le délai minimum est de 1 heure")
    .max(8760, "Le délai maximum est de 8760 heures (1 an)"),
});

export const thresholdSettingsSchema = z.object({
  min_rating_for_featured: z.number()
    .min(0, "La note minimum est 0")
    .max(5, "La note maximum est 5"),
  min_completed_services: z.number()
    .min(0, "Le nombre minimum ne peut pas être négatif"),
});

// ==================== TICKET SUPPORT ====================

export const supportTicketSchema = z.object({
  subject: z.string()
    .min(5, "Le sujet est requis")
    .max(200, "Sujet trop long"),
  message: z.string()
    .min(10, "Le message est requis")
    .max(2000, "Message trop long"),
  priority: z.enum(["low", "normal", "high", "urgent"]).refine((val) => true, {
    message: "Priorité invalide"
    }),
});

export const ticketReplySchema = z.object({
  message: z.string()
    .min(1, "Le message est requis")
    .max(2000, "Message trop long"),
  is_private: z.boolean().optional(),
});

// ==================== LITIGE ====================

export const disputeSchema = z.object({
  reason: z.string()
    .min(10, "La raison du litige est requise")
    .max(1000, "Raison trop longue"),
  priority: z.enum(["low", "normal", "high", "urgent"]).optional(),
});

export const disputeResolutionSchema = z.object({
  resolution: z.string()
    .min(10, "La résolution est requise")
    .max(1000, "Résolution trop longue"),
  refund_percentage: z.number()
    .min(0, "Le pourcentage ne peut pas être négatif")
    .max(100, "Le pourcentage ne peut pas dépasser 100")
    .optional(),
  notify_users: z.boolean().optional(),
});

export const disputeMessageSchema = z.object({
  message: z.string()
    .min(1, "Le message est requis")
    .max(2000, "Message trop long"),
  is_private: z.boolean().optional(),
});

// Types exportés
export type CategoryFormData = z.infer<typeof categorySchema>;
export type AdminUserFormData = z.infer<typeof adminUserSchema>;
export type GeneralSettingsFormData = z.infer<typeof generalSettingsSchema>;
export type FeeSettingsFormData = z.infer<typeof feeSettingsSchema>;
export type TimingSettingsFormData = z.infer<typeof timingSettingsSchema>;
export type ThresholdSettingsFormData = z.infer<typeof thresholdSettingsSchema>;
export type SupportTicketFormData = z.infer<typeof supportTicketSchema>;
export type TicketReplyFormData = z.infer<typeof ticketReplySchema>;
export type DisputeFormData = z.infer<typeof disputeSchema>;
export type DisputeResolutionFormData = z.infer<typeof disputeResolutionSchema>;
export type DisputeMessageFormData = z.infer<typeof disputeMessageSchema>;
