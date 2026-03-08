import { z } from 'zod';

// ==================== DOCUMENT KYC ====================

// Validation pour les fichiers
const fileSchema = z.instanceof(File)
  .refine((file) => file.size <= 10 * 1024 * 1024, "Le fichier ne doit pas dépasser 10MB")
  .refine((file) => {
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
    return allowedTypes.includes(file.type);
  }, "Type de fichier non autorisé. Formats acceptés: PDF, JPEG, PNG");

// lib/validators/document.validator.ts
import { DocumentType } from '@/app/types';

export const createDocumentSchema = z.object({
  document_type: z.nativeEnum(DocumentType), // ✅ Utilise l'enum directement
  file: fileSchema,
  document_number: z.string()
    .max(100, "Numéro de document trop long")
    .optional()
    .nullable(),
  issue_date: z.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Format de date invalide (YYYY-MM-DD)")
    .optional()
    .nullable(),
  expiry_date: z.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Format de date invalide (YYYY-MM-DD)")
    .optional()
    .nullable(),
  issuing_country: z.string()
    .max(100, "Nom du pays trop long")
    .optional()
    .nullable(),
});


export const updateDocumentSchema = z.object({
  document_type: z.enum([
    "id_card", 
    "passport", 
    "driver_license", 
    "diploma", 
    "certificate", 
    "professional_card", 
    "residence_permit", 
    "other"
  ]).refine((val) => true, {
    message: "Type de document invalide"
  }).optional(),
  file: fileSchema.optional().nullable(),
  document_number: z.string()
    .max(100, "Numéro de document trop long")
    .optional()
    .nullable(),
  front_image: fileSchema.optional().nullable(),
  back_image: fileSchema.optional().nullable(),
  issue_date: z.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Format de date invalide (YYYY-MM-DD)")
    .optional()
    .nullable(),
  expiry_date: z.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Format de date invalide (YYYY-MM-DD)")
    .optional()
    .nullable(),
  issuing_country: z.string()
    .max(100, "Nom du pays trop long")
    .optional()
    .nullable(),
});

// Types exportés
export type CreateDocumentFormData = z.infer<typeof createDocumentSchema>;
export type UpdateDocumentFormData = z.infer<typeof updateDocumentSchema>;
