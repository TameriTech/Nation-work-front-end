// services/candidatures.service.ts

import { Candidature, CreateCandidatureDto, UpdateCandidatureStatusDto } from "@/app/types/candidatures";
import { handleResponse } from "@/app/lib/error-handler";

// ==================== RÉCUPÉRATION ====================

/**
 * Récupère les candidatures d'un freelancer
 */
export async function getCandidaturesByFreelancer(
  freelancerId: number
): Promise<Candidature[]> {
  try {
    const res = await fetch(
      `/api/candidatures/freelancer`,
      {
        method: "GET",
        cache: "no-store",
      }
    );

    return await handleResponse<Candidature[]>(res);
  } catch (error) {
    console.error(`Erreur getCandidaturesByFreelancer ${freelancerId}:`, error);
    throw error;
  }
}

/**
 * Récupère les candidatures pour un service spécifique
 */
export async function getServiceCandidatures(
  serviceId: number
): Promise<Candidature[]> {
  try {
    const res = await fetch(
      `/api/candidatures/service/${serviceId}`,
      {
        method: "GET",
        cache: "no-store",
      }
    );

    return await handleResponse<Candidature[]>(res);
  } catch (error) {
    console.error(`Erreur getServiceCandidatures ${serviceId}:`, error);
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
    const res = await fetch(
      `/api/candidatures/${candidatureId}`,
      {
        method: "GET",
        cache: "no-store",
      }
    );

    return await handleResponse<Candidature>(res);
  } catch (error) {
    console.error(`Erreur getCandidatureById ${candidatureId}:`, error);
    throw error;
  }
}

// ==================== CRÉATION ====================

/**
 * Crée une nouvelle candidature
 */
export async function createCandidature(
  payload: CreateCandidatureDto
): Promise<Candidature> {
  try {
    const res = await fetch("/api/candidatures", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    return await handleResponse<Candidature>(res);
  } catch (error) {
    console.error("Erreur createCandidature:", error);
    throw error;
  }
}

// ==================== MISE À JOUR ====================

/**
 * Met à jour le statut d'une candidature
 */
export async function updateCandidatureStatus(
  candidatureId: number,
  status: UpdateCandidatureStatusDto["status"],
  options?: {
    rejection_reason?: string;
    message?: string;
  }
): Promise<Candidature> {
  try {
    const payload: UpdateCandidatureStatusDto = {
      status,
      ...options
    };

    const res = await fetch(
      `/api/candidatures/${candidatureId}/status`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );

    return await handleResponse<Candidature>(res);
  } catch (error) {
    console.error(`Erreur updateCandidatureStatus ${candidatureId}:`, error);
    throw error;
  }
}

/**
 * Accepte une candidature
 */
export async function acceptCandidature(
  candidatureId: number,
  message?: string
): Promise<Candidature> {
  return updateCandidatureStatus(candidatureId, "accepted", { message });
}

/**
 * Refuse une candidature
 */
export async function rejectCandidature(
  candidatureId: number,
  rejection_reason?: string
): Promise<Candidature> {
  return updateCandidatureStatus(candidatureId, "rejected", { rejection_reason });
}

/**
 * Met une candidature en attente
 */
export async function pendCandidature(
  candidatureId: number
): Promise<Candidature> {
  return updateCandidatureStatus(candidatureId, "pending");
}

// ==================== SUPPRESSION ====================

/**
 * Supprime une candidature
 */
export async function deleteCandidature(
  candidatureId: number
): Promise<void> {
  try {
    const res = await fetch(
      `/api/candidatures/${candidatureId}`,
      {
        method: "DELETE",
      }
    );

    await handleResponse<{ success: boolean }>(res);
  } catch (error) {
    console.error(`Erreur deleteCandidature ${candidatureId}:`, error);
    throw error;
  }
}

// ==================== STATISTIQUES ====================

/**
 * Récupère les statistiques des candidatures pour un freelancer
 */
export async function getFreelancerCandidatureStats(
  freelancerId: number
): Promise<{
  total: number;
  pending: number;
  accepted: number;
  rejected: number;
  taux_reussite: number;
}> {
  try {
    const candidatures = await getCandidaturesByFreelancer(freelancerId);
    
    const total = candidatures.length;
    const pending = candidatures.filter(c => c.status === "pending").length;
    const accepted = candidatures.filter(c => c.status === "accepted").length;
    const rejected = candidatures.filter(c => c.status === "rejected").length;
    const taux_reussite = total > 0 ? (accepted / total) * 100 : 0;

    return {
      total,
      pending,
      accepted,
      rejected,
      taux_reussite
    };
  } catch (error) {
    console.error(`Erreur getFreelancerCandidatureStats ${freelancerId}:`, error);
    throw error;
  }
}

/**
 * Récupère les statistiques des candidatures pour un service
 */
export async function getServiceCandidatureStats(
  serviceId: number
): Promise<{
  total: number;
  pending: number;
  accepted: number;
  rejected: number;
}> {
  try {
    const candidatures = await getServiceCandidatures(serviceId);
    
    return {
      total: candidatures.length,
      pending: candidatures.filter(c => c.status === "pending").length,
      accepted: candidatures.filter(c => c.status === "accepted").length,
      rejected: candidatures.filter(c => c.status === "rejected").length,
    };
  } catch (error) {
    console.error(`Erreur getServiceCandidatureStats ${serviceId}:`, error);
    throw error;
  }
}

// ==================== VÉRIFICATION ====================

/**
 * Vérifie si un freelancer a déjà postulé à un service
 */
export async function hasFreelancerApplied(
  freelancerId: number,
  serviceId: number
): Promise<boolean> {
  try {
    const candidatures = await getCandidaturesByFreelancer(freelancerId);
    return candidatures.some(c => c.service_id === serviceId);
  } catch (error) {
    console.error(`Erreur hasFreelancerApplied:`, error);
    throw error;
  }
}
