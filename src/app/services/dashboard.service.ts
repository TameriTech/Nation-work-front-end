// services/admin/dashboard.service.ts

import { ApiResponse, DashboardStats, RecentActivity, ChartData, DashboardSummary } from '../types/admin';
import { handleResponse } from '@/app/lib/error-handler';

// ==================== STATISTIQUES ====================

/**
 * Récupère les statistiques globales du dashboard
 */
export async function getDashboardStats(): Promise<DashboardStats> {
  try {
    const res = await fetch('/api/admin/dashboard/stats', {
      method: 'GET',
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return await handleResponse<DashboardStats>(res);
  } catch (error) {
    console.error('Erreur dashboard stats:', error);
    throw error;
  }
}

/**
 * Récupère les statistiques pour une période spécifique
 */
export async function getDashboardStatsByPeriod(
  period: 'day' | 'week' | 'month' | 'year' = 'month',
  date?: string
): Promise<DashboardStats> {
  try {
    const params = new URLSearchParams({ period });
    if (date) params.append('date', date);

    const res = await fetch(`/api/admin/dashboard/stats?${params.toString()}`, {
      method: 'GET',
      cache: 'no-store',
    });

    return await handleResponse<DashboardStats>(res);
  } catch (error) {
    console.error('Erreur getDashboardStatsByPeriod:', error);
    throw error;
  }
}

// ==================== ACTIVITÉS RÉCENTES ====================

/**
 * Récupère les activités récentes
 * @param limit - Nombre d'activités à récupérer (défaut: 10)
 */
export async function getRecentActivities(limit: number = 10): Promise<RecentActivity[]> {
  try {
    const res = await fetch(`/api/admin/dashboard/activities?limit=${limit}`, {
      method: 'GET',
      cache: 'no-store',
    });

    return await handleResponse<RecentActivity[]>(res);
  } catch (error) {
    console.error('Erreur recent activities:', error);
    throw error;
  }
}

/**
 * Récupère les activités par type
 */
export async function getActivitiesByType(
  type: 'user' | 'service' | 'payment' | 'dispute',
  limit: number = 20
): Promise<RecentActivity[]> {
  try {
    const res = await fetch(`/api/admin/dashboard/activities?type=${type}&limit=${limit}`, {
      method: 'GET',
      cache: 'no-store',
    });

    return await handleResponse<RecentActivity[]>(res);
  } catch (error) {
    console.error('Erreur getActivitiesByType:', error);
    throw error;
  }
}

/**
 * Récupère les activités d'un utilisateur spécifique
 */
export async function getUserActivities(userId: number, limit: number = 20): Promise<RecentActivity[]> {
  try {
    const res = await fetch(`/api/admin/dashboard/activities?user_id=${userId}&limit=${limit}`, {
      method: 'GET',
      cache: 'no-store',
    });

    return await handleResponse<RecentActivity[]>(res);
  } catch (error) {
    console.error('Erreur getUserActivities:', error);
    throw error;
  }
}

// ==================== GRAPHIQUES ====================

/**
 * Récupère les données pour les graphiques
 * @param period - Période (day, week, month, year)
 */
export async function getChartData(period: 'day' | 'week' | 'month' | 'year' = 'month'): Promise<{
  registrations: ChartData;
  service_status: ChartData;
  revenue: ChartData;
}> {
  try {
    const res = await fetch(`/api/admin/dashboard/charts?period=${period}`, {
      method: 'GET',
      cache: 'no-store',
    });

    return await handleResponse<{
      registrations: ChartData;
      service_status: ChartData;
      revenue: ChartData;
    }>(res);
  } catch (error) {
    console.error('Erreur chart data:', error);
    throw error;
  }
}

/**
 * Récupère les données pour un graphique spécifique
 */
export async function getSpecificChartData(
  chartType: 'registrations' | 'service_status' | 'revenue' | 'disputes',
  period: 'day' | 'week' | 'month' | 'year' = 'month'
): Promise<ChartData> {
  try {
    const res = await fetch(`/api/admin/dashboard/charts/${chartType}?period=${period}`, {
      method: 'GET',
      cache: 'no-store',
    });

    return await handleResponse<ChartData>(res);
  } catch (error) {
    console.error('Erreur getSpecificChartData:', error);
    throw error;
  }
}

/**
 * Récupère les données de répartition (pie charts)
 */
export async function getDistributionData(): Promise<{
  users_by_role: { role: string; count: number }[];
  services_by_category: { category: string; count: number }[];
  revenue_by_type: { type: string; amount: number }[];
}> {
  try {
    const res = await fetch('/api/admin/dashboard/distributions', {
      method: 'GET',
      cache: 'no-store',
    });

    return await handleResponse<{
      users_by_role: { role: string; count: number }[];
      services_by_category: { category: string; count: number }[];
      revenue_by_type: { type: string; amount: number }[];
    }>(res);
  } catch (error) {
    console.error('Erreur getDistributionData:', error);
    throw error;
  }
}

// ==================== RÉSUMÉ ====================

/**
 * Récupère un résumé complet du dashboard
 */
export async function getDashboardSummary(): Promise<DashboardSummary> {
  try {
    const res = await fetch('/api/admin/dashboard/summary', {
      method: 'GET',
      cache: 'no-store',
    });

    return await handleResponse<DashboardSummary>(res);
  } catch (error) {
    console.error('Erreur dashboard summary:', error);
    throw error;
  }
}

// ==================== RAFRÂÎCHISSEMENT ====================

/**
 * Rafraîchit les données du dashboard (pour polling)
 */
export async function refreshDashboardData(): Promise<{
  stats: DashboardStats;
  recent_activities: RecentActivity[];
}> {
  try {
    const res = await fetch('/api/admin/dashboard/refresh', {
      method: 'POST',
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return await handleResponse<{
      stats: DashboardStats;
      recent_activities: RecentActivity[];
    }>(res);
  } catch (error) {
    console.error('Erreur refresh dashboard:', error);
    throw error;
  }
}

// ==================== EXPORT ====================

/**
 * Exporte les données du dashboard
 */
export async function exportDashboardData(
  format: 'pdf' | 'csv' | 'excel',
  sections: string[] = ['stats', 'activities', 'charts']
): Promise<Blob> {
  try {
    const params = new URLSearchParams({
      format,
      sections: sections.join(',')
    });

    const res = await fetch(`/api/admin/dashboard/export?${params.toString()}`, {
      method: 'GET',
      headers: {
        'Accept': format === 'pdf' ? 'application/pdf' : 
                  format === 'csv' ? 'text/csv' : 
                  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      },
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw {
        status: res.status,
        message: errorData.message || 'Erreur lors de l\'export',
      };
    }

    return await res.blob();
  } catch (error) {
    console.error('Erreur exportDashboardData:', error);
    throw error;
  }
}

// ==================== NOTIFICATIONS ====================

/**
 * Récupère les alertes et notifications importantes pour le dashboard
 */
export async function getDashboardAlerts(): Promise<Array<{
  id: string;
  type: 'info' | 'warning' | 'error' | 'success';
  title: string;
  message: string;
  action_url?: string;
  created_at: string;
}>> {
  try {
    const res = await fetch('/api/admin/dashboard/alerts', {
      method: 'GET',
      cache: 'no-store',
    });

    return await handleResponse<Array<{
      id: string;
      type: 'info' | 'warning' | 'error' | 'success';
      title: string;
      message: string;
      action_url?: string;
      created_at: string;
    }>>(res);
  } catch (error) {
    console.error('Erreur getDashboardAlerts:', error);
    throw error;
  }
}

/**
 * Marquer une alerte comme lue
 */
export async function markAlertAsRead(alertId: string): Promise<{ message: string }> {
  try {
    const res = await fetch(`/api/admin/dashboard/alerts/${alertId}/read`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return await handleResponse<{ message: string }>(res);
  } catch (error) {
    console.error(`Erreur markAlertAsRead ${alertId}:`, error);
    throw error;
  }
}
