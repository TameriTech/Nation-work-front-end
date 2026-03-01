// components/features/profile/tabs/CompetencesTab.tsx
"use client";
import { useState, useEffect } from "react";
import { Button } from "@/app/components/ui/button";
import { Card } from "@/app/components/ui/card";
import { Icon } from "@iconify/react";
import { useFreelancerProfile } from "@/app/hooks/use-freelancer-profile";
import { AddSkillModal } from "../modals/AddSkillModal";
import { Skill } from "@/app/types/user";
import * as userService from "@/app/services/users.service";

interface SkillGroup {
  id: number;
  name: string;
  tags: string[];
}

export default function CompetencesTabContent() {
  const { skills, removeSkill, loading } = useFreelancerProfile();
  const [showAddSkillModal, setShowAddSkillModal] = useState(false);
  const [availableSkills, setAvailableSkills] = useState<Skill[]>([]);
  const [skillType, setSkillType] = useState<"primary" | "secondary">(
    "primary",
  );

  useEffect(() => {
    loadAvailableSkills();
  }, []);

  const loadAvailableSkills = async () => {
    try {
      // À implémenter: appel API pour récupérer toutes les compétences disponibles
      const skills = await userService.getAllSkills();
      setAvailableSkills(skills);
    } catch (error) {
      console.error("Error loading skills:", error);
    }
  };

  const handleAddSkill = async (
    skillId: number,
    type: string,
    proficiency: number,
  ) => {
    await userService.addSkill(skillId, type, proficiency);
    setShowAddSkillModal(false);
  };

  const handleRemoveSkill = async (skillId: number) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cette compétence ?")) {
      await removeSkill(skillId);
    }
  };

  // Grouper les compétences par type
  const primarySkills = skills.filter((s) => s.skillType === "primary");
  const secondarySkills = skills.filter((s) => s.skillType === "secondary");
  const otherSkills = skills.filter((s) => s.skillType === "other");

  const transformToSkillGroup = (
    freelancerSkills: typeof skills,
  ): SkillGroup[] => {
    return freelancerSkills.map((fs) => ({
      id: fs.id,
      name: fs.skill.name,
      tags: [
        fs.skill.category || "Compétence",
        `Niveau ${fs.proficiencyLevel}/5`,
      ],
    }));
  };

  return (
    <Card className="p-8 rounded-3xl shadow-sm bg-white">
      <div className="space-y-10">
        {/* Compétences Principales */}
        <SkillsSection
          title="Compétences Professionnelles"
          skills={transformToSkillGroup(primarySkills)}
          onAdd={() => {
            setSkillType("primary");
            setShowAddSkillModal(true);
          }}
          onEdit={(id: number) => console.log("Edit skill", id)}
          onDelete={handleRemoveSkill}
        />

        {/* Compétences Secondaires */}
        <SkillsSection
          title="Compétences Secondaires"
          skills={transformToSkillGroup(secondarySkills)}
          onAdd={() => {
            setSkillType("secondary");
            setShowAddSkillModal(true);
          }}
          onEdit={(id: number) => console.log("Edit skill", id)}
          onDelete={handleRemoveSkill}
        />

        {/* Autres Compétences */}
        {otherSkills.length > 0 && (
          <SkillsSection
            title="Autres Compétences"
            skills={transformToSkillGroup(otherSkills)}
            onAdd={() => {
              setSkillType("secondary");
              setShowAddSkillModal(true);
            }}
            onEdit={(id: number) => console.log("Edit skill", id)}
            onDelete={handleRemoveSkill}
          />
        )}
      </div>

      {/* Modal d'ajout de compétence */}
      <AddSkillModal
        isOpen={showAddSkillModal}
        onClose={() => setShowAddSkillModal(false)}
        onSave={handleAddSkill}
        availableSkills={availableSkills}
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
          skills.map((skill: any, index: number) => (
            <div key={skill.id}>
              <div className="flex items-start justify-between py-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Icon icon="bi:star" className="w-5 h-5 text-gray-400" />
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold text-gray-900">
                      {skill.name}
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {skill.tags.map((tag: string, tagIndex: number) => (
                        <span
                          key={tagIndex}
                          className="px-3 py-1 text-sm rounded-full bg-gray-100 text-gray-500"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 flex-shrink-0">
                  <button
                    onClick={() => onEdit?.(skill.id)}
                    className="p-1.5 text-primary hover:text-primary/80 transition-colors"
                  >
                    <Icon
                      icon="bx:bx-edit-alt"
                      className="w-5 h-5 text-blue-900"
                    />
                  </button>
                  <button
                    onClick={() => onDelete?.(skill.id)}
                    className="p-1.5 text-destructive hover:text-destructive/80 transition-colors"
                  >
                    <Icon icon="bi:trash" className="w-5 h-5 text-red-600" />
                  </button>
                </div>
              </div>
              {index < skills.length - 1 && (
                <div className="border-b border-gray-200" />
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
