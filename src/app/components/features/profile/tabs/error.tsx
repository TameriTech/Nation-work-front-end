// app/dashboard/freelancer/profile/error.tsx
"use client";

import { Icon } from "@iconify/react";
import { Button } from "@/app/components/ui/button";

interface ExperienceErrorProps {
  error: Error | null;
  onRetry: () => void;
}

export default function ExperienceError({
  error,
  onRetry,
}: ExperienceErrorProps) {
  return (
    <div className="rounded-3xl bg-white shadow-lg p-12 text-center">
      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <Icon icon="mdi:alert-circle" className="h-8 w-8 text-red-600" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        Erreur de chargement
      </h3>
      <p className="text-gray-600 mb-6 max-w-md mx-auto">
        {error?.message ||
          "Impossible de charger vos expériences et formations"}
      </p>
      <Button onClick={onRetry} variant="outline">
        <Icon icon="mdi:refresh" className="w-4 h-4 mr-2" />
        Réessayer
      </Button>
    </div>
  );
}

// components/features/profile/tabs/error.tsx

interface DocumentsErrorProps {
  error: Error | null;
  onRetry: () => void;
}

export function DocumentsError({ error, onRetry }: DocumentsErrorProps) {
  return (
    <div className="bg-white rounded-3xl p-12 text-center">
      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <Icon icon="mdi:alert-circle" className="h-8 w-8 text-red-600" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        Erreur de chargement
      </h3>
      <p className="text-gray-600 mb-6 max-w-md mx-auto">
        {error?.message || "Impossible de charger vos documents"}
      </p>
      <Button onClick={onRetry} variant="outline" className="gap-2">
        <Icon icon="mdi:refresh" className="h-4 w-4" />
        Réessayer
      </Button>
    </div>
  );
}

// components/features/profile/tabs/error.tsx
interface ReviewsErrorProps {
  error: Error | null;
  onRetry: () => void;
}

export function ReviewsError({ error, onRetry }: ReviewsErrorProps) {
  return (
    <div className="bg-white rounded-3xl p-12 text-center border border-gray-100">
      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <Icon icon="bx:error" className="h-8 w-8 text-red-600" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        Erreur de chargement
      </h3>
      <p className="text-gray-600 mb-6 max-w-md mx-auto">
        {error?.message || "Impossible de charger les évaluations"}
      </p>
      <Button onClick={onRetry} variant="outline" className="gap-2">
        <Icon icon="bx:refresh" className="h-4 w-4" />
        Réessayer
      </Button>
    </div>
  );
}
