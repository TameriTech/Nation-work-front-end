import { z } from 'zod';

// ==================== EXPÉRIENCE PROFESSIONNELLE ====================

export const createExperienceSchema = z.object({
  position: z.string()
    .min(2, "L'intitulé du poste est requis")
    .max(200, "Intitulé trop long"),
  company: z.string()
    .min(2, "Le nom de l'entreprise est requis")
    .max(200, "Nom de l'entreprise trop long"),
  description: z.string()
    .max(1000, "La description ne doit pas dépasser 1000 caractères")
    .optional()
    .nullable(),
  start_date: z.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Format de date invalide (YYYY-MM-DD)"),
  end_date: z.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Format de date invalide (YYYY-MM-DD)")
    .optional()
    .nullable(),
  is_current: z.boolean(),
  location: z.string()
    .max(200, "Localisation trop longue")
    .optional()
    .nullable(),
}).refine((data) => {
  if (!data.is_current && !data.end_date) {
    return false;
  }
  return true;
}, {
  message: "La date de fin est requise si l'expérience n'est pas en cours",
  path: ["end_date"],
}).refine((data) => {
  if (data.end_date && new Date(data.start_date) > new Date(data.end_date)) {
    return false;
  }
  return true;
}, {
  message: "La date de fin doit être postérieure à la date de début",
  path: ["end_date"],
});

export const updateExperienceSchema = z.object({
  position: z.string()
    .max(200, "Intitulé trop long")
    .optional(),
  company: z.string()
    .max(200, "Nom de l'entreprise trop long")
    .optional(),
  description: z.string()
    .max(1000, "La description ne doit pas dépasser 1000 caractères")
    .optional()
    .nullable(),
  start_date: z.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Format de date invalide (YYYY-MM-DD)")
    .optional(),
  end_date: z.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Format de date invalide (YYYY-MM-DD)")
    .optional()
    .nullable(),
  is_current: z.boolean().optional(),
  location: z.string()
    .max(200, "Localisation trop longue")
    .optional()
    .nullable(),
}).refine((data) => {
  // Si is_current est false et end_date n'est pas fourni, c'est une erreur
  if (data.is_current === false && !data.end_date) {
    return false;
  }
  return true;
}, {
  message: "La date de fin est requise si l'expérience n'est pas en cours",
  path: ["end_date"],
}).refine((data) => {
  if (data.start_date && data.end_date && new Date(data.start_date) > new Date(data.end_date)) {
    return false;
  }
  return true;
}, {
  message: "La date de fin doit être postérieure à la date de début",
  path: ["end_date"],
});

// ==================== FORMATION ====================

export const createEducationSchema = z.object({
  school: z.string()
    .min(2, "Le nom de l'établissement est requis")
    .max(200, "Nom de l'établissement trop long"),
  degree: z.string()
    .max(200, "Intitulé du diplôme trop long")
    .optional()
    .nullable(),
  field_of_study: z.string()
    .max(200, "Domaine d'étude trop long")
    .optional()
    .nullable(),
  description: z.string()
    .max(1000, "La description ne doit pas dépasser 1000 caractères")
    .optional()
    .nullable(),
  start_date: z.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Format de date invalide (YYYY-MM-DD)"),
  end_date: z.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Format de date invalide (YYYY-MM-DD)")
    .optional()
    .nullable(),
  is_current: z.boolean(),
  grade: z.string()
    .max(50, "Mention trop longue")
    .optional()
    .nullable(),
}).refine((data) => {
  if (!data.is_current && !data.end_date) {
    return false;
  }
  return true;
}, {
  message: "La date de fin est requise si la formation n'est pas en cours",
  path: ["end_date"],
}).refine((data) => {
  if (data.end_date && new Date(data.start_date) > new Date(data.end_date)) {
    return false;
  }
  return true;
}, {
  message: "La date de fin doit être postérieure à la date de début",
  path: ["end_date"],
});

export const updateEducationSchema = z.object({
  school: z.string()
    .max(200, "Nom de l'établissement trop long")
    .optional(),
  degree: z.string()
    .max(200, "Intitulé du diplôme trop long")
    .optional()
    .nullable(),
  field_of_study: z.string()
    .max(200, "Domaine d'étude trop long")
    .optional()
    .nullable(),
  description: z.string()
    .max(1000, "La description ne doit pas dépasser 1000 caractères")
    .optional()
    .nullable(),
  start_date: z.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Format de date invalide (YYYY-MM-DD)")
    .optional(),
  end_date: z.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Format de date invalide (YYYY-MM-DD)")
    .optional()
    .nullable(),
  is_current: z.boolean().optional(),
  grade: z.string()
    .max(50, "Mention trop longue")
    .optional()
    .nullable(),
}).refine((data) => {
  if (data.is_current === false && !data.end_date) {
    return false;
  }
  return true;
}, {
  message: "La date de fin est requise si la formation n'est pas en cours",
  path: ["end_date"],
}).refine((data) => {
  if (data.start_date && data.end_date && new Date(data.start_date) > new Date(data.end_date)) {
    return false;
  }
  return true;
}, {
  message: "La date de fin doit être postérieure à la date de début",
  path: ["end_date"],
});

// Types exportés
export type CreateExperienceFormData = z.infer<typeof createExperienceSchema>;
export type UpdateExperienceFormData = z.infer<typeof updateExperienceSchema>;
export type CreateEducationFormData = z.infer<typeof createEducationSchema>;
export type UpdateEducationFormData = z.infer<typeof updateEducationSchema>;
