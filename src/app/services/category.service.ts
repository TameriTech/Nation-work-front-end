import { CategoryFilters, PaginatedResponse, Category } from "../types/admin";

/**
 * Récupère toutes les catégories
 */
export async function getCategories(filters: CategoryFilters ): Promise<PaginatedResponse<Category>> {
  try {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, String(value));
        }
      });
    }
    const res = await fetch(`/api/categories?${params.toString()}`, {
      method: 'GET',
      cache: 'no-store',
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || 'Erreur lors du chargement des catégories');
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error('Erreur getCategories:', error);
    throw error;
  }
}

export async function getAllCategories(filters: CategoryFilters ): Promise<PaginatedResponse<Category>> {
  try {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, String(value));
        }
      });
    }
    const res = await fetch(`/api/admin/services/categories?${params.toString()}`, {
      method: 'GET',
      cache: 'no-store',
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || 'Erreur lors du chargement des catégories');
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error('Erreur getCategories:', error);
    throw error;
  }
}

/**
 * Créer une nouvelle catégorie
 */
export async function createCategory(data: {
  name: string;
  description: string;
  icon: string;
  color: string;
  is_active: boolean;
  parent_id?: number;
}): Promise<Category> {
  try {
    const res = await fetch('/api/admin/services/categories', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const responseData = await res.json();

    if (!res.ok) {
      throw {
        message: responseData.message || 'Erreur lors de la création',
        field: responseData.field,
      };
    }

    return responseData;
  } catch (error) {
    console.error('Erreur createCategory:', error);
    throw error;
  }
}

/**
 * Modifier une catégorie
 */
export async function updateCategory(
  categoryId: number,
  data: Partial<Category>
): Promise<Category> {
  try {
    const res = await fetch(`/api/admin/services/categories/${categoryId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const responseData = await res.json();

    if (!res.ok) {
      throw {
        message: responseData.message || 'Erreur lors de la modification',
      };
    }

    return responseData;
  } catch (error) {
    console.error(`Erreur updateCategory ${categoryId}:`, error);
    throw error;
  }
}

/**
 * Supprimer une catégorie
 */
export async function deleteCategory(categoryId: number): Promise<{ message: string }> {
  try {
    const res = await fetch(`/api/admin/services/categories/${categoryId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const responseData = await res.json();

    if (!res.ok) {
      throw {
        message: responseData.message || 'Erreur lors de la suppression',
      };
    }

    return responseData;
  } catch (error) {
    console.error(`Erreur deleteCategory ${categoryId}:`, error);
    throw error;
  }
}

/**
 * Activer/Désactiver une catégorie
 */
export async function toggleCategoryStatus(
  categoryId: number,
  is_active: boolean
): Promise<{ message: string; category: Category }> {
  try {
    const res = await fetch(`/api/admin/services/categories/${categoryId}/toggle`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ is_active }),
    });

    const responseData = await res.json();

    if (!res.ok) {
      throw {
        message: responseData.message || 'Erreur lors du changement de statut',
      };
    }

    return responseData;
  } catch (error) {
    console.error(`Erreur toggleCategoryStatus ${categoryId}:`, error);
    throw error;
  }
}
