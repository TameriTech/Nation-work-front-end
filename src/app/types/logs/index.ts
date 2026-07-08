// src/app/types/logs/index.ts
export interface ActivityLog {
  id: number;
  userId?: number;
  username?: string;
  extraData: any;
  entityType: string;
  entityId?: number;
  description: string;
  ipAddress?: string;
  userAgent?: string;
  createdAt: string;
}

export interface ActivityLogFilters {
  userId?: number;
  extraData: any;
  entityType?: string;
  entityId?: number;
  fromDate?: string;
  toDate?: string;
  page: number;
  perPage: number;
}

export interface AuditLog {
  id: number;
  userId?: number;
  username?: string;
  action: string;
  tableName: string;
  recordId: number;
  oldValues?: Record<string, any>;
  newValues?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  createdAt: string;
}

export interface SystemLog {
  id: number;
  level: 'info' | 'warning' | 'error' | 'critical';
  source: string;
  message: string;
  details?: Record<string, any>;
  stack?: string;
  createdAt: string;
}
