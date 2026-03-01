// hooks/stats/useStats.ts

import { useQuery } from '@tanstack/react-query';
import * as userService from '@/services/user.service';
import * as serviceService from '@/services/service.service';
import * as paymentService from '@/services/admin/payments.service';

// ==================== TYPES ====================

export interface FreelancerStats {
  // Services
  totalServices: number;
  publishedServices: number;
  inProgressServices: number;
  completedServices: number;
  canceledServices: number;
  
  // Candidatures
  totalApplications: number;
  acceptedApplications: number;
  pendingApplications: number;
  applicationSuccessRate: number;
  
  // Revenus
  totalEarnings: number;
  monthlyEarnings: number;
  averageEarningsPerService: number;
  pendingPayments: number;
  
  // Performance
  averageRating: number;
  totalReviews: number;
  responseRate: number;
  averageResponseTime: number;
  completionRate: number;
  
  // Clients
  uniqueClients: number;
  repeatClients: number;
  clientSatisfaction: number;
}

export interface ClientStats {
  // Services
  totalServices: number;
  publishedServices: number;
  completedServices: number;
  canceledServices: number;
  
  // Budget
  totalSpent: number;
  averageServiceCost: number;
  monthlySpending: number;
  
  // Freelancers
  totalFreelancers: number;
  repeatFreelancers: number;
  
  // Performance
  averageTimeToComplete: number;
  servicesWithDisputes: number;
  satisfactionRate: number;
}

export interface EarningsStats {
  // Période
  daily: Array<{ date: string; amount: number }>;
  weekly: Array<{ week: string; amount: number }>;
  monthly: Array<{ month: string; amount: number }>;
  yearly: Array<{ year: string; amount: number }>;
  
  // Totaux
  total: number;
  average: number;
  median: number;
  growth: number;
  
  // Par source
  byServiceType: Record<string, number>;
  byCategory: Record<string, number>;
}

export interface ActivityStats {
  // Connexions
  lastLogin: string;
  loginStreak: number;
  totalLogins: number;
  
  // Actions
  servicesViewed: number;
  searches: number;
  messagesSent: number;
  responses: number;
  
  // Temps
  averageSessionDuration: number;
  totalTimeSpent: number;
  mostActiveHour: number;
  mostActiveDay: string;
}

export interface PerformanceMetrics {
  // Efficacité
  tasksCompleted: number;
  tasksPerDay: number;
  completionRate: number;
  
  // Qualité
  averageRating: number;
  positiveReviews: number;
  negativeReviews: number;
  
  // Réactivité
  responseTime: number;
  resolutionTime: number;
  
  // Tendances
  weeklyGrowth: number;
  monthlyGrowth: number;
  yearlyGrowth: number;
}

// ==================== CLÉS DE QUERY ====================

export const statsKeys = {
  all: ['stats'] as const,
  freelancer: (userId: number) => [...statsKeys.all, 'freelancer', userId] as const,
  client: (userId: number) => [...statsKeys.all, 'client', userId] as const,
  earnings: (userId: number, period?: string) => 
    [...statsKeys.all, 'earnings', userId, period] as const,
  activity: (userId: number) => [...statsKeys.all, 'activity', userId] as const,
  performance: (userId: number) => [...statsKeys.all, 'performance', userId] as const,
};

// ==================== HOOK PRINCIPAL ====================

export const useStats = (userId?: number) => {
  
  // ==================== STATISTIQUES FREELANCER ====================

  /**
   * Récupère les statistiques d'un freelancer
   */
  const useFreelancerStats = (freelancerId?: number) => {
    return useQuery({
      queryKey: statsKeys.freelancer(freelancerId || userId || 0),
      queryFn: async (): Promise<FreelancerStats> => {
        // Récupérer les données nécessaires
        const profile = await userService.getFreelancerPublicProfile(freelancerId || userId!);
        const services = await serviceService.getFreelancerServices({ 
          freelancer_id: freelancerId || userId 
        });
        const applications = await userService.getFreelancerReviews(freelancerId || userId!, 0, 1000);
        
        // Calculer les stats
        const totalServices = services.services.length;
        const published = services.services.filter(s => s.status === 'published').length;
        const inProgress = services.services.filter(s => s.status === 'in_progress').length;
        const completed = services.services.filter(s => s.status === 'completed').length;
        const canceled = services.services.filter(s => s.status === 'canceled').length;
        
        const totalEarnings = services.services
          .filter(s => s.status === 'completed')
          .reduce((sum, s) => sum + (s.accepted_amount || s.proposed_amount), 0);
        
        const averageRating = applications.length > 0
          ? applications.reduce((sum, r) => sum + r.rating, 0) / applications.length
          : 0;
        
        return {
          // Services
          totalServices,
          publishedServices: published,
          inProgressServices: inProgress,
          completedServices: completed,
          canceledServices: canceled,
          
          // Candidatures
          totalApplications: applications.length,
          acceptedApplications: applications.filter(a => a.status === 'accepted').length,
          pendingApplications: applications.filter(a => a.status === 'pending').length,
          applicationSuccessRate: applications.length > 0
            ? (applications.filter(a => a.status === 'accepted').length / applications.length) * 100
            : 0,
          
          // Revenus
          totalEarnings,
          monthlyEarnings: totalEarnings / 12, // Approximation
          averageEarningsPerService: completed > 0 ? totalEarnings / completed : 0,
          pendingPayments: services.services
            .filter(s => s.status === 'completed' && !s.paid)
            .reduce((sum, s) => sum + (s.accepted_amount || s.proposed_amount), 0),
          
          // Performance
          averageRating,
          totalReviews: applications.length,
          responseRate: profile.response_rate || 0,
          averageResponseTime: profile.avg_response_time || 0,
          completionRate: completed > 0 ? (completed / totalServices) * 100 : 0,
          
          // Clients
          uniqueClients: new Set(services.services.map(s => s.client_id)).size,
          repeatClients: 0, // À calculer
          clientSatisfaction: averageRating * 20, // Conversion en pourcentage
        };
      },
      enabled: !!(freelancerId || userId),
      staleTime: 10 * 60 * 1000, // 10 minutes
    });
  };

  // ==================== STATISTIQUES CLIENT ====================

  /**
   * Récupère les statistiques d'un client
   */
  const useClientStats = (clientId?: number) => {
    return useQuery({
      queryKey: statsKeys.client(clientId || userId || 0),
      queryFn: async (): Promise<ClientStats> => {
        const services = await serviceService.getClientServices({ 
          client_id: clientId || userId 
        });
        
        const totalServices = services.services.length;
        const completed = services.services.filter(s => s.status === 'completed').length;
        const canceled = services.services.filter(s => s.status === 'canceled').length;
        
        const totalSpent = services.services
          .filter(s => s.status === 'completed')
          .reduce((sum, s) => sum + (s.accepted_amount || s.proposed_amount), 0);
        
        const uniqueFreelancers = new Set(
          services.services
            .filter(s => s.assigned_freelancer_id)
            .map(s => s.assigned_freelancer_id)
        ).size;
        
        return {
          totalServices,
          publishedServices: services.services.filter(s => s.status === 'published').length,
          completedServices: completed,
          canceledServices: canceled,
          
          totalSpent,
          averageServiceCost: completed > 0 ? totalSpent / completed : 0,
          monthlySpending: totalSpent / 12,
          
          totalFreelancers: uniqueFreelancers,
          repeatFreelancers: 0, // À calculer
          
          averageTimeToComplete: 0, // À calculer
          servicesWithDisputes: 0, // À calculer
          satisfactionRate: 0, // À calculer
        };
      },
      enabled: !!(clientId || userId),
      staleTime: 10 * 60 * 1000,
    });
  };

  // ==================== STATISTIQUES DE REVENUS ====================

  /**
   * Récupère les statistiques de revenus
   */
  const useEarningsStats = (period: 'day' | 'week' | 'month' | 'year' = 'month') => {
    return useQuery({
      queryKey: statsKeys.earnings(userId || 0, period),
      queryFn: async (): Promise<EarningsStats> => {
        const services = await serviceService.getFreelancerServices({ 
          freelancer_id: userId,
          status: 'completed'
        });
        
        const earnings = services.services.map(s => s.accepted_amount || s.proposed_amount);
        const total = earnings.reduce((sum, a) => sum + a, 0);
        
        // Trier pour la médiane
        const sorted = [...earnings].sort((a, b) => a - b);
        const median = sorted.length > 0
          ? sorted.length % 2 === 0
            ? (sorted[sorted.length/2 - 1] + sorted[sorted.length/2]) / 2
            : sorted[Math.floor(sorted.length/2)]
          : 0;
        
        return {
          daily: [], // À générer
          weekly: [],
          monthly: [],
          yearly: [],
          
          total,
          average: earnings.length > 0 ? total / earnings.length : 0,
          median,
          growth: 0, // À calculer
          
          byServiceType: {},
          byCategory: {},
        };
      },
      enabled: !!userId,
      staleTime: 5 * 60 * 1000,
    });
  };

  // ==================== STATISTIQUES D'ACTIVITÉ ====================

  /**
   * Récupère les statistiques d'activité
   */
  const useActivityStats = () => {
    return useQuery({
      queryKey: statsKeys.activity(userId || 0),
      queryFn: async (): Promise<ActivityStats> => {
        // Simulation - à remplacer par des vraies données
        return {
          lastLogin: new Date().toISOString(),
          loginStreak: 5,
          totalLogins: 42,
          
          servicesViewed: 156,
          searches: 89,
          messagesSent: 34,
          responses: 28,
          
          averageSessionDuration: 15, // minutes
          totalTimeSpent: 450, // minutes
          mostActiveHour: 14,
          mostActiveDay: 'Lundi',
        };
      },
      enabled: !!userId,
      staleTime: 5 * 60 * 1000,
    });
  };

  // ==================== MÉTRIQUES DE PERFORMANCE ====================

  /**
   * Récupère les métriques de performance
   */
  const usePerformanceMetrics = () => {
    return useQuery({
      queryKey: statsKeys.performance(userId || 0),
      queryFn: async (): Promise<PerformanceMetrics> => {
        const services = await serviceService.getFreelancerServices({ 
          freelancer_id: userId 
        });
        const reviews = await userService.getFreelancerReviews(userId!, 0, 1000);
        
        const completed = services.services.filter(s => s.status === 'completed').length;
        const total = services.services.length;
        
        const positiveReviews = reviews.filter(r => r.rating >= 4).length;
        const negativeReviews = reviews.filter(r => r.rating <= 2).length;
        
        return {
          tasksCompleted: completed,
          tasksPerDay: completed / 30, // Approximation
          completionRate: total > 0 ? (completed / total) * 100 : 0,
          
          averageRating: reviews.length > 0
            ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
            : 0,
          positiveReviews,
          negativeReviews,
          
          responseTime: 120, // minutes
          resolutionTime: 1440, // minutes
          
          weeklyGrowth: 15,
          monthlyGrowth: 25,
          yearlyGrowth: 150,
        };
      },
      enabled: !!userId,
      staleTime: 10 * 60 * 1000,
    });
  };

  // ==================== RETOUR DU HOOK ====================

  return {
    // Statistiques par rôle
    useFreelancerStats,
    useClientStats,
    
    // Statistiques générales
    useEarningsStats,
    useActivityStats,
    usePerformanceMetrics,
  };
};
