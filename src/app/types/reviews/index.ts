// app/types/review.ts

export interface Review {
  id: number;
  service_id: number;
  service_title: string;
  client_id: number;
  client_name: string;
  client_avatar?: string;
  provider_id: number;
  provider_name: string;
  provider_avatar?: string;
  rating: number;
  communication_rating?: number;
  quality_rating?: number;
  deadline_rating?: number;
  professionalism_rating?: number;
  comment: string;
  private_feedback?: string;
  provider_response?: string;
  response_date?: string;
  is_verified: boolean;
  is_public: boolean;
  helpful_count: number;
  created_at: string;
  updated_at?: string;
  service?: {
    id: number;
    title: string;
    status: string;
  };
}

export interface ReviewStats {
  total_reviews: number;
  average_rating: number;
  rating_distribution: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
  response_rate: number;
  average_response_time?: number;
  reviews_by_role: {
    as_client: number;
    as_provider: number;
  };
  monthly_trend?: number;
}

export interface ReviewFilters {
  page?: number;
  per_page?: number;
  role?: 'client' | 'provider' | 'all';
  min_rating?: number;
  max_rating?: number;
  has_response?: boolean;
  has_comment?: boolean;
  is_verified?: boolean;
  is_public?: boolean;
  date_from?: string;
  date_to?: string;
  search?: string;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}

export interface ReviewableService {
  id: number;
  title: string;
  provider_id: number;
  provider_name: string;
  completed_at: string;
  has_review?: boolean;
  review_id?: number;
}
