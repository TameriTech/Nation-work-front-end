// components/features/profile/modals/AddEducationModal.tsx
"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createEducationSchema,
  updateEducationSchema,
  type CreateEducationFormData,
  type UpdateEducationFormData,
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
import { Education } from "@/app/types";

interface AddEducationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (
    data: CreateEducationFormData | UpdateEducationFormData,
  ) => Promise<void>;
  initialData?: Education;
  isLoading?: boolean;
}

export function AddEducationModal({
  isOpen,
  onClose,
  onSave,
  initialData,
  isLoading = false,
}: AddEducationModalProps) {
  const isEditMode = !!initialData;

  // Choisir le schéma approprié selon le mode
  const schema = isEditMode ? updateEducationSchema : createEducationSchema;

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<CreateEducationFormData | UpdateEducationFormData>({
    resolver: zodResolver(schema),
    defaultValues: initialData
      ? {
          school: initialData.school,
          degree: initialData.degree || "",
          field_of_study: initialData.field_of_study || "",
          description: initialData.description || "",
          start_date: initialData.start_date.split("T")[0],
          end_date: initialData.end_date?.split("T")[0] || "",
          is_current: initialData.is_current,
          grade: initialData.grade || "",
        }
      : {
          school: "",
          degree: "",
          field_of_study: "",
          description: "",
          start_date: "",
          end_date: "",
          is_current: false,
          grade: "",
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
    data: CreateEducationFormData | UpdateEducationFormData,
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
            {isEditMode ? "Modifier" : "Ajouter"} une formation
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="school">Établissement *</Label>
            <Input
              id="school"
              {...register("school")}
              placeholder="Ex: Université de Yaoundé I"
            />
            {errors.school && (
              <p className="text-sm text-red-500">{errors.school.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="degree">Diplôme</Label>
              <Input
                id="degree"
                {...register("degree")}
                placeholder="Ex: Licence, Master, Doctorat"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="field_of_study">Domaine d'étude</Label>
              <Input
                id="field_of_study"
                {...register("field_of_study")}
                placeholder="Ex: Informatique, Commerce"
              />
            </div>
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
            <Label htmlFor="is_current">En cours de formation</Label>
          </div>

          {/* Message d'information sur les dates */}
          {!isCurrent && !endDate && startDate && (
            <p className="text-sm text-amber-600">
              Veuillez renseigner une date de fin car la formation n'est plus en
              cours.
            </p>
          )}

          <div className="space-y-2">
            <Label htmlFor="grade">Mention/Grade</Label>
            <Input
              id="grade"
              {...register("grade")}
              placeholder="Ex: Très Bien, 16/20"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              {...register("description")}
              placeholder="Description de la formation..."
              rows={3}
            />
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
