import {
  //Service,
  CreateServicePayload,
  UpdateServicePayload,
} from "@/app/types/services";

export async function createService(
  payload: CreateServicePayload
): Promise<Service> {
  const res = await fetch("/api/services/publish", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw new Error("Failed to create service");
  return res.json();
}

//export async function getServices(): Promise<Service[]> {
//  const res = await fetch("/api/services", {
//    method: "GET",
//    cache: "no-store",
//  });
//
//  if (!res.ok) throw new Error("Failed to fetch services");
//  return res.json();
//}

export async function getService(serviceId: number): Promise<Service> {
  const res = await fetch(`/api/services/${serviceId}`, {
    method: "GET",
    cache: "no-store",
  });

  if (!res.ok) throw new Error("Failed to fetch service");
  return res.json();
}

export async function getClientServices(): Promise<Service[]> {
  const res = await fetch("/api/services/client/list", {
    method: "GET",
    cache: "no-store",
  });

  if (!res.ok) throw new Error("Failed to fetch client services");
  return res.json();
}

export async function searchServices(
  query: string
): Promise<Service[]> {
  const res = await fetch(
    `/api/services/search?query=${encodeURIComponent(query)}`,
    { method: "GET", cache: "no-store" }
  );

  if (!res.ok) throw new Error("Failed to search services");
  return res.json();
}

export async function updateService(
  serviceId: number,
  payload: UpdateServicePayload
): Promise<Service> {
  const res = await fetch(`/api/services/${serviceId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw new Error("Failed to update service");
  return res.json();
}

export async function destroyService(
  serviceId: number
): Promise<void> {
  const res = await fetch(`/api/services/${serviceId}`, {
    method: "DELETE",
  });

  if (!res.ok) throw new Error("Failed to delete service");
}

export async function getServicesByFreelancer(
  freelancerId: number
): Promise<Service[]> {
  const res = await fetch(
    `/api/services/freelancer/${freelancerId}`,
    { method: "GET", cache: "no-store" }
  );

  if (!res.ok) throw new Error("Failed to fetch freelancer services");
  return res.json();
}

export async function assignFreelancerToService(
  serviceId: number,
  freelancerId: number
): Promise<Service> {
  const res = await fetch(
    `/api/services/${serviceId}/assign`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ freelancer_id: freelancerId }),
    }
  );

  if (!res.ok) throw new Error("Failed to assign freelancer");
  return res.json();
}

export async function markServiceAsCompleted(
  serviceId: number
): Promise<Service> {
  const res = await fetch(
    `/api/services/${serviceId}/complete`,
    { method: "POST" }
  );

  if (!res.ok) throw new Error("Failed to mark service as completed");
  return res.json();
}

export async function uploadServiceImages(
  serviceId: number,
  images: string[]
): Promise<Service> {
  const res = await fetch(
    `/api/services/${serviceId}/images`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ images }),
    }
  );

  if (!res.ok) throw new Error("Failed to upload service images");
  return res.json();
}

export async function removeServiceImage(
  serviceId: number,
  imageId: number
): Promise<Service> {
  const res = await fetch(
    `/api/services/${serviceId}/images/${imageId}`,
    { method: "DELETE" }
  );

  if (!res.ok) throw new Error("Failed to remove service image");
  return res.json();
}




// New code

import { ApiResponse, PaginatedResponse, Service, ServiceFilters } from '../types/admin';

/**
 * Récupère la liste des services/missions avec filtres
 */
export async function getServices(filters?: ServiceFilters): Promise<PaginatedResponse<Service>> {
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
      method: 'GET',
      cache: 'no-store',
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || 'Erreur lors du chargement des services');
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error('Erreur getServices:', error);
    throw error;
  }
}

/**
 * Récupère un service par son ID
 */
export async function getServiceById(serviceId: number): Promise<Service> {
  try {
    const res = await fetch(`/api/admin/services/${serviceId}`, {
      method: 'GET',
      cache: 'no-store',
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || 'Service non trouvé');
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error(`Erreur getServiceById ${serviceId}:`, error);
    throw error;
  }
}

/**
 * Modifier le statut d'un service
 */
export async function updateServiceStatus(
  serviceId: number,
  status: 'published' | 'assigned' | 'in_progress' | 'completed' | 'cancelled' | 'disputed',
  reason?: string
): Promise<{ message: string; service: Service }> {
  try {
    const res = await fetch(`/api/admin/services/${serviceId}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status, reason }),
    });

    const responseData = await res.json();

    if (!res.ok) {
      throw {
        message: responseData.message || 'Erreur lors du changement de statut',
      };
    }

    return responseData;
  } catch (error) {
    console.error(`Erreur updateServiceStatus ${serviceId}:`, error);
    throw error;
  }
}

/**
 * Annuler un service (avec raison)
 */
export async function cancelService(
  serviceId: number,
  reason: string,
  notify_users: boolean = true
): Promise<{ message: string }> {
  try {
    const res = await fetch(`/api/admin/services/${serviceId}/cancel`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ reason, notify_users }),
    });

    const responseData = await res.json();

    if (!res.ok) {
      throw {
        message: responseData.message || 'Erreur lors de l\'annulation',
        field: responseData.field,
      };
    }

    return responseData;
  } catch (error) {
    console.error(`Erreur cancelService ${serviceId}:`, error);
    throw error;
  }
}

/**
 * Supprimer un service
 */
export async function deleteService(serviceId: number): Promise<{ message: string }> {
  try {
    const res = await fetch(`/api/admin/services/${serviceId}`, {
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
    console.error(`Erreur deleteService ${serviceId}:`, error);
    throw error;
  }
}

/**
 * Récupère les statistiques des services
 */
export async function getServicesStats(): Promise<{
  total: number;
  by_status: Record<string, number>;
  by_category: Record<string, number>;
  average_budget: number;
  completion_rate: number;
}> {
  try {
    const res = await fetch('/api/admin/services/stats', {
      method: 'GET',
      cache: 'no-store',
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || 'Erreur lors du chargement des statistiques');
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error('Erreur getServicesStats:', error);
    throw error;
  }
}