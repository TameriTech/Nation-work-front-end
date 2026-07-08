// src/app/types/auth/user.ts
import { UserRole } from '../enums';
import { LocationInfo, SocialLinks } from '../common/pagination';
import { providerProfileOut } from '../users/provider';
import { Wallet } from '../payments';

// src/app/types/auth/user.ts

export interface User {
  id: string;
  username?: string;
  first_name: string;
  last_name: string;
  full_name: string;
  phone: string;
  email: string;
  avatar: string | null;
  role: 'client' | 'provider' | 'moderator' | 'admin' | 'super_admin';
  language: string;
  is_verified: boolean;
  is_active: boolean;
  is_blocked?: boolean;
  blocked_reason?: string;
  blocked_until?: string | null;
  last_login_at: string | null;
  created_at: string;
  updated_at: string;
  provider?: Provider | null;
  addresses?: Address[];
  wallet?: Wallet | null;
  block_history?: BlockHistoryEntry[];
}

export interface Provider {
  id: string;
  user_id: string;
  business_name: string;
  description: string;
  years_experience: number;
  completed_missions: number;
  average_rating: number;
  response_rate: number;
  is_available: boolean;
  verification_status: string;
  is_favorited: boolean;
  services?: ProviderService[];
  created_at: string | null;
  updated_at: string | null;
}

export interface ProviderService {
  id: string;
  provider_id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  duration: number;
  category: string;
  subcategory?: string;
  is_active: boolean;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
}

export interface Address {
  id: string;
  user_id: string;
  address_type: 'billing' | 'shipping' | 'both';
  address_line1: string;
  address_line2?: string;
  city: string;
  state?: string;
  postal_code: string;
  country: string;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export interface BlockHistoryEntry {
  id: string;
  user_id: string;
  reason: string;
  reason_text?: string;
  blocked_by?: string;
  blocked_at: string;
  block_until: string | null;
  unblocked_at?: string;
  unblocked_by?: string;
  created_at: string;
  updated_at: string;
}


export interface UserStatistics {
  total_missions: number;
  total_bookings: number;
  total_spent: number;
  total_earned: number;
  average_rating: number;
  total_reviews: number;
  completed_missions?: number;
}

export interface UserFilters {
  role?: 'client' | 'provider' | 'moderator' | 'admin';
  is_verified?: boolean;
  is_active?: boolean;
  search?: string;
  start_date?: string;
  end_date?: string;
  sort_by?: 'id' | 'first_name' | 'last_name' | 'email' | 'phone' | 'role' | 'created_at' | 'last_login_at';
  sort_direction?: 'asc' | 'desc';
  per_page?: number;
  page?: number;
}
