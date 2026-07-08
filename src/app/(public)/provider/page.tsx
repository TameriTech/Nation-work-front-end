// app/(public)/providers/page.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Icon } from "@iconify/react";
import { cn } from "@/app/lib/utils";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/app/components/ui/avatar";
import { Badge } from "@/app/components/ui/badge";
import { Skeleton } from "@/app/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";

// Types
interface provider {
  id: string;
  username: string;
  full_name: string;
  profile_picture?: string;
  headline?: string;
  location?: string;
  skills: string[];
  stats: {
    rating: number;
    completed_missions: number;
    response_rate: number;
  };
  verified: boolean;
  available: boolean;
  hourly_rate?: number;
}

// Composant Skeleton pour les cartes
function providerCardSkeleton() {
  return (
    <div className="bg-surface dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-700 animate-pulse">
      <div className="p-6">
        <div className="flex flex-col items-center text-center">
          <Skeleton className="w-24 h-24 rounded-full mb-4" />
          <Skeleton className="h-5 w-32 mb-2" />
          <Skeleton className="h-4 w-48 mb-3" />
          <div className="flex gap-1 mb-3">
            <Skeleton className="h-4 w-20" />
          </div>
          <div className="flex flex-wrap gap-2 justify-center mb-4">
            <Skeleton className="h-6 w-16 rounded-full" />
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="h-6 w-14 rounded-full" />
          </div>
          <div className="flex items-center justify-center gap-4 mb-4">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-16" />
          </div>
          <Skeleton className="h-9 w-full rounded-xl" />
        </div>
      </div>
    </div>
  );
}

// Composant pour les étoiles
function StarRating({ rating, size = "sm" }: { rating: number; size?: "sm" | "md" | "lg" }) {
  const sizes = {
    sm: "w-3 h-3",
    md: "w-4 h-4",
    lg: "w-5 h-5",
  };

  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Icon
          key={star}
          icon={star <= rating ? "ph:star-fill" : "ph:star"}
          className={cn(
            sizes[size],
            star <= rating ? "text-yellow-500" : "text-gray-300 dark:text-gray-600"
          )}
        />
      ))}
    </div>
  );
}

// Composant carte freelance (format carré avec photo)
function providerCard({ provider }: { provider: provider }) {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="group bg-surface dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100 dark:border-gray-700">
      <div className="p-6">
        {/* Avatar - centré */}
        <div className="flex flex-col items-center text-center">
          <div className="relative mb-4">
            <Avatar className="w-24 h-24 ring-4 ring-primary/10 dark:ring-primary-400/10 group-hover:ring-primary/20 transition-all">
              <AvatarImage src={provider.profile_picture} />
              <AvatarFallback className="bg-gradient-to-br from-primary to-primary/70 text-white text-2xl">
                {getInitials(provider.full_name)}
              </AvatarFallback>
            </Avatar>
            {provider.available && (
              <div className="absolute bottom-1 right-1 w-4 h-4 bg-success rounded-full ring-2 ring-white dark:ring-gray-800" />
            )}
          </div>

          {/* Nom et badges */}
          <Link href={`/prestataires/${provider.id}`} className="flex items-center justify-center gap-2 flex-wrap mb-1">
            <h3 className="text-lg font-semibold text-text-primary dark:text-gray-100 group-hover:text-primary transition-colors">
              {provider.full_name}
            </h3>
            {provider.verified && (
              <Icon icon="ph:check-circle" className="w-4 h-4 text-success" />
            )}
          </Link>

          {/* Headline */}
          <p className="text-sm text-text-secondary dark:text-gray-400 mb-3 line-clamp-2">
            {provider.headline || "Freelance professionnel"}
          </p>

          {/* Note étoiles */}
          <div className="flex items-center justify-center gap-2 mb-3">
            <StarRating rating={provider.stats.rating} size="md" />
            <span className="text-sm font-medium text-text-primary dark:text-gray-100">
              {provider.stats.rating}
            </span>
            <span className="text-xs text-text-secondary dark:text-gray-400">
              ({provider.stats.completed_missions} missions)
            </span>
          </div>

          {/* Compétences */}
          <div className="flex flex-wrap gap-2 justify-center mb-4">
            {provider.skills.slice(0, 3).map((skill) => (
              <Badge
                key={skill}
                variant="secondary"
                className="bg-gray-100 dark:bg-gray-700 text-text-secondary dark:text-gray-300 text-xs"
              >
                {skill}
              </Badge>
            ))}
            {provider.skills.length > 3 && (
              <Badge variant="secondary" className="text-xs">
                +{provider.skills.length - 3}
              </Badge>
            )}
          </div>

          {/* Statistiques */}
          <div className="flex items-center justify-center gap-4 mb-4 text-xs text-text-secondary dark:text-gray-400">
            <div className="flex items-center gap-1">
              <Icon icon="ph:chat-circle" className="w-3 h-3" />
              <span>{provider.stats.response_rate}% réponse</span>
            </div>
            {provider.location && (
              <div className="flex items-center gap-1">
                <Icon icon="ph:map-pin" className="w-3 h-3" />
                <span className="truncate max-w-[100px]">{provider.location}</span>
              </div>
            )}
          </div>

          {/* Prix et bouton */}
          <div className="flex items-center justify-between gap-3 w-full pt-2 border-t border-gray-100 dark:border-gray-700">
            {provider.hourly_rate && (
              <div className="text-left">
                <span className="text-lg font-bold text-primary dark:text-primary-400">
                  {provider.hourly_rate}€
                </span>
                <span className="text-xs text-text-secondary dark:text-gray-400">/heure</span>
              </div>
            )}
            <Link href={`/prestataires/${provider.id}`} className="flex-1">
              <Button
                variant="outline"
                className="w-full rounded-xl bg-transparent text-gray-400 border-primary/20 hover:border-primary/40 hover:bg-primary/5 dark:border-primary-400/30"
              >
                Voir le profil
                <Icon icon="ph:arrow-right" className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function providersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSkill, setSelectedSkill] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("rating");
  const [isLoading, setIsLoading] = useState(true);
  const [providers, setproviders] = useState<provider[]>([]);

  // Données mockées des freelances
  const mockproviders: provider[] = [
    {
      id: "1",
      username: "mamadou_diop",
      full_name: "Mamadou Diop",
      profile_picture: "",
      headline: "Développeur Full-Stack Senior - React, Next.js, Laravel",
      location: "Dakar, Sénégal",
      skills: ["React", "Next.js", "TypeScript", "Laravel", "TailwindCSS", "Node.js"],
      stats: {
        rating: 4.9,
        completed_missions: 156,
        response_rate: 98,
      },
      verified: true,
      available: true,
      hourly_rate: 35,
    },
    {
      id: "2",
      username: "fatou_sow",
      full_name: "Fatou Sow",
      profile_picture: "",
      headline: "Designer UI/UX - Création d'interfaces modernes et intuitives",
      location: "Dakar, Sénégal",
      skills: ["Figma", "UI Design", "UX Research", "Adobe XD", "Prototypage"],
      stats: {
        rating: 4.8,
        completed_missions: 89,
        response_rate: 95,
      },
      verified: true,
      available: true,
      hourly_rate: 30,
    },
    {
      id: "3",
      username: "oumar_fall",
      full_name: "Oumar Fall",
      profile_picture: "",
      headline: "Expert en Marketing Digital - SEO, SEA, Social Media",
      location: "Dakar, Sénégal",
      skills: ["SEO", "Google Ads", "Facebook Ads", "Content Marketing", "Analytics"],
      stats: {
        rating: 4.7,
        completed_missions: 112,
        response_rate: 92,
      },
      verified: true,
      available: false,
      hourly_rate: 40,
    },
    {
      id: "4",
      username: "aissatou_diallo",
      full_name: "Aïssatou Diallo",
      profile_picture: "",
      headline: "Photographe professionnelle - Portrait, Événementiel, Produit",
      location: "Dakar, Sénégal",
      skills: ["Photographie", "Lightroom", "Photoshop", "Retouche photo", "Vidéo"],
      stats: {
        rating: 4.9,
        completed_missions: 67,
        response_rate: 100,
      },
      verified: true,
      available: true,
      hourly_rate: 45,
    },
    {
      id: "5",
      username: "moussa_ndiaye",
      full_name: "Moussa Ndiaye",
      profile_picture: "",
      headline: "Data Analyst - Business Intelligence, Tableau, Power BI",
      location: "Dakar, Sénégal",
      skills: ["SQL", "Python", "Tableau", "Power BI", "Excel"],
      stats: {
        rating: 4.8,
        completed_missions: 45,
        response_rate: 88,
      },
      verified: true,
      available: true,
      hourly_rate: 38,
    },
    {
      id: "6",
      username: "awa_sy",
      full_name: "Awa Sy",
      profile_picture: "",
      headline: "Community Manager - Gestion de réseaux sociaux, Création de contenu",
      location: "Dakar, Sénégal",
      skills: ["Social Media", "Content Creation", "Canva", "Meta Business", "Analytics"],
      stats: {
        rating: 4.6,
        completed_missions: 78,
        response_rate: 96,
      },
      verified: false,
      available: true,
      hourly_rate: 25,
    },
    {
      id: "7",
      username: "ibrahima_ba",
      full_name: "Ibrahima Ba",
      profile_picture: "",
      headline: "Electricien professionnel - Installation et dépannage",
      location: "Dakar, Sénégal",
      skills: ["Électricité", "Dépannage", "Installation", "Maintenance", "Câblage"],
      stats: {
        rating: 4.8,
        completed_missions: 234,
        response_rate: 97,
      },
      verified: true,
      available: true,
      hourly_rate: 28,
    },
    {
      id: "8",
      username: "ndeye_mbaye",
      full_name: "Ndeye Mbaye",
      profile_picture: "",
      headline: "Ménage et nettoyage professionnel",
      location: "Dakar, Sénégal",
      skills: ["Ménage", "Nettoyage", "Repassage", "Entretien"],
      stats: {
        rating: 4.9,
        completed_missions: 312,
        response_rate: 99,
      },
      verified: true,
      available: true,
      hourly_rate: 15,
    },
  ];

  // Simuler le chargement des données
  useEffect(() => {
    const fetchproviders = async () => {
      setIsLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        setproviders(mockproviders);
      } catch (error) {
        console.error("Erreur lors du chargement:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchproviders();
  }, []);

  // Filtrer et trier les freelances
  const filteredproviders = providers
    .filter((f) => {
      // Recherche par nom
      if (searchQuery && !f.full_name.toLowerCase().includes(searchQuery.toLowerCase()) && 
          !f.headline?.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      // Filtre par compétence
      if (selectedSkill !== "all" && !f.skills.some(s => s.toLowerCase() === selectedSkill.toLowerCase())) {
        return false;
      }
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "rating":
          return b.stats.rating - a.stats.rating;
        case "missions":
          return b.stats.completed_missions - a.stats.completed_missions;
        case "rate_asc":
          return (a.hourly_rate || 0) - (b.hourly_rate || 0);
        case "rate_desc":
          return (b.hourly_rate || 0) - (a.hourly_rate || 0);
        default:
          return 0;
      }
    });

  // Liste unique de toutes les compétences pour le filtre
  const allSkills = Array.from(new Set(providers.flatMap(f => f.skills)));

  return (
    <div className="min-h-screen bg-background dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-16">
        
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-text-primary dark:text-gray-100">
            Nos Freelances
          </h1>
          <p className="text-text-secondary dark:text-gray-400 mt-2">
            Découvrez les meilleurs freelances pour vos projets
          </p>
        </div>

        {/* Search and Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          {/* Search Input */}
          <div className="flex-1 relative">
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher un freelance..."
              className="pl-10 h-12 rounded-xl focus:ring-2 focus:ring-primary border-gray-200 dark:border-gray-700 bg-surface dark:bg-gray-800"
            />
            <Icon icon="ph:magnifying-glass" className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                <Icon icon="ph:x" className="w-4 h-4 text-gray-400 hover:text-gray-600" />
              </button>
            )}
          </div>

          {/* Skill Filter */}
          <div className="w-full sm:w-56">
            <Select value={selectedSkill} onValueChange={setSelectedSkill}>
              <SelectTrigger className="h-12 rounded-xl border-gray-200 dark:border-gray-700 bg-surface dark:bg-gray-800">
                <SelectValue placeholder="Filtrer par compétence" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes compétences</SelectItem>
                {allSkills.map((skill) => (
                  <SelectItem key={skill} value={skill}>
                    {skill}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Sort By */}
          <div className="w-full sm:w-44">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="h-12 rounded-xl border-gray-200 dark:border-gray-700 bg-surface dark:bg-gray-800">
                <SelectValue placeholder="Trier par" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rating">Meilleure note</SelectItem>
                <SelectItem value="missions">Plus de missions</SelectItem>
                <SelectItem value="rate_asc">Prix croissant</SelectItem>
                <SelectItem value="rate_desc">Prix décroissant</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Results count */}
        <div className="mb-6">
          <p className="text-sm text-text-secondary dark:text-gray-400">
            {isLoading ? (
              "Chargement..."
            ) : (
              <>
                <span className="font-semibold text-text-primary dark:text-gray-100">
                  {filteredproviders.length}
                </span>{" "}
                freelance{filteredproviders.length !== 1 ? "s" : ""} trouvé{filteredproviders.length !== 1 ? "s" : ""}
              </>
            )}
          </p>
        </div>

        {/* providers Grid - 4 colonnes sur desktop */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(8)].map((_, i) => (
              <providerCardSkeleton key={i} />
            ))}
          </div>
        ) : filteredproviders.length === 0 ? (
          <div className="text-center py-16 bg-surface dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700">
            <Icon icon="ph:users" className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-text-primary dark:text-gray-100 mb-2">
              Aucun freelance trouvé
            </h3>
            <p className="text-text-secondary dark:text-gray-400">
              Essayez de modifier vos critères de recherche
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredproviders.map((provider) => (
              <providerCard key={provider.id} provider={provider} />
            ))}
          </div>
        )}

        {/* CTA Devenir freelance */}
        <div className="mt-12 bg-gradient-to-r from-primary/10 to-primary/5 dark:from-primary-400/10 dark:to-primary-400/5 rounded-2xl p-8 text-center border border-primary/20 dark:border-primary-400/20">
          <h2 className="text-2xl font-bold text-text-primary dark:text-gray-100 mb-2">
            Vous êtes freelance ?
          </h2>
          <p className="text-text-secondary dark:text-gray-400 mb-4">
            Rejoignez notre communauté et trouvez des missions près de chez vous
          </p>
          <Link href="/devenir-freelance">
            <Button className="bg-primary hover:bg-primary/90 text-white rounded-xl">
              Devenir freelance
              <Icon icon="ph:arrow-right" className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
