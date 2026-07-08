// src/app/lib/validators/auth.validator.ts
import { z } from 'zod';
import { UserRole } from '../../types/enums';


//========================== Schéma pour l'inscription ================================
export const SignUpSchema = z.object({
  first_name: z.string()
    .min(2, "Le prénom doit contenir au moins 2 caractères")
    .max(50, "Le prénom ne peut pas dépasser 50 caractères")
    .regex(/^[a-zA-ZÀ-ÿ\s\-']+$/, "Le prénom contient des caractères invalides"),
  
  last_name: z.string()
    .min(2, "Le nom doit contenir au moins 2 caractères")
    .max(50, "Le nom ne peut pas dépasser 50 caractères")
    .regex(/^[a-zA-ZÀ-ÿ\s\-']+$/, "Le nom contient des caractères invalides"),
  
  email: z.string()
    .email("Email invalide")
    .min(1, "L'email est requis")
    .max(255, "L'email est trop long")
    .regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "Format d'email invalide"),
  
  password: z.string()
    .min(8, "Le mot de passe doit contenir au moins 8 caractères")
    .regex(/[A-Z]/, "Le mot de passe doit contenir au moins une majuscule")
    .regex(/[a-z]/, "Le mot de passe doit contenir au moins une minuscule")
    .regex(/[0-9]/, "Le mot de passe doit contenir au moins un chiffre")
    .regex(/[^A-Za-z0-9]/, "Le mot de passe doit contenir au moins un caractère spécial")
    .max(255, "Le mot de passe est trop long"),
  
  phone: z.string()
    .regex(/^[0-9+\-\s]{8,20}$/, "Numéro de téléphone invalide")
    .optional()
    .nullable(),
  
  country: z.string()
    .min(1, "Veuillez sélectionner un pays")
    .max(2, "Code pays invalide"),
  
  role: z.enum([UserRole.CLIENT, UserRole.PROVIDER]),
  
  // Consentements
  accepted_terms: z.boolean()
    .refine(val => val === true, {
      message: "Vous devez accepter les conditions générales d'utilisation"
    }),
  
  accepted_privacy: z.boolean()
    .refine(val => val === true, {
      message: "Vous devez accepter la politique de confidentialité"
    }),
  
  accepts_newsletter: z.boolean()
    .default(true)
    .optional(),
});

// Schéma pour la vérification OTP
export const VerifyOtpSchema = z.object({
  email: z.string()
    .email("Email invalide")
    .min(1, "L'email est requis"),
  
  code: z.string()
    .length(6, "Le code doit contenir exactement 6 chiffres")
    .regex(/^\d{6}$/, "Le code doit contenir uniquement des chiffres"),
});

// Schéma pour renvoyer l'OTP
export const ResendOtpSchema = z.object({
  email: z.string()
    .email("Email invalide")
    .min(1, "L'email est requis"),
});

// Type inference
export type SignUpFormData = z.infer<typeof SignUpSchema>;
export type VerifyOtpFormData = z.infer<typeof VerifyOtpSchema>;
export type ResendOtpFormData = z.infer<typeof ResendOtpSchema>;


//========================== Schéma pour la connexion ================================
export const LoginSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(1, 'Le mot de passe est requis'),
  remember_me: z.boolean().default(false)
});

export type LoginFormData = z.infer<typeof LoginSchema>;



//========================== Schéma pour la demande de réinitialisation de mot de passe ================================

/**
 * Schéma pour la demande de réinitialisation de mot de passe
 */
export const ForgotPasswordSchema = z.object({
  email: z.string()
    .email("Email invalide")
    .min(1, "L'email est requis")
    .max(255, "L'email est trop long"),
});

/**
 * Schéma pour la vérification du token de réinitialisation
 */
export const VerifyResetTokenSchema = z.object({
  email: z.string()
    .email("Email invalide")
    .min(1, "L'email est requis"),
  token: z.string()
    .min(1, "Le token est requis"),
});

/**
 * Schéma pour la réinitialisation complète du mot de passe
 */
export const ResetPasswordSchema = z.object({
  email: z.string()
    .email("Email invalide")
    .min(1, "L'email est requis"),
  token: z.string()
    .min(1, "Le token est requis"),
  password: z.string()
    .min(8, "Le mot de passe doit contenir au moins 8 caractères")
    .regex(/[A-Z]/, "Le mot de passe doit contenir au moins une majuscule")
    .regex(/[a-z]/, "Le mot de passe doit contenir au moins une minuscule")
    .regex(/[0-9]/, "Le mot de passe doit contenir au moins un chiffre")
    .regex(/[^A-Za-z0-9]/, "Le mot de passe doit contenir au moins un caractère spécial"),
  password_confirmation: z.string()
    .min(1, "La confirmation du mot de passe est requise"),
}).refine((data) => data.password === data.password_confirmation, {
  message: "Les mots de passe ne correspondent pas",
  path: ["password_confirmation"],
});

// Types
export type ForgotPasswordFormData = z.infer<typeof ForgotPasswordSchema>;
export type VerifyResetTokenFormData = z.infer<typeof VerifyResetTokenSchema>;
export type ResetPasswordFormData = z.infer<typeof ResetPasswordSchema>;





//========================== Schéma pour le changement de mot de passe ================================
export const ChangePasswordSchema = z.object({
  current_password: z.string().min(1, 'Le mot de passe actuel est requis'),
  new_password: z.string().min(8, 'Le nouveau mot de passe doit contenir au moins 8 caractères'),
  confirm_password: z.string()
}).refine(data => data.new_password === data.confirm_password, {
  message: 'Les mots de passe ne correspondent pas',
  path: ['confirm_password']
});

export type ChangePasswordFormData = z.infer<typeof ChangePasswordSchema>;

//========================== Schéma pour le changement d'email ================================
export const EmailChangeSchema = z.object({
  current_email: z.string().email('Email actuel invalide'),
  new_email: z.string().email('Nouvel email invalide')
});

export type EmailChangeFormData = z.infer<typeof EmailChangeSchema>;

export const EmailChangeVerifySchema = z.object({
  otp: z.string().length(6, 'Le code OTP doit contenir 6 caractères')
});

export type EmailChangeVerifyFormData = z.infer<typeof EmailChangeVerifySchema>;

//========================== Schéma pour la mise à jour du profil ================================
export const ProfileUpdateSchema = z.object({
  username: z.string().min(3).max(50).optional(),
  first_name: z.string().min(2).max(50).optional(),
  last_name: z.string().min(2).max(50).optional(),
  phone_number: z.string().regex(/^[0-9+\-\s]{8,20}$/).optional(),
  profile_picture: z.string().url().optional(),
  language: z.string().length(2).optional(),
  timezone: z.string().optional(),
  currency: z.string().length(3).optional(),
  notification_preferences: z.record(z.string(), z.boolean()).optional(),
  social_links: z.object({
    website: z.string().url().optional(),
    linkedin: z.string().url().optional(),
    twitter: z.string().url().optional(),
    github: z.string().url().optional(),
    behance: z.string().url().optional(),
    dribbble: z.string().url().optional()
  }).optional()
});

export type ProfileUpdateFormData = z.infer<typeof ProfileUpdateSchema>;
