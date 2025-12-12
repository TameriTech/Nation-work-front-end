import { Badge } from "@/app/components/ui/badge";
import { Icon } from "@iconify/react";

interface JobCardProps {
  title: string;
  price: string;
  duration: string;
  type: string;
  description: string;
  skills: string[];
  location: string;
  rating: number;
  postedDate: string;
  avatarUrl?: string;
  isVerified?: boolean;
  isFavorite?: boolean;
  onFavoriteClick?: () => void;
}

const skillColors = [
  "bg-orange-100 text-orange-700 border-orange-300",
  "bg-blue-100 text-blue-700 border-blue-300",
  "bg-green-100 text-green-700 border-green-300",
  "bg-red-100 text-red-700 border-red-300",
];

export function JobCard({
  title,
  price,
  duration,
  type,
  description,
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
            <p className="text-sm text-gray-500">
              Prix [{price}] - Durée [{duration}] - Type [{type}]
            </p>
          </div>
        </div>
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
          <div className="flex items-center gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Icon
                icon={"bi:star-" + (i < Math.floor(rating) ? "fill" : "empty")}
                key={i}
                className={`w-4 h-4 ${
                  i < Math.floor(rating)
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-muted-foreground/30"
                }`}
              />
            ))}
          </div>
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
