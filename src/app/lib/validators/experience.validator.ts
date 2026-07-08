import { z } from "zod";
import { EmploymentType, LocationType } from "../../types/enums";

/**
 * Utils
 */

// Transforme "" → undefined
const emptyToUndefined = (val: unknown) => {
  if (typeof val !== "string") return val;
  const trimmed = val.trim();
  return trimmed === "" ? undefined : trimmed;
};

// Regex ISO stricte (YYYY-MM-DD)
const ISO_DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

// Champ date optionnel robuste
const optionalDate = z.preprocess(
  emptyToUndefined,
  z
    .string()
    .regex(ISO_DATE_REGEX, "Invalid date format. Use YYYY-MM-DD")
    .optional()
);

// Champ date requis robuste
const requiredDate = z.preprocess(
  emptyToUndefined,
  z
    .string()
    .min(1, "Start date is required")
    .regex(ISO_DATE_REGEX, "Invalid date format. Use YYYY-MM-DD")
);

/**
 * Validation métier des dates
 */
const validateDates = (data: {
  start_date?: string;
  end_date?: string;
  is_current?: boolean;
}) => {
  const { start_date, end_date, is_current } = data;

  // Si dates présentes → validation réelle
  const start = start_date ? new Date(start_date) : null;
  const end = end_date ? new Date(end_date) : null;

  // Dates invalides (ex: 2024-13-40)
  if (start && isNaN(start.getTime())) return false;
  if (end && isNaN(end.getTime())) return false;

  // Ordre logique
  if (start && end && end < start) return false;

  // Expérience en cours ne doit pas avoir de date de fin
  if (is_current && end) return false;

  return true;
};

/**
 * Base commune
 */
const ExperienceBaseCore = z.object({
  position: z.string().min(2).max(200),

  employment_type: z.nativeEnum(EmploymentType),

  company: z.string().min(2).max(200),
  company_description: z.string().max(1000).optional(),
  company_website: z.string().url().optional(),

  location: z.string().max(200).optional(),

  country: z.string().optional(),
  city: z.string().optional(),

  description: z.string().max(2000).optional(),

  achievements: z.array(z.string()).default([]),
  responsibilities: z.array(z.string()).default([]),
  technologies_used: z.array(z.string()).default([]),

  is_current: z.boolean().default(false),
  is_public: z.boolean().default(true),
});

/**
 * CREATE
 * start_date requis
 */
export const ProfessionalExperienceSchema = ExperienceBaseCore.extend({
  start_date: requiredDate,
  end_date: optionalDate,
}).refine(validateDates, {
  message:
    "Dates invalides : la date de fin doit être ≥ à la date de début et une expérience en cours ne peut pas avoir de date de fin",
  path: ["end_date"],
});

/**
 * UPDATE
 * tout optionnel
 */
export const UpdateExperienceSchema = ExperienceBaseCore.partial()
  .extend({
    start_date: optionalDate,
    end_date: optionalDate,
  })
  .refine(validateDates, {
    message:
      "Dates invalides : la date de fin doit être ≥ à la date de début et une expérience en cours ne peut pas avoir de date de fin",
    path: ["end_date"],
  });

/**
 * TYPES
 */
export type CreateExperienceFormData = z.infer<
  typeof ProfessionalExperienceSchema
>;

export type UpdateExperienceFormData = z.infer<
  typeof UpdateExperienceSchema
>;
