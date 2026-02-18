"use client";

import { useState, useEffect } from "react";
import {
  BarChart3,
  TrendingUp,
  Users,
  Briefcase,
  DollarSign,
  Star,
  Clock,
  CheckCircle,
  XCircle,
  Download,
  Calendar,
  Filter,
  RefreshCw,
  Loader2,
  MapPin,
  Award,
  Activity,
  Percent,
  ArrowUp,
  ArrowDown,
  FileText,
  PieChart,
  LineChart,
  Grid3X3,
  List,
} from "lucide-react";

import {
  getReportStats,
  getRevenueData,
  getServicesByCategory,
  getServicesByStatus,
  getTopFreelancers,
  getActivityData,
  getGeographicDistribution,
  getPerformanceMetrics,
  exportReport,
} from "@/app/services/reports.service";
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
} from "@/app/types/admin";
import { reports as mockReports } from "@/data/admin-mock-data";

// Composant de carte de statistique
const StatsCard = ({
  title,
  value,
  change,
  icon: Icon,
  color,
  formatter = (val: number) => val.toString(),
}: {
  title: string;
  value: number;
  change?: number;
  icon: any;
  color: string;
  formatter?: (val: number) => string;
}) => (
  <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-slate-700">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{title}</p>
        <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">
          {formatter(value)}
        </p>
        {change !== undefined && (
          <div className="flex items-center mt-2">
            {change >= 0 ? (
              <ArrowUp className="w-4 h-4 text-green-500 mr-1" />
            ) : (
              <ArrowDown className="w-4 h-4 text-red-500 mr-1" />
            )}
            <span
              className={`text-sm ${
                change >= 0
                  ? "text-green-600 dark:text-green-400"
                  : "text-red-600 dark:text-red-400"
              }`}
            >
              {Math.abs(change)}%
            </span>
          </div>
        )}
      </div>
      <div
        className={`w-12 h-12 ${color} rounded-lg flex items-center justify-center text-white shadow-lg`}
      >
        <Icon className="w-6 h-6" />
      </div>
    </div>
  </div>
);

// Composant de sélecteur de période
const PeriodSelector = ({
  period,
  onPeriodChange,
}: {
  period: "day" | "week" | "month" | "year";
  onPeriodChange: (period: "day" | "week" | "month" | "year") => void;
}) => {
  const periods = [
    { value: "day", label: "Jour" },
    { value: "week", label: "Semaine" },
    { value: "month", label: "Mois" },
    { value: "year", label: "Année" },
  ];

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-1 inline-flex border border-gray-200 dark:border-slate-700">
      {periods.map((p) => (
        <button
          key={p.value}
          onClick={() => onPeriodChange(p.value as any)}
          className={`px-4 py-2 text-sm font-medium rounded-md transition ${
            period === p.value
              ? "bg-blue-600 text-white"
              : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-slate-700"
          }`}
        >
          {p.label}
        </button>
      ))}
    </div>
  );
};

// Composant de graphique de revenus (simplifié)
const RevenueChart = ({
  data,
  period,
}: {
  data: RevenueData[];
  period: string;
}) => {
  const maxRevenue = Math.max(...data.map((d) => d.revenue));

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-slate-700">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 flex items-center">
          <TrendingUp className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" />
          Évolution des revenus
        </h3>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          Par{" "}
          {period === "day" ? "jour" : period === "week" ? "semaine" : "mois"}
        </span>
      </div>

      <div className="space-y-3">
        {data.map((item, index) => (
          <div key={index} className="flex items-center">
            <span className="w-24 text-sm text-gray-600 dark:text-gray-400">
              {item.date}
            </span>
            <div className="flex-1 mx-3">
              <div className="relative h-10">
                {/* Barre des revenus */}
                <div
                  className="absolute left-0 top-0 h-full bg-blue-500 rounded-lg opacity-80 transition-all"
                  style={{ width: `${(item.revenue / maxRevenue) * 100}%` }}
                >
                  <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs text-white font-medium truncate max-w-[150px]">
                    {new Intl.NumberFormat("fr-FR", {
                      style: "currency",
                      currency: "EUR",
                      minimumFractionDigits: 0,
                    }).format(item.revenue)}
                  </div>
                </div>
                {/* Barre des frais */}
                <div
                  className="absolute left-0 top-0 h-full bg-purple-500 rounded-lg opacity-40"
                  style={{ width: `${(item.fees / maxRevenue) * 100}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-slate-700 flex items-center justify-end space-x-4 text-sm">
        <div className="flex items-center">
          <div className="w-3 h-3 bg-blue-500 rounded mr-1"></div>
          <span className="text-gray-600 dark:text-gray-400">Revenus</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-purple-500 rounded mr-1"></div>
          <span className="text-gray-600 dark:text-gray-400">Frais</span>
        </div>
      </div>
    </div>
  );
};

// Composant de graphique circulaire (simplifié)
const PieChartComponent = ({
  data,
  title,
  icon: Icon,
}: {
  data: ServicesByCategory[] | ServicesByStatus[];
  title: string;
  icon: any;
}) => {
  const total = data.reduce((sum, item) => sum + item.count, 0);

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-slate-700">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4 flex items-center">
        <Icon className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" />
        {title}
      </h3>

      <div className="space-y-3">
        {data.map((item, index) => (
          <div key={index}>
            <div className="flex items-center justify-between text-sm mb-1">
              <div className="flex items-center">
                <div
                  className="w-3 h-3 rounded-full mr-2"
                  style={{ backgroundColor: item.color }}
                ></div>
                <span className="text-gray-700 dark:text-gray-300">
                  {item.category || item.status}
                </span>
              </div>
              <span className="text-gray-600 dark:text-gray-400">
                {item.count} ({item.percentage}%)
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2">
              <div
                className="h-2 rounded-full transition-all"
                style={{
                  width: `${item.percentage}%`,
                  backgroundColor: item.color,
                }}
              ></div>
            </div>
          </div>
        ))}
      </div>

      <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
        Total: {total} services
      </p>
    </div>
  );
};

// Composant du tableau des top freelancers
const TopFreelancersTable = ({
  freelancers,
}: {
  freelancers: TopFreelancer[];
}) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-slate-700">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4 flex items-center">
        <Award className="w-5 h-5 mr-2 text-yellow-500 dark:text-yellow-400" />
        Top Freelancers
      </h3>

      <div className="space-y-4">
        {freelancers.map((freelancer, index) => (
          <div
            key={freelancer.id}
            className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition"
          >
            <div className="flex items-center">
              <div className="w-8 h-8 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center text-yellow-600 dark:text-yellow-400 font-bold mr-3">
                #{index + 1}
              </div>
              {freelancer.avatar ? (
                <img
                  src={freelancer.avatar}
                  alt={freelancer.name}
                  className="w-10 h-10 rounded-full mr-3 object-cover"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gray-300 dark:bg-slate-600 flex items-center justify-center mr-3">
                  <Users className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                </div>
              )}
              <div>
                <p className="font-medium text-gray-800 dark:text-gray-100">
                  {freelancer.name}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {freelancer.services_completed} services • ⭐{" "}
                  {freelancer.average_rating}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-bold text-gray-800 dark:text-gray-100">
                {formatCurrency(freelancer.total_earned)}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {freelancer.response_rate}% de réponse
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Composant de carte de performance
const PerformanceCard = ({ metrics }: { metrics: PerformanceMetrics[] }) => {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-slate-700">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4 flex items-center">
        <Activity className="w-5 h-5 mr-2 text-green-600 dark:text-green-400" />
        Indicateurs de performance
      </h3>

      <div className="grid grid-cols-2 gap-4">
        {metrics.map((metric, index) => {
          const progress = (metric.value / metric.target) * 100;
          const change =
            ((metric.value - metric.previous) / metric.previous) * 100;

          return (
            <div
              key={index}
              className="p-3 bg-gray-50 dark:bg-slate-700/50 rounded-lg"
            >
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                {metric.metric}
              </p>
              <div className="flex items-end justify-between mb-2">
                <p className="text-xl font-bold text-gray-800 dark:text-gray-100">
                  {metric.value}
                  {metric.unit && (
                    <span className="text-sm ml-1 text-gray-500 dark:text-gray-400">
                      {metric.unit}
                    </span>
                  )}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Objectif: {metric.target}
                  {metric.unit}
                </p>
              </div>
              <div className="w-full bg-gray-200 dark:bg-slate-600 rounded-full h-2 mb-2">
                <div
                  className={`h-2 rounded-full ${
                    progress >= 100
                      ? "bg-green-500"
                      : progress >= 75
                        ? "bg-blue-500"
                        : progress >= 50
                          ? "bg-yellow-500"
                          : "bg-red-500"
                  }`}
                  style={{ width: `${Math.min(progress, 100)}%` }}
                ></div>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500 dark:text-gray-400">
                  Période précédente
                </span>
                <span
                  className={`flex items-center ${
                    change >= 0
                      ? "text-green-600 dark:text-green-400"
                      : "text-red-600 dark:text-red-400"
                  }`}
                >
                  {change >= 0 ? (
                    <ArrowUp className="w-3 h-3 mr-1" />
                  ) : (
                    <ArrowDown className="w-3 h-3 mr-1" />
                  )}
                  {Math.abs(change).toFixed(1)}%
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Composant de distribution géographique
const GeographicDistribution = ({
  data,
}: {
  data: GeographicDistribution[];
}) => {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-slate-700">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4 flex items-center">
        <MapPin className="w-5 h-5 mr-2 text-red-500 dark:text-red-400" />
        Distribution géographique
      </h3>

      <div className="space-y-3">
        {data.map((item, index) => (
          <div key={index}>
            <div className="flex items-center justify-between text-sm mb-1">
              <span className="text-gray-700 dark:text-gray-300">
                {item.city}
              </span>
              <span className="text-gray-600 dark:text-gray-400">
                {item.count} ({item.percentage}%)
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2">
              <div
                className="h-2 rounded-full bg-red-500 transition-all"
                style={{ width: `${item.percentage}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Sélecteur de plage de dates
const DateRangePicker = ({
  dateRange,
  onDateRangeChange,
}: {
  dateRange: { startDate: string; endDate: string };
  onDateRangeChange: (range: { startDate: string; endDate: string }) => void;
}) => {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-4 flex items-center space-x-4 border border-gray-200 dark:border-slate-700">
      <Calendar className="w-5 h-5 text-gray-400 dark:text-gray-500" />
      <div className="flex items-center space-x-2">
        <input
          type="date"
          value={dateRange.startDate}
          onChange={(e) =>
            onDateRangeChange({ ...dateRange, startDate: e.target.value })
          }
          className="px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100"
        />
        <span className="text-gray-500 dark:text-gray-400">-</span>
        <input
          type="date"
          value={dateRange.endDate}
          onChange={(e) =>
            onDateRangeChange({ ...dateRange, endDate: e.target.value })
          }
          className="px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100"
        />
      </div>
    </div>
  );
};

// Page principale
export default function ReportsPage() {
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState<"day" | "week" | "month" | "year">(
    "month",
  );
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().setDate(new Date().getDate() - 30))
      .toISOString()
      .split("T")[0],
    endDate: new Date().toISOString().split("T")[0],
  });

  // États pour les données
  const [stats, setStats] = useState<ReportStats | null>(null);
  const [revenueData, setRevenueData] = useState<RevenueData[]>([]);
  const [servicesByCategory, setServicesByCategory] = useState<
    ServicesByCategory[]
  >([]);
  const [servicesByStatus, setServicesByStatus] = useState<ServicesByStatus[]>(
    [],
  );
  const [topFreelancers, setTopFreelancers] = useState<TopFreelancer[]>([]);
  const [activityData, setActivityData] = useState<ActivityData[]>([]);
  const [geographicData, setGeographicData] = useState<
    GeographicDistribution[]
  >([]);
  const [performanceMetrics, setPerformanceMetrics] = useState<
    PerformanceMetrics[]
  >([]);

  // Charger les données
  useEffect(() => {
    const loadReportsData = async () => {
      try {
        setLoading(true);

        // Utiliser les mock data
        setStats(mockReports.stats);
        setRevenueData(mockReports.revenueData);
        setServicesByCategory(mockReports.servicesByCategory);
        setServicesByStatus(mockReports.servicesByStatus);
        setTopFreelancers(mockReports.topFreelancers);
        setActivityData(mockReports.activityData);
        setGeographicData(mockReports.geographicDistribution);
        setPerformanceMetrics(mockReports.performanceMetrics);
      } catch (error) {
        console.error("Erreur chargement rapports:", error);
      } finally {
        setLoading(false);
      }
    };

    loadReportsData();
  }, [period, dateRange]);

  const handleExport = async (format: "pdf" | "csv" | "excel") => {
    try {
      const blob = await exportReport(format, "full", { dateRange });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `rapport-${new Date().toISOString().split("T")[0]}.${
        format === "pdf" ? "pdf" : format === "csv" ? "csv" : "xlsx"
      }`;
      a.click();
    } catch (error) {
      console.error("Erreur export:", error);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("fr-FR").format(num);
  };

  if (loading && !stats) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950">
      <div className="container mx-auto">
        {/* En-tête */}
        <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-100 flex items-center">
              <BarChart3 className="w-6 h-6 mr-2 text-blue-400" />
              Tableau de bord des rapports
            </h1>
            <p className="text-gray-400 mt-1">
              Analysez les performances de votre plateforme
            </p>
          </div>

          <div className="flex space-x-2">
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 text-gray-300 border border-slate-700 rounded-lg hover:bg-slate-800 flex items-center transition"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Actualiser
            </button>
            <div className="relative group">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center transition">
                <Download className="w-4 h-4 mr-2" />
                Exporter
              </button>
              <div className="absolute right-0 mt-2 w-48 bg-slate-800 rounded-lg shadow-lg hidden group-hover:block z-10 border border-slate-700">
                <button
                  onClick={() => handleExport("pdf")}
                  className="block w-full text-left px-4 py-2 text-gray-300 hover:bg-slate-700 first:rounded-t-lg"
                >
                  PDF
                </button>
                <button
                  onClick={() => handleExport("csv")}
                  className="block w-full text-left px-4 py-2 text-gray-300 hover:bg-slate-700"
                >
                  CSV
                </button>
                <button
                  onClick={() => handleExport("excel")}
                  className="block w-full text-left px-4 py-2 text-gray-300 hover:bg-slate-700 last:rounded-b-lg"
                >
                  Excel
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Filtres */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
          <DateRangePicker
            dateRange={dateRange}
            onDateRangeChange={setDateRange}
          />
          <div className="flex justify-end">
            <PeriodSelector period={period} onPeriodChange={setPeriod} />
          </div>
        </div>

        {/* Cartes de statistiques */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <StatsCard
              title="Revenus totaux"
              value={stats.total_revenue}
              change={stats.previous_period.revenue}
              icon={DollarSign}
              color="bg-green-500"
              formatter={formatCurrency}
            />
            <StatsCard
              title="Services"
              value={stats.total_services}
              change={stats.previous_period.services}
              icon={Briefcase}
              color="bg-blue-500"
              formatter={formatNumber}
            />
            <StatsCard
              title="Utilisateurs"
              value={stats.total_users}
              change={stats.previous_period.users}
              icon={Users}
              color="bg-purple-500"
              formatter={formatNumber}
            />
            <StatsCard
              title="Note moyenne"
              value={stats.average_rating}
              icon={Star}
              color="bg-yellow-500"
              formatter={(val) => val.toFixed(1)}
            />
          </div>
        )}

        {/* Deuxième ligne de statistiques */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-4 border border-gray-200 dark:border-slate-700">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                Taux de complétion
              </p>
              <p className="text-xl font-bold text-gray-800 dark:text-gray-100">
                {stats.completion_rate}%
              </p>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-4 border border-gray-200 dark:border-slate-700">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                Taux de réponse
              </p>
              <p className="text-xl font-bold text-gray-800 dark:text-gray-100">
                {stats.response_rate}%
              </p>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-4 border border-gray-200 dark:border-slate-700">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                Taux de litiges
              </p>
              <p className="text-xl font-bold text-gray-800 dark:text-gray-100">
                {stats.dispute_rate}%
              </p>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-4 border border-gray-200 dark:border-slate-700">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                Freelancers
              </p>
              <p className="text-xl font-bold text-gray-800 dark:text-gray-100">
                {stats.total_freelancers}
              </p>
            </div>
          </div>
        )}

        {/* Graphiques principaux */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Graphique des revenus */}
          {revenueData.length > 0 && (
            <RevenueChart data={revenueData} period={period} />
          )}

          {/* Graphique des services par catégorie */}
          {servicesByCategory.length > 0 && (
            <PieChartComponent
              data={servicesByCategory}
              title="Services par catégorie"
              icon={PieChart}
            />
          )}
        </div>

        {/* Deuxième ligne de graphiques */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Services par statut */}
          {servicesByStatus.length > 0 && (
            <PieChartComponent
              data={servicesByStatus}
              title="Services par statut"
              icon={Grid3X3}
            />
          )}

          {/* Distribution géographique */}
          {geographicData.length > 0 && (
            <GeographicDistribution data={geographicData} />
          )}
        </div>

        {/* Top freelancers et performance */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Top freelancers */}
          {topFreelancers.length > 0 && (
            <TopFreelancersTable freelancers={topFreelancers} />
          )}

          {/* Indicateurs de performance */}
          {performanceMetrics.length > 0 && (
            <PerformanceCard metrics={performanceMetrics} />
          )}
        </div>

        {/* Tableau d'activité */}
        {activityData.length > 0 && (
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-slate-700">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4 flex items-center">
              <Activity className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" />
              Activité récente
            </h3>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-slate-700">
                <thead className="bg-gray-50 dark:bg-slate-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Inscriptions
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Services
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Paiements
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-slate-800 divide-y divide-gray-200 dark:divide-slate-700">
                  {activityData.slice(0, 7).map((item, index) => (
                    <tr
                      key={index}
                      className="hover:bg-gray-50 dark:hover:bg-slate-700/50 transition"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                        {item.date}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                        {item.registrations}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                        {item.services}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                        {new Intl.NumberFormat("fr-FR", {
                          style: "currency",
                          currency: "EUR",
                          minimumFractionDigits: 0,
                        }).format(item.payments)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
