// src/app/types/common/index.ts

export interface LocationInfo {
  address?: string;
  quarter?: string;
  city?: string;
  postal_code?: string;
  country?: string;
  latitude?: number;
  longitude?: number;
  timezone?: string;
}

export interface SocialLinks {
  website?: string;
  linkedin?: string;
  twitter?: string;
  github?: string;
  behance?: string;
  dribbble?: string;
}


export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
}

export interface GetDataResponse<T> {
  data: T;
  message?: string;
  status?: string;
}

export interface DateRange {
  from?: string;
  to?: string;
}

export interface PaginationParams {
  page?: number;
  per_page?: number;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}
