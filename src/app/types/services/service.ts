import { z } from "zod";
import { User } from "../auth/user";
import { Category } from "../categories";
import { Freelancer } from "../users";
import { Candidature } from "./candidature";

// ============================================================================
// TYPES POUR LES SERVICES
// ============================================================================

export type ServiceStatus = 
  | "published" 
  | "assigned" 
  | "in_progress" 
  | "completed" 
  | "cancelled" 
  | "disputed";

export type ServiceType = 'standard' | 'premium' | 'candidature' | 'direct';

export type EventStatus = "completed" | "published" | "upcoming" | "assigned";

export interface UserBasicInfo {
  id: number;
  name: string;
  avatar?: string;
  email?: string;
  phone?: string;
}

export interface CategoryInfo {
  id: number;
  name: string;
  icon?: string;
  color?: string;
}

export interface RatingInfo {
  score: number;
  comment?: string;
  created_at: string;
}

export interface DisputeInfo {
  id: number;
  reason: string;
  opened_by: string;
  opened_at: string;
  status: string;
}

export interface ServiceImage {
  id: number;
  service_id: number;
  image_url: string;
  is_primary: boolean;
  created_at: string;
  service?: Service;
}

export interface Service {
  id: number;
  title: string;
  short_description: string;
  full_description?: string;
  service_type: ServiceType;
  category_id?: number;
  category?: Category;
  date_pratique: string;
  start_time: string;
  duration: string;
  address: string;
  quarter?: string;
  city: string;
  postal_code?: string;
  country?: string;
  latitude?: number;
  longitude?: number;
  required_skills: string[];
  proposed_amount: number;
  accepted_amount?: number;
  status: ServiceStatus;
  client_id: number;
  assigned_freelancer_id?: number;
  client: User;
  freelancer?: Freelancer;
  service_images?: ServiceImage[];
  is_favorite?: boolean;
  candidatures_count: number;
  candidatures: Candidature[];
  ratings?: RatingInfo[];
  rating: number;
  dispute?: DisputeInfo;
  views_count: number;
  created_at: string;
  updated_at?: string;
  completed_at?: string;
  cancelled_at?: string;
  assigned_at?: string;
  started_at?: string;
  cancellation_reason?: string;
  reviews_count?: number;
  priority?: "normal" | "high";
}


export interface ServiceHistory extends Service {

}

export interface ServiceFilters {
  search?: string;
  category_id?: number;
  min_price?: number;
  max_price?: number;
  city?: string;
  quarter?: string;
  country?: string;
  latitude?: number;
  longitude?: number;
  radius_km?: number;
  date_pratique?: string;
  date_from?: string;
  date_to?: string;
  start_time_from?: string;
  start_time_to?: string;
  duration?: string[];
  skills?: string[];
  service_types?: ServiceType[];
  status?: ServiceStatus[];
  page?: number;
  per_page?: number;
  sort_by?: 'date' | 'price' | 'rating';
  sort_order?: 'asc' | 'desc';
}

export interface ServiceStats {
  total: number;
  by_status: Record<string, number>;
  by_category: Record<string, number>;
  average_budget: number;
  completion_rate: number;
  total_revenue: number;
  platform_fees: number;
}

export interface CreateServiceDto {
  title: string;
  short_description: string;
  full_description?: string;
  service_type: ServiceType;
  category_id?: number;
  date_pratique: string;
  start_time: string;
  duration: string;
  address: string;
  quarter?: string;
  city: string;
  postal_code?: string;
  country?: string;
  latitude?: number;
  longitude?: number;
  required_skills?: string[];
  proposed_amount: number;
  accepted_amount?: number;
  status?: ServiceStatus;
  images?: string[];
}

// Schéma Zod pour la validation
export const serviceSchema = z.object({
  title: z.string().min(1, "Le titre est requis"),
  category: z.string().min(1, "Le type de service est requis"),
  shortDescription: z.string().max(250, "Maximum 250 caractères"),
  date: z.string().min(1, "La date est requise"),
  time: z.string().min(1, "L'heure est requise"),
  duration: z.string().min(1, "La durée est requise"),
  address: z.string().min(1, "L'adresse est requise"),
  skills: z.array(z.string()),
  proposedAmount: z.number().min(0, "Le montant doit être positif"),
  amountToPay: z.number().min(0, "Le montant doit être positif"),
  fullDescription: z.string().optional(),
});

export type ServiceFormData = z.infer<typeof serviceSchema>;

export const DURATION_OPTIONS = [
  { value: "30min", label: "30 minutes" },
  { value: "1h", label: "1 heure" },
  { value: "2h", label: "2 heures" },
  { value: "half-day", label: "Demi-journée" },
  { value: "full-day", label: "Journée" },
];
