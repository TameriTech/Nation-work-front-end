// loading.tsx
"use client";

export default function PaymentsLoading() {
  return (
    <div className="min-h-screen dark:bg-slate-950">
      <div className="container mx-auto">
        {/* En-tête skeleton */}
        <div className="mb-6">
          <div className="flex items-center">
            <div className="w-6 h-6 bg-slate-700 rounded-lg animate-pulse mr-2"></div>
            <div className="h-8 w-64 bg-slate-700 rounded-lg animate-pulse"></div>
          </div>
          <div className="h-4 w-72 bg-slate-700 rounded-lg animate-pulse mt-2"></div>
        </div>

        {/* Cartes de statistiques skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="bg-slate-800 rounded-lg border border-slate-700 p-6 animate-pulse"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-slate-700 rounded-lg"></div>
                <div className="w-16 h-6 bg-slate-700 rounded-full"></div>
              </div>
              <div className="h-4 w-24 bg-slate-700 rounded mb-1"></div>
              <div className="h-8 w-32 bg-slate-700 rounded mb-2"></div>
              <div className="h-4 w-28 bg-slate-700 rounded"></div>
            </div>
          ))}
        </div>

        {/* Actions rapides skeleton */}
        <div className="bg-slate-800 rounded-lg border border-slate-700 p-4 mb-6 flex flex-col sm:flex-row justify-between items-center gap-4 animate-pulse">
          <div className="flex flex-wrap gap-2">
            <div className="w-32 h-10 bg-slate-700 rounded-lg"></div>
            <div className="w-32 h-10 bg-slate-700 rounded-lg"></div>
          </div>
          <div className="flex flex-wrap gap-4">
            <div className="h-4 w-32 bg-slate-700 rounded"></div>
            <div className="h-4 w-4 bg-slate-700 rounded hidden sm:block"></div>
            <div className="h-4 w-20 bg-slate-700 rounded"></div>
            <div className="h-4 w-20 bg-slate-700 rounded"></div>
            <div className="h-4 w-20 bg-slate-700 rounded"></div>
          </div>
        </div>

        {/* Filtres skeleton */}
        <div className="bg-slate-800 rounded-lg border border-slate-700 p-4 mb-6 animate-pulse">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Recherche */}
            <div className="col-span-2">
              <div className="h-4 w-20 bg-slate-700 rounded mb-2"></div>
              <div className="h-10 bg-slate-700 rounded-lg"></div>
            </div>

            {/* Filtre statut */}
            <div>
              <div className="h-4 w-16 bg-slate-700 rounded mb-2"></div>
              <div className="h-10 bg-slate-700 rounded-lg"></div>
            </div>

            {/* Filtre méthode */}
            <div>
              <div className="h-4 w-20 bg-slate-700 rounded mb-2"></div>
              <div className="h-10 bg-slate-700 rounded-lg"></div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            {/* Date début */}
            <div>
              <div className="h-4 w-20 bg-slate-700 rounded mb-2"></div>
              <div className="h-10 bg-slate-700 rounded-lg"></div>
            </div>

            {/* Date fin */}
            <div>
              <div className="h-4 w-20 bg-slate-700 rounded mb-2"></div>
              <div className="h-10 bg-slate-700 rounded-lg"></div>
            </div>

            {/* Montant min/max */}
            <div className="flex space-x-2">
              <div className="flex-1">
                <div className="h-4 w-12 bg-slate-700 rounded mb-2"></div>
                <div className="h-10 bg-slate-700 rounded-lg"></div>
              </div>
              <div className="flex-1">
                <div className="h-4 w-12 bg-slate-700 rounded mb-2"></div>
                <div className="h-10 bg-slate-700 rounded-lg"></div>
              </div>
            </div>
          </div>

          <div className="flex justify-end mt-4 space-x-2">
            <div className="w-32 h-10 bg-slate-700 rounded-lg"></div>
            <div className="w-32 h-10 bg-slate-700 rounded-lg"></div>
          </div>
        </div>

        {/* Tableau skeleton */}
        <div className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden animate-pulse">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-700">
              <thead className="bg-slate-700">
                <tr>
                  {[
                    "Transaction",
                    "Service",
                    "Client",
                    "Freelancer",
                    "Montant",
                    "Statut",
                    "Méthode",
                    "Date",
                    "Actions",
                  ].map((header, i) => (
                    <th key={i} className="px-6 py-3 text-left">
                      <div className="h-4 w-20 bg-slate-600 rounded"></div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {[...Array(5)].map((_, rowIndex) => (
                  <tr key={rowIndex} className="hover:bg-slate-700/50">
                    {/* Transaction ID */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-4 w-16 bg-slate-700 rounded mb-2"></div>
                      <div className="h-3 w-12 bg-slate-700 rounded"></div>
                    </td>

                    {/* Service */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-4 w-32 bg-slate-700 rounded mb-2"></div>
                      <div className="h-3 w-20 bg-slate-700 rounded"></div>
                    </td>

                    {/* Client */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-4 w-24 bg-slate-700 rounded"></div>
                    </td>

                    {/* Freelancer */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-4 w-24 bg-slate-700 rounded"></div>
                    </td>

                    {/* Montant */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-4 w-20 bg-slate-700 rounded mb-2"></div>
                      <div className="h-3 w-16 bg-slate-700 rounded"></div>
                    </td>

                    {/* Statut */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-6 w-20 bg-slate-700 rounded-full"></div>
                    </td>

                    {/* Méthode */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-4 h-4 bg-slate-700 rounded mr-1"></div>
                        <div className="h-4 w-16 bg-slate-700 rounded"></div>
                      </div>
                    </td>

                    {/* Date */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-4 w-20 bg-slate-700 rounded mb-2"></div>
                      <div className="h-3 w-16 bg-slate-700 rounded"></div>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center justify-end space-x-2">
                        <div className="w-8 h-8 bg-slate-700 rounded"></div>
                        <div className="w-8 h-8 bg-slate-700 rounded"></div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination skeleton */}
        <div className="bg-slate-800 rounded-lg border border-slate-700 p-4 mt-4 flex flex-col sm:flex-row items-center justify-between gap-4 animate-pulse">
          <div className="h-4 w-64 bg-slate-700 rounded"></div>
          <div className="flex space-x-2">
            <div className="w-10 h-10 bg-slate-700 rounded-lg"></div>
            <div className="w-10 h-10 bg-slate-700 rounded-lg"></div>
            <div className="w-16 h-10 bg-slate-700 rounded-lg"></div>
            <div className="w-10 h-10 bg-slate-700 rounded-lg"></div>
            <div className="w-10 h-10 bg-slate-700 rounded-lg"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
