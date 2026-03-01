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