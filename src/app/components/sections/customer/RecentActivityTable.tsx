// components/sections/customer/RecentActivityTable.tsx
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
import { useState } from "react";

interface Activity {
  id: string;
  date: string;
  type: string;
  status: "in_progress" | "published" | "completed" | "cancelled" | "pending";
  provider?: {
    name: string;
    phone: string;
    avatar?: string;
  };
  amount: string;
}

interface RecentActivityTableProps {
  activities: Activity[];
  onPublishClick?: () => void;
}

const statusConfig = {
  in_progress: {
    label: "En cours",
    className: "bg-amber-100 text-amber-700 border-amber-200",
    dotColor: "bg-amber-500",
  },
  published: {
    label: "Publié",
    className: "bg-blue-100 text-blue-700 border-blue-200",
    dotColor: "bg-blue-500",
  },
  completed: {
    label: "Terminé",
    className: "bg-emerald-100 text-emerald-700 border-emerald-200",
    dotColor: "bg-emerald-500",
  },
  cancelled: {
    label: "Annulé",
    className: "bg-red-100 text-red-700 border-red-200",
    dotColor: "bg-red-500",
  },
  pending: {
    label: "En attente",
    className: "bg-gray-100 text-gray-700 border-gray-200",
    dotColor: "bg-gray-400",
  },
};

export const RecentActivityTable = ({
  activities,
  onPublishClick,
}: RecentActivityTableProps) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(activities.map((a) => a.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedIds((prev) => [...prev, id]);
    } else {
      setSelectedIds((prev) => prev.filter((item) => item !== id));
    }
  };

  return (
    <Card className="bg-white text-gray-800 rounded-[30px] shadow-lg">
      <CardHeader className="flex-col md:flex-row gap-4 items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-sm font-semibold uppercase tracking-wide text-gray-400">
          Activité récente
        </CardTitle>
        <div className="flex gap-2">
          <Button
            onClick={onPublishClick}
            className="gap-2 bg-amber-600 rounded-full hover:bg-amber-700 text-white px-6"
          >
            <Icon icon="bi:plus" className="h-4 w-4" />
            Publier un service
          </Button>
          <Button
            variant="outline"
            className="gap-1 text-blue-900 bg-transparent rounded-full border-blue-900 hover:bg-blue-50 px-6"
          >
            Voir tout <Icon icon="bi:arrow-right" className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {activities.length === 0 ? (
          <div className="text-center py-12">
            <Icon
              icon="bi:inbox"
              className="w-12 h-12 text-gray-300 mx-auto mb-4"
            />
            <p className="text-gray-500">Aucune activité récente</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-gray-200 bg-gray-50">
                  <TableHead className="w-12 rounded-l-lg">
                    <Checkbox
                      checked={selectedIds.length === activities.length}
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Prestataire</TableHead>
                  <TableHead>Montant</TableHead>
                  <TableHead className="rounded-r-lg w-24"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {activities.map((activity) => {
                  const status = statusConfig[activity.status];
                  return (
                    <TableRow
                      key={activity.id}
                      className="border-b border-gray-100 hover:bg-gray-50"
                    >
                      <TableCell>
                        <Checkbox
                          checked={selectedIds.includes(activity.id)}
                          onCheckedChange={(checked) =>
                            handleSelectOne(activity.id, checked as boolean)
                          }
                        />
                      </TableCell>
                      <TableCell className="text-gray-500 whitespace-nowrap">
                        {activity.date}
                      </TableCell>
                      <TableCell className="font-medium">
                        {activity.type}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={`${status.className} border-0 whitespace-nowrap`}
                        >
                          <span className="flex items-center gap-1.5">
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${status.dotColor}`}
                            />
                            {status.label}
                          </span>
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
                              <AvatarFallback className="bg-blue-100 text-blue-900">
                                {activity.provider.name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="text-sm font-medium">
                                {activity.provider.name}
                              </p>
                              <p className="text-xs text-gray-400">
                                {activity.provider.phone}
                              </p>
                            </div>
                          </div>
                        ) : (
                          <span className="text-gray-400 text-sm">
                            Non assigné
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="font-medium">
                        {activity.amount}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 hover:bg-gray-100"
                            title="Voir détails"
                          >
                            <Icon
                              icon="bi:eye"
                              className="h-4 w-4 text-gray-500"
                            />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 hover:bg-gray-100"
                            title="Lien"
                          >
                            <Icon
                              icon="bi:link-45deg"
                              className="h-4 w-4 text-gray-500"
                            />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 hover:bg-red-100"
                            title="Supprimer"
                          >
                            <Icon
                              icon="bi:trash"
                              className="h-4 w-4 text-red-500"
                            />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
