export interface Category {
  id: number;
  name: string;
  description?: string;
  icon?: string;
  color?: string;
  is_active: boolean;
  created_at: string;
  updated_at?: string;
}

export interface CategoryStats {
  id: number;
  name: string;
  description?: string;
  icon?: string;
  color?: string;
  is_active: boolean;
  total_services: number | 0;
  total_freelancers: number | 0;
  average_price: number | 0;
  created_at: string;
  updated_at: string;
}

export interface CategoryFilters {
  name?: string;
  is_active?: boolean;
}


export interface PaginatedResponse {
  items: Category[];
  total: number;
  per_page:number;
  page: number;
}

export interface CreateCategoryDTO {
  name: string;
  description?: string;
  icon?: string;
  color?: string;
  is_active: boolean;
}