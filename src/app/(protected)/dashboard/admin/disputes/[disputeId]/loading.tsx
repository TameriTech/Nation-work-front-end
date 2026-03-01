// loading.tsx
"use client";

export default function DisputeDetailLoading() {
  return (
    <div className="min-h-screen bg-slate-950">
      <div className="container mx-auto px-4 py-8">
        {/* Barre de navigation skeleton */}
        <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-slate-700 rounded animate-pulse mr-2"></div>
            <div className="h-4 w-32 bg-slate-700 rounded animate-pulse"></div>
          </div>
          <div className="flex flex-wrap gap-2">
            <div className="w-24 h-10 bg-slate-700 rounded-lg animate-pulse"></div>
            <div className="w-24 h-10 bg-slate-700 rounded-lg animate-pulse"></div>
            <div className="w-24 h-10 bg-slate-700 rounded-lg animate-pulse"></div>
          </div>
        </div>

        {/* En-tête skeleton */}
        <div className="bg-slate-800 rounded-lg border border-slate-700 p-6 mb-6 animate-pulse">
          <div className="flex flex-col lg:flex-row items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <div className="h-8 w-48 bg-slate-700 rounded"></div>
                <div className="h-6 w-20 bg-slate-700 rounded-full"></div>
                <div className="h-6 w-20 bg-slate-700 rounded-full"></div>
              </div>
              <div className="h-4 w-64 bg-slate-700 rounded mb-2"></div>
              <div className="h-5 w-96 bg-slate-700 rounded"></div>
            </div>
            <div className="text-right">
              <div className="h-4 w-24 bg-slate-700 rounded mb-2"></div>
              <div className="flex items-center">
                <div className="w-8 h-8 bg-slate-700 rounded-full mr-2"></div>
                <div className="h-5 w-32 bg-slate-700 rounded"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Grille d'informations skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Description du litige */}
          <div className="lg:col-span-2">
            <div className="bg-slate-800 rounded-lg border border-slate-700 p-6 animate-pulse">
              <div className="flex items-center mb-4">
                <div className="w-5 h-5 bg-slate-700 rounded mr-2"></div>
                <div className="h-6 w-32 bg-slate-700 rounded"></div>
              </div>
              <div className="space-y-2">
                <div className="h-4 w-full bg-slate-700 rounded"></div>
                <div className="h-4 w-full bg-slate-700 rounded"></div>
                <div className="h-4 w-3/4 bg-slate-700 rounded"></div>
              </div>
            </div>
          </div>

          {/* Informations sur le service */}
          <div className="bg-slate-800 rounded-lg border border-slate-700 p-6 animate-pulse">
            <div className="flex items-center mb-4">
              <div className="w-5 h-5 bg-slate-700 rounded mr-2"></div>
              <div className="h-6 w-40 bg-slate-700 rounded"></div>
            </div>
            <div className="space-y-3">
              <div>
                <div className="h-3 w-16 bg-slate-700 rounded mb-2"></div>
                <div className="h-5 w-48 bg-slate-700 rounded"></div>
              </div>
              <div>
                <div className="h-3 w-20 bg-slate-700 rounded mb-2"></div>
                <div className="h-5 w-24 bg-slate-700 rounded"></div>
              </div>
            </div>
          </div>

          {/* Client */}
          <div className="bg-slate-800 rounded-lg border border-slate-700 p-6 animate-pulse">
            <div className="flex items-center mb-4">
              <div className="w-5 h-5 bg-slate-700 rounded mr-2"></div>
              <div className="h-6 w-24 bg-slate-700 rounded"></div>
            </div>
            <div className="flex items-center">
              <div className="w-10 h-10 bg-slate-700 rounded-full mr-3"></div>
              <div>
                <div className="h-5 w-32 bg-slate-700 rounded mb-2"></div>
                <div className="h-4 w-24 bg-slate-700 rounded"></div>
              </div>
            </div>
          </div>

          {/* Freelancer */}
          <div className="bg-slate-800 rounded-lg border border-slate-700 p-6 animate-pulse">
            <div className="flex items-center mb-4">
              <div className="w-5 h-5 bg-slate-700 rounded mr-2"></div>
              <div className="h-6 w-24 bg-slate-700 rounded"></div>
            </div>
            <div className="flex items-center">
              <div className="w-10 h-10 bg-slate-700 rounded-full mr-3"></div>
              <div>
                <div className="h-5 w-32 bg-slate-700 rounded mb-2"></div>
                <div className="h-4 w-24 bg-slate-700 rounded"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Onglets skeleton */}
        <div className="bg-slate-800 rounded-lg border border-slate-700">
          {/* Navigation des onglets */}
          <div className="border-b border-slate-700 px-6">
            <div className="flex gap-2 py-4">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="h-10 w-24 bg-slate-700 rounded animate-pulse"
                ></div>
              ))}
            </div>
          </div>

          {/* Contenu de l'onglet messages skeleton */}
          <div className="p-6">
            {/* Liste des messages */}
            <div className="space-y-4 mb-6 max-h-96 overflow-y-auto pr-2">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className={`flex ${i % 2 === 0 ? "justify-start" : "justify-end"} mb-4`}
                >
                  <div
                    className={`max-w-[70%] rounded-lg p-3 ${
                      i % 2 === 0 ? "bg-slate-700" : "bg-slate-600"
                    }`}
                  >
                    {i % 2 === 0 && (
                      <div className="flex items-center mb-2">
                        <div className="h-4 w-20 bg-slate-600 rounded mr-2"></div>
                        <div className="h-4 w-12 bg-slate-600 rounded"></div>
                      </div>
                    )}
                    <div className="space-y-2">
                      <div className="h-3 w-48 bg-slate-600 rounded"></div>
                      <div className="h-3 w-32 bg-slate-600 rounded"></div>
                    </div>
                    <div className="h-2 w-16 bg-slate-600 rounded mt-2"></div>
                  </div>
                </div>
              ))}
            </div>

            {/* Formulaire d'envoi skeleton */}
            <div className="border-t border-slate-700 pt-4">
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-4 h-4 bg-slate-700 rounded"></div>
                <div className="h-4 w-40 bg-slate-700 rounded"></div>
              </div>
              <div className="flex space-x-2">
                <div className="flex-1 h-10 bg-slate-700 rounded-lg"></div>
                <div className="w-24 h-10 bg-slate-700 rounded-lg"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
