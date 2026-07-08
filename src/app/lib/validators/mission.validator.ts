// src/app/lib/validators/mission.validator.ts

import { MissionStatus, MissionUrgency } from '@/app/types';
import { z } from 'zod';

// ==================== SCHÉMAS ====================

/**
 * Schéma de base pour une mission
 */
const baseMissionSchema = z.object({
  // Général
  title: z.string().min(5, "Le titre doit contenir au moins 5 caractères").max(255, "Le titre ne peut pas dépasser 255 caractères"),
  description: z.string().min(10, "La description doit contenir au moins 10 caractères").max(5000, "La description ne peut pas dépasser 5000 caractères"),
  
  // Catégorie
  category_id: z.string().uuid("La catégorie doit être un UUID valide"),
  
  // Adresse
  address_id: z.string().uuid("L'adresse doit être un UUID valide"),
  
  // Budget
  budget_min: z.number().min(0, "Le budget minimum doit être supérieur ou égal à 0").optional(),
  budget_max: z.number().min(0, "Le budget maximum doit être supérieur ou égal à 0").optional(),
  
  // Date
  scheduled_at: z.string().datetime({ message: "La date doit être au format ISO" }),
  
  // Urgence
  urgency: z.nativeEnum(MissionUrgency).default(MissionUrgency.MEDIUM),
  
  // Pièces jointes
  attachments: z.array(z.any()).optional(),
});

/**
 * Schéma de création d'une mission
 */
export const createMissionSchema = baseMissionSchema.superRefine((data, ctx) => {
  // Vérifier que la date est dans le futur
  const scheduledDate = new Date(data.scheduled_at);
  const now = new Date();
  if (scheduledDate <= now) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["scheduled_at"],
      message: "La date doit être dans le futur",
    });
  }
  
  // Vérifier que budget_max >= budget_min si les deux sont définis
  if (data.budget_min !== undefined && data.budget_max !== undefined) {
    if (data.budget_min > data.budget_max) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["budget_max"],
        message: "Le budget maximum doit être supérieur ou égal au budget minimum",
      });
    }
  }
});

export type CreateMissionFormData = z.infer<typeof createMissionSchema>;

/**
 * Schéma de mise à jour d'une mission
 */
export const updateMissionSchema = baseMissionSchema
  .partial()
  .superRefine((data, ctx) => {
    // Au moins un champ doit être fourni
    if (Object.keys(data).length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: [],
        message: "Au moins un champ doit être fourni",
      });
      return;
    }
    
    // Vérifier que la date est dans le futur si elle est fournie
    if (data.scheduled_at) {
      const scheduledDate = new Date(data.scheduled_at);
      const now = new Date();
      if (scheduledDate <= now) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["scheduled_at"],
          message: "La date doit être dans le futur",
        });
      }
    }
    
    // Vérifier que budget_max >= budget_min si les deux sont définis
    if (data.budget_min !== undefined && data.budget_max !== undefined) {
      if (data.budget_min > data.budget_max) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["budget_max"],
          message: "Le budget maximum doit être supérieur ou égal au budget minimum",
        });
      }
    }
  });

export type UpdateMissionFormData = z.infer<typeof updateMissionSchema>;

/**
 * Schéma des filtres pour les missions
 */
export const missionFiltersSchema = z.object({
  // Statut
  status: z.nativeEnum(MissionStatus).optional(),
  
  // Catégorie
  category_id: z.string().uuid("La catégorie doit être un UUID valide").optional(),
  
  // Budget
  budget_min: z.number().min(0).optional(),
  budget_max: z.number().min(0).optional(),
  
  // Date
  date_from: z.string().datetime().optional(),
  date_to: z.string().datetime().optional(),
  
  // Localisation
  city: z.string().optional(),
  district: z.string().optional(),
  
  // Urgence
  urgency: z.nativeEnum(MissionUrgency).optional(),
  
  // Recherche
  search: z.string().optional(),
  
  // Pagination
  page: z.number().min(1).default(1),
  per_page: z.number().min(1).max(100).default(15),
  
  // Tri
  sort_by: z.enum(['created_at', 'scheduled_at', 'budget_min', 'budget_max', 'urgency']).default('created_at'),
  sort_direction: z.enum(['asc', 'desc']).default('desc'),
}).superRefine((data, ctx) => {
  // Vérifier que budget_max >= budget_min si les deux sont définis
  if (data.budget_min !== undefined && data.budget_max !== undefined) {
    if (data.budget_min > data.budget_max) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["budget_max"],
        message: "Le budget maximum doit être supérieur ou égal au budget minimum",
      });
    }
  }
  
  // Vérifier que date_from <= date_to si les deux sont définis
  if (data.date_from && data.date_to) {
    if (new Date(data.date_from) > new Date(data.date_to)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["date_to"],
        message: "La date de fin doit être postérieure à la date de début",
      });
    }
  }
});

export type MissionFiltersFormData = z.infer<typeof missionFiltersSchema>;

/**
 * Schéma pour l'ajout d'une pièce jointe
 */
export const missionAttachmentSchema = z.object({
  file: z.any()
    .refine((file) => file instanceof File, "Le fichier est requis")
    .refine(
      (file) => ['image/jpeg', 'image/png', 'image/gif', 'image/svg+xml', 'video/mp4', 'video/quicktime', 'video/x-msvideo', 'application/pdf'].includes(file?.type),
      "Le fichier doit être de type jpg, jpeg, png, gif, svg, mp4, mov, avi ou pdf"
    )
    .refine(
      (file) => file?.size <= 5 * 1024 * 1024,
      "Le fichier ne doit pas dépasser 5 Mo"
    ),
});

export type MissionAttachmentFormData = z.infer<typeof missionAttachmentSchema>;

/**
 * Schéma pour la mise à jour du statut d'une mission (admin)
 */
export const updateMissionStatusSchema = z.object({
  status: z.nativeEnum(MissionStatus),
  reason: z.string().max(500, "La raison ne peut pas dépasser 500 caractères").optional(),
  notify: z.boolean().default(false),
});

export type UpdateMissionStatusFormData = z.infer<typeof updateMissionStatusSchema>;

/**
 * Schéma pour l'annulation d'une mission
 */
export const cancelMissionSchema = z.object({
  reason: z.string().min(5, "La raison doit contenir au moins 5 caractères").max(500, "La raison ne peut pas dépasser 500 caractères"),
});

export type CancelMissionFormData = z.infer<typeof cancelMissionSchema>;

/**
 * Schéma pour l'assignation d'un prestataire à une mission
 */
export const assignProviderSchema = z.object({
  provider_id: z.string().uuid("Le prestataire doit être un UUID valide"),
  amount: z.number().positive("Le montant doit être positif").optional(),
  message: z.string().max(500, "Le message ne peut pas dépasser 500 caractères").optional(),
});

export type AssignProviderFormData = z.infer<typeof assignProviderSchema>;