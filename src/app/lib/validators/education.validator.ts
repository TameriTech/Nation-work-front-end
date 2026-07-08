import { z } from "zod";

/**
 * Utils
 */
const emptyToUndefined = (val: unknown) => {
  if (typeof val !== "string") return val;
  const trimmed = val.trim();
  return trimmed === "" ? undefined : trimmed;
};

const ISO_DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

const optionalDate = z.preprocess(
  (val) => {
    if (typeof val !== "string") return val;
    const trimmed = val.trim();
    return trimmed === "" ? undefined : trimmed;
  },
  z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format. Use YYYY-MM-DD")
    .optional()
);

const requiredDate = z.preprocess(
  emptyToUndefined,
  z
    .string()
    .min(1, "Start date is required")
    .regex(ISO_DATE_REGEX, "Invalid date format. Use YYYY-MM-DD")
);

/**
 * Validation métier
 */
const validateDates = (data: {
  start_date?: string;
  end_date?: string;
  is_current?: boolean;
}) => {
  const start = data.start_date ? new Date(data.start_date) : null;
  const end = data.end_date ? new Date(data.end_date) : null;

  if (start && isNaN(start.getTime())) return false;
  if (end && isNaN(end.getTime())) return false;

  if (start && end && end < start) return false;
  if (data.is_current && end) return false;

  return true;
};

/**
 * BASE
 */
export const EducationBaseSchema = z.object({
  school: z.string().min(2).max(200),
  degree: z.string().max(200).optional(),
  field_of_study: z.string().max(200).optional(),
  description: z.string().max(1000).optional(),

  start_date: requiredDate,
  end_date: optionalDate,

  is_current: z.boolean().default(false),
  grade: z.string().max(50).optional(),
  activities: z.string().optional(),
  logo_url: z.string().url().optional(),
});

/**
 * CREATE
 */
export const EducationCreateSchema = EducationBaseSchema.refine(validateDates, {
  message:
    "Dates invalides : la date de fin doit être ≥ à la date de début et une formation en cours ne peut pas avoir de date de fin",
  path: ["end_date"],
});

/**
 * UPDATE
 */
export const UpdateEducationSchema = EducationBaseSchema.partial()
  .extend({
    start_date: optionalDate,
    end_date: optionalDate,
  })
  .refine(validateDates, {
    message:
      "Dates invalides : la date de fin doit être ≥ à la date de début et une formation en cours ne peut pas avoir de date de fin",
    path: ["end_date"],
  });

export type CreateEducationFormData = z.infer<typeof EducationCreateSchema>;
export type UpdateEducationFormData = z.infer<typeof UpdateEducationSchema>;
