export interface Category {
  id: number;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface CategoryStats {
  id: number;
  name: string;
  description: string;
  icon: string;
  color: string;
  is_active: boolean;
  total_services: number;
  total_freelancers: number;
  average_price: number;
  created_at: string;
  updated_at: string;
}