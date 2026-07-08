// app/dashboard/customer/services/[id]/error.tsx
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

interface ServiceDetailErrorProps {
  error: Error | null;
  serviceId: number;
  onRetry?: () => void;
}

export default function ServiceDetailError({
  error,
  serviceId,
  onRetry,
}: ServiceDetailErrorProps) {
  const router = useRouter();

  const getErrorMessage = () => {
    if (!error) return "Une erreur inconnue est survenue";

    if (
      error.message.includes("401") ||
      error.message.includes("non authentifié")
    ) {
      return "Vous n'êtes pas authentifié. Veuillez vous connecter.";
    }
    if (
      error.message.includes("403") ||
      error.message.includes("non autorisé")
    ) {
      return "Vous n'avez pas les droits nécessaires pour accéder à ce service.";
    }
    if (
      error.message.includes("404") ||
      error.message.includes("introuvable")
    ) {
      return `Le service avec l'ID ${serviceId} est introuvable.`;
    }
    if (error.message.includes("500") || error.message.includes("serveur")) {
      return "Une erreur serveur est survenue. Veuillez réessayer plus tard.";
    }

    return (
      error.message || "Une erreur est survenue lors du chargement du service"
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* En-tête avec icône d'erreur */}
          <div className="bg-red-500 p-6 text-center">
            <div className="inline-flex p-3 bg-white rounded-full">
              <AlertCircle className="w-12 h-12 text-red-500" />
            </div>
          </div>

          {/* Corps du message */}
          <div className="p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-3">
              Service non trouvé
            </h2>

            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-red-700 text-sm">{getErrorMessage()}</p>
            </div>

            {/* Actions */}
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
                  onClick={() => router.push("/dashboard/customer/services")}
                  className="flex-1"
                >
                  <Briefcase className="w-4 h-4 mr-2" />
                  Liste
                </Button>
              </div>

              <Button
                variant="outline"
                onClick={() => router.push("/dashboard/customer")}
                className="w-full"
              >
                <Home className="w-4 h-4 mr-2" />
                Dashboard
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
