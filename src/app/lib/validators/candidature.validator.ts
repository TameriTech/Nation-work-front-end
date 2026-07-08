// src/app/lib/validators/candidature.validator.ts
import { z } from 'zod';
import { CandidatureStatus, DurationUnit } from '../../types/enums';

export const CreateCandidatureSchema = z.object({
  service_code: z.string({
    error: "Le code du service doit être une chaîne de caractères"
  }).refine(
    (val) => val !== undefined && val !== null,
    { message: "L'ID du service est requis" }
  ),
  proposed_price: z.number()
    .positive('Le prix proposé doit être positif')
    .optional(),
  estimated_duration: z.string()
    .max(50, 'La durée estimée ne peut pas dépasser 50 caractères')
    .optional(),
  cover_letter: z.string()
    .max(2000, 'La lettre de motivation ne peut pas dépasser 2000 caractères')
    .optional(),
  estimated_duration_value: z.number()
    .positive('La valeur de la durée estimée doit être un nombre positif')
    .optional(),
  estimated_duration_unit: z.nativeEnum(DurationUnit).optional(),
  proposed_start_date: z.string()
    .datetime('Format de date invalide')
    .optional(),
  availability_confirmed: z.boolean().default(false)
}).refine(data => {
  // Au moins un des deux champs doit être fourni
  return data.proposed_price !== undefined || data.estimated_duration !== undefined;
}, {
  message: "Vous devez fournir soit un prix proposé, soit une durée estimée",
  path: ['proposed_price']
}).refine(data => {
  if (data.cover_letter && data.cover_letter.trim().length < 20) {
    return false;
  }
  return true;
}, {
  message: "La lettre de motivation doit contenir au moins 20 caractères si fournie",
  path: ['cover_letter']
});

export type CreateCandidatureFormData = z.infer<typeof CreateCandidatureSchema>;

export const UpdateCandidatureStatusSchema = z.object({
  status: z.enum(CandidatureStatus, {
    error: "Le statut est invalide"
  }).refine(val => val !== undefined && val !== null, {
    message: "Le statut est requis"
  }),
  rejection_reason: z.string()
    .max(500, 'La raison du rejet ne peut pas dépasser 500 caractères')
    .optional(),
  message: z.string()
    .max(1000, 'Le message ne peut pas dépasser 1000 caractères')
    .optional(),
  shortlist_notes: z.string()
    .max(500, 'Les notes de présélection ne peuvent pas dépasser 500 caractères')
    .optional(),
  client_notes: z.string()
    .max(1000, 'Les notes client ne peuvent pas dépasser 1000 caractères')
    .optional()
});

export type UpdateCandidatureStatusFormData = z.infer<typeof UpdateCandidatureStatusSchema>;

export const ShortlistCandidatureSchema = z.object({
  is_shortlisted: z.boolean(),
  shortlist_notes: z.string()
    .max(500, 'Les notes de présélection ne peuvent pas dépasser 500 caractères')
    .optional()
});

export type ShortlistCandidatureFormData = z.infer<typeof ShortlistCandidatureSchema>;

export const RejectCandidatureSchema = z.object({
  rejection_reason: z.string()
    .max(500, 'La raison du rejet ne peut pas dépasser 500 caractères')
    .optional()
});

export type RejectCandidatureFormData = z.infer<typeof RejectCandidatureSchema>;

export const WithdrawCandidatureSchema = z.object({
  reason: z.string()
    .max(500, 'La raison du retrait ne peut pas dépasser 500 caractères')
    .optional()
});

export type WithdrawCandidatureFormData = z.infer<typeof WithdrawCandidatureSchema>;

export const CandidatureFiltersSchema = z.object({
  status: z.nativeEnum(CandidatureStatus).optional(),
  service_id: z.number().optional(),
  page: z.number().min(1).default(1),
  per_page: z.number().min(1).max(100).default(20)
});

export type CandidatureFiltersFormData = z.infer<typeof CandidatureFiltersSchema>;

export const AcceptCandidatureSchema = z.object({
  message: z.string().max(1000).optional()
});

export type AcceptCandidatureFormData = z.infer<typeof AcceptCandidatureSchema>;
