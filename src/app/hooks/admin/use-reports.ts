// hooks/admin/useReports.ts

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/app/components/ui/use-toast';
import * as reportsService from '@/app/services/reports.service';
import type { 
  ReportStats, 
  RevenueData, 
  ServicesByCategory, 
  ServicesByStatus,
  TopFreelancer,
  ActivityData,
  GeographicDistribution,
  PerformanceMetrics,
  ReportFilters
} from '@/app/types/admin';

// ==================== CLÉS DE QUERY ====================

export const reportKeys = {
  all: ['reports'] as const,
  stats: (filters?: ReportFilters) => [...reportKeys.all, 'stats', filters] as const,
  revenue: (period: string, filters?: ReportFilters) => [...reportKeys.all, 'revenue', period, filters] as const,
  servicesByCategory: (filters?: ReportFilters) => [...reportKeys.all, 'services-by-category', filters] as const,
  servicesByStatus: (filters?: ReportFilters) => [...reportKeys.all, 'services-by-status', filters] as const,
  topFreelancers: (limit: number, filters?: ReportFilters) => [...reportKeys.all, 'top-freelancers', limit, filters] as const,
  activity: (period: string, filters?: ReportFilters) => [...reportKeys.all, 'activity', period, filters] as const,
  geographic: (filters?: ReportFilters) => [...reportKeys.all, 'geographic', filters] as const,
  performance: (filters?: ReportFilters) => [...reportKeys.all, 'performance', filters] as const,
};

// ==================== HOOK PRINCIPAL ====================

export const useReports = (filters?: ReportFilters) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // ==================== QUERIES ====================

  /**
   * Statistiques générales des rapports
   */
  const statsQuery = useQuery({
    queryKey: reportKeys.stats(filters),
    queryFn: () => reportsService.getReportStats(filters),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });

  /**
   * Données de revenus
   */
  const getRevenueData = (period: 'day' | 'week' | 'month' | 'year' = 'month') => {
    return useQuery({
      queryKey: reportKeys.revenue(period, filters),
      queryFn: () => reportsService.getRevenueData(period, filters),
      staleTime: 10 * 60 * 1000,
    });
  };

  /**
   * Services par catégorie
   */
  const servicesByCategoryQuery = useQuery({
    queryKey: reportKeys.servicesByCategory(filters),
    queryFn: () => reportsService.getServicesByCategory(filters),
    staleTime: 15 * 60 * 1000, // 15 minutes
  });

  /**
   * Services par statut
   */
  const servicesByStatusQuery = useQuery({
    queryKey: reportKeys.servicesByStatus(filters),
    queryFn: () => reportsService.getServicesByStatus(filters),
    staleTime: 15 * 60 * 1000,
  });

  /**
   * Top freelancers
   */
  const getTopFreelancers = (limit: number = 10) => {
    return useQuery({
      queryKey: reportKeys.topFreelancers(limit, filters),
      queryFn: () => reportsService.getTopFreelancers(limit, filters),
      staleTime: 10 * 60 * 1000,
    });
  };

  /**
   * Données d'activité
   */
  const getActivityData = (period: 'day' | 'week' | 'month' = 'month') => {
    return useQuery({
      queryKey: reportKeys.activity(period, filters),
      queryFn: () => reportsService.getActivityData(period, filters),
      staleTime: 5 * 60 * 1000, // 5 minutes
    });
  };

  /**
   * Distribution géographique
   */
  const geographicDistributionQuery = useQuery({
    queryKey: reportKeys.geographic(filters),
    queryFn: () => reportsService.getGeographicDistribution(filters),
    staleTime: 30 * 60 * 1000, // 30 minutes
  });

  /**
   * Métriques de performance
   */
  const performanceMetricsQuery = useQuery({
    queryKey: reportKeys.performance(filters),
    queryFn: () => reportsService.getPerformanceMetrics(filters),
    staleTime: 20 * 60 * 1000, // 20 minutes
  });

  // ==================== FONCTIONS UTILITAIRES ====================

  /**
   * Exporte un rapport
   */
  const exportReport = async (
    format: 'pdf' | 'csv' | 'excel',
    type: 'revenue' | 'services' | 'freelancers' | 'full'
  ) => {
    try {
      const blob = await reportsService.exportReport(format, type, filters);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `rapport-${type}-${new Date().toISOString().split('T')[0]}.${
        format === 'excel' ? 'xlsx' : format
      }`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast({
        title: "Export réussi",
        description: `Le rapport a été exporté au format ${format.toUpperCase()}`,
      });
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Impossible d'exporter le rapport",
        variant: "destructive",
      });
    }
  };

  /**
   * Calcule les tendances
   */
  const calculateTrends = (current: number, previous: number) => {
    if (previous === 0) return { percentage: 100, direction: 'up' as const };
    const change = ((current - previous) / previous) * 100;
    return {
      percentage: Math.abs(change),
      direction: change > 0 ? 'up' as const : change < 0 ? 'down' as const : 'stable' as const,
    };
  };

  /**
   * Formate les données pour les graphiques
   */
  const formatChartData = (data: any[], xKey: string, yKey: string) => {
    return data.map(item => ({
      x: item[xKey],
      y: item[yKey],
    }));
  };

  // ==================== RETOUR DU HOOK ====================

  return {
    // Statistiques
    stats: statsQuery.data,
    isLoadingStats: statsQuery.isLoading,

    // Services par catégorie
    servicesByCategory: servicesByCategoryQuery.data || [],
    isLoadingServicesByCategory: servicesByCategoryQuery.isLoading,

    // Services par statut
    servicesByStatus: servicesByStatusQuery.data || [],
    isLoadingServicesByStatus: servicesByStatusQuery.isLoading,

    // Distribution géographique
    geographicDistribution: geographicDistributionQuery.data || [],
    isLoadingGeographic: geographicDistributionQuery.isLoading,

    // Métriques de performance
    performanceMetrics: performanceMetricsQuery.data || [],
    isLoadingPerformance: performanceMetricsQuery.isLoading,

    // Fonctions avec paramètres
    getRevenueData,
    getTopFreelancers,
    getActivityData,

    // Utilitaires
    exportReport,
    calculateTrends,
    formatChartData,

    // Rafraîchissement
    refetchAll: () => {
      queryClient.invalidateQueries({ queryKey: reportKeys.all });
    },
  };
};
