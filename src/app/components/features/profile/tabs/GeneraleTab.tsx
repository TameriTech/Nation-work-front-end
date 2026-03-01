"use client";
import { Button } from "@/app/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import { Icon } from "@iconify/react";
import { useEffect, useState } from "react";
import { useFreelancerProfile } from "@/app/hooks/use-freelancer-profile";
import { EditProfileModal } from "../modals/EditProfileModal";

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
  const { profile, loading, updateProfile } = useFreelancerProfile();
  const [showEditModal, setShowEditModal] = useState(false);
  const [editSection, setEditSection] = useState<
    "professional" | "location" | null
  >(null);

  // Formater les données professionnelles depuis le profil
  const getProfessionalData = () => {
    if (!profile) return [];

    // Compétences combinées
    const primarySkill = profile.primary_skill || "";
    const secondarySkill = profile.secondary_skill || "";
    const otherSkills = profile.other_skills || "";

    const skills = [primarySkill, secondarySkill, otherSkills]
      .filter((skill) => skill)
      .join(", ");

    return [
      {
        label: "Niveau d'étude",
        value: profile.study_level || "-",
      },
      {
        label: "Dernier Diplôme",
        value: profile.last_diploma || "-",
      },
      {
        label: "Années d'expérience",
        value: profile.years_experience
          ? `${profile.years_experience} ans`
          : "-",
      },
      {
        label: "Tarif horaire",
        value: profile.hourly_rate ? `${profile.hourly_rate} €/h` : "-",
      },
      {
        label: "Compétences",
        value: skills || "-",
      },
      {
        label: "Disponible",
        value: profile.is_available ? "Oui" : "Non",
      },
    ];
  };

  // Formater les données de localisation depuis le profil
  const getLocationData = () => {
    if (!profile) return [];

    return [
      { label: "Adresse de Résidence", value: profile.address || "-" },
      { label: "Quartier", value: profile.quarter || "-" },
      { label: "Ville", value: profile.city || "-" },
      { label: "Code Postal", value: profile.postal_code || "-" },
      { label: "Pays", value: profile.country || "-" },
    ];
  };

  const handleEditProfessional = () => {
    setEditSection("professional");
    setShowEditModal(true);
  };

  const handleEditLocation = () => {
    setEditSection("location");
    setShowEditModal(true);
  };

  const handleSaveProfile = async (data: any) => {
    await updateProfile(data);
    setShowEditModal(false);
    setEditSection(null);
  };

  if (loading && !profile) {
    return (
      <div className="space-y-6">
        <InfoCard
          icon={
            <Icon
              icon="bi:briefcase"
              className="h-5 w-5 text-primary-foreground"
            />
          }
          title="Informations Professionnelles"
          data={[]}
          loading={true}
        />
        <InfoCard
          icon={
            <Icon
              icon="bi:geo-alt"
              className="h-5 w-5 text-primary-foreground"
            />
          }
          title="Informations de Localisation"
          data={[]}
          loading={true}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <InfoCard
        icon={
          <Icon
            icon="bi:briefcase"
            className="h-5 w-5 text-primary-foreground"
          />
        }
        title="Informations Professionnelles"
        data={getProfessionalData()}
        onEdit={handleEditProfessional}
      />

      <InfoCard
        icon={
          <Icon icon="bi:geo-alt" className="h-5 w-5 text-primary-foreground" />
        }
        title="Informations de Localisation"
        data={getLocationData()}
        onEdit={handleEditLocation}
      />

      {/* Modal d'édition */}
      {profile && (
        <EditProfileModal
          isOpen={showEditModal}
          onClose={() => {
            setShowEditModal(false);
            setEditSection(null);
          }}
          onSave={handleSaveProfile}
          initialData={profile}
          section={editSection}
        />
      )}
    </div>
  );
}
