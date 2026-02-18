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
  sort_by?: string;
  sort_order?: "asc" | "desc"
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

export type ServiceStatus = "published" | "assigned" | "in_progress" | "completed" | "cancelled" | "disputed";

// Types pour les services/missions
export interface Service {
  id: number;
  title: string;
  short_description: string;
  full_description?: string;
  category: string;
  category_id?: number;
  status: ServiceStatus;
  client: {
    id: number;
    name: string;
    avatar?: string;
    email?: string;
    phone?: string;
  };
  freelancer?: {
    id: number;
    name: string;
    avatar?: string;
    email?: string;
    rating?: number;
  } | null;
  date: string;
  start_time?: string;
  duration?: string;
  completed_at?: string;
  cancelled_at?: string;
  cancellation_reason?: string;
  address: string;
  city?: string;
  postal_code?: string;
  latitude?: number;
  longitude?: number;
  budget: number;
  proposed_amount?: number;
  accepted_amount?: number;
  candidatures_count: number;
  created_at: string;
  updated_at?: string;
  priority?: "normal" | "high";
  rating?: {
    score: number;
    comment: string;
    created_at: string;
  };
  dispute?: {
    id: string;
    reason: string;
    opened_by: string;
    opened_at: string;
    status: string;
  };
  required_skills?: string[];
  images?: string[];
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
  city?: string;
  page?: number;
  per_page?: number;
  sort_by?: string;
  sort_order?: "asc" | "desc";
}

export interface Category {
  id: number;
  name: string;
  description: string;
  icon: string;
  color: string;
  is_active: boolean;
  parent_id?: number;
  services_count: number;
  freelancers_count: number;
  average_price: number;
  created_at: string;
  updated_at?: string;
}

export interface CategoryFilters {
  is_active?: boolean;
  search?: string;
  page?: number;
  per_page?: number;
}

export interface ServiceStats {
  total: number;
  by_status: Record<string, number>;
  by_category: Record<string, number>;
  average_budget: number;
  completion_rate: number;
  total_revenue: number;
  platform_fees: number;
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
  client_id: number;
  freelancer?: {
    id: number;
    name: string;
  } | null;
  freelancer_id?: number | null;
  amount: number;
  platform_fee: number;
  freelancer_payout: number | null;
  status: "pending" | "paid" | "escrow" | "refunded" | "failed";
  payment_method: "card" | "mobile_money" | "cash" | "bank_transfer";
  transaction_id?: string;
  payment_intent_id?: string;
  paid_at?: string;
  created_at: string;
  updated_at?: string;
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
  by_status: {
    pending: number;
    paid: number;
    escrow: number;
    refunded: number;
    failed: number;
  };
  by_method: {
    card: number;
    mobile_money: number;
    cash: number;
    bank_transfer: number;
  };
}

export interface Payout {
  id: string;
  freelancer: {
    id: number;
    name: string;
    avatar?: string;
  };
  amount: number;
  period: string;
  method: "bank_transfer" | "mobile_money" | "paypal";
  status: "pending" | "processed" | "paid" | "failed";
  requested_at: string;
  processed_at?: string;
  paid_at?: string;
  transaction_id?: string;
  notes?: string;
  bank_details?: {
    bank_name: string;
    account_number: string;
    iban?: string;
    bic?: string;
  };
}

export interface PaymentFilters {
  status?: string;
  method?: string;
  client_id?: number;
  freelancer_id?: number;
  date_from?: string;
  date_to?: string;
  min_amount?: number;
  max_amount?: number;
  search?: string;
  page?: number;
  per_page?: number;
  sort_by?: string;
  sort_order?: "asc" | "desc";
}

export interface PayoutFilters {
  status?: string;
  method?: string;
  freelancer_id?: number;
  date_from?: string;
  date_to?: string;
  page?: number;
  per_page?: number;
  sort_by?: string;
  sort_order?: "asc" | "desc";
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
    avatar?: string | null;  // Modifié pour accepter null
  };
  freelancer: {
    id: number;
    name: string;
    avatar?: string | null;  // Modifié pour accepter null
  };
  opened_by: "client" | "freelancer";
  opened_by_name: string;
  reason: string;
  description: string;
  priority: "low" | "normal" | "high" | "urgent";
  status: "open" | "in_progress" | "resolved" | "dismissed" | "escalated";
  created_at: string;
  assigned_to?: {
    id: number;
    name: string;
    avatar?: string | null;  // Modifié pour accepter null
  };
  assigned_at?: string;
  resolution?: string;
  resolved_at?: string;
  resolved_by?: {
    id: number;
    name: string;
  };
  escalated_at?: string;  // Ajouté
  escalated_reason?: string;  // Ajouté
  rejection_reason?: string;
  dismissed_at?: string;
  dismissed_by?: {
    id: number;
    name: string;
  };
  evidence?: Array<{
    id: string;
    type: "image" | "document" | "message" | "payment";
    url: string;
    description?: string;
    uploaded_at: string;
    uploaded_by: {
      id: number;
      name: string;
      role: string;
    };
  }>;
  messages?: Array<{
    id: string;
    from: string;
    from_id: number;
    role: "client" | "freelancer" | "admin";
    message: string;
    timestamp: string;
    is_private?: boolean;
  }>;
  timeline?: Array<{
    id: string;
    action: string;
    description: string;
    timestamp: string;
    user: {
      id: number;
      name: string;
      role: string;
    };
  }>;
}

export interface DisputeFilters {
  status?: string;
  priority?: string;
  opened_by?: string;
  date_from?: string;
  date_to?: string;
  assigned_to?: number;
  search?: string;
  page?: number;
  per_page?: number;
  sort_by?: string;
  sort_order?: "asc" | "desc";
}

export interface DisputeStats {
  open: number;
  in_progress: number;
  resolved: number;
  dismissed: number;
  escalated: number;
  total: number;
  avg_resolution_time: string; // en heures
  by_priority: {
    low: number;
    normal: number;
    high: number;
    urgent: number;
  };
  by_reason: Record<string, number>;
  by_month: Array<{
    month: string;
    count: number;
  }>;
}

export interface DisputeAction {
  type: "assign" | "resolve" | "reject" | "escalate" | "message";
  payload: any;
}

export interface ResolveData {
  resolution: string;
  refund_percentage?: number;
  compensation?: number;
  notify_users: boolean;
}

export interface RejectData {
  reason: string;
  notify_users: boolean;
}

export interface AssignData {
  assigned_to: number;
  notes?: string;
}

export interface MessageData {
  message: string;
  is_private: boolean;
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


export interface DateRange {
  startDate: string;
  endDate: string;
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
}

export interface ServicesByStatus {
  status: string;
  count: number;
  percentage: number;
  color: string;
}

export interface TopFreelancer {
  id: number;
  name: string;
  avatar?: string;
  services_completed: number;
  total_earned: number;
  average_rating: number;
  response_rate: number;
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




export interface Conversation {
  id: number;
  service_id: number;
  client_id: number;
  freelancer_id: number;
  is_active: boolean;
  last_message_at?: string;
  created_at: string;
  updated_at?: string;
  
  // Relations
  service?: {
    id: number;
    title: string;
    status: string;
  };
  client?: {
    id: number;
    name: string;
    username: string;
    email: string;
    avatar?: string;
  };
  freelancer?: {
    id: number;
    name: string;
    username: string;
    email: string;
    avatar?: string;
  };
  admin?: {
    id: number;
    name: string;
    username: string;
    email: string;
    avatar?: string;
  };
  last_message?: Message;
  message_count?: number;
  unread_count?: number;
}

export interface Message {
  id: number;
  conversation_id: number;
  sender_id: number;
  recipient_id: number;
  content?: string;
  media_url?: string;
  media_type?: string;
  is_read: boolean;
  read_at?: string;
  is_delivered: boolean;
  delivered_at?: string;
  created_at: string;
  
  // Relations
  sender?: {
    id: number;
    name: string;
    username: string;
    avatar?: string;
    role: string;
  };
  recipient?: {
    id: number;
    name: string;
    username: string;
    avatar?: string;
    role: string;
  };
}

export interface ConversationFilters {
  page?: number;
  per_page?: number;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
  search?: string;
  is_active?: boolean;
  participant_type?: 'client' | 'freelancer' | 'admin';
  date_from?: string;
  date_to?: string;
}

export interface ConversationStats {
  total: number;
  active: number;
  archived: number;
  unread: number;
  total_messages: number;
  avg_messages_per_conversation: number;
  participants: number;
  engagement_rate: number;
}
