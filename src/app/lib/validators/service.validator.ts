import { z } from 'zod';

// ==================== SERVICE ====================

export const createServiceSchema = z.object({
  title: z.string()
    .min(5, "Le titre doit contenir au moins 5 caractères")
    .max(255, "Le titre ne doit pas dépasser 255 caractères"),
  short_description: z.string()
    .max(500, "La description courte ne doit pas dépasser 500 caractères"),
  full_description: z.string()
    .max(5000, "La description complète ne doit pas dépasser 5000 caractères")
    .optional()
    .nullable(),
  service_type: z.enum(["standard", "premium", "candidature", "direct"]).refine((val) => true, {
    message: "Type de service invalide"
  }),
  category_id: z.number()
    .positive("Catégorie requise")
    .optional()
    .nullable(),
  
  // Détails pratiques
  date_pratique: z.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Format de date invalide (YYYY-MM-DD)")
    .refine((date) => new Date(date) > new Date(), {
      message: "La date doit être dans le futur"
    }),
  start_time: z.string()
    .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Format d'heure invalide (HH:MM)"),
  duration: z.string()
    .regex(/^[0-9]+h?(\+)?$/, "Format de durée invalide (ex: 1h, 2h, 3h+)"),
  
  // Localisation
  address: z.string()
    .min(5, "L'adresse est requise")
    .max(500, "Adresse trop longue"),
  quarter: z.string()
    .max(100, "Nom du quartier trop long")
    .optional()
    .nullable(),
  city: z.string()
    .min(2, "La ville est requise")
    .max(100, "Nom de ville trop long"),
  postal_code: z.string()
    .max(20, "Code postal trop long")
    .optional()
    .nullable(),
  country: z.string()
    .min(2, "Le pays est requis")
    .max(100, "Nom de pays trop long"),
  
  // Coordonnées (optionnelles)
  latitude: z.number()
    .min(-90, "Latitude invalide")
    .max(90, "Latitude invalide")
    .optional()
    .nullable(),
  longitude: z.number()
    .min(-180, "Longitude invalide")
    .max(180, "Longitude invalide")
    .optional()
    .nullable(),
  
  // Compétences requises
  required_skills: z.array(z.string())
    .max(20, "Maximum 20 compétences")
    .optional()
    .nullable(),
  
  // Paiement
  proposed_amount: z.number()
    .min(1000, "Le montant minimum est de 1000 FCFA")
    .max(10000000, "Le montant maximum est de 10 000 000 FCFA"),
  accepted_amount: z.number()
    .min(0, "Le montant ne peut pas être négatif")
    .max(10000000, "Le montant maximum est de 10 000 000 FCFA")
    .optional()
    .nullable(),
  
  status: z.enum(["published", "assigned", "in_progress", "completed", "canceled"])
    .optional(),
  images: z.array(z.string())
    .optional()
    .nullable(),
});

export const serviceFiltersSchema = z.object({
  search: z.string().optional(),
  category_id: z.number().optional(),
  min_price: z.number().min(0).optional(),
  max_price: z.number().min(0).optional(),
  location: z.string().optional(),
  status: z.enum(["published", "assigned", "in_progress", "completed", "canceled"]).optional(),
  page: z.number().min(1).optional(),
  limit: z.number().min(1).max(100).optional(),
});


// Types exportés
export type ServiceFiltersFormData = z.infer<typeof serviceFiltersSchema>;
export type CreateServiceFormData = z.infer<typeof createServiceSchema>;
