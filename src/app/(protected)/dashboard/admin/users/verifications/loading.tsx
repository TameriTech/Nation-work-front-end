// loading.tsx
"use client";

export default function VerificationsLoading() {
  return (
    <div className="min-h-screen dark:bg-slate-950">
      <div className="container mx-auto">
        {/* En-tête skeleton */}
        <div className="mb-6">
          <div className="flex items-center">
            <div className="w-6 h-6 bg-slate-700 rounded-lg animate-pulse mr-2"></div>
            <div className="h-8 w-64 bg-slate-700 rounded-lg animate-pulse"></div>
          </div>
          <div className="h-4 w-96 bg-slate-700 rounded-lg animate-pulse mt-2"></div>
        </div>

        {/* Cartes de statistiques skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="bg-slate-800 rounded-lg border border-slate-700 p-6 animate-pulse"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="h-4 w-20 bg-slate-700 rounded mb-2"></div>
                  <div className="h-8 w-12 bg-slate-700 rounded"></div>
                </div>
                <div className="w-12 h-12 bg-slate-700 rounded-lg"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Actions skeleton */}
        <div className="bg-slate-800 rounded-lg border border-slate-700 p-4 mb-6 flex justify-between items-center animate-pulse">
          <div className="w-32 h-10 bg-slate-700 rounded-lg"></div>
          <div className="h-4 w-32 bg-slate-700 rounded"></div>
        </div>

        {/* Grille des vérifications skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <div
              key={index}
              className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden animate-pulse"
            >
              <div className="p-6">
                {/* En-tête avec icône et nom */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-slate-700 rounded-lg"></div>
                    <div className="ml-4">
                      <div className="h-5 w-32 bg-slate-700 rounded mb-2"></div>
                      <div className="h-4 w-40 bg-slate-700 rounded"></div>
                    </div>
                  </div>
                  <div className="h-6 w-20 bg-slate-700 rounded-full"></div>
                </div>

                {/* Détails du document */}
                <div className="space-y-3 mb-4">
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-slate-700 rounded mr-2"></div>
                    <div className="h-4 w-24 bg-slate-700 rounded"></div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-slate-700 rounded mr-2"></div>
                    <div className="h-4 w-32 bg-slate-700 rounded"></div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-slate-700 rounded mr-2"></div>
                    <div className="h-4 w-28 bg-slate-700 rounded"></div>
                  </div>
                </div>

                {/* Boutons de visualisation */}
                <div className="flex space-x-2 mb-4">
                  <div className="flex-1 h-10 bg-slate-700 rounded-lg"></div>
                  <div className="flex-1 h-10 bg-slate-700 rounded-lg"></div>
                </div>

                {/* Bouton d'actions */}
                <div className="h-10 bg-slate-700 rounded-lg"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
