// lib/validators/skill.validator.ts
import { z } from 'zod';

export const skillSchema = z.object({
  skill_id: z.number()
    .positive("Veuillez sélectionner une compétence"),
  skill_type: z.enum(["primary", "secondary", "other"]).refine((val) => true, {
    message: "Type de compétence invalide"
  }),
  proficiency_level: z.number()
    .min(1, "Le niveau minimum est 1")
    .max(5, "Le niveau maximum est 5"),
});

export type SkillFormData = z.infer<typeof skillSchema>;
