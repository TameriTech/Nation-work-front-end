// src/app/lib/validators/skill.validator.ts
import { z } from 'zod';
import { SkillLevel, SkillType } from '../../types/enums';

export const SkillCreateSchema = z.object({
  name: z.string().min(2).max(100),
  slug: z.string().regex(/^[a-z0-9-]+$/).optional(),
  description: z.string().max(500).optional(),
  category: z.string().max(50).optional(),
  type: z.nativeEnum(SkillType).default(SkillType.TECHNICAL),
  subcategory: z.string().max(50).optional(),
  parent_id: z.number().optional(),
  aliases: z.array(z.string()).default([]),
  keywords: z.array(z.string()).default([]),
  //icon_url: z.string().url().optional()
});

export type SkillCreateFormData = z.infer<typeof SkillCreateSchema>;

export const SkillUpdateSchema = SkillCreateSchema.partial();

export type SkillUpdateFormData = z.infer<typeof SkillUpdateSchema>;

export const providerSkillCreateSchema = z.object({
  skill_id: z.number(),
  skill_type: z.enum(['primary', 'secondary', 'other']),
  proficiency_level: z.number().min(1).max(5),
  years_experience: z.number().min(0).optional()
});

export type providerSkillCreateFormData = z.infer<typeof providerSkillCreateSchema>;

export const providerSkillUpdateSchema = z.object({
  skill_id: z.number().optional(),
  skill_type: z.enum(['primary', 'secondary', 'other']).optional(),
  proficiency_level: z.number().min(1).max(5).optional(),
  years_experience: z.number().min(0).optional()
});

export type providerSkillUpdateFormData = z.infer<typeof providerSkillUpdateSchema>;
