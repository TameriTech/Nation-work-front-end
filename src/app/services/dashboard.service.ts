import { ApiResponse, DashboardStats, RecentActivity, ChartData } from '../types/admin';

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

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || 'Erreur lors du chargement des statistiques');
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error('Erreur dashboard stats:', error);
    throw error;
  }
}

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

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || 'Erreur lors du chargement des activités');
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error('Erreur recent activities:', error);
    throw error;
  }
}

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

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || 'Erreur lors du chargement des graphiques');
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error('Erreur chart data:', error);
    throw error;
  }
}

/**
 * Récupère un résumé complet du dashboard
 */
export async function getDashboardSummary(): Promise<{
  stats: DashboardStats;
  activities: RecentActivity[];
  charts: {
    registrations: ChartData;
    service_status: ChartData;
    revenue: ChartData;
  };
}> {
  try {
    const res = await fetch('/api/admin/dashboard/summary', {
      method: 'GET',
      cache: 'no-store',
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || 'Erreur lors du chargement du dashboard');
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error('Erreur dashboard summary:', error);
    throw error;
  }
}

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

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || 'Erreur lors du rafraîchissement');
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error('Erreur refresh dashboard:', error);
    throw error;
  }
}