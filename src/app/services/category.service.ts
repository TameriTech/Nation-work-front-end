// services/category.service.ts

import { handleResponse } from '@/app/lib/error-handler';
import type {
  Category,
  CategoryTreeItem,
  CategoryStats,
  CategoryFilters,
  PaginatedResponse,
  GetDataResponse,
} from '@/app/types';
import {
  CategoryCreateFormData,
  CategoryUpdateFormData,
  CategoryFiltersFormData,
} from '../lib/validators/category.validator';

const API_BASE = '/api';

// ==================== TYPES ====================

export interface CategoryOption {
  value: string;
  label: string;
}

// ==================== PUBLIC ROUTES ====================

/**
 * Récupère toutes les catégories (public)
 * GET /api/categories
 */
export async function getCategories(filters?: CategoryFiltersFormData): Promise<PaginatedResponse<Category>> {
  try {
    const params = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, String(value));
        }
      });
    }
    
    const res = await fetch(`${API_BASE}/categories?${params.toString()}`, {
      method: 'GET',
      cache: 'no-store',
      headers: { 'Content-Type': 'application/json' },
    });
    return await handleResponse<PaginatedResponse<Category>>(res);
  } catch (error) {
    console.error('Erreur getCategories:', error);
    throw error;
  }
}

/**
 * Récupère l'arborescence des catégories (public)
 * GET /api/categories/tree
 */
export async function getCategoryTree(): Promise<GetDataResponse<CategoryTreeItem[]>> {
  try {
    const res = await fetch(`${API_BASE}/categories/tree`, {
      method: 'GET',
      cache: 'no-store',
      headers: { 'Content-Type': 'application/json' },
    });
    return await handleResponse<GetDataResponse<CategoryTreeItem[]>>(res);
  } catch (error) {
    console.error('Erreur getCategoryTree:', error);
    throw error;
  }
}

/**
 * Récupère les options pour les sélecteurs (public)
 * GET /api/categories/options
 */
export async function getCategoryOptions(): Promise<GetDataResponse<CategoryOption[]>> {
  try {
    const res = await fetch(`${API_BASE}/categories/options`, {
      method: 'GET',
      cache: 'no-store',
      headers: { 'Content-Type': 'application/json' },
    });
    return await handleResponse<GetDataResponse<CategoryOption[]>>(res);
  } catch (error) {
    console.error('Erreur getCategoryOptions:', error);
    throw error;
  }
}

/**
 * Récupère les statistiques des catégories (public)
 * GET /api/categories/stats
 */
export async function getCategoryStats(): Promise<GetDataResponse<CategoryStats>> {
  try {
    const res = await fetch(`${API_BASE}/categories/stats`, {
      method: 'GET',
      cache: 'no-store',
      headers: { 'Content-Type': 'application/json' },
    });
    return await handleResponse<GetDataResponse<CategoryStats>>(res);
  } catch (error) {
    console.error('Erreur getCategoryStats:', error);
    throw error;
  }
}

/**
 * Récupère une catégorie par son ID (public)
 * GET /api/categories/{categoryId}
 */
export async function getCategoryById(categoryId: string): Promise<GetDataResponse<Category>> {
  try {
    const res = await fetch(`${API_BASE}/categories/${categoryId}`, {
      method: 'GET',
      cache: 'no-store',
      headers: { 'Content-Type': 'application/json' },
    });
    return await handleResponse<GetDataResponse<Category>>(res);
  } catch (error) {
    console.error(`Erreur getCategoryById ${categoryId}:`, error);
    throw error;
  }
}

// ==================== ADMIN ROUTES ====================

/**
 * Créer une catégorie (admin)
 * POST /api/categories
 */
export async function createCategory(data: CategoryCreateFormData): Promise<GetDataResponse<Category>> {
  try {
    const res = await fetch(`${API_BASE}/categories`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return await handleResponse<GetDataResponse<Category>>(res);
  } catch (error) {
    console.error('Erreur createCategory:', error);
    throw error;
  }
}

/**
 * Mettre à jour une catégorie (admin)
 * PUT /api/categories/{categoryId}
 */
export async function updateCategory(
  categoryId: string,
  data: CategoryUpdateFormData
): Promise<GetDataResponse<Category>> {
  try {
    const res = await fetch(`${API_BASE}/categories/${categoryId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return await handleResponse<GetDataResponse<Category>>(res);
  } catch (error) {
    console.error(`Erreur updateCategory ${categoryId}:`, error);
    throw error;
  }
}

/**
 * Supprimer une catégorie (admin)
 * DELETE /api/categories/{categoryId}
 */
export async function deleteCategory(categoryId: string): Promise<{ success: boolean; message: string }> {
  try {
    const res = await fetch(`${API_BASE}/categories/${categoryId}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    });
    return await handleResponse<{ success: boolean; message: string }>(res);
  } catch (error) {
    console.error(`Erreur deleteCategory ${categoryId}:`, error);
    throw error;
  }
}

/**
 * Activer/Désactiver une catégorie (admin)
 * PATCH /api/categories/{categoryId}/toggle-active
 */
export async function toggleCategoryActive(categoryId: string): Promise<GetDataResponse<Category>> {
  try {
    const res = await fetch(`${API_BASE}/admin/missions/categories/${categoryId}/toggle-active`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
    });
    return await handleResponse<GetDataResponse<Category>>(res);
  } catch (error) {
    console.error(`Erreur toggleCategoryActive ${categoryId}:`, error);
    throw error;
  }
}

// ==================== PROVIDER ROUTES ====================

/**
 * Récupérer les catégories d'un provider
 * GET /api/categories/provider/{providerId}/categories
 */
export async function getProviderCategories(providerId: string): Promise<GetDataResponse<Category[]>> {
  try {
    const res = await fetch(`${API_BASE}/categories/provider/${providerId}/categories`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    return await handleResponse<GetDataResponse<Category[]>>(res);
  } catch (error) {
    console.error('Erreur getProviderCategories:', error);
    throw error;
  }
}
