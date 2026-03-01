// loading.tsx
"use client";

export default function CategoriesLoading() {
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

        {/* Actions rapides skeleton */}
        <div className="bg-slate-800 rounded-lg border border-slate-700 p-4 mb-6 flex flex-col sm:flex-row justify-between items-center gap-4 animate-pulse">
          <div className="flex flex-wrap gap-2">
            <div className="w-32 h-10 bg-slate-700 rounded-lg"></div>
            <div className="w-40 h-10 bg-slate-700 rounded-lg"></div>
          </div>
          <div className="relative w-full sm:w-64">
            <div className="w-full h-10 bg-slate-700 rounded-lg"></div>
          </div>
        </div>

        {/* Grille des catégories skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <div
              key={index}
              className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden animate-pulse"
            >
              {/* Barre de couleur supérieure */}
              <div className="h-2 bg-slate-700"></div>

              <div className="p-6">
                {/* En-tête avec icône et titre */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-slate-700 rounded-lg"></div>
                    <div className="ml-4">
                      <div className="h-5 w-32 bg-slate-700 rounded mb-2"></div>
                      <div className="h-3 w-20 bg-slate-700 rounded"></div>
                    </div>
                  </div>
                  <div className="h-6 w-16 bg-slate-700 rounded-full"></div>
                </div>

                {/* Description */}
                <div className="space-y-2 mb-4">
                  <div className="h-3 w-full bg-slate-700 rounded"></div>
                  <div className="h-3 w-3/4 bg-slate-700 rounded"></div>
                </div>

                {/* Statistiques en grille 3 colonnes */}
                <div className="grid grid-cols-3 gap-2 mb-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="p-2 bg-slate-700/50 rounded">
                      <div className="w-4 h-4 bg-slate-600 rounded-full mx-auto mb-1"></div>
                      <div className="h-2 w-12 bg-slate-600 rounded mx-auto mb-1"></div>
                      <div className="h-3 w-8 bg-slate-600 rounded mx-auto"></div>
                    </div>
                  ))}
                </div>

                {/* Actions */}
                <div className="flex justify-end space-x-2 pt-4 border-t border-slate-700">
                  <div className="w-8 h-8 bg-slate-700 rounded"></div>
                  <div className="w-8 h-8 bg-slate-700 rounded"></div>
                  <div className="w-8 h-8 bg-slate-700 rounded"></div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination skeleton */}
        <div className="bg-slate-800 rounded-lg border border-slate-700 p-4 mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 animate-pulse">
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
