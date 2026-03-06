// app/dashboard/customer/page.tsx
"use client";

import { CandidatureTable } from "@/app/components/sections/customer/CandidatureTable";
import { Card, CardContent } from "@/app/components/ui/card";
import { Icon } from "@iconify/react";
import { useCandidatures } from "@/app/hooks/applications/use-candidatures";
import { useAuth } from "@/app/hooks/auth/use-auth";
import { DashboardSkeleton } from "./loading";
import { DashboardError } from "./error";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  icon: React.ReactNode;
  bgColor?: string;
  textColor?: string;
  iconBgColor?: string;
}

const StatCard = ({
  title,
  value,
  subtitle,
  icon,
  bgColor = "bg-blue-900",
  textColor = "text-white",
  iconBgColor = "bg-primary/10",
}: StatCardProps) => (
  <Card className={`${bgColor} ${textColor} rounded-[30px] border-0 shadow-lg`}>
    <CardContent className="p-6">
      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <p className="text-sm opacity-90">{title}</p>
          <div>
            <span className="text-3xl font-bold">{value}</span>
            <p className="text-xs opacity-75 mt-1">{subtitle}</p>
          </div>
        </div>
        <div
          className={`w-12 h-12 rounded-full ${iconBgColor} flex items-center justify-center`}
        >
          {icon}
        </div>
      </div>
    </CardContent>
  </Card>
);

export default function CustomerDashboardPage() {
  const { user } = useAuth();
  const { stats, candidatures, isLoading, error, refetch, updateStatus } =
    useCandidatures({
      freelancerId: undefined, // Pour les clients, on ne filtre pas par freelancer
      // type: "received", // Pour les clients, les candidatures reçues
      serviceId: user?.id,
    });

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (error) {
    return <DashboardError error={error} onRetry={refetch} />;
  }

  const dashboardStats = {
    pendingApplications: stats?.pending || 0,
    pendingIncrease: "+4 depuis hier",
    assignedApplications: stats?.accepted || 0,
    assignedIncrease: "+1 cette semaine",
    acceptanceRate: stats?.total
      ? `${Math.round((stats.accepted / stats.total) * 100)}%`
      : "0%",
    acceptanceSubtitle: "taux d'acceptation",
  };

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Bonjour, {user?.username || "Client"}
          </h1>
          <p className="text-gray-500 mt-1">
            Voici un aperçu de vos activités récentes
          </p>
        </div>
        <div className="flex gap-3">
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <Icon icon="bi:bell" className="w-5 h-5 text-gray-600" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <Icon icon="bi:gear" className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Top Stats Row */}
      <div className="grid gap-6 grid-cols-1 md:grid-cols-3">
        <StatCard
          title="Candidatures en attente"
          value={dashboardStats.pendingApplications}
          subtitle={dashboardStats.pendingIncrease}
          bgColor="bg-gradient-to-br from-blue-900 to-blue-800"
          textColor="text-white"
          iconBgColor="bg-white/20"
          icon={<Icon icon="bi:clock-history" className="w-6 h-6 text-white" />}
        />

        <StatCard
          title="Candidatures acceptées"
          value={dashboardStats.assignedApplications}
          subtitle={dashboardStats.assignedIncrease}
          bgColor="bg-white"
          textColor="text-gray-900"
          iconBgColor="bg-green-100"
          icon={
            <Icon icon="bi:check-circle" className="w-6 h-6 text-green-600" />
          }
        />

        <StatCard
          title="Taux d'acceptation"
          value={dashboardStats.acceptanceRate}
          subtitle={dashboardStats.acceptanceSubtitle}
          bgColor="bg-white"
          textColor="text-gray-900"
          iconBgColor="bg-blue-100"
          icon={<Icon icon="bi:graph-up" className="w-6 h-6 text-blue-600" />}
        />
      </div>

      {/* Activity Table */}
      <div className="bg-white rounded-[30px] p-6 shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            Candidatures reçues
          </h2>
          <span className="text-sm text-gray-500">
            Total: {stats?.total || 0}
          </span>
        </div>
        <CandidatureTable
          candidatures={candidatures}
          onStatusChange={updateStatus}
        />
      </div>
    </div>
  );
}
