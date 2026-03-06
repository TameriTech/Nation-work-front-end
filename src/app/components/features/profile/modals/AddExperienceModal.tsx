// components/features/profile/modals/AddExperienceModal.tsx
"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createExperienceSchema,
  updateExperienceSchema,
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
import { ProfessionalExperience } from "@/app/types/user";

interface AddExperienceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (
    data: CreateExperienceFormData | UpdateExperienceFormData,
  ) => Promise<void>;
  initialData?: ProfessionalExperience;
  isLoading?: boolean;
}

export function AddExperienceModal({
  isOpen,
  onClose,
  onSave,
  initialData,
  isLoading = false,
}: AddExperienceModalProps) {
  const isEditMode = !!initialData;

  // Choisir le schéma approprié selon le mode
  const schema = isEditMode ? updateExperienceSchema : createExperienceSchema;

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<CreateExperienceFormData | UpdateExperienceFormData>({
    resolver: zodResolver(schema),
    defaultValues: initialData
      ? {
          position: initialData.position,
          company: initialData.company,
          description: initialData.description || "",
          start_date: initialData.start_date.split("T")[0], // Format YYYY-MM-DD
          end_date: initialData.end_date?.split("T")[0] || "",
          is_current: initialData.is_current,
          location: initialData.location || "",
        }
      : {
          position: "",
          company: "",
          description: "",
          start_date: "",
          end_date: "",
          is_current: false,
          location: "",
        },
  });

  const isCurrent = watch("is_current");
  const startDate = watch("start_date");
  const endDate = watch("end_date");

  const handleClose = () => {
    reset();
    onClose();
  };

  const onSubmit = async (
    data: CreateExperienceFormData | UpdateExperienceFormData,
  ) => {
    await onSave(data);
    reset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? "Modifier" : "Ajouter"} une expérience professionnelle
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
            <Label htmlFor="location">Lieu</Label>
            <Input
              id="location"
              {...register("location")}
              placeholder="Ex: Douala, Cameroun"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start_date">Date de début *</Label>
              <Input id="start_date" type="date" {...register("start_date")} />
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

          {/* Message d'information sur les dates */}
          {!isCurrent && !endDate && startDate && (
            <p className="text-sm text-amber-600">
              Veuillez renseigner une date de fin car vous n'êtes plus en poste.
            </p>
          )}

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
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
