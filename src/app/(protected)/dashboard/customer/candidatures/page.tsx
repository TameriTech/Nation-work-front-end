// app/dashboard/customer/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@iconify/react";
import { cn } from "@/app/lib/utils";
import { useTheme } from "next-themes";
import { useCandidatures } from "@/app/hooks/applications/use-candidatures";
import { useAuth } from "@/app/hooks/auth/use-auth";
import DashboardSkeleton from "./loading";
import DashboardError from "./error";
import { formatDate } from "@/app/lib/utils";
import { Candidature, CandidatureStatus } from "@/app/types";

// Configuration des statuts
const statusConfig = {
  draft: {
    label: "Brouillon",
    className: "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-400",
    icon: "ph:file-text",
  },
  published: {
    label: "Publié",
    className: "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400",
    icon: "ph:eye",
  },
  closed: {
    label: "Fermé",
    className: "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400",
    icon: "ph:check-circle",
  },
  canceled: {
    label: "Annulé",
    className: "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400",
    icon: "ph:x-circle",
  },
  pending: {
    label: "En attente",
    className: "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400",
    icon: "ph:clock",
  },
  accepted: {
    label: "Accepté",
    className: "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400",
    icon: "ph:check-circle",
  },
  rejected: {
    label: "Rejeté",
    className: "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400",
    icon: "ph:x-circle",
  },
} as const;

// Composant StatCard
const StatCard = ({ title, value, subtitle, icon, color }: { 
  title: string; 
  value: string | number; 
  subtitle: string; 
  icon: string; 
  color: string;
}) => (
  <div className="bg-surface dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all group">
    <div className="flex justify-between items-start">
      <div>
        <p className="text-sm text-text-secondary dark:text-gray-400">{title}</p>
        <p className="text-3xl font-bold text-text-primary dark:text-gray-100 mt-2">{value}</p>
        <p className="text-xs text-text-secondary dark:text-gray-400 mt-1">{subtitle}</p>
      </div>
      <div className={`w-12 h-12 bg-gradient-to-br ${color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
        <Icon icon={icon} className="w-6 h-6 text-white" />
      </div>
    </div>
  </div>
);

// Modal de détails de candidature
function CandidatureDetailModal({ candidature, isOpen, onClose }: { 
  candidature: Candidature | null; 
  isOpen: boolean; 
  onClose: () => void;
}) {
  const router = useRouter();
  
  if (!isOpen || !candidature) return null;

  const handleContact = () => {
    const username = candidature.provider?.username;
    const serviceCode = candidature.service?.code;
    if (username && serviceCode) {
      router.push(`/dashboard/customer/messaging?username=${encodeURIComponent(username)}&service_code=${encodeURIComponent(serviceCode)}`);
    } else {
      router.push(`/dashboard/customer/messaging?user=${candidature.provider_id}`);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-surface dark:bg-gray-800 rounded-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto shadow-xl" onClick={(e) => e.stopPropagation()}>
        {/* En-tête */}
        <div className="bg-gradient-to-r from-primary to-secondary px-6 py-5 rounded-t-2xl sticky top-0">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center text-white text-xl font-bold">
                {candidature.provider?.username?.charAt(0).toUpperCase() || "F"}
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">
                  {candidature.provider?.username || "Freelance"}
                </h2>
                <p className="text-primary-100 text-sm">
                  Candidature pour: {candidature.service?.title}
                </p>
              </div>
            </div>
            <button onClick={onClose} className="p-1 rounded-full bg-white/20 hover:bg-white/30 transition-all">
              <Icon icon="ph:x" className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Statistiques du freelance */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-3 text-center">
              <Icon icon="ph:star" className="w-5 h-5 text-yellow-400 mx-auto mb-1" />
              <p className="text-2xl font-bold text-text-primary dark:text-gray-100">
                {candidature.provider?.average_rating?.toFixed(1) || "Nouveau"}
              </p>
              <p className="text-xs text-text-secondary">Note moyenne</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-3 text-center">
              <Icon icon="ph:briefcase" className="w-5 h-5 text-primary mx-auto mb-1" />
              <p className="text-2xl font-bold text-text-primary dark:text-gray-100">
                {candidature.provider?.completed_services || 0}
              </p>
              <p className="text-xs text-text-secondary">Missions terminées</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-3 text-center">
              <Icon icon="ph:clock" className="w-5 h-5 text-orange-500 mx-auto mb-1" />
              <p className="text-2xl font-bold text-text-primary dark:text-gray-100">
                {candidature.provider?.response_time || "24h"}
              </p>
              <p className="text-xs text-text-secondary">Temps de réponse</p>
            </div>
          </div>

          {/* Détails de la candidature */}
          <div className="space-y-4 mb-6">
            <div className="border-b border-gray-100 dark:border-gray-700 pb-3">
              <h3 className="font-semibold text-text-primary dark:text-gray-100 flex items-center gap-2 mb-2">
                <Icon icon="ph:currency-circle-dollar" className="w-4 h-4 text-primary" />
                Proposition financière
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-text-secondary">Montant proposé</p>
                  <p className="text-xl font-bold text-primary">
                    {candidature.proposed_price?.toLocaleString()} CFA
                  </p>
                </div>
                <div>
                  <p className="text-sm text-text-secondary">Durée estimée</p>
                  <p className="text-xl font-semibold text-text-primary dark:text-gray-100">
                    {candidature.estimated_duration || "Non spécifiée"}
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-text-primary dark:text-gray-100 flex items-center gap-2 mb-2">
                <Icon icon="ph:envelope" className="w-4 h-4 text-primary" />
                Lettre de motivation
              </h3>
              <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-4">
                <p className="text-text-secondary dark:text-gray-400 whitespace-pre-wrap">
                  {candidature.cover_letter || candidature.message || "Aucune lettre de motivation fournie."}
                </p>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-text-primary dark:text-gray-100 flex items-center gap-2 mb-2">
                <Icon icon="ph:calendar" className="w-4 h-4 text-primary" />
                Informations
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-text-secondary">Date de candidature</p>
                  <p className="text-text-primary dark:text-gray-100">
                    {formatDate(candidature.application_date)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-text-secondary">Statut</p>
                  <span className={cn("inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full", 
                    statusConfig[candidature.status as keyof typeof statusConfig]?.className
                  )}>
                    <Icon icon={statusConfig[candidature.status as keyof typeof statusConfig]?.icon || "ph:circle"} className="w-3 h-3" />
                    {statusConfig[candidature.status as keyof typeof statusConfig]?.label || candidature.status}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-gray-100 dark:border-gray-700">
            <button
              onClick={handleContact}
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-medium hover:shadow-lg transition-all"
            >
              <Icon icon="ph:chat" className="w-4 h-4" />
              Contacter le freelance
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 text-text-secondary hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
            >
              Fermer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Modal de rejet
function RejectModal({ isOpen, onClose, onConfirm, isLoading }: { 
  isOpen: boolean; 
  onClose: () => void; 
  onConfirm: (reason: string) => void; 
  isLoading: boolean;
}) {
  const [rejectReason, setRejectReason] = useState("");
  const [customReason, setCustomReason] = useState("");

  const predefinedReasons = [
    "Profil ne correspond pas aux attentes",
    "Expérience insuffisante",
    "Tarif trop élevé",
    "Délais non compatibles",
    "Autre raison",
  ];

  const handleSubmit = () => {
    if (!rejectReason) return;
    const finalReason = rejectReason === "Autre raison" ? customReason : rejectReason;
    onConfirm(finalReason);
    setRejectReason("");
    setCustomReason("");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-surface dark:bg-gray-800 rounded-2xl p-6 max-w-md w-full mx-4 shadow-xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
            <Icon icon="ph:x-circle" className="w-5 h-5 text-red-600 dark:text-red-400" />
          </div>
          <h3 className="text-xl font-semibold text-text-primary dark:text-gray-100">
            Rejeter la candidature
          </h3>
        </div>
        <p className="text-text-secondary dark:text-gray-400 mb-4">
          Veuillez indiquer la raison du rejet
        </p>

        <div className="space-y-3">
          {predefinedReasons.map((reason) => (
            <label key={reason} className="flex items-center gap-3 p-2 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg cursor-pointer transition-colors">
              <input
                type="radio"
                name="rejectionReason"
                value={reason}
                checked={rejectReason === reason}
                onChange={(e) => setRejectReason(e.target.value)}
                className="w-4 h-4 text-primary"
              />
              <span className="text-sm text-text-primary dark:text-gray-100">{reason}</span>
            </label>
          ))}
        </div>

        {rejectReason === "Autre raison" && (
          <textarea
            value={customReason}
            onChange={(e) => setCustomReason(e.target.value)}
            placeholder="Précisez la raison..."
            className="w-full mt-4 p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-text-primary dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
            rows={3}
          />
        )}

        <div className="flex gap-3 justify-end mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 text-text-secondary hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
          >
            Annuler
          </button>
          <button
            onClick={handleSubmit}
            disabled={!rejectReason || (rejectReason === "Autre raison" && !customReason) || isLoading}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-red-500 to-red-600 text-white font-medium hover:shadow-lg transition-all disabled:opacity-50"
          >
            {isLoading ? "Traitement..." : "Confirmer le rejet"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function CustomerDashboardPage() {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const { user } = useAuth();
  const [selectedCandidature, setSelectedCandidature] = useState<Candidature | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState<number | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const {
    candidatures,
    pagination,
    isLoading,
    error,
    refetch,
    updateStatus,
    acceptCandidature,
    rejectCandidature,
  } = useCandidatures({
    clientMode: true,
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleViewDetails = (candidature: Candidature) => {
    setSelectedCandidature(candidature);
    setShowDetailModal(true);
  };

  const handleAccept = async (id: number) => {
    setIsProcessing(true);
    try {
      await acceptCandidature({
        id,
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async (id: number, reason: string) => {
    setIsProcessing(true);
    try {
      await rejectCandidature({
        id,
        //reason: reason,
      });
      setShowRejectModal(null);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleContact = (candidature: Candidature) => {
    const username = candidature.provider?.username;
    const serviceCode = candidature.service?.code;
    if (username && serviceCode) {
      router.push(`/dashboard/customer/messaging?username=${encodeURIComponent(username)}&service_code=${encodeURIComponent(serviceCode)}`);
    } else {
      router.push(`/dashboard/customer/messaging?user=${candidature.provider_id}`);
    }
  };

  if (isLoading) return <DashboardSkeleton />;
  if (error) return <DashboardError error={error} onRetry={refetch} />;

  const total = candidatures.length;
  const pendingCount = candidatures.filter(c => c.status === 'pending').length;
  const acceptedCount = candidatures.filter(c => c.status === 'accepted').length;
  const acceptanceRate = total > 0 ? Math.round((acceptedCount / total) * 100) : 0;

  return (
    <main className="bg-background dark:bg-gray-900 min-h-screen transition-colors duration-300">
      {/* Header avec dégradé */}
      <div className="bg-gradient-to-r from-primary to-secondary px-6 py-8 rounded-b-3xl mb-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                Bonjour {user?.username || "Client"} 👋
              </h1>
              <p className="text-primary-100">
                Voici un aperçu de vos activités récentes
              </p>
            </div>
            <div className="flex items-center gap-3">
              {mounted && (
                <button
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-all backdrop-blur-sm"
                >
                  {theme === "dark" ? (
                    <Icon icon="ph:sun" className="w-5 h-5 text-white" />
                  ) : (
                    <Icon icon="ph:moon" className="w-5 h-5 text-white" />
                  )}
                </button>
              )}
              <button className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-all backdrop-blur-sm">
                <Icon icon="ph:bell" className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        
        {/* Cartes de statistiques */}
        <div className="grid gap-6 grid-cols-1 md:grid-cols-3 mb-8">
          <StatCard
            title="Candidatures en attente"
            value={pendingCount}
            subtitle="En attente de validation"
            icon="ph:clock"
            color="from-blue-500 to-blue-600"
          />
          <StatCard
            title="Candidatures acceptées"
            value={acceptedCount}
            subtitle="Missions en cours ou terminées"
            icon="ph:check-circle"
            color="from-green-500 to-green-600"
          />
          <StatCard
            title="Taux d'acceptation"
            value={`${acceptanceRate}%`}
            subtitle={`${acceptedCount}/${total} candidatures`}
            icon="ph:chart-line"
            color="from-primary to-secondary"
          />
        </div>

        {/* Tableau des candidatures */}
        <div className="bg-surface dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
          <div className="p-6 border-b border-gray-100 dark:border-gray-700">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-text-primary dark:text-gray-100 flex items-center gap-2">
                  <Icon icon="ph:users" className="w-5 h-5 text-primary" />
                  Candidatures reçues
                </h2>
                <p className="text-sm text-text-secondary dark:text-gray-400 mt-1">
                  Gérez les candidatures des freelances pour vos services
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-text-secondary dark:text-gray-400">
                  Total: {pagination?.total || total}
                </span>
              </div>
            </div>
          </div>

          {candidatures.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-20 h-20 mx-auto bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
                <Icon icon="ph:inbox" className="text-4xl text-text-secondary dark:text-gray-500" />
              </div>
              <h3 className="text-lg font-semibold text-text-primary dark:text-gray-100 mb-2">
                Aucune candidature
              </h3>
              <p className="text-text-secondary dark:text-gray-400">
                Les candidatures des freelances apparaîtront ici
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-100 dark:border-gray-700">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-text-secondary dark:text-gray-400">Offre</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-text-secondary dark:text-gray-400">Statut offre</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-text-secondary dark:text-gray-400">Prestataire</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-text-secondary dark:text-gray-400">Date</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-text-secondary dark:text-gray-400">Statut</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-text-secondary dark:text-gray-400">Budget</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-text-secondary dark:text-gray-400">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                  {candidatures.map((candidature) => {
                    const serviceStatus = candidature.service?.status || "draft";
                    const status = statusConfig[serviceStatus as keyof typeof statusConfig] || statusConfig.draft;
                    const candidatureStatus = statusConfig[candidature.status as keyof typeof statusConfig] || statusConfig.pending;

                    return (
                      <tr key={candidature.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-medium text-text-primary dark:text-gray-100">
                              {candidature.service?.title || "N/A"}
                            </p>
                            {candidature.service?.code && (
                              <p className="text-xs text-text-secondary dark:text-gray-400 mt-0.5">
                                #{candidature.service.code}
                              </p>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full", status.className)}>
                            <Icon icon={status.icon} className="w-3.5 h-3.5" />
                            {status.label}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-xs font-semibold">
                              {candidature.provider?.username?.charAt(0).toUpperCase() || "F"}
                            </div>
                            <div>
                              <p className="text-sm font-medium text-text-primary dark:text-gray-100">
                                {candidature.provider?.username || "Anonyme"}
                              </p>
                              <div className="flex items-center gap-0.5 mt-0.5">
                                {[...Array(5)].map((_, index) => (
                                  <Icon
                                    key={index}
                                    icon={index < Math.floor(candidature.provider?.average_rating || 0) ? "ph:star-fill" : "ph:star"}
                                    className="w-3 h-3 text-yellow-400"
                                  />
                                ))}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-text-secondary dark:text-gray-400 whitespace-nowrap">
                          {formatDate(candidature.application_date)}
                        </td>
                        <td className="px-6 py-4">
                          <span className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full", candidatureStatus.className)}>
                            <Icon icon={candidatureStatus.icon} className="w-3.5 h-3.5" />
                            {candidatureStatus.label}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="font-semibold text-primary">
                            {candidature.proposed_price?.toLocaleString()} CFA
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleViewDetails(candidature)}
                              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                              title="Voir détails"
                            >
                              <Icon icon="ph:eye" className="w-4 h-4 text-text-secondary" />
                            </button>
                            <button
                              onClick={() => handleContact(candidature)}
                              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                              title="Contacter"
                            >
                              <Icon icon="ph:chat" className="w-4 h-4 text-text-secondary" />
                            </button>
                            {candidature.status === "pending" && (
                              <>
                                <button
                                  onClick={() => handleAccept(candidature.id)}
                                  disabled={isProcessing}
                                  className="p-2 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/20 transition-colors"
                                  title="Accepter"
                                >
                                  <Icon icon="ph:check" className="w-4 h-4 text-green-600" />
                                </button>
                                <button
                                  onClick={() => setShowRejectModal(candidature.id)}
                                  className="p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/20 transition-colors"
                                  title="Rejeter"
                                >
                                  <Icon icon="ph:x" className="w-4 h-4 text-red-600" />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
               </table>
            </div>
          )}
        </div>
      </div>

      {/* Modal de détails */}
      <CandidatureDetailModal
        candidature={selectedCandidature}
        isOpen={showDetailModal}
        onClose={() => {
          setShowDetailModal(false);
          setSelectedCandidature(null);
        }}
      />

      {/* Modal de rejet */}
      <RejectModal
        isOpen={showRejectModal !== null}
        onClose={() => setShowRejectModal(null)}
        onConfirm={(reason) => showRejectModal && handleReject(showRejectModal, reason)}
        isLoading={isProcessing}
      />
    </main>
  );
}