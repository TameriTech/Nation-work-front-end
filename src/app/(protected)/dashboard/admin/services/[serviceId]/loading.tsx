// loading.tsx
"use client";

export default function ServiceDetailLoading() {
  return (
    <div className="min-h-screen dark:bg-slate-950">
      <div className="container mx-auto px-4 py-8">
        {/* Barre de navigation skeleton */}
        <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-slate-700 rounded animate-pulse mr-2"></div>
            <div className="h-4 w-32 bg-slate-700 rounded animate-pulse"></div>
          </div>
          <div className="flex flex-wrap gap-2">
            <div className="w-36 h-10 bg-slate-700 rounded-lg animate-pulse"></div>
            <div className="w-28 h-10 bg-slate-700 rounded-lg animate-pulse"></div>
            <div className="w-28 h-10 bg-slate-700 rounded-lg animate-pulse"></div>
            <div className="w-28 h-10 bg-slate-700 rounded-lg animate-pulse"></div>
          </div>
        </div>

        {/* En-tête skeleton */}
        <div className="bg-slate-800 rounded-lg border border-slate-700 p-6 mb-6 animate-pulse">
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-3 mb-2">
              <div className="h-8 w-64 bg-slate-700 rounded"></div>
              <div className="h-6 w-20 bg-slate-700 rounded-full"></div>
              <div className="h-6 w-24 bg-slate-700 rounded-full"></div>
            </div>
            <div className="h-4 w-full bg-slate-700 rounded mb-4"></div>
            <div className="h-4 w-3/4 bg-slate-700 rounded mb-4"></div>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-slate-700 rounded mr-2"></div>
                <div className="h-4 w-24 bg-slate-700 rounded"></div>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-slate-700 rounded mr-2"></div>
                <div className="h-4 w-20 bg-slate-700 rounded"></div>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-slate-700 rounded mr-2"></div>
                <div className="h-4 w-20 bg-slate-700 rounded"></div>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-slate-700 rounded mr-2"></div>
                <div className="h-4 w-24 bg-slate-700 rounded"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Grille principale skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Colonne de gauche - 2/3 */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description détaillée skeleton */}
            <div className="bg-slate-800 rounded-lg border border-slate-700 p-6 animate-pulse">
              <div className="flex items-center mb-4">
                <div className="w-5 h-5 bg-slate-700 rounded mr-2"></div>
                <div className="h-6 w-48 bg-slate-700 rounded"></div>
              </div>
              <div className="space-y-2">
                <div className="h-4 w-full bg-slate-700 rounded"></div>
                <div className="h-4 w-full bg-slate-700 rounded"></div>
                <div className="h-4 w-full bg-slate-700 rounded"></div>
                <div className="h-4 w-3/4 bg-slate-700 rounded"></div>
                <div className="h-4 w-5/6 bg-slate-700 rounded"></div>
              </div>
            </div>

            {/* Compétences requises skeleton */}
            <div className="bg-slate-800 rounded-lg border border-slate-700 p-6 animate-pulse">
              <div className="flex items-center mb-4">
                <div className="w-5 h-5 bg-slate-700 rounded mr-2"></div>
                <div className="h-6 w-48 bg-slate-700 rounded"></div>
              </div>
              <div className="flex flex-wrap gap-2">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="h-8 w-20 bg-slate-700 rounded-full"
                  ></div>
                ))}
              </div>
            </div>

            {/* Galerie d'images skeleton */}
            <div className="bg-slate-800 rounded-lg border border-slate-700 p-6 animate-pulse">
              <div className="flex items-center mb-4">
                <div className="w-5 h-5 bg-slate-700 rounded mr-2"></div>
                <div className="h-6 w-32 bg-slate-700 rounded"></div>
              </div>
              <div className="space-y-4">
                <div className="h-64 bg-slate-700 rounded-lg"></div>
                <div className="flex space-x-2">
                  {[...Array(4)].map((_, i) => (
                    <div
                      key={i}
                      className="w-16 h-16 bg-slate-700 rounded-lg"
                    ></div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Colonne de droite - 1/3 */}
          <div className="space-y-6">
            {/* Client skeleton */}
            <div className="bg-slate-800 rounded-lg border border-slate-700 p-6 animate-pulse">
              <div className="flex items-center mb-4">
                <div className="w-5 h-5 bg-slate-700 rounded mr-2"></div>
                <div className="h-6 w-24 bg-slate-700 rounded"></div>
              </div>
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-slate-700 rounded-full"></div>
                <div className="ml-4">
                  <div className="h-5 w-32 bg-slate-700 rounded mb-2"></div>
                  <div className="h-4 w-24 bg-slate-700 rounded"></div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-slate-700 rounded mr-3"></div>
                  <div className="flex-1">
                    <div className="h-3 w-16 bg-slate-700 rounded mb-1"></div>
                    <div className="h-4 w-40 bg-slate-700 rounded"></div>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-slate-700 rounded mr-3"></div>
                  <div className="flex-1">
                    <div className="h-3 w-20 bg-slate-700 rounded mb-1"></div>
                    <div className="h-4 w-32 bg-slate-700 rounded"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Freelancer skeleton */}
            <div className="bg-slate-800 rounded-lg border border-slate-700 p-6 animate-pulse">
              <div className="flex items-center mb-4">
                <div className="w-5 h-5 bg-slate-700 rounded mr-2"></div>
                <div className="h-6 w-28 bg-slate-700 rounded"></div>
              </div>
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-slate-700 rounded-full"></div>
                <div className="ml-4">
                  <div className="h-5 w-32 bg-slate-700 rounded mb-2"></div>
                  <div className="h-4 w-24 bg-slate-700 rounded"></div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-slate-700 rounded mr-3"></div>
                  <div className="flex-1">
                    <div className="h-3 w-16 bg-slate-700 rounded mb-1"></div>
                    <div className="h-4 w-40 bg-slate-700 rounded"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Détails pratiques skeleton */}
            <div className="bg-slate-800 rounded-lg border border-slate-700 p-6 animate-pulse">
              <div className="flex items-center mb-4">
                <div className="w-5 h-5 bg-slate-700 rounded mr-2"></div>
                <div className="h-6 w-36 bg-slate-700 rounded"></div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-slate-700 rounded mr-3"></div>
                  <div className="flex-1">
                    <div className="h-3 w-20 bg-slate-700 rounded mb-1"></div>
                    <div className="h-4 w-40 bg-slate-700 rounded"></div>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-slate-700 rounded mr-3"></div>
                  <div className="flex-1">
                    <div className="h-3 w-16 bg-slate-700 rounded mb-1"></div>
                    <div className="h-4 w-24 bg-slate-700 rounded"></div>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-slate-700 rounded mr-3"></div>
                  <div className="flex-1">
                    <div className="h-3 w-16 bg-slate-700 rounded mb-1"></div>
                    <div className="h-4 w-48 bg-slate-700 rounded"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Paiement skeleton */}
            <div className="bg-slate-800 rounded-lg border border-slate-700 p-6 animate-pulse">
              <div className="flex items-center mb-4">
                <div className="w-5 h-5 bg-slate-700 rounded mr-2"></div>
                <div className="h-6 w-28 bg-slate-700 rounded"></div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center">
                  <div className="flex-1">
                    <div className="h-3 w-20 bg-slate-700 rounded mb-1"></div>
                    <div className="h-5 w-24 bg-slate-700 rounded"></div>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-slate-700">
                  <div className="h-3 w-36 bg-slate-700 rounded mb-2"></div>
                  <div className="h-4 w-32 bg-slate-700 rounded"></div>
                </div>
              </div>
            </div>

            {/* Timeline skeleton */}
            <div className="bg-slate-800 rounded-lg border border-slate-700 p-6 animate-pulse">
              <div className="flex items-center mb-4">
                <div className="w-5 h-5 bg-slate-700 rounded mr-2"></div>
                <div className="h-6 w-28 bg-slate-700 rounded"></div>
              </div>
              <div className="space-y-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="flex items-start">
                    <div className="relative">
                      <div className="w-8 h-8 bg-slate-700 rounded-full"></div>
                      {i < 3 && (
                        <div className="absolute top-8 left-4 w-0.5 h-12 bg-slate-700"></div>
                      )}
                    </div>
                    <div className="ml-4 flex-1">
                      <div className="h-4 w-32 bg-slate-700 rounded mb-2"></div>
                      <div className="h-3 w-24 bg-slate-700 rounded"></div>
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
