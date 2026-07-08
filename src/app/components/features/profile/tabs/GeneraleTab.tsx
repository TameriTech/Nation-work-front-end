// components/features/profile/tabs/GeneraleTabContent.tsx (Version alternative)
"use client";
import { Button } from "@/app/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import { Icon } from "@iconify/react";
import { useState } from "react";
import { useprovider } from "@/app/hooks/provider-profile/use-profile";
import { 
  ProfessionalEditModal, 
  LocationEditModal, 
  SocialEditModal 
} from "../modals/EditProfileModal";
import type { providerProfileUpdateFormData } from "@/app/lib/validators";

interface InfoCardProps {
  icon: React.ReactNode;
  title: string;
  data: { label: string; value: string }[];
  onEdit?: () => void;
  loading?: boolean;
}

function InfoCard({ icon, title, data, onEdit, loading }: InfoCardProps) {
  return (
    <Card className="rounded-3xl shadow-lg border-0 bg-white">
      <CardHeader className="flex flex-row flex-wrap items-center justify-between pb-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-blue-900 text-white flex items-center justify-center">
            {icon}
          </div>
          <CardTitle className="text-lg font-semibold text-gray-800">
            {title}
          </CardTitle>
        </div>
        <Button
          onClick={onEdit}
          className="rounded-full bg-blue-900 hover:bg-blue-800 text-white gap-2 px-5"
          disabled={loading}
        >
          <Icon icon={"bx:bx-edit-alt"} className="h-4 w-4" />
          Modifier
        </Button>
      </CardHeader>
      <CardContent className="pt-0">
        {loading ? (
          <div className="py-8 text-center text-gray-500">Chargement...</div>
        ) : (
          <div className="space-y-0 divide-y divide-border/40">
            {data.map((item, index) => (
              <div
                key={index}
                className="grid grid-cols-2 border-gray-200 gap-4 py-4"
              >
                <span className="text-sm text-gray-800">{item.label}</span>
                <span className="text-sm font-medium text-gray-800">
                  {item.value || "-"}
                </span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function GeneraleTabContent() {
  const { profile, updateProfile, isLoading } = useprovider();
  const [activeModal, setActiveModal] = useState<"professional" | "location" | "social" | null>(null);

  // Formater les données professionnelles depuis le profil
  const getProfessionalData = () => {
    if (!profile) return [];

    const primarySkill = profile.primary_skill || "";
    const secondarySkill = profile.secondary_skill || "";
    const otherSkills = profile.skills_list?.join(", ") || "";
    const skills = [primarySkill, secondarySkill, otherSkills]
      .filter((skill) => skill)
      .join(", ");

    return [
      { label: "Niveau d'étude", value: profile.study_level || "-" },
      { label: "Dernier Diplôme", value: profile.last_diploma || "-" },
      { label: "Années d'expérience", value: profile.years_experience ? `${profile.years_experience} ans` : "-" },
      { label: "Tarif horaire", value: profile.hourly_rate ? `${profile.hourly_rate} €/h` : "-" },
      { label: "Compétences", value: skills || "-" },
      { label: "Disponible", value: profile.is_available ? "Oui" : "Non" },
      { label: "Nationalité", value: profile.nationality || "-" },
      { label: "Genre", value: profile.gender || "-" },
    ];
  };

  // Formater les données de localisation depuis le profil
  const getLocationData = () => {
    if (!profile) return [];

    return [
      { label: "Adresse de Résidence", value: profile.location?.address || "-" },
      { label: "Quartier", value: profile.location?.quarter || "-" },
      { label: "Ville", value: profile.location?.city || "-" },
      { label: "Code Postal", value: profile.location?.postal_code || "-" },
      { label: "Pays", value: profile.location?.country || "-" },
      { label: "Téléphone", value: profile.user?.phone_number || "-" },
    ];
  };

  // Formater les données de contact
  const getContactData = () => {
    if (!profile) return [];

    return [
      { label: "Site web", value: profile.user?.website || "-" },
      { label: "LinkedIn", value: profile.user?.linkedin || "-" },
      { label: "Twitter", value: profile.user?.twitter || "-" },
      { label: "GitHub", value: profile.user?.github || "-" },
      { label: "Behance", value: profile.user?.behance || "-" },
      { label: "Dribbble", value: profile.user?.dribbble || "-" },
      { label: "Téléphone", value: profile.user?.phone_number || "-" },
    ];
  };

  const handleSave = async (data: providerProfileUpdateFormData) => {
    await updateProfile(data);
    setActiveModal(null);
  };

  if (isLoading && !profile) {
    return (
      <div className="space-y-6">
        <InfoCard icon={<Icon icon="bi:briefcase" className="h-5 w-5" />} title="Informations Professionnelles" data={[]} loading={true} />
        <InfoCard icon={<Icon icon="bi:geo-alt" className="h-5 w-5" />} title="Informations de Localisation" data={[]} loading={true} />
        <InfoCard icon={<Icon icon="bi:share" className="h-5 w-5" />} title="Informations de contact" data={[]} loading={true} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <InfoCard
        icon={<Icon icon="bi:briefcase" className="h-5 w-5" />}
        title="Informations Professionnelles"
        data={getProfessionalData()}
        onEdit={() => setActiveModal("professional")}
      />

      <InfoCard
        icon={<Icon icon="bi:geo-alt" className="h-5 w-5" />}
        title="Informations de Localisation"
        data={getLocationData()}
        onEdit={() => setActiveModal("location")}
      />

      <InfoCard
        icon={<Icon icon="bi:share" className="h-5 w-5" />}
        title="Informations de contact"
        data={getContactData()}
        onEdit={() => setActiveModal("social")}
      />

      {/* Modals conditionnels */}
      {profile && activeModal === "professional" && (
        <ProfessionalEditModal
          isOpen={true}
          onClose={() => setActiveModal(null)}
          onSave={handleSave}
          initialData={profile}
        />
      )}

      {profile && activeModal === "location" && (
        <LocationEditModal
          isOpen={true}
          onClose={() => setActiveModal(null)}
          onSave={handleSave}
          initialData={profile}
        />
      )}

      {profile && activeModal === "social" && (
        <SocialEditModal
          isOpen={true}
          onClose={() => setActiveModal(null)}
          onSave={handleSave}
          initialData={profile}
        />
      )}
    </div>
  );
}