import { User } from "../auth/user";

// ============================================================================
// TYPES POUR LES UTILISATEURS ADMIN
// ============================================================================

export interface AdminUser {
  id: number;
  name: string;
  email: string;
  role: 'super_admin' | 'moderator' | 'support';
  permissions: string[];
  avatar?: string;
  last_login?: string;
  created_at: string;
  status: 'active' | 'inactive';
}

export interface UserFilters {
  role?: string;
  status?: 'active' | 'suspended';
  search?: string;
  page?: number;
  per_page?: number;
  sort_by?: string;
  sort_order?: "asc" | "desc";
}

export interface UsersStats {
  total: number;
  active: number;
  suspended: number;
  pending_verification: number;
  by_role: Record<string, number>;
  new_this_month: number;
  new_this_week: number;
  growth_percentage: number;
}

export interface SuspendData {
  reason: string;
  duration_days?: number;
}
