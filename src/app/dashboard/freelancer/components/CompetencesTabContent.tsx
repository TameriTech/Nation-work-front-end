"use client";
import { Button } from "@/app/components/ui/button";
import { Card } from "@/app/components/ui/card";
import { Icon } from "@iconify/react";

interface Skill {
  id: string;
  name: string;
  tags: string[];
}

interface SkillsSectionProps {
  title: string;
  skills: Skill[];
  onAdd?: () => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

const SkillsSection = ({
  title,
  skills,
  onAdd,
  onEdit,
  onDelete,
}: SkillsSectionProps) => (
  <div className="space-y-4">
    {/* Section Header */}
    <div className="flex flex-wrap gap-2 items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <svg
            width="35"
            height="35"
            viewBox="0 0 35 35"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect width="35" height="35" rx="10" fill="#DCEFFF" />
            <path
              d="M25 21.0415H20C19.6583 21.0415 19.375 20.7582 19.375 20.4165C19.375 20.0748 19.6583 19.7915 20 19.7915H25C25.3417 19.7915 25.625 20.0748 25.625 20.4165C25.625 20.7582 25.3417 21.0415 25 21.0415Z"
              fill="#05579B"
            />
            <path
              d="M25 24.375H20C19.6583 24.375 19.375 24.0917 19.375 23.75C19.375 23.4083 19.6583 23.125 20 23.125H25C25.3417 23.125 25.625 23.4083 25.625 23.75C25.625 24.0917 25.3417 24.375 25 24.375Z"
              fill="#05579B"
            />
            <path
              d="M25.8333 14.5998V10.8165C25.8333 9.6415 25.3 9.1665 23.975 9.1665H20.6083C19.2833 9.1665 18.75 9.6415 18.75 10.8165V14.5915C18.75 15.7748 19.2833 16.2415 20.6083 16.2415H23.975C25.3 16.2498 25.8333 15.7748 25.8333 14.5998Z"
              fill="#05579B"
            />
            <path
              d="M16.2493 14.5998V10.8165C16.2493 9.6415 15.716 9.1665 14.391 9.1665H11.0243C9.69935 9.1665 9.16602 9.6415 9.16602 10.8165V14.5915C9.16602 15.7748 9.69935 16.2415 11.0243 16.2415H14.391C15.716 16.2498 16.2493 15.7748 16.2493 14.5998Z"
              fill="#05579B"
            />
            <path
              d="M16.2493 23.975V20.6083C16.2493 19.2833 15.716 18.75 14.391 18.75H11.0243C9.69935 18.75 9.16602 19.2833 9.16602 20.6083V23.975C9.16602 25.3 9.69935 25.8333 11.0243 25.8333H14.391C15.716 25.8333 16.2493 25.3 16.2493 23.975Z"
              fill="#05579B"
            />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-blue-900">{title}</h3>
      </div>
      <Button
        onClick={onAdd}
        className="rounded-full bg-blue-900 hover:bg-blue-800 text-white px-4 h-9"
      >
        <Icon icon={"bi:plus"} className="w-4 h-4 mr-1" />
        Ajouter
      </Button>
    </div>

    {/* Skills List */}
    <div className="space-y-0">
      {skills.map((skill, index) => (
        <div key={skill.id}>
          <div className="flex items-start justify-between py-4">
            {/* Left: Icon + Content */}
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg
                  width="30"
                  height="30"
                  viewBox="0 0 30 30"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect width="30" height="30" rx="15" fill="white" />
                  <path
                    d="M18.7507 21.4582H11.2507C10.6257 21.4582 10.1673 21.4332 9.77565 21.3748C7.00898 21.0748 6.45898 19.4165 6.45898 16.6665V13.3332C6.45898 10.5832 7.00898 8.92484 9.80065 8.6165C10.1673 8.5665 10.6257 8.5415 11.2507 8.5415H18.7507C19.3757 8.5415 19.834 8.5665 20.2257 8.62484C23.0007 8.93317 23.5423 10.5832 23.5423 13.3332V16.6665C23.5423 19.4165 22.9923 21.0748 20.2007 21.3832C19.834 21.4332 19.3757 21.4582 18.7507 21.4582ZM11.2507 9.7915C10.684 9.7915 10.284 9.8165 9.95898 9.85817C8.26732 10.0498 7.70898 10.5748 7.70898 13.3332V16.6665C7.70898 19.4248 8.26732 19.9498 9.93398 20.1415C10.284 20.1915 10.684 20.2082 11.2507 20.2082H18.7507C19.3173 20.2082 19.7173 20.1832 20.0423 20.1415C21.734 19.9582 22.2923 19.4248 22.2923 16.6665V13.3332C22.2923 10.5748 21.734 10.0498 20.0673 9.85817C19.7173 9.80817 19.3173 9.7915 18.7507 9.7915H11.2507V9.7915Z"
                    fill="#BDBDBD"
                  />
                  <path
                    d="M21.25 7.2915H8.75C8.40833 7.2915 8.125 7.00817 8.125 6.6665C8.125 6.32484 8.40833 6.0415 8.75 6.0415H21.25C21.5917 6.0415 21.875 6.32484 21.875 6.6665C21.875 7.00817 21.5917 7.2915 21.25 7.2915Z"
                    fill="#BDBDBD"
                  />
                  <path
                    d="M21.666 23.9585H9.16602C8.82435 23.9585 8.54102 23.6752 8.54102 23.3335C8.54102 22.9918 8.82435 22.7085 9.16602 22.7085H21.666C22.0077 22.7085 22.291 22.9918 22.291 23.3335C22.291 23.6752 22.0077 23.9585 21.666 23.9585Z"
                    fill="#BDBDBD"
                  />
                </svg>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-gray-900">{skill.name}</h4>
                <div className="flex flex-wrap gap-2">
                  {skill.tags.map((tag, tagIndex) => (
                    <span
                      key={tagIndex}
                      className="px-3 py-1 text-sm rounded-full bg-muted text-gray-500 bg-gray-100"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-3 flex-shrink-0">
              <button
                onClick={() => onEdit?.(skill.id)}
                className="p-1.5 text-primary hover:text-primary/80 transition-colors"
              >
                <Icon
                  icon={"bx:bx-edit-alt"}
                  className="w-5 h-5 text-blue-900"
                />
              </button>
              <button
                onClick={() => onDelete?.(skill.id)}
                className="p-1.5 text-destructive hover:text-destructive/80 transition-colors"
              >
                <Icon icon={"bi:trash"} className="w-5 h-5 text-red-600" />
              </button>
            </div>
          </div>
          {index < skills.length - 1 && (
            <div className="border-b border-gray-200" />
          )}
        </div>
      ))}
    </div>
  </div>
);

const CompetencesTabContent = () => {
  const professionalSkills: Skill[] = [
    {
      id: "1",
      name: "Nom Compétence 3",
      tags: ["spécialité", "outil", "outil"],
    },
    {
      id: "2",
      name: "Nom Compétence 2",
      tags: ["spécialité", "outil", "outil"],
    },
    {
      id: "3",
      name: "Nom Compétence 1 : Ui Design",
      tags: ["Figma", "Adobe XD", "Sketch", "Wireframe"],
    },
  ];

  const secondarySkills: Skill[] = [
    {
      id: "4",
      name: "Nom Compétence 3",
      tags: ["spécialité", "outil", "outil"],
    },
    {
      id: "5",
      name: "Nom Compétence 2",
      tags: ["spécialité", "outil", "outil"],
    },
    {
      id: "6",
      name: "Nom Compétence 1 : Ménage",
      tags: ["Ménage", "Nettoyage de vitre", "Nettoyage", "Lessive"],
    },
  ];

  return (
    <Card className="p-8 rounded-3xl shadow-sm bg-white">
      <div className="space-y-10">
        <SkillsSection
          title="Compétences Professionnelles"
          skills={professionalSkills}
          onAdd={() => console.log("Add professional skill")}
          onEdit={(id) => console.log("Edit skill", id)}
          onDelete={(id) => console.log("Delete skill", id)}
        />

        <SkillsSection
          title="Compétences Secondaires"
          skills={secondarySkills}
          onAdd={() => console.log("Add secondary skill")}
          onEdit={(id) => console.log("Edit skill", id)}
          onDelete={(id) => console.log("Delete skill", id)}
        />
      </div>
    </Card>
  );
};

export default CompetencesTabContent;
