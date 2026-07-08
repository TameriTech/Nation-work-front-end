// app/dashboard/customer/page.tsx - Version corrigée qui conserve les statcards originales
"use client";

import { useState, useMemo, useEffect } from "react";
import { Icon } from "@iconify/react";
import Link from "next/link";
import { cn } from "@/app/lib/utils";
import { useClientServices } from "@/app/hooks/services/use-client-service";
import { useAuth } from "@/app/hooks/auth/use-auth";
import { useRouter } from "next/navigation";
import DashboardError from "./error";
import DashboardSkeleton from "./loading";
import { useTheme } from "next-themes";

// Composant pour le graphique en anneau simplifié
const StatusDonutChart = ({ data, total }: { data: any[]; total: number }) => {
  return (
    <div className="relative">
      <div className="relative w-48 h-48 mx-auto">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
          {data.reduce((acc, item, index) => {
            const percentage = (item.value / total) * 100;
            const previousPercentages = acc.reduce((sum, _, i) => sum + (data[i].value / total) * 100, 0);
            const startAngle = (previousPercentages / 100) * 360;
            const endAngle = startAngle + (percentage / 100) * 360;
            
            const startRad = (startAngle * Math.PI) / 180;
            const endRad = (endAngle * Math.PI) / 180;
            
            const x1 = 50 + 40 * Math.cos(startRad);
            const y1 = 50 + 40 * Math.sin(startRad);
            const x2 = 50 + 40 * Math.cos(endRad);
            const y2 = 50 + 40 * Math.sin(endRad);
            
            const largeArc = percentage > 50 ? 1 : 0;
            
            const pathData = `M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArc} 1 ${x2} ${y2} Z`;
            
            acc.push(
              <path
                key={index}
                d={pathData}
                fill={item.color}
                className="transition-all duration-300 hover:opacity-80 cursor-pointer"
              />
            );
            return acc;
          }, [] as JSX.Element[])}
          <circle cx="50" cy="50" r="25" fill="white" className="dark:fill-gray-800" />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-2xl font-bold text-text-primary dark:text-gray-100">{total}</div>
            <div className="text-xs text-text-secondary dark:text-gray-400">Total</div>
          </div>
        </div>
      </div>
      
      <div className="mt-4 space-y-2">
        {data.map((item, idx) => (
          <div key={idx} className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
              <span className="text-text-secondary dark:text-gray-400">{item.name}</span>
            </div>
            <span className="font-semibold text-text-primary dark:text-gray-100">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function DashboardContent() {
  const router = useRouter();
  const { user } = useAuth();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const {
    services,
    isLoading,
    error,
    refetch,
  } = useClientServices({
    mode: "client",
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  // Calculer les statistiques à partir des services réels
  const stats = useMemo(() => {
    const published = services.filter((s) => s.status === "published").length;
    const inProgress = services.filter((s) => s.status === "in_progress").length;
    const completed = services.filter((s) => s.status === "completed").length;
    const cancelled = services.filter((s) => s.status === "cancelled").length;
    const total = services.length;

    // Calculs financiers
    const totalDepenses = services
      .filter((s) => s.status === "completed" || s.status === "in_progress")
      .reduce((acc, s) => acc + (s.proposed_amount || 0), 0);
    
    const totalPaye = services
      .filter((s) => s.status === "completed")
      .reduce((acc, s) => acc + (s.proposed_amount || 0), 0);
    
    const enAttentePaiement = services
      .filter((s) => s.status === "in_progress")
      .reduce((acc, s) => acc + (s.proposed_amount || 0), 0);

    const nextService = services
      .filter((s) => s.status === "in_progress" || s.status === "assigned")
      .sort(
        (a, b) =>
          new Date(a.date_pratique).getTime() - new Date(b.date_pratique).getTime()
      )[0];
      
    const currentService = services.find((s) => s.status === "in_progress");

    return {
      published,
      inProgress,
      completed,
      cancelled,
      total,
      nextService,
      currentService,
      applications: services.reduce(
        (acc, s) => acc + (s.candidatures_count || 0),
        0
      ),
      totalDepenses,
      totalPaye,
      enAttentePaiement,
    };
  }, [services]);

  // Données pour le graphique de répartition
  const chartData = useMemo(
    () =>
      [
        { name: "Publié", value: stats.published, color: "#1e40af" },
        { name: "En cours", value: stats.inProgress, color: "#f59e0b" },
        { name: "Terminé", value: stats.completed, color: "#10b981" },
        { name: "Annulé", value: stats.cancelled, color: "#ef4444" },
      ].filter((item) => item.value > 0),
    [stats]
  );

  // Services populaires pour le dashboard
  const popularServices = [
    { name: "Plomberie", icon: "ph:wrench", description: "Dépannage, installation et réparation", badge: "Urgence 24/7", color: "from-primary to-primary/80", jobs: 1245 },
    { name: "Électricité", icon: "ph:lightbulb", description: "Installation électrique et dépannage", badge: "Certifié", color: "from-primary to-secondary", jobs: 982 },
    { name: "Ménage", icon: "ph:broom", description: "Nettoyage complet de votre domicile", badge: "Best seller", color: "from-secondary to-secondary/80", jobs: 2156 },
  ];

  // Activités récentes transformées
  const activities = useMemo(
    () =>
      services.slice(0, 5).map((service) => ({
        id: service.id.toString(),
        date: new Date(service.created_at).toLocaleDateString("fr-FR"),
        title: service.title.substring(0, 30) + (service.title.length > 30 ? "..." : ""),
        status: service.status,
        amount: `${service.proposed_amount?.toLocaleString()} CFA`,
        provider: service.provider ? {
          name: service.provider.username || "Prestataire",
          phone: service.provider.phone_number || "-",
        } : undefined,
      })),
    [services]
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "published": return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
      case "in_progress": return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";
      case "completed": return "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300";
      case "cancelled": return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
      default: return "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "published": return "Publié";
      case "in_progress": return "En cours";
      case "completed": return "Terminé";
      case "cancelled": return "Annulé";
      default: return status;
    }
  };

  // FAQ Data
  const faqs = [
    {
      question: "Comment publier une mission ?",
      answer: "Cliquez sur 'Publier un service' dans votre dashboard, remplissez les informations concernant votre besoin (titre, description, date souhaitée, budget), et publiez. Les freelances qualifiés pourront alors postuler à votre mission.",
      icon: "ph:plus-circle"
    },
    {
      question: "Comment suivre mes dépenses ?",
      answer: "Dans votre dashboard, vous pouvez voir le total de vos dépenses, vos paiements effectués et les montants en attente. Un historique détaillé est disponible dans la section 'Activités récentes'.",
      icon: "ph:chart-line"
    },
    {
      question: "Comment se passe le paiement ?",
      answer: "Le paiement est sécurisé. Les fonds sont bloqués jusqu'à validation de la prestation. Vous ne débloquez le paiement qu'une fois satisfait du travail effectué.",
      icon: "ph:credit-card"
    },
    {
      question: "Que faire en cas de litige ?",
      answer: "Notre équipe support est disponible 24/7. En cas de problème, ouvrez un ticket depuis la page de la mission. Nous analyserons la situation et trouverons une solution équitable.",
      icon: "ph:handshake"
    },
  ];

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (error) {
    return <DashboardError error={error} onRetry={refetch} />;
  }

  return (
    <main className="bg-background dark:bg-gray-900 transition-colors duration-300">
      {/* Header avec bienvenue et bouton thème */}
      <div className="bg-gradient-to-r from-primary to-secondary px-6 py-8 rounded-b-3xl mb-8 relative">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                Bonjour {user?.username || "Client"} 👋
              </h1>
              <p className="text-primary-100">
                Bienvenue sur votre espace client. Gérez vos services et suivez vos dépenses.
              </p>
            </div>
            
            {mounted && (
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-all backdrop-blur-sm"
                aria-label="Changer de thème"
              >
                {theme === "dark" ? (
                  <Icon icon="ph:sun" className="w-5 h-5 text-white" />
                ) : (
                  <Icon icon="ph:moon" className="w-5 h-5 text-white" />
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        
        {/* Section principale avec 2 colonnes comme l'original */}
        <div className="grid gap-6 grid-cols-1 lg:grid-cols-12 mb-12">
          
          {/* COLONNE DE GAUCHE */}
          <div className="lg:col-span-8 space-y-6">
            {/* 4 StatCards - on garde la structure originale avec 2 lignes de 2 cartes */}
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
              
              {/* Carte 1: Services publiés (conservée) */}
              <div className="bg-surface dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all duration-300">
                <div className="flex justify-between items-start mb-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center">
                    <Icon icon="ph:check-circle" className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-xs px-2 py-1 bg-primary/10 text-primary dark:bg-primary/20 rounded-full">
                    {((stats.published / (stats.total || 1)) * 100).toFixed(1)}% du total
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-text-primary dark:text-gray-100">{stats.published}</h3>
                <p className="text-text-secondary dark:text-gray-400 text-sm">Services publiés</p>
                <button 
                  onClick={() => router.push("/dashboard/customer/services?status=published")}
                  className="mt-3 text-primary text-sm font-medium hover:gap-2 transition-all inline-flex items-center gap-1"
                >
                  Historique
                  <Icon icon="ph:arrow-right" className="w-3 h-3" />
                </button>
              </div>

              {/* Carte 2: Candidatures reçues (conservée) */}
              <div className="bg-surface dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all duration-300">
                <div className="flex justify-between items-start mb-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
                    <Icon icon="ph:briefcase" className="w-5 h-5 text-white" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-text-primary dark:text-gray-100">{stats.applications}</h3>
                <p className="text-text-secondary dark:text-gray-400 text-sm">Candidatures reçues</p>
                <button 
                  onClick={() => router.push("/dashboard/customer/candidatures")}
                  className="mt-3 text-primary text-sm font-medium hover:gap-2 transition-all inline-flex items-center gap-1"
                >
                  Consulter
                  <Icon icon="ph:arrow-right" className="w-3 h-3" />
                </button>
              </div>

              {/* Carte 3: Dépenses totales (NOUVELLE - remplace "Services en cours" qui est moins pertinent) */}
              <div className="bg-surface dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all duration-300">
                <div className="flex justify-between items-start mb-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center">
                    <Icon icon="ph:shopping-cart" className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-xs px-2 py-1 bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 rounded-full">
                    Total
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-text-primary dark:text-gray-100">
                  {stats.totalDepenses.toLocaleString()} CFA
                </h3>
                <p className="text-text-secondary dark:text-gray-400 text-sm">Dépenses totales</p>
                <button 
                  onClick={() => router.push("/dashboard/customer/payments")}
                  className="mt-3 text-primary text-sm font-medium hover:gap-2 transition-all inline-flex items-center gap-1"
                >
                  Détails
                  <Icon icon="ph:arrow-right" className="w-3 h-3" />
                </button>
              </div>

              {/* Carte 4: Prochain service (conservée mais améliorée) */}
              <div className="bg-surface dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all">
                <div className="p-5">
                  <div className="flex justify-between items-center mb-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/70 rounded-xl flex items-center justify-center">
                      <Icon icon="ph:calendar" className="w-5 h-5 text-white" />
                    </div>
                    <button
                      onClick={() => router.push("/dashboard/customer/services")}
                      className="text-xs px-3 py-1 rounded-full border border-primary/30 text-primary hover:bg-primary/10 transition-all"
                    >
                      Consulter
                    </button>
                  </div>

                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-xs text-text-secondary dark:text-gray-400 mb-1">Prochain service</p>
                      <p className="text-sm font-bold text-text-primary dark:text-gray-100">
                        {stats.nextService
                          ? `${new Date(stats.nextService.date_pratique).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })} - ${new Date(stats.nextService.date_pratique).toLocaleDateString("fr-FR")}`
                          : "Aucun service prévu"}
                      </p>
                    </div>

                    {stats.nextService?.provider ? (
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-semibold">
                        {stats.nextService.provider.username?.charAt(0).toUpperCase() || "P"}
                      </div>
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                        <Icon icon="ph:user" className="w-5 h-5 text-gray-400" />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* COLONNE DE DROITE - Inchangée */}
          <div className="lg:col-span-4 space-y-6">
            {/* Service en cours */}
            {stats.currentService && (
              <div className="bg-surface dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                <div className="bg-gradient-to-r from-primary to-secondary px-5 py-3">
                  <h3 className="text-white font-semibold flex items-center gap-2">
                    <Icon icon="ph:clock" className="w-4 h-4" />
                    Service en cours
                  </h3>
                </div>
                <div className="p-5">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                      <Icon icon="ph:wrench" className="w-7 h-7 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-text-primary dark:text-gray-100">
                        {stats.currentService.title || "Service en cours"}
                      </h4>
                      <p className="text-sm text-text-secondary dark:text-gray-400 mt-1">
                        {stats.currentService.short_description?.substring(0, 60) || "Description du service"}
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-text-secondary dark:text-gray-400">Prestataire</span>
                      <span className="font-medium text-text-primary dark:text-gray-100">
                        {stats.currentService.provider?.username || "En attente d'assignation"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-text-secondary dark:text-gray-400">Montant</span>
                      <span className="font-medium text-text-primary dark:text-gray-100">
                        {stats.currentService.proposed_amount?.toLocaleString()} CFA
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-text-secondary dark:text-gray-400">Date</span>
                      <span className="font-medium text-text-primary dark:text-gray-100">
                        {new Date(stats.currentService.date_pratique).toLocaleDateString("fr-FR")}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <button className="flex-1 px-3 py-2 bg-primary text-white rounded-xl text-sm font-medium hover:bg-primary/90 transition-colors">
                      Suivre
                    </button>
                    <button className="px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-medium text-text-secondary hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                      Contacter
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Graphique de répartition */}
            {chartData.length > 0 && (
              <div className="bg-surface dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-5">
                <h3 className="font-semibold text-text-primary dark:text-gray-100 mb-4 flex items-center gap-2">
                  <Icon icon="ph:chart-pie" className="w-5 h-5 text-primary" />
                  Répartition des services
                </h3>
                <StatusDonutChart data={chartData} total={stats.total} />
              </div>
            )}
          </div>
        </div>

        {/* Bouton d'action principal */}
        <div className="mb-12">
          <button
            onClick={() => router.push("/dashboard/customer/services/create")}
            className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-primary to-secondary text-white rounded-2xl font-semibold hover:shadow-lg hover:scale-105 transition-all inline-flex items-center justify-center gap-2"
          >
            <Icon icon="ph:plus" className="w-5 h-5" />
            Publier un nouveau service
          </button>
        </div>

        {/* Tableau des activités récentes */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm mb-2">
                <Icon icon="ph:clock-counter-clockwise" className="w-3 h-3" />
                <span>Historique</span>
              </div>
              <h2 className="text-2xl font-bold text-text-primary dark:text-gray-100">
                Activités <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">récentes</span>
              </h2>
            </div>
            <Link 
              href="/dashboard/customer/services"
              className="text-primary font-medium text-sm hover:gap-2 transition-all inline-flex items-center gap-1"
            >
              Voir tout
              <Icon icon="ph:arrow-right" className="w-3 h-3" />
            </Link>
          </div>

          {activities.length > 0 ? (
            <div className="bg-surface dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-900/50">
                    <tr>
                      <th className="text-left p-4 text-sm font-semibold text-text-secondary dark:text-gray-400">Date</th>
                      <th className="text-left p-4 text-sm font-semibold text-text-secondary dark:text-gray-400">Service</th>
                      <th className="text-left p-4 text-sm font-semibold text-text-secondary dark:text-gray-400">Statut</th>
                      <th className="text-left p-4 text-sm font-semibold text-text-secondary dark:text-gray-400">Prestataire</th>
                      <th className="text-left p-4 text-sm font-semibold text-text-secondary dark:text-gray-400">Montant</th>
                      <th className="text-left p-4 text-sm font-semibold text-text-secondary dark:text-gray-400"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {activities.map((activity) => (
                      <tr key={activity.id} className="border-t border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                        <td className="p-4 text-sm text-text-primary dark:text-gray-300">{activity.date}</td>
                        <td className="p-4 text-sm text-text-primary dark:text-gray-300 font-medium">{activity.title}</td>
                        <td className="p-4">
                          <span className={cn("text-xs px-2 py-1 rounded-full", getStatusColor(activity.status))}>
                            {getStatusLabel(activity.status)}
                          </span>
                        </td>
                        <td className="p-4 text-sm text-text-primary dark:text-gray-300">
                          {activity.provider?.name || "-"}
                        </td>
                        <td className="p-4 text-sm font-semibold text-text-primary dark:text-gray-300">{activity.amount}</td>
                        <td className="p-4">
                          <button 
                            onClick={() => router.push(`/dashboard/customer/services/${activity.id}`)}
                            className="text-primary text-sm hover:underline"
                          >
                            Détails
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="bg-surface dark:bg-gray-800 rounded-2xl p-12 text-center border border-gray-100 dark:border-gray-700">
              <Icon icon="ph:inbox" className="w-16 h-16 text-text-secondary dark:text-gray-500 mx-auto mb-4" />
              <p className="text-text-secondary dark:text-gray-400">Aucune activité récente</p>
              <button 
                onClick={() => router.push("/dashboard/customer/services/create")}
                className="mt-4 text-primary font-medium hover:underline"
              >
                Publier votre premier service
              </button>
            </div>
          )}
        </section>

        {/* Services populaires */}
        <section className="mb-12">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm mb-2">
              <Icon icon="ph:sparkle" className="w-3 h-3" />
              <span>Inspiration</span>
            </div>
            <h2 className="text-2xl font-bold text-text-primary dark:text-gray-100">
              Services les plus 
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"> demandés</span>
            </h2>
            <p className="text-text-secondary dark:text-gray-400 mt-2">
              Inspirez-vous des services populaires pour vos besoins
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {popularServices.map((service) => (
              <div
                key={service.name}
                className="group rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-2 border bg-surface dark:bg-gray-800 border-gray-100 dark:border-gray-700"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-14 h-14 bg-gradient-to-br ${service.color} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                    <Icon icon={service.icon} className="w-7 h-7 text-white" />
                  </div>
                  {service.badge && (
                    <span className="text-xs px-2 py-1 bg-secondary/10 text-secondary dark:bg-secondary/20 rounded-full">
                      {service.badge}
                    </span>
                  )}
                </div>
                <h3 className="text-xl font-semibold text-text-primary dark:text-gray-100 mb-2">{service.name}</h3>
                <p className="text-text-secondary dark:text-gray-400 text-sm mb-3">{service.description}</p>
                <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700">
                  <span className="text-xs text-text-secondary dark:text-gray-400">{service.jobs}+ missions</span>
                  <button 
                    onClick={() => router.push(`/dashboard/customer/services/create?category=${service.name.toLowerCase()}`)}
                    className="text-primary font-medium text-sm hover:gap-2 transition-all inline-flex items-center gap-1"
                  >
                    Publier
                    <Icon icon="ph:arrow-right" className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section FAQ */}
        <section className="py-12 bg-gray-50 dark:bg-gray-800/50 rounded-3xl px-6">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm mb-4">
              <Icon icon="ph:chat-circle" className="w-3 h-3" />
              <span>Questions fréquentes</span>
            </div>
            <h2 className="text-2xl font-bold text-text-primary dark:text-gray-100">
              Vous avez des
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"> questions ?</span>
            </h2>
            <p className="text-text-secondary dark:text-gray-400 mt-2">
              Retrouvez les réponses aux questions les plus fréquentes
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className={cn(
                  "mb-4 rounded-2xl shadow-sm overflow-hidden transition-all duration-300 border",
                  "bg-surface dark:bg-gray-800",
                  "border-gray-100 dark:border-gray-700"
                )}
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                >
                  <div className="flex items-center gap-3 flex-1">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10 dark:from-primary/20 dark:to-secondary/20 flex items-center justify-center flex-shrink-0">
                      <Icon icon={faq.icon} className="w-5 h-5 text-primary" />
                    </div>
                    <span className="font-semibold text-text-primary dark:text-gray-100">
                      {faq.question}
                    </span>
                  </div>
                  <Icon
                    icon={openFaqIndex === index ? "ph:minus" : "ph:plus"}
                    className="w-5 h-5 text-primary flex-shrink-0 transition-transform duration-300"
                  />
                </button>
                
                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    openFaqIndex === index ? "max-h-48" : "max-h-0"
                  }`}
                >
                  <div className="p-5 pt-0 pl-16 text-text-secondary dark:text-gray-400 leading-relaxed text-sm">
                    {faq.answer}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Support */}
        <section className="mt-12">
          <div className="bg-gradient-to-r from-primary to-secondary rounded-3xl p-8 text-center">
            <h3 className="text-xl font-bold text-white mb-2">
              Besoin d'aide ?
            </h3>
            <p className="text-primary-100 mb-4">
              Notre équipe support est disponible 24/7 pour vous assister
            </p>
            <button className="px-6 py-2 bg-white text-primary rounded-full font-semibold hover:shadow-lg transition-all inline-flex items-center gap-2">
              <Icon icon="ph:headset" className="w-4 h-4" />
              Contacter le support
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}