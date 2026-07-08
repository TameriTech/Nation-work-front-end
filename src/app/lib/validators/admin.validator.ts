// src/app/lib/validators/admin.validator.ts
import { z } from 'zod';
import { UserRole, BlockReason } from '../../types/enums';

export const AdminUserCreateSchema = z.object({
  email: z.string().email('Email invalide'),
  username: z.string()
    .min(3, 'Le nom d\'utilisateur doit contenir au moins 3 caractères')
    .max(50, 'Le nom d\'utilisateur ne peut pas dépasser 50 caractères')
    .regex(/^[a-zA-Z0-9_]+$/, 'Le nom d\'utilisateur ne peut contenir que des lettres, chiffres et underscores'),
  password: z.string().min(8, 'Le mot de passe doit contenir au moins 8 caractères'),
  role: z.nativeEnum(UserRole),
  first_name: z.string().min(2).max(50).optional(),
  last_name: z.string().min(2).max(50).optional(),
  phone_number: z.string().regex(/^[0-9+\-\s]{8,20}$/).optional(),
  category_ids: z.array(z.number()).max(5).optional(),
  permissions: z.array(z.string()).optional(),
  notes: z.string().max(500).optional()
});

export type AdminUserCreateFormData = z.infer<typeof AdminUserCreateSchema>;

export const SuspendUserSchema = z.object({
  reason: z.nativeEnum(BlockReason),
  reason_text: z.string().max(500).optional(),
  block_until: z.string().datetime().optional(),
  notify_user: z.boolean().optional().default(true)
});

export type SuspendFormData = z.infer<typeof SuspendUserSchema>;