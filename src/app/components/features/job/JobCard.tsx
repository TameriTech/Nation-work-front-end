import { Badge } from "@/app/components/ui/badge";
import { formatDate } from "@/app/lib/utils";
import { Service } from "@/app/types/services";
import { Icon } from "@iconify/react";
import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar";

const skillColors = [
  "bg-orange-100 text-orange-700 border-orange-300",
  "bg-blue-100 text-blue-700 border-blue-300",
  "bg-green-100 text-green-700 border-green-300",
  "bg-red-100 text-red-700 border-red-300",
];

const statusConfig = {
  published: {
    label: "Publié",
    icon: "bi:check-circle",
    color: "bg-green-100 text-green-700",
  },
  in_progress: {
    label: "En cours",
    icon: "bi:arrow-repeat",
    color: "bg-yellow-100 text-yellow-700",
  },
  completed: {
    label: "Terminé",
    icon: "bi:check",
    color: "bg-green-100 text-green-700",
  },
  canceled: {
    label: "Annulé",
    icon: "bi:x",
    color: "bg-red-100 text-red-700",
  },
  draft: {
    label: "Brouillon",
    icon: "bi:pencil",
    color: "bg-gray-100 text-gray-700",
  },
} as const;

type StatusKey = keyof typeof statusConfig;

type JobCardProps = {
  service: Service;
  isVerified?: boolean;
  isFavorite?: boolean;
  show_status?: boolean;
  showRate?: boolean;
  onFavoriteClick?: () => void;
};

// Fonction utilitaire pour obtenir les infos de statut de façon sécurisée
const getStatusInfo = (status: string) => {
  // Vérifier si le statut existe dans la configuration
  if (status in statusConfig) {
    return statusConfig[status as StatusKey];
  }
  // Fallback par défaut
  return {
    label: status,
    icon: "bi:question-circle",
    color: "bg-gray-100 text-gray-700",
  };
};

export function JobCard({
  service,
  isVerified = true,
  isFavorite = false,
  show_status = false,
  onFavoriteClick,
}: JobCardProps) {
  const statusInfo = getStatusInfo(service.status);

  return (
    <div className="bg-gray-50 rounded-2xl border border-border p-5 space-y-4 hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full overflow-hidden border-4 border-white bg-muted flex-shrink-0">
            <Avatar className="h-10 w-10">
              <AvatarImage src={service.client.profile_picture} />
              <AvatarFallback>
                {service.client.username?.charAt(0).toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{service.title}</h3>
            <p className="text-xs text-gray-500">
              Prix [{service.proposed_amount}] - Durée [{service.duration}] -
              Type [{service.category?.name || "N/A"}]
            </p>
          </div>
        </div>
        {service.status && show_status ? (
          <Badge
            className={`text-xs font-medium flex items-center flex-nowrap text-nowrap ${statusInfo.color} border`}
            variant="secondary"
          >
            <Icon icon={statusInfo.icon} className="w-4 h-4 mr-1" />
            <span className="text-nowrap">{statusInfo.label}</span>
          </Badge>
        ) : (
          <button
            onClick={onFavoriteClick}
            className="p-1 hover:bg-muted rounded-full transition-colors"
          >
            <Icon
              icon={"bi:heart-fill"}
              className={`w-5 h-5 ${
                isFavorite ? "fill-red-500 text-red-500" : "text-gray-400"
              }`}
            />
          </button>
        )}
      </div>

      {/* Description */}
      <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">
        {service.short_description}
      </p>

      {/* Skills */}
      <div className="flex flex-wrap gap-2">
        {service?.required_skills?.map((skill: string, index: any) => (
          <Badge
            key={skill}
            variant="outline"
            className={`${
              skillColors[index % skillColors.length]
            } border text-xs font-medium`}
          >
            {skill}
          </Badge>
        ))}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between text-sm pt-2 border-t border-border">
        <div className="flex items-center gap-4">
          {isVerified && (
            <div className="flex items-center gap-1 text-blue-900">
              <Icon icon={"bi:check-circle"} className="w-4 h-4" />
              <span className="text-xs text-gray-700">Paiement vérifié</span>
            </div>
          )}
          {service.client.rating ? (
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Icon
                  icon={
                    i < Math.floor(service?.client.rating || 0)
                      ? "bi:star-fill"
                      : "bi:star"
                  }
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.floor(service?.client.rating || 0)
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-slate-400/30"
                  }`}
                />
              ))}
            </div>
          ) : (
            <div className=""></div>
          )}
        </div>
        <div className="flex items-center gap-3 text-gray-700 text-xs">
          <div className="flex items-center gap-1">
            <Icon icon={"bi:map-pin"} className="w-3.5 h-3.5" />
            <span>{service.country}</span>
          </div>
          <span className="text-gray-500">
            Posté il y a {formatDate(service.created_at)}
          </span>
        </div>
      </div>
    </div>
  );
}
