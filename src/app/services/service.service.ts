// ===== FILE: app/services/service.service.ts =====

import { 
  Service, 
  CreateServiceDto, 
  PaginatedResponse,
  ServiceFilters,
  ServiceStats,
  WishlistItem,
  ServiceStatus
} from "@/app/types/services";
import { handleResponse } from "../lib/error-handler";

// ==================== CLIENT ROUTES ====================

/**
 * Publier un nouveau service (client)
 */
export async function publishService(payload: CreateServiceDto): Promise<Service> {
  try {
    const res = await fetch("/api/services/publish", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    return await handleResponse<Service>(res);
  } catch (error) {
    console.error("Erreur publishService:", error);
    throw error;
  }
}

/**
 * Récupérer les services du client connecté
 */
export async function getClientServices(
  filters?: ServiceFilters
): Promise<PaginatedResponse<Service>> {
  try {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, String(value));
        }
      });
    }
    
    const res = await fetch(`/api/services/client/list?${params.toString()}`, {
      method: "GET",
      cache: "no-store",
    });

    return await handleResponse<PaginatedResponse<Service>>(res);
  } catch (error) {
    console.error("Erreur getClientServices:", error);
    throw error;
  }
}

/**
 * Récupérer les détails d'un service avec ses candidats (client)
 */
export async function getClientServiceDetails(serviceId: number): Promise<{
  service: Service;
  candidates: any[];
  images: string[];
}> {
  try {
    const res = await fetch(`/api/services/client/${serviceId}`, {
      method: "GET",
      cache: "no-store",
    });

    return await handleResponse<{
      service: Service;
      candidates: any[];
      images: string[];
    }>(res);
  } catch (error) {
    console.error(`Erreur getClientServiceDetails ${serviceId}:`, error);
    throw error;
  }
}

/**
 * Mettre à jour un service (client)
 */
export async function updateService(
  serviceId: number,
  payload: Partial<CreateServiceDto>
): Promise<Service> {
  try {
    const res = await fetch(`/api/services/${serviceId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    return await handleResponse<Service>(res);
  } catch (error) {
    console.error(`Erreur updateService ${serviceId}:`, error);
    throw error;
  }
}

/**
 * Supprimer un service (client)
 */
export async function deleteService(serviceId: number): Promise<{ message: string }> {
  try {
    const res = await fetch(`/api/services/${serviceId}`, {
      method: "DELETE",
    });

    return await handleResponse<{ message: string }>(res);
  } catch (error) {
    console.error(`Erreur deleteService ${serviceId}:`, error);
    throw error;
  }
}

/**
 * Assigner un freelance à un service (client)
 */
export async function assignFreelancer(
  serviceId: number,
  freelancerId: number
): Promise<{ message: string; service: Service }> {
  try {
    const res = await fetch(`/api/services/${serviceId}/assign`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ freelancerId }),
    });

    return await handleResponse<{ message: string; service: Service }>(res);
  } catch (error) {
    console.error(`Erreur assignFreelancer ${serviceId}:`, error);
    throw error;
  }
}

/**
 * Marquer un service comme terminé (client/freelancer)
 */
export async function completeService(serviceId: number): Promise<{ message: string; service: Service }> {
  try {
    const res = await fetch(`/api/services/${serviceId}/complete`, {
      method: "POST",
    });

    return await handleResponse<{ message: string; service: Service }>(res);
  } catch (error) {
    console.error(`Erreur completeService ${serviceId}:`, error);
    throw error;
  }
}

// ==================== FREELANCER ROUTES ====================

/**
 * Rechercher des services avec filtres (freelancer)
 */
export async function searchServices(
  filters?: ServiceFilters
): Promise<PaginatedResponse<Service>> {
  try {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, String(value));
        }
      });
    }
    
    const res = await fetch(`/api/services/search?${params.toString()}`, {
      method: "GET",
      cache: "no-store",
    });

    return await handleResponse<PaginatedResponse<Service>>(res);
  } catch (error) {
    console.error("Erreur searchServices:", error);
    throw error;
  }
}

/**
 * Récupérer les détails d'un service (freelancer)
 */
export async function getServiceDetails(serviceId: number): Promise<Service> {
  try {
    const res = await fetch(`/api/services/${serviceId}`, {
      method: "GET",
      cache: "no-store",
    });

    return await handleResponse<Service>(res);
  } catch (error) {
    console.error(`Erreur getServiceDetails ${serviceId}:`, error);
    throw error;
  }
}

/**
 * Récupérer les services du freelance (assignés ou postulés)
 */
export async function getFreelancerServices(
  filters?: ServiceFilters
): Promise<PaginatedResponse<Service>> {
  try {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, String(value));
        }
      });
    }
    
    const res = await fetch(`/api/services/freelancer/list?${params.toString()}`, {
      method: "GET",
      cache: "no-store",
    });

    return await handleResponse<PaginatedResponse<Service>>(res);
  } catch (error) {
    console.error("Erreur getFreelancerServices:", error);
    throw error;
  }
}

// ==================== WISHLIST ROUTES ====================

/**
 * Ajouter un service aux favoris
 */
export async function addToWishlist(serviceId: number): Promise<{ message: string }> {
  try {
    const res = await fetch(`/api/services/wishlist/${serviceId}`, {
      method: "POST",
    });

    return await handleResponse<{ message: string }>(res);
  } catch (error) {
    console.error(`Erreur addToWishlist ${serviceId}:`, error);
    throw error;
  }
}

/**
 * Retirer un service des favoris
 */
export async function removeFromWishlist(serviceId: number): Promise<{ message: string }> {
  try {
    const res = await fetch(`/api/services/wishlist/${serviceId}`, {
      method: "DELETE",
    });

    return await handleResponse<{ message: string }>(res);
  } catch (error) {
    console.error(`Erreur removeFromWishlist ${serviceId}:`, error);
    throw error;
  }
}

/**
 * Récupérer la wishlist de l'utilisateur
 */
export async function getWishlist(
  page: number = 1,
  per_page: number = 20
): Promise<{ items: WishlistItem[]; total: number; page: number; per_page: number }> {
  try {
    const res = await fetch(`/api/services/wishlist/list?page=${page}&per_page=${per_page}`, {
      method: "GET",
      cache: "no-store",
    });

    return await handleResponse<{ items: WishlistItem[]; total: number; page: number; per_page: number }>(res);
  } catch (error) {
    console.error("Erreur getWishlist:", error);
    throw error;
  }
}

// ==================== ADMIN ROUTES ====================

/**
 * Récupérer tous les services (admin)
 */
export async function getAdminServices(
  filters?: ServiceFilters
): Promise<PaginatedResponse<Service>> {
  try {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, String(value));
        }
      });
    }
    
    const res = await fetch(`/api/admin/services?${params.toString()}`, {
      method: "GET",
      cache: "no-store",
    });

    return await handleResponse<PaginatedResponse<Service>>(res);
  } catch (error) {
    console.error("Erreur getAdminServices:", error);
    throw error;
  }
}

/**
 * Récupérer les détails d'un service (admin)
 */
export async function getAdminServiceDetails(serviceId: number): Promise<Service> {
  try {
    const res = await fetch(`/api/admin/services/${serviceId}`, {
      method: "GET",
      cache: "no-store",
    });

    return await handleResponse<Service>(res);
  } catch (error) {
    console.error(`Erreur getAdminServiceDetails ${serviceId}:`, error);
    throw error;
  }
}

/**
 * Récupérer les statistiques des services (admin)
 */
export async function getServicesStats(): Promise<ServiceStats> {
  try {
    const res = await fetch("/api/admin/services/stats", {
      method: "GET",
      cache: "no-store",
    });

    return await handleResponse<ServiceStats>(res);
  } catch (error) {
    console.error("Erreur getServicesStats:", error);
    throw error;
  }
}

/**
 * Mettre à jour le statut d'un service (admin)
 */
export async function updateServiceStatus(
  serviceId: number,
  status: ServiceStatus,
  reason?: string
): Promise<{ message: string; service: Service }> {
  try {
    const res = await fetch(`/api/admin/services/${serviceId}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status, reason }),
    });

    return await handleResponse<{ message: string; service: Service }>(res);
  } catch (error) {
    console.error(`Erreur updateServiceStatus ${serviceId}:`, error);
    throw error;
  }
}

/**
 * Supprimer un service (admin)
 */
export async function adminDeleteService(
  serviceId: number
): Promise<{ message: string }> {
  try {
    const res = await fetch(`/api/admin/services/${serviceId}/delete`, {
      method: "DELETE",
    });

    return await handleResponse<{ message: string }>(res);
  } catch (error) {
    console.error(`Erreur adminDeleteService ${serviceId}:`, error);
    throw error;
  }
}

/**
 * Annuler un service (admin)
 */
export async function adminCancelService(
  serviceId: number,
  reason: string
): Promise<{ message: string; service: Service }> {
  try {
    const res = await fetch(`/api/admin/services/${serviceId}/cancel`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ reason }),
    });

    return await handleResponse<{ message: string; service: Service }>(res);
  } catch (error) {
    console.error(`Erreur adminCancelService ${serviceId}:`, error);
    throw error;
  }
}
