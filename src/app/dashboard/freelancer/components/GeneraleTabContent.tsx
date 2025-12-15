"use client";
import { Button } from "@/app/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import { Icon } from "@iconify/react";

interface InfoCardProps {
  icon: React.ReactNode;
  title: string;
  data: { label: string; value: string }[];
  onEdit?: () => void;
}

function InfoCard({ icon, title, data, onEdit }: InfoCardProps) {
  return (
    <Card className="rounded-3xl shadow-lg border-0 bg-white">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
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
        >
          <Icon icon={"bx:bx-edit-alt"} className="h-4 w-4" />
          Modifier
        </Button>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-0 divide-y  divide-border/40">
          {data.map((item, index) => (
            <div
              key={index}
              className="grid grid-cols-2 border-gray-200 gap-4 py-4"
            >
              <span className="text-sm text-gray-800">{item.label}</span>
              <span className="text-sm font-medium text-gray-800">
                {item.value}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

const professionalData = [
  { label: "Niveau d'étude", value: "Université Premier Cicle" },
  { label: "Dernier Diplome", value: "Baccalauréat" },
  {
    label: "Compétence acquise",
    value: "Organisation, sens des responsabilités.",
  },
  {
    label: "Compétence Secondaire",
    value: "Aide aux devoirs (primaire/collège)",
  },
  { label: "Autre compétence", value: "-" },
];

const locationData = [
  { label: "Adresse de Résidence", value: "Akwa Nord" },
  { label: "Quartier", value: "-" },
  { label: "Ville", value: "Douala" },
  { label: "Carte Postal", value: "00000" },
  { label: "Pays", value: "Cameroun" },
];

export function GeneraleTabContent() {
  return (
    <div className="space-y-6">
      <InfoCard
        icon={
          <Icon
            icon={"bi:briefcase"}
            className="h-5 w-5 text-primary-foreground"
          />
        }
        title="Informations Professionnelles"
        data={professionalData}
        onEdit={() => console.log("Edit professional info")}
      />

      <InfoCard
        icon={
          <Icon
            icon={"bi:geo-alt"}
            className="h-5 w-5 text-primary-foreground"
          />
        }
        title="Informations de Localisation"
        data={locationData}
        onEdit={() => console.log("Edit location info")}
      />
    </div>
  );
}
