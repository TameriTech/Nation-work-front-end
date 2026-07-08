// src/app/types/dashboard/stats.ts

import { ActivityItem, UpcomingItem } from "./activity";

export interface KPIChange {
  count: number;
  changePercent: number;
  total?: number;
}

export interface MonetaryKPI {
  amount: number;
  changePercent: number;
  formatted: string;
}

export interface PeriodInfo {
  startDate: string;
  endDate: string;
  label: string;
}

export interface NextService {
  id: number;
  title: string;
  datePratique: string;
  dateFormatted: string;
  timeFormatted: string;
  startTime: string;
  address?: string;
  city?: string;
  status: string;
  clientName?: string;
  providerName?: string;
}

export interface StatusBreakdown {
  published: number;
  assigned: number;
  enCours: number;
  annule: number;
  termine: number;
  draft: number;
  pendingApproval: number;
  expired: number;
  total: number;
}

export interface ClientDashboardKPIs {
  servicesPublies: KPIChange;
  candidaturesRecues: KPIChange;
  servicesEnCours: number;
  acceptanceRate: number;
  nextService?: NextService;
  statusBreakdown: StatusBreakdown;
  recentActivity: ActivityItem[];
  period: PeriodInfo;
}

export interface providerDashboardKPIs {
  applicationsSubmitted: KPIChange;
  applicationsAccepted: number;
  servicesCompleted: number;
  totalEarnings: MonetaryKPI;
  acceptanceRate: number;
  averageRating?: number;
  responseRate?: number;
  nextService?: NextService;
  statusBreakdown: StatusBreakdown;
  recentActivity: ActivityItem[];
  upcoming: UpcomingItem[];
  period: PeriodInfo;
}

export interface MonthlyEvolutionPoint {
  month: string;
  monthName: string;
  averageRating: number;
  count: number;
}

export interface DimensionalAverages {
  communication: number;
  quality: number;
  deadline: number;
  professionalism: number;
}

export interface TopClient {
  id: number;
  name: string;
  avatar?: string;
  evaluationCount: number;
  averageRating: number;
}

export interface providerEvaluationOut {
  globalAverage: number;
  totalEvaluations: number;
  ratingDistribution: Record<string, number>;
  dimensionalAverages: DimensionalAverages;
  monthlyEvolution: MonthlyEvolutionPoint[];
  recentEvaluations: any[];
  topClients: TopClient[];
}

export interface PaymentHistoryItem {
  id: number;
  invoiceNumber: string;
  amount: number;
  formattedAmount: string;
  status: string;
  statusDisplay: string;
  paymentMethod?: string;
  paymentDate?: string;
  createdAt: string;
  serviceId: number;
  serviceTitle?: string;
  clientName?: string;
  providerName?: string;
}

export interface MonthlyPaymentBreakdown {
  month: string;
  monthName: string;
  amount: number;
  formatted: string;
}

export interface PaymentHistoryResponse {
  payments: PaymentHistoryItem[];
  totalPayments: number;
  totalAmount: number;
  pendingAmount: number;
  formattedTotal: string;
  formattedPending: string;
  monthlyBreakdown: MonthlyPaymentBreakdown[];
  skip: number;
  limit: number;
}
