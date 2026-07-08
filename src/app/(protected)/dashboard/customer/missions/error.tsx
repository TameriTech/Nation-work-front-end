// app/dashboard/customer/services/error.tsx
"use client";

import { Icon } from "@iconify/react";

interface ServicesErrorProps {
  error: Error;
  reset: () => void;
}

// ✅ Utiliser export default
export default function ServicesError({ error, reset }: ServicesErrorProps) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-xl p-8 text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Icon icon="mdi:alert-circle" className="h-8 w-8 text-red-600" />
        </div>

        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Erreur de chargement
        </h2>

        <p className="text-gray-600 mb-6">
          {error.message || "Impossible de charger vos services"}
        </p>

        <button
          onClick={reset}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Réessayer
        </button>
      </div>
    </div>
  );
}
