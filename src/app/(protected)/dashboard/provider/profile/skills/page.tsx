// app/(dashboard)/provider/profile/skills/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Icon } from "@iconify/react";
import { Button } from "@/app/components/ui/button";
import { Card } from "@/app/components/ui/card";
import { Label } from "@/app/components/ui/label";
import { Progress } from "@/app/components/ui/progress";
import { Badge } from "@/app/components/ui/badge";
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
import { Input } from "@/app/components/ui/input";
import { useSkills } from "@/app/hooks/provider-profile/use-skills";

// Schéma de validation pour les compétences
const SkillSchema = z.object({
  skill_id: z.number({
    required_error: "La compétence est requise",
    invalid_type_error: "Veuillez sélectionner une compétence",
  }).min(1, "La compétence est requise"),
  skill_type: z.enum(["primary", "secondary", "other"], {
    required_error: "Le type est requis",
  }),
  proficiency_level: z.number({
    required_error: "Le niveau est requis",
    invalid_type_error: "Le niveau doit être un nombre",
  }).min(1, "Le niveau minimum est 1").max(5, "Le niveau maximum est 5"),
  years_experience: z.number().optional().nullable(),
});

type SkillFormData = z.infer<typeof SkillSchema>;

// Helper pour obtenir le libellé du niveau
const getProficiencyLabel = (level: number) => {
  const labels: Record<number, string> = { 
    1: "Débutant", 
    2: "Intermédiaire", 
    3: "Avancé", 
    4: "Expert", 
    5: "Expert+" 
  };
  return labels[level] || "Débutant";
};

// Helper pour obtenir la couleur du niveau
const getProficiencyColor = (level: number) => {
  const colors: Record<number, string> = {
    1: "bg-red-500",
    2: "bg-orange-500",
    3: "bg-yellow-500",
    4: "bg-green-500",
    5: "bg-emerald-600",
  };
  return colors[level] || "bg-primary";
};

// Helper pour obtenir le libellé du type
const getSkillTypeLabel = (type: string) => {
  const labels: Record<string, string> = {
    primary: "Principale",
    secondary: "Secondaire",
    other: "Autre",
  };
  return labels[type] || type;
};

// Helper pour préparer les valeurs par défaut
const getDefaultValues = (data?: any): SkillFormData => {
  if (!data) {
    return {
      skill_id: 0,
      skill_type: "primary",
      proficiency_level: 3,
      years_experience: null,
    };
  }

  return {
    skill_id: data.skill?.id || data.skill_id || 0,
    skill_type: data.skill_type || "primary",
    proficiency_level: data.proficiency_level || 3,
    years_experience: data.years_experience || null,
  };
};

export default function SkillsPage() {
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState<any>(null);
  const [isSubmittingSkill, setIsSubmittingSkill] = useState(false);
  const { mySkills: skills, allSkills, addSkill, updateSkill, removeSkill: deleteSkill, isLoading, refetch } = useSkills();

  // Form pour les compétences
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm<SkillFormData>({
    resolver: zodResolver(SkillSchema),
    defaultValues: getDefaultValues(editingSkill),
  });

  // Mettre à jour le formulaire quand editingSkill change
  useEffect(() => {
    if (modalOpen) {
      reset(getDefaultValues(editingSkill));
    }
  }, [editingSkill, modalOpen, reset]);

  const selectedSkillId = watch("skill_id");
  const proficiencyLevel = watch("proficiency_level");

  const handleSaveSkill = async (data: SkillFormData) => {
    setIsSubmittingSkill(true);
    
    try {
      // Nettoyer les données avant envoi
      const cleanedData: any = {
        skill_type: data.skill_type,
        proficiency_level: data.proficiency_level,
      };
      
      // Ajouter years_experience seulement si défini et > 0
      if (data.years_experience && data.years_experience > 0) {
        cleanedData.years_experience = data.years_experience;
      }

      console.log("Envoi des données:", cleanedData);

      if (editingSkill) {
        // IMPORTANT: Utiliser l'ID du providerSkill, pas du Skill de base
        const providerSkillId = editingSkill.id;
        console.log("Mise à jour du skill avec ID:", providerSkillId, "et données:", cleanedData);
        await updateSkill({ skillId: providerSkillId, data: cleanedData });
      } else {
        // Pour l'ajout, on inclut skill_id
        const createData = {
          skill_id: data.skill_id,
          skill_type: data.skill_type,
          proficiency_level: data.proficiency_level,
          ...(data.years_experience && data.years_experience > 0 && { years_experience: data.years_experience })
        };
        console.log("Création du skill avec données:", createData);
        await addSkill(createData);
      }
      
      // Rafraîchir la liste des compétences
      await refetch();
      
      setModalOpen(false);
      setEditingSkill(null);
      reset();
    } catch (error) {
      console.error("Erreur lors de l'enregistrement:", error);
    } finally {
      setIsSubmittingSkill(false);
    }
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditingSkill(null);
    reset();
  };

  if (isLoading) {
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
              Compétences
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Gérez vos compétences et votre niveau de maîtrise
            </p>
          </div>
        </div>

        <Card className="rounded-2xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Icon icon="ph:code" className="w-5 h-5 text-primary" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Mes compétences
              </h2>
              <span className="text-sm text-gray-500">
                ({skills?.length || 0})
              </span>
            </div>
            <Button 
              onClick={() => { 
                setEditingSkill(null); 
                setModalOpen(true); 
              }} 
              className="rounded-full"
            >
              <Icon icon="ph:plus" className="w-4 h-4 mr-2" /> 
              Ajouter
            </Button>
          </div>

          {skills?.length === 0 ? (
            <div className="text-center py-12">
              <Icon icon="ph:code" className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">
                Aucune compétence ajoutée
              </p>
              <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                Cliquez sur "Ajouter" pour commencer
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {skills?.map((skill: any) => (
                <div 
                  key={skill.id} 
                  className="border border-gray-200 dark:border-gray-700 rounded-xl p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                          {skill.skill?.name}
                        </h3>
                        <Badge variant="secondary" className="text-xs">
                          {getSkillTypeLabel(skill.skill_type)}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex gap-1 ml-2">
                      <button 
                        onClick={() => { 
                          setEditingSkill(skill); 
                          setModalOpen(true); 
                        }} 
                        className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                        aria-label="Modifier"
                      >
                        <Icon icon="ph:pencil" className="w-4 h-4 text-gray-500" />
                      </button>
                      <button 
                        onClick={() => deleteSkill(skill.id)} 
                        className="p-1.5 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        aria-label="Supprimer"
                      >
                        <Icon icon="ph:trash" className="w-4 h-4 text-red-500" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="mt-3">
                    <div className="flex justify-between text-xs mb-1 text-gray-600 dark:text-gray-400">
                      <span>Niveau de maîtrise</span>
                      <span className="font-medium">{getProficiencyLabel(skill.proficiency_level)}</span>
                    </div>
                    <div className="relative">
                      <Progress 
                        value={(skill.proficiency_level / 5) * 100} 
                        className={`h-2 ${getProficiencyColor(skill.proficiency_level)}`} 
                      />
                      <div className="flex justify-between text-xs text-gray-400 mt-1">
                        <span>1</span>
                        <span>2</span>
                        <span>3</span>
                        <span>4</span>
                        <span>5</span>
                      </div>
                    </div>
                  </div>

                  {/* Afficher l'expérience si disponible */}
                  {skill.years_experience && (
                    <div className="mt-3 text-xs text-gray-500 dark:text-gray-400">
                      <Icon icon="ph:calendar" className="w-3 h-3 inline mr-1" />
                      {skill.years_experience} an{skill.years_experience > 1 ? 's' : ''} d'expérience
                    </div>
                  )}
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

      {/* Modal Compétence */}
      <Dialog open={modalOpen} onOpenChange={handleCloseModal}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>
              {editingSkill ? "Modifier" : "Ajouter"} une compétence
            </DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit(handleSaveSkill)} className="space-y-5">
            {/* Sélection de la compétence - Désactivée en mode édition */}
            <div className="space-y-2">
              <Label htmlFor="skill_id">
                Compétence <span className="text-red-500">*</span>
              </Label>
              <Select
                value={selectedSkillId?.toString() || ""}
                onValueChange={(value) => setValue("skill_id", parseInt(value))}
                disabled={!!editingSkill}
              >
                <SelectTrigger className={errors.skill_id ? "border-red-500" : ""}>
                  <SelectValue placeholder="Sélectionnez une compétence" />
                </SelectTrigger>
                <SelectContent>
                  {allSkills?.map((s: any) => (
                    <SelectItem key={s.id} value={s.id.toString()}>
                      {s.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.skill_id && (
                <p className="text-sm text-red-500">{errors.skill_id.message}</p>
              )}
              {editingSkill && (
                <p className="text-xs text-gray-500">
                  La compétence ne peut pas être modifiée. Supprimez et recréez-la si nécessaire.
                </p>
              )}
            </div>

            {/* Type de compétence */}
            <div className="space-y-2">
              <Label htmlFor="skill_type">Type de compétence</Label>
              <Select
                value={watch("skill_type")}
                onValueChange={(value: "primary" | "secondary" | "other") => 
                  setValue("skill_type", value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez le type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="primary">
                    <div className="flex items-center gap-2">
                      <Icon icon="ph:star" className="w-4 h-4 text-yellow-500" />
                      <span>Principale - Compétence clé</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="secondary">
                    <div className="flex items-center gap-2">
                      <Icon icon="ph:circle" className="w-4 h-4 text-blue-500" />
                      <span>Secondaire - Compétence complémentaire</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="other">
                    <div className="flex items-center gap-2">
                      <Icon icon="ph:dots-three" className="w-4 h-4 text-gray-500" />
                      <span>Autre - Compétence occasionnelle</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Niveau de maîtrise */}
            <div className="space-y-3">
              <div className="flex justify-between">
                <Label htmlFor="proficiency_level">
                  Niveau de maîtrise (1-5) <span className="text-red-500">*</span>
                </Label>
                <span className="text-sm font-medium text-primary">
                  {getProficiencyLabel(proficiencyLevel)}
                </span>
              </div>
              
              <div className="space-y-3">
                <input
                  type="range"
                  id="proficiency_level"
                  min={1}
                  max={5}
                  step={1}
                  value={proficiencyLevel}
                  onChange={(e) => setValue("proficiency_level", parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-primary"
                />
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                  <span>1 - Débutant</span>
                  <span>2 - Intermédiaire</span>
                  <span>3 - Avancé</span>
                  <span>4 - Expert</span>
                  <span>5 - Expert+</span>
                </div>
              </div>
              
              {errors.proficiency_level && (
                <p className="text-sm text-red-500">{errors.proficiency_level.message}</p>
              )}
            </div>

            {/* Années d'expérience */}
            <div className="space-y-2">
              <Label htmlFor="years_experience">
                Années d'expérience
                <span className="text-xs text-gray-500 ml-2">(optionnel)</span>
              </Label>
              <Input
                id="years_experience"
                type="number"
                step="0.5"
                min="0"
                placeholder="Ex: 3.5"
                {...register("years_experience", { valueAsNumber: true })}
                className={errors.years_experience ? "border-red-500" : ""}
              />
              <p className="text-xs text-gray-500">
                Nombre d'années d'expérience avec cette compétence
              </p>
              {errors.years_experience && (
                <p className="text-sm text-red-500">{errors.years_experience.message}</p>
              )}
            </div>

            {/* Aperçu du niveau */}
            {proficiencyLevel && (
              <div className="pt-2">
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Aperçu du niveau</span>
                    <Badge className={`
                      ${proficiencyLevel === 1 && "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"}
                      ${proficiencyLevel === 2 && "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400"}
                      ${proficiencyLevel === 3 && "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"}
                      ${proficiencyLevel === 4 && "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"}
                      ${proficiencyLevel === 5 && "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"}
                    `}>
                      {getProficiencyLabel(proficiencyLevel)}
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {proficiencyLevel === 1 && "Connaissances de base, nécessite de l'assistance"}
                    {proficiencyLevel === 2 && "Compréhension solide, peut travailler en autonomie sur des tâches simples"}
                    {proficiencyLevel === 3 && "Maîtrise confirmée, peut former d'autres personnes"}
                    {proficiencyLevel === 4 && "Expertise reconnue, résout des problèmes complexes"}
                    {proficiencyLevel === 5 && "Référence dans le domaine, innove et crée des solutions"}
                  </p>
                </div>
              </div>
            )}

            <DialogFooter className="gap-2 pt-4">
              <Button type="button" variant="outline" onClick={handleCloseModal}>
                Annuler
              </Button>
              <Button type="submit" disabled={isSubmittingSkill}>
                {isSubmittingSkill ? (
                  <>
                    <span className="mr-2">⏳</span>
                    Enregistrement...
                  </>
                ) : (
                  editingSkill ? "Modifier" : "Ajouter"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}