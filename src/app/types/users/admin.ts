// src/app/types/admin/users.ts
import { User } from '../auth/user';
import { BlockReason, BlockAction } from '../enums';

export interface BlockUserRequest {
  user_id: number;
  reason: BlockReason;
  reason_text?: string;
  block_until?: string;
  notify_user?: boolean;
}

export interface UnblockUserRequest {
  user_id: number;
  reason: string;
  notify_user?: boolean;
}

export interface UserBlockResponse {
  id: number;
  user_id: number;
  username: string;
  email: string;
  is_blocked: boolean;
  blocked_at?: string;
  blocked_by?: string;
  blocked_by_id?: number;
  blocked_reason?: string;
  blocked_until?: string;
}

export interface BlockHistoryResponse {
  id: number;
  user_id: number;
  username: string;
  action: BlockAction;
  reason: BlockReason;
  reason_text?: string;
  performed_by: string;
  performed_by_id: number;
  blocked_until?: string;
  ip_address?: string;
  created_at: string;
}

export interface BlockStatsResponse {
  total_blocked_users: number;
  blocked_users_by_reason: Record<string, number>;
  blocked_users_by_role: Record<string, number>;
  temporary_blocks: number;
  permanent_blocks: number;
  blocks_last_30_days: number;
}

export interface UserRoleUpdate {
  user_id: number;
  role: string;
  reason?: string;
}

export interface UserBlockStats {
  total_blocked_users: number;
  blocked_users_by_reason: Record<string, number>;
  blocked_users_by_role: Record<string, number>;
  temporary_blocks: number;
  permanent_blocks: number;
  blocks_last_30_days: number;
}

export interface UserStats {
  total_users: number;
  active_users: number;
  blocked_users: number;
  deleted_users: number;
  clients_count: number;
  providers_count: number;
  admins_count: number;
  new_users_today: number;
  new_users_this_week: number;
  new_users_this_month: number;
}
