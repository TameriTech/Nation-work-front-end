import { z } from 'zod';

// ==================== MESSAGE ====================

export const messageSchema = z.object({
  content: z.string()
    .max(2000, "Le message ne doit pas dépasser 2000 caractères")
    .optional()
    .nullable(),
  media: z.instanceof(File)
    .refine((file) => file.size <= 10 * 1024 * 1024, "Le fichier ne doit pas dépasser 10MB")
    .refine((file) => {
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'];
      return allowedTypes.includes(file.type);
    }, "Type de fichier non autorisé")
    .optional()
    .nullable(),
}).refine((data) => data.content || data.media, {
  message: "Vous devez fournir un message ou un fichier",
});

// Types exportés
export type MessageFormData = z.infer<typeof messageSchema>;
