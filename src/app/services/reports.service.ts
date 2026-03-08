// services/admin/reports.service.ts

import type {
  ReportStats,
  RevenueData,
  ServicesByCategory,
  ServicesByStatus,
  TopFreelancer,
  ActivityData,
  GeographicDistribution,
  PerformanceMetrics,
  ReportFilters,
} from "@/app/types";
import { handleResponse } from "@/app/lib/error-handler";

// ==================== STATISTIQUES GÉNÉRALES ====================

/**
 * Récupère les statistiques générales des rapports
 */
export async function getReportStats(filters?: ReportFilters): Promise<ReportStats> {
  try {
    const params = new URLSearchParams();
    if (filters?.dateRange?.startDate) params.append("startDate", filters.dateRange.startDate);
    if (filters?.dateRange?.endDate) params.append("endDate", filters.dateRange.endDate);

    const res = await fetch(`/api/admin/reports/stats?${params.toString()}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    return await handleResponse<ReportStats>(res);
  } catch (error) {
    console.error("Erreur getReportStats:", error);
    throw error;
  }
}

// ==================== DONNÉES DE REVENUS ====================

/**
 * Récupère les données de revenus
 */
export async function getRevenueData(
  period: "day" | "week" | "month" | "year" = "month",
  filters?: ReportFilters
): Promise<RevenueData[]> {
  try {
    const params = new URLSearchParams({ period });
    if (filters?.dateRange?.startDate) params.append("startDate", filters.dateRange.startDate);
    if (filters?.dateRange?.endDate) params.append("endDate", filters.dateRange.endDate);

    const res = await fetch(`/api/admin/reports/revenue?${params.toString()}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    return await handleResponse<RevenueData[]>(res);
  } catch (error) {
    console.error("Erreur getRevenueData:", error);
    throw error;
  }
}

// ==================== SERVICES PAR CATÉGORIE ====================

/**
 * Récupère la répartition des services par catégorie
 */
export async function getServicesByCategory(filters?: ReportFilters): Promise<ServicesByCategory[]> {
  try {
    const params = new URLSearchParams();
    if (filters?.dateRange?.startDate) params.append("startDate", filters.dateRange.startDate);
    if (filters?.dateRange?.endDate) params.append("endDate", filters.dateRange.endDate);
    if (filters?.category) params.append("category", filters.category);

    const res = await fetch(`/api/admin/reports/services-by-category?${params.toString()}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    return await handleResponse<ServicesByCategory[]>(res);
  } catch (error) {
    console.error("Erreur getServicesByCategory:", error);
    throw error;
  }
}

// ==================== SERVICES PAR STATUT ====================

/**
 * Récupère la répartition des services par statut
 */
export async function getServicesByStatus(filters?: ReportFilters): Promise<ServicesByStatus[]> {
  try {
    const params = new URLSearchParams();
    if (filters?.dateRange?.startDate) params.append("startDate", filters.dateRange.startDate);
    if (filters?.dateRange?.endDate) params.append("endDate", filters.dateRange.endDate);

    const res = await fetch(`/api/admin/reports/services-by-status?${params.toString()}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    return await handleResponse<ServicesByStatus[]>(res);
  } catch (error) {
    console.error("Erreur getServicesByStatus:", error);
    throw error;
  }
}

// ==================== TOP FREELANCERS ====================

/**
 * Récupère le classement des freelancers
 */
export async function getTopFreelancers(
  limit: number = 10,
  filters?: ReportFilters
): Promise<TopFreelancer[]> {
  try {
    const params = new URLSearchParams({ limit: limit.toString() });
    if (filters?.dateRange?.startDate) params.append("startDate", filters.dateRange.startDate);
    if (filters?.dateRange?.endDate) params.append("endDate", filters.dateRange.endDate);
    if (filters?.category) params.append("category", filters.category);

    const res = await fetch(`/api/admin/reports/top-freelancers?${params.toString()}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    return await handleResponse<TopFreelancer[]>(res);
  } catch (error) {
    console.error("Erreur getTopFreelancers:", error);
    throw error;
  }
}

// ==================== DONNÉES D'ACTIVITÉ ====================

/**
 * Récupère les données d'activité
 */
export async function getActivityData(
  period: "day" | "week" | "month" = "day",
  filters?: ReportFilters
): Promise<ActivityData[]> {
  try {
    const params = new URLSearchParams({ period });
    if (filters?.dateRange?.startDate) params.append("startDate", filters.dateRange.startDate);
    if (filters?.dateRange?.endDate) params.append("endDate", filters.dateRange.endDate);

    const res = await fetch(`/api/admin/reports/activity?${params.toString()}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    return await handleResponse<ActivityData[]>(res);
  } catch (error) {
    console.error("Erreur getActivityData:", error);
    throw error;
  }
}

// ==================== DISTRIBUTION GÉOGRAPHIQUE ====================

/**
 * Récupère la distribution géographique
 */
export async function getGeographicDistribution(filters?: ReportFilters): Promise<GeographicDistribution[]> {
  try {
    const params = new URLSearchParams();
    if (filters?.dateRange?.startDate) params.append("startDate", filters.dateRange.startDate);
    if (filters?.dateRange?.endDate) params.append("endDate", filters.dateRange.endDate);
    if (filters?.city) params.append("city", filters.city);

    const res = await fetch(`/api/admin/reports/geographic?${params.toString()}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    return await handleResponse<GeographicDistribution[]>(res);
  } catch (error) {
    console.error("Erreur getGeographicDistribution:", error);
    throw error;
  }
}

// ==================== MÉTRIQUES DE PERFORMANCE ====================

/**
 * Récupère les métriques de performance
 */
export async function getPerformanceMetrics(filters?: ReportFilters): Promise<PerformanceMetrics[]> {
  try {
    const params = new URLSearchParams();
    if (filters?.dateRange?.startDate) params.append("startDate", filters.dateRange.startDate);
    if (filters?.dateRange?.endDate) params.append("endDate", filters.dateRange.endDate);

    const res = await fetch(`/api/admin/reports/performance?${params.toString()}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    return await handleResponse<PerformanceMetrics[]>(res);
  } catch (error) {
    console.error("Erreur getPerformanceMetrics:", error);
    throw error;
  }
}

// ==================== EXPORT DE RAPPORTS ====================

/**
 * Exporte un rapport au format spécifié
 */
export async function exportReport(
  format: "pdf" | "csv" | "excel",
  type: "revenue" | "services" | "freelancers" | "full",
  filters?: ReportFilters
): Promise<Blob> {
  try {
    const params = new URLSearchParams({ format, type });
    if (filters?.dateRange?.startDate) params.append("startDate", filters.dateRange.startDate);
    if (filters?.dateRange?.endDate) params.append("endDate", filters.dateRange.endDate);
    if (filters?.category) params.append("category", filters.category);

    const res = await fetch(`/api/admin/reports/export?${params.toString()}`, {
      method: "GET",
      headers: {
        Accept:
          format === "pdf"
            ? "application/pdf"
            : format === "csv"
            ? "text/csv"
            : "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      },
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      throw {
        status: res.status,
        message: error.message || "Erreur lors de l'export",
      };
    }

    return res.blob();
  } catch (error) {
    console.error("Erreur exportReport:", error);
    throw error;
  }
}

/**
 * Version simplifiée de l'export avec gestion d'erreur via handleResponse
 * Note: Cette version retourne le Blob mais ne peut pas utiliser handleResponse
 * car handleResponse attend du JSON
 */
export async function exportReportV2(
  format: "pdf" | "csv" | "excel",
  type: "revenue" | "services" | "freelancers" | "full",
  filters?: ReportFilters
): Promise<Blob> {
  try {
    const params = new URLSearchParams({ format, type });
    if (filters?.dateRange?.startDate) params.append("startDate", filters.dateRange.startDate);
    if (filters?.dateRange?.endDate) params.append("endDate", filters.dateRange.endDate);
    if (filters?.category) params.append("category", filters.category);

    const res = await fetch(`/api/admin/reports/export?${params.toString()}`, {
      method: "GET",
      headers: {
        Accept:
          format === "pdf"
            ? "application/pdf"
            : format === "csv"
            ? "text/csv"
            : "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      },
    });

    // Utilisation partielle de handleResponse pour la vérification
    await handleResponse<{ ok: boolean }>(res.clone().json() as any).catch(() => {
      throw new Error("Erreur lors de l'export");
    });

    return res.blob();
  } catch (error) {
    console.error("Erreur exportReportV2:", error);
    throw error;
  }
}
