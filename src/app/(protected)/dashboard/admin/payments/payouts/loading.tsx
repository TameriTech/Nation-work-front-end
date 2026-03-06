"use client";

import {
  Wallet,
  Search,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ArrowUpDown,
} from "lucide-react";

export default function PayoutsLoading() {
  return (
    <div className="min-h-screen dark:bg-slate-950">
      <div className="container mx-auto">
        {/* En-tête skeleton */}
        <div className="mb-6">
          <div className="flex items-center">
            <Wallet className="w-6 h-6 mr-2 text-gray-300 dark:text-gray-600" />
            <div className="h-8 w-64 bg-gray-200 dark:bg-slate-700 rounded animate-pulse"></div>
          </div>
          <div className="h-4 w-48 bg-gray-200 dark:bg-slate-700 rounded animate-pulse mt-2"></div>
        </div>

        {/* Cartes de statistiques skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-slate-700"
            >
              <div className="flex items-center justify-between">
                <div className="w-full">
                  <div className="h-4 w-24 bg-gray-200 dark:bg-slate-700 rounded animate-pulse mb-2"></div>
                  <div className="h-8 w-32 bg-gray-200 dark:bg-slate-700 rounded animate-pulse mb-2"></div>
                  <div className="h-4 w-20 bg-gray-200 dark:bg-slate-700 rounded animate-pulse"></div>
                </div>
                <div className="w-12 h-12 bg-gray-200 dark:bg-slate-700 rounded-lg animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Actions rapides skeleton */}
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-4 mb-6 flex flex-col sm:flex-row justify-between items-center gap-4 border border-gray-200 dark:border-slate-700">
          <div className="flex flex-wrap gap-2 w-full sm:w-auto">
            <div className="w-32 h-10 bg-gray-200 dark:bg-slate-700 rounded-lg animate-pulse"></div>
            <div className="w-32 h-10 bg-gray-200 dark:bg-slate-700 rounded-lg animate-pulse"></div>
          </div>
          <div className="flex flex-wrap gap-4 w-full sm:w-auto justify-center">
            <div className="w-24 h-4 bg-gray-200 dark:bg-slate-700 rounded animate-pulse"></div>
            <div className="w-20 h-4 bg-gray-200 dark:bg-slate-700 rounded animate-pulse"></div>
            <div className="w-16 h-4 bg-gray-200 dark:bg-slate-700 rounded animate-pulse"></div>
          </div>
        </div>

        {/* Filtres skeleton */}
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-4 mb-6 border border-gray-200 dark:border-slate-700">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Champ de recherche skeleton */}
            <div className="col-span-2">
              <div className="h-4 w-16 bg-gray-200 dark:bg-slate-700 rounded animate-pulse mb-2"></div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-300 dark:text-gray-600 w-4 h-4" />
                <div className="pl-10 w-full h-10 bg-gray-200 dark:bg-slate-700 rounded-lg animate-pulse"></div>
              </div>
            </div>

            {/* Filtre statut skeleton */}
            <div>
              <div className="h-4 w-12 bg-gray-200 dark:bg-slate-700 rounded animate-pulse mb-2"></div>
              <div className="w-full h-10 bg-gray-200 dark:bg-slate-700 rounded-lg animate-pulse"></div>
            </div>

            {/* Filtre méthode skeleton */}
            <div>
              <div className="h-4 w-16 bg-gray-200 dark:bg-slate-700 rounded animate-pulse mb-2"></div>
              <div className="w-full h-10 bg-gray-200 dark:bg-slate-700 rounded-lg animate-pulse"></div>
            </div>
          </div>

          {/* Dates skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <div className="h-4 w-20 bg-gray-200 dark:bg-slate-700 rounded animate-pulse mb-2"></div>
              <div className="w-full h-10 bg-gray-200 dark:bg-slate-700 rounded-lg animate-pulse"></div>
            </div>
            <div>
              <div className="h-4 w-16 bg-gray-200 dark:bg-slate-700 rounded animate-pulse mb-2"></div>
              <div className="w-full h-10 bg-gray-200 dark:bg-slate-700 rounded-lg animate-pulse"></div>
            </div>
          </div>

          {/* Boutons de filtre skeleton */}
          <div className="flex justify-end mt-4 space-x-2">
            <div className="w-32 h-10 bg-gray-200 dark:bg-slate-700 rounded-lg animate-pulse"></div>
            <div className="w-32 h-10 bg-gray-200 dark:bg-slate-700 rounded-lg animate-pulse"></div>
          </div>
        </div>

        {/* Tableau skeleton */}
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg overflow-hidden border border-gray-200 dark:border-slate-700">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-slate-700">
              {/* En-tête du tableau skeleton */}
              <thead className="bg-gray-50 dark:bg-slate-700">
                <tr>
                  {[
                    "ID Reversement",
                    "Freelancer",
                    "Montant",
                    "Méthode",
                    "Statut",
                    "Demandé le",
                    "Période",
                    "Actions",
                  ].map((header, index) => (
                    <th
                      key={index}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                    >
                      <div className="flex items-center">
                        <div className="h-4 w-20 bg-gray-200 dark:bg-slate-600 rounded animate-pulse"></div>
                        {index < 7 && (
                          <ArrowUpDown className="w-4 h-4 ml-1 text-gray-300 dark:text-gray-600" />
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>

              {/* Corps du tableau skeleton */}
              <tbody className="bg-white dark:bg-slate-800 divide-y divide-gray-200 dark:divide-slate-700">
                {[1, 2, 3, 4, 5].map((row) => (
                  <tr
                    key={row}
                    className="hover:bg-gray-50 dark:hover:bg-slate-700/50"
                  >
                    {/* ID */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-4 w-16 bg-gray-200 dark:bg-slate-700 rounded animate-pulse mb-1"></div>
                      <div className="h-3 w-20 bg-gray-200 dark:bg-slate-700 rounded animate-pulse"></div>
                    </td>

                    {/* Freelancer */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-slate-700 mr-3 animate-pulse"></div>
                        <div>
                          <div className="h-4 w-24 bg-gray-200 dark:bg-slate-700 rounded animate-pulse mb-1"></div>
                          <div className="h-3 w-16 bg-gray-200 dark:bg-slate-700 rounded animate-pulse"></div>
                        </div>
                      </div>
                    </td>

                    {/* Montant */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-4 w-20 bg-gray-200 dark:bg-slate-700 rounded animate-pulse"></div>
                    </td>

                    {/* Méthode */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-4 h-4 bg-gray-200 dark:bg-slate-700 rounded mr-1 animate-pulse"></div>
                        <div className="h-4 w-16 bg-gray-200 dark:bg-slate-700 rounded animate-pulse"></div>
                      </div>
                    </td>

                    {/* Statut */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-6 w-20 bg-gray-200 dark:bg-slate-700 rounded-full animate-pulse"></div>
                    </td>

                    {/* Date */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-4 w-24 bg-gray-200 dark:bg-slate-700 rounded animate-pulse"></div>
                    </td>

                    {/* Période */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-4 w-20 bg-gray-200 dark:bg-slate-700 rounded animate-pulse"></div>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <div className="w-8 h-8 bg-gray-200 dark:bg-slate-700 rounded animate-pulse"></div>
                        <div className="w-8 h-8 bg-gray-200 dark:bg-slate-700 rounded animate-pulse"></div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination skeleton */}
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-4 mt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border border-gray-200 dark:border-slate-700">
          <div className="h-4 w-64 bg-gray-200 dark:bg-slate-700 rounded animate-pulse"></div>
          <div className="flex space-x-2">
            <div className="w-10 h-10 bg-gray-200 dark:bg-slate-700 rounded-lg animate-pulse"></div>
            <div className="w-10 h-10 bg-gray-200 dark:bg-slate-700 rounded-lg animate-pulse"></div>
            <div className="w-16 h-10 bg-gray-200 dark:bg-slate-700 rounded-lg animate-pulse"></div>
            <div className="w-10 h-10 bg-gray-200 dark:bg-slate-700 rounded-lg animate-pulse"></div>
            <div className="w-10 h-10 bg-gray-200 dark:bg-slate-700 rounded-lg animate-pulse"></div>
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
