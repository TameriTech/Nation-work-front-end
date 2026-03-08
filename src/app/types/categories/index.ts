import { providersByCategory } from "@/data/constants";

// ============================================================================
// TYPES POUR LES CATÉGORIES
// ============================================================================

export type ProviderCategory = keyof typeof providersByCategory;

export interface Category {
  id: number;
  name: string;
  description?: string;
  icon?: string;
  color?: string;
  is_active: boolean;
  parent_id?: number;
  services_count?: number;
  freelancers_count?: number;
  average_price?: number;
  created_at: string;
  updated_at?: string;
}

export interface CategoryStats {
  total_categories: number;
  active_categories: number;
  inactive_categories: number;
  total_services: number;
}

export interface CategoryFilters {
  name?: string;
  is_active?: boolean;
  search?: string;
  page?: number;
  per_page?: number;
}

export interface CreateCategoryDTO {
  name: string;
  description?: string;
  icon?: string;
  color?: string;
  is_active: boolean;
}
