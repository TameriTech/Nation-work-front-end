// src/app/types/dashboard/activity.ts

export interface ActivityItem {
  type: 'candidature' | 'service_update' | 'payment' | 'application' | 'review';
  id: number;
  serviceId?: number;
  serviceTitle?: string;
  message: string;
  status?: string;
  createdAt: string;
}

export interface UpcomingItem {
  type: 'service' | 'pending_application';
  id: number;
  title?: string;
  serviceId?: number;
  serviceTitle?: string;
  clientName?: string;
  date?: string;
  time?: string;
  address?: string;
  status: string;
  appliedDate?: string;
}

export interface RecentActivity {
  activities: ActivityItem[];
  upcoming: UpcomingItem[];
  totalCount: number;
}
