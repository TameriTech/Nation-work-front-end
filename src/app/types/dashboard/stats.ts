import { TopFreelancer } from "../reports";
import { RecentActivity } from "./activity";

// ============================================================================
// TYPES POUR LES STATISTIQUES DU DASHBOARD
// ============================================================================

export interface DashboardStats {
  users: {
    total: number;
    new: number;
    growth: number;
    breakdown: {
      clients: number;
      freelancers: number;
      admins: number;
    };
  };
  services: {
    total: number;
    active: number;
    completed: number;
    cancelled: number;
    growth: number;
  };
  payments: {
    total_amount: number;
    platform_fees: number;
    pending_payouts: number;
    growth: number;
  };
  disputes: {
    open: number;
    resolved: number;
    escalated: number;
    change: number;
  };
}

export interface ChartData {
  registrations: {
    labels: string[];
    data: number[];
  };
  service_status: {
    labels: string[];
    data: number[];
    colors: string[];
  };
  revenue: {
    labels: string[];
    data: number[];
  };
}

export interface DashboardSummary {
  total_users: number;
  total_services: number;
  total_revenue: number;
  new_users: number;
  new_services: number;
  revenue_growth: number;
  top_freelancers: TopFreelancer[];
  recent_activities: RecentActivity[];
  stats: DashboardStats;
}

export interface DashboardAlert {
  // À définir selon les besoins
}
