// app/(dashboard)/provider/profile/page.tsx - Page principale du profil (vue d'ensemble)
"use client";

import { useState } from "react";
import Link from "next/link";
import { Icon } from "@iconify/react";
import { useprovider } from "@/app/hooks/provider-profile/use-profile";
import { Button } from "@/app/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/app/components/ui/avatar";
import { Badge } from "@/app/components/ui/badge";
import { Card } from "@/app/components/ui/card";

export default function providerProfileOverviewPage() {
  const { profile, isLoading } = useprovider();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">Chargement...</div>
      </div>
    );
  }

  const modules = [
    {
      title: "Informations personnelles",
      description: "Gérez vos informations de base, votre bio et vos coordonnées",
      icon: "ph:user",
      href: "/dashboard/provider/profile/profile-settings",
      color: "bg-blue-500",
    },
    {
      title: "Expérience & Formation",
      description: "Ajoutez vos expériences professionnelles et votre parcours académique",
      icon: "ph:briefcase",
      href: "/dashboard/provider/profile/experiences",
      color: "bg-green-500",
    },
    {
      title: "Compétences",
      description: "Gérez vos compétences et votre niveau de maîtrise",
      icon: "ph:code",
      href: "/dashboard/provider/profile/skills",
      color: "bg-purple-500",
    },
    {
      title: "Documents & Vérification",
      description: "Téléchargez vos documents pour la vérification KYC",
      icon: "ph:file-text",
      href: "/dashboard/provider/profile/verifications",
      color: "bg-amber-500",
    },
    {
      title: "Avis & Évaluations",
      description: "Consultez et répondez aux avis de vos clients",
      icon: "ph:star",
      href: "/dashboard/provider/profile/reviews",
      color: "bg-yellow-500",
    },
    {
      title: "Portfolio",
      description: "Présentez vos meilleurs projets et réalisations",
      icon: "ph:images",
      href: "/dashboard/provider/profile/portfolio",
      color: "bg-pink-500",
    },
  ];

  const getInitials = (name: string) => {
    return name?.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) || "U";
  };

  return (
    <div className="min-h-screen bg-background dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-16">
        {/* En-tête du profil */}
        <div className="bg-surface dark:bg-gray-800 rounded-2xl p-6 mb-8 border border-gray-100 dark:border-gray-700">
          <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
            <Avatar className="w-24 h-24 ring-4 ring-primary/20 dark:ring-primary-400/20">
              <AvatarImage src={profile?.user?.profile_picture} />
              <AvatarFallback className="bg-gradient-to-br from-primary to-primary/70 text-white text-2xl">
                {getInitials(profile?.user?.username || "")}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-2">
                <h1 className="text-2xl font-bold text-text-primary dark:text-gray-100">
                  {profile?.user?.username || "Freelance"}
                </h1>
                {profile?.is_identity_verified && (
                  <Badge className="bg-success/10 text-success border-0">
                    <Icon icon="ph:check-circle" className="w-3 h-3 mr-1" />
                    Vérifié
                  </Badge>
                )}
              </div>
              <p className="text-text-secondary dark:text-gray-400 mb-2">
                {profile?.professional_title || "Ajoutez votre titre professionnel"}
              </p>
              <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm">
                <div className="flex items-center gap-1 text-text-secondary">
                  <Icon icon="ph:star" className="w-4 h-4 text-yellow-500" />
                  <span>{profile?.average_rating || 0} (avis)</span>
                </div>
                <div className="flex items-center gap-1 text-text-secondary">
                  <Icon icon="ph:briefcase" className="w-4 h-4" />
                  <span>{profile?.total_services || 0} missions</span>
                </div>
                <div className="flex items-center gap-1 text-text-secondary">
                  <Icon icon="ph:clock" className="w-4 h-4" />
                  <span>Membre depuis {new Date(profile?.created_at || "").getFullYear()}</span>
                </div>
              </div>
            </div>
            <div className="text-center md:text-right">
              <div className="text-2xl font-bold text-primary">
                {profile?.hourly_rate || 0}€
              </div>
              <div className="text-sm text-text-secondary">/ heure</div>
              {profile?.is_available && (
                <Badge className="mt-2 bg-success/10 text-success border-0">
                  <Icon icon="ph:circle" className="w-2 h-2 mr-1 fill-current" />
                  Disponible
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Grille des modules */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.map((module) => (
            <Link key={module.title} href={module.href}>
              <Card className="group rounded-2xl p-6 hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer border border-gray-100 dark:border-gray-700">
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-xl ${module.color} bg-opacity-10 flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <Icon icon={module.icon} className={`w-6 h-6 text-${module.color.split('-')[1]}-500`} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-text-primary dark:text-gray-100 mb-1">
                      {module.title}
                    </h3>
                    <p className="text-sm text-text-secondary dark:text-gray-400">
                      {module.description}
                    </p>
                  </div>
                  <Icon icon="ph:arrow-right" className="w-5 h-5 text-text-secondary group-hover:translate-x-1 transition-transform" />
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}