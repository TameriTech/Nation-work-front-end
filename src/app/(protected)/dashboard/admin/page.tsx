"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  getDashboardStats,
  getRecentActivities,
  getChartData,
} from "@/app/services/dashboard.service";
import type {
  DashboardStats,
  RecentActivity,
  ChartData,
} from "@/app/types/admin";

import { dashboard } from "@/data/admin-mock-data";

// Import des icônes Lucide
import {
  Users,
  Briefcase,
  DollarSign,
  Scale,
  Bell,
  RefreshCw,
  CheckCircle,
  FolderPlus,
  Send,
  UserPlus,
  CreditCard,
  Clock,
  Star,
  TrendingUp,
  TrendingDown,
  Loader2,
  XCircle,
  Activity,
  Calendar,
  PieChart,
  BarChart3,
  ArrowRight,
} from "lucide-react";

// Composants UI
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen bg-slate-950">
    <div className="relative">
      <Loader2 className="w-16 h-16 text-blue-600 animate-spin" />
      <p className="mt-4 text-gray-400">Chargement du dashboard...</p>
    </div>
  </div>
);

const ErrorMessage = ({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) => (
  <div className="flex items-center justify-center min-h-screen bg-slate-950">
    <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-6 rounded-lg max-w-lg">
      <div className="flex items-center mb-4">
        <XCircle className="text-red-500 w-8 h-8 mr-3" />
        <h3 className="text-lg font-semibold text-red-800 dark:text-red-200">
          Erreur
        </h3>
      </div>
      <p className="text-red-600 dark:text-red-300 mb-4">{message}</p>
      <button
        onClick={onRetry}
        className="bg-red-600 dark:bg-red-700 text-white px-4 py-2 rounded-lg hover:bg-red-700 dark:hover:bg-red-800 transition flex items-center"
      >
        <RefreshCw className="w-4 h-4 mr-2" />
        Réessayer
      </button>
    </div>
  </div>
);

// Carte de statistique
const StatCard = ({
  title,
  value,
  subValue,
  growth,
  icon: Icon,
  color,
}: any) => (
  <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-5 hover:shadow-xl transition-shadow border border-gray-200 dark:border-slate-700">
    <div className="flex items-center justify-between mb-4">
      <div
        className={`${color} w-12 h-12 rounded-lg flex items-center justify-center text-white shadow-lg`}
      >
        <Icon className="w-6 h-6" />
      </div>
      <div
        className={`text-sm font-semibold flex items-center ${
          growth >= 0
            ? "text-green-600 dark:text-green-400"
            : "text-red-600 dark:text-red-400"
        }`}
      >
        {growth >= 0 ? (
          <TrendingUp className="w-4 h-4 mr-1" />
        ) : (
          <TrendingDown className="w-4 h-4 mr-1" />
        )}
        {Math.abs(growth)}%
      </div>
    </div>
    <h3 className="text-gray-600 dark:text-gray-300 text-sm font-medium mb-1">
      {title}
    </h3>
    <p className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
      {value}
    </p>
    <p className="text-sm text-gray-500 dark:text-gray-400">{subValue}</p>
  </div>
);

// Carte d'activité récente
const ActivityItem = ({ activity }: { activity: RecentActivity }) => {
  const getIcon = (type: string) => {
    const icons: Record<string, any> = {
      user_registration: UserPlus,
      service_created: Briefcase,
      payment_received: CreditCard,
      dispute_opened: Scale,
      verification_pending: CheckCircle,
    };
    const IconComponent = icons[type] || Activity;
    return <IconComponent className="w-5 h-5" />;
  };

  const getColor = (type: string) => {
    const colors: Record<string, string> = {
      user_registration:
        "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400",
      service_created:
        "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
      payment_received:
        "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400",
      dispute_opened:
        "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400",
      verification_pending:
        "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400",
    };
    return (
      colors[type] ||
      "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
    );
  };

  return (
    <div className="flex items-start space-x-4 p-3 hover:bg-gray-50 dark:hover:bg-slate-700/50 rounded-lg transition">
      <div
        className={`w-10 h-10 rounded-lg flex items-center justify-center ${getColor(activity.type)}`}
      >
        {getIcon(activity.type)}
      </div>
      <div className="flex-1">
        <p className="text-gray-800 dark:text-gray-200">
          {activity.description}
        </p>
        {activity.user && (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Par {activity.user.name} ({activity.user.role})
          </p>
        )}
      </div>
      <div className="text-right">
        <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
          <Clock className="w-3 h-3 mr-1" />
          {activity.time_ago}
        </p>
      </div>
    </div>
  );
};

// Page principale
export default function AdminDashboardPage() {
  const router = useRouter();

  // États - Initialisés avec les mock data
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<DashboardStats>(dashboard.stats);
  const [activities, setActivities] = useState<RecentActivity[]>(
    dashboard.recent_activities,
  );
  const [chartData, setChartData] = useState<any>(dashboard.charts);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [period, setPeriod] = useState<"week" | "month" | "year">("month");

  const loadDashboardData = async () => {
    setLastUpdated(new Date());
  };

  useEffect(() => {
    // loadDashboardData();
  }, [period]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("fr-FR").format(num);
  };

  const unreadCount = activities.filter(
    (a) => a.type === "dispute_opened" || a.type === "verification_pending",
  ).length;

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Bonjour";
    if (hour < 18) return "Bon après-midi";
    return "Bonsoir";
  };

  if (loading && !stats) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={loadDashboardData} />;
  }

  return (
    <div className="min-h-screen dark:bg-slate-950">
      <div className="container mx-auto">
        {/* En-tête avec dégradé */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-lg shadow-lg p-6 mb-6 border border-blue-400/20">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">
                {getGreeting()}, Admin! 👋
              </h1>
              <p className="text-blue-100 flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                {new Date().toLocaleDateString("fr-FR", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
              <p className="text-sm text-blue-200 mt-2 flex items-center">
                <Clock className="w-3 h-3 mr-1" />
                Dernière mise à jour: {lastUpdated.toLocaleTimeString("fr-FR")}
              </p>
            </div>

            <div className="flex items-center space-x-4">
              {unreadCount > 0 && (
                <div className="relative">
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                    {unreadCount}
                  </span>
                  <button className="p-2 hover:bg-blue-500 rounded-full transition">
                    <Bell className="w-5 h-5" />
                  </button>
                </div>
              )}

              <button
                onClick={loadDashboardData}
                className="p-2 hover:bg-blue-500 rounded-full transition"
                title="Rafraîchir"
              >
                <RefreshCw className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Cartes de statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <StatCard
            title="Utilisateurs"
            value={formatNumber(stats.users.total)}
            subValue={`+${stats.users.new} cette semaine`}
            growth={stats.users.growth}
            icon={Users}
            color="bg-blue-500"
          />
          <StatCard
            title="Services"
            value={formatNumber(stats.services.total)}
            subValue={`${stats.services.active} en cours`}
            growth={stats.services.growth}
            icon={Briefcase}
            color="bg-green-500"
          />
          <StatCard
            title="Paiements"
            value={formatCurrency(stats.payments.total_amount)}
            subValue={`${formatCurrency(stats.payments.pending_payouts)} en attente`}
            growth={stats.payments.growth}
            icon={DollarSign}
            color="bg-purple-500"
          />
          <StatCard
            title="Litiges"
            value={formatNumber(stats.disputes.open)}
            subValue={`${stats.disputes.resolved} résolus`}
            growth={stats.disputes.change}
            icon={Scale}
            color="bg-orange-500"
          />
        </div>

        {/* Graphiques */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg shadow-lg p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
              <h2 className="text-lg font-semibold flex items-center text-gray-800 dark:text-gray-100">
                <BarChart3 className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" />
                Évolution des revenus
              </h2>
              <select
                value={period}
                onChange={(e) => setPeriod(e.target.value as any)}
                className="text-sm border border-gray-300 dark:border-slate-600 rounded-lg px-3 py-2 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500"
              >
                <option value="week">Cette semaine</option>
                <option value="month">Ce mois</option>
                <option value="year">Cette année</option>
              </select>
            </div>
            <div className="space-y-3">
              {chartData?.revenue.labels
                .slice(-5)
                .map((label: string, i: number) => (
                  <div key={i} className="flex items-center">
                    <span className="w-20 text-sm text-gray-600 dark:text-gray-400">
                      {label}
                    </span>
                    <div className="flex-1 mx-3">
                      <div
                        className="h-8 bg-blue-500 rounded-lg transition-all flex items-center justify-end px-2 text-white text-xs font-medium"
                        style={{
                          width: `${(chartData.revenue.data[i] / Math.max(...chartData.revenue.data)) * 100}%`,
                        }}
                      >
                        {formatCurrency(chartData.revenue.data[i])}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg shadow-lg p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center text-gray-800 dark:text-gray-100">
              <PieChart className="w-5 h-5 mr-2 text-purple-600 dark:text-purple-400" />
              Répartition des services
            </h2>
            <div className="space-y-3">
              {chartData?.service_status.labels.map(
                (label: string, i: number) => (
                  <div key={i} className="flex items-center">
                    <span className="w-24 text-sm text-gray-600 dark:text-gray-400">
                      {label}
                    </span>
                    <div className="flex-1 mx-3">
                      <div
                        className="h-8 rounded-lg transition-all flex items-center justify-end px-2 text-white text-xs font-medium"
                        style={{
                          width: `${(chartData.service_status.data[i] / stats.services.total) * 100}%`,
                          backgroundColor: chartData.service_status.colors[i],
                        }}
                      >
                        {chartData.service_status.data[i]}
                      </div>
                    </div>
                  </div>
                ),
              )}
            </div>
          </div>
        </div>

        {/* Activités récentes et actions rapides */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Activités récentes */}
          <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-slate-700">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold flex items-center text-gray-800 dark:text-gray-100">
                <Activity className="w-5 h-5 mr-2 text-green-600 dark:text-green-400" />
                Activités récentes
              </h2>
              <button
                onClick={() => router.push("/admin/activities")}
                className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 flex items-center transition"
              >
                Voir tout
                <ArrowRight className="w-4 h-4 ml-1" />
              </button>
            </div>

            <div className="space-y-2 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
              {activities.length === 0 ? (
                <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                  Aucune activité récente
                </p>
              ) : (
                activities.map((activity) => (
                  <ActivityItem key={activity.id} activity={activity} />
                ))
              )}
            </div>
          </div>

          {/* Actions rapides */}
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-slate-700">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">
              Actions rapides
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => router.push("/admin/users/verifications")}
                className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg hover:bg-yellow-100 dark:hover:bg-yellow-900/40 transition text-center group border border-yellow-200 dark:border-yellow-800"
              >
                <CheckCircle className="w-6 h-6 mx-auto mb-2 text-yellow-600 dark:text-yellow-400 group-hover:scale-110 transition" />
                <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Vérifications
                </div>
              </button>

              <button
                onClick={() => router.push("/admin/disputes")}
                className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/40 transition text-center group border border-red-200 dark:border-red-800"
              >
                <Scale className="w-6 h-6 mx-auto mb-2 text-red-600 dark:text-red-400 group-hover:scale-110 transition" />
                <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Litiges
                </div>
              </button>

              <button
                onClick={() => router.push("/admin/services/categories/new")}
                className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/40 transition text-center group border border-green-200 dark:border-green-800"
              >
                <FolderPlus className="w-6 h-6 mx-auto mb-2 text-green-600 dark:text-green-400 group-hover:scale-110 transition" />
                <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Catégorie
                </div>
              </button>

              <button
                onClick={() => router.push("/admin/notifications/send")}
                className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/40 transition text-center group border border-purple-200 dark:border-purple-800"
              >
                <Send className="w-6 h-6 mx-auto mb-2 text-purple-600 dark:text-purple-400 group-hover:scale-110 transition" />
                <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Notification
                </div>
              </button>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-200 dark:border-slate-700">
              <h3 className="font-medium mb-2 text-gray-700 dark:text-gray-300">
                Statistiques rapides
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400 flex items-center">
                    <TrendingUp className="w-4 h-4 mr-1 text-green-600 dark:text-green-400" />
                    Taux de conversion
                  </span>
                  <span className="font-medium text-gray-800 dark:text-gray-200">
                    68%
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400 flex items-center">
                    <Clock className="w-4 h-4 mr-1 text-blue-600 dark:text-blue-400" />
                    Temps de réponse
                  </span>
                  <span className="font-medium text-gray-800 dark:text-gray-200">
                    2.5h
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400 flex items-center">
                    <Star className="w-4 h-4 mr-1 text-yellow-600 dark:text-yellow-400" />
                    Satisfaction
                  </span>
                  <span className="font-medium text-gray-800 dark:text-gray-200">
                    4.8/5
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
          <p className="flex items-center justify-center">
            <Clock className="w-4 h-4 mr-1" />
            Dernière mise à jour: {lastUpdated.toLocaleString("fr-FR")} •
            <button
              onClick={loadDashboardData}
              className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 ml-2 flex items-center transition"
            >
              <RefreshCw className="w-4 h-4 mr-1" />
              Rafraîchir
            </button>
          </p>
        </div>
      </div>

      {/* Styles pour la barre de défilement personnalisée */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #1e293b;
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #475569;
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #64748b;
        }
      `}</style>
    </div>
  );
}
