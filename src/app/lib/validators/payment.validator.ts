// src/app/lib/validators/payment.validator.ts
import { z } from 'zod';
import { 
  PaymentStatus, 
  PaymentMethod, 
  TransactionType, 
  PayoutStatus 
} from '../../types/enums';

// ==================== PAYMENT SCHEMAS ====================

export const CreatePaymentSchema = z.object({
  service_id: z.number({
    error: "L'ID du service doit être un nombre"
  }).refine(val => val !== undefined && val !== null, {
    message: "L'ID du service est requis"
  }),
  
  client_id: z.number({
    error: "L'ID du client doit être un nombre"
  }).refine(val => val !== undefined && val !== null, {
    message: "L'ID du client est requis"
  }),
  
  provider_id: z.number({
    error: "L'ID du provider doit être un nombre"
  }).refine(val => val !== undefined && val !== null, {
    message: "L'ID du provider est requis"
  }),
  
  amount: z.number({
    error: "Le montant doit être un nombre"
  }).positive("Le montant doit être positif"),
  
  platform_fee: z.number({
    error: "Les frais de plateforme doivent être un nombre"
  }).min(0, "Les frais de plateforme ne peuvent pas être négatifs")
    .default(0),
  
  platform_fee_percentage: z.number({
    error: "Le pourcentage de frais doit être un nombre"
  }).min(0, "Le pourcentage de frais ne peut pas être négatif")
    .max(100, "Le pourcentage de frais ne peut pas dépasser 100")
    .default(0),
  
  currency: z.string().default("XAF"),
  
  payment_method: z.nativeEnum(PaymentMethod).optional(),
  
  notes: z.string().max(500, "Les notes ne peuvent pas dépasser 500 caractères").optional(),
  
  metadata: z.record(z.string(), z.any()).optional()
});

export type CreatePaymentFormData = z.infer<typeof CreatePaymentSchema>;

export const UpdatePaymentSchema = z.object({
  payment_method: z.nativeEnum(PaymentMethod).optional(),
  status: z.nativeEnum(PaymentStatus).optional(),
  transaction_id: z.string().optional(),
  payment_intent_id: z.string().optional(),
  payment_date: z.string().datetime().optional(),
  notes: z.string().max(500).optional(),
  metadata: z.record(z.string(), z.any()).optional()
});

export type UpdatePaymentFormData = z.infer<typeof UpdatePaymentSchema>;

export const ProcessPaymentSchema = z.object({
  payment_method: z.nativeEnum(PaymentMethod, {
    error: "La méthode de paiement est requise"
  }),
  
  transaction_id: z.string().optional(),
  payment_intent_id: z.string().optional(),
  payment_method_details: z.record(z.string(), z.any()).optional(),
  gateway_response: z.record(z.string(), z.any()).optional()
});

export type ProcessPaymentFormData = z.infer<typeof ProcessPaymentSchema>;

export const RefundPaymentSchema = z.object({
  amount: z.number({
    error: "Le montant doit être un nombre"
  }).positive("Le montant du remboursement doit être positif")
    .optional(),
  
  reason: z.string({
    error: "La raison doit être une chaîne de caractères"
  }).min(5, "La raison doit contenir au moins 5 caractères")
    .max(500, "La raison ne peut pas dépasser 500 caractères"),
  
  transaction_id: z.string().optional(),
  
  notify_user: z.boolean().default(true)
}).refine(data => {
  if (data.amount !== undefined && data.amount <= 0) {
    return false;
  }
  return true;
}, {
  message: "Le montant du remboursement doit être positif",
  path: ['amount']
});

export type RefundPaymentFormData = z.infer<typeof RefundPaymentSchema>;

export const InitiatePaymentSchema = z.object({
  service_id: z.number({
    error: "L'ID du service doit être un nombre"
  }).refine(val => val !== undefined && val !== null, {
    message: "L'ID du service est requis"
  }),
  
  payment_method: z.nativeEnum(PaymentMethod, {
    error: "La méthode de paiement est requise"
  }),
  
  payment_method_details: z.record(z.string(), z.any()).optional(),
  
  currency: z.string().default("XAF"),
  
  notes: z.string().max(500, "Les notes ne peuvent pas dépasser 500 caractères").optional()
});

export type InitiatePaymentFormData = z.infer<typeof InitiatePaymentSchema>;

// ==================== PAYOUT SCHEMAS ====================

export const CreatePayoutSchema = z.object({
  payment_id: z.number({
    error: "L'ID du paiement doit être un nombre"
  }).refine(val => val !== undefined && val !== null, {
    message: "L'ID du paiement est requis"
  }),
  
  amount: z.number({
    error: "Le montant doit être un nombre"
  }).positive("Le montant doit être positif"),
  
  currency: z.string().default("XAF"),
  
  payout_method: z.string().optional(),
  
  payout_method_details: z.record(z.string(), z.any()).optional(),
  
  notes: z.string().max(500, "Les notes ne peuvent pas dépasser 500 caractères").optional()
});

export type CreatePayoutFormData = z.infer<typeof CreatePayoutSchema>;

export const UpdatePayoutSchema = z.object({
  status: z.nativeEnum(PayoutStatus).optional(),
  transaction_id: z.string().optional(),
  gateway_response: z.record(z.string(), z.any()).optional(),
  processed_at: z.string().datetime().optional(),
  completed_at: z.string().datetime().optional(),
  notes: z.string().max(500).optional()
});

export type UpdatePayoutFormData = z.infer<typeof UpdatePayoutSchema>;

export const BatchPayoutSchema = z.object({
  payout_ids: z.array(z.number())
    .min(1, "Au moins un reversement doit être sélectionné"),
  
  batch_id: z.string().optional()
});

export type BatchPayoutFormData = z.infer<typeof BatchPayoutSchema>;

// ==================== FILTERS SCHEMAS ====================

export const PaymentFiltersSchema = z.object({
  status: z.nativeEnum(PaymentStatus).optional(),
  payment_method: z.nativeEnum(PaymentMethod).optional(),
  client_id: z.number().optional(),
  provider_id: z.number().optional(),
  service_id: z.number().optional(),
  dispute_id: z.number().optional(),
  date_from: z.string().datetime().optional(),
  date_to: z.string().datetime().optional(),
  min_amount: z.number().min(0).optional(),
  max_amount: z.number().min(0).optional(),
  currency: z.string().optional(),
  page: z.number().min(1).default(1),
  per_page: z.number().min(1).max(100).default(20),
  search: z.string().optional(),
  sort_by: z.string().default("created_at"),
  sort_order: z.enum(['asc', 'desc']).default('desc')
}).refine(data => {
  if (data.date_from && data.date_to && data.date_from > data.date_to) {
    return false;
  }
  return true;
}, {
  message: "La date de début doit être antérieure à la date de fin"
}).refine(data => {
  if (data.min_amount && data.max_amount && data.min_amount > data.max_amount) {
    return false;
  }
  return true;
}, {
  message: "Le montant minimum doit être inférieur au montant maximum"
});

export type PaymentFiltersFormData = z.infer<typeof PaymentFiltersSchema>;

export const PayoutFiltersSchema = z.object({
  status: z.nativeEnum(PayoutStatus).optional(),
  provider_id: z.number().optional(),
  date_from: z.string().datetime().optional(),
  date_to: z.string().datetime().optional(),
  page: z.number().min(1).default(1),
  per_page: z.number().min(1).max(100).default(20)
});

export type PayoutFiltersFormData = z.infer<typeof PayoutFiltersSchema>;

// ==================== EXPORT SCHEMAS ====================

export const ExportTransactionsSchema = z.object({
  format: z.enum(['csv', 'excel', 'pdf']).default('csv'),
  status: z.nativeEnum(PaymentStatus).optional(),
  client_id: z.number().optional(),
  provider_id: z.number().optional(),
  date_from: z.string().datetime().optional(),
  date_to: z.string().datetime().optional()
});

export type ExportTransactionsFormData = z.infer<typeof ExportTransactionsSchema>;

// ==================== STATS SCHEMAS ====================

export const PaymentStatsFiltersSchema = z.object({
  date_from: z.string().datetime().optional(),
  date_to: z.string().datetime().optional(),
  period: z.enum(['day', 'week', 'month', 'year']).optional()
});

export type PaymentStatsFiltersFormData = z.infer<typeof PaymentStatsFiltersSchema>;

// ==================== MARK PAID SCHEMA ====================

export const MarkPaymentAsPaidSchema = z.object({
  transaction_id: z.string().optional(),
  notes: z.string().max(500).optional()
});

export type MarkPaymentAsPaidFormData = z.infer<typeof MarkPaymentAsPaidSchema>;
