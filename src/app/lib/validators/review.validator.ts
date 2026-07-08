// app/lib/validators/review.validator.ts

import { z } from 'zod';

// ==================== ENUMS ====================

export const ReviewRatingEnum = z.enum(['1', '2', '3', '4', '5']).transform(Number);
export type ReviewRating = z.infer<typeof ReviewRatingEnum>;

// ==================== BASE SCHEMAS ====================

/**
 * Schéma de base pour un avis
 */
export const ReviewBaseSchema = z.object({
  service_id: z.number({
    error: "L'ID du service est requis",
  }).refine(val => val > 0, {
    message: "L'ID du service doit être un nombre positif",
  }),
  rating: z.number({
    error: "La note est requise",
  }).refine(val => val >= 1 && val <= 5, {
    message: "La note doit être comprise entre 1 et 5",
  }),
  communication_rating: z.number()
    .min(1, "La note de communication doit être au moins de 1 étoile")
    .max(5, "La note de communication ne peut pas dépasser 5 étoiles")
    .optional(),
  quality_rating: z.number()
    .min(1, "La note de qualité doit être au moins de 1 étoile")
    .max(5, "La note de qualité ne peut pas dépasser 5 étoiles")
    .optional(),
  deadline_rating: z.number()
    .min(1, "La note de délai doit être au moins de 1 étoile")
    .max(5, "La note de délai ne peut pas dépasser 5 étoiles")
    .optional(),
  professionalism_rating: z.number()
    .min(1, "La note de professionnalisme doit être au moins de 1 étoile")
    .max(5, "La note de professionnalisme ne peut pas dépasser 5 étoiles")
    .optional(),
  comment: z.string()
    .min(10, "Le commentaire doit contenir au moins 10 caractères")
    .max(2000, "Le commentaire ne peut pas dépasser 2000 caractères")
    .optional()
    .default(''),
  private_feedback: z.string()
    .max(2000, "Le feedback privé ne peut pas dépasser 2000 caractères")
    .optional(),
  is_public: z.boolean()
    .default(true),
});

/**
 * Schéma pour la création d'un avis
 */
export const CreateReviewSchema = ReviewBaseSchema.refine(
  (data) => {
    // Si la note globale est fournie, elle doit être cohérente avec les notes détaillées
    if (data.communication_rating || data.quality_rating || data.deadline_rating || data.professionalism_rating) {
      const avgDetailRating = (
        (data.communication_rating || 0) +
        (data.quality_rating || 0) +
        (data.deadline_rating || 0) +
        (data.professionalism_rating || 0)
      ) / 4;
      
      // La note globale devrait être proche de la moyenne des notes détaillées
      return Math.abs(data.rating - avgDetailRating) <= 2;
    }
    return true;
  },
  {
    message: "La note globale devrait être cohérente avec les notes détaillées",
    path: ["rating"],
  }
);

export type CreateReviewFormData = z.infer<typeof CreateReviewSchema>;

// ==================== UPDATE SCHEMAS ====================

/**
 * Schéma pour la mise à jour d'un avis
 */
export const UpdateReviewSchema = z.object({
  comment: z.string()
    .min(10, "Le commentaire doit contenir au moins 10 caractères")
    .max(2000, "Le commentaire ne peut pas dépasser 2000 caractères")
    .optional(),
  private_feedback: z.string()
    .max(2000, "Le feedback privé ne peut pas dépasser 2000 caractères")
    .optional(),
  is_public: z.boolean()
    .optional(),
}).refine(
  (data) => Object.keys(data).length > 0,
  {
    message: "Au moins un champ doit être fourni pour la mise à jour",
  }
);

export type UpdateReviewFormData = z.infer<typeof UpdateReviewSchema>;

// ==================== RESPONSE SCHEMAS ====================

/**
 * Schéma pour la réponse à un avis
 */
export const ReviewResponseSchema = z.object({
  response: z.string()
    .min(2, "La réponse doit contenir au moins 2 caractères")
    .max(2000, "La réponse ne peut pas dépasser 2000 caractères"),
});

export type ReviewResponseFormData = z.infer<typeof ReviewResponseSchema>;

// ==================== FILTERS SCHEMAS ====================

/**
 * Schéma pour les filtres de recherche d'avis
 */
export const ReviewFiltersSchema = z.object({
  page: z.number()
    .min(1, "La page doit être au moins 1")
    .default(1)
    .optional(),
  per_page: z.number()
    .min(1, "Le nombre d'éléments par page doit être au moins 1")
    .max(100, "Le nombre d'éléments par page ne peut pas dépasser 100")
    .default(20)
    .optional(),
  role: z.enum(['client', 'provider', 'all'])
    .optional(),
  min_rating: z.number()
    .min(1, "La note minimale doit être au moins 1")
    .max(5, "La note maximale ne peut pas dépasser 5")
    .optional(),
  max_rating: z.number()
    .min(1, "La note minimale doit être au moins 1")
    .max(5, "La note maximale ne peut pas dépasser 5")
    .optional(),
  has_response: z.boolean()
    .optional(),
  has_comment: z.boolean()
    .optional(),
  is_verified: z.boolean()
    .optional(),
  is_public: z.boolean()
    .optional(),
  date_from: z.string()
    .datetime("Format de date invalide")
    .optional(),
  date_to: z.string()
    .datetime("Format de date invalide")
    .optional(),
  search: z.string()
    .max(100, "La recherche ne peut pas dépasser 100 caractères")
    .optional(),
  sort_by: z.enum(['created_at', 'rating', 'helpful_count'])
    .default('created_at')
    .optional(),
  sort_order: z.enum(['asc', 'desc'])
    .default('desc')
    .optional(),
}).refine(
  (data) => {
    if (data.min_rating && data.max_rating && data.min_rating > data.max_rating) {
      return false;
    }
    return true;
  },
  {
    message: "La note minimale ne peut pas être supérieure à la note maximale",
    path: ["min_rating"],
  }
);

export type ReviewFiltersFormData = z.infer<typeof ReviewFiltersSchema>;

// ==================== ADMIN SCHEMAS ====================

/**
 * Schéma pour la vérification d'un avis (admin)
 */
export const ReviewVerifySchema = z.object({
  verified: z.boolean({
    error: "Le statut de vérification est requis",
  }),
});

export type ReviewVerifyFormData = z.infer<typeof ReviewVerifySchema>;

/**
 * Schéma pour le signalement d'un avis (admin)
 */
export const ReviewFlagSchema = z.object({
  reason: z.string()
    .min(5, "La raison doit contenir au moins 5 caractères")
    .max(500, "La raison ne peut pas dépasser 500 caractères"),
});

export type ReviewFlagFormData = z.infer<typeof ReviewFlagSchema>;

/**
 * Schéma pour le masquage d'un avis (admin)
 */
export const ReviewHideSchema = z.object({
  reason: z.string()
    .min(5, "La raison doit contenir au moins 5 caractères")
    .max(500, "La raison ne peut pas dépasser 500 caractères"),
});

export type ReviewHideFormData = z.infer<typeof ReviewHideSchema>;

// ==================== STATS SCHEMAS ====================

/**
 * Schéma pour les statistiques de distribution des notes
 */
export const RatingDistributionSchema = z.object({
  1: z.number().default(0),
  2: z.number().default(0),
  3: z.number().default(0),
  4: z.number().default(0),
  5: z.number().default(0),
});

export type RatingDistribution = z.infer<typeof RatingDistributionSchema>;

/**
 * Schéma pour les statistiques des avis
 */
export const ReviewStatsSchema = z.object({
  total_reviews: z.number().default(0),
  average_rating: z.number().min(0).max(5).default(0),
  rating_distribution: RatingDistributionSchema,
  response_rate: z.number().min(0).max(100).default(0),
  average_response_time: z.number().optional(),
  reviews_by_role: z.object({
    as_client: z.number().default(0),
    as_provider: z.number().default(0),
  }),
  monthly_trend: z.number().optional(),
});

export type ReviewStats = z.infer<typeof ReviewStatsSchema>;

// ==================== SERVICE ELIGIBLE SCHEMA ====================

/**
 * Schéma pour un service éligible à un avis
 */
export const ReviewableServiceSchema = z.object({
  id: z.number(),
  title: z.string(),
  provider_id: z.number(),
  provider_name: z.string(),
  completed_at: z.string().datetime(),
  has_review: z.boolean().optional(),
  review_id: z.number().optional(),
});

export type ReviewableService = z.infer<typeof ReviewableServiceSchema>;

// ==================== REVIEW RESPONSE SCHEMA ====================

/**
 * Schéma complet pour un avis (réponse API)
 */
export const ReviewSchema = z.object({
  id: z.number(),
  service_id: z.number(),
  service_title: z.string(),
  client_id: z.number(),
  client_name: z.string(),
  client_avatar: z.string().url().optional(),
  provider_id: z.number(),
  provider_name: z.string(),
  provider_avatar: z.string().url().optional(),
  rating: z.number().min(1).max(5),
  communication_rating: z.number().min(1).max(5).optional(),
  quality_rating: z.number().min(1).max(5).optional(),
  deadline_rating: z.number().min(1).max(5).optional(),
  professionalism_rating: z.number().min(1).max(5).optional(),
  comment: z.string(),
  private_feedback: z.string().optional(),
  provider_response: z.string().optional(),
  response_date: z.string().datetime().optional(),
  is_verified: z.boolean(),
  is_public: z.boolean(),
  helpful_count: z.number().default(0),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime().optional(),
  service: z.object({
    id: z.number(),
    title: z.string(),
    status: z.string(),
  }).optional(),
});

export type Review = z.infer<typeof ReviewSchema>;

/**
 * Schéma pour la réponse paginée
 */
export const PaginatedReviewsSchema = z.object({
  items: z.array(ReviewSchema),
  total: z.number(),
  page: z.number(),
  per_page: z.number(),
  total_pages: z.number(),
});

export type PaginatedReviews = z.infer<typeof PaginatedReviewsSchema>;

// ==================== HELPFUL RESPONSE SCHEMA ====================

/**
 * Schéma pour la réponse après avoir marqué un avis comme utile
 */
export const HelpfulResponseSchema = z.object({
  review_id: z.number(),
  helpful_count: z.number(),
  user_vote: z.enum(['added', 'removed']),
});

export type HelpfulResponse = z.infer<typeof HelpfulResponseSchema>;

// ==================== EXPORT ====================

export const reviewValidators = {
  create: CreateReviewSchema,
  update: UpdateReviewSchema,
  response: ReviewResponseSchema,
  filters: ReviewFiltersSchema,
  verify: ReviewVerifySchema,
  flag: ReviewFlagSchema,
  hide: ReviewHideSchema,
};
