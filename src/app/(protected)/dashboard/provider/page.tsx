// app/(dashboard)/provider/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { Icon } from "@iconify/react";
import { useAuth } from "@/app/hooks/auth/use-auth";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/app/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs";
import { cn } from "@/app/lib/utils";

// Types
interface StatCard {
  title: string;
  value: string | number;
  icon: string;
  trend?: number;
  color: string;
}

interface Service {
  id: string;
  title: string;
  category: string;
  price: number;
  status: "active" | "inactive" | "pending";
  orders_count: number;
  rating: number;
}

interface Application {
  id: string;
  mission_title: string;
  company: string;
  applied_date: string;
  status: "pending" | "accepted" | "rejected" | "viewed";
  budget: number;
}

interface Review {
  id: string;
  client_name: string;
  client_avatar?: string;
  rating: number;
  comment: string;
  date: string;
  service_name: string;
}

export default function providerDashboard() {
  const { user } = useAuth();
  const [verificationStatus, setVerificationStatus] = useState({
    email_verified: false,
    identity_verified: false,
    payment_setup: false,
    profile_complete: 65,
  });

  // Mock data - replace with API calls
  const [stats] = useState<StatCard[]>([
    { title: "Revenu total", value: "€12,450", icon: "ph:currency-euro", trend: 12, color: "from-primary to-primary/80" },
    { title: "Services actifs", value: "8", icon: "ph:briefcase", trend: 2, color: "from-secondary to-secondary/80" },
    { title: "Candidatures", value: "24", icon: "ph:file-text", trend: -3, color: "from-accent to-accent/80" },
    { title: "Commandes terminées", value: "47", icon: "ph:check-circle", trend: 8, color: "from-success to-success/80" },
    { title: "Note moyenne", value: "4.8", icon: "ph:star", trend: 0.2, color: "from-secondary to-secondary/80" },
    { title: "Taux de réponse", value: "98%", icon: "ph:chat-circle", trend: 5, color: "from-primary to-primary/80" },
  ]);

  const [services] = useState<Service[]>([
    {
      id: "1",
      title: "Développement Web Full Stack",
      category: "Development",
      price: 450,
      status: "active",
      orders_count: 12,
      rating: 4.9,
    },
    {
      id: "2",
      title: "Application React Native",
      category: "Mobile",
      price: 550,
      status: "active",
      orders_count: 8,
      rating: 4.8,
    },
    {
      id: "3",
      title: "UI/UX Design",
      category: "Design",
      price: 380,
      status: "pending",
      orders_count: 0,
      rating: 0,
    },
  ]);

  const [applications] = useState<Application[]>([
    {
      id: "1",
      mission_title: "Développeur Next.js Expert",
      company: "Tech Startup Paris",
      applied_date: "2026-05-10",
      status: "pending",
      budget: 5000,
    },
    {
      id: "2",
      mission_title: "Intégrateur Web Senior",
      company: "Agence Digital 360",
      applied_date: "2026-05-08",
      status: "viewed",
      budget: 3500,
    },
    {
      id: "3",
      mission_title: "Architecte Solution Cloud",
      company: "Cloud Solutions Inc",
      applied_date: "2026-05-05",
      status: "accepted",
      budget: 8000,
    },
    {
      id: "4",
      mission_title: "Développeur Python/Django",
      company: "FinTech Europe",
      applied_date: "2026-05-01",
      status: "rejected",
      budget: 4200,
    },
  ]);

  const [reviews] = useState<Review[]>([
    {
      id: "1",
      client_name: "Jean Dupont",
      rating: 5,
      comment: "Excellent travail, très professionnel ! Livraison dans les temps.",
      date: "2026-05-01",
      service_name: "Développement Web Full Stack",
    },
    {
      id: "2",
      client_name: "Marie Martin",
      rating: 4.5,
      comment: "Bon travail, bonne communication. Quelques retards mais qualité au rendez-vous.",
      date: "2026-04-25",
      service_name: "Application React Native",
    },
    {
      id: "3",
      client_name: "Paul Bernard",
      rating: 5,
      comment: "Très satisfait du résultat, je recommande vivement !",
      date: "2026-04-20",
      service_name: "Développement Web Full Stack",
    },
  ]);

  const getStatusColor = (status: string) => {
    const colors = {
      active: "bg-success/10 text-success border-success/20 dark:bg-success/20 dark:text-green-400",
      inactive: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400 border-gray-200 dark:border-gray-700",
      pending: "bg-secondary/10 text-secondary border-secondary/20 dark:bg-secondary/20 dark:text-secondary-400",
      accepted: "bg-success/10 text-success border-success/20 dark:bg-success/20 dark:text-green-400",
      rejected: "bg-error/10 text-error border-error/20 dark:bg-error/20 dark:text-red-400",
      viewed: "bg-primary/10 text-primary border-primary/20 dark:bg-primary/20 dark:text-primary-400",
    };
    return colors[status as keyof typeof colors] || colors.pending;
  };

  const getApplicationStatusText = (status: string) => {
    const texts = {
      pending: "En attente",
      accepted: "Acceptée",
      rejected: "Refusée",
      viewed: "Consultée",
    };
    return texts[status as keyof typeof texts] || status;
  };

  return (
    <div className="min-h-screen bg-background dark:bg-gray-900">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-16">
        
        {/* Header with gradient icon - using theme colors */}
        <div className="mb-8 flex items-center gap-4">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10 dark:from-primary/20 dark:to-secondary/20 mb-4">
            <Icon icon="ph:user-circle" className="w-7 h-7 text-primary dark:text-primary-400" />
          </div>
          <div className="">
            <h1 className="text-2xl md:text-3xl font-bold text-text-primary dark:text-gray-100">
              Tableau de bord
            </h1>
            <p className="text-sm text-text-secondary dark:text-gray-400 mt-1">
              Bon retour, {user?.username || "Freelance"} ! Voici votre activité récente.
            </p>
          </div>
        </div>

        {/* Verification Alert - Using theme colors */}
        {(!verificationStatus.email_verified || !verificationStatus.identity_verified || !verificationStatus.payment_setup) && (
          <div className="mb-6">
            {/* Subtle progress bar at the top */}
            <div className="relative mb-2">
              <div className="h-1 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all duration-500"
                  style={{ width: `${verificationStatus.profile_complete}%` }}
                />
              </div>
            </div>
            
            {/* Compact notification bar */}
            <div className="flex items-center justify-between gap-4 p-3 rounded-xl bg-surface/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-100 dark:border-gray-700 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/10 to-secondary/10 dark:from-primary/20 dark:to-secondary/20 flex items-center justify-center flex-shrink-0">
                  <Icon icon="ph:shield-check" className="w-4 h-4 text-primary dark:text-primary-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-text-primary dark:text-gray-100">
                    Complétez votre profil
                  </p>
                  <div className="flex items-center gap-3 mt-0.5">
                    {!verificationStatus.email_verified && (
                      <span className="text-xs text-text-secondary dark:text-gray-400 flex items-center gap-1">
                        <Icon icon="ph:envelope" className="w-3 h-3" />
                        Email non vérifié
                      </span>
                    )}
                    {!verificationStatus.identity_verified && (
                      <span className="text-xs text-text-secondary dark:text-gray-400 flex items-center gap-1">
                        <Icon icon="ph:identification-card" className="w-3 h-3" />
                        Identité non vérifiée
                      </span>
                    )}
                    {!verificationStatus.payment_setup && (
                      <span className="text-xs text-text-secondary dark:text-gray-400 flex items-center gap-1">
                        <Icon icon="ph:credit-card" className="w-3 h-3" />
                        Paiement non configuré
                      </span>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-primary dark:text-primary-400">
                  {verificationStatus.profile_complete}%
                </span>
                <Button 
                  size="sm" 
                  variant="ghost" 
                  className="h-7 text-xs rounded-lg text-primary hover:bg-primary/10 dark:text-primary-400 dark:hover:bg-primary/20"
                >
                  Compléter
                  <Icon icon="ph:arrow-right" className="w-3 h-3 ml-1" />
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Stats Grid - Using theme colors */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          {stats.map((stat, index) => (
            <div 
              key={index} 
              className={cn(
                "group rounded-xl shadow-sm hover:shadow-md transition-all duration-300 p-4 border",
                "bg-surface dark:bg-gray-800",
                "border-gray-100 dark:border-gray-700 hover:border-primary/20"
              )}
            >
              <div className="flex items-center justify-between mb-2">
                <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                  <Icon icon={stat.icon} className="w-4 h-4 text-white" />
                </div>
                {stat.trend && (
                  <div className={`flex items-center gap-0.5 text-xs font-semibold ${
                    stat.trend > 0 ? "text-success dark:text-green-400" : "text-error dark:text-red-400"
                  }`}>
                    <Icon icon={stat.trend > 0 ? "ph:caret-up" : "ph:caret-down"} className="w-3 h-3" />
                    {Math.abs(stat.trend)}%
                  </div>
                )}
              </div>
              <h3 className="text-xl font-bold text-text-primary dark:text-gray-100">{stat.value}</h3>
              <p className="text-xs text-text-secondary dark:text-gray-400 mt-1 truncate">{stat.title}</p>
            </div>
          ))}
        </div>

        {/* Tabs Section - Using theme colors */}
        <Tabs defaultValue="services" className="space-y-6">
          <TabsList className="bg-surface dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700 rounded-xl p-1">
            <TabsTrigger value="services" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white dark:data-[state=active]:bg-primary-600">
              Mes Services
            </TabsTrigger>
            <TabsTrigger value="applications" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white dark:data-[state=active]:bg-primary-600">
              Candidatures
            </TabsTrigger>
            <TabsTrigger value="reviews" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white dark:data-[state=active]:bg-primary-600">
              Avis Clients
            </TabsTrigger>
          </TabsList>

          {/* Services Tab */}
          <TabsContent value="services" className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-text-primary dark:text-gray-100">
                Services Actifs
              </h2>
              <Button className="bg-primary hover:bg-primary/90 text-white rounded-xl">
                <Icon icon="ph:plus" className="w-4 h-4 mr-2" />
                Nouveau Service
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service) => (
                <div key={service.id} className={cn(
                  "bg-surface dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border",
                  "border-gray-100 dark:border-gray-700"
                )}>
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-text-primary dark:text-gray-100">{service.title}</h3>
                        <p className="text-sm text-text-secondary dark:text-gray-400 mt-1">
                          {service.category}
                        </p>
                      </div>
                      <Badge className={`${getStatusColor(service.status)} rounded-lg`}>
                        {service.status === "active" ? "Actif" : service.status === "pending" ? "En attente" : "Inactif"}
                      </Badge>
                    </div>
                    <div className="space-y-3 pt-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-text-secondary dark:text-gray-400">Prix journalier</span>
                        <span className="font-semibold text-text-primary dark:text-gray-100">€{service.price}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-text-secondary dark:text-gray-400">Commandes</span>
                        <span className="font-semibold text-text-primary dark:text-gray-100">{service.orders_count}</span>
                      </div>
                      {service.rating > 0 && (
                        <div className="flex justify-between text-sm">
                          <span className="text-text-secondary dark:text-gray-400">Note</span>
                          <div className="flex items-center gap-1">
                            <Icon icon="ph:star-fill" className="w-4 h-4 text-secondary dark:text-secondary-400" />
                            <span className="font-semibold text-text-primary dark:text-gray-100">{service.rating}</span>
                          </div>
                        </div>
                      )}
                      <div className="flex gap-2 pt-4">
                        <Button variant="outline" size="sm" className="flex-1 rounded-xl border-primary/20 text-primary hover:bg-primary/10 dark:border-primary-400/30 dark:text-primary-400 dark:hover:bg-primary/20">
                          <Icon icon="ph:eye" className="w-4 h-4 mr-1" />
                          Voir
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1 rounded-xl border-primary/20 text-primary hover:bg-primary/10 dark:border-primary-400/30 dark:text-primary-400 dark:hover:bg-primary/20">
                          <Icon icon="ph:pencil" className="w-4 h-4 mr-1" />
                          Modifier
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* Applications Tab */}
          <TabsContent value="applications">
            <div className={cn(
              "bg-surface dark:bg-gray-800 rounded-2xl shadow-sm border overflow-hidden",
              "border-gray-100 dark:border-gray-700"
            )}>
              <div className="p-6 border-b border-gray-100 dark:border-gray-700">
                <h2 className="text-xl font-semibold text-text-primary dark:text-gray-100">Mes Candidatures</h2>
              </div>
              <div className="divide-y divide-gray-100 dark:divide-gray-700">
                {applications.map((application) => (
                  <div key={application.id} className="p-6 hover:bg-primary/5 dark:hover:bg-primary/10 transition-colors">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="font-semibold text-text-primary dark:text-gray-100">
                          {application.mission_title}
                        </h3>
                        <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-text-secondary dark:text-gray-400">
                          <span className="flex items-center gap-1">
                            <Icon icon="ph:building" className="w-4 h-4" />
                            {application.company}
                          </span>
                          <span className="flex items-center gap-1">
                            <Icon icon="ph:calendar" className="w-4 h-4" />
                            {new Date(application.applied_date).toLocaleDateString('fr-FR')}
                          </span>
                          <span className="flex items-center gap-1">
                            <Icon icon="ph:currency-euro" className="w-4 h-4" />
                            {application.budget.toLocaleString()} €
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge className={`${getStatusColor(application.status)} rounded-lg`}>
                          {getApplicationStatusText(application.status)}
                        </Badge>
                        <Button variant="ghost" size="sm" className="rounded-xl text-primary hover:bg-primary/10 dark:text-primary-400 dark:hover:bg-primary/20">
                          <Icon icon="ph:arrow-right" className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Reviews Tab */}
          <TabsContent value="reviews">
            <div className={cn(
              "bg-surface dark:bg-gray-800 rounded-2xl shadow-sm border overflow-hidden",
              "border-gray-100 dark:border-gray-700"
            )}>
              <div className="p-6 border-b border-gray-100 dark:border-gray-700">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-text-primary dark:text-gray-100">Avis Clients</h2>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <Icon icon="ph:star-fill" className="w-5 h-5 text-secondary dark:text-secondary-400" />
                      <span className="text-2xl font-bold text-text-primary dark:text-gray-100">4.8</span>
                    </div>
                    <span className="text-sm text-text-secondary dark:text-gray-400">
                      ({reviews.length} avis)
                    </span>
                  </div>
                </div>
              </div>
              <div className="divide-y divide-gray-100 dark:divide-gray-700">
                {reviews.map((review) => (
                  <div key={review.id} className="p-6">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-3">
                        <Avatar className="w-10 h-10">
                          <AvatarFallback className="bg-gradient-to-br from-primary/10 to-secondary/10 text-primary dark:from-primary/20 dark:to-secondary/20 dark:text-primary-400">
                            {review.client_name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold text-text-primary dark:text-gray-100">
                            {review.client_name}
                          </p>
                          <p className="text-xs text-text-secondary dark:text-gray-400">
                            {review.service_name}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Icon
                            key={i}
                            icon={i < Math.floor(review.rating) ? "ph:star-fill" : i < review.rating ? "ph:star-half-fill" : "ph:star"}
                            className="w-4 h-4 text-secondary dark:text-secondary-400"
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-text-primary dark:text-gray-300 text-sm">
                      {review.comment}
                    </p>
                    <p className="text-xs text-text-secondary dark:text-gray-400 mt-3">
                      {new Date(review.date).toLocaleDateString('fr-FR', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Quick Actions - Using theme colors */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-r from-primary to-primary/80 rounded-2xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm opacity-90">Proposer un service</p>
                <h3 className="text-xl font-bold mt-1">Mettez en avant vos compétences</h3>
              </div>
              <Icon icon="ph:megaphone" className="w-12 h-12 opacity-80" />
            </div>
            <Button variant="secondary" className="w-full bg-white text-primary hover:bg-gray-100 rounded-xl font-semibold">
              Créer un service
            </Button>
          </div>

          <div className="bg-gradient-to-r from-secondary to-secondary/80 rounded-2xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm opacity-90">Postuler</p>
                <h3 className="text-xl font-bold mt-1">Trouvez votre prochaine mission</h3>
              </div>
              <Icon icon="ph:briefcase" className="w-12 h-12 opacity-80" />
            </div>
            <Button variant="secondary" className="w-full bg-white text-secondary hover:bg-gray-100 rounded-xl font-semibold">
              Voir les missions
            </Button>
          </div>

          <div className="bg-gradient-to-r from-accent to-accent/80 rounded-2xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm opacity-90">Formation</p>
                <h3 className="text-xl font-bold mt-1">Améliorez vos compétences</h3>
              </div>
              <Icon icon="ph:graduation-cap" className="w-12 h-12 opacity-80" />
            </div>
            <Button variant="secondary" className="w-full bg-white text-accent hover:bg-gray-100 rounded-xl font-semibold">
              Explorer les cours
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}