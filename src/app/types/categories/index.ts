// src/app/types/categories/index.ts

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon?: string | null;
  parent_id?: string | null;
  is_active: boolean;
  is_featured: boolean;
  children_count: number;
  mission_count: number;
  provider_count: number;
  created_at: string;
  updated_at?: string | null;
}

export interface CategoryFilters {
  page?: number;
  per_page?: number;
  is_active?: boolean;
  search?: string;
  parent_id?: string | null;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}


export interface CategoryTreeItem {
  id: number;
  name: string;
  slug: string;
  icon?: string;
  icon_url?: string;
  color?: string;
  total_services: number;
  total_providers: number;
  children: CategoryTreeItem[];
}
