// ===== FILE: app/types/services.ts =====

// Enums correspondant au backend
export type ServiceStatus = 
  | "published" 
  | "assigned" 
  | "en_cours" 
  | "terminé" 
  | "annulé"
  | "draft"; // Pour les brouillons côté frontend

export type ServiceType = 
  | "standard" 
  | "premium" 
  | "candidature" 
  | "directe";

export type CandidatureStatus = 
  | "en_attente" 
  | "accepted" 
  | "rejected" 
  | "withdrawn";

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

export interface Service {
  id: number;
  title: string;
  short_description: string;
  full_description?: string;
  category?: CategoryInfo;
  service_type: ServiceType;
  category_id?: number;
  status: ServiceStatus;
  client: UserBasicInfo;
  freelancer?: UserBasicInfo & { rating?: number } | null;
  date_pratique: string; // date_pratique
  start_time?: string;
  duration?: string;
  completed_at?: string;
  cancelled_at?: string;
  cancellation_reason?: string;
  address: string;
  city?: string;
  quarter?: string;
  country?: string;
  postal_code?: string;
  latitude?: number;
  longitude?: number;
  budget: number; // proposed_amount
  proposed_amount?: number;
  accepted_amount?: number;
  candidatures_count: number;
  created_at: string;
  updated_at?: string;
  priority?: "normal" | "high";
  rating?: RatingInfo;
  dispute?: DisputeInfo;
  required_skills?: string[];
  images?: string[];
}

export interface ServiceFilters {
  status?: string;
  category_id?: number;
  client_id?: number;
  freelancer_id?: number;
  date_from?: string;
  date_to?: string;
  budget_min?: number;
  budget_max?: number;
  search?: string;
  city?: string;
  page?: number;
  per_page?: number;
  sort_by?: string;
  sort_order?: "asc" | "desc";
}

export interface PaginatedResponse<T> {
  services: T[];
  total: number;
  page: number;
  per_page: number;
  pages: number;
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
export interface ServicePayload {
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