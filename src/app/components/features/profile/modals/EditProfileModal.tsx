// components/features/profile/modals/EditProfileModal.tsx
"use client";
import { useEffect } from "react";
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
import { FreelancerFullProfile } from "@/app/types/user";
import {
  updateFreelancerProfileSchema,
  locationSchema,
  type UpdateFreelancerProfileFormData,
  type LocationFormData,
} from "@/app/lib/validators/user.validator";

type FormData = UpdateFreelancerProfileFormData & LocationFormData;

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: FormData) => Promise<void>;
  initialData: FreelancerFullProfile;
  section: "professional" | "location" | null;
}

export function EditProfileModal({
  isOpen,
  onClose,
  onSave,
  initialData,
  section,
}: EditProfileModalProps) {
  // Choisir le schéma approprié selon la section
  const schema =
    section === "professional" ? updateFreelancerProfileSchema : locationSchema;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting, isValid },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues:
      section === "professional"
        ? {
            study_level: initialData.study_level || undefined,
            last_diploma: initialData.last_diploma || undefined,
            primary_skill: initialData.primary_skill || undefined,
            secondary_skill: initialData.secondary_skill || undefined,
            other_skills: initialData.other_skills || undefined,
            years_experience: initialData.years_experience || 0,
            hourly_rate: initialData.hourly_rate || 0,
            summary: initialData.summary || undefined,
            nationality: initialData.nationality || undefined,
            gender: initialData.gender as
              | "homme"
              | "femme"
              | "autre"
              | undefined,
            age: initialData.age || undefined,
            is_available: initialData.is_available,
            phone_number: initialData.user?.phone_number || undefined,
          }
        : {
            address: initialData.address || undefined,
            quarter: initialData.quarter || undefined,
            city: initialData.city || undefined,
            postal_code: initialData.postal_code || undefined,
            country: initialData.country || undefined,
            phone_number: initialData.user?.phone_number || undefined,
          },
  });

  // Réinitialiser le formulaire quand la modal s'ouvre ou que la section change
  useEffect(() => {
    if (isOpen && initialData && section) {
      if (section === "professional") {
        reset({
          study_level: initialData.study_level || undefined,
          last_diploma: initialData.last_diploma || undefined,
          primary_skill: initialData.primary_skill || undefined,
          secondary_skill: initialData.secondary_skill || undefined,
          other_skills: initialData.other_skills || undefined,
          years_experience: initialData.years_experience || 0,
          hourly_rate: initialData.hourly_rate || 0,
          summary: initialData.summary || undefined,
          nationality: initialData.nationality || undefined,
          gender: initialData.gender as "homme" | "femme" | "autre" | undefined,
          age: initialData.age || undefined,
          is_available: initialData.is_available,
          phone_number: initialData.user?.phone_number || undefined,
        });
      } else {
        reset({
          address: initialData.address || undefined,
          quarter: initialData.quarter || undefined,
          city: initialData.city || undefined,
          postal_code: initialData.postal_code || undefined,
          country: initialData.country || undefined,
          phone_number: initialData.user?.phone_number || undefined,
        });
      }
    }
  }, [isOpen, initialData, section, reset]);

  const handleClose = () => {
    reset();
    onClose();
  };

  const onSubmit = async (data: FormData) => {
    // Filtrer les champs vides/undefined
    const cleanData = Object.fromEntries(
      Object.entries(data).filter(
        ([_, value]) => value !== undefined && value !== null && value !== "",
      ),
    );
    await onSave(cleanData);
    reset();
    onClose();
  };

  const getTitle = () => {
    if (section === "professional")
      return "Modifier les informations professionnelles";
    if (section === "location")
      return "Modifier les informations de localisation";
    return "Modifier le profil";
  };

  if (!section) return null;

  const isLocationSection = section === "location";

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-gray-800 text-xl font-semibold">
            {getTitle()}
          </DialogTitle>
          <p className="text-sm text-gray-500 mt-1">
            Remplissez les informations à modifier
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 py-4">
          {!isLocationSection ? (
            // Section Professionnelle
            <div className="space-y-4">
              {/* Niveau d'étude */}
              <div className="space-y-2">
                <Label
                  htmlFor="study_level"
                  className="text-gray-800 font-medium"
                >
                  Niveau d'étude
                </Label>
                <Select
                  value={watch("study_level") || ""}
                  onValueChange={(value) => setValue("study_level", value)}
                >
                  <SelectTrigger className="bg-white text-gray-800">
                    <SelectValue placeholder="Sélectionnez votre niveau" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bac">Baccalauréat</SelectItem>
                    <SelectItem value="bac+2">Bac+2 (BTS, DUT)</SelectItem>
                    <SelectItem value="bac+3">Bac+3 (Licence)</SelectItem>
                    <SelectItem value="bac+5">
                      Bac+5 (Master, Ingénieur)
                    </SelectItem>
                    <SelectItem value="bac+8">Bac+8 (Doctorat)</SelectItem>
                    <SelectItem value="autre">Autre</SelectItem>
                  </SelectContent>
                </Select>
                {errors.study_level && (
                  <p className="text-sm text-red-500">
                    {errors.study_level.message}
                  </p>
                )}
              </div>

              {/* Dernier diplôme */}
              <div className="space-y-2">
                <Label
                  htmlFor="last_diploma"
                  className="text-gray-800 font-medium"
                >
                  Dernier diplôme
                </Label>
                <Input
                  id="last_diploma"
                  className="bg-white"
                  {...register("last_diploma")}
                  placeholder="Ex: Master en Informatique"
                />
                {errors.last_diploma && (
                  <p className="text-sm text-red-500">
                    {errors.last_diploma.message}
                  </p>
                )}
              </div>

              {/* Années d'expérience et Tarif horaire */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="years_experience"
                    className="text-gray-800 font-medium"
                  >
                    Années d'expérience
                  </Label>
                  <Input
                    id="years_experience"
                    className="bg-white"
                    type="number"
                    min="0"
                    {...register("years_experience", { valueAsNumber: true })}
                  />
                  {errors.years_experience && (
                    <p className="text-sm text-red-500">
                      {errors.years_experience.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="hourly_rate"
                    className="text-gray-800 font-medium"
                  >
                    Tarif horaire (FCFA)
                  </Label>
                  <Input
                    id="hourly_rate"
                    className="bg-white"
                    type="number"
                    min="0"
                    step="100"
                    {...register("hourly_rate", { valueAsNumber: true })}
                  />
                  {errors.hourly_rate && (
                    <p className="text-sm text-red-500">
                      {errors.hourly_rate.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Compétence principale */}
              <div className="space-y-2">
                <Label
                  htmlFor="primary_skill"
                  className="text-gray-800 font-medium"
                >
                  Compétence principale
                </Label>
                <Input
                  id="primary_skill"
                  className="bg-white"
                  {...register("primary_skill")}
                  placeholder="Ex: Développement Web"
                />
              </div>

              {/* Compétence secondaire */}
              <div className="space-y-2">
                <Label
                  htmlFor="secondary_skill"
                  className="text-gray-800 font-medium"
                >
                  Compétence secondaire
                </Label>
                <Input
                  id="secondary_skill"
                  className="bg-white"
                  {...register("secondary_skill")}
                  placeholder="Ex: Design UI/UX"
                />
              </div>

              {/* Autres compétences */}
              <div className="space-y-2">
                <Label
                  htmlFor="other_skills"
                  className="text-gray-800 font-medium"
                >
                  Autres compétences
                </Label>
                <Textarea
                  id="other_skills"
                  className="bg-white"
                  {...register("other_skills")}
                  placeholder="Séparez les compétences par des virgules"
                  rows={3}
                />
              </div>

              {/* Bio / Résumé */}
              <div className="space-y-2">
                <Label htmlFor="summary" className="text-gray-800 font-medium">
                  Bio / Résumé
                </Label>
                <Textarea
                  id="summary"
                  className="bg-white"
                  {...register("summary")}
                  placeholder="Présentez-vous en quelques phrases..."
                  rows={4}
                />
                {errors.summary && (
                  <p className="text-sm text-red-500">
                    {errors.summary.message}
                  </p>
                )}
              </div>

              {/* Nationalité et Âge */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="nationality"
                    className="text-gray-800 font-medium"
                  >
                    Nationalité
                  </Label>
                  <Input
                    id="nationality"
                    className="bg-white"
                    {...register("nationality")}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="age" className="text-gray-800 font-medium">
                    Âge
                  </Label>
                  <Input
                    id="age"
                    className="bg-white"
                    type="number"
                    min="18"
                    {...register("age", { valueAsNumber: true })}
                  />
                  {errors.age && (
                    <p className="text-sm text-red-500">{errors.age.message}</p>
                  )}
                </div>
              </div>

              {/* Genre */}
              <div className="space-y-2">
                <Label htmlFor="gender" className="text-gray-800 font-medium">
                  Genre
                </Label>
                <Select
                  value={watch("gender") || ""}
                  onValueChange={(value: "homme" | "femme" | "autre") =>
                    setValue("gender", value)
                  }
                >
                  <SelectTrigger className="bg-white">
                    <SelectValue placeholder="Sélectionnez" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="homme">Homme</SelectItem>
                    <SelectItem value="femme">Femme</SelectItem>
                    <SelectItem value="autre">Autre</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Téléphone */}
              <div className="space-y-2">
                <Label
                  htmlFor="phone_number"
                  className="text-gray-800 font-medium"
                >
                  Téléphone
                </Label>
                <Input
                  id="phone_number"
                  className="bg-white"
                  {...register("phone_number")}
                  placeholder="Ex: +237 655 31 60 13"
                />
                {errors.phone_number && (
                  <p className="text-sm text-red-500">
                    {errors.phone_number.message}
                  </p>
                )}
              </div>

              {/* Disponibilité */}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="is_available"
                  className="bg-white text-gray-800"
                  checked={watch("is_available") || false}
                  onCheckedChange={(checked) =>
                    setValue("is_available", checked as boolean)
                  }
                />
                <Label
                  htmlFor="is_available"
                  className="text-gray-800 cursor-pointer"
                >
                  Disponible pour de nouvelles missions
                </Label>
              </div>
            </div>
          ) : (
            // Section Localisation
            <div className="space-y-4">
              {/* Adresse */}
              <div className="space-y-2">
                <Label htmlFor="address" className="text-gray-800 font-medium">
                  Adresse de résidence
                </Label>
                <Input
                  id="address"
                  className="bg-white"
                  {...register("address")}
                  placeholder="Ex: 123 Rue Principale"
                />
                {errors.address && (
                  <p className="text-sm text-red-500">
                    {errors.address.message}
                  </p>
                )}
              </div>

              {/* Quartier */}
              <div className="space-y-2">
                <Label htmlFor="quarter" className="text-gray-800 font-medium">
                  Quartier
                </Label>
                <Input
                  id="quarter"
                  className="bg-white"
                  {...register("quarter")}
                  placeholder="Ex: Akwa, Bonanjo, etc."
                />
              </div>

              {/* Ville et Code postal */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city" className="text-gray-800 font-medium">
                    Ville
                  </Label>
                  <Input
                    id="city"
                    className="bg-white"
                    {...register("city")}
                    placeholder="Ex: Douala"
                  />
                  {errors.city && (
                    <p className="text-sm text-red-500">
                      {errors.city.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="postal_code"
                    className="text-gray-800 font-medium"
                  >
                    Code postal
                  </Label>
                  <Input
                    id="postal_code"
                    className="bg-white"
                    {...register("postal_code")}
                    placeholder="Ex: 00000"
                  />
                  {errors.postal_code && (
                    <p className="text-sm text-red-500">
                      {errors.postal_code.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Pays */}
              <div className="space-y-2">
                <Label htmlFor="country" className="text-gray-800 font-medium">
                  Pays
                </Label>
                <Input
                  id="country"
                  className="bg-white"
                  {...register("country")}
                  placeholder="Ex: Cameroun"
                />
                {errors.country && (
                  <p className="text-sm text-red-500">
                    {errors.country.message}
                  </p>
                )}
              </div>

              {/* Téléphone */}
              <div className="space-y-2">
                <Label
                  htmlFor="phone_number"
                  className="text-gray-800 font-medium"
                >
                  Téléphone
                </Label>
                <Input
                  id="phone_number"
                  className="bg-white"
                  {...register("phone_number")}
                  placeholder="Ex: +237 655 31 60 13"
                />
                {errors.phone_number && (
                  <p className="text-sm text-red-500">
                    {errors.phone_number.message}
                  </p>
                )}
              </div>
            </div>
          )}

          <DialogFooter className="pt-4 border-t border-gray-200">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="rounded-full px-6"
            >
              Annuler
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !isValid}
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-6"
            >
              {isSubmitting
                ? "Enregistrement..."
                : "Enregistrer les modifications"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
