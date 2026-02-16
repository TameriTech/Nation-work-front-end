import { LucideIcon } from "lucide-react";

export interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
  badge?: string | number;
  children?: NavItem[];
}


export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface BreadcrumbConfig {
  [key: string]: string;
}

export interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  navItems: NavItem[];
  logo?: React.ReactNode;
  collapsed?: boolean;
  onCollapse?: () => void;
}

export interface HeaderProps {
  onMenuClick: () => void;
  user: User;
  breadcrumbConfig?: BreadcrumbConfig;
  notificationCount?: number;
}

export interface AdminLayoutProps {
  children: React.ReactNode;
  navItems: NavItem[];
  user: User;
  logo?: React.ReactNode;
  breadcrumbConfig?: BreadcrumbConfig;
  defaultSidebarOpen?: boolean;
  defaultCollapsed?: boolean;
}

export interface ProfileDropdownProps {
  user: User;
  onProfileClick?: () => void;
  onSettingsClick?: () => void;
  onLogoutClick?: () => void;
}

export interface BreadcrumbsProps {
  config?: BreadcrumbConfig;
  className?: string;
}





// Types généraux pour les réponses API
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
  status: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
}

export interface ApiError {
  message: string;
  code?: string;
  field?: string;
}

// Types pour le dashboard
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

export interface RecentActivity {
  id: string;
  type: 'user_registration' | 'service_created' | 'payment_received' | 'dispute_opened' | 'verification_pending';
  user?: {
    name: string;
    role: string;
    avatar?: string;
  };
  service?: {
    id: number;
    title: string;
  };
  payment?: {
    id: string;
    amount: number;
  };
  dispute?: {
    id: string;
  };
  description: string;
  timestamp: string;
  time_ago: string;
}

export interface ChartData {
  labels: string[];
  data: number[];
  colors?: string[];
}

// Types pour les utilisateurs
export interface User {
  id: number;
  email: string;
  username: string;
  role: 'client' | 'freelancer' | 'admin';
  status: 'active' | 'suspended' | 'pending_verification' | 'inactive';
  is_verified: boolean;
  verified_badge?: boolean;
  top_rated?: boolean;
  phone?: string;
  avatar?: string;
  created_at: string;
  last_login?: string;
  suspension_reason?: string;
  suspended_until?: string;
  pending_documents?: string[];
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

export interface UserFilters {
  role?: string;
  status?: string;
  search?: string;
  page?: number;
  per_page?: number;
}

export interface PendingVerification {
  id: number;
  user_id: number;
  user_name: string;
  document_type: string;
  document_number: string;
  front_image: string;
  back_image?: string;
  submitted_at: string;
  status: 'pending' | 'approved' | 'rejected';
}

// Types pour les services/missions
export interface Service {
  id: number;
  title: string;
  short_description: string;
  category: string;
  status: 'published' | 'assigned' | 'in_progress' | 'completed' | 'cancelled' | 'disputed';
  client: {
    id: number;
    name: string;
    avatar?: string;
  };
  freelancer?: {
    id: number;
    name: string;
    avatar?: string;
  } | null;
  date: string;
  completed_at?: string;
  cancelled_at?: string;
  cancellation_reason?: string;
  address: string;
  budget: number;
  candidatures_count: number;
  created_at: string;
  priority?: 'normal' | 'high';
  rating?: {
    score: number;
    comment: string;
  };
  dispute?: {
    id: string;
    reason: string;
    opened_by: string;
    opened_at: string;
  };
}

export interface ServiceFilters {
  status?: string;
  category?: string;
  client_id?: number;
  freelancer_id?: number;
  date_from?: string;
  date_to?: string;
  budget_min?: number;
  budget_max?: number;
  search?: string;
  page?: number;
  per_page?: number;
}

export interface Category {
  id: number;
  name: string;
  description: string;
  icon: string;
  color: string;
  is_active: boolean;
  services_count: number;
  freelancers_count: number;
  average_price: number;
}

// Types pour les paiements
export interface Payment {
  id: string;
  service_id: number;
  service_title: string;
  client: {
    id: number;
    name: string;
  };
  freelancer?: {
    id: number;
    name: string;
  } | null;
  amount: number;
  platform_fee: number;
  freelancer_payout: number | null;
  status: 'pending' | 'paid' | 'escrow' | 'refunded' | 'failed';
  payment_method: 'card' | 'mobile_money' | 'cash' | 'bank_transfer';
  transaction_id?: string;
  paid_at?: string;
  created_at: string;
  refund_reason?: string;
  refunded_at?: string;
  escrow_release_date?: string;
  notes?: string;
}

export interface PaymentSummary {
  total_revenue: number;
  platform_fees: number;
  pending_payouts: number;
  monthly_revenue: number;
  monthly_growth: number;
}

export interface Payout {
  id: string;
  freelancer: {
    id: number;
    name: string;
  };
  amount: number;
  period: string;
  method: string;
  status: 'pending' | 'processed' | 'paid';
  requested_at: string;
  processed_at?: string;
  paid_at?: string;
  transaction_id?: string;
}

// Types pour les litiges
export interface Dispute {
  id: string;
  service: {
    id: number;
    title: string;
  };
  client: {
    id: number;
    name: string;
    avatar?: string;
  };
  freelancer: {
    id: number;
    name: string;
    avatar?: string;
  };
  opened_by: 'client' | 'freelancer';
  opened_by_name: string;
  reason: string;
  description: string;
  priority: 'low' | 'normal' | 'high';
  status: 'open' | 'in_progress' | 'resolved' | 'dismissed';
  created_at: string;
  assigned_to?: string;
  assigned_at?: string;
  resolution?: string;
  resolved_at?: string;
  resolved_by?: string;
  rejection_reason?: string;
  dismissed_at?: string;
  dismissed_by?: string;
  evidence?: Array<{
    type: string;
    url: string;
    description?: string;
  }>;
  messages?: Array<{
    from: string;
    role: string;
    message: string;
    timestamp: string;
  }>;
}

export interface DisputeStats {
  open: number;
  in_progress: number;
  resolved: number;
  dismissed: number;
  avg_resolution_time: string;
  by_reason: Record<string, number>;
}

export interface DisputeAction {
  type: 'resolve' | 'reject' | 'escalate' | 'assign';
  resolution?: string;
  refund_percentage?: number;
  assigned_to?: number;
}

// Types pour les paramètres
export interface GeneralSettings {
  site_name: string;
  site_url: string;
  contact_email: string;
  support_email: string;
  default_language: string;
  timezone: string;
  maintenance_mode: boolean;
}

export interface FeeSettings {
  platform_fee_percentage: number;
  minimum_fee: number;
  maximum_fee: number;
  withdrawal_fee: number;
  escrow_fee_percentage: number;
}

export interface TimingSettings {
  client_validation_hours: number;
  dispute_opening_days: number;
  payout_processing_days: number;
  auto_accept_candidature_hours: number;
  session_timeout_minutes: number;
}

export interface ThresholdSettings {
  min_profile_completion: number;
  min_freelancer_rating: number;
  max_disputes_before_suspension: number;
  auto_suspend_after_inactivity_days: number;
}

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

// Types pour les logs
export interface ActivityLog {
  id: string;
  admin: {
    id: number;
    name: string;
  };
  action: string;
  target_type: string;
  target_id?: number | string;
  target_name?: string;
  details: string;
  ip_address: string;
  timestamp: string;
}

// Types pour les notifications
export interface AdminNotification {
  id: string;
  type: 'urgent' | 'warning' | 'info' | 'success';
  title: string;
  message: string;
  action_url?: string;
  created_at: string;
  is_read: boolean;
}

// Types pour le support
export interface SupportTicket {
  id: string;
  user: {
    id: number;
    name: string;
    role: string;
  };
  subject: string;
  message: string;
  priority: 'low' | 'normal' | 'high';
  status: 'open' | 'in_progress' | 'closed';
  created_at: string;
  assigned_to?: string;
  assigned_at?: string;
  closed_at?: string;
  resolution?: string;
  messages?: Array<{
    from: string;
    message: string;
    timestamp: string;
  }>;
}
