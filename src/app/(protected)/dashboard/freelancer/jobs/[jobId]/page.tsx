// app/(public)/jobs/[id]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Icon } from "@iconify/react";
import { toast } from "sonner";

import {
  useFreelancerServices,
  useServiceDetails,
} from "@/app/hooks/services/use-freelancer-service";
import { useWishlist } from "@/app/hooks/services/use-wishlist";
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
import { formatDate } from "@/app/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/app/components/ui/dialog";
import { Textarea } from "@/app/components/ui/textarea";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import JobDetailSkeleton from "./loading";
import JobDetailError from "./error";

export default function JobDetailPage() {
  const router = useRouter();
  const params = useParams();
  const serviceId = Number(params.jobId);

  console.log("🟢 JobDetailPage - ID du service:", serviceId);

  // États pour les modales
  const [isApplyDialogOpen, setIsApplyDialogOpen] = useState(false);
  const [isQuestionDialogOpen, setIsQuestionDialogOpen] = useState(false);
  const [coverLetter, setCoverLetter] = useState("");
  const [proposedPrice, setProposedPrice] = useState<number>();
  const [question, setQuestion] = useState("");

  const {
    availableServices,
    availablePagination,
    isLoadingAvailable,
    filters,
    updateFilters,
    applyToService,
    isApplying,
    applications,
    wishlist, // À ajouter dans le hook si nécessaire
    toggleFavorite, // À ajouter dans le hook si nécessaire
    isFavorite,
  } = useFreelancerServices();

  // Hooks
  const {
    data: service,
    isLoading,
    error,
    refetch,
  } = useServiceDetails(serviceId);

  // Debug: Afficher les données du service
  useEffect(() => {
    if (service) {
      console.log("🎯 Service reçu:", {
        id: service.id,
        title: service.title,
        status: service.status,
        budget: service.proposed_amount,
        client: service.client,
        created_at: service.created_at,
        candidatures_count: service.candidatures_count,
      });
    }
  }, [service]);

  // Gestionnaires d'événements
  const handleApply = () => {
    if (!service) return;

    // Ouvrir la modale de candidature
    setIsApplyDialogOpen(true);
  };

  const handleSubmitApplication = async () => {
    if (!service) return;

    try {
      await applyToService({
        service_id: service.id,
        cover_letter: coverLetter,
        proposed_amount: proposedPrice || service.proposed_amount,
      });

      toast.success("Candidature envoyée avec succès !");
      setIsApplyDialogOpen(false);
      setCoverLetter("");
      setProposedPrice(undefined);
    } catch (error) {
      toast.error("Erreur lors de l'envoi de la candidature");
      console.error(error);
    }
  };

  const handleAskQuestion = () => {
    if (!service) return;

    // Ouvrir la modale de question
    setIsQuestionDialogOpen(true);
  };

  const handleSubmitQuestion = async () => {
    if (!service || !question.trim()) return;

    try {
      // Logique pour envoyer la question
      // À implémenter selon votre API
      console.log("Question posée:", {
        serviceId: service.id,
        question,
      });

      toast.success("Question envoyée !");
      setIsQuestionDialogOpen(false);
      setQuestion("");
    } catch (error) {
      toast.error("Erreur lors de l'envoi de la question");
      console.error(error);
    }
  };

  const handleSave = () => {
    console.log("⭐ Sauvegarder/retirer le service:", serviceId);
    if (service) {
      toggleFavorite(serviceId);
      toast.success(isSaved ? "Retiré des favoris" : "Ajouté aux favoris");
    }
  };

  // Vérifier si le service a déjà été postulé
  const hasApplied = applications?.some(
    (app: any) => app.service_id === serviceId,
  );

  // États de chargement
  if (isLoading) {
    return <JobDetailSkeleton />;
  }

  // États d'erreur
  if (error || !service) {
    return (
      <JobDetailError
        error={error as Error}
        serviceId={serviceId}
        onRetry={refetch}
      />
    );
  }

  // Vérifier si le service est dans les favoris
  const isSaved = service ? isFavorite(serviceId) : false;
  const applied = hasApplied || false; // À déterminer selon la logique métier

  // ========== FONCTIONS UTILITAIRES ==========

  const calculateDaysLeft = (dateString?: string): number => {
    if (!dateString) return 0;
    try {
      const targetDate = new Date(dateString);
      const today = new Date();
      const diffTime = targetDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays > 0 ? diffDays : 0;
    } catch (error) {
      console.error("Erreur calcul jours restants:", error);
      return 0;
    }
  };

  const calculateProjectDuration = (createdAt?: string): string => {
    if (!createdAt) return "Non spécifié";
    try {
      const createdDate = new Date(createdAt);
      const today = new Date();
      const diffTime = today.getTime() - createdDate.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays < 7) return "Moins d'une semaine";
      if (diffDays < 30) return "Moins d'un mois";
      if (diffDays < 90) return "1-3 mois";
      return "Plus de 3 mois";
    } catch (error) {
      console.error("Erreur calcul durée projet:", error);
      return "Non spécifié";
    }
  };

  const getExperienceLevel = (amount?: number): string => {
    if (!amount) return "Non spécifié";
    if (amount < 50000) return "Débutant";
    if (amount < 100000) return "Intermédiaire";
    if (amount < 200000) return "Confirmé";
    if (amount < 500000) return "Expert";
    return "Senior";
  };

  const getServiceDate = (): string => {
    return (
      service.date_pratique || service.created_at || new Date().toISOString()
    );
  };

  const getLocation = (): string => {
    const parts = [];
    if (service.city) parts.push(service.city);
    if (service.country) parts.push(service.country);
    return parts.length > 0 ? parts.join(", ") : "Non spécifié";
  };

  const getPayment = (): number => {
    return service.accepted_amount || service.proposed_amount || 0;
  };

  const daysLeft = calculateDaysLeft(getServiceDate());
  const projectDuration = calculateProjectDuration(service.created_at);
  const payment = getPayment();
  const location = getLocation();
  const serviceDate = getServiceDate();
  const skills = service.required_skills || [];

  // ========== RENDU ==========

  return (
    <div className="container bg-white rounded-lg mt-5 mx-auto px-4 py-8">
      <div className="w-full space-y-6 pb-24 md:pb-6">
        {/* Breadcrumb */}
        <Breadcrumb>
          <BreadcrumbList className="text-gray-500">
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Accueil</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/jobs">Trouvez une offre</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="font-semibold text-gray-700">
                {service.title || "Service sans titre"}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Title and Progress */}
        <div className="flex flex-col md:flex-row items-start justify-between gap-4">
          <h1 className="text-2xl md:text-3xl font-bold text-blue-900">
            {service.title || "Service sans titre"}
          </h1>

          {applied ? (
            <ProgressStepper />
          ) : (
            <div className="flex flex-wrap gap-3">
              <Button
                variant="outline"
                onClick={handleAskQuestion}
                className="bg-transparent text-blue-900 border-blue-900 rounded-full flex items-center gap-2 hover:bg-blue-50"
              >
                <Icon icon="bi:chat" className="w-4 h-4" />
                Poser une question
              </Button>
              <Button
                onClick={handleApply}
                className="bg-blue-900 text-white hover:bg-blue-800 rounded-full flex items-center gap-2"
              >
                <Icon icon="bi:check" className="w-4 h-4" />
                Postuler
              </Button>
            </div>
          )}
        </div>

        {/* Description */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-gray-800">Description</h2>
            <span className="text-sm text-gray-500">
              Posté{" "}
              {service.created_at
                ? formatDate(service.created_at)
                : "récemment"}
            </span>
          </div>
          {service.full_description ? (
            <div
              className="prose prose-sm max-w-none text-gray-600"
              dangerouslySetInnerHTML={{ __html: service.full_description }}
            />
          ) : service.short_description ? (
            <p className="text-gray-600 whitespace-pre-line">
              {service.short_description}
            </p>
          ) : (
            <p className="text-gray-500 italic">Aucune description fournie.</p>
          )}
        </div>

        {/* Project Tracking Section */}
        <div className="relative">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">
              Suivi du Projet & Livraison
            </h2>
            <button
              onClick={handleSave}
              className="w-10 h-10 rounded-full bg-blue-900 text-white flex items-center justify-center hover:bg-blue-800 transition-colors"
              title={isSaved ? "Retirer des favoris" : "Ajouter aux favoris"}
              aria-label={
                isSaved ? "Retirer des favoris" : "Ajouter aux favoris"
              }
            >
              <Icon
                icon={isSaved ? "bx:bxs-bookmark" : "bx:bookmark"}
                className="w-5 h-5"
              />
            </button>
          </div>

          <div className="bg-gray-100 rounded-xl p-5 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-sm text-gray-600 mb-1">Deadline</p>
              <p className="font-medium text-orange-500">
                Livraison attendue le {formatDate(serviceDate)}
                {daysLeft > 0 && (
                  <span className="text-gray-600 text-sm ml-1">
                    (Dans {daysLeft} jour{daysLeft > 1 ? "s" : ""})
                  </span>
                )}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-600 mb-1">
                Nombre d'heures par semaine
              </p>
              <p className="font-medium text-gray-800">
                {service.duration || "Non spécifié"}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-600 mb-1">Durée du projet</p>
              <p className="font-medium text-gray-800">{projectDuration}</p>
            </div>
          </div>
        </div>

        {/* Information Section */}
        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Informations
          </h2>
          <div className="bg-gray-100 rounded-xl p-5 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-sm text-gray-600 mb-1">Niveau requis</p>
              <p className="font-medium text-gray-800">
                {getExperienceLevel(payment)}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-600 mb-1">Localisation</p>
              <p className="font-medium text-gray-800">{location}</p>
            </div>

            <div>
              <p className="text-sm text-gray-600 mb-1">Rémunération</p>
              <p className="font-semibold text-gray-800 text-lg">
                {payment.toLocaleString()} FCFA
              </p>
            </div>
          </div>
        </div>

        {/* Skills Section */}
        {skills.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Compétences requises
            </h2>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill, index) => (
                <span
                  key={index}
                  className="px-4 py-2 bg-blue-900/10 text-blue-900 rounded-full text-sm font-medium"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Client Info Section */}
        {service.client && (
          <div className="border-t border-gray-200 pt-6 mt-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              À propos du client
            </h2>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden">
                {service.client.avatar ? (
                  <img
                    src={service.client.avatar}
                    alt={service.client.name || "Client"}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Icon icon="bi:person" className="w-6 h-6 text-blue-900" />
                )}
              </div>
              <div>
                <p className="font-medium text-gray-900">
                  {service.client.name || service.client.username || "Client"}
                </p>
                {service.client.created_at && (
                  <p className="text-sm text-gray-500">
                    Membre depuis {formatDate(service.client.created_at)}
                  </p>
                )}
                {service.client.rating && (
                  <div className="flex items-center gap-1 mt-1">
                    <span className="text-yellow-500">★</span>
                    <span className="text-sm text-gray-600">
                      {service.client.rating}/5
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Statistiques du client (optionnel) */}
            {(service.client.total_services ||
              service.client.completion_rate) && (
              <div className="grid grid-cols-2 gap-4 mt-4">
                {service.client.total_services && (
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-xs text-gray-500">Services publiés</p>
                    <p className="font-semibold text-gray-900">
                      {service.client.total_services}
                    </p>
                  </div>
                )}
                {service.client.completion_rate && (
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-xs text-gray-500">Taux de complétion</p>
                    <p className="font-semibold text-gray-900">
                      {service.client.completion_rate}%
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Boutons d'action en bas (mobile) */}
        {!applied && (
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 md:hidden z-10">
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={handleAskQuestion}
                className="flex-1 border-blue-900 text-blue-900"
              >
                <Icon icon="bi:chat" className="w-4 h-4 mr-2" />
                Question
              </Button>
              <Button
                onClick={handleApply}
                className="flex-1 bg-blue-900 text-white hover:bg-blue-800"
              >
                <Icon icon="bi:check" className="w-4 h-4 mr-2" />
                Postuler
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Modale de candidature */}
      <Dialog open={isApplyDialogOpen} onOpenChange={setIsApplyDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Postuler à l'offre</DialogTitle>
            <DialogDescription>
              Remplissez les informations ci-dessous pour postuler à ce service.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="price">Prix proposé (FCFA)</Label>
              <Input
                id="price"
                type="number"
                placeholder={service.proposed_amount?.toString()}
                value={proposedPrice || ""}
                onChange={(e) => setProposedPrice(Number(e.target.value))}
              />
              <p className="text-xs text-gray-500">
                Laissez vide pour proposer le prix indiqué
              </p>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="coverLetter">Lettre de motivation</Label>
              <Textarea
                id="coverLetter"
                placeholder="Expliquez pourquoi vous êtes le candidat idéal..."
                rows={5}
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsApplyDialogOpen(false)}
            >
              Annuler
            </Button>
            <Button
              onClick={handleSubmitApplication}
              disabled={isApplying}
              className="bg-blue-900 hover:bg-blue-800"
            >
              {isApplying ? "Envoi..." : "Envoyer la candidature"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modale de question */}
      <Dialog
        open={isQuestionDialogOpen}
        onOpenChange={setIsQuestionDialogOpen}
      >
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Poser une question</DialogTitle>
            <DialogDescription>
              Vous avez une question sur ce service ? Posez-la au client.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="question">Votre question</Label>
              <Textarea
                id="question"
                placeholder="Écrivez votre question ici..."
                rows={5}
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsQuestionDialogOpen(false)}
            >
              Annuler
            </Button>
            <Button
              onClick={handleSubmitQuestion}
              disabled={!question.trim()}
              className="bg-blue-900 hover:bg-blue-800"
            >
              Envoyer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
