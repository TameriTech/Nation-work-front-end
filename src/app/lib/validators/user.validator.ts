import { z } from 'zod';

// ==================== PROFIL UTILISATEUR ====================
export const profileUpdateSchema = z.object({
  first_name: z.string()
    .max(100, "Prénom trop long")
    .optional()
    .nullable(),
  last_name: z.string()
    .max(100, "Nom trop long")
    .optional()
    .nullable(),
  phone_number: z.string()
    .regex(/^[0-9+\-\s]{8,20}$/, "Numéro de téléphone invalide")
    .optional()
    .nullable(),
  profile_picture: z.string()
    .url("URL de photo invalide")
    .optional()
    .nullable(),
});

// ==================== LOCALISATION ====================
export const locationSchema = z.object({
  address: z.string()
    .max(500, "Adresse trop longue")
    .optional()
    .nullable(),
  quarter: z.string()
    .max(100, "Nom du quartier trop long")
    .optional()
    .nullable(),
  city: z.string()
    .max(100, "Nom de ville trop long")
    .optional()
    .nullable(),
  postal_code: z.string()
    .max(20, "Code postal trop long")
    .regex(/^[0-9]{5}$/, "Code postal invalide (5 chiffres)")
    .optional()
    .nullable(),
  country: z.string()
    .max(100, "Nom de pays trop long")
    .optional()
    .nullable(),
});

// ==================== COMPÉTENCES ====================

export const skillSchema = z.object({
  skill_id: z.number()
    .positive("ID de compétence invalide"),
  skill_type: z.enum(["primary", "secondary", "other"]).refine((val) => true, {
    message: "Type de compétence invalide"
  }),
  proficiency_level: z.number()
    .min(1, "Niveau minimum: 1")
    .max(5, "Niveau maximum: 5"),
});


// ==================== PROFIL FREELANCER (UpdateFreelancerProfileDto) ====================

export const updateFreelancerProfileSchema = z.object({
  study_level: z.string()
    .max(100, "Niveau d'étude trop long")
    .optional()
    .nullable(),
  last_diploma: z.string()
    .max(200, "Nom du diplôme trop long")
    .optional()
    .nullable(),
  primary_skill: z.string()
    .max(100, "Compétence principale trop longue")
    .optional()
    .nullable(),
  secondary_skill: z.string()
    .max(100, "Compétence secondaire trop longue")
    .optional()
    .nullable(),
  other_skills: z.string()
    .max(500, "Trop de compétences (max 500 caractères)")
    .optional()
    .nullable(),
  address: z.string()
    .max(500, "Adresse trop longue")
    .optional()
    .nullable(),
  quarter: z.string()
    .max(100, "Nom du quartier trop long")
    .optional()
    .nullable(),
  city: z.string()
    .max(100, "Nom de ville trop long")
    .optional()
    .nullable(),
  postal_code: z.string()
    .max(20, "Code postal trop long")
    .optional()
    .nullable(),
  country: z.string()
    .max(100, "Nom de pays trop long")
    .optional()
    .nullable(),
  summary: z.string()
    .max(1000, "Le résumé ne doit pas dépasser 1000 caractères")
    .optional()
    .nullable(),
  nationality: z.string()
    .max(100, "Nationalité trop longue")
    .optional()
    .nullable(),
  gender: z.string()
    .max(20, "Genre trop long")
    .optional()
    .nullable(),
  age: z.number()
    .min(18, "Vous devez avoir au moins 18 ans")
    .max(120, "Âge maximum: 120 ans")
    .optional()
    .nullable(),
  years_experience: z.number()
    .min(0, "L'expérience ne peut pas être négative")
    .max(100, "Expérience maximum: 100 ans")
    .optional()
    .nullable(),
  hourly_rate: z.number()
    .min(0, "Le tarif ne peut pas être négatif")
    .max(1000000, "Tarif maximum: 1 000 000 FCFA")
    .optional()
    .nullable(),
  is_available: z.boolean().optional(),
  phone_number: z.string().optional().nullable(),
});

// Schéma de validation pour le modal de suspension
export const suspendSchema = z.object({
  reason: z
    .enum([
      "fraud",
      "harassment",
      "inappropriate_content",
      "spam",
      "multiple_warnings",
      "non_payment",
      "abandoned_services",
      "fake_reviews",
      "terms_violation",
      "other",
    ])
    .refine((val) => true, {
      message: "Raison invalide",
    }),
  reason_text: z
    .string()
    .min(5, "La raison doit contenir au moins 5 caractères"),
  block_until: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Format de date invalide (YYYY-MM-DD)").optional().nullable(),
  notify_user: z.boolean(),
});

// Schéma de validation pour le modal de débloquage
export const unblockSchema = z.object({
  reason: z
    .string()
    .min(5, "La raison doit contenir au moins 5 caractères"),
  notify_user: z.boolean(),
});



// Types exportés
export type UpdateFreelancerProfileFormData = z.infer<typeof updateFreelancerProfileSchema>;
export type ProfileUpdateFormData = z.infer<typeof profileUpdateSchema>;
export type LocationFormData = z.infer<typeof locationSchema>;
export type SkillFormData = z.infer<typeof skillSchema>;
export type SuspendFormData = z.infer<typeof suspendSchema>;
export type UnblockFormData = z.infer<typeof unblockSchema>;
