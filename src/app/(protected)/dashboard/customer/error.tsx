// app/dashboard/customer/error.tsx
"use client";

import { Button } from "@/app/components/ui/button";
import { Icon } from "@iconify/react";

interface DashboardErrorProps {
  error: Error;
  onRetry: () => void;
}

export function DashboardError({ error, onRetry }: DashboardErrorProps) {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Icon
            icon="bi:exclamation-triangle"
            className="w-10 h-10 text-red-600"
          />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-3">
          Oups ! Une erreur est survenue
        </h2>
        <p className="text-gray-600 mb-6">
          {error.message || "Impossible de charger le tableau de bord"}
        </p>
        <Button
          onClick={onRetry}
          className="bg-blue-900 hover:bg-blue-800 text-white"
        >
          <Icon icon="bi:arrow-repeat" className="w-4 h-4 mr-2" />
          Réessayer
        </Button>
      </div>
    </div>
  );
}
