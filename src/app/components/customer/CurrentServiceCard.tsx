import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Badge } from "@/app/components/ui/badge";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/app/components/ui/avatar";
import { Icon } from "@iconify/react";

interface CurrentServiceCardProps {
  title: string;
  providerName: string;
  providerSpecialty: string;
  providerRating: number;
  providerAvatar?: string;
  description: string;
  startTime: string;
  address: string;
  estimatedTime: string;
  status: "en_cours" | "termine" | "en_attente";
}

export const CurrentServiceCard = ({
  title,
  providerName,
  providerSpecialty,
  providerRating,
  providerAvatar,
  description,
  startTime,
  address,
  estimatedTime,
  status,
}: CurrentServiceCardProps) => {
  const statusConfig = {
    en_cours: { label: "En cours", color: "bg-emerald-500" },
    termine: { label: "Terminé", color: "bg-primary" },
    en_attente: { label: "En attente", color: "bg-amber-500" },
  };

  const currentStatus = statusConfig[status];

  return (
    <Card className="h-full w-full bg-white rounded-[30px]">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold uppercase tracking-wide text-gray-800">
          Services en cours
        </CardTitle>
        <p className="text-base font-semibold text-blue-900">{title}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-start gap-3">
          <Avatar className="h-10 w-10 rounded-sm">
            <AvatarImage src="/images/image.png" alt="Provider" />
            <AvatarFallback>P</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <p className="font-medium text-gray-800">{providerName}</p>
            <p className="text-xs text-gray-500">{providerSpecialty}</p>
            <div className="mt-1 flex items-center gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Icon
                  icon={"bi:star-fill"}
                  key={i}
                  className={`h-3 w-3 ${
                    i < providerRating
                      ? "fill-amber-400 text-amber-400"
                      : "text-muted"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        <p className="text-sm text-gray-500">{description}</p>

        <div className="space-y-2 text-gray-800 border-t pt-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Heure de début :</span>
            <span className="font-medium">{startTime}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Adresse :</span>
            <span className="font-medium">{address}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Temps estimé :</span>
            <span className="font-medium">{estimatedTime}</span>
          </div>
        </div>

        <div className="flex items-center justify-between border-t pt-3">
          <Badge
            variant="outline"
            className="gap-1.5 border-emerald-200 bg-emerald-50 text-emerald-700"
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${currentStatus.color}`}
            />
            {currentStatus.label}
          </Badge>
          <div className="flex gap-2">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Icon icon={"bi:chat"} className="h-4 text-blue-900 w-4" />
            </Button>
            <Button
              variant="outline"
              className="border-blue-900 text-blue-900 bg-transparent rounded-[50px]"
              size="sm"
            >
              Détail
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
