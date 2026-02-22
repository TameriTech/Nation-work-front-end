// ===== FILE: app/dashboard/customer/services/[id]/page.tsx =====

"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Icon } from "@iconify/react";
import { toast } from "sonner";

import {
  getClientServiceDetails,
  assignFreelancer,
} from "@/app/services/service.service";
import { Service } from "@/app/types/services";
import { Candidature } from "@/app/types/candidatures";
import ProgressStepper from "@/app/components/features/job-detail/ProgressStepper";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/app/components/ui/breadcrumb";
import { Button } from "@/app/components/ui/button";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/app/components/ui/avatar";
import { Badge } from "@/app/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/app/components/ui/dialog";

interface CandidateDetails {
  id: number;
  freelancer_id: number;
  name: string;
  profile_picture?: string;
  proposed_price: number;
  estimated_duration?: string;
  cover_letter: string;
  status: string;
  application_date: string;
  rating?: number;
  completed_services?: number;
  email?: string;
  phone?: string;
  skills?: string[];
}

// Configuration des statuts de candidature
const candidatureStatusConfig: Record<
  string,
  { label: string; color: string; bgColor: string }
> = {
  en_attente: {
    label: "En attente",
    color: "text-yellow-700",
    bgColor: "bg-yellow-100",
  },
  accepted: {
    label: "Acceptée",
    color: "text-green-700",
    bgColor: "bg-green-100",
  },
  rejected: {
    label: "Refusée",
    color: "text-red-700",
    bgColor: "bg-red-100",
  },
  withdrawn: {
    label: "Retirée",
    color: "text-gray-700",
    bgColor: "bg-gray-100",
  },
};

export default function ServiceDetailPage() {
  const router = useRouter();
  const params = useParams();
  const serviceId = Number(params.serviceId);

  // États
  const [service, setService] = useState<Service | null>(null);
  const [candidates, setCandidates] = useState<CandidateDetails[]>([]);
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [assigningId, setAssigningId] = useState<number | null>(null);

  // État pour le dialogue des détails du candidat
  const [selectedCandidate, setSelectedCandidate] =
    useState<CandidateDetails | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Charger les données
  useEffect(() => {
    const loadServiceDetails = async () => {
      try {
        console.log("Service Id: ", serviceId);
        setLoading(true);
        const data = await getClientServiceDetails(serviceId);
        setService(data);
        setCandidates(data.candidates || []);
        setImages(data.images || []);
        console.log("Service details loaded: ", data);
      } catch (err: any) {
        setError(err.message || "Erreur lors du chargement");
        toast.error("Impossible de charger les détails du service");
      } finally {
        setLoading(false);
      }
    };

    if (serviceId) {
      loadServiceDetails();
    }
  }, [serviceId]);

  // Assigner un freelance
  const handleAssignFreelancer = async (
    freelancerId: number,
    candidatureId: number,
  ) => {
    if (
      !confirm("Êtes-vous sûr de vouloir assigner ce freelance au service ?")
    ) {
      return;
    }

    try {
      setAssigningId(candidatureId);
      await assignFreelancer(serviceId, freelancerId);
      toast.success("Freelance assigné avec succès !");

      // Recharger les données
      const data = await getClientServiceDetails(serviceId);
      setService(data.service);
      setCandidates(data.candidates || []);
    } catch (err: any) {
      toast.error(err.message || "Erreur lors de l'assignation");
    } finally {
      setAssigningId(null);
    }
  };

  // Voir les détails d'un candidat
  const handleViewCandidateDetails = (candidate: CandidateDetails) => {
    setSelectedCandidate(candidate);
    setIsDialogOpen(true);
  };

  // Formater la date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  // Calculer le temps écoulé
  const getTimeAgo = (dateString: string) => {
    const diff = Date.now() - new Date(dateString).getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) return "Aujourd'hui";
    if (days === 1) return "Hier";
    if (days < 7) return `Il y a ${days} jours`;
    if (days < 30) return `Il y a ${Math.floor(days / 7)} semaines`;
    return `Il y a ${Math.floor(days / 30)} mois`;
  };

  // Classes CSS
  const sectionClass = "bg-white rounded-2xl p-6 shadow-sm";
  const sectionTitleClass = "text-lg font-semibold text-gray-800 mb-4";
  const labelClass = "text-sm text-gray-500";
  const valueClass = "text-gray-900 font-medium";

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Icon
            icon="mdi:loading"
            className="animate-spin text-4xl text-blue-600 mx-auto mb-4"
          />
          <p className="text-gray-600">Chargement du service...</p>
        </div>
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Icon
            icon="mdi:alert-circle"
            className="text-4xl text-red-500 mx-auto mb-4"
          />
          <p className="text-gray-800 font-medium mb-2">Erreur</p>
          <p className="text-gray-600 mb-4">{error || "Service non trouvé"}</p>
          <Button onClick={() => router.back()}>Retour</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <Breadcrumb className="mb-6">
          <BreadcrumbList className="text-gray-500">
            <BreadcrumbItem>
              <BreadcrumbLink href="/dashboard/customer">
                Tableau de bord
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/dashboard/customer/services">
                Mes services
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="font-semibold text-gray-900">
                {service.title}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* En-tête avec actions */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {service.title}
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Publié {getTimeAgo(service.created_at)} · Réf: #{service.id}
            </p>
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() =>
                router.push(`/dashboard/customer/services/${serviceId}/edit`)
              }
              className="border-blue-600 text-blue-600 hover:bg-blue-50"
            >
              <Icon icon="mdi:pen" className="mr-2 h-4 w-4" />
              Modifier
            </Button>
            <Button
              className="bg-blue-600 text-white hover:bg-blue-700"
              onClick={() => {
                /* Partager */
              }}
            >
              <Icon icon="mdi:share" className="mr-2 h-4 w-4" />
              Partager
            </Button>
          </div>
        </div>

        {/* Grille principale */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Colonne de gauche - 2/3 */}
          <div className="lg:col-span-2 space-y-6">
            {/* Images du service */}
            {images.length > 0 && (
              <div className={sectionClass}>
                <h2 className={sectionTitleClass}>Galerie</h2>
                <div className="grid grid-cols-4 gap-4">
                  {images.map((img, index) => (
                    <img
                      key={index}
                      src={img}
                      alt={`Service ${index + 1}`}
                      className="w-full h-24 object-cover rounded-lg cursor-pointer hover:opacity-90 transition"
                      onClick={() => window.open(img, "_blank")}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Description */}
            <div className={sectionClass}>
              <h2 className={sectionTitleClass}>Description</h2>
              <div
                className="prose max-w-none text-gray-600"
                dangerouslySetInnerHTML={{
                  __html: service.full_description || service.short_description,
                }}
              />
            </div>

            {/* Détails pratiques */}
            <div className={sectionClass}>
              <h2 className={sectionTitleClass}>Détails pratiques</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div>
                  <p className={labelClass}>Date</p>
                  <p className={valueClass}>
                    {formatDate(service.date_pratique)}
                  </p>
                </div>
                <div>
                  <p className={labelClass}>Heure</p>
                  <p className={valueClass}>
                    {service.start_time || "Flexible"}
                  </p>
                </div>
                <div>
                  <p className={labelClass}>Durée</p>
                  <p className={valueClass}>
                    {service.duration || "Non spécifiée"}
                  </p>
                </div>
                <div>
                  <p className={labelClass}>Budget</p>
                  <p
                    className={`${valueClass} text-lg font-bold text-blue-600`}
                  >
                    {service.proposed_amount?.toLocaleString()} FCFA
                  </p>
                </div>
              </div>
            </div>

            {/* Localisation */}
            <div className={sectionClass}>
              <h2 className={sectionTitleClass}>Localisation</h2>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className={labelClass}>Adresse</p>
                  <p className={valueClass}>{service.address}</p>
                  <p className="text-sm text-gray-500">
                    {service.city}
                    {service.postal_code ? `, ${service.postal_code}` : ""}
                  </p>
                </div>
                {service.latitude && service.longitude && (
                  <div>
                    <p className={labelClass}>Coordonnées</p>
                    <p className="text-sm text-gray-600">
                      Lat: {service.latitude.toFixed(4)}, Lon:{" "}
                      {service.longitude.toFixed(4)}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Compétences requises */}
            {service.required_skills && service.required_skills.length > 0 && (
              <div className={sectionClass}>
                <h2 className={sectionTitleClass}>Compétences requises</h2>
                <div className="flex flex-wrap gap-2">
                  {service.required_skills.map((skill) => (
                    <Badge
                      key={skill}
                      variant="secondary"
                      className="px-3 py-1 bg-blue-100 text-blue-800 hover:bg-blue-200"
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Colonne de droite - 1/3 - Informations client et statut */}
          <div className="space-y-6">
            {/* Carte de statut */}
            <div
              className={`${sectionClass} border-l-4 ${
                service.status === "published"
                  ? "border-blue-500"
                  : service.status === "assigned"
                    ? "border-purple-500"
                    : service.status === "en_cours"
                      ? "border-yellow-500"
                      : service.status === "terminé"
                        ? "border-green-500"
                        : "border-gray-500"
              }`}
            >
              <h2 className="text-sm font-medium text-gray-500 mb-2">
                Statut actuel
              </h2>
              <div className="flex items-center justify-between">
                <span className="text-xl font-bold text-gray-900">
                  {service.status === "published" && "Publié"}
                  {service.status === "assigned" && "Assigné"}
                  {service.status === "en_cours" && "En cours"}
                  {service.status === "terminé" && "Terminé"}
                  {service.status === "annulé" && "Annulé"}
                </span>
                {service.freelancer ? (
                  <Badge className="bg-green-100 text-green-800">
                    Prestataire assigné
                  </Badge>
                ) : (
                  <Badge
                    variant="outline"
                    className="text-yellow-600 border-yellow-300"
                  >
                    En attente
                  </Badge>
                )}
              </div>

              {service.freelancer && (
                <div className="mt-4 pt-4 border-t">
                  <p className="text-sm text-gray-500 mb-2">
                    Prestataire assigné
                  </p>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={service.freelancer.avatar} />
                      <AvatarFallback>
                        {service.freelancer.name?.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-gray-900">
                        {service.freelancer.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        Note: {service.freelancer.rating || "Nouveau"} ⭐
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Carte des statistiques */}
            <div className={sectionClass}>
              <h2 className={sectionTitleClass}>Statistiques</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className={labelClass}>Candidatures</span>
                  <span className="font-semibold text-gray-900">
                    {candidates.length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className={labelClass}>Budget proposé</span>
                  <span className="font-semibold text-gray-900">
                    {service.proposed_amount?.toLocaleString()} FCFA
                  </span>
                </div>
                {service.accepted_amount && (
                  <div className="flex justify-between">
                    <span className={labelClass}>Budget accepté</span>
                    <span className="font-semibold text-green-600">
                      {service.accepted_amount?.toLocaleString()} FCFA
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className={labelClass}>Créé le</span>
                  <span className="text-sm text-gray-600">
                    {formatDate(service.created_at)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section des candidatures */}
        <div className="mt-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Candidatures reçues ({candidates.length})
            </h2>
            <div className="flex gap-2">
              <select className="px-3 py-2 border rounded-lg text-sm">
                <option value="all">Tous les statuts</option>
                <option value="en_attente">En attente</option>
                <option value="accepted">Acceptées</option>
                <option value="rejected">Refusées</option>
              </select>
            </div>
          </div>

          {candidates.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center">
              <Icon
                icon="mdi:account-multiple"
                className="text-6xl text-gray-300 mx-auto mb-4"
              />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Aucune candidature pour le moment
              </h3>
              <p className="text-gray-500">
                Les candidatures apparaîtront ici lorsque des freelances
                postuleront
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {candidates.map((candidate) => {
                const status =
                  candidatureStatusConfig[candidate.status] ||
                  candidatureStatusConfig.en_attente;

                return (
                  <div
                    key={candidate.id}
                    className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition"
                  >
                    <div className="flex flex-col md:flex-row gap-6">
                      {/* Avatar et infos principales */}
                      <div className="flex items-start gap-4 flex-1">
                        <Avatar className="h-16 w-16">
                          <AvatarImage src={candidate.profile_picture} />
                          <AvatarFallback className="text-lg">
                            {candidate.name?.charAt(0)}
                          </AvatarFallback>
                        </Avatar>

                        <div className="flex-1">
                          <div className="flex flex-col md:flex-row md:items-center gap-2 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900">
                              {candidate.name}
                            </h3>
                            <Badge
                              className={status.bgColor + " " + status.color}
                            >
                              {status.label}
                            </Badge>
                          </div>

                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                            <div>
                              <p className={labelClass}>Prix proposé</p>
                              <p className="font-semibold text-blue-600">
                                {candidate.proposed_price?.toLocaleString()}{" "}
                                FCFA
                              </p>
                            </div>
                            <div>
                              <p className={labelClass}>Durée</p>
                              <p className="text-gray-900">
                                {candidate.estimated_duration ||
                                  "Non spécifiée"}
                              </p>
                            </div>
                            <div>
                              <p className={labelClass}>Note</p>
                              <p className="text-gray-900">
                                {candidate.rating
                                  ? `${candidate.rating} ⭐`
                                  : "Nouveau"}
                              </p>
                            </div>
                            <div>
                              <p className={labelClass}>Postulé le</p>
                              <p className="text-gray-900">
                                {formatDate(candidate.application_date)}
                              </p>
                            </div>
                          </div>

                          {/* Aperçu de la lettre de motivation */}
                          {candidate.cover_letter && (
                            <div className="bg-gray-50 rounded-lg p-3">
                              <p className="text-sm text-gray-600 line-clamp-2">
                                {candidate.cover_letter}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex md:flex-col gap-2 justify-end md:min-w-[120px]">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewCandidateDetails(candidate)}
                          className="border-gray-300"
                        >
                          <Icon icon="mdi:eye" className="mr-2 h-4 w-4" />
                          Détails
                        </Button>

                        {service.status === "published" &&
                          candidate.status === "en_attente" && (
                            <Button
                              size="sm"
                              onClick={() =>
                                handleAssignFreelancer(
                                  candidate.freelancer_id,
                                  candidate.id,
                                )
                              }
                              disabled={assigningId === candidate.id}
                              className="bg-green-600 hover:bg-green-700 text-white"
                            >
                              {assigningId === candidate.id ? (
                                <Icon
                                  icon="mdi:loading"
                                  className="animate-spin h-4 w-4"
                                />
                              ) : (
                                <>
                                  <Icon
                                    icon="mdi:check"
                                    className="mr-2 h-4 w-4"
                                  />
                                  Assigner
                                </>
                              )}
                            </Button>
                          )}
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
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          {selectedCandidate && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={selectedCandidate.profile_picture} />
                    <AvatarFallback>
                      {selectedCandidate.name?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h2 className="text-xl font-bold">
                      {selectedCandidate.name}
                    </h2>
                    <p className="text-sm text-gray-500">
                      Postulé le{" "}
                      {formatDate(selectedCandidate.application_date)}
                    </p>
                  </div>
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-6 py-4">
                {/* Grille d'informations */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className={labelClass}>Prix proposé</p>
                    <p className="text-lg font-bold text-blue-600">
                      {selectedCandidate.proposed_price?.toLocaleString()} FCFA
                    </p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className={labelClass}>Durée estimée</p>
                    <p className="font-medium">
                      {selectedCandidate.estimated_duration || "Non spécifiée"}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className={labelClass}>Note moyenne</p>
                    <p className="font-medium">
                      {selectedCandidate.rating
                        ? `${selectedCandidate.rating}/5`
                        : "Nouveau"}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className={labelClass}>Services complétés</p>
                    <p className="font-medium">
                      {selectedCandidate.completed_services || 0}
                    </p>
                  </div>
                </div>

                {/* Lettre de motivation */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Lettre de motivation
                  </h3>
                  <div className="bg-gray-50 rounded-lg p-4 text-gray-700 whitespace-pre-wrap">
                    {selectedCandidate.cover_letter ||
                      "Aucune lettre de motivation fournie."}
                  </div>
                </div>

                {/* Compétences (si disponibles) */}
                {selectedCandidate.skills &&
                  selectedCandidate.skills.length > 0 && (
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">
                        Compétences
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedCandidate.skills.map((skill) => (
                          <Badge
                            key={skill}
                            variant="secondary"
                            className="bg-blue-100 text-blue-800"
                          >
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                {/* Actions */}
                <div className="flex justify-end gap-3 pt-4 border-t">
                  <Button
                    variant="outline"
                    onClick={() => {
                      window.open(
                        `/messages?user=${selectedCandidate.freelancer_id}`,
                        "_blank",
                      );
                    }}
                  >
                    <Icon icon="mdi:chat" className="mr-2 h-4 w-4" />
                    Contacter
                  </Button>

                  {service.status === "published" &&
                    selectedCandidate.status === "en_attente" && (
                      <Button
                        onClick={() => {
                          handleAssignFreelancer(
                            selectedCandidate.freelancer_id,
                            selectedCandidate.id,
                          );
                          setIsDialogOpen(false);
                        }}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <Icon icon="mdi:check" className="mr-2 h-4 w-4" />
                        Assigner ce freelance
                      </Button>
                    )}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
