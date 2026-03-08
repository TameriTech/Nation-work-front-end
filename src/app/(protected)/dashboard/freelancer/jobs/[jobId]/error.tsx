// app/(public)/jobs/[id]/error.tsx
"use client";

import {
  AlertCircle,
  RefreshCw,
  Home,
  ArrowLeft,
  Briefcase,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/app/components/ui/button";

interface JobDetailErrorProps {
  error: Error | null;
  serviceId: number;
  onRetry?: () => void;
}

export default function JobDetailError({
  error,
  serviceId,
  onRetry,
}: JobDetailErrorProps) {
  const router = useRouter();

  const getErrorMessage = () => {
    if (!error) return "Une erreur inconnue est survenue";

    if (error.message.includes("401")) {
      return "Vous devez être connecté pour voir ce service.";
    }
    if (error.message.includes("403")) {
      return "Vous n'avez pas les droits nécessaires pour accéder à ce service.";
    }
    if (error.message.includes("404")) {
      return `Le service avec l'ID ${serviceId} est introuvable.`;
    }
    if (error.message.includes("500")) {
      return "Une erreur serveur est survenue. Veuillez réessayer plus tard.";
    }

    return (
      error.message || "Une erreur est survenue lors du chargement du service"
    );
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <div className="bg-red-50 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
          <AlertCircle className="w-10 h-10 text-red-500" />
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-3">
          Oups ! Une erreur est survenue
        </h2>

        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-700 text-sm">{getErrorMessage()}</p>
        </div>

        <div className="space-y-3">
          {onRetry && (
            <Button
              onClick={onRetry}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Réessayer
            </Button>
          )}

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => router.back()}
              className="flex-1"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour
            </Button>

            <Button
              variant="outline"
              onClick={() => router.push("/jobs")}
              className="flex-1"
            >
              <Briefcase className="w-4 h-4 mr-2" />
              Offres
            </Button>
          </div>

          <Button
            variant="outline"
            onClick={() => router.push("/")}
            className="w-full"
          >
            <Home className="w-4 h-4 mr-2" />
            Accueil
          </Button>
        </div>

        <p className="text-xs text-gray-500 mt-6">
          Si le problème persiste, veuillez contacter le support technique
        </p>
      </div>
    </div>
  );
}
