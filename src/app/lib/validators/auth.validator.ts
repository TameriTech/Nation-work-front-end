import { z } from 'zod';

// ==================== AUTHENTIFICATION ====================

export const loginSchema = z.object({
  email: z.string()
    .email("Email invalide")
    .min(5, "Email trop court")
    .max(255, "Email trop long"),
  password: z.string()
    .min(8, "Le mot de passe doit contenir au moins 8 caractères")
    .max(100, "Mot de passe trop long"),
});

export const signUpSchema = z.object({
  email: z.string()
    .email("Email invalide")
    .min(5, "Email trop court")
    .max(255, "Email trop long"),
  username: z.string()
    .min(3, "Le nom d'utilisateur doit contenir au moins 3 caractères")
    .max(50, "Nom d'utilisateur trop long")
    .regex(/^[a-zA-Z0-9_]+$/, "Seuls les lettres, chiffres et underscores sont autorisés"),
  password: z.string()
    .min(8, "Le mot de passe doit contenir au moins 8 caractères")
    .max(100, "Mot de passe trop long")
    .regex(/[A-Z]/, "Doit contenir au moins une majuscule")
    .regex(/[a-z]/, "Doit contenir au moins une minuscule")
    .regex(/[0-9]/, "Doit contenir au moins un chiffre"),
  confirmPassword: z.string(),
  role: z.enum(["client", "freelancer"]).refine((val) => true, {
    message: "Rôle invalide"
  }),
  phone_number: z.string()
    .regex(/^[0-9+\-\s]{8,20}$/, "Numéro de téléphone invalide")
    .optional()
    .nullable(),
  category_ids: z.array(z.number())
    .max(5, "Maximum 5 catégories")
    .optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Les mots de passe ne correspondent pas",
  path: ["confirmPassword"],
});

export const changePasswordSchema = z.object({
  current_password: z.string()
    .min(1, "Le mot de passe actuel est requis"),
  new_password: z.string()
    .min(8, "Le nouveau mot de passe doit contenir au moins 8 caractères")
    .max(100, "Mot de passe trop long")
    .regex(/[A-Z]/, "Doit contenir au moins une majuscule")
    .regex(/[a-z]/, "Doit contenir au moins une minuscule")
    .regex(/[0-9]/, "Doit contenir au moins un chiffre"),
  confirm_password: z.string(),
}).refine((data) => data.new_password === data.confirm_password, {
  message: "Les mots de passe ne correspondent pas",
  path: ["confirm_password"],
});

export const forgotPasswordSchema = z.object({
  email: z.string()
    .email("Email invalide")
    .min(5, "Email trop court"),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1, "Token requis"),
  new_password: z.string()
    .min(8, "Le mot de passe doit contenir au moins 8 caractères")
    .max(100, "Mot de passe trop long")
    .regex(/[A-Z]/, "Doit contenir au moins une majuscule")
    .regex(/[a-z]/, "Doit contenir au moins une minuscule")
    .regex(/[0-9]/, "Doit contenir au moins un chiffre"),
  confirm_password: z.string(),
}).refine((data) => data.new_password === data.confirm_password, {
  message: "Les mots de passe ne correspondent pas",
  path: ["confirm_password"],
});

// Types exportés
export type LoginFormData = z.infer<typeof loginSchema>;
export type SignUpFormData = z.infer<typeof signUpSchema>;
export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
