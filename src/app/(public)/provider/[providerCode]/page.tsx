// app/(public)/providers/[id]/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Icon } from "@iconify/react";
import { toast } from "sonner";
import Link from "next/link";
import { cn } from "@/app/lib/utils";

import { Button } from "@/app/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/app/components/ui/avatar";
import { Badge } from "@/app/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/app/components/ui/breadcrumb";
import { Skeleton } from "@/app/components/ui/skeleton";

// Types
interface providerStats {
  completed_missions: number;
  ongoing_missions: number;
  total_earnings: number;
  rating: number;
  response_rate: number;
  response_time: string;
}

interface providerReview {
  id: string;
  client_name: string;
  client_avatar?: string;
  rating: number;
  comment: string;
  date: string;
  service_title: string;
}

interface providerPortfolio {
  id: string;
  title: string;
  description: string;
  image?: string;
  category: string;
}

interface provider {
  id: string;
  username: string;
  full_name: string;
  email: string;
  profile_picture?: string;
  bio?: string;
  headline?: string;
  location?: string;
  join_date: string;
  skills: string[];
  languages: string[];
  stats: providerStats;
  reviews: providerReview[];
  portfolio: providerPortfolio[];
  verified: boolean;
  available: boolean;
}

// Composant Skeleton
function providerDetailSkeleton() {
  return (
    <div className="min-h-screen bg-background dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column Skeleton */}
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="h-12 w-3/4 rounded-lg" />
            <Skeleton className="h-64 w-full rounded-2xl" />
            <Skeleton className="h-96 w-full rounded-2xl" />
          </div>
          {/* Right Column Skeleton */}
          <div className="space-y-6">
            <Skeleton className="h-[500px] w-full rounded-2xl" />
          </div>
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
          icon={star <= rating ? "ph:star-fill" : star <= rating + 0.5 ? "ph:star-half-fill" : "ph:star"}
          className={cn(
            sizes[size],
            star <= rating ? "text-yellow-500" : "text-gray-300 dark:text-gray-600"
          )}
        />
      ))}
    </div>
  );
}

export default function providerDetailPage() {
  const params = useParams();
  const router = useRouter();
  const providerCode = params.providerCode;

  const [provider, setprovider] = useState<provider | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("portfolio");

  // Simuler le chargement des données (à remplacer par l'appel API réel)
  useEffect(() => {
    const fetchprovider = async () => {
      setIsLoading(true);
      try {
        // Simulation d'appel API
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Données mockées
        const mockprovider: provider = {
          id: providerCode as string,
          username: "mamadou_diop",
          full_name: "Mamadou Diop",
          email: "mamadou.diop@example.com",
          profile_picture: "",
          bio: "Développeur full-stack avec plus de 8 ans d'expérience. Passionné par les technologies web modernes et l'innovation. J'accompagne mes clients dans la réalisation de leurs projets digitaux, de la conception à la mise en production.\n\nMon objectif est de fournir un travail de qualité, dans les délais impartis, avec une communication transparente tout au long du projet. Je m'engage à comprendre les besoins spécifiques de chaque client pour proposer des solutions sur mesure.",
          headline: "Développeur Full-Stack Senior - React, Next.js, Laravel",
          location: "Dakar, Sénégal",
          join_date: "2023-01-15",
          skills: ["React", "Next.js", "TypeScript", "Laravel", "TailwindCSS", "Node.js", "MongoDB", "PostgreSQL"],
          languages: ["Français (Natif)", "Anglais (Courant)"],
          verified: true,
          available: true,
          stats: {
            completed_missions: 156,
            ongoing_missions: 3,
            total_earnings: 245000,
            rating: 4.9,
            response_rate: 98,
            response_time: "moins d'1 heure",
          },
          reviews: [
            {
              id: "1",
              client_name: "Sophie Martin",
              client_avatar: "",
              rating: 5,
              comment: "Excellent travail ! Mamadou a été très professionnel et a livré le projet avant la date prévue. Je recommande vivement.",
              date: "2024-02-15",
              service_title: "Développement site e-commerce",
            },
            {
              id: "2",
              client_name: "Thomas Bernard",
              client_avatar: "",
              rating: 5,
              comment: "Très bonne communication, grande réactivité. Le code est propre et bien documenté. Un plaisir de travailler avec lui.",
              date: "2024-01-20",
              service_title: "Application mobile React Native",
            },
            {
              id: "3",
              client_name: "Marie Laure",
              client_avatar: "",
              rating: 4.5,
              comment: "Travail de qualité, respect des délais. Quelques retards mineurs sur la communication mais globalement satisfaite.",
              date: "2023-12-10",
              service_title: "Refonte de site vitrine",
            },
          ],
          portfolio: [
            {
              id: "1",
              title: "E-commerce Fashion",
              description: "Plateforme e-commerce complète avec panier, paiement et tableau de bord admin",
              category: "Développement Web",
            },
            {
              id: "2",
              title: "Application de livraison",
              description: "Application mobile pour les livreurs avec suivi GPS et notifications",
              category: "Mobile",
            },
            {
              id: "3",
              title: "Dashboard Analytics",
              description: "Tableau de bord interactif pour visualisation de données",
              category: "Data Visualisation",
            },
          ],
        };
        
        setprovider(mockprovider);
      } catch (error) {
        console.error("Erreur lors du chargement du freelance:", error);
        toast.error("Impossible de charger le profil du freelance");
      } finally {
        setIsLoading(false);
      }
    };

    if (providerCode) {
      fetchprovider();
    }
  }, [providerCode]);

  const handleContact = () => {
    toast.success("Fonctionnalité à venir");
  };

  const handleHire = () => {
    toast.success("Fonctionnalité à venir");
  };

  if (isLoading) {
    return <providerDetailSkeleton />;
  }

  if (!provider) {
    return (
      <div className="min-h-screen bg-background dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Icon icon="ph:user-x" className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-text-primary dark:text-gray-100 mb-2">
            Freelance non trouvé
          </h2>
          <p className="text-text-secondary dark:text-gray-400 mb-4">
            Le profil que vous recherchez n'existe pas ou a été supprimé.
          </p>
          <Button onClick={() => router.push("/providers")} className="bg-primary hover:bg-primary/90">
            Voir tous les freelances
          </Button>
        </div>
      </div>
    );
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="min-h-screen bg-background dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-16">
        
        {/* Breadcrumb */}
        <Breadcrumb className="mb-6">
          <BreadcrumbList className="text-text-secondary dark:text-gray-400">
            <BreadcrumbItem>
              <BreadcrumbLink href="/" className="hover:text-primary dark:hover:text-primary-400">
                Accueil
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/providers" className="hover:text-primary dark:hover:text-primary-400">
                Freelances
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="font-semibold text-text-primary dark:text-gray-100">
                {provider.full_name}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Profile Header Card */}
            <div className="bg-surface dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                {/* Avatar */}
                <div className="relative">
                  <Avatar className="w-28 h-28 ring-4 ring-primary/20 dark:ring-primary-400/20">
                    <AvatarImage src={provider.profile_picture} />
                    <AvatarFallback className="bg-gradient-to-br from-primary to-primary/70 text-white text-3xl">
                      {getInitials(provider.full_name)}
                    </AvatarFallback>
                  </Avatar>
                  {provider.available && (
                    <div className="absolute bottom-1 right-1 w-5 h-5 bg-success rounded-full ring-2 ring-white dark:ring-gray-800" />
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 text-center md:text-left">
                  <div className="flex items-center justify-center md:justify-start gap-2 flex-wrap mb-2">
                    <h1 className="text-2xl font-bold text-text-primary dark:text-gray-100">
                      {provider.full_name}
                    </h1>
                    {provider.verified && (
                      <Badge className="bg-success/10 text-success dark:bg-green-900/30 dark:text-green-400 border-0">
                        <Icon icon="ph:check-circle" className="w-3 h-3 mr-1" />
                        Vérifié
                      </Badge>
                    )}
                  </div>
                  
                  <p className="text-text-secondary dark:text-gray-400 mb-2">
                    @{provider.username}
                  </p>
                  
                  <p className="text-text-primary dark:text-gray-200 font-medium mb-3">
                    {provider.headline}
                  </p>
                  
                  <div className="flex items-center justify-center md:justify-start gap-3">
                    <StarRating rating={provider.stats.rating} size="md" />
                    <span className="text-sm font-medium text-text-primary dark:text-gray-100">
                      {provider.stats.rating}
                    </span>
                    <span className="text-sm text-text-secondary dark:text-gray-400">
                      ({provider.reviews.length} avis)
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bio */}
            <div className="bg-surface dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-text-primary dark:text-gray-100 mb-3 flex items-center gap-2">
                <Icon icon="ph:user" className="w-5 h-5 text-primary" />
                À propos
              </h2>
              <div className="text-text-secondary dark:text-gray-300 leading-relaxed whitespace-pre-line">
                {provider.bio}
              </div>
            </div>

            {/* Portfolio / Avis Tabs */}
            <div className="bg-surface dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="w-full bg-transparent border-b border-gray-100 dark:border-gray-700 rounded-none justify-start px-6 pt-2">
                  <TabsTrigger
                    value="portfolio"
                    className="data-[state=active]:border-primary data-[state=active]:text-primary dark:data-[state=active]:text-primary-400 rounded-none border-b-2 border-transparent px-4 py-3"
                  >
                    <Icon icon="ph:briefcase" className="w-4 h-4 mr-2" />
                    Portfolio
                  </TabsTrigger>
                  <TabsTrigger
                    value="reviews"
                    className="data-[state=active]:border-primary data-[state=active]:text-primary dark:data-[state=active]:text-primary-400 rounded-none border-b-2 border-transparent px-4 py-3"
                  >
                    <Icon icon="ph:chat-circle" className="w-4 h-4 mr-2" />
                    Avis ({provider.reviews.length})
                  </TabsTrigger>
                  <TabsTrigger
                    value="skills"
                    className="data-[state=active]:border-primary data-[state=active]:text-primary dark:data-[state=active]:text-primary-400 rounded-none border-b-2 border-transparent px-4 py-3"
                  >
                    <Icon icon="ph:code" className="w-4 h-4 mr-2" />
                    Compétences
                  </TabsTrigger>
                </TabsList>

                {/* Portfolio Tab */}
                <TabsContent value="portfolio" className="p-6">
                  {provider.portfolio.length === 0 ? (
                    <div className="text-center py-12">
                      <Icon icon="ph:image" className="w-16 h-16 text-gray-300 mx-auto mb-3" />
                      <p className="text-text-secondary dark:text-gray-400">
                        Aucun projet dans le portfolio
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {provider.portfolio.map((project) => (
                        <div
                          key={project.id}
                          className="p-5 rounded-xl bg-gray-50 dark:bg-gray-700/50 hover:shadow-md transition-all group"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="font-semibold text-text-primary dark:text-gray-100 group-hover:text-primary transition-colors">
                              {project.title}
                            </h3>
                            <Badge variant="secondary" className="text-xs">
                              {project.category}
                            </Badge>
                          </div>
                          <p className="text-sm text-text-secondary dark:text-gray-400">
                            {project.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </TabsContent>

                {/* Avis Tab */}
                <TabsContent value="reviews" className="p-6">
                  {provider.reviews.length === 0 ? (
                    <div className="text-center py-12">
                      <Icon icon="ph:star" className="w-16 h-16 text-gray-300 mx-auto mb-3" />
                      <p className="text-text-secondary dark:text-gray-400">
                        Aucun avis pour le moment
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {provider.reviews.map((review) => (
                        <div key={review.id} className="border-b border-gray-100 dark:border-gray-700 pb-6 last:border-0">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <Avatar className="w-10 h-10">
                                <AvatarFallback className="bg-primary/10 text-primary dark:bg-primary-400/10 dark:text-primary-400">
                                  {review.client_name.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium text-text-primary dark:text-gray-100">
                                  {review.client_name}
                                </p>
                                <p className="text-xs text-text-secondary dark:text-gray-400">
                                  {new Date(review.date).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
                                </p>
                              </div>
                            </div>
                            <StarRating rating={review.rating} size="sm" />
                          </div>
                          <p className="text-text-secondary dark:text-gray-300 mt-2 leading-relaxed">
                            {review.comment}
                          </p>
                          <p className="text-xs text-primary dark:text-primary-400 mt-3">
                            Mission: {review.service_title}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </TabsContent>

                {/* Compétences Tab */}
                <TabsContent value="skills" className="p-6">
                  <div className="space-y-8">
                    {/* Compétences techniques */}
                    <div>
                      <h3 className="font-semibold text-text-primary dark:text-gray-100 mb-4 flex items-center gap-2">
                        <Icon icon="ph:code" className="w-4 h-4 text-primary" />
                        Compétences techniques
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {provider.skills.map((skill) => (
                          <Badge
                            key={skill}
                            className="bg-primary/10 text-primary dark:bg-primary-400/10 dark:text-primary-400 border-0 px-3 py-1.5 text-sm"
                          >
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Langues */}
                    <div>
                      <h3 className="font-semibold text-text-primary dark:text-gray-100 mb-4 flex items-center gap-2">
                        <Icon icon="ph:translate" className="w-4 h-4 text-primary" />
                        Langues
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {provider.languages.map((language) => (
                          <Badge
                            key={language}
                            variant="secondary"
                            className="bg-gray-100 dark:bg-gray-700 text-text-secondary dark:text-gray-300 px-3 py-1.5 text-sm"
                          >
                            {language}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>

          {/* Right Column - Info Cards */}
          <div className="space-y-6">
            {/* Contact Card */}
            <div className="bg-gradient-to-br from-primary/5 to-primary/10 dark:from-primary-400/5 dark:to-primary-400/10 rounded-2xl p-6 border border-primary/20 dark:border-primary-400/20">
              <h3 className="font-semibold text-text-primary dark:text-gray-100 mb-4 text-center">
                Intéressé par ce freelance ?
              </h3>
              <div className="space-y-3">
                <Button
                  onClick={handleContact}
                  variant="outline"
                  className="w-full rounded-xl border-primary/20 hover:border-primary/40 dark:border-primary-400/30"
                >
                  <Icon icon="ph:envelope" className="w-4 h-4 mr-2 text-primary" />
                  Contacter
                </Button>
                <Button
                  onClick={handleHire}
                  className="w-full rounded-xl bg-primary hover:bg-primary/90 text-white"
                >
                  <Icon icon="ph:handshake" className="w-4 h-4 mr-2" />
                  Engager maintenant
                </Button>
              </div>
            </div>

            {/* Tarif Card */}
            <div className="bg-surface dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 text-center">
              <h3 className="font-semibold text-text-primary dark:text-gray-100 mb-2">
                Tarif horaire
              </h3>
              <div className="text-3xl font-bold text-primary dark:text-primary-400 mb-1">
                35€
              </div>
              <p className="text-sm text-text-secondary dark:text-gray-400">par heure</p>
            </div>

            {/* Statistiques Card */}
            <div className="bg-surface dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
              <h3 className="font-semibold text-text-primary dark:text-gray-100 mb-4 flex items-center gap-2">
                <Icon icon="ph:chart-bar" className="w-5 h-5 text-primary" />
                Statistiques
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                  <div className="flex items-center gap-2">
                    <Icon icon="ph:check-circle" className="w-4 h-4 text-success" />
                    <span className="text-sm text-text-secondary dark:text-gray-400">Missions complétées</span>
                  </div>
                  <span className="font-semibold text-text-primary dark:text-gray-100">
                    {provider.stats.completed_missions}
                  </span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                  <div className="flex items-center gap-2">
                    <Icon icon="ph:clock" className="w-4 h-4 text-accent" />
                    <span className="text-sm text-text-secondary dark:text-gray-400">Missions en cours</span>
                  </div>
                  <span className="font-semibold text-text-primary dark:text-gray-100">
                    {provider.stats.ongoing_missions}
                  </span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                  <div className="flex items-center gap-2">
                    <Icon icon="ph:currency-circle-euro" className="w-4 h-4 text-primary" />
                    <span className="text-sm text-text-secondary dark:text-gray-400">Gains totaux</span>
                  </div>
                  <span className="font-semibold text-text-primary dark:text-gray-100">
                    {provider.stats.total_earnings.toLocaleString()}€
                  </span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                  <div className="flex items-center gap-2">
                    <Icon icon="ph:chat-circle" className="w-4 h-4 text-primary" />
                    <span className="text-sm text-text-secondary dark:text-gray-400">Taux de réponse</span>
                  </div>
                  <span className="font-semibold text-text-primary dark:text-gray-100">
                    {provider.stats.response_rate}%
                  </span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-2">
                    <Icon icon="ph:clock-counter-clockwise" className="w-4 h-4 text-primary" />
                    <span className="text-sm text-text-secondary dark:text-gray-400">Temps de réponse</span>
                  </div>
                  <span className="font-semibold text-text-primary dark:text-gray-100">
                    {provider.stats.response_time}
                  </span>
                </div>
              </div>
            </div>

            {/* Informations Card */}
            <div className="bg-surface dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
              <h3 className="font-semibold text-text-primary dark:text-gray-100 mb-4 flex items-center gap-2">
                <Icon icon="ph:info" className="w-5 h-5 text-primary" />
                Informations
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Icon icon="ph:map-pin" className="w-4 h-4 text-primary" />
                  <span className="text-sm text-text-secondary dark:text-gray-300">
                    {provider.location || "Localisation non spécifiée"}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Icon icon="ph:calendar" className="w-4 h-4 text-primary" />
                  <span className="text-sm text-text-secondary dark:text-gray-300">
                    Membre depuis {new Date(provider.join_date).toLocaleDateString("fr-FR", { month: "long", year: "numeric" })}
                  </span>
                </div>
              </div>
            </div>

            {/* Partager Card */}
            <div className="bg-surface dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
              <h3 className="font-semibold text-text-primary dark:text-gray-100 mb-4 flex items-center gap-2">
                <Icon icon="ph:share-network" className="w-5 h-5 text-primary" />
                Partager
              </h3>
              <div className="flex gap-3">
                <button className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center hover:bg-primary/10 transition-colors">
                  <Icon icon="ph:linkedin-logo" className="w-5 h-5 text-primary" />
                </button>
                <button className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center hover:bg-primary/10 transition-colors">
                  <Icon icon="ph:twitter-logo" className="w-5 h-5 text-primary" />
                </button>
                <button className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center hover:bg-primary/10 transition-colors">
                  <Icon icon="ph:facebook-logo" className="w-5 h-5 text-primary" />
                </button>
                <button className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center hover:bg-primary/10 transition-colors">
                  <Icon icon="ph:copy" className="w-5 h-5 text-primary" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}