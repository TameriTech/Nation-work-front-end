// lib/validators/category.validator.ts

import { z } from 'zod';

// ==================== ENUMS ====================

export enum CategoryStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

// ==================== SCHÉMAS ====================

/**
 * Schéma de création d'une catégorie
 */
export const createCategorySchema = z.object({
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères").max(255, "Le nom ne peut pas dépasser 255 caractères"),
  icon: z.string().max(255, "L'icône ne peut pas dépasser 255 caractères").optional().nullable(),
  parent_id: z.string().uuid("L'ID parent doit être un UUID valide").optional().nullable(),
});

export type CategoryCreateFormData = z.infer<typeof createCategorySchema>;

/**
 * Schéma de mise à jour d'une catégorie
 */
export const updateCategorySchema = z.object({
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères").max(255, "Le nom ne peut pas dépasser 255 caractères").optional(),
  icon: z.string().max(255, "L'icône ne peut pas dépasser 255 caractères").optional().nullable(),
  parent_id: z.string().uuid("L'ID parent doit être un UUID valide").optional().nullable(),
}).refine((data) => Object.keys(data).length > 0, {
  message: "Au moins un champ doit être fourni",
});

export type CategoryUpdateFormData = z.infer<typeof updateCategorySchema>;

/**
 * Schéma des filtres pour les catégories
 */
export const categoryFiltersSchema = z.object({
  search: z.string().optional(),
  parent_id: z.string().uuid("L'ID parent doit être un UUID valide").optional().nullable(),
  roots: z.boolean().optional(),
  is_active: z.boolean().optional(),
  sort_by: z.enum(['name', 'created_at', 'updated_at']).default('name'),
  sort_direction: z.enum(['asc', 'desc']).default('asc'),
  page: z.number().min(1).default(1),
  per_page: z.number().min(1).max(100).default(15),
});

export type CategoryFiltersFormData = z.infer<typeof categoryFiltersSchema>;

/**
 * Schéma pour les statistiques des catégories
 */
export const categoryStatsSchema = z.object({
  total: z.number(),
  active: z.number(),
  inactive: z.number(),
});

export type CategoryStatsFormData = z.infer<typeof categoryStatsSchema>;