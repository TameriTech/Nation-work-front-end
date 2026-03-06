// components/features/profile/tabs/CompetencesTabContent.tsx
"use client";
import { useState, useEffect } from "react";
import { Button } from "@/app/components/ui/button";
import { Card } from "@/app/components/ui/card";
import { Icon } from "@iconify/react";
import { useSkills } from "@/app/hooks/profile/use-skills";
import { AddSkillModal } from "../modals/AddSkillModal";
import { Skill, FreelancerSkill } from "@/app/types/user";

export default function CompetencesTabContent() {
  const {
    mySkills,
    allSkills,
    isLoading,
    addSkill,
    removeSkill,
    updateSkill,
    getAvailableSkills,
    getSkillsByType,
  } = useSkills();

  const [showAddSkillModal, setShowAddSkillModal] = useState(false);
  const [editingSkill, setEditingSkill] = useState<FreelancerSkill | null>(
    null,
  );

  const { primary, secondary, other } = getSkillsByType();
  const availableSkills = getAvailableSkills();

  const handleAddSkill = async (
    skillId: number,
    skillType: string,
    proficiency: number,
  ) => {
    if (editingSkill) {
      await updateSkill({
        skillId: editingSkill.id,
        type: skillType,
        proficiency,
      });
      setEditingSkill(null);
    } else {
      await addSkill({ skillId, type: skillType, proficiency });
    }
  };

  const handleEditSkill = (skill: FreelancerSkill) => {
    setEditingSkill(skill);
    setShowAddSkillModal(true);
  };

  const handleRemoveSkill = async (skillId: number) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cette compétence ?")) {
      await removeSkill(skillId);
    }
  };

  if (isLoading) {
    return (
      <Card className="p-8 rounded-3xl shadow-sm bg-white">
        <div className="text-center py-8">Chargement...</div>
      </Card>
    );
  }

  return (
    <Card className="p-8 rounded-3xl shadow-sm bg-white">
      <div className="space-y-10">
        {/* Compétences Principales */}
        <SkillsSection
          title="Compétences Professionnelles"
          skills={primary}
          onAdd={() => {
            setEditingSkill(null);
            setShowAddSkillModal(true);
          }}
          onEdit={handleEditSkill}
          onDelete={handleRemoveSkill}
        />

        {/* Compétences Secondaires */}
        <SkillsSection
          title="Compétences Secondaires"
          skills={secondary}
          onAdd={() => {
            setEditingSkill(null);
            setShowAddSkillModal(true);
          }}
          onEdit={handleEditSkill}
          onDelete={handleRemoveSkill}
        />

        {/* Autres Compétences */}
        {other.length > 0 && (
          <SkillsSection
            title="Autres Compétences"
            skills={other}
            onAdd={() => {
              setEditingSkill(null);
              setShowAddSkillModal(true);
            }}
            onEdit={handleEditSkill}
            onDelete={handleRemoveSkill}
          />
        )}
      </div>

      {/* Modal d'ajout de compétence */}
      <AddSkillModal
        isOpen={showAddSkillModal}
        onClose={() => {
          setShowAddSkillModal(false);
          setEditingSkill(null);
        }}
        onSave={handleAddSkill}
        availableSkills={availableSkills}
        initialData={
          editingSkill
            ? {
                skillId: editingSkill.skill_id,
                skillType: editingSkill.skill_type,
                proficiency: editingSkill.proficiency_level,
              }
            : undefined
        }
        isEditing={!!editingSkill}
      />
    </Card>
  );
}

// Composant SkillsSection réutilisable
function SkillsSection({ title, skills, onAdd, onEdit, onDelete }: any) {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Icon icon="bi:star" className="w-5 h-5 text-blue-900" />
          </div>
          <h3 className="text-lg font-semibold text-blue-900">{title}</h3>
        </div>
        <Button
          onClick={onAdd}
          className="rounded-full bg-blue-900 hover:bg-blue-800 text-white px-4 h-9"
        >
          <Icon icon="bi:plus" className="w-4 h-4 mr-1" />
          Ajouter
        </Button>
      </div>

      <div className="space-y-0">
        {skills.length === 0 ? (
          <p className="text-gray-500 text-center py-4">
            Aucune compétence ajoutée
          </p>
        ) : (
          skills.map((skill: FreelancerSkill, index: number) => (
            <SkillItem
              key={skill.id}
              skill={skill}
              onEdit={onEdit}
              onDelete={onDelete}
              isLast={index === skills.length - 1}
            />
          ))
        )}
      </div>
    </div>
  );
}

function SkillItem({ skill, onEdit, onDelete, isLast }: any) {
  const getProficiencyLabel = (level: number) => {
    const labels = [
      "",
      "Débutant",
      "Intermédiaire",
      "Avancé",
      "Expert",
      "Expert+",
    ];
    return labels[level] || `Niveau ${level}`;
  };

  return (
    <div>
      <div className="flex items-start justify-between py-4">
        <div className="flex items-start gap-4 flex-1">
          <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
            <Icon icon="bi:star" className="w-5 h-5 text-blue-600" />
          </div>
          <div className="space-y-2 flex-1">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-gray-900">
                {skill.skill.name}
              </h4>
              <span className="text-sm text-blue-600 font-medium">
                {getProficiencyLabel(skill.proficiency_level)}
              </span>
            </div>

            {/* Barre de progression du niveau */}
            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-600 rounded-full"
                style={{ width: `${(skill.proficiency_level / 5) * 100}%` }}
              />
            </div>

            <div className="flex flex-wrap gap-2 mt-2">
              <span className="px-2 py-0.5 text-xs rounded-full bg-blue-50 text-blue-700">
                {skill.skill_type === "primary"
                  ? "Principale"
                  : skill.skill_type === "secondary"
                    ? "Secondaire"
                    : "Autre"}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 flex-shrink-0 ml-4">
          <button
            onClick={() => onEdit(skill)}
            className="p-1.5 text-primary hover:text-primary/80 transition-colors"
            title="Modifier"
          >
            <Icon icon="bx:bx-edit-alt" className="w-5 h-5 text-blue-900" />
          </button>
          <button
            onClick={() => onDelete(skill.id)}
            className="p-1.5 text-destructive hover:text-destructive/80 transition-colors"
            title="Supprimer"
          >
            <Icon icon="bi:trash" className="w-5 h-5 text-red-600" />
          </button>
        </div>
      </div>
      {!isLast && <div className="border-b border-gray-200" />}
    </div>
  );
}
