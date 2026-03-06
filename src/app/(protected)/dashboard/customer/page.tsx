// app/dashboard/customer/page.tsx
"use client";

import { StatCard } from "@/app/components/ui/Cards/StatCard";
import { CurrentServiceCard } from "@/app/components/sections/customer/CurrentServiceCard";
import { RecentActivityTable } from "@/app/components/sections/customer/RecentActivityTable";
import { StatusDistributionChart } from "@/app/components/sections/customer/StatusDistributionChart";
import { Card, CardContent } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/app/components/ui/avatar";
import { Icon } from "@iconify/react";
import { useServices } from "@/app/hooks/services/use-services";
import { useAuth } from "@/app/hooks/auth/use-auth";

import { DashboardError } from "./error";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { DashboardSkeleton } from "./candidatures/loading";

export const DashboardContent = () => {
  const router = useRouter();
  const { user } = useAuth();

  const {
    services,
    isLoading,
    error,
    refetch,
    stats: serviceStats,
  } = useServices({
    mode: "client",
  });

  // Calculer les statistiques à partir des services réels
  const stats = useMemo(() => {
    const published = services.filter((s) => s.status === "published").length;
    const inProgress = services.filter(
      (s) => s.status === "in_progress",
    ).length;
    const completed = services.filter((s) => s.status === "completed").length;
    const cancelled = services.filter((s) => s.status === "canceled").length;
    const total = services.length;

    // Calculer le prochain service
    const nextService = services
      .filter((s) => s.status === "in_progress" || s.status === "assigned")
      .sort(
        (a, b) =>
          new Date(a.date_pratique).getTime() -
          new Date(b.date_pratique).getTime(),
      )[0];

    return {
      published,
      inProgress,
      completed,
      cancelled,
      total,
      nextService,
      applications: services.reduce(
        (acc, s) => acc + (s.candidatures_count || 0),
        0,
      ),
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
    [stats],
  );

  // Transformer les services en activités récentes
  const activities = useMemo(
    () =>
      services.slice(0, 5).map((service) => ({
        id: service.id.toString(),
        date: new Date(service.created_at).toLocaleDateString("fr-FR"),
        type: service.title.substring(0, 10) + "...",
        status: service.status as any,
        provider: service.freelancer
          ? {
              name: service.freelancer.username || "Prestataire",
              phone: service.freelancer.phone_number || "-",
              avatar: service.freelancer.profile_picture,
            }
          : undefined,
        amount: `${service.proposed_amount?.toLocaleString()} FCFA`,
      })),
    [services],
  );

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (error) {
    return <DashboardError error={error} onRetry={refetch} />;
  }

  return (
    <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-12">
      {/* LEFT COLUMN */}
      <div className="col-span-1 md:col-span-2 lg:col-span-8 space-y-6">
        {/* Stats */}
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
          <StatCard
            icon="bi:check-circle"
            label="Services publiés"
            value={stats.published}
            change={`${((stats.published / (stats.total || 1)) * 100).toFixed(1)}% du total`}
            actionLabel="Historique"
            variant="primary"
            onClick={() =>
              router.push("/dashboard/customer/services?status=published")
            }
          />

          <StatCard
            icon="bi:briefcase"
            label="Candidatures reçues"
            value={stats.applications}
            change="Toutes vos offres"
            actionLabel="Consulter"
            onClick={() => router.push("/dashboard/customer/candidatures")}
          />

          <StatCard
            icon="bi:phone"
            label="Services en cours"
            value={stats.inProgress}
            change="Actuellement en cours"
            actionLabel="Voir"
            onClick={() =>
              router.push("/dashboard/customer/services?status=in_progress")
            }
          />

          {/* Next service card */}
          <Card className="bg-white rounded-[30px] shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="flex flex-col gap-4 p-5">
              <div className="flex justify-between items-center">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-900/10">
                  <Icon icon="bi:calendar" className="h-5 w-5 text-blue-900" />
                </div>

                <Button
                  size="sm"
                  variant="outline"
                  className="rounded-full border-blue-900 text-xs hover:bg-blue-50"
                  onClick={() => router.push("/dashboard/customer/services")}
                >
                  Consulter
                </Button>
              </div>

              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-500">Prochain service</p>
                  <p className="text-lg font-bold text-gray-800">
                    {stats.nextService
                      ? `${new Date(stats.nextService.date_pratique).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })} - ${new Date(stats.nextService.date_pratique).toLocaleDateString("fr-FR")}`
                      : "Aucun service prévu"}
                  </p>
                </div>

                {stats.nextService?.freelancer ? (
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={stats.nextService.freelancer.username} />
                    <AvatarFallback className="bg-blue-100 text-blue-900">
                      {stats.nextService.freelancer.username?.charAt(0) || "P"}
                    </AvatarFallback>
                  </Avatar>
                ) : (
                  <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                    <Icon icon="bi:person" className="h-5 w-5 text-gray-400" />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Activity table */}
        <div className="mt-6">
          <RecentActivityTable
            activities={activities}
            onPublishClick={() =>
              router.push("/dashboard/customer/services/create")
            }
          />
        </div>
      </div>

      {/* RIGHT COLUMN */}
      <div className="col-span-1 md:col-span-2 w-full lg:col-span-4 space-y-6">
        {stats.inProgress > 0 && (
          <CurrentServiceCard
            title={
              services.find((s) => s.status === "in_progress")?.title ||
              "Service en cours"
            }
            providerName={
              services.find((s) => s.status === "in_progress")?.freelancer
                ?.username || "En attente d'assignation"
            }
            providerSpecialty="Prestataire"
            providerRating={4}
            description={
              services.find((s) => s.status === "in_progress")
                ?.short_description || "Description du service"
            }
            startTime={
              services.find((s) => s.status === "in_progress")?.start_time ||
              "08:00"
            }
            address={`${services.find((s) => s.status === "in_progress")?.city || "Ville"}, ${services.find((s) => s.status === "in_progress")?.country || "Pays"}`}
            estimatedTime={
              services.find((s) => s.status === "in_progress")?.duration || "5h"
            }
            status="in_progress"
          />
        )}

        <StatusDistributionChart data={chartData} total={stats.total} />
      </div>
    </div>
  );
};
