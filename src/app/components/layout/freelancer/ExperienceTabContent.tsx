"use client";
import { Button } from "@/app/components/ui/button";
import { Icon } from "@iconify/react";

interface ExperienceItem {
  id: string;
  position: string;
  company: string;
  startDate: string;
  endDate: string;
  description: string;
  iconBg: string;
  iconColor: string;
  icon: React.ReactNode;
}

interface EducationItem {
  id: string;
  school: string;
  cycle: string;
  startDate: string;
  endDate: string;
  description: string;
  iconBg: string;
  icon: React.ReactNode;
}

const experienceData: ExperienceItem[] = [
  {
    id: "1",
    position: "Poste Occupé",
    company: "Entreprise 3",
    startDate: "02/24",
    endDate: "03/25",
    description:
      "courte description courte description courte description courte description courte description courte descriptioncourte description courte description courte description courte description courte description courte descriptioncourte description",
    iconBg: "bg-orange-100",
    iconColor: "text-orange-500",
    icon: <Icon icon={"bi:briefcase"} className="w-5 h-5 text-orange-500" />,
  },
  {
    id: "2",
    position: "Poste Occupé",
    company: "Entreprise 2",
    startDate: "02/24",
    endDate: "03/25",
    description:
      "courte description courte description courte description courte description courte description courte descriptioncourte description courte description courte description courte description courte description courte descriptioncourte description",
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
    icon: <Icon icon={"bi:briefcase"} className="w-5 h-5 text-blue-600" />,
  },
  {
    id: "3",
    position: "Poste Occupé",
    company: "Entreprise 1",
    startDate: "02/24",
    endDate: "03/25",
    description:
      "courte description courte description courte description courte description courte description courte descriptioncourte description courte description courte description courte description courte description courte descriptioncourte description",
    iconBg: "bg-red-100",
    iconColor: "text-red-500",
    icon: <Icon icon={"bi:briefcase"} className="w-5 h-5 text-red-500" />,
  },
];

const educationData: EducationItem[] = [
  {
    id: "1",
    school: "Ecole 3",
    cycle: "Cycle_Formation",
    startDate: "02/24",
    endDate: "03/25",
    description:
      "courte description courte description courte description courte description courte description courte descriptioncourte description",
    iconBg: "bg-cyan-100",
    icon: (
      <Icon icon={"bi:mortarboard-fill"} className="w-5 h-5 text-cyan-500" />
    ),
  },
];

function SectionHeader({
  icon,
  title,
  onAdd,
}: {
  icon: React.ReactNode;
  title: string;
  onAdd: () => void;
}) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl text-blue-900 bg-blue-900/10 flex items-center justify-center">
          {icon}
        </div>
        <h3 className="text-xl font-semibold text-blue-900">{title}</h3>
      </div>
      <Button
        onClick={onAdd}
        className="rounded-full bg-blue-900 hover:bg-blue-900/90 text-white px-5 h-10 gap-2"
      >
        <Icon icon={"bi:plus"} className="w-4 h-4" />
        Ajouter
      </Button>
    </div>
  );
}

function ExperienceItemCard({
  item,
  isLast,
}: {
  item: ExperienceItem;
  isLast: boolean;
}) {
  return (
    <div className={`py-5 ${!isLast ? "border-b border-gray-200" : ""}`}>
      <div className="flex items-start gap-4">
        <div
          className={`w-12 h-12 rounded-xl ${item.iconBg} flex items-center justify-center shrink-0`}
        >
          {item.icon}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4 mb-2">
            <div>
              <h4 className="font-semibold text-gray-800">{item.position}</h4>
              <p className="text-sm text-gray-500 italic">{item.company}</p>
            </div>

            <div className="flex items-center gap-4 shrink-0">
              <span className="text-sm text-gray-500 whitespace-nowrap">
                debut_{item.startDate} – fin_{item.endDate}
              </span>
              <div className="flex items-center gap-2">
                <button className="p-1.5 hover:bg-muted rounded-lg transition-colors">
                  <Icon
                    icon={"bx:bx-edit-alt"}
                    className="w-4 h-4 text-blue-900"
                  />
                </button>
                <button className="p-1.5 hover:bg-muted rounded-lg transition-colors">
                  <Icon icon={"bi:trash"} className="w-4 h-4 text-red-600" />
                </button>
              </div>
            </div>
          </div>

          <p className="text-sm text-gray-500 leading-relaxed">
            {item.description}
          </p>
        </div>
      </div>
    </div>
  );
}

function EducationItemCard({
  item,
  isLast,
}: {
  item: EducationItem;
  isLast: boolean;
}) {
  return (
    <div className={`py-5 ${!isLast ? "border-b border-border/40" : ""}`}>
      <div className="flex items-start gap-4">
        <div
          className={`w-12 h-12 rounded-xl ${item.iconBg} flex items-center justify-center shrink-0`}
        >
          {item.icon}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h4 className="font-semibold text-foreground">{item.school}</h4>
              <p className="text-sm text-muted-foreground italic">
                {item.cycle}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                debut_{item.startDate} - fin_{item.endDate}
              </p>
            </div>

            <div className="flex items-start gap-4">
              <p className="text-sm text-muted-foreground leading-relaxed max-w-md">
                {item.description}
              </p>
              <div className="flex items-center gap-2 shrink-0">
                <button className="p-1.5 hover:bg-muted rounded-lg transition-colors">
                  <Icon
                    icon={"bx:bx-edit-alt"}
                    className="w-4 h-4 text-blue-900"
                  />
                </button>
                <button className="p-1.5 hover:bg-muted rounded-lg transition-colors">
                  <Icon icon={"bi:trash"} className="w-4 h-4 text-red-600" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ExperienceTabContent() {
  const handleAddExperience = () => {
    console.log("Add experience");
  };

  const handleAddEducation = () => {
    console.log("Add education");
  };

  return (
    <div className="space-y-6">
      {/* Experience Section */}
      <div className="rounded-3xl bg-white shadow-lg p-8">
        <SectionHeader
          icon={<Icon icon={"bi:briefcase"} className="w-5 h-5 text-primary" />}
          title="Expérience Professionnelle"
          onAdd={handleAddExperience}
        />

        <div>
          {experienceData.map((item, index) => (
            <ExperienceItemCard
              key={item.id}
              item={item}
              isLast={index === experienceData.length - 1}
            />
          ))}
        </div>
      </div>

      {/* Education Section */}
      <div className="rounded-3xl bg-white shadow-lg p-8">
        <SectionHeader
          icon={
            <Icon
              icon={"bi:mortarboard-fill"}
              className="w-5 h-5 text-primary"
            />
          }
          title="Education"
          onAdd={handleAddEducation}
        />

        <div>
          {educationData.map((item, index) => (
            <EducationItemCard
              key={item.id}
              item={item}
              isLast={index === educationData.length - 1}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
