import { DateRange } from "../auth/user";

// ============================================================================
// TYPES POUR LES RAPPORTS
// ============================================================================

export interface TopFreelancer {
  id: number;
  name: string;
  avatar?: string;
  services_completed: number;
  total_earned: number;
  average_rating: number;
  response_rate: number;
}

export interface ReportStats {
  total_revenue: number;
  total_services: number;
  total_users: number;
  total_freelancers: number;
  average_rating: number;
  completion_rate: number;
  response_rate: number;
  dispute_rate: number;
  previous_period: {
    revenue: number;
    services: number;
    users: number;
    freelancers: number;
  };
}

export interface RevenueData {
  date: string;
  revenue: number;
  fees: number;
  payouts: number;
}

export interface ServicesByCategory {
  category: string;
  count: number;
  percentage: number;
  color: string;
  status: string;
}

export interface ServicesByStatus {
  category: string;
  status: string;
  count: number;
  percentage: number;
  color: string;
}

export interface ActivityData {
  date: string;
  registrations: number;
  services: number;
  payments: number;
}

export interface GeographicDistribution {
  city: string;
  count: number;
  percentage: number;
}

export interface PerformanceMetrics {
  metric: string;
  value: number;
  target: number;
  previous: number;
  unit: string;
}

export interface ReportFilters {
  dateRange: DateRange;
  category?: string;
  city?: string;
  freelancer_id?: number;
}
