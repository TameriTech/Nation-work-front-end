// app/(protected)/dashboard/admin/services/[serviceId]/error.tsx
"use client";

import {
  AlertCircle,
  RefreshCw,
  Home,
  ArrowLeft,
  Briefcase,
} from "lucide-react";
import { useRouter } from "next/navigation";

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
      return "Vous n'avez pas les droits nécessaires pour accéder à cette page.";
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
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl overflow-hidden border border-gray-200 dark:border-slate-700">
          {/* En-tête avec icône d'erreur */}
          <div className="bg-red-500 dark:bg-red-600 p-6 text-center">
            <div className="inline-flex p-3 bg-white dark:bg-slate-800 rounded-full">
              <Briefcase className="w-12 h-12 text-red-500 dark:text-red-400" />
            </div>
          </div>

          {/* Corps du message */}
          <div className="p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-3">
              Service non trouvé
            </h2>

            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
              <p className="text-red-700 dark:text-red-400 text-sm">
                {getErrorMessage()}
              </p>
            </div>

            {/* Détails techniques */}
            {process.env.NODE_ENV === "development" && error && (
              <div className="mb-6 p-4 bg-gray-50 dark:bg-slate-900/50 rounded-lg text-left">
                <p className="text-xs font-mono text-gray-600 dark:text-gray-400 mb-2">
                  Détails techniques :
                </p>
                <pre className="text-xs text-gray-500 dark:text-gray-500 overflow-auto max-h-32">
                  {error.stack || error.message}
                </pre>
              </div>
            )}

            {/* Actions */}
            <div className="space-y-3">
              {onRetry && (
                <button
                  onClick={onRetry}
                  className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium flex items-center justify-center transition-all transform hover:scale-105"
                >
                  <RefreshCw className="w-5 h-5 mr-2" />
                  Réessayer
                </button>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => router.back()}
                  className="flex-1 px-4 py-3 border border-gray-300 dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-300 rounded-xl font-medium flex items-center justify-center transition-all"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Retour
                </button>

                <button
                  onClick={() => router.push("/dashboard/admin/services")}
                  className="flex-1 px-4 py-3 border border-gray-300 dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-300 rounded-xl font-medium flex items-center justify-center transition-all"
                >
                  <Briefcase className="w-4 h-4 mr-2" />
                  Liste
                </button>
              </div>

              <button
                onClick={() => router.push("/dashboard/admin")}
                className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-300 rounded-xl font-medium flex items-center justify-center transition-all"
              >
                <Home className="w-4 h-4 mr-2" />
                Dashboard
              </button>
            </div>
          </div>

          {/* Pied de page */}
          <div className="bg-gray-50 dark:bg-slate-900/50 px-6 py-4 border-t border-gray-200 dark:border-slate-700">
            <p className="text-xs text-center text-gray-500 dark:text-gray-400">
              Si le problème persiste, veuillez contacter le support technique
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
