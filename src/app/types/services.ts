// ===== FILE: app/types/services.ts =====

import { boolean, nullable, string } from "zod";
import { Category } from "./category";
import { User } from "./user";

// Enums correspondant au backend
export type ServiceStatus = "published" | "assigned" | "pending" | "in_progress" | "completed" | "canceled"| "draft";
export type ServiceType = 'standard' | 'premium' | 'candidature' | 'direct';

export type CandidatureStatus = "pending" | "accepted" | "rejected" | "withdrawn";

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

// types/services.ts

export interface Service {
  id: number;
  title: string;
  short_description: string;
  full_description: string;
  service_type: ServiceType;
  category_id?: number;
  date_pratique: string; // DateTime
  start_time: string; // "HH:MM"
  duration: string; // "1h", "2h", "3h+"
  address: string;
  quarter?: string;
  city: string;
  postal_code?: string;
  country?: string;
  latitude?: number;
  longitude?: number;
  required_skills: string[]; // JSON array
  proposed_amount: number;
  accepted_amount?: number;
  status: ServiceStatus;
  client_id: number;
  assigned_freelancer_id?: number;
  created_at: string;
  updated_at?: string;
  completed_at?: string;
  client: User;
  freelancer?: User;
  category?: Category;
  service_images?: ServiceImage[];
  is_favorite?: boolean;
  candidatures_count: number;
  ratings?: RatingInfo[];
  dispute?: DisputeInfo;
  views_count: number;
}

export interface ServiceImage {
  id: number;
  service_id: number;
  image_url: string;
  is_primary: boolean;
  created_at: string;
  service?: Service;
}
export interface ServiceFilters {
  // Recherche textuelle
  search?: string;
  
  // Catégorie
  category_id?: number;
  
  // Prix
  min_price?: number;
  max_price?: number;
  
  // Localisation
  city?: string;
  quarter?: string;
  country?: string;
  latitude?: number;
  longitude?: number;
  radius_km?: number; // Rayon de recherche en km
  
  // Date et heure
  date_pratique?: string; // Date spécifique
  date_from?: string; // Date de début (>=)
  date_to?: string; // Date de fin (<=)
  start_time_from?: string; // Heure de début (>=)
  start_time_to?: string; // Heure de début (<=)
  
  // Durée
  duration?: string[]; // ["1h", "2h", "3h+"]
  
  // Compétences requises
  skills?: string[]; // Liste de compétences
  
  // Type de service
  service_types?: ServiceType[];
  
  // Statut (pour freelancer/admin)
  status?: ServiceStatus[];
  
  // Pagination
  page?: number;
  per_page?: number;
  sort_by?: 'date' | 'price' | 'rating';
  sort_order?: 'asc' | 'desc';
}


export interface PaginatedResponse<T> {
  services: T[];
  total: number;
  page: number;
  per_page: number;
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

// Payload pour création/update
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

export interface WishlistItem {
  id: number;
  service_id: number;
  service: Service;
  created_at: string;
}