// ============================================================================
// TYPES POUR LES LITIGES
// ============================================================================

export interface Dispute {
  id: number;
  service: {
    id: number;
    title: string;
  };
  client: {
    id: number;
    name: string;
    avatar?: string | null;
  };
  freelancer: {
    id: number;
    name: string;
    avatar?: string | null;
  };
  opened_by: "client" | "freelancer";
  opened_by_name: string;
  reason: string;
  description: string;
  priority: "low" | "normal" | "high" | "urgent";
  status: "open" | "in_progress" | "resolved" | "dismissed" | "escalated";
  created_at: string;
  updated_at: string;
  assigned_to?: {
    id: number;
    name: string;
    avatar?: string | null;
  };
  assigned_at?: string;
  resolution?: string;
  resolved_at?: string;
  resolved_by?: {
    id: number;
    name: string;
  };
  escalated_at?: string;
  escalated_reason?: string;
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
  timeline?: Array<DisputeHistoryEntry>;
}

export interface DisputeHistory {
  id: number;
  service_id: number;
  service_title: string;
  reason: string;
  status: 'open' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'critical';
  opened_by: string;
  opened_by_id: number;
  created_at: string;
  resolved_at?: string;
  resolution?: string;
  messages_count: number;
}

export interface DisputeHistoryEntry {
  id: string;
  action: string;
  description: string;
  timestamp: string;
  user: {
    id: number;
    name: string;
    role: string;
  };
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
  avg_resolution_time: string;
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
