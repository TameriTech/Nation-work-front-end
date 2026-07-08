// app/(dashboard)/provider/profile/experience/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Icon } from "@iconify/react";
import { Button } from "@/app/components/ui/button";
import { Card } from "@/app/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/app/components/ui/dialog";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Textarea } from "@/app/components/ui/textarea";
import { Checkbox } from "@/app/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import { useExperiences } from "@/app/hooks/provider-profile/use-experience";
import { useEducation } from "@/app/hooks/provider-profile/use-education";
import type { ProfessionalExperienceOut } from "@/app/types";
import { EmploymentType } from "@/app/types/enums";

// Schéma de validation pour l'expérience
const SimpleExperienceSchema = z.object({
  position: z.string().min(1, "Le poste est requis"),
  company: z.string().min(1, "L'entreprise est requise"),
  description: z.string().optional(),
  start_date: z.string().min(1, "La date de début est requise"),
  end_date: z.string().optional(),
  is_current: z.boolean().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
  employment_type: z.nativeEnum(EmploymentType).default(EmploymentType.FULL_TIME),
});

// Schéma de validation pour l'éducation
const EducationSchema = z.object({
  school: z.string().min(1, "L'établissement est requis"),
  degree: z.string().optional(),
  field_of_study: z.string().optional(),
  start_date: z.string().min(1, "La date de début est requise"),
  end_date: z.string().optional(),
  description: z.string().optional(),
  is_current: z.boolean().optional(),
});

type SimpleExperienceFormData = z.infer<typeof SimpleExperienceSchema>;
type EducationFormData = z.infer<typeof EducationSchema>;

// Helper pour formater les dates
const formatDate = (dateString?: string) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("fr-FR", { year: 'numeric', month: 'long' });
};

// Helper pour obtenir le libellé du type d'emploi
const getEmploymentTypeLabel = (type: EmploymentType) => {
  const labels = {
    [EmploymentType.FULL_TIME]: "Temps plein",
    [EmploymentType.PART_TIME]: "Temps partiel",
    [EmploymentType.FREELANCE]: "Freelance",
    [EmploymentType.INTERNSHIP]: "Stage",
    [EmploymentType.CONTRACT]: "CDD",
  };
  return labels[type] || type;
};

// Helper pour préparer les valeurs par défaut de l'expérience
const getDefaultExperienceValues = (data?: ProfessionalExperienceOut): SimpleExperienceFormData => {
  if (!data) {
    return {
      position: "",
      company: "",
      description: "",
      start_date: "",
      end_date: "",
      is_current: false,
      city: "",
      country: "",
      employment_type: EmploymentType.FULL_TIME,
    };
  }

  return {
    position: data.position,
    company: data.company,
    description: data.description || "",
    start_date: data.start_date ? data.start_date.split("T")[0] : "",
    end_date: data.end_date ? data.end_date.split("T")[0] : "",
    is_current: data.is_current,
    city: data.city || "",
    country: data.country || "",
    employment_type: data.employment_type || EmploymentType.FULL_TIME,
  };
};

// Helper pour préparer les valeurs par défaut de l'éducation
const getDefaultEducationValues = (data?: any): EducationFormData => {
  if (!data) {
    return {
      school: "",
      degree: "",
      field_of_study: "",
      start_date: "",
      end_date: "",
      description: "",
      is_current: false,
    };
  }

  return {
    school: data.school,
    degree: data.degree || "",
    field_of_study: data.field_of_study || "",
    start_date: data.start_date ? data.start_date.split("T")[0] : "",
    end_date: data.end_date ? data.end_date.split("T")[0] : "",
    description: data.description || "",
    is_current: data.is_current,
  };
};

export default function ExperiencePage() {
  const router = useRouter();
  const [experienceModalOpen, setExperienceModalOpen] = useState(false);
  const [educationModalOpen, setEducationModalOpen] = useState(false);
  const [editingExperience, setEditingExperience] = useState<ProfessionalExperienceOut | null>(null);
  const [editingEducation, setEditingEducation] = useState<any>(null);
  
  const { experiences, addExperience, updateExperience, deleteExperience, isLoading } = useExperiences();
  const { education, addEducation, updateEducation, deleteEducation, isLoading: eduLoading } = useEducation();

  // Form pour l'expérience
  const {
    register: registerExperience,
    handleSubmit: handleSubmitExperience,
    watch: watchExperience,
    setValue: setValueExperience,
    formState: { errors: experienceErrors, isSubmitting: isExperienceSubmitting },
    reset: resetExperience,
  } = useForm<SimpleExperienceFormData>({
    resolver: zodResolver(SimpleExperienceSchema),
    defaultValues: getDefaultExperienceValues(editingExperience || undefined),
  });

  // Form pour l'éducation
  const {
    register: registerEducation,
    handleSubmit: handleSubmitEducation,
    watch: watchEducation,
    setValue: setValueEducation,
    formState: { errors: educationErrors, isSubmitting: isEducationSubmitting },
    reset: resetEducation,
  } = useForm<EducationFormData>({
    resolver: zodResolver(EducationSchema),
    defaultValues: getDefaultEducationValues(editingEducation || undefined),
  });

  // Mettre à jour le formulaire d'expérience quand editingExperience change
  useEffect(() => {
    if (experienceModalOpen) {
      resetExperience(getDefaultExperienceValues(editingExperience || undefined));
    }
  }, [editingExperience, experienceModalOpen, resetExperience]);

  // Mettre à jour le formulaire d'éducation quand editingEducation change
  useEffect(() => {
    if (educationModalOpen) {
      resetEducation(getDefaultEducationValues(editingEducation || undefined));
    }
  }, [editingEducation, educationModalOpen, resetEducation]);

  const isCurrentExperience = watchExperience("is_current");
  const isCurrentEducation = watchEducation("is_current");

  const handleDeleteExperience = async (id: number) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cette expérience ?")) {
      await deleteExperience(id);
    }
  };

  const handleDeleteEducation = async (id: number) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cette formation ?")) {
      await deleteEducation(id);
    }
  };

  const handleSaveExperience = async (data: SimpleExperienceFormData) => {
    if (editingExperience) {
      await updateExperience({ id: editingExperience.id, data });
    } else {
      await addExperience(data);
    }
    setExperienceModalOpen(false);
    setEditingExperience(null);
    resetExperience();
  };

  const handleSaveEducation = async (data: EducationFormData) => {
    // Les données sont déjà dans le bon format pour le backend
    if (editingEducation) {
      await updateEducation({ id: editingEducation.id, data });
    } else {
      await addEducation(data);
    }
    setEducationModalOpen(false);
    setEditingEducation(null);
    resetEducation();
  };

  const handleCloseExperienceModal = () => {
    setExperienceModalOpen(false);
    setEditingExperience(null);
    resetExperience();
  };

  const handleCloseEducationModal = () => {
    setEducationModalOpen(false);
    setEditingEducation(null);
    resetEducation();
  };

  if (isLoading || eduLoading) {
    return (
      <div className="min-h-screen bg-background dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-text-secondary">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-16">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button 
            onClick={() => router.back()} 
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
          >
            <Icon icon="ph:arrow-left" className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              Expérience & Formation
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Gérez votre parcours professionnel et académique
            </p>
          </div>
        </div>

        {/* Section Expérience */}
        <Card className="rounded-2xl p-6 mb-6 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Icon icon="ph:briefcase" className="w-5 h-5 text-primary" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Expérience professionnelle
              </h2>
              <span className="text-sm text-gray-500">
                ({experiences?.length || 0})
              </span>
            </div>
            <Button 
              onClick={() => {
                setEditingExperience(null);
                setExperienceModalOpen(true);
              }} 
              className="rounded-full"
            >
              <Icon icon="ph:plus" className="w-4 h-4 mr-2" /> 
              Ajouter
            </Button>
          </div>

          {experiences?.length === 0 ? (
            <div className="text-center py-12">
              <Icon icon="ph:briefcase" className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">
                Aucune expérience ajoutée
              </p>
              <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                Cliquez sur "Ajouter" pour commencer
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {experiences?.map((exp: ProfessionalExperienceOut) => (
                <div 
                  key={exp.id} 
                  className="relative pl-6 pb-6 last:pb-0 border-l-2 border-gray-200 dark:border-gray-700"
                >
                  <div className="absolute left-[-9px] top-0 w-4 h-4 rounded-full bg-primary ring-4 ring-white dark:ring-gray-900"></div>
                  
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                        {exp.position}
                      </h3>
                      <p className="text-gray-700 dark:text-gray-300 font-medium mt-1">
                        {exp.company}
                      </p>
                      
                      <div className="flex flex-wrap gap-3 mt-2">
                        <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                          <Icon icon="ph:calendar" className="w-4 h-4" />
                          <span>
                            {formatDate(exp.start_date)} -{" "}
                            {exp.is_current 
                              ? "Présent" 
                              : formatDate(exp.end_date) || "Date non spécifiée"
                            }
                          </span>
                        </div>
                        
                        {exp.employment_type && (
                          <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                            <Icon icon="ph:briefcase" className="w-4 h-4" />
                            <span>{getEmploymentTypeLabel(exp.employment_type)}</span>
                          </div>
                        )}
                        
                        {(exp.city || exp.country) && (
                          <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                            <Icon icon="ph:map-pin" className="w-4 h-4" />
                            <span>
                              {[exp.city, exp.country].filter(Boolean).join(", ")}
                            </span>
                          </div>
                        )}
                      </div>
                      
                      {exp.description && (
                        <div className="mt-3">
                          <p className="text-gray-600 dark:text-gray-400 text-sm whitespace-pre-wrap">
                            {exp.description}
                          </p>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex gap-1">
                      <button 
                        onClick={() => {
                          setEditingExperience(exp);
                          setExperienceModalOpen(true);
                        }} 
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                        aria-label="Modifier"
                      >
                        <Icon icon="ph:pencil" className="w-4 h-4 text-gray-500" />
                      </button>
                      <button 
                        onClick={() => handleDeleteExperience(exp.id)} 
                        className="p-2 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        aria-label="Supprimer"
                      >
                        <Icon icon="ph:trash" className="w-4 h-4 text-red-500" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Section Formation */}
        <Card className="rounded-2xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Icon icon="ph:graduation-cap" className="w-5 h-5 text-primary" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Formation
              </h2>
              <span className="text-sm text-gray-500">
                ({education?.length || 0})
              </span>
            </div>
            <Button 
              onClick={() => {
                setEditingEducation(null);
                setEducationModalOpen(true);
              }} 
              className="rounded-full"
            >
              <Icon icon="ph:plus" className="w-4 h-4 mr-2" /> 
              Ajouter
            </Button>
          </div>

          {education?.length === 0 ? (
            <div className="text-center py-12">
              <Icon icon="ph:graduation-cap" className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">
                Aucune formation ajoutée
              </p>
              <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                Cliquez sur "Ajouter" pour commencer
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {education?.map((edu: any) => (
                <div 
                  key={edu.id} 
                  className="relative pl-6 pb-6 last:pb-0 border-l-2 border-gray-200 dark:border-gray-700"
                >
                  <div className="absolute left-[-9px] top-0 w-4 h-4 rounded-full bg-green-500 ring-4 ring-white dark:ring-gray-900"></div>
                  
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                        {edu.school}
                      </h3>
                      {(edu.degree || edu.field_of_study) && (
                        <p className="text-gray-700 dark:text-gray-300 mt-1">
                          {[edu.degree, edu.field_of_study].filter(Boolean).join(" - ")}
                        </p>
                      )}
                      
                      <div className="flex items-center gap-1 mt-2 text-sm text-gray-500 dark:text-gray-400">
                        <Icon icon="ph:calendar" className="w-4 h-4" />
                        <span>
                          {formatDate(edu.start_date)} -{" "}
                          {edu.is_current ? "En cours" : formatDate(edu.end_date)}
                        </span>
                      </div>
                      
                      {edu.description && (
                        <div className="mt-3">
                          <p className="text-gray-600 dark:text-gray-400 text-sm whitespace-pre-wrap">
                            {edu.description}
                          </p>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex gap-1">
                      <button 
                        onClick={() => {
                          setEditingEducation(edu);
                          setEducationModalOpen(true);
                        }} 
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                        aria-label="Modifier"
                      >
                        <Icon icon="ph:pencil" className="w-4 h-4 text-gray-500" />
                      </button>
                      <button 
                        onClick={() => handleDeleteEducation(edu.id)} 
                        className="p-2 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        aria-label="Supprimer"
                      >
                        <Icon icon="ph:trash" className="w-4 h-4 text-red-500" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        <div className="mt-6 flex justify-end">
          <Button 
            variant="outline" 
            onClick={() => router.push("/dashboard/provider/profile")} 
            className="rounded-full"
          >
            <Icon icon="ph:arrow-left" className="w-4 h-4 mr-2" />
            Retour au profil
          </Button>
        </div>
      </div>

      {/* Modal Expérience */}
      <Dialog open={experienceModalOpen} onOpenChange={handleCloseExperienceModal}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingExperience ? "Modifier" : "Ajouter"} une expérience professionnelle
            </DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmitExperience(handleSaveExperience)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="position">
                  Poste occupé <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="position"
                  {...registerExperience("position")}
                  placeholder="Ex: Développeur Full Stack"
                />
                {experienceErrors.position && (
                  <p className="text-sm text-red-500">{experienceErrors.position.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="company">
                  Entreprise <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="company"
                  {...registerExperience("company")}
                  placeholder="Ex: Tech Solutions SARL"
                />
                {experienceErrors.company && (
                  <p className="text-sm text-red-500">{experienceErrors.company.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="country">Pays</Label>
                <Input
                  id="country"
                  {...registerExperience("country")}
                  placeholder="Ex: Cameroun"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="city">Ville</Label>
                <Input
                  id="city"
                  {...registerExperience("city")}
                  placeholder="Ex: Douala"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="employment_type">Type d'emploi</Label>
              <Select
                value={watchExperience("employment_type")}
                onValueChange={(value) => 
                  setValueExperience("employment_type", value as EmploymentType)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez le type d'emploi" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={EmploymentType.FULL_TIME}>Temps plein</SelectItem>
                  <SelectItem value={EmploymentType.PART_TIME}>Temps partiel</SelectItem>
                  <SelectItem value={EmploymentType.FREELANCE}>Freelance / Indépendant</SelectItem>
                  <SelectItem value={EmploymentType.INTERNSHIP}>Stage</SelectItem>
                  <SelectItem value={EmploymentType.CONTRACT}>CDD / Contrat</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="start_date">
                  Date de début <span className="text-red-500">*</span>
                </Label>
                <Input 
                  id="start_date" 
                  type="date" 
                  {...registerExperience("start_date")} 
                />
                {experienceErrors.start_date && (
                  <p className="text-sm text-red-500">{experienceErrors.start_date.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="end_date">Date de fin</Label>
                <Input
                  id="end_date"
                  type="date"
                  {...registerExperience("end_date")}
                  disabled={isCurrentExperience}
                  className={isCurrentExperience ? "bg-gray-100 cursor-not-allowed" : ""}
                />
                {!isCurrentExperience && !watchExperience("end_date") && watchExperience("start_date") && (
                  <p className="text-sm text-amber-600">
                    ⚠️ Vous n'êtes plus en poste, veuillez indiquer une date de fin
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="is_current"
                checked={isCurrentExperience}
                onCheckedChange={(checked) => {
                  setValueExperience("is_current", checked as boolean);
                  if (checked) {
                    setValueExperience("end_date", "");
                  }
                }}
              />
              <Label htmlFor="is_current" className="cursor-pointer">
                Je travaille actuellement ici
              </Label>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">
                Description des missions
                <span className="text-xs text-gray-500 ml-2">(optionnelle)</span>
              </Label>
              <Textarea
                id="description"
                {...registerExperience("description")}
                placeholder="Décrivez vos principales missions, responsabilités et réalisations..."
                rows={4}
              />
            </div>

            <DialogFooter className="gap-2">
              <Button type="button" variant="outline" onClick={handleCloseExperienceModal}>
                Annuler
              </Button>
              <Button type="submit" disabled={isExperienceSubmitting}>
                {isExperienceSubmitting ? (
                  <>
                    <span className="mr-2">⏳</span>
                    Enregistrement...
                  </>
                ) : (
                  editingExperience ? "Modifier" : "Ajouter"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Modal Éducation - Mise à jour avec useForm */}
      <Dialog open={educationModalOpen} onOpenChange={handleCloseEducationModal}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingEducation ? "Modifier" : "Ajouter"} une formation
            </DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmitEducation(handleSaveEducation)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="school">
                Établissement <span className="text-red-500">*</span>
              </Label>
              <Input
                id="school"
                {...registerEducation("school")}
                placeholder="Ex: Université de Douala"
              />
              {educationErrors.school && (
                <p className="text-sm text-red-500">{educationErrors.school.message}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="degree">Diplôme</Label>
                <Input
                  id="degree"
                  {...registerEducation("degree")}
                  placeholder="Ex: Master, Licence, Baccalauréat"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="field_of_study">Domaine d'étude</Label>
                <Input
                  id="field_of_study"
                  {...registerEducation("field_of_study")}
                  placeholder="Ex: Informatique, Marketing, Finance"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="start_date">
                  Date de début <span className="text-red-500">*</span>
                </Label>
                <Input 
                  id="start_date" 
                  type="date" 
                  {...registerEducation("start_date")} 
                />
                {educationErrors.start_date && (
                  <p className="text-sm text-red-500">{educationErrors.start_date.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="end_date">Date de fin</Label>
                <Input
                  id="end_date"
                  type="date"
                  {...registerEducation("end_date")}
                  disabled={isCurrentEducation}
                  className={isCurrentEducation ? "bg-gray-100 cursor-not-allowed" : ""}
                />
                {!isCurrentEducation && !watchEducation("end_date") && watchEducation("start_date") && (
                  <p className="text-sm text-amber-600">
                    ⚠️ Formation terminée, veuillez indiquer une date de fin
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="is_current_education"
                checked={isCurrentEducation}
                onCheckedChange={(checked) => {
                  setValueEducation("is_current", checked as boolean);
                  if (checked) {
                    setValueEducation("end_date", "");
                  }
                }}
              />
              <Label htmlFor="is_current_education" className="cursor-pointer">
                En cours de formation
              </Label>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">
                Description
                <span className="text-xs text-gray-500 ml-2">(optionnelle)</span>
              </Label>
              <Textarea
                id="description"
                {...registerEducation("description")}
                placeholder="Décrivez votre parcours académique, les spécialités, les projets réalisés..."
                rows={4}
              />
            </div>

            <DialogFooter className="gap-2">
              <Button type="button" variant="outline" onClick={handleCloseEducationModal}>
                Annuler
              </Button>
              <Button type="submit" disabled={isEducationSubmitting}>
                {isEducationSubmitting ? (
                  <>
                    <span className="mr-2">⏳</span>
                    Enregistrement...
                  </>
                ) : (
                  editingEducation ? "Modifier" : "Ajouter"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}