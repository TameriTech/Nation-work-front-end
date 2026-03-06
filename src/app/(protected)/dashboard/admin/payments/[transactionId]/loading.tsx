"use client";

import { ArrowLeft } from "lucide-react";

export default function PaymentDetailLoading() {
  return (
    <div className="min-h-screen dark:bg-slate-950">
      <div className="container mx-auto">
        {/* Barre de navigation skeleton */}
        <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center text-gray-400">
            <ArrowLeft className="w-4 h-4 mr-2" />
            <div className="h-4 w-32 bg-gray-200 dark:bg-slate-700 rounded animate-pulse"></div>
          </div>
          <div className="flex flex-wrap gap-2">
            <div className="w-32 h-10 bg-gray-200 dark:bg-slate-700 rounded-lg animate-pulse"></div>
            <div className="w-24 h-10 bg-gray-200 dark:bg-slate-700 rounded-lg animate-pulse"></div>
          </div>
        </div>

        {/* En-tête skeleton */}
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6 mb-6 border border-gray-200 dark:border-slate-700">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="w-full sm:w-auto">
              <div className="flex items-center space-x-3 mb-2">
                <div className="h-8 w-48 bg-gray-200 dark:bg-slate-700 rounded animate-pulse"></div>
                <div className="h-6 w-24 bg-gray-200 dark:bg-slate-700 rounded-full animate-pulse"></div>
              </div>
              <div className="h-4 w-40 bg-gray-200 dark:bg-slate-700 rounded animate-pulse"></div>
            </div>
            <div className="text-right w-full sm:w-auto">
              <div className="h-8 w-32 bg-gray-200 dark:bg-slate-700 rounded animate-pulse mb-2"></div>
              <div className="h-4 w-24 bg-gray-200 dark:bg-slate-700 rounded animate-pulse ml-auto"></div>
            </div>
          </div>
        </div>

        {/* Grille d'informations skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Détails de la transaction skeleton */}
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-slate-700">
            <div className="flex items-center mb-4">
              <div className="w-5 h-5 bg-gray-200 dark:bg-slate-700 rounded mr-2 animate-pulse"></div>
              <div className="h-5 w-40 bg-gray-200 dark:bg-slate-700 rounded animate-pulse"></div>
            </div>
            <div className="space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="flex justify-between py-2 border-b border-gray-100 dark:border-slate-700"
                >
                  <div className="h-4 w-24 bg-gray-200 dark:bg-slate-700 rounded animate-pulse"></div>
                  <div className="h-4 w-32 bg-gray-200 dark:bg-slate-700 rounded animate-pulse"></div>
                </div>
              ))}
            </div>
          </div>

          {/* Client skeleton */}
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-slate-700">
            <div className="flex items-center mb-4">
              <div className="w-5 h-5 bg-gray-200 dark:bg-slate-700 rounded mr-2 animate-pulse"></div>
              <div className="h-5 w-24 bg-gray-200 dark:bg-slate-700 rounded animate-pulse"></div>
            </div>
            <div className="space-y-3">
              {[1, 2].map((i) => (
                <div
                  key={i}
                  className="flex justify-between py-2 border-b border-gray-100 dark:border-slate-700"
                >
                  <div className="h-4 w-16 bg-gray-200 dark:bg-slate-700 rounded animate-pulse"></div>
                  <div className="h-4 w-28 bg-gray-200 dark:bg-slate-700 rounded animate-pulse"></div>
                </div>
              ))}
            </div>
          </div>

          {/* Freelancer skeleton */}
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-slate-700">
            <div className="flex items-center mb-4">
              <div className="w-5 h-5 bg-gray-200 dark:bg-slate-700 rounded mr-2 animate-pulse"></div>
              <div className="h-5 w-28 bg-gray-200 dark:bg-slate-700 rounded animate-pulse"></div>
            </div>
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="flex justify-between py-2 border-b border-gray-100 dark:border-slate-700"
                >
                  <div className="h-4 w-20 bg-gray-200 dark:bg-slate-700 rounded animate-pulse"></div>
                  <div className="h-4 w-28 bg-gray-200 dark:bg-slate-700 rounded animate-pulse"></div>
                </div>
              ))}
            </div>
          </div>

          {/* Service skeleton */}
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-slate-700">
            <div className="flex items-center mb-4">
              <div className="w-5 h-5 bg-gray-200 dark:bg-slate-700 rounded mr-2 animate-pulse"></div>
              <div className="h-5 w-32 bg-gray-200 dark:bg-slate-700 rounded animate-pulse"></div>
            </div>
            <div className="space-y-3">
              {[1, 2].map((i) => (
                <div
                  key={i}
                  className="flex justify-between py-2 border-b border-gray-100 dark:border-slate-700"
                >
                  <div className="h-4 w-16 bg-gray-200 dark:bg-slate-700 rounded animate-pulse"></div>
                  <div className="h-4 w-32 bg-gray-200 dark:bg-slate-700 rounded animate-pulse"></div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Notes et historique skeleton */}
        <div className="grid grid-cols-1 gap-6">
          {/* Notes skeleton */}
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-slate-700">
            <div className="h-5 w-24 bg-gray-200 dark:bg-slate-700 rounded animate-pulse mb-4"></div>
            <div className="space-y-2">
              <div className="h-4 w-full bg-gray-200 dark:bg-slate-700 rounded animate-pulse"></div>
              <div className="h-4 w-3/4 bg-gray-200 dark:bg-slate-700 rounded animate-pulse"></div>
            </div>
          </div>

          {/* Remboursement skeleton (optionnel, affiché aléatoirement pour la variété) */}
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-slate-700">
            <div className="flex items-center mb-4">
              <div className="w-5 h-5 bg-gray-200 dark:bg-slate-700 rounded mr-2 animate-pulse"></div>
              <div className="h-5 w-32 bg-gray-200 dark:bg-slate-700 rounded animate-pulse"></div>
            </div>
            <div className="space-y-2">
              <div className="h-4 w-full bg-gray-200 dark:bg-slate-700 rounded animate-pulse"></div>
              <div className="h-4 w-48 bg-gray-200 dark:bg-slate-700 rounded animate-pulse"></div>
            </div>
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
