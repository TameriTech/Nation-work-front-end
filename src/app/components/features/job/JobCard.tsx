import { Badge } from "@/app/components/ui/badge";
import { JobCardProps, JobStatus } from "@/app/types/services";
import { Icon } from "@iconify/react";

const skillColors = [
  "bg-orange-100 text-orange-700 border-orange-300",
  "bg-blue-100 text-blue-700 border-blue-300",
  "bg-green-100 text-green-700 border-green-300",
  "bg-red-100 text-red-700 border-red-300",
];

const statusColors = {
  completed: "bg-green-100 text-green-700 border-green-300",
  canceled: "bg-red-100 text-red-700 border-red-300",
  inProgress: "bg-yellow-100 text-yellow-700 border-yellow-300",
};

const statusData: Record<
  JobStatus,
  {
    label: string;
    icon: string;
    color: string;
  }
> = {
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
  inProgress: {
    label: "En cours",
    icon: "bi:arrow-repeat",
    color: "bg-yellow-100 text-yellow-700",
  },
};

export function JobCard({
  title,
  price,
  duration,
  type,
  description,
  status,
  skills,
  location,
  rating,
  postedDate,
  avatarUrl,
  isVerified = true,
  isFavorite = false,
  onFavoriteClick,
}: JobCardProps) {
  return (
    <div className="bg-gray-50 rounded-2xl border border-border p-5 space-y-4 hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full overflow-hidden border-4 border-white bg-muted flex-shrink-0">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/40" />
            )}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{title}</h3>
            <p className="text-xs text-gray-500">
              Prix [{price}] - Durée [{duration}] - Type [{type}]
            </p>
          </div>
        </div>
        {status ? (
          <Badge
            className={
              "text-xs font-medium flex items-center flex-nowrap text-nowrap " +
                status ===
              "completed"
                ? statusColors.completed
                : status === "canceled"
                ? statusColors.canceled
                : status === "inProgress"
                ? statusColors.inProgress
                : "bg-gray-100 text-gray-700 border border-gray-300"
            }
            variant="secondary"
          >
            <Icon icon={statusData[status].icon} className="w-4 h-4 mr-1" />
            <span className="text-nowrap">{statusData[status].label}</span>
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
        {description}
      </p>

      {/* Skills */}
      <div className="flex flex-wrap gap-2">
        {skills.map((skill, index) => (
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
          {rating ? (
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Icon
                  icon={
                    "bi:star-" + (i < Math.floor(rating) ? "fill" : "empty")
                  }
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.floor(rating)
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
            <span>{location}</span>
          </div>
          <span className="text-gray-500">Posté il y a {postedDate}</span>
        </div>
      </div>
    </div>
  );
}
