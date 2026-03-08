// hooks/admin/useDashboard.ts

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/app/components/ui/use-toast';
import * as dashboardService from '@/app/services/dashboard.service';

// ==================== CLÉS DE QUERY ====================

export const dashboardKeys = {
  all: ['dashboard'] as const,
  stats: (period?: string) => [...dashboardKeys.all, 'stats', period] as const,
  activities: (limit?: number) => [...dashboardKeys.all, 'activities', limit] as const,
  charts: (period: string) => [...dashboardKeys.all, 'charts', period] as const,
  summary: () => [...dashboardKeys.all, 'summary'] as const,
  alerts: () => [...dashboardKeys.all, 'alerts'] as const,
  distributions: () => [...dashboardKeys.all, 'distributions'] as const,
};

// ==================== HOOK PRINCIPAL ====================

export const useDashboard = (options?: {
  period?: 'day' | 'week' | 'month' | 'year';
  activityLimit?: number;
}) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const period = options?.period || 'month';
  const activityLimit = options?.activityLimit || 10;

  // ==================== QUERIES ====================

  /**
   * Récupère les statistiques globales
   */
  const statsQuery = useQuery({
    queryKey: dashboardKeys.stats(period),
    queryFn: () => dashboardService.getDashboardStatsByPeriod(period),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  /**
   * Récupère les activités récentes
   */
  const activitiesQuery = useQuery({
    queryKey: dashboardKeys.activities(activityLimit),
    queryFn: () => dashboardService.getRecentActivities(activityLimit),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });

  /**
   * Récupère les données des graphiques
   */
  const chartsQuery = useQuery({
    queryKey: dashboardKeys.charts(period),
    queryFn: () => dashboardService.getChartData(period),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });

  /**
   * Récupère un résumé complet
   */
  const summaryQuery = useQuery({
    queryKey: dashboardKeys.summary(),
    queryFn: () => dashboardService.getDashboardSummary(),
    staleTime: 5 * 60 * 1000,
  });

  /**
   * Récupère les alertes du dashboard
   */
  const alertsQuery = useQuery({
    queryKey: dashboardKeys.alerts(),
    queryFn: () => dashboardService.getDashboardAlerts(),
    staleTime: 30 * 1000, // 30 secondes
  });

  /**
   * Récupère les données de distribution
   */
  const distributionsQuery = useQuery({
    queryKey: dashboardKeys.distributions(),
    queryFn: () => dashboardService.getDistributionData(),
    staleTime: 30 * 60 * 1000, // 30 minutes
  });

  // ==================== MUTATIONS ====================

  /**
   * Rafraîchit les données du dashboard
   */
  const refreshMutation = useMutation({
    mutationFn: () => dashboardService.refreshDashboardData(),
    onSuccess: (data) => {
      // Mettre à jour le cache avec les nouvelles données
      queryClient.setQueryData(dashboardKeys.stats(period), data.stats);
      queryClient.setQueryData(dashboardKeys.activities(activityLimit), data.recent_activities);
      
      toast({
        title: "Dashboard actualisé",
        description: "Les données ont été mises à jour",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: error.message || "Impossible d'actualiser le dashboard",
        variant: "destructive",
      });
    },
  });

  /**
   * Marque une alerte comme lue
   */
  const markAlertAsReadMutation = useMutation({
    mutationFn: (alertId: string) => dashboardService.markAlertAsRead(alertId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: dashboardKeys.alerts() });
    },
  });

  // ==================== FONCTIONS UTILITAIRES ====================

  /**
   * Exporte les données du dashboard
   */
  const exportData = async (format: 'pdf' | 'csv' | 'excel') => {
    try {
      const blob = await dashboardService.exportDashboardData(format, ['stats', 'charts']);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `dashboard-${new Date().toISOString().split('T')[0]}.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast({
        title: "Export réussi",
        description: `Le dashboard a été exporté au format ${format.toUpperCase()}`,
      });
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Impossible d'exporter les données",
        variant: "destructive",
      });
    }
  };

  /**
   * Filtre les activités par type
   */
  const getActivitiesByType = (type: string) => {
    return activitiesQuery.data?.filter(a => a.type === type) || [];
  };

  /**
   * Calcule la tendance pour une métrique
   */
  const getTrend = (current: number, previous: number): 'up' | 'down' | 'stable' => {
    if (current > previous) return 'up';
    if (current < previous) return 'down';
    return 'stable';
  };

  /**
   * Formate un pourcentage de changement
   */
  const getChangePercentage = (current: number, previous: number): string => {
    if (previous === 0) return '+100%';
    const change = ((current - previous) / previous) * 100;
    return `${change > 0 ? '+' : ''}${change.toFixed(1)}%`;
  };

  // ==================== RETOUR DU HOOK ====================

  return {
    // Données
    stats: statsQuery.data,
    isLoadingStats: statsQuery.isLoading,
    statsError: statsQuery.error,

    activities: activitiesQuery.data || [],
    isLoadingActivities: activitiesQuery.isLoading,

    charts: chartsQuery.data,
    isLoadingCharts: chartsQuery.isLoading,

    summary: summaryQuery.data,
    isLoadingSummary: summaryQuery.isLoading,

    alerts: alertsQuery.data || [],
    isLoadingAlerts: alertsQuery.isLoading,

    distributions: distributionsQuery.data,
    isLoadingDistributions: distributionsQuery.isLoading,

    // Utilitaires
    getActivitiesByType,
    getTrend,
    getChangePercentage,

    // Mutations
    refresh: refreshMutation.mutate,
    isRefreshing: refreshMutation.isPending,

    markAlertAsRead: markAlertAsReadMutation.mutate,
    isMarkingAlert: markAlertAsReadMutation.isPending,

    exportData,

    // Rafraîchissement
    refetchAll: () => {
      queryClient.invalidateQueries({ queryKey: dashboardKeys.all });
    },
  };
};
