// components/features/profile/modals/AddSkillModal.tsx
"use client";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/app/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/app/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import { Label } from "@/app/components/ui/label";
import { Input } from "@/app/components/ui/input";
import { Skill } from "@/app/types/user";
import {
  skillSchema,
  type SkillFormData,
} from "@/app/lib/validators/skill.validator";

interface AddSkillModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (
    skillId: number,
    skillType: string,
    proficiency: number,
  ) => Promise<void>;
  availableSkills: Skill[];
  initialData?: {
    skillId?: number;
    skillType?: string;
    proficiency?: number;
  };
  isEditing?: boolean;
}

export function AddSkillModal({
  isOpen,
  onClose,
  onSave,
  availableSkills,
  initialData,
  isEditing = false,
}: AddSkillModalProps) {
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<SkillFormData>({
    resolver: zodResolver(skillSchema),
    defaultValues: {
      skill_id: initialData?.skillId || 0,
      skill_type:
        (initialData?.skillType as "primary" | "secondary" | "other") ||
        "primary",
      proficiency_level: initialData?.proficiency || 3,
    },
  });

  const selectedSkillId = watch("skill_id");
  const selectedSkillType = watch("skill_type");
  const selectedProficiency = watch("proficiency_level");

  // Réinitialiser le formulaire quand la modal s'ouvre
  useEffect(() => {
    if (isOpen) {
      reset({
        skill_id: initialData?.skillId || 0,
        skill_type:
          (initialData?.skillType as "primary" | "secondary" | "other") ||
          "primary",
        proficiency_level: initialData?.proficiency || 3,
      });
    }
  }, [isOpen, initialData, reset]);

  const onSubmit = async (data: SkillFormData) => {
    if (!data.skill_id) return;

    setLoading(true);
    try {
      await onSave(data.skill_id, data.skill_type, data.proficiency_level);
      reset();
      onClose();
    } catch (error) {
      console.error("Error saving skill:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  // Filtrer les compétences déjà ajoutées (optionnel)
  const filteredSkills = availableSkills;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Modifier la compétence" : "Ajouter une compétence"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="skill">Compétence *</Label>
            <Select
              value={selectedSkillId.toString()}
              onValueChange={(value) => setValue("skill_id", parseInt(value))}
            >
              <SelectTrigger
                className={errors.skill_id ? "border-red-500" : ""}
              >
                <SelectValue placeholder="Sélectionnez une compétence" />
              </SelectTrigger>
              <SelectContent>
                {filteredSkills.map((skill) => (
                  <SelectItem key={skill.id} value={skill.id.toString()}>
                    {skill.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.skill_id && (
              <p className="text-sm text-red-500">{errors.skill_id.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="skillType">Type de compétence</Label>
            <Select
              value={selectedSkillType}
              onValueChange={(value: "primary" | "secondary" | "other") =>
                setValue("skill_type", value)
              }
            >
              <SelectTrigger
                className={errors.skill_type ? "border-red-500" : ""}
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="primary">Principale</SelectItem>
                <SelectItem value="secondary">Secondaire</SelectItem>
                <SelectItem value="other">Autre</SelectItem>
              </SelectContent>
            </Select>
            {errors.skill_type && (
              <p className="text-sm text-red-500">
                {errors.skill_type.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="proficiency">Niveau de compétence (1-5)</Label>
            <div className="flex items-center gap-4">
              <Input
                id="proficiency"
                type="range"
                min={1}
                max={5}
                step={1}
                value={selectedProficiency}
                onChange={(e) =>
                  setValue("proficiency_level", parseInt(e.target.value))
                }
                className="flex-1"
              />
              <span className="w-12 text-center font-medium text-blue-900">
                {selectedProficiency}/5
              </span>
            </div>
            <div className="flex justify-between text-xs text-gray-500 px-1">
              <span>Débutant</span>
              <span>Intermédiaire</span>
              <span>Avancé</span>
              <span>Expert</span>
            </div>
            {errors.proficiency_level && (
              <p className="text-sm text-red-500">
                {errors.proficiency_level.message}
              </p>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Annuler
            </Button>
            <Button
              type="submit"
              disabled={loading || isSubmitting || !selectedSkillId}
              className="bg-blue-900 hover:bg-blue-800"
            >
              {loading || isSubmitting
                ? "Enregistrement..."
                : isEditing
                  ? "Modifier"
                  : "Ajouter"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
