// app/dashboard/customer/services/[id]/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Icon } from "@iconify/react";
import { toast } from "sonner";
import { cn } from "@/app/lib/utils";
import { useTheme } from "next-themes";

import { useClientServices } from "@/app/hooks/services/use-client-service";
import { useCandidatures } from "@/app/hooks/applications/use-candidatures";
import type { ServiceImage } from "@/app/types/services";
import type { Candidature } from "@/app/types";
import ServiceDetailLoading from "./loading";
import ServiceDetailError from "./error";

// Configuration des statuts de candidature
const candidatureStatusConfig: Record<
  string,
  { label: string; color: string; bgColor: string; icon: string }
> = {
  pending: {
    label: "En attente",
    color: "text-yellow-700 dark:text-yellow-400",
    bgColor: "bg-yellow-50 dark:bg-yellow-900/20",
    icon: "ph:clock",
  },
  accepted: {
    label: "Acceptée",
    color: "text-green-700 dark:text-green-400",
    bgColor: "bg-green-50 dark:bg-green-900/20",
    icon: "ph:check-circle",
  },
  rejected: {
    label: "Refusée",
    color: "text-red-700 dark:text-red-400",
    bgColor: "bg-red-50 dark:bg-red-900/20",
    icon: "ph:x-circle",
  },
  withdrawn: {
    label: "Retirée",
    color: "text-gray-700 dark:text-gray-400",
    bgColor: "bg-gray-100 dark:bg-gray-800",
    icon: "ph:arrow-arc-left",
  },
};

// Configuration des statuts de service
const serviceStatusConfig: Record<
  string,
  { label: string; color: string; bgColor: string; borderColor: string; icon: string }
> = {
  published: {
    label: "Publié",
    color: "text-blue-700 dark:text-blue-400",
    bgColor: "bg-blue-50 dark:bg-blue-900/20",
    borderColor: "border-blue-500",
    icon: "ph:eye",
  },
  assigned: {
    label: "Assigné",
    color: "text-purple-700 dark:text-purple-400",
    bgColor: "bg-purple-50 dark:bg-purple-900/20",
    borderColor: "border-purple-500",
    icon: "ph:user-check",
  },
  in_progress: {
    label: "En cours",
    color: "text-yellow-700 dark:text-yellow-400",
    bgColor: "bg-yellow-50 dark:bg-yellow-900/20",
    borderColor: "border-yellow-500",
    icon: "ph:clock",
  },
  completed: {
    label: "Terminé",
    color: "text-green-700 dark:text-green-400",
    bgColor: "bg-green-50 dark:bg-green-900/20",
    borderColor: "border-green-500",
    icon: "ph:check-circle",
  },
  cancelled: {
    label: "Annulé",
    color: "text-red-700 dark:text-red-400",
    bgColor: "bg-red-50 dark:bg-red-900/20",
    borderColor: "border-red-500",
    icon: "ph:x-circle",
  },
  disputed: {
    label: "Litige",
    color: "text-orange-700 dark:text-orange-400",
    bgColor: "bg-orange-50 dark:bg-orange-900/20",
    borderColor: "border-orange-500",
    icon: "ph:warning",
  },
  draft: {
    label: "Brouillon",
    color: "text-gray-700 dark:text-gray-400",
    bgColor: "bg-gray-100 dark:bg-gray-800",
    borderColor: "border-gray-500",
    icon: "ph:file-text",
  },
};

export default function ServiceDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const serviceId = Number(params.serviceId);

  const [selectedCandidatureId, setSelectedCandidatureId] = useState<number | undefined>(undefined);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [assigningId, setAssigningId] = useState<number | null>(null);

  const { getClientServiceDetails } = useClientServices();
  const { useCandidatureDetails, acceptCandidature, isAccepting } = useCandidatures();

  const { data: serviceData, isLoading, error, refetch } = getClientServiceDetails(serviceId);
  const { data: candidatureData, isLoading: isLoadingCandidate } = useCandidatureDetails(
    selectedCandidatureId,
    { enabled: selectedCandidatureId !== undefined }
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  const service = serviceData;
  const candidates = serviceData?.candidatures || [];
  const images = serviceData?.images || [];

  const handleAssignprovider = async (providerId: number, candidatureId: number) => {
    if (!confirm("Êtes-vous sûr de vouloir assigner ce freelance au service ?")) return;

    try {
      setAssigningId(candidatureId);
      await acceptCandidature({ id: candidatureId });
      toast.success("Freelance assigné avec succès !");
      refetch();
    } catch (err: any) {
      toast.error(err.message || "Erreur lors de l'assignation");
    } finally {
      setAssigningId(null);
    }
  };

  const handleViewCandidateDetails = (candidatureId: number) => {
    setSelectedCandidatureId(candidatureId);
    setIsDialogOpen(true);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "Date non spécifiée";
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const formatCurrency = (amount: number) => {
    return `${amount?.toLocaleString()} CFA`;
  };

  const getTimeAgo = (dateString: string) => {
    if (!dateString) return "";
    const diff = Date.now() - new Date(dateString).getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days === 0) return "Aujourd'hui";
    if (days === 1) return "Hier";
    if (days < 7) return `Il y a ${days} jours`;
    if (days < 30) return `Il y a ${Math.floor(days / 7)} semaines`;
    return `Il y a ${Math.floor(days / 30)} mois`;
  };

  const sectionClass = "bg-surface dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700";
  const sectionTitleClass = "text-lg font-semibold text-text-primary dark:text-gray-100 mb-4 flex items-center gap-2";
  const labelClass = "text-sm text-text-secondary dark:text-gray-400";
  const valueClass = "text-text-primary dark:text-gray-100 font-medium";

  if (isLoading) return <ServiceDetailLoading />;
  if (error || !service) return <ServiceDetailError error={error} serviceId={serviceId} onRetry={refetch} />;

  const statusConfig = serviceStatusConfig[service.status] || serviceStatusConfig.draft;

  return (
    <main className="bg-background dark:bg-gray-900 min-h-screen transition-colors duration-300">
      {/* Header avec dégradé */}
      <div className="bg-gradient-to-r from-primary to-secondary px-6 py-8 rounded-b-3xl mb-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-2xl sm:text-3xl font-bold text-white">
                  {service.title}
                </h1>
                {service.code && (
                  <span className="px-2 py-1 bg-white/20 rounded-lg text-sm text-white">
                    #{service.code}
                  </span>
                )}
              </div>
              <p className="text-primary-100 mt-2">
                Publié {getTimeAgo(service.created_at)}
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
              <button
                onClick={() => router.push(`/dashboard/customer/missions/${service.id}/edit`)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-white text-primary rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all"
              >
                <Icon icon="ph:pencil" className="w-4 h-4" />
                Modifier
              </button>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  toast.success("Lien copié !");
                }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 text-white rounded-xl font-semibold hover:bg-white/30 transition-all"
              >
                <Icon icon="ph:share" className="w-4 h-4" />
                Partager
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {/* Grille principale */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Colonne de gauche - 2/3 */}
          <div className="lg:col-span-2 space-y-6">
            {/* Images */}
            {images.length > 0 && (
              <div className={sectionClass}>
                <h2 className={sectionTitleClass}>
                  <Icon icon="ph:image" className="w-5 h-5 text-primary" />
                  Galerie
                </h2>
                <div className="grid grid-cols-4 gap-4">
                  {images.map((img: ServiceImage, index: number) => (
                    <img
                      key={index}
                      src={img.image_url}
                      alt={`Service ${index + 1}`}
                      className="w-full h-24 object-cover rounded-xl cursor-pointer hover:opacity-90 transition"
                      onClick={() => window.open(img.image_url, "_blank")}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Description */}
            <div className={sectionClass}>
              <h2 className={sectionTitleClass}>
                <Icon icon="ph:text-align-left" className="w-5 h-5 text-primary" />
                Description
              </h2>
              <div className="prose prose-sm dark:prose-invert max-w-none text-text-secondary dark:text-gray-400">
                <p>{service.full_description || service.short_description}</p>
              </div>
            </div>

            {/* Détails pratiques */}
            <div className={sectionClass}>
              <h2 className={sectionTitleClass}>
                <Icon icon="ph:calendar" className="w-5 h-5 text-primary" />
                Détails pratiques
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div>
                  <p className={labelClass}>Date</p>
                  <p className={valueClass}>{formatDate(service.scheduled_date || service.created_at)}</p>
                </div>
                <div>
                  <p className={labelClass}>Heure</p>
                  <p className={valueClass}>{service.scheduled_date ? new Date(service.scheduled_date).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }) : "Flexible"}</p>
                </div>
                <div>
                  <p className={labelClass}>Durée</p>
                  <p className={valueClass}>{service.duration || "Non spécifiée"}</p>
                </div>
                <div>
                  <p className={labelClass}>Budget</p>
                  <p className="text-lg font-bold text-primary">{formatCurrency(service.proposed_amount)}</p>
                </div>
              </div>
            </div>

            {/* Localisation */}
            <div className={sectionClass}>
              <h2 className={sectionTitleClass}>
                <Icon icon="ph:map-pin" className="w-5 h-5 text-primary" />
                Localisation
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className={labelClass}>Adresse</p>
                  <p className={valueClass}>{service.location?.address || "Non spécifiée"}</p>
                  <p className="text-sm text-text-secondary dark:text-gray-400 mt-1">
                    {service.location?.city}
                    {service.location?.postal_code ? `, ${service.location.postal_code}` : ""}
                    {service.location?.country ? `, ${service.location.country}` : ""}
                  </p>
                </div>
                {service.location?.latitude && service.location?.longitude && (
                  <div>
                    <p className={labelClass}>Coordonnées</p>
                    <p className="text-sm text-text-secondary dark:text-gray-400">
                      Lat: {service.location.latitude.toFixed(4)}, Lon: {service.location.longitude.toFixed(4)}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Compétences requises */}
            {service.required_skills && service.required_skills.length > 0 && (
              <div className={sectionClass}>
                <h2 className={sectionTitleClass}>
                  <Icon icon="ph:code" className="w-5 h-5 text-primary" />
                  Compétences requises
                </h2>
                <div className="flex flex-wrap gap-2">
                  {service.required_skills.map((skill: string) => (
                    <span key={skill} className="px-3 py-1.5 bg-primary/10 text-primary rounded-full text-sm">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Colonne de droite - 1/3 */}
          <div className="space-y-6">
            {/* Carte de statut */}
            <div className={cn(sectionClass, `border-l-4 ${statusConfig.borderColor}`)}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-medium text-text-secondary dark:text-gray-400">Statut actuel</h2>
                <span className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full", statusConfig.bgColor, statusConfig.color)}>
                  <Icon icon={statusConfig.icon} className="w-3.5 h-3.5" />
                  {statusConfig.label}
                </span>
              </div>

              {service.provider && (
                <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                  <p className="text-sm text-text-secondary dark:text-gray-400 mb-3">Prestataire assigné</p>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-semibold text-lg">
                      {service.provider.user?.username?.charAt(0).toUpperCase() || "F"}
                    </div>
                    <div>
                      <p className="font-medium text-text-primary dark:text-gray-100">{service.provider.user?.username}</p>
                      <p className="text-sm text-text-secondary dark:text-gray-400">
                        Note: {service.provider.average_rating || "Nouveau"} ⭐
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Statistiques */}
            <div className={sectionClass}>
              <h2 className={sectionTitleClass}>
                <Icon icon="ph:chart-bar" className="w-5 h-5 text-primary" />
                Statistiques
              </h2>
              <div className="space-y-3">
                <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                  <span className={labelClass}>Candidatures</span>
                  <span className="font-semibold text-text-primary dark:text-gray-100">{candidates.length}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                  <span className={labelClass}>Budget proposé</span>
                  <span className="font-semibold text-text-primary dark:text-gray-100">{formatCurrency(service.proposed_amount)}</span>
                </div>
                {service.accepted_amount && (
                  <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                    <span className={labelClass}>Budget accepté</span>
                    <span className="font-semibold text-green-600 dark:text-green-400">{formatCurrency(service.accepted_amount)}</span>
                  </div>
                )}
                <div className="flex justify-between py-2">
                  <span className={labelClass}>Créé le</span>
                  <span className="text-sm text-text-secondary dark:text-gray-400">{formatDate(service.created_at)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section des candidatures */}
        <div className="mt-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-text-primary dark:text-gray-100 flex items-center gap-2">
              <Icon icon="ph:users" className="w-5 h-5 text-primary" />
              Candidatures reçues ({candidates.length})
            </h2>
          </div>

          {candidates.length === 0 ? (
            <div className={cn(sectionClass, "text-center py-12")}>
              <Icon icon="ph:users" className="text-5xl text-text-secondary dark:text-gray-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-text-primary dark:text-gray-100 mb-2">
                Aucune candidature pour le moment
              </h3>
              <p className="text-text-secondary dark:text-gray-400">
                Les candidatures apparaîtront ici lorsque des freelances postuleront
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {candidates.map((candidate: any) => {
                const status = candidatureStatusConfig[candidate.status] || candidatureStatusConfig.pending;

                return (
                  <div key={candidate.id} className={cn(sectionClass, "hover:shadow-md transition-all")}>
                    <div className="flex flex-col md:flex-row gap-6">
                      <div className="flex items-start gap-4 flex-1">
                        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-semibold text-lg shrink-0">
                          {(candidate.name || candidate.provider_name || "C").charAt(0).toUpperCase()}
                        </div>

                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-2 mb-3">
                            <h3 className="text-lg font-semibold text-text-primary dark:text-gray-100">
                              {candidate.name || candidate.provider_name || "Candidat"}
                            </h3>
                            <span className={cn("inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full", status.bgColor, status.color)}>
                              <Icon icon={status.icon} className="w-3 h-3" />
                              {status.label}
                            </span>
                          </div>

                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                            <div>
                              <p className={labelClass}>Prix proposé</p>
                              <p className="font-semibold text-primary">{formatCurrency(candidate.proposed_price)}</p>
                            </div>
                            <div>
                              <p className={labelClass}>Durée</p>
                              <p className={valueClass}>{candidate.estimated_duration || "Non spécifiée"}</p>
                            </div>
                            <div>
                              <p className={labelClass}>Note</p>
                              <p className={valueClass}>{candidate.rating ? `${candidate.rating} ⭐` : "Nouveau"}</p>
                            </div>
                            <div>
                              <p className={labelClass}>Postulé le</p>
                              <p className={valueClass}>{formatDate(candidate.application_date || candidate.created_at)}</p>
                            </div>
                          </div>

                          {(candidate.cover_letter || candidate.message) && (
                            <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-3 mt-2">
                              <p className="text-sm text-text-secondary dark:text-gray-400 line-clamp-2">
                                {candidate.cover_letter || candidate.message}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex md:flex-col gap-2 justify-end md:min-w-[120px]">
                        <button
                          onClick={() => handleViewCandidateDetails(candidate.candidature_id || candidate.id)}
                          className="inline-flex items-center justify-center gap-2 px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 text-text-secondary hover:bg-gray-50 dark:hover:bg-gray-700 transition-all text-sm"
                        >
                          <Icon icon="ph:eye" className="w-4 h-4" />
                          Détails
                        </button>

                        {service.status === "published" && candidate.status === "pending" && (
                          <button
                            onClick={() => handleAssignprovider(candidate.provider_id, candidate.id)}
                            disabled={assigningId === candidate.id || isAccepting}
                            className="inline-flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-medium hover:shadow-lg transition-all disabled:opacity-50 text-sm"
                          >
                            {assigningId === candidate.id || isAccepting ? (
                              <Icon icon="ph:spinner" className="animate-spin w-4 h-4" />
                            ) : (
                              <>
                                <Icon icon="ph:check" className="w-4 h-4" />
                                Assigner
                              </>
                            )}
                          </button>
                        )}

                        <button
                          onClick={() => {
                            const username = candidate.username;
                            const serviceCode = service.code;
                            if (username && serviceCode) {
                              window.open(`/dashboard/customer/messaging?username=${encodeURIComponent(username)}&service_code=${encodeURIComponent(serviceCode)}`, "_blank");
                            } else {
                              window.open(`/dashboard/customer/messaging?user=${candidate.provider_id}`, "_blank");
                            }
                          }}
                          className="inline-flex items-center justify-center gap-2 px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 text-text-secondary hover:bg-gray-50 dark:hover:bg-gray-700 transition-all text-sm"
                        >
                          <Icon icon="ph:chat" className="w-4 h-4" />
                          Contacter
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Dialogue des détails du candidat */}
      {candidatureData && (
        <div className={cn("fixed inset-0 z-50 flex items-center justify-center bg-black/50 transition-opacity", isDialogOpen ? "opacity-100 visible" : "opacity-0 invisible")} onClick={() => setIsDialogOpen(false)}>
          <div className={cn("relative max-w-3xl w-full mx-4 bg-surface dark:bg-gray-800 rounded-2xl shadow-xl transition-all", isDialogOpen ? "scale-100" : "scale-95")} onClick={(e) => e.stopPropagation()}>
            {/* En-tête du modal */}
            <div className="bg-gradient-to-r from-primary to-secondary px-6 py-5 rounded-t-2xl">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center text-white text-2xl font-bold">
                    {(candidatureData.provider.full_name ?? candidatureData.provider.username)?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">
                      {candidatureData.provider.full_name ?? candidatureData.provider.username}
                    </h2>
                    {candidatureData.provider.professional_title && (
                      <p className="text-primary-100 text-sm">{candidatureData.provider.professional_title}</p>
                    )}
                  </div>
                </div>
                <button onClick={() => setIsDialogOpen(false)} className="p-1 rounded-full bg-white/20 hover:bg-white/30 transition-all">
                  <Icon icon="ph:x" className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>

            <div className="p-6 max-h-[70vh] overflow-y-auto">
              {/* Statistiques */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-4">
                  <p className="text-xs text-text-secondary uppercase tracking-wider">Gains (12 mois)</p>
                  <p className="text-2xl font-bold text-text-primary dark:text-gray-100 mt-1">
                    {candidatureData.earnings_stats.recent_earnings >= 1000
                      ? `${Math.round(candidatureData.earnings_stats.recent_earnings / 1000)}K+ CFA`
                      : `${candidatureData.earnings_stats.recent_earnings.toLocaleString()} CFA`}
                  </p>
                  <div className="flex justify-between text-xs text-text-secondary mt-2">
                    <span>{candidatureData.earnings_stats.recent_jobs} Jobs</span>
                    <span>{candidatureData.earnings_stats.recent_hours} Heures</span>
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-4">
                  <p className="text-xs text-text-secondary uppercase tracking-wider">Gains totaux</p>
                  <p className="text-2xl font-bold text-text-primary dark:text-gray-100 mt-1">
                    {candidatureData.earnings_stats.lifetime_earnings >= 1000
                      ? `${Math.round(candidatureData.earnings_stats.lifetime_earnings / 1000)}K+ CFA`
                      : `${candidatureData.earnings_stats.lifetime_earnings.toLocaleString()} CFA`}
                  </p>
                  <div className="flex justify-between text-xs text-text-secondary mt-2">
                    <span>{candidatureData.earnings_stats.lifetime_jobs} Total jobs</span>
                    <span>{candidatureData.earnings_stats.lifetime_hours} Heures</span>
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-4">
                  <p className="text-xs text-text-secondary uppercase tracking-wider">Note</p>
                  <div className="flex items-center gap-1 mt-1">
                    <span className="text-2xl font-bold text-text-primary dark:text-gray-100">
                      {candidatureData.earnings_stats.average_rating.toFixed(2)}
                    </span>
                    <span className="text-yellow-400 text-lg">★</span>
                  </div>
                  <div className="text-xs text-text-secondary mt-2">
                    {candidatureData.earnings_stats.total_hours_worked} heures travaillées
                  </div>
                </div>
              </div>

              {/* Bio */}
              {candidatureData.provider.bio && (
                <div className="mb-6">
                  <h3 className="font-semibold text-text-primary dark:text-gray-100 mb-2 flex items-center gap-2">
                    <Icon icon="ph:user" className="w-4 h-4 text-primary" />
                    À propos
                  </h3>
                  <p className="text-sm text-text-secondary dark:text-gray-400 leading-relaxed">
                    {candidatureData.provider.bio}
                  </p>
                </div>
              )}

              {/* Compétences */}
              {candidatureData.skills.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-semibold text-text-primary dark:text-gray-100 mb-2 flex items-center gap-2">
                    <Icon icon="ph:code" className="w-4 h-4 text-primary" />
                    Compétences
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {candidatureData.skills.map((s: any) => (
                      <span key={s.id} className="px-3 py-1.5 bg-primary/10 text-primary rounded-full text-sm">
                        {s.skill.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Lettre de motivation */}
              <div className="mb-6">
                <h3 className="font-semibold text-text-primary dark:text-gray-100 mb-2 flex items-center gap-2">
                  <Icon icon="ph:envelope" className="w-4 h-4 text-primary" />
                  Lettre de motivation
                </h3>
                <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-4 text-text-secondary dark:text-gray-400 whitespace-pre-wrap text-sm">
                  {candidatureData.cover_letter ?? "Aucune lettre de motivation fournie."}
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-700">
                <button
                  onClick={() => {
                    const username = candidatureData.username;
                    const serviceCode = service.code;
                    if (username && serviceCode) {
                      window.open(`/dashboard/customer/messaging?username=${encodeURIComponent(username)}&service_code=${encodeURIComponent(serviceCode)}`, "_blank");
                    } else {
                      window.open(`/dashboard/customer/messaging?user=${candidatureData.provider_id}`, "_blank");
                    }
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 text-text-secondary hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
                >
                  <Icon icon="ph:chat" className="w-4 h-4" />
                  Contacter
                </button>

                {candidatureData.can_assign && (
                  <button
                    onClick={() => {
                      handleAssignprovider(candidatureData.provider_id, candidatureData.candidature_id);
                      setIsDialogOpen(false);
                    }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-semibold hover:shadow-lg transition-all"
                  >
                    {isAccepting ? (
                      <Icon icon="ph:spinner" className="animate-spin w-4 h-4" />
                    ) : (
                      <>
                        <Icon icon="ph:check" className="w-4 h-4" />
                        Assigner ce freelance
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}