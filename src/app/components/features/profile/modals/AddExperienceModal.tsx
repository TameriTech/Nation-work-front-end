// components/features/profile/modals/AddExperienceModal.tsx
"use client";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ProfessionalExperienceSchema,
  UpdateExperienceSchema,
  type CreateExperienceFormData,
  type UpdateExperienceFormData,
} from "@/app/lib/validators/experience.validator";
import { Button } from "@/app/components/ui/button";
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
import { Plus, Trash2 } from "lucide-react";
import type { ProfessionalExperienceOut } from "@/app/types";
import { EmploymentType, LocationType } from "@/app/types/enums";
import { useEffect } from "react";

interface AddExperienceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (
    data: CreateExperienceFormData | UpdateExperienceFormData,
  ) => Promise<void>;
  initialData?: ProfessionalExperienceOut;
  isLoading?: boolean;
}

// Helper pour convertir une date du format dd/MM/yyyy vers yyyy-MM-dd
const formatDateToISO = (dateStr: string): string => {
  if (!dateStr) return "";
  if (dateStr.match(/^\d{4}-\d{2}-\d{2}$/)) return dateStr;
  
  const parts = dateStr.split('/');
  if (parts.length === 3) {
    const [day, month, year] = parts;
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  }
  return dateStr;
};

// Helper pour convertir une date ISO vers dd/MM/yyyy pour l'affichage
const formatDateToDisplay = (dateStr: string): string => {
  if (!dateStr) return "";
  // Si c'est déjà au format dd/MM/yyyy
  if (dateStr.match(/^\d{2}\/\d{2}\/\d{4}$/)) return dateStr;
  // Convertir ISO vers dd/MM/yyyy
  if (dateStr.match(/^\d{4}-\d{2}-\d{2}$/)) {
    const [year, month, day] = dateStr.split('-');
    return `${day}/${month}/${year}`;
  }
  return dateStr;
};

// Fonction pour préparer les valeurs par défaut
const getDefaultValues = (data?: ProfessionalExperienceOut) => {
  if (!data) {
    return {
      position: "",
      position_level: "",
      company: "",
      company_description: "",
      company_website: "",
      company_logo: "",
      company_size: "",
      company_industry: "",
      description: "",
      start_date: "",
      end_date: "",
      is_current: false,
      is_public: true,
      location: "",
      country: "",
      city: "",
      employment_type: EmploymentType.FULL_TIME,
      location_type: LocationType.ONSITE,
      achievements: [],
      responsibilities: [],
      technologies_used: [],
    };
  }

  // Pour les dates, l'API renvoie probablement déjà au format ISO (YYYY-MM-DD)
  const startDateValue = data.start_date 
    ? formatDateToDisplay(data.start_date.split("T")[0])
    : "";
  const endDateValue = data.end_date 
    ? formatDateToDisplay(data.end_date.split("T")[0])
    : "";

  return {
    position: data.position,
    position_level: data.position_level || "",
    company: data.company,
    company_description: data.company_description || "",
    company_website: data.company_website || "",
    company_logo: data.company_logo || "",
    company_size: data.company_size || "",
    company_industry: data.company_industry || "",
    description: data.description || "",
    start_date: startDateValue,
    end_date: endDateValue,
    is_current: data.is_current,
    is_public: data.is_public ?? true,
    location: data.location || "",
    country: data.country || "",
    city: data.city || "",
    employment_type: data.employment_type,
    location_type: data.location_type,
    achievements: data.achievements || [],
    responsibilities: data.responsibilities || [],
    technologies_used: data.technologies_used || [],
  };
};

export function AddExperienceModal({
  isOpen,
  onClose,
  onSave,
  initialData,
  isLoading = false,
}: AddExperienceModalProps) {
  const isEditMode = !!initialData;
  const schema = isEditMode ? UpdateExperienceSchema : ProfessionalExperienceSchema;

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<CreateExperienceFormData | UpdateExperienceFormData>({
    resolver: zodResolver(schema),
    defaultValues: getDefaultValues(initialData),
  });

  // Mettre à jour le formulaire quand initialData change
  useEffect(() => {
    if (isOpen) {
      reset(getDefaultValues(initialData));
    }
  }, [initialData, isOpen, reset]);

  const isCurrent = watch("is_current");
  const startDate = watch("start_date");
  const endDate = watch("end_date");

  // Field arrays pour les listes dynamiques
  const { fields: achievementFields, append: appendAchievement, remove: removeAchievement } = useFieldArray({
    control,
    name: "achievements"
  });

  const { fields: responsibilityFields, append: appendResponsibility, remove: removeResponsibility } = useFieldArray({
    control,
    name: "responsibilities"
  });

  const { fields: techFields, append: appendTech, remove: removeTech } = useFieldArray({
    control,
    name: "technologies_used"
  });

  const handleClose = () => {
    reset();
    onClose();
  };

  const onSubmit = async (data: CreateExperienceFormData | UpdateExperienceFormData) => {
    const formattedData = {
      ...data,
      start_date: data.start_date ? formatDateToISO(data.start_date) : undefined,
      end_date: data.end_date ? formatDateToISO(data.end_date) : undefined,
    };
    await onSave(formattedData);
    reset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? "Modifier" : "Ajouter"} une expérience professionnelle
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Section: Informations de base */}
          <div className="space-y-4 border-b pb-4">
            <h3 className="text-lg font-semibold">Informations générales</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="position">Poste occupé *</Label>
                <Input
                  id="position"
                  {...register("position")}
                  placeholder="Ex: Développeur Full Stack"
                />
                {errors.position && (
                  <p className="text-sm text-red-500">{errors.position.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="position_level">Niveau du poste</Label>
                <Input
                  id="position_level"
                  {...register("position_level")}
                  placeholder="Ex: Senior, Junior, Lead"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="company">Entreprise *</Label>
                <Input
                  id="company"
                  {...register("company")}
                  placeholder="Ex: Tech Solutions SARL"
                />
                {errors.company && (
                  <p className="text-sm text-red-500">{errors.company.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="company_size">Taille de l'entreprise</Label>
                <Input
                  id="company_size"
                  {...register("company_size")}
                  placeholder="Ex: 50-200 employés"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="company_description">Description de l'entreprise</Label>
              <Textarea
                id="company_description"
                {...register("company_description")}
                placeholder="Décrivez brièvement l'entreprise..."
                rows={2}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="company_website">Site web de l'entreprise</Label>
                <Input
                  id="company_website"
                  {...register("company_website")}
                  type="url"
                  placeholder="https://..."
                />
                {errors.company_website && (
                  <p className="text-sm text-red-500">{errors.company_website.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="company_logo">URL du logo</Label>
                <Input
                  id="company_logo"
                  {...register("company_logo")}
                  type="url"
                  placeholder="https://..."
                />
                {errors.company_logo && (
                  <p className="text-sm text-red-500">{errors.company_logo.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="company_industry">Secteur d'activité</Label>
              <Input
                id="company_industry"
                {...register("company_industry")}
                placeholder="Ex: Technologies, Finance, Santé"
              />
            </div>
          </div>

          {/* Section: Localisation */}
          <div className="space-y-4 border-b pb-4">
            <h3 className="text-lg font-semibold">Localisation</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="country">Pays</Label>
                <Input
                  id="country"
                  {...register("country")}
                  placeholder="Ex: Cameroun"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="city">Ville</Label>
                <Input
                  id="city"
                  {...register("city")}
                  placeholder="Ex: Douala"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Adresse complète</Label>
              <Input
                id="location"
                {...register("location")}
                placeholder="Ex: Douala, Cameroun"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="employment_type">Type d'emploi *</Label>
                <Select
                  value={watch("employment_type")}
                  onValueChange={(value) => 
                    setValue("employment_type", value as EmploymentType)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={EmploymentType.FULL_TIME}>Temps plein</SelectItem>
                    <SelectItem value={EmploymentType.PART_TIME}>Temps partiel</SelectItem>
                    <SelectItem value={EmploymentType.FREELANCE}>Freelance</SelectItem>
                    <SelectItem value={EmploymentType.INTERNSHIP}>Stage</SelectItem>
                    <SelectItem value={EmploymentType.CONTRACT}>CDD</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location_type">Type de localisation</Label>
                <Select
                  value={watch("location_type")}
                  onValueChange={(value) => 
                    setValue("location_type", value as LocationType)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={LocationType.ONSITE}>Sur place</SelectItem>
                    <SelectItem value={LocationType.REMOTE}>À distance</SelectItem>
                    <SelectItem value={LocationType.HYBRID}>Hybride</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Section: Dates */}
          <div className="space-y-4 border-b pb-4">
            <h3 className="text-lg font-semibold">Période</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="start_date">Date de début *</Label>
                <Input 
                  id="start_date" 
                  type="date" 
                  {...register("start_date")} 
                />
                {errors.start_date && (
                  <p className="text-sm text-red-500">
                    {errors.start_date.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="end_date">Date de fin</Label>
                <Input
                  id="end_date"
                  type="date"
                  {...register("end_date")}
                  disabled={isCurrent}
                />
                {errors.end_date && (
                  <p className="text-sm text-red-500">
                    {errors.end_date.message}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="is_current"
                checked={isCurrent}
                onCheckedChange={(checked) =>
                  setValue("is_current", checked as boolean)
                }
              />
              <Label htmlFor="is_current">Je travaille actuellement ici</Label>
            </div>

            {!isCurrent && !endDate && startDate && (
              <p className="text-sm text-amber-600">
                Veuillez renseigner une date de fin car vous n'êtes plus en poste.
              </p>
            )}
          </div>

          {/* Section: Description */}
          <div className="space-y-4 border-b pb-4">
            <h3 className="text-lg font-semibold">Description</h3>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description générale</Label>
              <Textarea
                id="description"
                {...register("description")}
                placeholder="Décrivez vos missions et réalisations..."
                rows={4}
              />
              {errors.description && (
                <p className="text-sm text-red-500">
                  {errors.description.message}
                </p>
              )}
            </div>
          </div>

          {/* Section: Réalisations */}
          <div className="space-y-4 border-b pb-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Réalisations</h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => appendAchievement("")}
              >
                <Plus className="h-4 w-4 mr-2" />
                Ajouter
              </Button>
            </div>
            
            {achievementFields.map((field, index) => (
              <div key={field.id} className="flex gap-2">
                <Input
                  {...register(`achievements.${index}`)}
                  placeholder="Ex: Augmentation des ventes de 20%"
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={() => removeAchievement(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>

          {/* Section: Responsabilités */}
          <div className="space-y-4 border-b pb-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Responsabilités</h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => appendResponsibility("")}
              >
                <Plus className="h-4 w-4 mr-2" />
                Ajouter
              </Button>
            </div>
            
            {responsibilityFields.map((field, index) => (
              <div key={field.id} className="flex gap-2">
                <Input
                  {...register(`responsibilities.${index}`)}
                  placeholder="Ex: Gestion d'une équipe de 5 personnes"
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={() => removeResponsibility(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>

          {/* Section: Technologies */}
          <div className="space-y-4 border-b pb-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Technologies utilisées</h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => appendTech("")}
              >
                <Plus className="h-4 w-4 mr-2" />
                Ajouter
              </Button>
            </div>
            
            {techFields.map((field, index) => (
              <div key={field.id} className="flex gap-2">
                <Input
                  {...register(`technologies_used.${index}`)}
                  placeholder="Ex: React, Node.js, TypeScript"
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={() => removeTech(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>

          {/* Section: Visibilité */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="is_public"
                checked={watch("is_public")}
                onCheckedChange={(checked) =>
                  setValue("is_public", checked as boolean)
                }
              />
              <Label htmlFor="is_public">Rendre publique cette expérience</Label>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Annuler
            </Button>
            <Button type="submit" disabled={isLoading || isSubmitting}>
              {isLoading || isSubmitting
                ? "Enregistrement..."
                : isEditMode
                  ? "Modifier"
                  : "Ajouter"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}