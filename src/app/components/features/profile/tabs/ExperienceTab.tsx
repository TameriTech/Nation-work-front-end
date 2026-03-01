"use client";
import { Button } from "@/app/components/ui/button";
import { Icon } from "@iconify/react";
import { useState } from "react";
import {
  CreateEducationDto,
  CreateExperienceDto,
  Education,
  ProfessionalExperience,
  UpdateEducationDto,
  UpdateExperienceDto,
} from "@/app/types/user";
import { AddEducationModal } from "@/app/components/features/profile/modals/AddEducationModal";
import { AddExperienceModal } from "@/app/components/features/profile/modals/AddExperienceModal";
import { toast } from "@/app/hooks/use-toast";
import {
  addEducation,
  addExperience,
  deleteEducation,
  deleteExperience,
  updateEducation,
  updateExperience,
} from "@/app/services/users.service";
import { useFreelancerProfile } from "@/app/hooks/use-freelancer-profile";

function SectionHeader({
  icon,
  title,
  onAdd,
}: {
  icon: React.ReactNode;
  title: string;
  onAdd: () => void;
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
        className="rounded-full bg-blue-900 hover:bg-blue-900/90 text-white px-5 h-10 gap-2"
      >
        <Icon icon={"bi:plus"} className="w-4 h-4" />
        <span className="">Ajouter</span>
      </Button>
    </div>
  );
}

export function ExperienceTabContent() {
  const {
    experiences,
    educations,
    addExperience,
    updateExperience,
    deleteExperience,
    addEducation,
    updateEducation,
    deleteEducation,
    loading,
  } = useFreelancerProfile();
  const [education, setEducation] = useState<Education | null>(null);
  const [experience, setExperience] = useState<ProfessionalExperience | null>(
    null,
  );
  const [showAddExperienceModal, setShowAddExperienceModal] = useState(false);
  const [showAddEducationModal, setShowAddEducationModal] = useState(false);

  const handleSubmitExperience = async (data: CreateExperienceDto) => {
    try {
      if (experience) {
        await updateExperience(experience.id, data);
        toast({
          title: "Succès",
          description: "L'expérience a été mise à jour avec succès.",
          variant: "default",
        });
      } else {
        await addExperience(data);
        toast({
          title: "Succès",
          description: "L'expérience a été ajoutée avec succès.",
          variant: "default",
        });
      }
    } catch (error) {
      console.error("Error adding experience:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'ajout de l'expérience.",
        variant: "destructive",
      });
    }
  };

  const handleSubmitEducation = async (data: CreateEducationDto) => {
    try {
      const response = await addEducation(data);
      console.log("Education added successfully:", response);
      // fetch experiences
      toast({
        title: "Succès",
        description: "L'education a été ajoutée avec succès.",
        variant: "default",
      });
    } catch (error) {
      console.error("Error adding education:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'ajout de l'education.",
        variant: "destructive",
      });
    }
  };

  const handleEditExperience = (item: ProfessionalExperience) => {
    setExperience(item);
    setShowAddExperienceModal(true);
  };

  const handleEditEducation = (item: Education) => {
    setEducation(item);
    setShowAddEducationModal(true);
  };

  const handleEducationDelete = async (id: number) => {
    if (confirm(`Supprimer définitivement cette education ?`)) {
      try {
        await deleteEducation(id);
        toast({
          title: "Succès",
          description: "L'education a été supprimée avec succès.",
          variant: "default",
        });
      } catch (error) {
        console.error("Error deleting education:", error);
        toast({
          title: "Erreur",
          description:
            "Une erreur est survenue lors de la suppression de l'education.",
          variant: "destructive",
        });
      }
    }
  };

  const handleExperienceDelete = async (id: number) => {
    if (confirm(`Supprimer définitivement cette experience ?`)) {
      try {
        await deleteExperience(id);
        toast({
          title: "Succès",
          description: "L'expérience a été supprimée avec succès.",
          variant: "default",
        });
      } catch (error) {
        console.error("Error deleting experience:", error);
        toast({
          title: "Erreur",
          description:
            "Une erreur est survenue lors de la suppression de l'expérience.",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Experience Section */}
      <div className="rounded-3xl bg-white shadow-lg p-8">
        <SectionHeader
          icon={<Icon icon={"bi:briefcase"} className="w-5 h-5 text-primary" />}
          title="Expérience Professionnelle"
          onAdd={() => setShowAddExperienceModal(true)}
        />

        <div>
          {experiences.map((item, index) => (
            <div
              className={`py-5 ${!item.is_current ? "border-b border-gray-200" : ""}`}
            >
              <div className="flex items-start gap-4">
                <div
                  className={`w-12 h-12 rounded-xl ${item.icon_bg} flex items-center justify-center shrink-0`}
                >
                  <Icon icon="bi:briefcase" className="w-6 h-6 text-blue-900" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div>
                      <h4 className="font-semibold text-gray-800">
                        {item.position}
                      </h4>
                      <p className="text-sm text-gray-500 italic">
                        {item.company}
                      </p>
                    </div>

                    <div className="flex items-center gap-4 shrink-0">
                      <span className="text-sm hidden md:inline text-gray-500 whitespace-nowrap">
                        debut_{item.start_date} – fin_{item.end_date}
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEditExperience(item)}
                          className="p-1.5 hover:bg-muted rounded-lg transition-colors"
                        >
                          <Icon
                            icon={"bx:bx-edit-alt"}
                            className="w-4 h-4 text-blue-900"
                          />
                        </button>
                        <button
                          onClick={() => handleExperienceDelete(item.id)}
                          className="p-1.5 hover:bg-muted rounded-lg transition-colors"
                        >
                          <Icon
                            icon={"bi:trash"}
                            className="w-4 h-4 text-red-600"
                          />
                        </button>
                      </div>
                    </div>
                  </div>

                  <p className="text-sm hidden sm:block text-gray-500 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
              <p className="text-sm block sm:hidden text-gray-500 leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>

        <AddExperienceModal
          isOpen={showAddExperienceModal}
          initialData={experience || undefined}
          onSave={handleSubmitExperience}
          onClose={() => setShowAddExperienceModal(false)}
        />
      </div>

      {/* Education Section */}
      <div className="rounded-3xl bg-white shadow-lg p-8">
        <SectionHeader
          icon={
            <Icon
              icon={"bi:mortarboard-fill"}
              className="w-5 h-5 text-primary"
            />
          }
          title="Education"
          onAdd={() => setShowAddEducationModal(true)}
        />

        <AddEducationModal
          isOpen={showAddEducationModal}
          initialData={education || undefined}
          onSave={handleSubmitEducation}
          onClose={() => setShowAddEducationModal(false)}
        />

        <div>
          {educations.map((item, index) => (
            <div
              className={`py-5 ${index !== educations.length - 1 ? "border-b border-border/40" : ""}`}
            >
              <div className="flex items-start gap-4">
                <div
                  className={`w-12 h-12 rounded-xl ${item.icon_bg} flex items-center justify-center shrink-0`}
                >
                  <Icon icon={item.icon} className="w-6 h-6 text-blue-900" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h4 className="font-semibold text-foreground">
                        {item.school}
                      </h4>
                      <p className="text-sm text-slate-400 italic">
                        {item.field_of_study}
                      </p>
                      <p className="text-xs hidden lg:inline text-slate-400 mt-0.5">
                        debut_{item.start_date} - fin_{item.end_date}
                      </p>
                    </div>

                    <div className="flex items-start gap-4">
                      <p className="text-sm hidden md:block text-slate-400 leading-relaxed max-w-md">
                        {item.description}
                      </p>
                      <div className="items-center gap-2 shrink-0">
                        <button
                          onClick={() => handleEditEducation(item)}
                          className="p-1.5 hover:bg-muted rounded-lg transition-colors"
                        >
                          <Icon
                            icon={"bx:bx-edit-alt"}
                            className="w-4 h-4 text-blue-900"
                          />
                        </button>
                        <button
                          onClick={() => handleEducationDelete(item.id)}
                          className="p-1.5 hover:bg-muted rounded-lg transition-colors"
                        >
                          <Icon
                            icon={"bi:trash"}
                            className="w-4 h-4 text-red-600"
                          />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <p className="text-sm block md:hidden text-slate-400 leading-relaxed max-w-md">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
