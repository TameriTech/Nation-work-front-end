// services/candidatures.service.ts
import { 
  Candidature, 
  ClientCandidature,
  providerCandidature,
  CreateCandidatureDto, 
  UpdateCandidatureStatusDto,
  AcceptCandidatureResponse,
  RejectCandidatureResponse,
  WithdrawCandidatureResponse,
  ShortlistCandidatureResponse,
  CandidatureStats,
  providerCandidatureStats,
  ServiceCandidatureStats,
  PaginatedResponse,
  CheckCanApplyResponse,
  CandidateDialogResponse
} from "@/app/types";
import { 
  CreateCandidatureFormData,
  UpdateCandidatureStatusFormData,
  ShortlistCandidatureFormData,
  RejectCandidatureFormData,
  WithdrawCandidatureFormData,
  AcceptCandidatureFormData,
  CandidatureFiltersFormData,
  CreateCandidatureSchema,
  UpdateCandidatureStatusSchema,
  ShortlistCandidatureSchema,
  RejectCandidatureSchema,
  WithdrawCandidatureSchema,
  AcceptCandidatureSchema,
  CandidatureFiltersSchema
} from "../lib/validators/candidature.validator";
import { handleResponse } from "@/app/lib/error-handler";

// ==================== APPLICATION ROUTES ====================

/**
 * Postuler à un service (provider)
 * POST /api/candidatures/apply
 */
export async function applyForService(
  payload: CreateCandidatureFormData
): Promise<Candidature> {
  try {
    const validatedData = CreateCandidatureSchema.parse(payload);
    const res = await fetch("/api/candidatures/apply", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(validatedData),
    });
    return await handleResponse<Candidature>(res);
  } catch (error) {
    console.error("Erreur applyForService:", error);
    throw error;
  }
}

/**
 * Vérifier si un provider peut postuler à un service
 * GET /api/candidatures/service/check/{service_code}
 */
export async function checkCanApply(serviceCode: string): Promise<CheckCanApplyResponse> {
  try {
    const res = await fetch(`/api/services/${serviceCode}/candidatures/check`, {
      method: "GET",
      cache: "no-store",
      headers: { "Content-Type": "application/json" },
    });
    return await handleResponse<CheckCanApplyResponse>(res);
  } catch (error) {
    console.error(`Erreur checkCanApply ${serviceCode}:`, error);
    throw error;
  }
}

// ==================== CLIENT ROUTES ====================

/**
 * Récupérer toutes les candidatures pour les services du client
 * GET /api/candidatures/client
 */
export async function getClientCandidatures(
  filters?: CandidatureFiltersFormData
): Promise<PaginatedResponse<ClientCandidature>> {
  try {
    const validatedFilters = filters ? CandidatureFiltersSchema.parse(filters) : {};
    const params = new URLSearchParams();
    
    Object.entries(validatedFilters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, String(value));
      }
    });
    
    const res = await fetch(`/api/candidatures/client?${params.toString()}`, {
      method: "GET",
      cache: "no-store",
      headers: { "Content-Type": "application/json" },
    });
    return await handleResponse<PaginatedResponse<ClientCandidature>>(res);
  } catch (error) {
    console.error("Erreur getClientCandidatures:", error);
    throw error;
  }
}



/**
 * Récupérer les candidatures pour un service spécifique (client)
 * GET /api/candidatures/client/service/{service_id}
 */
export async function getServiceCandidatures(
  serviceId: number,
  filters?: CandidatureFiltersFormData
): Promise<PaginatedResponse<Candidature>> {
  try {
    const validatedFilters = filters ? CandidatureFiltersSchema.parse(filters) : {};
    const params = new URLSearchParams();
    
    Object.entries(validatedFilters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, String(value));
      }
    });
    
    const res = await fetch(`/api/candidatures/client/service/${serviceId}?${params.toString()}`, {
      method: "GET",
      cache: "no-store",
      headers: { "Content-Type": "application/json" },
    });
    return await handleResponse<PaginatedResponse<Candidature>>(res);
  } catch (error) {
    console.error(`Erreur getServiceCandidatures ${serviceId}:`, error);
    throw error;
  }
}

/**
 * Récupérer les détails d'une candidature
 * GET /api/candidatures/{candidature_id}
 */
export async function getCandidatureDetails(candidatureId: number): Promise<CandidateDialogResponse> {
  try {
    const res = await fetch(`/api/candidatures/${candidatureId}/dialog`, {
      method: "GET",
      cache: "no-store",
      headers: { "Content-Type": "application/json" },
    });
    return await handleResponse<CandidateDialogResponse>(res);
  } catch (error) {
    console.error(`Erreur getCandidatureDetails ${candidatureId}:`, error);
    throw error;
  }
}

/**
 * Accepter une candidature (client)
 * PUT /api/candidatures/{candidature_id}/accept
 */
export async function acceptCandidature(
  candidatureId: number,
): Promise<AcceptCandidatureResponse> {
  try {
    const res = await fetch(`/api/candidatures/${candidatureId}/accept`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
    });
    return await handleResponse<AcceptCandidatureResponse>(res);
  } catch (error) {
    console.error(`Erreur acceptCandidature ${candidatureId}:`, error);
    throw error;
  }
}

/**
 * Rejeter une candidature (client)
 * PUT /api/candidatures/{candidature_id}/reject
 */
export async function rejectCandidature(
  candidatureId: number,
  payload?: RejectCandidatureFormData
): Promise<RejectCandidatureResponse> {
  try {
    const validatedData = payload ? RejectCandidatureSchema.parse(payload) : {};
    const params = new URLSearchParams();
    if (validatedData.rejection_reason) {
      params.append('rejection_reason', validatedData.rejection_reason);
    }
    
    const url = params.toString() 
      ? `/api/candidatures/${candidatureId}/reject?${params.toString()}`
      : `/api/candidatures/${candidatureId}/reject`;
    
    const res = await fetch(url, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
    });
    return await handleResponse<RejectCandidatureResponse>(res);
  } catch (error) {
    console.error(`Erreur rejectCandidature ${candidatureId}:`, error);
    throw error;
  }
}

/**
 * Mettre en présélection une candidature (client)
 * PUT /api/candidatures/{candidature_id}/shortlist
 */
export async function shortlistCandidature(
  candidatureId: number,
  payload?: ShortlistCandidatureFormData
): Promise<ShortlistCandidatureResponse> {
  try {
    const validatedData = payload ? ShortlistCandidatureSchema.parse(payload) : { is_shortlisted: true };
    const params = new URLSearchParams();
    if (validatedData.shortlist_notes) {
      params.append('notes', validatedData.shortlist_notes);
    }
    
    const url = params.toString() 
      ? `/api/candidatures/${candidatureId}/shortlist?${params.toString()}`
      : `/api/candidatures/${candidatureId}/shortlist`;
    
    const res = await fetch(url, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
    });
    return await handleResponse<ShortlistCandidatureResponse>(res);
  } catch (error) {
    console.error(`Erreur shortlistCandidature ${candidatureId}:`, error);
    throw error;
  }
}

/**
 * Marquer une candidature comme vue (client)
 * POST /api/candidatures/{candidature_id}/view
 */
export async function markCandidatureAsViewed(candidatureId: number): Promise<{ message: string }> {
  try {
    const res = await fetch(`/api/candidatures/${candidatureId}/view`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });
    return await handleResponse<{ message: string }>(res);
  } catch (error) {
    console.error(`Erreur markCandidatureAsViewed ${candidatureId}:`, error);
    throw error;
  }
}

// ==================== provider ROUTES ====================

/**
 * Récupérer les candidatures du provider connecté
 * GET /api/candidatures/provider
 */
export async function getproviderCandidatures(
  filters?: CandidatureFiltersFormData
): Promise<PaginatedResponse<providerCandidature>> {
  try {
    const validatedFilters = filters ? CandidatureFiltersSchema.parse(filters) : {};
    const params = new URLSearchParams();
    
    Object.entries(validatedFilters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, String(value));
      }
    });
    
    const res = await fetch(`/api/candidatures/provider?${params.toString()}`, {
      method: "GET",
      cache: "no-store",
      headers: { "Content-Type": "application/json" },
    });
    return await handleResponse<PaginatedResponse<providerCandidature>>(res);
  } catch (error) {
    console.error("Erreur getproviderCandidatures:", error);
    throw error;
  }
}

/**
 * Retirer une candidature (provider)
 * PUT /api/candidatures/{candidature_id}/withdraw
 */
export async function withdrawCandidature(
  candidatureId: number,
  payload?: WithdrawCandidatureFormData
): Promise<WithdrawCandidatureResponse> {
  try {
    const validatedData = payload ? WithdrawCandidatureSchema.parse(payload) : {};
    const params = new URLSearchParams();
    if (validatedData.reason) {
      params.append('reason', validatedData.reason);
    }
    
    const url = params.toString() 
      ? `/api/candidatures/${candidatureId}/withdraw?${params.toString()}`
      : `/api/candidatures/${candidatureId}/withdraw`;
    
    const res = await fetch(url, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
    });
    return await handleResponse<WithdrawCandidatureResponse>(res);
  } catch (error) {
    console.error(`Erreur withdrawCandidature ${candidatureId}:`, error);
    throw error;
  }
}

// ==================== STATS ROUTES ====================

/**
 * Récupérer les statistiques des candidatures
 * GET /api/candidatures/stats
 */
export async function getCandidatureStats(
  serviceId?: number
): Promise<CandidatureStats> {
  try {
    const params = new URLSearchParams();
    if (serviceId) params.append('service_id', serviceId.toString());
    
    const url = params.toString() 
      ? `/api/candidatures/stats?${params.toString()}`
      : "/api/candidatures/stats";
    
    const res = await fetch(url, {
      method: "GET",
      cache: "no-store",
      headers: { "Content-Type": "application/json" },
    });
    return await handleResponse<CandidatureStats>(res);
  } catch (error) {
    console.error("Erreur getCandidatureStats:", error);
    throw error;
  }
}

// ==================== ADMIN ROUTES ====================

/**
 * Récupérer toutes les candidatures (admin)
 * GET /api/candidatures/admin/all
 */
export async function getAllCandidatures(
  filters?: CandidatureFiltersFormData & {
    provider_id?: number;
  }
): Promise<PaginatedResponse<Candidature>> {
  try {
    const params = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, String(value));
        }
      });
    }
    
    const res = await fetch(`/api/candidatures/admin/all?${params.toString()}`, {
      method: "GET",
      cache: "no-store",
      headers: { "Content-Type": "application/json" },
    });
    return await handleResponse<PaginatedResponse<Candidature>>(res);
  } catch (error) {
    console.error("Erreur getAllCandidatures:", error);
    throw error;
  }
}

/**
 * Supprimer une candidature (super admin)
 * DELETE /api/candidatures/admin/{candidature_id}
 */
export async function adminDeleteCandidature(candidatureId: number): Promise<{ message: string }> {
  try {
    const res = await fetch(`/api/candidatures/admin/${candidatureId}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });
    return await handleResponse<{ message: string }>(res);
  } catch (error) {
    console.error(`Erreur adminDeleteCandidature ${candidatureId}:`, error);
    throw error;
  }
}

// ==================== UTILITY FUNCTIONS ====================

/**
 * Récupère les statistiques des candidatures pour un provider
 */
export async function getproviderCandidatureStats(
  providerId: number
): Promise<providerCandidatureStats> {
  try {
    const candidatures: PaginatedResponse<Candidature> = await getproviderCandidatures({ page: 1, per_page: 1000 });
    
    const total = candidatures.items.length;
    const pending = candidatures.items.filter((c: Candidature) => c.status === "pending").length;
    const accepted = candidatures.items.filter((c: Candidature) => c.status === "accepted").length;
    const rejected = candidatures.items.filter((c: Candidature) => c.status === "rejected").length;
    const withdrawn = candidatures.items.filter((c: Candidature) => c.status === "withdrawn").length;
    const shortlisted = candidatures.items.filter((c: Candidature) => c.is_shortlisted).length;
    const taux_reussite = total > 0 ? (accepted / total) * 100 : 0;

    return {
      total,
      pending,
      accepted,
      rejected,
      withdrawn,
      shortlisted,
      taux_reussite
    };
  } catch (error) {
    console.error(`Erreur getproviderCandidatureStats ${providerId}:`, error);
    throw error;
  }
}

/**
 * Récupère les statistiques des candidatures pour un service
 */
export async function getServiceCandidatureStats(
  serviceId: number
): Promise<ServiceCandidatureStats> {
  try {
    const response = await getServiceCandidatures(serviceId, {page: 1, per_page: 1000 });
    
    return {
      total: response.total,
      pending: response.items.filter((c: Candidature) => c.status === "pending").length,
      accepted: response.items.filter((c: Candidature) => c.status === "accepted").length,
      rejected: response.items.filter((c: Candidature) => c.status === "rejected").length,
      shortlisted: response.items.filter((c: Candidature) => c.is_shortlisted).length,
    };
  } catch (error) {
    console.error(`Erreur getServiceCandidatureStats ${serviceId}:`, error);
    throw error;
  }
}

/**
 * Vérifie si un provider a déjà postulé à un service
 */
export async function hasproviderApplied(
  providerId: number,
  serviceId: number
): Promise<boolean> {
  try {
    const result = await checkCanApply(serviceId);
    return !result.can_apply && result.reason === "You have already applied";
  } catch (error) {
    console.error(`Erreur hasproviderApplied:`, error);
    throw error;
  }
}

export async function updateCandidatureStatus(
  candidatureId: number,
  payload: UpdateCandidatureStatusFormData,
): Promise<Candidature> {
  try {
    const validatedData = UpdateCandidatureStatusSchema.parse(payload);
    const res = await fetch(`/api/candidatures/${candidatureId}/status`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(validatedData),
    });
    return await handleResponse<Candidature>(res);
  } catch (error) {
    console.error(`Erreur updateCandidatureStatus ${candidatureId}:`, error);
    throw error;
  }
}


/**
 * Récupère une candidature par son ID
 */
export async function getCandidatureById(
  candidatureId: number
): Promise<Candidature> {
  try {
    // Note: Il n'y a pas d'endpoint direct pour récupérer une candidature par ID
    // On peut utiliser les endpoints admin ou filtrer les listes
    const adminResponse = await getAllCandidatures({page: 1, per_page: 100 });
    const candidature = adminResponse.items.find((c: Candidature) => c.id === candidatureId);
    
    if (!candidature) {
      throw new Error(`Candidature ${candidatureId} not found`);
    }
    
    return candidature;
  } catch (error) {
    console.error(`Erreur getCandidatureById ${candidatureId}:`, error);
    throw error;
  }
}
