// app/services/mission.service.ts

import {
  Mission,
  MissionStatsResponse,
  MissionDashboardResponse,
  GetDataResponse,
  PaginatedResponse,
  MissionAttachment,
} from "@/app/types";
import {
  createMissionSchema,
  updateMissionSchema,
  missionFiltersSchema,
  MissionFiltersFormData,
  UpdateMissionFormData,
  CreateMissionFormData,
} from "@/app/lib/validators/mission.validator";
import { handleResponse } from "../lib/error-handler";

const API_BASE = '/api';

// ==================== ROUTES PUBLIQUES ====================

/**
 * Rechercher des missions avec filtres (public)
 * GET /api/missions
 */
export async function searchMissions(
  filters?: MissionFiltersFormData
): Promise<PaginatedResponse<Mission>> {
  try {
    const validatedFilters = filters ? missionFiltersSchema.parse(filters) : {};
    const params = new URLSearchParams();
    
    Object.entries(validatedFilters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, String(value));
      }
    });
    
    const res = await fetch(`${API_BASE}/missions?${params.toString()}`, {
      method: "GET",
      cache: "no-store",
      headers: { "Content-Type": "application/json" },
    });

    return await handleResponse<PaginatedResponse<Mission>>(res);
  } catch (error) {
    console.error("Erreur searchMissions:", error);
    throw error;
  }
}


/**
 * Récupérer les détails d'une mission (public)
 * GET /api/missions/{missionId}
 */
export async function getMissionDetails(missionId: string): Promise<GetDataResponse<Mission>> {
  try {
    const res = await fetch(`${API_BASE}/missions/${missionId}`, {
      method: "GET",
      cache: "no-store",
      headers: { "Content-Type": "application/json" },
    });
    return await handleResponse<GetDataResponse<Mission>>(res);
  } catch (error) {
    console.error(`Erreur getMissionDetails ${missionId}:`, error);
    throw error;
  }
}

/**
 * Récupérer les statistiques des missions pour le dashboard
 * GET /api/missions/dashboard
 */
export async function getMissionDashboard(): Promise<GetDataResponse<MissionDashboardResponse>> {
  try {
    const res = await fetch(`${API_BASE}/missions/dashboard`, {
      method: "GET",
      cache: "no-store",
      headers: { "Content-Type": "application/json" },
    });
    return await handleResponse<GetDataResponse<MissionDashboardResponse>>(res);
  } catch (error) {
    console.error("Erreur getMissionDashboard:", error);
    throw error;
  }
}

// ==================== CLIENT ROUTES ====================

/**
 * Créer une nouvelle mission (client)
 * POST /api/missions
 */
export async function createMission(payload: CreateMissionFormData): Promise<GetDataResponse<Mission>> {
  try {
    const validatedData = createMissionSchema.parse(payload);
    const res = await fetch(`${API_BASE}/missions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(validatedData),
    });
    return await handleResponse<GetDataResponse<Mission>>(res);
  } catch (error) {
    console.error("Erreur createMission:", error);
    throw error;
  }
}

/**
 * Mettre à jour une mission (client)
 * PUT /api/missions/{missionId}
 */
export async function updateMission(
  missionId: string,
  payload: UpdateMissionFormData
): Promise<GetDataResponse<Mission>> {
  try {
    const validatedData = updateMissionSchema.parse(payload);
    const res = await fetch(`${API_BASE}/missions/${missionId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(validatedData),
    });
    return await handleResponse<GetDataResponse<Mission>>(res);
  } catch (error) {
    console.error(`Erreur updateMission ${missionId}:`, error);
    throw error;
  }
}

/**
 * Supprimer une mission (client)
 * DELETE /api/missions/{missionId}
 */
export async function deleteMission(missionId: string): Promise<{ success: boolean; message: string }> {
  try {
    const res = await fetch(`${API_BASE}/missions/${missionId}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });
    return await handleResponse<{ success: boolean; message: string }>(res);
  } catch (error) {
    console.error(`Erreur deleteMission ${missionId}:`, error);
    throw error;
  }
}

/**
 * Ajouter une pièce jointe à une mission (client)
 * POST /api/missions/{missionId}/attachments
 */
export async function addMissionAttachment(
  missionId: string,
  file: File
): Promise<GetDataResponse<MissionAttachment>> {
  try {
    const formData = new FormData();
    formData.append('file', file);
    
    const res = await fetch(`${API_BASE}/missions/${missionId}/attachments`, {
      method: "POST",
      body: formData,
    });
    return await handleResponse<GetDataResponse<MissionAttachment>>(res);
  } catch (error) {
    console.error(`Erreur addMissionAttachment ${missionId}:`, error);
    throw error;
  }
}

/**
 * Supprimer une pièce jointe (client)
 * DELETE /api/missions/{missionId}/attachments/{attachmentId}
 */
export async function deleteMissionAttachment(
  missionId: string,
  attachmentId: string
): Promise<{ success: boolean; message: string }> {
  try {
    const res = await fetch(`${API_BASE}/missions/${missionId}/attachments/${attachmentId}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });
    return await handleResponse<{ success: boolean; message: string }>(res);
  } catch (error) {
    console.error(`Erreur deleteMissionAttachment ${attachmentId}:`, error);
    throw error;
  }
}

/**
 * Récupérer les statistiques des missions du client
 * GET /api/missions/stats
 */
export async function getMissionStats(): Promise<GetDataResponse<MissionStatsResponse>> {
  try {
    const res = await fetch(`${API_BASE}/missions/stats`, {
      method: "GET",
      cache: "no-store",
      headers: { "Content-Type": "application/json" },
    });
    return await handleResponse<GetDataResponse<MissionStatsResponse>>(res);
  } catch (error) {
    console.error("Erreur getMissionStats:", error);
    throw error;
  }
}

// ==================== ADMIN ROUTES ====================

/**
 * Récupérer toutes les missions (admin)
 * GET /api/admin/missions
 */
export async function getAdminMissions(
  filters?: MissionFiltersFormData & { include_deleted?: boolean }
): Promise<PaginatedResponse<Mission>> {
  try {
    const params = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, String(value));
        }
      });
    }
    
    const res = await fetch(`${API_BASE}/admin/missions?${params.toString()}`, {
      method: "GET",
      cache: "no-store",
      headers: { "Content-Type": "application/json" },
    });

    return await handleResponse<PaginatedResponse<Mission>>(res);
  } catch (error) {
    console.error("Erreur getAdminMissions:", error);
    throw error;
  }
}

/**
 * Récupérer les détails d'une mission (admin)
 * GET /api/admin/missions/{missionId}
 */
export async function getAdminMissionDetails(missionId: string): Promise<GetDataResponse<Mission>> {
  try {
    const res = await fetch(`${API_BASE}/admin/missions/${missionId}`, {
      method: "GET",
      cache: "no-store",
      headers: { "Content-Type": "application/json" },
    });
    return await handleResponse<GetDataResponse<Mission>>(res);
  } catch (error) {
    console.error(`Erreur getAdminMissionDetails ${missionId}:`, error);
    throw error;
  }
}

/**
 * Récupérer les missions d'un utilisateur (admin)
 * GET /api/admin/users/{userId}/missions
 */
export async function getUserMissions(userId: string): Promise<GetDataResponse<Mission[]>> {
  try {
    const res = await fetch(`${API_BASE}/admin/users/${userId}/missions`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    return await handleResponse<GetDataResponse<Mission[]>>(res);
  } catch (error) {
    console.error('Erreur getUserMissions:', error);
    throw error;
  }
}

/**
 * Mettre à jour le statut d'une mission (admin)
 * PATCH /api/admin/missions/{missionId}/status
 */
export async function updateMissionStatus(
  missionId: string,
  status: string,
  reason?: string
): Promise<GetDataResponse<Mission>> {
  try {
    const res = await fetch(`${API_BASE}/admin/missions/${missionId}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, reason }),
    });
    return await handleResponse<GetDataResponse<Mission>>(res);
  } catch (error) {
    console.error(`Erreur updateMissionStatus ${missionId}:`, error);
    throw error;
  }
}

/**
 * Supprimer une mission (admin)
 * DELETE /api/admin/missions/{missionId}
 */
export async function adminDeleteMission(
  missionId: string,
  permanent: boolean = false
): Promise<{ success: boolean; message: string }> {
  try {
    const res = await fetch(`${API_BASE}/admin/missions/${missionId}?permanent=${permanent}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });
    return await handleResponse<{ success: boolean; message: string }>(res);
  } catch (error) {
    console.error(`Erreur adminDeleteMission ${missionId}:`, error);
    throw error;
  }
}
