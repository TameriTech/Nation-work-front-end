"use client";
import ProgressStepper from "@/app/components/features/job-detail/ProgressStepper";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/app/components/ui/breadcrumb";
import { Icon } from "@iconify/react";
import { Button } from "@/app/components/ui/button";
import { Service } from "@/app/types/services";
import { formatDate } from "@/app/lib/utils";

interface JobDetailContentProps {
  applied?: boolean;
  service: Service;
  onApply?: () => void;
  onAskQuestion?: () => void;
  onSave?: () => void;
  isSaved?: boolean;
}

const JobDetailContent = ({
  applied = false,
  service,
  onApply,
  onAskQuestion,
  onSave,
  isSaved = false,
}: JobDetailContentProps) => {
  // Calculer les jours restants
  const calculateDaysLeft = (dateString: string) => {
    const targetDate = new Date(dateString);
    const today = new Date();
    const diffTime = targetDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  // Calculer la durée du projet
  const calculateProjectDuration = (dateString: string) => {
    const targetDate = new Date(dateString);
    const today = new Date();
    const diffTime = targetDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 7) return "Moins d'une semaine";
    if (diffDays < 30) return "Moins d'un mois";
    if (diffDays < 90) return "1-3 mois";
    return "Plus de 3 mois";
  };

  const daysLeft = calculateDaysLeft(service.date_pratique);
  const projectDuration = calculateProjectDuration(service.date_pratique);

  // Niveau d'expérience (à adapter selon votre logique métier)
  const getExperienceLevel = (amount?: number) => {
    if (!amount) return "Non spécifié";
    if (amount < 50000) return "Débutant";
    if (amount < 100000) return "Intermédiaire";
    if (amount < 200000) return "Confirmé";
    return "Expert";
  };

  // Compétences (utiliser required_skills ou un fallback)
  const skills = service.required_skills || [
    "compétence 1",
    "compétence 2",
    "compétence 3",
    "compétence N",
  ];

  return (
    <div className="w-full space-y-6">
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
              {service.title}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Title and Progress */}
      <div className="flex flex-col md:flex-row items-start justify-between gap-4">
        <h1 className="text-2xl md:text-3xl font-bold text-blue-900">
          {service.title}
        </h1>

        {applied ? (
          <ProgressStepper />
        ) : (
          <div className="flex flex-wrap gap-3">
            <Button
              variant="outline"
              onClick={onAskQuestion}
              className="bg-transparent text-blue-900 border-blue-900 rounded-full flex items-center gap-2 hover:bg-blue-50"
            >
              <Icon icon="bi:chat" className="w-4 h-4" />
              Poser une question
            </Button>
            <Button
              onClick={onApply}
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
            Posté {formatDate(service.created_at)}
          </span>
        </div>
        {service.full_description ? (
          <div
            className="prose prose-sm max-w-none text-gray-600"
            dangerouslySetInnerHTML={{ __html: service.full_description }}
          />
        ) : (
          <p className="text-gray-500 italic">
            Aucune description détaillée fournie.
          </p>
        )}
      </div>

      {/* Project Tracking Section */}
      <div className="relative">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800">
            Suivi du Projet & Livraison
          </h2>
          <button
            onClick={onSave}
            className="w-10 h-10 rounded-full bg-blue-900 text-white flex items-center justify-center hover:bg-blue-800 transition-colors"
            title={isSaved ? "Retirer des favoris" : "Ajouter aux favoris"}
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
              Livraison attendue le {formatDate(service.date_pratique)}
              {daysLeft > 0 &&
                ` (Dans ${daysLeft} jour${daysLeft > 1 ? "s" : ""})`}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-600 mb-1">
              Nombre d'heures par semaine
            </p>
            <p className="font-medium text-gray-800">
              {service.date_pratique || "Moins de 35h"}
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
              {getExperienceLevel(service.proposed_amount)}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-600 mb-1">Localisation</p>
            <p className="font-medium text-gray-800">
              {service.city}, {service.country}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-600 mb-1">Rémunération</p>
            <p className="font-semibold text-gray-800 text-lg">
              {service.proposed_amount?.toLocaleString()} FCFA
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

      {/* Client Info Section (optionnel) */}
      {service.client && (
        <div className="border-t border-gray-200 pt-6 mt-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            À propos du client
          </h2>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
              <Icon icon="bi:person" className="w-6 h-6 text-blue-900" />
            </div>
            <div>
              <p className="font-medium text-gray-900">
                {service.client.username || "Client"}
              </p>
              <p className="text-sm text-gray-500">
                Membre depuis{" "}
                {formatDate(
                  service.client.created_at || new Date().toISOString(),
                )}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobDetailContent;
