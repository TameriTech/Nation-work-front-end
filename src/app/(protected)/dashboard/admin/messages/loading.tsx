// loading.tsx
"use client";

export default function ConversationsLoading() {
  return (
    <div className="min-h-screen dark:bg-slate-950">
      <div className="container mx-auto">
        {/* En-tête skeleton */}
        <div className="mb-6">
          <div className="flex items-center">
            <div className="w-6 h-6 bg-slate-700 rounded-lg animate-pulse mr-2"></div>
            <div className="h-8 w-72 bg-slate-700 rounded-lg animate-pulse"></div>
          </div>
          <div className="h-4 w-96 bg-slate-700 rounded-lg animate-pulse mt-2"></div>
        </div>

        {/* Cartes de statistiques skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="bg-slate-800 rounded-lg border border-slate-700 p-6 animate-pulse"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="h-4 w-24 bg-slate-700 rounded mb-2"></div>
                  <div className="h-8 w-16 bg-slate-700 rounded"></div>
                  <div className="h-3 w-32 bg-slate-700 rounded mt-2"></div>
                </div>
                <div className="w-12 h-12 bg-slate-700 rounded-lg"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Actions rapides skeleton */}
        <div className="bg-slate-800 rounded-lg border border-slate-700 p-4 mb-6 flex flex-col sm:flex-row justify-between items-center gap-4 animate-pulse">
          <div className="flex flex-wrap gap-2">
            <div className="w-32 h-10 bg-slate-700 rounded-lg"></div>
          </div>
          <div className="flex flex-wrap gap-4">
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

            {/* Filtre participant */}
            <div>
              <div className="h-4 w-20 bg-slate-700 rounded mb-2"></div>
              <div className="h-10 bg-slate-700 rounded-lg"></div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
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
          </div>

          <div className="flex justify-end mt-4 space-x-2">
            <div className="w-32 h-10 bg-slate-700 rounded-lg"></div>
            <div className="w-32 h-10 bg-slate-700 rounded-lg"></div>
          </div>
        </div>

        {/* Grille des conversations skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <div
              key={index}
              className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden animate-pulse"
            >
              <div className="p-6">
                {/* En-tête avec service */}
                <div className="mb-4">
                  <div className="h-6 w-48 bg-slate-700 rounded mb-2"></div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-slate-700 rounded mr-1"></div>
                    <div className="h-4 w-20 bg-slate-700 rounded"></div>
                  </div>
                </div>

                {/* Participants */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  {/* Client */}
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-slate-700 rounded-full mr-3"></div>
                    <div>
                      <div className="h-4 w-20 bg-slate-700 rounded mb-2"></div>
                      <div className="h-3 w-12 bg-slate-700 rounded"></div>
                    </div>
                  </div>

                  {/* Freelancer */}
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-slate-700 rounded-full mr-3"></div>
                    <div>
                      <div className="h-4 w-20 bg-slate-700 rounded mb-2"></div>
                      <div className="h-3 w-12 bg-slate-700 rounded"></div>
                    </div>
                  </div>
                </div>

                {/* Dernier message */}
                <div className="bg-slate-700/50 rounded-lg p-3 mb-4">
                  <div className="flex items-start">
                    <div className="w-4 h-4 bg-slate-600 rounded mr-2 mt-0.5"></div>
                    <div className="flex-1">
                      <div className="space-y-2">
                        <div className="h-3 w-full bg-slate-600 rounded"></div>
                        <div className="h-3 w-3/4 bg-slate-600 rounded"></div>
                      </div>
                      <div className="flex items-center mt-2">
                        <div className="h-3 w-16 bg-slate-600 rounded mr-2"></div>
                        <div className="h-3 w-12 bg-slate-600 rounded"></div>
                        <div className="ml-2 h-4 w-14 bg-slate-600 rounded-full"></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Métadonnées */}
                <div className="flex flex-wrap items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <div className="w-4 h-4 bg-slate-700 rounded mr-1"></div>
                      <div className="h-4 w-16 bg-slate-700 rounded"></div>
                    </div>
                    <div className="flex items-center">
                      <div className="w-4 h-4 bg-slate-700 rounded mr-1"></div>
                      <div className="h-4 w-20 bg-slate-700 rounded"></div>
                    </div>
                  </div>
                  <div className="h-6 w-16 bg-slate-700 rounded-full"></div>
                </div>

                {/* Actions */}
                <div className="flex justify-end space-x-2 mt-4 pt-4 border-t border-slate-700">
                  <div className="w-8 h-8 bg-slate-700 rounded-lg"></div>
                  <div className="w-8 h-8 bg-slate-700 rounded-lg"></div>
                  <div className="w-8 h-8 bg-slate-700 rounded-lg"></div>
                </div>
              </div>
            </div>
          ))}
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
