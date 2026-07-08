// src/app/types/search/index.ts

export interface providerSearchFilters {
  keyword?: string;
  categories?: number[];
  skills?: number[];
  min_hourly_rate?: number;
  max_hourly_rate?: number;
  min_rating?: number;
  years_experience?: number;
  country?: string;
  city?: string;
  is_available?: boolean;
  is_verified?: boolean;
  languages?: string[];
  page: number;
  per_page: number;
  sort_by: string;
  sort_order: 'asc' | 'desc';
}
