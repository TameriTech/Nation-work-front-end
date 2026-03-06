// loading.tsx
"use client";

export default function UserDetailLoading() {
  return (
    <div className="min-h-screen dark:bg-slate-950">
      <div className="container mx-auto">
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
          </div>
        </div>

        {/* En-tête du profil skeleton */}
        <div className="bg-slate-800 rounded-lg border border-slate-700 p-6 mb-6 animate-pulse">
          <div className="flex flex-col md:flex-row items-start gap-6">
            <div className="flex-shrink-0">
              <div className="w-24 h-24 rounded-full bg-slate-700 border-4 border-slate-700"></div>
            </div>
            <div className="flex-1">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                  <div className="h-8 w-48 bg-slate-700 rounded mb-2"></div>
                  <div className="h-5 w-64 bg-slate-700 rounded"></div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <div className="h-8 w-24 bg-slate-700 rounded-full"></div>
                  <div className="h-8 w-28 bg-slate-700 rounded-full"></div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex items-center">
                    <div className="w-4 h-4 bg-slate-700 rounded mr-2"></div>
                    <div className="h-4 w-32 bg-slate-700 rounded"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Statistiques rapides skeleton */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="bg-slate-800 rounded-lg border border-slate-700 p-4 animate-pulse"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="h-3 w-16 bg-slate-700 rounded mb-2"></div>
                  <div className="h-6 w-12 bg-slate-700 rounded"></div>
                </div>
                <div className="w-8 h-8 bg-slate-700 rounded"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Onglets skeleton */}
        <div className="border-b border-slate-700 mb-6">
          <nav className="flex flex-wrap gap-2 sm:gap-0">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="px-4 py-2">
                <div className="h-5 w-24 bg-slate-700 rounded"></div>
              </div>
            ))}
          </nav>
        </div>

        {/* Contenu des onglets - Version "info" par défaut */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Informations personnelles skeleton */}
          <div className="bg-slate-800 rounded-lg border border-slate-700 p-6 animate-pulse">
            <div className="flex items-center mb-4">
              <div className="w-5 h-5 bg-slate-700 rounded mr-2"></div>
              <div className="h-6 w-48 bg-slate-700 rounded"></div>
            </div>
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center">
                  <div className="w-4 h-4 bg-slate-700 rounded mr-3"></div>
                  <div className="flex-1 h-4 bg-slate-700 rounded"></div>
                </div>
              ))}
            </div>
          </div>

          {/* Profil professionnel skeleton */}
          <div className="bg-slate-800 rounded-lg border border-slate-700 p-6 animate-pulse">
            <div className="flex items-center mb-4">
              <div className="w-5 h-5 bg-slate-700 rounded mr-2"></div>
              <div className="h-6 w-48 bg-slate-700 rounded"></div>
            </div>
            <div className="space-y-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="h-4 w-24 bg-slate-700 rounded"></div>
                  <div className="h-4 w-20 bg-slate-700 rounded"></div>
                </div>
              ))}
            </div>
          </div>

          {/* Badges et vérifications skeleton */}
          <div className="bg-slate-800 rounded-lg border border-slate-700 p-6 animate-pulse">
            <div className="flex items-center mb-4">
              <div className="w-5 h-5 bg-slate-700 rounded mr-2"></div>
              <div className="h-6 w-48 bg-slate-700 rounded"></div>
            </div>
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="h-4 w-32 bg-slate-700 rounded"></div>
                  <div className="h-4 w-20 bg-slate-700 rounded"></div>
                </div>
              ))}
            </div>
          </div>

          {/* Réseaux sociaux skeleton */}
          <div className="bg-slate-800 rounded-lg border border-slate-700 p-6 animate-pulse">
            <div className="flex items-center mb-4">
              <div className="w-5 h-5 bg-slate-700 rounded mr-2"></div>
              <div className="h-6 w-32 bg-slate-700 rounded"></div>
            </div>
            <div className="space-y-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex items-center">
                  <div className="w-4 h-4 bg-slate-700 rounded mr-3"></div>
                  <div className="h-4 w-32 bg-slate-700 rounded"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
