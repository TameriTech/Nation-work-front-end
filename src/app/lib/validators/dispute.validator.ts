// src/app/lib/validators/dispute.validator.ts
import { z } from 'zod';
import { 
  DisputeStatus, 
  DisputePriority, 
  DisputeOutcome, 
  DisputeResolutionMethod,
  DisputeEscalationReason,
  DisputeEscalationLevel,
  MessageType
} from '../../types/enums';

// ==================== CREATE SCHEMAS ====================

export const CreateDisputeSchema = z.object({
  service_id: z.number({
    error: "L'ID du service doit être un nombre"
  }).refine(val => val !== undefined && val !== null, {
    message: "L'ID du service est requis"
  }),
  
  review_id: z.number({
    error: "L'ID de l'évaluation doit être un nombre"
  }).optional(),
  
  chat_id: z.number({
    error: "L'ID du chat doit être un nombre"
  }).optional(),
  
  title: z.string({
    error: "Le titre doit être une chaîne de caractères"
  }).min(5, "Le titre doit contenir au moins 5 caractères")
    .max(255, "Le titre ne peut pas dépasser 255 caractères"),
  
  reason: z.string({
    error: "La raison doit être une chaîne de caractères"
  }).min(10, "La raison doit contenir au moins 10 caractères")
    .max(500, "La raison ne peut pas dépasser 500 caractères"),
  
  description: z.string({
    error: "La description doit être une chaîne de caractères"
  }).max(2000, "La description ne peut pas dépasser 2000 caractères")
    .optional(),
  
  priority: z.nativeEnum(DisputePriority, {
    error: "La priorité doit être une valeur valide"
  }).default(DisputePriority.NORMAL),
  
  amount_in_dispute: z.number({
    error: "Le montant en litige doit être un nombre"
  }).min(0, "Le montant en litige doit être positif")
    .optional(),
  
  evidence: z.record(z.string(), z.any()).optional(),
  
  evidence_description: z.string({
    error: "La description des preuves doit être une chaîne de caractères"
  }).max(500, "La description des preuves ne peut pas dépasser 500 caractères")
    .optional(),
  
  raised_against_id: z.number({
    error: "L'ID du défendeur doit être un nombre"
  }).refine(val => val !== undefined && val !== null, {
    message: "L'ID du défendeur est requis"
  })
});

export type CreateDisputeFormData = z.infer<typeof CreateDisputeSchema>;

// ==================== UPDATE SCHEMAS ====================

export const UpdateDisputeSchema = z.object({
  status: z.nativeEnum(DisputeStatus).optional(),
  priority: z.nativeEnum(DisputePriority).optional(),
  title: z.string().min(5).max(255).optional(),
  description: z.string().max(2000).optional(),
  evidence: z.record(z.string(), z.any()).optional(),
  evidence_description: z.string().max(500).optional()
});

export type UpdateDisputeFormData = z.infer<typeof UpdateDisputeSchema>;

export const DisputeDecisionSchema = z.object({
  decision_type: z.enum(["resolution", "rejection"], {
    error: "Le type de décision doit être 'resolution' ou 'rejection'"
  }),
  
  reason: z.string({
    error: "La raison de la décision doit être une chaîne de caractères"
  }).min(10, "La raison doit contenir au moins 10 caractères")
    .max(2000, "La raison ne peut pas dépasser 2000 caractères"),
  
  is_final: z.boolean().default(true),
    can_appeal: z.boolean().default(true),
  
  appeal_deadline: z.string().optional(),
  
  // Resolution-specific fields
  resolution_method: z.nativeEnum(DisputeResolutionMethod, {
    error: "La méthode de résolution doit être valide"
  }).optional(),
  
  outcome: z.nativeEnum(DisputeOutcome, {
    error: "Le résultat doit être valide"
  }).optional(),
  
  refund_amount: z.number().min(0).optional(),
  
  compensation_amount: z.number().min(0).optional(),
  
  platform_fee_refunded: z.boolean().default(false),
  
  // Notification
  notify_parties: z.boolean().default(true)
});
export type DisputeDecisionFormData = z.infer<typeof DisputeDecisionSchema>;



export const EscalateDisputeSchema = z.object({
  reason: z.nativeEnum(DisputeEscalationReason, {
    error: "La raison d'escalade doit être valide"
  }),
  
  details: z.string({
    error: "Les détails doivent être une chaîne de caractères"
  }).min(10, "Les détails doivent contenir au moins 10 caractères")
    .max(1000, "Les détails ne peuvent pas dépasser 1000 caractères"),
  
  additional_evidence: z.record(z.string(), z.any()).optional(),
  
  requested_priority: z.nativeEnum(DisputePriority).optional()
});
export type EscalateDisputeFormData = z.infer<typeof EscalateDisputeSchema>;

export const RejectDisputeSchema = z.object({
  reason: z.string({
    error: "La raison doit être une chaîne de caractères"
  }).min(5, "La raison doit contenir au moins 5 caractères")
    .max(500, "La raison ne peut pas dépasser 500 caractères"),
  
  notify_users: z.boolean().default(true)
});

export type RejectDisputeFormData = z.infer<typeof RejectDisputeSchema>;

export const HoldDisputeSchema = z.object({
  reason: z.string({
    error: "La raison doit être une chaîne de caractères"
  }).min(5, "La raison doit contenir au moins 5 caractères")
    .max(500, "La raison ne peut pas dépasser 500 caractères"),
  
  hold_until: z.string().datetime().optional()
});

export type HoldDisputeFormData = z.infer<typeof HoldDisputeSchema>;

export const AssignDisputeSchema = z.object({
  assigned_to: z.number({
    error: "L'ID de l'admin doit être un nombre"
  }).refine(val => val !== undefined && val !== null, {
    message: "L'ID de l'admin est requis"
  }),
  
  notes: z.string().max(1000).optional()
});

export type AssignDisputeFormData = z.infer<typeof AssignDisputeSchema>;

export const ReassignDisputeSchema = z.object({
  assigned_to: z.number({
    error: "L'ID de l'admin doit être un nombre"
  }).refine(val => val !== undefined && val !== null, {
    message: "L'ID de l'admin est requis"
  }),
  
  reason: z.string().max(500).optional()
});

export type ReassignDisputeFormData = z.infer<typeof ReassignDisputeSchema>;

// ==================== MESSAGE SCHEMAS ====================

export const CreateDisputeMessageSchema = z.object({
  message: z.string({
    error: "Le message doit être une chaîne de caractères"
  }).min(1, "Le message ne peut pas être vide")
    .max(2000, "Le message ne peut pas dépasser 2000 caractères"),
  
  is_private: z.boolean().default(false),
  
  message_type: z.nativeEnum(MessageType).default(MessageType.TEXT),
  
  attachments: z.record(z.string(), z.any()).optional()
});

export type CreateDisputeMessageFormData = z.infer<typeof CreateDisputeMessageSchema>;

// ==================== FILTERS SCHEMAS ====================

export const DisputeFiltersSchema = z.object({
  status: z.nativeEnum(DisputeStatus).optional(),
  priority: z.nativeEnum(DisputePriority).optional(),
  user_id: z.number().optional(),
  service_id: z.number().optional(),
  date_from: z.string().datetime().optional(),
  date_to: z.string().datetime().optional(),
  escalation_level: z.nativeEnum(DisputeEscalationLevel).optional(),
  outcome: z.nativeEnum(DisputeOutcome).optional(),
  resolution_method: z.nativeEnum(DisputeResolutionMethod).optional(),
  assigned_to: z.number().optional(),
  page: z.number().min(1).default(1),
  per_page: z.number().min(1).max(100).default(20),
  search: z.string().optional(),
  sort_by: z.string().default("created_at"),
  sort_order: z.enum(['asc', 'desc']).default('desc'),
  opened_by: z.enum(['client', 'provider']).optional()
});

export type DisputeFiltersFormData = z.infer<typeof DisputeFiltersSchema>;

// ==================== BULK OPERATIONS SCHEMAS ====================

export const BulkProcessDisputesSchema = z.object({
  dispute_ids: z.array(z.number()).min(1, "Au moins un litige doit être sélectionné"),
  action: z.enum(['assign', 'resolve', 'reject', 'escalate']),
  assigned_to: z.number().optional(),
  resolution: z.string().optional(),
  resolution_method: z.nativeEnum(DisputeResolutionMethod).optional(),
  outcome: z.nativeEnum(DisputeOutcome).optional(),
  reason: z.string().optional()
});

export type BulkProcessDisputesFormData = z.infer<typeof BulkProcessDisputesSchema>;
