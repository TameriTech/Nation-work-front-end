// app/dashboard/customer/services/[id]/edit/error.tsx
"use client";

import { Icon } from "@iconify/react";

interface ServiceErrorProps {
  error: string;
  onRetry: () => void;
}

export default function ServiceError({ error, onRetry }: ServiceErrorProps) {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">
        <Icon
          icon="mdi:alert-circle"
          className="text-5xl text-red-500 mx-auto mb-4"
        />
        <p className="text-gray-800 font-medium mb-2">Erreur de chargement</p>
        <p className="text-gray-600 mb-4">{error}</p>
        <button
          onClick={onRetry}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Retour
        </button>
      </div>
    </div>
  );
}
