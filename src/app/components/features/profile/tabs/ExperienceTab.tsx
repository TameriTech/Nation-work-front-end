"use client";
import { Button } from "@/app/components/ui/button";
import { Icon } from "@iconify/react";
import { useState } from "react";
import { Education, ProfessionalExperience } from "@/app/types/user";
import {
  CreateExperienceFormData,
  UpdateExperienceFormData,
  CreateEducationFormData,
  UpdateEducationFormData,
} from "@/app/lib/validators/experience.validator";
import { AddEducationModal } from "@/app/components/features/profile/modals/AddEducationModal";
import { AddExperienceModal } from "@/app/components/features/profile/modals/AddExperienceModal";
import { useExperiences } from "@/app/hooks/profile/use-experience";
import { useEducation } from "@/app/hooks/profile/use-education";
import { ExperienceSkeleton } from "./loading";
import ExperienceError from "./error";

function SectionHeader({
  icon,
  title,
  onAdd,
  disabled = false,
}: {
  icon: React.ReactNode;
  title: string;
  onAdd: () => void;
  disabled?: boolean;
}) {
  return (
    <div className="flex flex-wrap gap-4 items-center justify-between mb-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl text-blue-900 bg-blue-900/10 flex items-center justify-center">
          {icon}
        </div>
        <h3 className="text-xl font-semibold text-blue-900">{title}</h3>
      </div>
      <Button
        onClick={onAdd}
        disabled={disabled}
        className="rounded-full bg-blue-900 hover:bg-blue-900/90 text-white px-5 h-10 gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Icon icon="bi:plus" className="w-4 h-4" />
        <span>Ajouter</span>
      </Button>
    </div>
  );
}

function ExperienceItem({
  item,
  onEdit,
  onDelete,
}: {
  item: ProfessionalExperience;
  onEdit: (item: ProfessionalExperience) => void;
  onDelete: (id: number) => void;
}) {
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("fr-FR", {
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <div className="py-5 border-b border-gray-200 last:border-0">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center shrink-0">
          <Icon icon="bi:briefcase" className="w-6 h-6 text-blue-900" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4 mb-2">
            <div>
              <h4 className="font-semibold text-gray-800">{item.position}</h4>
              <p className="text-sm text-gray-500 italic">{item.company}</p>
              {item.location && (
                <p className="text-xs text-gray-400 flex items-center gap-1 mt-1">
                  <Icon icon="bi:geo-alt" className="w-3 h-3" />
                  {item.location}
                </p>
              )}
            </div>

            <div className="flex items-center gap-4 shrink-0">
              <span className="text-sm hidden md:inline text-gray-500 whitespace-nowrap">
                {formatDate(item.start_date)} –{" "}
                {item.is_current ? "Présent" : formatDate(item.end_date!)}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onEdit(item)}
                  className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Modifier"
                >
                  <Icon
                    icon="bx:bx-edit-alt"
                    className="w-4 h-4 text-blue-900"
                  />
                </button>
                <button
                  onClick={() => onDelete(item.id)}
                  className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Supprimer"
                >
                  <Icon icon="bi:trash" className="w-4 h-4 text-red-600" />
                </button>
              </div>
            </div>
          </div>

          {item.description && (
            <p className="text-sm text-gray-500 leading-relaxed mt-2">
              {item.description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function EducationItem({
  item,
  onEdit,
  onDelete,
}: {
  item: Education;
  onEdit: (item: Education) => void;
  onDelete: (id: number) => void;
}) {
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("fr-FR", {
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <div className="py-5 border-b border-gray-200 last:border-0">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-cyan-100 flex items-center justify-center shrink-0">
          <Icon icon="bi:mortarboard-fill" className="w-6 h-6 text-cyan-600" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h4 className="font-semibold text-gray-800">{item.school}</h4>
              {item.degree && (
                <p className="text-sm text-gray-500 italic">{item.degree}</p>
              )}
              {item.field_of_study && (
                <p className="text-xs text-gray-400">{item.field_of_study}</p>
              )}
              <p className="text-xs text-gray-400 mt-1">
                {formatDate(item.start_date)} –{" "}
                {item.is_current ? "En cours" : formatDate(item.end_date!)}
              </p>
              {item.grade && (
                <p className="text-xs text-gray-400 mt-1">
                  Mention: {item.grade}
                </p>
              )}
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => onEdit(item)}
                className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                title="Modifier"
              >
                <Icon icon="bx:bx-edit-alt" className="w-4 h-4 text-blue-900" />
              </button>
              <button
                onClick={() => onDelete(item.id)}
                className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                title="Supprimer"
              >
                <Icon icon="bi:trash" className="w-4 h-4 text-red-600" />
              </button>
            </div>
          </div>

          {item.description && (
            <p className="text-sm text-gray-500 leading-relaxed mt-2">
              {item.description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export function ExperienceTabContent() {
  const {
    experiences,
    addExperience,
    updateExperience,
    deleteExperience,
    isLoading: experienceLoading,
    isAdding: isAddingExperience,
    isDeleting: isDeletingExperience,
    isUpdating: isUpdatingExperience,
    error: experienceError,
    refetch: refetchExperiences,
  } = useExperiences();

  const {
    education: educations,
    addEducation,
    updateEducation,
    deleteEducation,
    isLoading: educationLoading,
    error: educationError,
    refetch: refetchEducation,
  } = useEducation();

  const [selectedExperience, setSelectedExperience] =
    useState<ProfessionalExperience | null>(null);
  const [selectedEducation, setSelectedEducation] = useState<Education | null>(
    null,
  );
  const [showAddExperienceModal, setShowAddExperienceModal] = useState(false);
  const [showAddEducationModal, setShowAddEducationModal] = useState(false);

  // Gestionnaires d'expérience
  const handleSubmitExperience = async (
    data: CreateExperienceFormData | UpdateExperienceFormData,
  ) => {
    try {
      if (selectedExperience) {
        await updateExperience({
          id: selectedExperience.id,
          data: data as UpdateExperienceFormData,
        });
      } else {
        await addExperience(data as CreateExperienceFormData);
      }
      setShowAddExperienceModal(false);
      setSelectedExperience(null);
    } catch (error) {
      console.error("Error submitting experience:", error);
    }
  };

  const handleEditExperience = (item: ProfessionalExperience) => {
    setSelectedExperience(item);
    setShowAddExperienceModal(true);
  };

  const handleDeleteExperience = async (id: number) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cette expérience ?")) {
      await deleteExperience(id);
    }
  };

  // Gestionnaires d'éducation
  const handleSubmitEducation = async (
    data: CreateEducationFormData | UpdateEducationFormData,
  ) => {
    try {
      if (selectedEducation) {
        await updateEducation({
          id: selectedEducation.id,
          data: data as UpdateEducationFormData,
        });
      } else {
        await addEducation(data as CreateEducationFormData);
      }
      setShowAddEducationModal(false);
      setSelectedEducation(null);
    } catch (error) {
      console.error("Error submitting education:", error);
    }
  };

  const handleEditEducation = (item: Education) => {
    setSelectedEducation(item);
    setShowAddEducationModal(true);
  };

  const handleDeleteEducation = async (id: number) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cette formation ?")) {
      await deleteEducation(id);
    }
  };

  // Gestion des erreurs
  if (experienceError || educationError) {
    return (
      <ExperienceError
        error={experienceError || educationError}
        onRetry={() => {
          refetchExperiences();
          refetchEducation();
        }}
      />
    );
  }

  // États de chargement
  if (experienceLoading || educationLoading) {
    return <ExperienceSkeleton />;
  }

  return (
    <div className="space-y-6">
      {/* Section Expérience */}
      <div className="rounded-3xl bg-white shadow-lg p-8">
        <SectionHeader
          icon={<Icon icon="bi:briefcase" className="w-5 h-5 text-primary" />}
          title="Expérience Professionnelle"
          onAdd={() => {
            setSelectedExperience(null);
            setShowAddExperienceModal(true);
          }}
          disabled={isAddingExperience || isUpdatingExperience}
        />

        <div>
          {experiences.length === 0 ? (
            <p className="text-center text-gray-500 py-8">
              Aucune expérience ajoutée. Cliquez sur "Ajouter" pour commencer.
            </p>
          ) : (
            experiences.map((item) => (
              <ExperienceItem
                key={item.id}
                item={item}
                onEdit={handleEditExperience}
                onDelete={handleDeleteExperience}
              />
            ))
          )}
        </div>

        <AddExperienceModal
          isOpen={showAddExperienceModal}
          initialData={selectedExperience || undefined}
          onSave={handleSubmitExperience}
          onClose={() => {
            setShowAddExperienceModal(false);
            setSelectedExperience(null);
          }}
          isLoading={isAddingExperience || isUpdatingExperience}
        />
      </div>

      {/* Section Éducation */}
      <div className="rounded-3xl bg-white shadow-lg p-8">
        <SectionHeader
          icon={
            <Icon icon="bi:mortarboard-fill" className="w-5 h-5 text-primary" />
          }
          title="Formation"
          onAdd={() => {
            setSelectedEducation(null);
            setShowAddEducationModal(true);
          }}
          disabled={educationLoading}
        />

        <div>
          {educations.length === 0 ? (
            <p className="text-center text-gray-500 py-8">
              Aucune formation ajoutée. Cliquez sur "Ajouter" pour commencer.
            </p>
          ) : (
            educations.map((item) => (
              <EducationItem
                key={item.id}
                item={item}
                onEdit={handleEditEducation}
                onDelete={handleDeleteEducation}
              />
            ))
          )}
        </div>

        <AddEducationModal
          isOpen={showAddEducationModal}
          initialData={selectedEducation || undefined}
          onSave={handleSubmitEducation}
          onClose={() => {
            setShowAddEducationModal(false);
            setSelectedEducation(null);
          }}
          isLoading={educationLoading}
        />
      </div>
    </div>
  );
}
