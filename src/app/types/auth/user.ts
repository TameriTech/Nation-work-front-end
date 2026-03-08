// ============================================================================
// TYPES UTILISATEUR DE BASE
// ============================================================================

import { FreelancerProfile } from "../users";

export interface User {
  id: number;
  email: string;
  username: string;
  first_name?: string;
  last_name?: string;
  name?: string;
  role: 'client' | 'freelancer' | 'admin' | 'super_admin' | 'moderator';
  status: 'active' | 'suspended' | 'pending_verification' | 'inactive';
  is_active: boolean;
  is_verified: boolean;
  verified_badge?: boolean;
  top_rated?: boolean;
  phone?: string;
  phone_number?: string;
  avatar?: string;
  profile_picture?: string;
  created_at: string;
  updated_at: string;
  last_login?: string;
  suspension_reason?: string;
  suspended_until?: string;
  pending_documents?: string[];
  freelancer_profile?: FreelancerProfile;

  is_blocked: boolean;
  blocked_at: string;
  blocked_until: string;
  
  // Statistiques utilisateur (optionnelles)
  stats?: {
    services_posted?: number;
    services_completed?: number;
    total_spent?: number;
    total_earned?: number;
    average_rating?: number;
    response_rate?: number;
    completion_rate?: number;
  };
}

export interface DateRange {
  startDate: string;
  endDate: string;
}
