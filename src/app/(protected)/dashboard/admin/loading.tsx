"use client";

import {
  Users,
  Briefcase,
  DollarSign,
  Scale,
  Activity,
  BarChart3,
  PieChart,
  Bell,
  Clock,
  TrendingUp,
  Star,
  DollarSignIcon,
} from "lucide-react";

export default function AdminDashboardLoading() {
  return (
    <div className="min-h-screen dark:bg-slate-950">
      <div className="container mx-auto">
        {/* En-tête avec dégradé skeleton */}
        <div className="bg-gradient-to-r from-blue-600/50 to-indigo-700/50 text-white rounded-lg shadow-lg p-6 mb-6 border border-blue-400/20">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <div className="h-8 w-64 bg-white/20 rounded animate-pulse mb-2"></div>
              <div className="flex items-center">
                <div className="h-4 w-4 bg-white/20 rounded animate-pulse mr-2"></div>
                <div className="h-4 w-48 bg-white/20 rounded animate-pulse"></div>
              </div>
              <div className="flex items-center mt-2">
                <div className="h-3 w-3 bg-white/20 rounded animate-pulse mr-1"></div>
                <div className="h-3 w-32 bg-white/20 rounded animate-pulse"></div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="w-5 h-5 bg-white/20 rounded animate-pulse"></div>
              </div>
              <div className="w-5 h-5 bg-white/20 rounded animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Cartes de statistiques skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-5 border border-gray-200 dark:border-slate-700"
            >
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`w-12 h-12 rounded-lg flex items-center justify-center shadow-lg ${
                    i === 1
                      ? "bg-blue-500/50"
                      : i === 2
                        ? "bg-green-500/50"
                        : i === 3
                          ? "bg-purple-500/50"
                          : "bg-orange-500/50"
                  }`}
                >
                  {i === 1 && <Users className="w-6 h-6 text-white/50" />}
                  {i === 2 && <Briefcase className="w-6 h-6 text-white/50" />}
                  {i === 3 && (
                    <DollarSignIcon className="w-6 h-6 text-white/50" />
                  )}
                  {i === 4 && <Scale className="w-6 h-6 text-white/50" />}
                </div>
                <div className="w-16 h-6 bg-gray-200 dark:bg-slate-700 rounded-full animate-pulse"></div>
              </div>
              <div className="h-4 w-24 bg-gray-200 dark:bg-slate-700 rounded animate-pulse mb-2"></div>
              <div className="h-8 w-32 bg-gray-200 dark:bg-slate-700 rounded animate-pulse mb-2"></div>
              <div className="h-4 w-28 bg-gray-200 dark:bg-slate-700 rounded animate-pulse"></div>
            </div>
          ))}
        </div>

        {/* Graphiques skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Graphique des revenus skeleton */}
          <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg shadow-lg p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
              <div className="flex items-center">
                <BarChart3 className="w-5 h-5 mr-2 text-gray-300 dark:text-gray-600" />
                <div className="h-5 w-40 bg-gray-200 dark:bg-slate-700 rounded animate-pulse"></div>
              </div>
              <div className="w-32 h-8 bg-gray-200 dark:bg-slate-700 rounded animate-pulse"></div>
            </div>

            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center">
                  <div className="w-20 h-4 bg-gray-200 dark:bg-slate-700 rounded animate-pulse"></div>
                  <div className="flex-1 mx-3">
                    <div
                      className="h-8 bg-blue-500/30 rounded-lg animate-pulse"
                      style={{ width: `${Math.random() * 80 + 20}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Graphique de répartition skeleton */}
          <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg shadow-lg p-6">
            <div className="flex items-center mb-4">
              <PieChart className="w-5 h-5 mr-2 text-gray-300 dark:text-gray-600" />
              <div className="h-5 w-40 bg-gray-200 dark:bg-slate-700 rounded animate-pulse"></div>
            </div>

            <div className="space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center">
                  <div className="w-24 h-4 bg-gray-200 dark:bg-slate-700 rounded animate-pulse"></div>
                  <div className="flex-1 mx-3">
                    <div
                      className="h-8 rounded-lg animate-pulse"
                      style={{
                        width: `${Math.random() * 60 + 20}%`,
                        backgroundColor:
                          i === 1
                            ? "rgba(59, 130, 246, 0.3)"
                            : i === 2
                              ? "rgba(34, 197, 94, 0.3)"
                              : i === 3
                                ? "rgba(249, 115, 22, 0.3)"
                                : "rgba(239, 68, 68, 0.3)",
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Activités récentes et actions rapides skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Activités récentes skeleton */}
          <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-slate-700">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center">
                <Activity className="w-5 h-5 mr-2 text-gray-300 dark:text-gray-600" />
                <div className="h-5 w-36 bg-gray-200 dark:bg-slate-700 rounded animate-pulse"></div>
              </div>
              <div className="h-4 w-20 bg-gray-200 dark:bg-slate-700 rounded animate-pulse"></div>
            </div>

            <div className="space-y-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-start space-x-4 p-3">
                  <div className="w-10 h-10 rounded-lg bg-gray-200 dark:bg-slate-700 animate-pulse"></div>
                  <div className="flex-1">
                    <div className="h-4 w-48 bg-gray-200 dark:bg-slate-700 rounded animate-pulse mb-2"></div>
                    <div className="h-3 w-32 bg-gray-200 dark:bg-slate-700 rounded animate-pulse"></div>
                  </div>
                  <div className="text-right">
                    <div className="h-3 w-16 bg-gray-200 dark:bg-slate-700 rounded animate-pulse"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Actions rapides skeleton */}
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-slate-700">
            <div className="h-6 w-32 bg-gray-200 dark:bg-slate-700 rounded animate-pulse mb-4"></div>

            <div className="grid grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="p-4 bg-gray-50 dark:bg-slate-700/50 rounded-lg border border-gray-200 dark:border-slate-700"
                >
                  <div className="w-6 h-6 mx-auto mb-2 bg-gray-200 dark:bg-slate-600 rounded animate-pulse"></div>
                  <div className="h-4 w-16 mx-auto bg-gray-200 dark:bg-slate-600 rounded animate-pulse"></div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-gray-200 dark:border-slate-700">
              <div className="h-4 w-32 bg-gray-200 dark:bg-slate-700 rounded animate-pulse mb-2"></div>
              <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex justify-between items-center">
                    <div className="flex items-center">
                      <TrendingUp className="w-4 h-4 mr-1 text-gray-300 dark:text-gray-600" />
                      <div className="h-3 w-20 bg-gray-200 dark:bg-slate-700 rounded animate-pulse"></div>
                    </div>
                    <div className="h-3 w-8 bg-gray-200 dark:bg-slate-700 rounded animate-pulse"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer skeleton */}
        <div className="mt-6 text-center">
          <div className="flex items-center justify-center">
            <Clock className="w-4 h-4 mr-1 text-gray-300 dark:text-gray-600" />
            <div className="h-4 w-48 bg-gray-200 dark:bg-slate-700 rounded animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Style pour l'animation smooth */}
      <style jsx>{`
        @keyframes pulse {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </div>
  );
}
