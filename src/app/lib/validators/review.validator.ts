import { z } from 'zod';

// ==================== ÉVALUATION ====================

export const createReviewSchema = z.object({
  serviceId: z.number()
    .positive("ID de service invalide"),
  rating: z.number()
    .min(1, "La note minimum est de 1")
    .max(5, "La note maximum est de 5"),
  comment: z.string()
    .max(1000, "Le commentaire ne doit pas dépasser 1000 caractères")
    .optional()
    .nullable(),
});

// Types exportés
export type CreateReviewFormData = z.infer<typeof createReviewSchema>;
