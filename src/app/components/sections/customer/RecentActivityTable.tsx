"use client";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Badge } from "@/app/components/ui/badge";
import { Checkbox } from "@/app/components/ui/checkbox";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/app/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/components/ui/table";
import { Icon } from "@iconify/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import ServiceFormWizard from "@/app/components/features/service-form/ServiceFormWizard";

interface Activity {
  id: string;
  date: string;
  type: string;
  status: "en_cours" | "publie" | "termine" | "annule" | "en_attente";
  provider?: {
    name: string;
    phone: string;
    avatar?: string;
  };
  amount: string;
}

interface RecentActivityTableProps {
  activities: Activity[];
}

const statusConfig = {
  en_cours: {
    label: "En cours",
    className: "bg-amber-100 text-amber-700 border-amber-200",
  },
  publie: {
    label: "Publié",
    className: "bg-blue-900/20 text-primary border-blue-900/40",
  },
  termine: {
    label: "Terminé",
    className: "bg-emerald-100 text-emerald-700 border-emerald-200",
  },
  annule: {
    label: "Annulé",
    className: "bg-destructive/10 text-destructive border-destructive/20",
  },
  en_attente: {
    label: "En attente",
    className: "bg-muted text-slate-400 border-border",
  },
};

export const RecentActivityTable = ({
  activities,
}: RecentActivityTableProps) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="">
      <Card className="bg-white text-gray-800 rounded-[30px]">
        <CardHeader className="flex-col md:flex-row gap-4 items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-sm font-semibold uppercase tracking-wide text-slate-400">
            Activité récente
          </CardTitle>
          <div className="flex gap-2">
            <Button
              onClick={() => setIsOpen(true)}
              className="gap-2 bg-amber-600 rounded-[50px] hover:bg-orange-900 text-white"
            >
              <Icon icon={"bi:plus"} className="h-4 w-4" />
              Publier un service sur Nation Work
            </Button>
            <Button
              variant="outline"
              className="gap-1 text-blue-900 bg-transparent rounded-[50px] border border-blue-900"
            >
              Voir <Icon icon={"bi:plus"} className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-b border-blue-900">
                <TableHead className="w-12">
                  <Checkbox />
                </TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Prestataire</TableHead>
                <TableHead>Montant</TableHead>
                <TableHead className="w-24"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {activities.map((activity) => {
                const status = statusConfig[activity.status];
                return (
                  <TableRow
                    key={activity.id}
                    className="border-b border-gray-300"
                  >
                    <TableCell>
                      {/** change background when checkbox is checked */}
                      <Checkbox className="bg-gray-100" />
                    </TableCell>
                    <TableCell className="text-slate-400 text-nowrap">
                      {activity.date}
                    </TableCell>
                    <TableCell>{activity.type}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={status.className}>
                        <span
                          className={`mr-1.5 h-1.5 w-1.5 rounded-full text-nowrap ${
                            activity.status === "en_cours"
                              ? "bg-amber-500"
                              : activity.status === "publie"
                              ? "bg-blue-500"
                              : activity.status === "termine"
                              ? "bg-emerald-500"
                              : activity.status === "annule"
                              ? "bg-destructive"
                              : "bg-slate-400"
                          }`}
                        />
                        {status.label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {activity.provider ? (
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage
                              src={activity.provider.avatar}
                              alt={activity.provider.name}
                            />
                            <AvatarFallback>
                              {activity.provider.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium text-nowrap">
                              {activity.provider.name}
                            </p>
                            <p className="text-xs text-slate-400 text-nowrap">
                              {activity.provider.phone}
                            </p>
                          </div>
                        </div>
                      ) : (
                        <span className="text-slate-400">-</span>
                      )}
                    </TableCell>
                    <TableCell className="font-medium">
                      {activity.amount}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Icon
                            icon={"bi:eye"}
                            className="h-4 w-4 text-slate-400"
                          />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Icon
                            icon={"bi:link-45deg"}
                            className="h-4 w-4 text-slate-400"
                          />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Icon
                            icon={"bi:trash"}
                            className="h-4 w-4 text-destructive"
                          />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      {isOpen && (
        <ServiceFormWizard mode="create" onCancel={() => setIsOpen(false)} />
      )}
    </div>
  );
};
