// components/features/profile/modals/EditProfileModals.tsx
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
import {
  providerProfileUpdateSchema,
  LocationInfoSchema,
  SocialLinksSchema,
  type providerProfileUpdateFormData,
  type LocationInfoFormData,
  type SocialLinksFormData,
} from "@/app/lib/validators/user.validator";
import { useUser } from "@/app/hooks/auth/use-user";

// ==================== MODAL PROFESSIONNEL ====================

interface ProfessionalEditModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ProfessionalEditModal({ isOpen, onClose }: ProfessionalEditModalProps) {
  const { profile, updateProfile,isUpdating } = useUser();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting, isValid },
    reset,
  } = useForm<providerProfileUpdateFormData>({
    resolver: zodResolver(providerProfileUpdateSchema),
    mode: "onChange",
  });

  useEffect(() => {
    if (isOpen && profile) {
      reset({
        professional_title: profile.provider_profile?.professional_title || undefined,
        study_level: profile.provider_profile?.study_level || undefined,
        last_diploma: profile.provider_profile?.last_diploma || undefined,
        years_experience: profile.provider_profile?.years_experience || 0,
        hourly_rate: profile.provider_profile?.hourly_rate || 0,
        summary: profile.provider_profile?.summary || undefined,
        nationality: profile.provider_profile?.nationality || undefined,
        gender: profile.provider_profile?.gender as "homme" | "femme" | "autre" | undefined,
        is_available: profile.provider_profile?.is_available,
        phone_number: profile.phone_number || undefined,
      });
    }
  }, [isOpen, profile, reset]);

  const handleClose = () => {
    reset();
    onClose();
  };

  const onSubmit = async (data: providerProfileUpdateFormData) => {
    const cleanData = Object.fromEntries(
      Object.entries(data).filter(
        ([_, value]) => value !== undefined && value !== null && value !== "",
      ),
    );
    await updateProfile(cleanData);
    handleClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-gray-800 text-xl font-semibold">
            Modifier les informations professionnelles
          </DialogTitle>
          <p className="text-sm text-gray-500 mt-1">
            Remplissez les informations à modifier
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 py-4">
          <div className="space-y-4">
            {/* Titre professionnel */}
            <div className="space-y-2">
              <Label htmlFor="professional_title" className="text-gray-800 font-medium">
                Titre professionnel
              </Label>
              <Input
                id="professional_title"
                className="bg-white"
                {...register("professional_title")}
                placeholder="Ex: Développeur Full Stack Senior"
              />
              {errors.professional_title && (
                <p className="text-sm text-red-500">{errors.professional_title.message}</p>
              )}
            </div>

            {/* Niveau d'étude */}
            <div className="space-y-2">
              <Label htmlFor="study_level" className="text-gray-800 font-medium">
                Niveau d'étude
              </Label>
              <Select
                value={watch("study_level") || "autre"}
                onValueChange={(value) => setValue("study_level", value)}
              >
                <SelectTrigger className="bg-white text-gray-800">
                  <SelectValue placeholder="Sélectionnez votre niveau" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bac">Baccalauréat</SelectItem>
                  <SelectItem value="bac+2">Bac+2 (BTS, DUT)</SelectItem>
                  <SelectItem value="bac+3">Bac+3 (Licence)</SelectItem>
                  <SelectItem value="bac+5">Bac+5 (Master, Ingénieur)</SelectItem>
                  <SelectItem value="bac+8">Bac+8 (Doctorat)</SelectItem>
                  <SelectItem value="autre">Autre</SelectItem>
                </SelectContent>
              </Select>
              {errors.study_level && (
                <p className="text-sm text-red-500">{errors.study_level.message}</p>
              )}
            </div>

            {/* Dernier diplôme */}
            <div className="space-y-2">
              <Label htmlFor="last_diploma" className="text-gray-800 font-medium">
                Dernier diplôme
              </Label>
              <Input
                id="last_diploma"
                className="bg-white"
                {...register("last_diploma")}
                placeholder="Ex: Master en Informatique"
              />
              {errors.last_diploma && (
                <p className="text-sm text-red-500">{errors.last_diploma.message}</p>
              )}
            </div>

            {/* Années d'expérience et Tarif horaire */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="years_experience" className="text-gray-800 font-medium">
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
                  <p className="text-sm text-red-500">{errors.years_experience.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="hourly_rate" className="text-gray-800 font-medium">
                  Tarif horaire ($)
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
                  <p className="text-sm text-red-500">{errors.hourly_rate.message}</p>
                )}
              </div>
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
                <p className="text-sm text-red-500">{errors.summary.message}</p>
              )}
            </div>

            {/* Nationalité */}
            <div className="space-y-2">
              <Label htmlFor="nationality" className="text-gray-800 font-medium">
                Nationalité
              </Label>
              <Input
                id="nationality"
                className="bg-white"
                {...register("nationality")}
                placeholder="Ex: Camerounaise"
              />
              {errors.nationality && (
                <p className="text-sm text-red-500">{errors.nationality.message}</p>
              )}
            </div>

            {/* Téléphone */}
            <div className="space-y-2">
              <Label htmlFor="phone_number" className="text-gray-800 font-medium">
                Téléphone
              </Label>
              <Input
                id="phone_number"
                className="bg-white"
                {...register("phone_number")}
                placeholder="Ex: +237 655 31 60 13"
              />
              {errors.phone_number && (
                <p className="text-sm text-red-500">{errors.phone_number.message}</p>
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
              <Label htmlFor="is_available" className="text-gray-800 cursor-pointer">
                Disponible pour de nouvelles missions
              </Label>
            </div>
          </div>

          <DialogFooter className="pt-4 border-t border-gray-200">
            <Button type="button" variant="outline" onClick={handleClose} className="rounded-full px-6">
              Annuler
            </Button>
            <Button type="submit" disabled={isSubmitting || !isValid || isUpdating} className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-6">
              {isSubmitting || isUpdating ? "Enregistrement..." : "Enregistrer les modifications"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ==================== MODAL LOCALISATION ====================

interface LocationEditModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LocationEditModal({ isOpen, onClose }: LocationEditModalProps) {
  const { profile, updateLocation, isUpdating } = useUser();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
    reset,
  } = useForm<LocationInfoFormData>({
    resolver: zodResolver(LocationInfoSchema),
    mode: "onChange",
  });

  useEffect(() => {
    if (isOpen && profile) {
      reset({
        address: profile.location?.address || undefined,
        quarter: profile.location?.quarter || undefined,
        city: profile.location?.city || undefined,
        postal_code: profile.location?.postal_code || undefined,
        country: profile.location?.country || undefined,
      });
    }
  }, [isOpen, profile, reset]);

  const handleClose = () => {
    reset();
    onClose();
  };

  const onSubmit = async (data: LocationInfoFormData) => {
    const cleanData = Object.fromEntries(
      Object.entries(data).filter(
        ([_, value]) => value !== undefined && value !== null && value !== "",
      ),
    );
    await updateLocation(cleanData);
    handleClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-gray-800 text-xl font-semibold">
            Modifier les informations de localisation
          </DialogTitle>
          <p className="text-sm text-gray-500 mt-1">
            Remplissez les informations à modifier
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 py-4">
          <div className="space-y-4">
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
                <p className="text-sm text-red-500">{errors.address.message}</p>
              )}
            </div>

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
                  <p className="text-sm text-red-500">{errors.city.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="postal_code" className="text-gray-800 font-medium">
                  Code postal
                </Label>
                <Input
                  id="postal_code"
                  className="bg-white"
                  {...register("postal_code")}
                  placeholder="Ex: 00000"
                />
                {errors.postal_code && (
                  <p className="text-sm text-red-500">{errors.postal_code.message}</p>
                )}
              </div>
            </div>

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
                <p className="text-sm text-red-500">{errors.country.message}</p>
              )}
            </div>
          </div>

          <DialogFooter className="pt-4 border-t border-gray-200">
            <Button type="button" variant="outline" onClick={handleClose} className="rounded-full px-6">
              Annuler
            </Button>
            <Button type="submit" disabled={isSubmitting || !isValid || isUpdating} className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-6">
              {isSubmitting || isUpdating ? "Enregistrement..." : "Enregistrer les modifications"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ==================== MODAL RÉSEAUX SOCIAUX ====================

interface SocialEditModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SocialEditModal({ isOpen, onClose }: SocialEditModalProps) {
  const { profile, updateSocialLinks, isUpdating } = useUser();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
    reset,
  } = useForm<SocialLinksFormData>({
    resolver: zodResolver(SocialLinksSchema),
    mode: "onChange",
  });

  useEffect(() => {
    if (isOpen && profile) {
      reset({
        website: profile.social_links?.website || undefined,
        linkedin: profile.social_links?.linkedin || undefined,
        twitter: profile.social_links?.twitter || undefined,
        github: profile.social_links?.github || undefined,
        behance: profile.social_links?.behance || undefined,
        dribbble: profile.social_links?.dribbble || undefined,
      });
    }
  }, [isOpen, profile, reset]);

  const handleClose = () => {
    reset();
    onClose();
  };

  const onSubmit = async (data: SocialLinksFormData) => {
    const cleanData = Object.fromEntries(
      Object.entries(data).filter(
        ([_, value]) => value !== undefined && value !== null && value !== "",
      ),
    );
    await updateSocialLinks(cleanData);
    handleClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-gray-800 text-xl font-semibold">
            Modifier les liens sociaux
          </DialogTitle>
          <p className="text-sm text-gray-500 mt-1">
            Remplissez les informations à modifier
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 py-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="website" className="text-gray-800 font-medium">
                Site web
              </Label>
              <Input
                id="website"
                className="bg-white"
                {...register("website")}
                placeholder="Ex: https://www.monsite.com"
              />
              {errors.website && (
                <p className="text-sm text-red-500">{errors.website.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="linkedin" className="text-gray-800 font-medium">
                LinkedIn
              </Label>
              <Input
                id="linkedin"
                className="bg-white"
                {...register("linkedin")}
                placeholder="Ex: https://www.linkedin.com/in/monprofil"
              />
              {errors.linkedin && (
                <p className="text-sm text-red-500">{errors.linkedin.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="twitter" className="text-gray-800 font-medium">
                Twitter/X
              </Label>
              <Input
                id="twitter"
                className="bg-white"
                {...register("twitter")}
                placeholder="Ex: https://twitter.com/monprofil"
              />
              {errors.twitter && (
                <p className="text-sm text-red-500">{errors.twitter.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="github" className="text-gray-800 font-medium">
                GitHub
              </Label>
              <Input
                id="github"
                className="bg-white"
                {...register("github")}
                placeholder="Ex: https://github.com/monprofil"
              />
              {errors.github && (
                <p className="text-sm text-red-500">{errors.github.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="behance" className="text-gray-800 font-medium">
                Behance
              </Label>
              <Input
                id="behance"
                className="bg-white"
                {...register("behance")}
                placeholder="Ex: https://www.behance.net/monprofil"
              />
              {errors.behance && (
                <p className="text-sm text-red-500">{errors.behance.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="dribbble" className="text-gray-800 font-medium">
                Dribbble
              </Label>
              <Input
                id="dribbble"
                className="bg-white"
                {...register("dribbble")}
                placeholder="Ex: https://dribbble.com/monprofil"
              />
              {errors.dribbble && (
                <p className="text-sm text-red-500">{errors.dribbble.message}</p>
              )}
            </div>
          </div>

          <DialogFooter className="pt-4 border-t border-gray-200">
            <Button type="button" variant="outline" onClick={handleClose} className="rounded-full px-6">
              Annuler
            </Button>
            <Button type="submit" disabled={isSubmitting || !isValid || isUpdating} className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-6">
              {isSubmitting || isUpdating ? "Enregistrement..." : "Enregistrer les modifications"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}