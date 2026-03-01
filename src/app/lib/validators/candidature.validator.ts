import { z } from 'zod';

// ==================== CANDIDATURE ====================

export const candidatureSchema = z.object({
  service_id: z.number()
    .positive("ID de service invalide"),
  message: z.string()
    .max(1000, "Le message ne doit pas dépasser 1000 caractères")
    .optional()
    .nullable(),
  proposed_amount: z.number()
    .min(1000, "Le montant minimum est de 1000 FCFA")
    .max(10000000, "Le montant maximum est de 10 000 000 FCFA")
    .optional()
    .nullable(),
  estimated_duration: z.string()
    .max(50, "Durée estimée trop longue")
    .optional()
    .nullable(),
});

export const updateCandidatureStatusSchema = z.object({
  status: z.enum(["en_attente", "acceptee", "refusee"]).refine((val) => true, {
    message: "Statut de candidature invalide"
  }),
  rejection_reason: z.string()
    .max(500, "La raison du rejet ne doit pas dépasser 500 caractères")
    .optional()
    .nullable(),
  message: z.string()
    .max(1000, "Le message ne doit pas dépasser 1000 caractères")
    .optional()
    .nullable(),
});

// Types exportés
export type CandidatureFormData = z.infer<typeof candidatureSchema>;
export type UpdateCandidatureStatusFormData = z.infer<typeof updateCandidatureStatusSchema>;
