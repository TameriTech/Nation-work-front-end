import { ApiResponse, PaginatedResponse, User, UserFilters, PendingVerification } from '../types/admin';

/**
 * Récupère la liste des utilisateurs avec filtres
 */
export async function getUsers(filters?: UserFilters): Promise<PaginatedResponse<User>> {
  try {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, String(value));
        }
      });
    }

    const res = await fetch(`/api/admin/users?${params.toString()}`, {
      method: 'GET',
      cache: 'no-store',
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || 'Erreur lors du chargement des utilisateurs');
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error('Erreur getUsers:', error);
    throw error;
  }
}

/**
 * Récupère un utilisateur par son ID
 */
export async function getUserById(userId: number): Promise<User> {
  try {
    const res = await fetch(`/api/admin/users/${userId}`, {
      method: 'GET',
      cache: 'no-store',
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || 'Utilisateur non trouvé');
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error(`Erreur getUserById ${userId}:`, error);
    throw error;
  }
}

/**
 * Suspendre un utilisateur
 */
export async function suspendUser(
  userId: number,
  data: {
    reason: string;
    duration_days: number;
  }
): Promise<{ message: string; suspended_until: string }> {
  try {
    const res = await fetch(`/api/admin/users/${userId}/suspend`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const responseData = await res.json();

    if (!res.ok) {
      throw {
        message: responseData.message || 'Erreur lors de la suspension',
        field: responseData.field,
        code: responseData.code,
      };
    }

    return responseData;
  } catch (error) {
    console.error(`Erreur suspendUser ${userId}:`, error);
    throw error;
  }
}

/**
 * Réactiver un utilisateur suspendu
 */
export async function activateUser(userId: number): Promise<{ message: string }> {
  try {
    const res = await fetch(`/api/admin/users/${userId}/activate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const responseData = await res.json();

    if (!res.ok) {
      throw {
        message: responseData.message || 'Erreur lors de l\'activation',
      };
    }

    return responseData;
  } catch (error) {
    console.error(`Erreur activateUser ${userId}:`, error);
    throw error;
  }
}

/**
 * Supprimer un utilisateur (soft delete)
 */
export async function deleteUser(userId: number, permanent: boolean = false): Promise<{ message: string }> {
  try {
    const res = await fetch(`/api/admin/users/${userId}?permanent=${permanent}`, {
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
    console.error(`Erreur deleteUser ${userId}:`, error);
    throw error;
  }
}

/**
 * Changer le rôle d'un utilisateur
 */
export async function changeUserRole(
  userId: number,
  newRole: 'client' | 'freelancer' | 'admin'
): Promise<{ message: string; user: User }> {
  try {
    const res = await fetch(`/api/admin/users/${userId}/role`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ role: newRole }),
    });

    const responseData = await res.json();

    if (!res.ok) {
      throw {
        message: responseData.message || 'Erreur lors du changement de rôle',
      };
    }

    return responseData;
  } catch (error) {
    console.error(`Erreur changeUserRole ${userId}:`, error);
    throw error;
  }
}

/**
 * Récupère les vérifications en attente
 */
export async function getPendingVerifications(): Promise<PendingVerification[]> {
  try {
    const res = await fetch('/api/admin/users/verifications/pending', {
      method: 'GET',
      cache: 'no-store',
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || 'Erreur lors du chargement des vérifications');
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error('Erreur getPendingVerifications:', error);
    throw error;
  }
}

/**
 * Approuver une vérification de document
 */
export async function approveVerification(
  verificationId: number,
  notes?: string
): Promise<{ message: string }> {
  try {
    const res = await fetch(`/api/admin/users/verifications/${verificationId}/approve`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ notes }),
    });

    const responseData = await res.json();

    if (!res.ok) {
      throw {
        message: responseData.message || 'Erreur lors de l\'approbation',
      };
    }

    return responseData;
  } catch (error) {
    console.error(`Erreur approveVerification ${verificationId}:`, error);
    throw error;
  }
}

/**
 * Rejeter une vérification de document
 */
export async function rejectVerification(
  verificationId: number,
  reason: string
): Promise<{ message: string }> {
  try {
    const res = await fetch(`/api/admin/users/verifications/${verificationId}/reject`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ reason }),
    });

    const responseData = await res.json();

    if (!res.ok) {
      throw {
        message: responseData.message || 'Erreur lors du rejet',
        field: 'reason',
      };
    }

    return responseData;
  } catch (error) {
    console.error(`Erreur rejectVerification ${verificationId}:`, error);
    throw error;
  }
}

/**
 * Envoyer un email à un utilisateur
 */
export async function sendUserEmail(
  userId: number,
  data: {
    subject: string;
    message: string;
    template?: string;
  }
): Promise<{ message: string }> {
  try {
    const res = await fetch(`/api/admin/users/${userId}/email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const responseData = await res.json();

    if (!res.ok) {
      throw {
        message: responseData.message || 'Erreur lors de l\'envoi de l\'email',
      };
    }

    return responseData;
  } catch (error) {
    console.error(`Erreur sendUserEmail ${userId}:`, error);
    throw error;
  }
}

/**
 * Récupère l'historique d'un utilisateur
 */
export async function getUserHistory(userId: number): Promise<{
  services: any[];
  payments: any[];
  disputes: any[];
  logs: any[];
}> {
  try {
    const res = await fetch(`/api/admin/users/${userId}/history`, {
      method: 'GET',
      cache: 'no-store',
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || 'Erreur lors du chargement de l\'historique');
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error(`Erreur getUserHistory ${userId}:`, error);
    throw error;
  }
}