// src/app/lib/validators/user.validator.ts
import { z } from 'zod';
import { BlockReason, UserRole, EmploymentType, LocationType } from '../../types/enums';

export const LocationInfoSchema = z.object({
  address: z.string().optional().nullable(),
  quarter: z.string().optional().nullable(),
  city: z.string().optional().nullable(),
  postal_code: z.string().optional().nullable(),
  country: z.string().optional().nullable(),
  state_province: z.string().optional().nullable(),
  latitude: z.number().optional().nullable(),
  longitude: z.number().optional().nullable(),
});

export type LocationInfoFormData = z.infer<typeof LocationInfoSchema>;

export const SocialLinksSchema = z.object({
  website: z.string().url().optional(),
  linkedin: z.string().url().optional(),
  twitter: z.string().url().optional(),
  github: z.string().url().optional(),
  behance: z.string().url().optional(),
  dribbble: z.string().url().optional()
});

export type SocialLinksFormData = z.infer<typeof SocialLinksSchema>;

// ─── Schéma Zod ───────────────────────────────────────────────────────────────

const languageSchema = z.object({
  language: z.string().min(1, "Langue requise"),
  level: z.enum(["basic", "conversational", "fluent", "native"]),
});

export const providerProfileUpdateSchema = z.object({
  professional_title: z
    .string()
    .min(2, "Le titre doit contenir au moins 2 caractères")
    .max(100, "Le titre ne peut pas dépasser 100 caractères"),
  professional_summary: z
    .string()
    .max(2000, "Le résumé ne peut pas dépasser 2000 caractères")
    .optional()
    .or(z.literal("")),
  tagline: z
    .string()
    .max(150, "La tagline ne peut pas dépasser 150 caractères")
    .optional()
    .or(z.literal("")),
  hourly_rate: z
    .number({ error: "Veuillez entrer un nombre valide" })
    .min(0, "Le tarif ne peut pas être négatif")
    .max(10000, "Tarif trop élevé"),
  languages: z
    .array(languageSchema)
    .min(1, "Ajoutez au moins une langue"),
  is_available: z.boolean(),
  willing_to_relocate: z.boolean(),
  first_name: z
    .string()
    .min(1, "Le prénom est requis")
    .max(50, "Le prénom ne peut pas dépasser 50 caractères"),
  last_name: z
    .string()
    .min(1, "Le nom est requis")
    .max(50, "Le nom ne peut pas dépasser 50 caractères"),
  bio: z
    .string()
    .max(1000, "La bio ne peut pas dépasser 1000 caractères")
    .optional()
    .or(z.literal("")),
  phone_number: z
    .string()
    .regex(/^(\+?\d{7,15})?$/, "Numéro de téléphone invalide")
    .optional()
    .or(z.literal("")),
  date_of_birth: z
    .preprocess(
      (val) => {
        if (!val || val === "") return undefined;
        return new Date(val as string).toISOString();
      },
      z.string().datetime().optional()
    ),
  city: z
    .string()
    .max(100, "La ville ne peut pas dépasser 100 caractères")
    .optional()
    .or(z.literal("")),
  country: z
    .string()
    .max(100, "Le pays ne peut pas dépasser 100 caractères")
    .optional()
    .or(z.literal("")),
});

export type providerProfileUpdateFormData = z.infer<typeof providerProfileUpdateSchema>;


export const BlockUserSchema = z.object({

  reason: z.nativeEnum(BlockReason),

  reason_text: z.string().max(500).optional(),

  block_until: z.preprocess(
    (val) => {
      if (!val || val === "") return undefined;
      return new Date(val as string).toISOString();
    },
    z.string().datetime().optional()
  ),

  notify_user: z.boolean().default(true),
});

export type BlockUserFormData = z.infer<typeof BlockUserSchema>;

export const UnblockUserSchema = z.object({
  reason: z.string().max(500),
  notify_user: z.boolean().optional().default(true)
});

export type UnblockFormData = z.infer<typeof UnblockUserSchema>;

export const UserRoleUpdateSchema = z.object({
  user_id: z.number(),
  role: z.nativeEnum(UserRole),
  reason: z.string().max(500).optional()
});

export type UserRoleUpdateFormData = z.infer<typeof UserRoleUpdateSchema>;

export const SendEmailSchema = z.object({
  subject: z.string().min(1).max(255),
  message: z.string().min(1).max(5000)
});

export type SendEmailFormData = z.infer<typeof SendEmailSchema>;

export const UserFiltersSchema = z.object({
  role: z.string().optional(),
  is_active: z.boolean().optional(),
  skip: z.number().min(0).optional(),
  limit: z.number().min(1).max(1000).optional(),
  search: z.string().optional(),
  status: z.enum(['active', 'blocked', 'deleted']).optional(),
  sort_by: z.string().optional(),
  sort_order: z.enum(['asc', 'desc']).optional()
});

export type UserFiltersFormData = z.infer<typeof UserFiltersSchema>;

export const ExportUsersSchema = z.object({
  format: z.enum(['pdf', 'excel', 'csv', 'json']).default('csv')
});

export type ExportUsersFormData = z.infer<typeof ExportUsersSchema>;
