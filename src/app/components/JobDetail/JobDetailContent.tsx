"use client";
import ProgressStepper from "./ProgressStepper";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/app/components/ui/breadcrumb";
import { Icon } from "@iconify/react";
import { Button } from "../../ui/button";

const JobDetailContent = ({ applied }: { applied: boolean }) => {
  const skills = [
    "compétence 1",
    "compétence 2",
    "compétence 3",
    "compétence N",
  ];

  return (
    <div className="w-full space-y-6">
      {/* Breadcrumb */}
      <Breadcrumb>
        <BreadcrumbList className="text-gray-500">
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Accueil</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/jobs">Trouvez une offre</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="font-semibold text-gray-500 underline">
              Nom du travail
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Title and Progress */}
      <div className="flex items-start justify-between gap-2">
        <h1 className="text-3xl font-bold text-blue-900">Nom du travail</h1>
        {applied ? (
          <ProgressStepper />
        ) : (
          <div className="flex gap-4">
            <Button className="bg-transparent text-blue-900 border-blue-900 border rounded-full flex gap-2">
              <Icon icon={"bi:chat"} />
              Poser une question
            </Button>
            <Button className="bg-blue-900 text-white border-blue-900 rounded-full flex gap-2">
              <Icon icon={"bi:check"} />
              Postuler
            </Button>
          </div>
        )}
      </div>

      {/* Description */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-gray-800">Description</h2>
          <span className="text-sm text-gray-500">Posté il y a 6 j</span>
        </div>
        <div className="space-y-4 text-gray-500">
          <p>
            Courte description du job Courte description du job Courte
            description du job Courte description du job. Courte description du
            job Courte description du job Courte description du job Courte
            description du job Courte.
          </p>
          <p>
            Courte description du job Courte description du job Courte
            description du job Courte description du job. Courte description du
            job Courte description du job Courte description du job Courte
            description du job.Courte description du job Courte description du
            job Courte description du job Courte description du job Courte.
          </p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>Exigence spécifique 1</li>
            <li>Exigence spécifique 2</li>
            <li>Exigence spécifique 3</li>
          </ul>
        </div>
      </div>

      {/* Project Tracking Section */}
      <div className="relative">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800">
            Suivi du Projet & Livraison
          </h2>
          <button className="w-10 h-10 rounded-full bg-blue-900 text-white flex items-center justify-center hover:bg-blue-800 transition-colors">
            <Icon icon={"bx:bookmark"} className="w-5 h-5" />
          </button>
        </div>
        <div className="bg-gray-100 rounded-xl p-5 grid grid-cols-3 gap-6">
          <div>
            <p className="text-sm text-gray-600 mb-1">Deadline</p>
            <p className="font-medium text-orange-500">
              Livraison attendue le 20 Oct (Dans 3 jours)
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">
              {"Nombre d'heure par semaine"}
            </p>
            <p className="font-medium text-gray-800">Moins de 35h</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Durée du projet</p>
            <p className="font-medium text-gray-800">{"Moins d'un Mois"}</p>
          </div>
        </div>
      </div>

      {/* Information Section */}
      <div>
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Informations
        </h2>
        <div className="bg-gray-100 rounded-xl p-5 grid grid-cols-3 gap-6">
          <div>
            <p className="text-sm text-gray-600 mb-1">Niveau</p>
            <p className="font-medium text-gray-800">{"Niveau d'expérience"}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Précision</p>
            <p className="font-medium text-gray-800">Véhicule requis</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">
              Rémunération estimé / H
            </p>
            <p className="font-semibold text-gray-800 text-lg">
              1000 Frs - 2500 Frs
            </p>
          </div>
        </div>
      </div>

      {/* Skills Section */}
      <div>
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Compétences
        </h2>
        <div className="flex flex-wrap gap-2">
          {skills.map((skill) => (
            <span
              key={skill}
              className="px-4 py-2 bg-blue-900/10 text-blue-900 rounded-full text-sm font-medium"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default JobDetailContent;
