// loading.tsx
"use client";

export default function ReportsLoading() {
  return (
    <div className="min-h-screen dark:bg-slate-950">
      <div className="container mx-auto">
        {/* En-tête skeleton */}
        <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center">
              <div className="w-6 h-6 bg-slate-700 rounded-lg animate-pulse mr-2"></div>
              <div className="h-8 w-64 bg-slate-700 rounded-lg animate-pulse"></div>
            </div>
            <div className="h-4 w-48 bg-slate-700 rounded-lg animate-pulse mt-2"></div>
          </div>

          <div className="flex space-x-2">
            <div className="w-32 h-10 bg-slate-700 rounded-lg animate-pulse"></div>
            <div className="w-32 h-10 bg-slate-700 rounded-lg animate-pulse"></div>
          </div>
        </div>

        {/* Filtres skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
          <div className="h-14 bg-slate-800 rounded-lg animate-pulse border border-slate-700"></div>
          <div className="flex justify-end">
            <div className="w-64 h-10 bg-slate-800 rounded-lg animate-pulse border border-slate-700"></div>
          </div>
        </div>

        {/* Cartes de statistiques skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="bg-slate-800 rounded-lg border border-slate-700 p-6 animate-pulse"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="h-4 w-20 bg-slate-700 rounded mb-2"></div>
                  <div className="h-8 w-24 bg-slate-700 rounded"></div>
                  <div className="flex items-center mt-2">
                    <div className="w-4 h-4 bg-slate-700 rounded mr-1"></div>
                    <div className="h-4 w-12 bg-slate-700 rounded"></div>
                  </div>
                </div>
                <div className="w-12 h-12 bg-slate-700 rounded-lg"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Deuxième ligne de statistiques skeleton */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="bg-slate-800 rounded-lg border border-slate-700 p-4 animate-pulse"
            >
              <div className="h-4 w-24 bg-slate-700 rounded mb-2"></div>
              <div className="h-6 w-16 bg-slate-700 rounded"></div>
            </div>
          ))}
        </div>

        {/* Graphiques principaux skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Graphique des revenus skeleton */}
          <div className="bg-slate-800 rounded-lg border border-slate-700 p-6 animate-pulse">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <div className="w-5 h-5 bg-slate-700 rounded mr-2"></div>
                <div className="h-6 w-48 bg-slate-700 rounded"></div>
              </div>
              <div className="h-4 w-24 bg-slate-700 rounded"></div>
            </div>

            <div className="space-y-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="flex items-center">
                  <div className="w-24 h-4 bg-slate-700 rounded mr-3"></div>
                  <div className="flex-1">
                    <div className="h-10 bg-slate-700 rounded-lg"></div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-4 border-t border-slate-700 flex items-center justify-end space-x-4">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-slate-700 rounded mr-1"></div>
                <div className="h-4 w-16 bg-slate-700 rounded"></div>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-slate-700 rounded mr-1"></div>
                <div className="h-4 w-16 bg-slate-700 rounded"></div>
              </div>
            </div>
          </div>

          {/* Graphique circulaire skeleton */}
          <div className="bg-slate-800 rounded-lg border border-slate-700 p-6 animate-pulse">
            <div className="flex items-center mb-4">
              <div className="w-5 h-5 bg-slate-700 rounded mr-2"></div>
              <div className="h-6 w-48 bg-slate-700 rounded"></div>
            </div>

            <div className="space-y-4">
              {[...Array(4)].map((_, i) => (
                <div key={i}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-slate-700 rounded-full mr-2"></div>
                      <div className="h-4 w-24 bg-slate-700 rounded"></div>
                    </div>
                    <div className="h-4 w-20 bg-slate-700 rounded"></div>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-2">
                    <div
                      className="h-2 bg-slate-600 rounded-full"
                      style={{ width: `${(i + 1) * 20}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4">
              <div className="h-4 w-24 bg-slate-700 rounded"></div>
            </div>
          </div>
        </div>

        {/* Deuxième ligne de graphiques skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {[...Array(2)].map((_, i) => (
            <div
              key={i}
              className="bg-slate-800 rounded-lg border border-slate-700 p-6 animate-pulse"
            >
              <div className="flex items-center mb-4">
                <div className="w-5 h-5 bg-slate-700 rounded mr-2"></div>
                <div className="h-6 w-48 bg-slate-700 rounded"></div>
              </div>

              <div className="space-y-4">
                {[...Array(4)].map((_, j) => (
                  <div key={j}>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-slate-700 rounded-full mr-2"></div>
                        <div className="h-4 w-24 bg-slate-700 rounded"></div>
                      </div>
                      <div className="h-4 w-20 bg-slate-700 rounded"></div>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-2">
                      <div
                        className="h-2 bg-slate-600 rounded-full"
                        style={{ width: `${(j + 1) * 15}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Top freelancers et performance skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Top freelancers skeleton */}
          <div className="bg-slate-800 rounded-lg border border-slate-700 p-6 animate-pulse">
            <div className="flex items-center mb-4">
              <div className="w-5 h-5 bg-slate-700 rounded mr-2"></div>
              <div className="h-6 w-40 bg-slate-700 rounded"></div>
            </div>

            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg"
                >
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-slate-600 rounded-full mr-3"></div>
                    <div className="w-10 h-10 bg-slate-600 rounded-full mr-3"></div>
                    <div>
                      <div className="h-4 w-32 bg-slate-600 rounded mb-2"></div>
                      <div className="h-3 w-24 bg-slate-600 rounded"></div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="h-4 w-20 bg-slate-600 rounded mb-2"></div>
                    <div className="h-3 w-16 bg-slate-600 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Performance metrics skeleton */}
          <div className="bg-slate-800 rounded-lg border border-slate-700 p-6 animate-pulse">
            <div className="flex items-center mb-4">
              <div className="w-5 h-5 bg-slate-700 rounded mr-2"></div>
              <div className="h-6 w-48 bg-slate-700 rounded"></div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="p-3 bg-slate-700/50 rounded-lg">
                  <div className="h-3 w-20 bg-slate-600 rounded mb-2"></div>
                  <div className="flex items-end justify-between mb-2">
                    <div className="h-6 w-12 bg-slate-600 rounded"></div>
                    <div className="h-3 w-16 bg-slate-600 rounded"></div>
                  </div>
                  <div className="w-full bg-slate-600 rounded-full h-2 mb-2">
                    <div
                      className="h-2 bg-slate-500 rounded-full"
                      style={{ width: `${(i + 1) * 20}%` }}
                    ></div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="h-3 w-16 bg-slate-600 rounded"></div>
                    <div className="h-3 w-12 bg-slate-600 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tableau d'activité skeleton */}
        <div className="bg-slate-800 rounded-lg border border-slate-700 p-6 animate-pulse">
          <div className="flex items-center mb-4">
            <div className="w-5 h-5 bg-slate-700 rounded mr-2"></div>
            <div className="h-6 w-40 bg-slate-700 rounded"></div>
          </div>

          <div className="overflow-x-auto">
            <div className="min-w-full">
              <div className="bg-slate-700/50 py-3 px-6 rounded-t-lg">
                <div className="grid grid-cols-4 gap-4">
                  {[...Array(4)].map((_, i) => (
                    <div
                      key={i}
                      className="h-4 w-20 bg-slate-600 rounded"
                    ></div>
                  ))}
                </div>
              </div>
              <div className="divide-y divide-slate-700">
                {[...Array(7)].map((_, i) => (
                  <div key={i} className="py-4 px-6">
                    <div className="grid grid-cols-4 gap-4">
                      {[...Array(4)].map((_, j) => (
                        <div
                          key={j}
                          className="h-4 w-24 bg-slate-700 rounded"
                        ></div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
