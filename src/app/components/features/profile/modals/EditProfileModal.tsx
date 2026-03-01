// components/features/profile/modals/EditProfileModal.tsx
"use client";
import { useState, useEffect } from "react";
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
import { UpdateFreelancerProfileData } from "@/app/types/user";

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: UpdateFreelancerProfileData) => Promise<void>;
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
  const [formData, setFormData] = useState<UpdateFreelancerProfileData>({});
  const [loading, setLoading] = useState(false);

  // Initialiser le formulaire quand la modal s'ouvre
  useEffect(() => {
    if (initialData && section) {
      if (section === "professional") {
        setFormData({
          study_level: initialData.study_level || null,
          last_diploma: initialData.last_diploma || null,
          primary_skill: initialData.primary_skill || null,
          secondary_skill: initialData.secondary_skill || null,
          other_skills: initialData.other_skills || null,
          years_experience: initialData.years_experience || 0,
          hourly_rate: initialData.hourly_rate || 0,
          summary: initialData.summary || null,
          nationality: initialData.nationality || null,
          gender: initialData.gender || null,
          age: initialData.age || null,
          is_available: initialData.is_available,
          // Also include location fields if they exist in professional section
          address: initialData.address || null,
          quarter: initialData.quarter || null,
          city: initialData.city || null,
          postal_code: initialData.postal_code || null,
          country: initialData.country || null,
          phone_number: initialData.user?.phone_number || null,
        });
      } else if (section === "location") {
        setFormData({
          address: initialData.address || null,
          quarter: initialData.quarter || null,
          city: initialData.city || null,
          postal_code: initialData.postal_code || null,
          country: initialData.country || null,
          phone_number: initialData.user?.phone_number || null,
          // Keep existing professional data
          study_level: initialData.study_level || null,
          last_diploma: initialData.last_diploma || null,
          primary_skill: initialData.primary_skill || null,
          secondary_skill: initialData.secondary_skill || null,
          other_skills: initialData.other_skills || null,
          years_experience: initialData.years_experience || 0,
          hourly_rate: initialData.hourly_rate || 0,
          summary: initialData.summary || null,
          nationality: initialData.country || null,
          gender: initialData.gender || null,
          age: initialData.age || null,
          is_available: initialData.is_available,
        });
      }
    }
  }, [initialData, section, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Filter out null values and only send fields that have been changed
      const dataToSend = Object.fromEntries(
        Object.entries(formData).filter(
          ([_, value]) => value !== null && value !== undefined,
        ),
      );
      await onSave(dataToSend);
      onClose(); // Close modal after successful save
    } catch (error) {
      console.error("Error saving profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    field: keyof UpdateFreelancerProfileData,
    value: any,
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const getTitle = () => {
    if (section === "professional")
      return "Modifier les informations professionnelles";
    if (section === "location")
      return "Modifier les informations de localisation";
    return "Modifier le profil";
  };

  if (!section) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-gray-800">{getTitle()}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          {section === "professional" && (
            <>
              {/* Niveau d'étude */}
              <div className="space-y-2">
                <Label className="text-gray-800" htmlFor="study_level">
                  Niveau d'étude
                </Label>
                <Select
                  value={formData.study_level || ""}
                  onValueChange={(value) => handleChange("study_level", value)}
                >
                  <SelectTrigger className="bg-white text-gray-800 active:ring-0 active:outline-0 focus:ring-0 focus:outline-0">
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
              </div>

              {/* Dernier diplôme */}
              <div className="space-y-2">
                <Label className="text-gray-800" htmlFor="last_diploma">
                  Dernier diplôme
                </Label>
                <Input
                  id="last_diploma"
                  className="bg-white"
                  value={formData.last_diploma || ""}
                  onChange={(e) => handleChange("last_diploma", e.target.value)}
                  placeholder="Ex: Master en Informatique"
                />
              </div>

              {/* Années d'expérience et Tarif horaire */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-gray-800" htmlFor="years_experience">
                    Années d'expérience
                  </Label>
                  <Input
                    id="years_experience"
                    className="bg-white"
                    type="number"
                    min="0"
                    value={formData.years_experience || 0}
                    onChange={(e) =>
                      handleChange(
                        "years_experience",
                        parseInt(e.target.value) || 0,
                      )
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-800" htmlFor="hourly_rate">
                    Tarif horaire (FCFA)
                  </Label>
                  <Input
                    id="hourly_rate"
                    className="bg-white"
                    type="number"
                    min="0"
                    step="100"
                    value={formData.hourly_rate || 0}
                    onChange={(e) =>
                      handleChange(
                        "hourly_rate",
                        parseFloat(e.target.value) || 0,
                      )
                    }
                  />
                </div>
              </div>

              {/* Compétence principale */}
              <div className="space-y-2">
                <Label className="text-gray-800" htmlFor="primary_skill">
                  Compétence principale
                </Label>
                <Input
                  id="primary_skill"
                  className="bg-white"
                  value={formData.primary_skill || ""}
                  onChange={(e) =>
                    handleChange("primary_skill", e.target.value)
                  }
                  placeholder="Ex: Développement Web"
                />
              </div>

              {/* Compétence secondaire */}
              <div className="space-y-2">
                <Label className="text-gray-800" htmlFor="secondary_skill">
                  Compétence secondaire
                </Label>
                <Input
                  id="secondary_skill"
                  className="bg-white"
                  value={formData.secondary_skill || ""}
                  onChange={(e) =>
                    handleChange("secondary_skill", e.target.value)
                  }
                  placeholder="Ex: Design UI/UX"
                />
              </div>

              {/* Autres compétences */}
              <div className="space-y-2">
                <Label className="text-gray-800" htmlFor="other_skills">
                  Autres compétences
                </Label>
                <Textarea
                  id="other_skills"
                  className="bg-white"
                  value={formData.other_skills || ""}
                  onChange={(e) => handleChange("other_skills", e.target.value)}
                  placeholder="Séparez les compétences par des virgules"
                  rows={3}
                />
              </div>

              {/* Bio / Résumé */}
              <div className="space-y-2">
                <Label className="text-gray-800" htmlFor="summary">
                  Bio / Résumé
                </Label>
                <Textarea
                  id="summary"
                  className="bg-white"
                  value={formData.summary || ""}
                  onChange={(e) => handleChange("summary", e.target.value)}
                  placeholder="Présentez-vous en quelques phrases..."
                  rows={4}
                />
              </div>

              {/* Nationalité et Âge */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-gray-800" htmlFor="nationality">
                    Nationalité
                  </Label>
                  <Input
                    id="nationality"
                    className="bg-white"
                    value={formData.nationality || ""}
                    onChange={(e) =>
                      handleChange("nationality", e.target.value)
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-800" htmlFor="age">
                    Âge
                  </Label>
                  <Input
                    id="age"
                    className="bg-white"
                    type="number"
                    min="18"
                    value={formData.age || ""}
                    onChange={(e) =>
                      handleChange("age", parseInt(e.target.value) || null)
                    }
                  />
                </div>
              </div>

              {/* Genre */}
              <div className="space-y-2">
                <Label className="text-gray-800" htmlFor="gender">
                  Genre
                </Label>
                <Select
                  value={formData.gender || ""}
                  onValueChange={(value) => handleChange("gender", value)}
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
                <Label className="text-gray-800" htmlFor="phone_number">
                  Téléphone
                </Label>
                <Input
                  id="phone_number"
                  className="bg-white"
                  value={formData.phone_number || ""}
                  onChange={(e) => handleChange("phone_number", e.target.value)}
                  placeholder="Ex: +237 655 31 60 13"
                />
              </div>

              {/* Disponibilité */}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="is_available"
                  className="bg-white text-gray-800"
                  checked={formData.is_available || false}
                  onCheckedChange={(checked) =>
                    handleChange("is_available", checked)
                  }
                />
                <Label className="text-gray-800" htmlFor="is_available">
                  Disponible pour de nouvelles missions
                </Label>
              </div>
            </>
          )}

          {section === "location" && (
            <>
              {/* Adresse */}
              <div className="space-y-2">
                <Label className="text-gray-800" htmlFor="address">
                  Adresse de résidence
                </Label>
                <Input
                  id="address"
                  className="bg-white"
                  value={formData.address || ""}
                  onChange={(e) => handleChange("address", e.target.value)}
                  placeholder="Ex: 123 Rue Principale"
                />
              </div>

              {/* Quartier */}
              <div className="space-y-2">
                <Label className="text-gray-800" htmlFor="quarter">
                  Quartier
                </Label>
                <Input
                  id="quarter"
                  className="bg-white"
                  value={formData.quarter || ""}
                  onChange={(e) => handleChange("quarter", e.target.value)}
                  placeholder="Ex: Akwa, Bonanjo, etc."
                />
              </div>

              {/* Ville et Code postal */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-gray-800" htmlFor="city">
                    Ville
                  </Label>
                  <Input
                    id="city"
                    className="bg-white"
                    value={formData.city || ""}
                    onChange={(e) => handleChange("city", e.target.value)}
                    placeholder="Ex: Douala"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-800" htmlFor="postal_code">
                    Code postal
                  </Label>
                  <Input
                    id="postal_code"
                    className="bg-white"
                    value={formData.postal_code || ""}
                    onChange={(e) =>
                      handleChange("postal_code", e.target.value)
                    }
                    placeholder="Ex: 00000"
                  />
                </div>
              </div>

              {/* Pays */}
              <div className="space-y-2">
                <Label className="text-gray-800" htmlFor="country">
                  Pays
                </Label>
                <Input
                  id="country"
                  className="bg-white"
                  value={formData.country || ""}
                  onChange={(e) => handleChange("country", e.target.value)}
                  placeholder="Ex: Cameroun"
                />
              </div>

              {/* Téléphone (aussi dans location) */}
              <div className="space-y-2">
                <Label className="text-gray-800" htmlFor="phone_number">
                  Téléphone
                </Label>
                <Input
                  id="phone_number"
                  className="bg-white"
                  value={formData.phone_number || ""}
                  onChange={(e) => handleChange("phone_number", e.target.value)}
                  placeholder="Ex: +237 655 31 60 13"
                />
              </div>
            </>
          )}

          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 focus:ring-0 focus:outline-0"
            >
              {loading ? "Enregistrement..." : "Enregistrer"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
