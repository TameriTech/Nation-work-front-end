import { StatCard } from "./StatCard";
import { CurrentServiceCard } from "./CurrentServiceCard";
import { RecentActivityTable } from "./RecentActivityTable";
import { StatusDistributionChart } from "./StatusDistributionChart";
import { Card, CardContent } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/app/components/ui/avatar";
import { Icon } from "@iconify/react";

const activities = [
  {
    id: "1",
    date: "2024-02-...",
    type: "Develo...",
    status: "en_cours" as const,
    provider: { name: "Ludivin Dev", phone: "+234 055 31...", avatar: "" },
    amount: "4 500 ₦",
  },
  {
    id: "2",
    date: "2024-03-...",
    type: "Cuisine",
    status: "publie" as const,
    provider: undefined,
    amount: "500 ₦",
  },
  {
    id: "3",
    date: "2024-03-...",
    type: "Ui Desi...",
    status: "termine" as const,
    provider: { name: "Derick NA...", phone: "+237 655 31...", avatar: "" },
    amount: "1 500 ₦",
  },
  {
    id: "4",
    date: "2024-03-...",
    type: "Manag...",
    status: "termine" as const,
    provider: { name: "Michael", phone: "+234 055 31...", avatar: "" },
    amount: "0 ₦",
  },
  {
    id: "5",
    date: "2024-03-...",
    type: "Analyste",
    status: "publie" as const,
    provider: undefined,
    amount: "14 500 ₦",
  },
];

const statusData = [
  { name: "Publié", value: 18, color: "#1e40af" },
  { name: "En cours", value: 11, color: "#f59e0b" },
  { name: "Terminé", value: 4, color: "#10b981" },
  { name: "En attente", value: 2, color: "#6b7280" },
  { name: "Annulé", value: 7, color: "#ef4444" },
];

export const DashboardContent = () => {
  return (
    <div className="space-y-6 grid grid-cols-10 gap-5">
      {/* Top Stats Row */}
      <div className="col-span-7 grid  gap-4 grid-cols-2">
        <StatCard
          icon={"bi:check-circle"}
          label="Services publiés"
          value={34}
          change="+12,4% vs le mois dernier"
          actionLabel="Historique"
          variant="primary"
        />
        <StatCard
          icon={"bi:briefcase"}
          label="Candidatures reçues"
          value={87}
          change="+8,3% vs le mois dernier"
          actionLabel="Consulter"
        />
        <StatCard
          icon={"bi:phone"}
          label="Services en cours"
          value="02"
          change="Ménage + Livraison"
          actionLabel="Voir"
        />
        <Card className="bg-white text-gray-900 rounded-[30px]">
          <CardContent className="flex flex-col items-center justify-between p-5">
            <div className="w-full flex justify-between items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <Icon icon={"bi:calendar"} className="h-5 w-5 text-primary" />
              </div>

              <Button
                variant="outline"
                className="text-xs bg-transparent border-1 border-blue-900 rounded-[50px]"
                size="sm"
              >
                Consulter
              </Button>
            </div>
            <div className="flex w-full justify-between items-center gap-2">
              <div>
                <p className="text-sm text-muted-foreground">
                  Prochain service
                </p>
                <p className="text-xl font-bold">14h - 26/12/25</p>
              </div>
              <Avatar className="h-10 w-10">
                <AvatarImage src="" alt="Provider" />
                <AvatarFallback>P</AvatarFallback>
              </Avatar>
            </div>
          </CardContent>
        </Card>

        {/* Activity Table - Takes 2 columns */}
        <div className="col-span-full space-y-6">
          <RecentActivityTable activities={activities} />
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="col-span-3 grid grid-cols-1 gap-6">
        {/* Right Sidebar Cards */}
        <CurrentServiceCard
          title="Intitulé ou type de service"
          providerName="Nom + Prenom"
          providerSpecialty="Spécialité du prestatai..."
          providerRating={4}
          description="Courte description ici Courte description ici Courte description ici Courte description ici"
          startTime="08 - 20"
          address="Lagos"
          estimatedTime="5h"
          status="en_cours"
        />
        <StatusDistributionChart data={statusData} total={42} />
      </div>
    </div>
  );
};
