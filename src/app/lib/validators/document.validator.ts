// src/app/lib/validators/document.validator.ts
import { z } from 'zod';
import { DocumentType, DocumentStatus } from '../../types/enums';

export const CreateDocumentSchema = z.object({
  document_type: z.nativeEnum(DocumentType),
  document_number: z.string().max(100).optional(),
  file: z.instanceof(File).refine(
    (file) => {
      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
      return allowedTypes.includes(file.type);
    },
    { message: 'Le fichier doit être une image (JPEG, PNG) ou un PDF' }
  ).refine(
    (file) => file.size <= 10 * 1024 * 1024,
    { message: 'Le fichier ne doit pas dépasser 10 MB' }
  ),
  issue_date: z.string().optional(),
  expiry_date: z.string().optional(),
  issuing_country: z.string().max(100).optional()
});

export type CreateDocumentFormData = z.infer<typeof CreateDocumentSchema>;

export const UpdateDocumentMetadataSchema = z.object({
  document_number: z.string().max(100).optional(),
  issue_date: z.string().datetime().optional(),
  expiry_date: z.string().datetime().optional(),
  issuing_country: z.string().max(100).optional(),
  notes: z.string().max(500).optional()
});

export type UpdateDocumentMetadataFormData = z.infer<typeof UpdateDocumentMetadataSchema>;

export const ValidateDocumentSchema = z.object({
  is_valid: z.boolean(),
  reason: z.string().max(500).optional()
});

export type ValidateDocumentFormData = z.infer<typeof ValidateDocumentSchema>;

export const RejectDocumentSchema = z.object({
  reason: z.string().max(500)
});

export type RejectDocumentFormData = z.infer<typeof RejectDocumentSchema>;

export const UpdateDocumentStatusSchema = z.object({
  status: z.nativeEnum(DocumentStatus),
  rejection_reason: z.string().max(500).optional(),
  rejection_details: z.record(z.string(), z.any()).optional(),
  notes: z.string().max(500).optional(),
  expiry_date: z.string().datetime().optional(),
  verification_level: z.string().optional()
});

export type UpdateDocumentStatusFormData = z.infer<typeof UpdateDocumentStatusSchema>;

export const DocumentFiltersSchema = z.object({
  status: z.nativeEnum(DocumentStatus).optional(),
  document_type: z.nativeEnum(DocumentType).optional(),
  provider_id: z.number().optional(),
  from_date: z.string().datetime().optional(),
  to_date: z.string().datetime().optional(),
  skip: z.number().min(0).default(0),
  limit: z.number().min(1).max(100).default(50)
});

export type DocumentFiltersFormData = z.infer<typeof DocumentFiltersSchema>;
