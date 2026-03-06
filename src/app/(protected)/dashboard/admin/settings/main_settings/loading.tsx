"use client";

import {
  Settings,
  Save,
  DollarSign,
  Mail,
  Shield,
  Search,
  Plus,
} from "lucide-react";

export default function AdminSettingsLoading() {
  return (
    <div className="min-h-screen dark:bg-slate-950">
      <div className="container mx-auto">
        {/* En-tête skeleton */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <div className="flex items-center">
              <Settings className="w-6 h-6 mr-2 text-gray-300 dark:text-gray-600" />
              <div className="h-8 w-64 bg-gray-200 dark:bg-slate-700 rounded animate-pulse"></div>
            </div>
            <div className="h-4 w-72 bg-gray-200 dark:bg-slate-700 rounded animate-pulse mt-2"></div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="w-48 h-10 bg-gray-200 dark:bg-slate-700 rounded-lg animate-pulse"></div>
          </div>
        </div>

        {/* Grille des paramètres */}
        <div className="grid grid-cols-1 gap-6">
          {/* Section Frais de plateforme skeleton */}
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg overflow-hidden border border-gray-200 dark:border-slate-700">
            <div className="h-2 bg-green-500" />
            <div className="p-6">
              <div className="flex items-start mb-4">
                <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center text-white shadow-lg mr-3">
                  <DollarSign className="w-5 h-5" />
                </div>
                <div>
                  <div className="h-6 w-40 bg-gray-200 dark:bg-slate-700 rounded animate-pulse mb-2"></div>
                  <div className="h-4 w-56 bg-gray-200 dark:bg-slate-700 rounded animate-pulse"></div>
                </div>
              </div>

              <div className="space-y-4">
                {/* Résumé des frais skeleton */}
                <div className="grid grid-cols-3 gap-4 mb-4">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="bg-gray-50 dark:bg-slate-700/50 rounded-lg p-3"
                    >
                      <div className="h-3 w-20 bg-gray-200 dark:bg-slate-600 rounded animate-pulse mb-2"></div>
                      <div className="h-6 w-12 bg-gray-200 dark:bg-slate-600 rounded animate-pulse"></div>
                    </div>
                  ))}
                </div>

                {/* Liste des frais skeleton */}
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="p-4 rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <div className="h-5 w-32 bg-gray-200 dark:bg-slate-700 rounded animate-pulse"></div>
                            <div className="h-5 w-20 bg-gray-200 dark:bg-slate-700 rounded-full animate-pulse"></div>
                            <div className="h-4 w-16 bg-gray-200 dark:bg-slate-700 rounded animate-pulse"></div>
                          </div>

                          <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-2">
                            {[1, 2, 3, 4].map((j) => (
                              <div key={j}>
                                <div className="h-4 w-12 bg-gray-200 dark:bg-slate-700 rounded animate-pulse inline-block mr-1"></div>
                                <div className="h-4 w-16 bg-gray-200 dark:bg-slate-700 rounded animate-pulse inline-block"></div>
                              </div>
                            ))}
                          </div>

                          <div className="mt-1 h-4 w-48 bg-gray-200 dark:bg-slate-700 rounded animate-pulse"></div>
                        </div>

                        <div className="flex items-center space-x-2 ml-4">
                          <div className="w-11 h-6 bg-gray-200 dark:bg-slate-700 rounded-full animate-pulse"></div>
                          <div className="w-8 h-8 bg-gray-200 dark:bg-slate-700 rounded animate-pulse"></div>
                          <div className="w-8 h-8 bg-gray-200 dark:bg-slate-700 rounded animate-pulse"></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Bouton d'ajout skeleton */}
                <div className="w-full mt-4 px-4 py-2 border-2 border-dashed border-gray-300 dark:border-slate-600 rounded-lg flex items-center justify-center">
                  <Plus className="w-4 h-4 mr-2 text-gray-400" />
                  <div className="h-4 w-32 bg-gray-200 dark:bg-slate-700 rounded animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Section Templates d'email skeleton */}
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg overflow-hidden border border-gray-200 dark:border-slate-700">
            <div className="h-2 bg-purple-500" />
            <div className="p-6">
              <div className="flex items-start mb-4">
                <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center text-white shadow-lg mr-3">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <div className="h-6 w-40 bg-gray-200 dark:bg-slate-700 rounded animate-pulse mb-2"></div>
                  <div className="h-4 w-56 bg-gray-200 dark:bg-slate-700 rounded animate-pulse"></div>
                </div>
              </div>

              <div className="space-y-4">
                {/* Barre de recherche skeleton */}
                <div className="flex items-center space-x-2">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-300 dark:text-gray-600 w-4 h-4" />
                    <div className="pl-10 w-full h-10 bg-gray-200 dark:bg-slate-700 rounded-lg animate-pulse"></div>
                  </div>
                  <div className="w-40 h-10 bg-gray-200 dark:bg-slate-700 rounded-lg animate-pulse"></div>
                </div>

                {/* Liste des templates skeleton */}
                <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="p-4 rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <div className="h-5 w-32 bg-gray-200 dark:bg-slate-700 rounded animate-pulse"></div>
                            <div className="h-4 w-16 bg-gray-200 dark:bg-slate-700 rounded-full animate-pulse"></div>
                            <div className="h-4 w-16 bg-gray-200 dark:bg-slate-700 rounded-full animate-pulse"></div>
                          </div>

                          <div className="mt-1 h-4 w-64 bg-gray-200 dark:bg-slate-700 rounded animate-pulse"></div>

                          <div className="mt-2 space-y-1">
                            <div className="h-3 w-48 bg-gray-200 dark:bg-slate-700 rounded animate-pulse"></div>
                            <div className="h-3 w-40 bg-gray-200 dark:bg-slate-700 rounded animate-pulse"></div>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2 ml-4">
                          <div className="w-8 h-8 bg-gray-200 dark:bg-slate-700 rounded animate-pulse"></div>
                          <div className="w-8 h-8 bg-gray-200 dark:bg-slate-700 rounded animate-pulse"></div>
                          <div className="w-11 h-6 bg-gray-200 dark:bg-slate-700 rounded-full animate-pulse"></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Test d'envoi skeleton */}
                <div className="mt-4 p-4 bg-gray-50 dark:bg-slate-700/50 rounded-lg">
                  <div className="h-4 w-32 bg-gray-200 dark:bg-slate-700 rounded animate-pulse mb-2"></div>
                  <div className="flex space-x-2">
                    <div className="flex-1 h-10 bg-gray-200 dark:bg-slate-700 rounded-lg animate-pulse"></div>
                    <div className="w-24 h-10 bg-gray-200 dark:bg-slate-700 rounded-lg animate-pulse"></div>
                  </div>
                </div>

                {/* Bouton d'ajout skeleton */}
                <div className="w-full mt-4 px-4 py-2 border-2 border-dashed border-gray-300 dark:border-slate-600 rounded-lg flex items-center justify-center">
                  <Plus className="w-4 h-4 mr-2 text-gray-400" />
                  <div className="h-4 w-32 bg-gray-200 dark:bg-slate-700 rounded animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Section Règles de validation skeleton */}
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg overflow-hidden border border-gray-200 dark:border-slate-700">
            <div className="h-2 bg-orange-500" />
            <div className="p-6">
              <div className="flex items-start mb-4">
                <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center text-white shadow-lg mr-3">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <div className="h-6 w-40 bg-gray-200 dark:bg-slate-700 rounded animate-pulse mb-2"></div>
                  <div className="h-4 w-56 bg-gray-200 dark:bg-slate-700 rounded animate-pulse"></div>
                </div>
              </div>

              <div className="space-y-4">
                {/* Statistiques skeleton */}
                <div className="grid grid-cols-3 gap-4 mb-4">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="bg-gray-50 dark:bg-slate-700/50 rounded-lg p-3"
                    >
                      <div className="h-3 w-16 bg-gray-200 dark:bg-slate-600 rounded animate-pulse mb-2"></div>
                      <div className="h-6 w-12 bg-gray-200 dark:bg-slate-600 rounded animate-pulse"></div>
                    </div>
                  ))}
                </div>

                {/* Liste des règles skeleton */}
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="p-4 rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <div className="h-5 w-40 bg-gray-200 dark:bg-slate-700 rounded animate-pulse"></div>
                            <div className="h-5 w-16 bg-gray-200 dark:bg-slate-700 rounded-full animate-pulse"></div>
                            <div className="h-4 w-16 bg-gray-200 dark:bg-slate-700 rounded animate-pulse"></div>
                          </div>

                          <div className="mt-1 h-4 w-64 bg-gray-200 dark:bg-slate-700 rounded animate-pulse"></div>

                          <div className="mt-2 flex items-center space-x-4">
                            <div className="flex items-center">
                              <div className="w-4 h-4 bg-gray-200 dark:bg-slate-700 rounded animate-pulse mr-1"></div>
                              <div className="h-3 w-20 bg-gray-200 dark:bg-slate-700 rounded animate-pulse"></div>
                            </div>
                            <div className="h-3 w-16 bg-gray-200 dark:bg-slate-700 rounded animate-pulse"></div>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2 ml-4">
                          <div className="w-11 h-6 bg-gray-200 dark:bg-slate-700 rounded-full animate-pulse"></div>
                          <div className="w-8 h-8 bg-gray-200 dark:bg-slate-700 rounded animate-pulse"></div>
                          <div className="w-8 h-8 bg-gray-200 dark:bg-slate-700 rounded animate-pulse"></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Bouton d'ajout skeleton */}
                <div className="w-full mt-4 px-4 py-2 border-2 border-dashed border-gray-300 dark:border-slate-600 rounded-lg flex items-center justify-center">
                  <Plus className="w-4 h-4 mr-2 text-gray-400" />
                  <div className="h-4 w-32 bg-gray-200 dark:bg-slate-700 rounded animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Note de bas de page skeleton */}
        <div className="mt-8 text-center">
          <div className="h-4 w-64 bg-gray-200 dark:bg-slate-700 rounded animate-pulse mx-auto"></div>
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
