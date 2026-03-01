import { z } from 'zod';

// ==================== PAIEMENT ====================

export const refundSchema = z.object({
  amount: z.number()
    .min(0, "Le montant ne peut pas être négatif")
    .optional()
    .nullable(),
  reason: z.string()
    .min(5, "La raison du remboursement est requise")
    .max(500, "La raison ne doit pas dépasser 500 caractères"),
  notify_users: z.boolean().optional(),
});

export const payoutSchema = z.object({
  transaction_id: z.string()
    .optional()
    .nullable(),
  notes: z.string()
    .max(500, "Les notes ne doivent pas dépasser 500 caractères")
    .optional()
    .nullable(),
});

// Types exportés
export type RefundFormData = z.infer<typeof refundSchema>;
export type PayoutFormData = z.infer<typeof payoutSchema>;
