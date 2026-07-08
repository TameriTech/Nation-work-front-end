import { handleResponse } from '@/app/lib/error-handler';
import type {
  BlockHistoryEntry,
  User,
  UserFilters,
  Mission,
  Payment,
  Dispute,
  ProviderService,
} from '@/app/types';

import type {
  BlockUserFormData,
  UnblockFormData,
  UserRoleUpdateFormData,
  UserFiltersFormData,
  ExportUsersFormData,
} from '@/app/lib/validators/user.validator';
import { GetDataResponse, PaginatedResponse } from '../types';

const API_BASE = '/api';

// ==================== ADMIN USER MANAGEMENT ====================

/**
 * Get all users with filters
 */
export async function getAllUsers(filters?: UserFilters): Promise<PaginatedResponse<User>> {
  try {
    const queryParams = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, value.toString());
        }
      });
    }

    const url = `${API_BASE}/admin/users${queryParams.toString() ? `?${queryParams}` : ''}`;
    const res = await fetch(url, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    
    return await handleResponse<PaginatedResponse<User>>(res);
  } catch (error) {
    console.error('Erreur getAllUsers:', error);
    throw error;
  }
}

/**
 * Get user by ID with details
 */
export async function getUserById(userId: string): Promise<GetDataResponse<{ user: User, statistics: any, block_history: any[] }>> {
  try {
    const res = await fetch(`${API_BASE}/admin/users/${userId}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    return await handleResponse<GetDataResponse<{ user: User, statistics: any, block_history: any[] }>>(res);
  } catch (error) {
    console.error('Erreur getUserById:', error);
    throw error;
  }
}

/**
 * Block a user
 */
export async function blockUser(userId: string, data?: BlockUserFormData): Promise<GetDataResponse<User>> {
  try {
    const res = await fetch(`${API_BASE}/admin/users/${userId}/block`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: data ? JSON.stringify(data) : undefined,
    });
    return await handleResponse<GetDataResponse<User>>(res);
  } catch (error) {
    console.error('Erreur blockUser:', error);
    throw error;
  }
}

/**
 * Unblock a user
 */
export async function unblockUser(userId: string, data?: UnblockFormData): Promise<GetDataResponse<User>> {
  try {
    const res = await fetch(`${API_BASE}/admin/users/${userId}/unblock`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: data ? JSON.stringify(data) : undefined,
    });
    return await handleResponse<GetDataResponse<User>>(res);
  } catch (error) {
    console.error('Erreur unblockUser:', error);
    throw error;
  }
}

/**
 * Change user role
 */
export async function changeUserRole(userId: string, data: UserRoleUpdateFormData): Promise<{
  user: User;
  old_role: string;
  new_role: string;
}> {
  try {
    const res = await fetch(`${API_BASE}/admin/users/${userId}/role`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return await handleResponse<{ user: User; old_role: string; new_role: string }>(res);
  } catch (error) {
    console.error('Erreur changeUserRole:', error);
    throw error;
  }
}

/**
 * Verify a user
 */
export async function verifyUser(userId: string): Promise<GetDataResponse<User>> {
  try {
    const res = await fetch(`${API_BASE}/admin/users/${userId}/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    return await handleResponse<GetDataResponse<User>>(res);
  } catch (error) {
    console.error('Erreur verifyUser:', error);
    throw error;
  }
}

/**
 * Unverify a user
 */
export async function unverifyUser(userId: string): Promise<GetDataResponse<User>> {
  try {
    const res = await fetch(`${API_BASE}/admin/users/${userId}/unverify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    return await handleResponse<GetDataResponse<User>>(res);
  } catch (error) {
    console.error('Erreur unverifyUser:', error);
    throw error;
  }
}

/**
 * Get user block history
 */
export async function getUserBlockHistory(userId: string): Promise<GetDataResponse<BlockHistoryEntry[]>> {
  try {
    const res = await fetch(`${API_BASE}/admin/users/${userId}/block-history`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    return await handleResponse<GetDataResponse<BlockHistoryEntry[]>>(res);
  } catch (error) {
    console.error('Erreur getUserBlockHistory:', error);
    throw error;
  }
}