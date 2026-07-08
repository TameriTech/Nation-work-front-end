// app/components/features/services/ServiceCard.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { Icon } from "@iconify/react";
import { Badge } from "@/app/components/ui/badge";
import { Button } from "@/app/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/app/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/app/components/ui/tooltip";
import { formatDate, cn } from "@/app/lib/utils";
import type { Service, UserRole } from "@/app/types";

export type ServiceCardVariant = "guest" | "provider" | "client" | "admin";

interface ServiceCardProps {
  service: Service;
  variant?: ServiceCardVariant;
  isFavorite?: boolean;
  hasApplied?: boolean;
  onFavoriteClick?: () => void;
  onApply?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  isApplying?: boolean;
  showActions?: boolean;
}

const statusColors = {
  published: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  draft: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400",
  in_progress: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  completed: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  cancelled: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

export function MissionCard({
  service,
  variant = "guest",
  isFavorite = false,
  hasApplied = false,
  onFavoriteClick,
  onApply,
  onEdit,
  onDelete,
  isApplying = false,
  showActions = true,
}: ServiceCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const getActionButton = () => {
    switch (variant) {
      case "provider":
        if (hasApplied) {
          return (
            <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded-xl text-center">
              <span className="text-sm text-green-700 dark:text-green-400 flex items-center justify-center gap-2">
                <Icon icon="ph:check-circle" className="w-4 h-4" />
                Candidature envoyée
              </span>
            </div>
          );
        }
        return (
          <Button
            onClick={onApply}
            disabled={isApplying}
            className="w-full bg-primary hover:bg-primary/90 text-white rounded-xl"
          >
            {isApplying ? (
              <>
                <Icon icon="ph:spinner" className="w-4 h-4 mr-2 animate-spin" />
                Envoi...
              </>
            ) : (
              <>
                <Icon icon="ph:paper-plane" className="w-4 h-4 mr-2" />
                Postuler
              </>
            )}
          </Button>
        );
      
      case "client":
        return (
          <div className="flex gap-2">
            <Button
              onClick={onEdit}
              variant="outline"
              className="flex-1 rounded-xl border-primary/20 text-primary hover:bg-primary/10 hover:border-primary/40 dark:hover:bg-primary/20"
            >
              <Icon icon="ph:pencil" className="w-4 h-4 mr-2" />
              Modifier
            </Button>
            <Button
              onClick={onDelete}
              variant="destructive"
              className="rounded-xl"
            >
              <Icon icon="ph:trash" className="w-4 h-4" />
            </Button>
          </div>
        );
      
      case "admin":
        return (
          <div className="flex gap-2">
            <Button
              onClick={onEdit}
              variant="outline"
              size="sm"
              className="flex-1 rounded-xl border-primary/20 text-primary hover:bg-primary/10 hover:border-primary/40 dark:hover:bg-primary/20"
            >
              <Icon icon="ph:pencil" className="w-4 h-4 mr-1" />
              Modifier
            </Button>
            <Button
              onClick={onDelete}
              variant="destructive"
              size="sm"
              className="rounded-xl"
            >
              <Icon icon="ph:trash" className="w-4 h-4" />
            </Button>
          </div>
        );
      
      default:
        return null;
    }
  };

  const statusInfo = service.status && statusColors[service.status as keyof typeof statusColors];

  return (
    <div className={cn(
      "group rounded-2xl border transition-all duration-300 overflow-hidden",
      "bg-surface dark:bg-gray-900",
      "border-gray-100 dark:border-gray-700",
      "hover:shadow-lg dark:hover:shadow-gray-800/50"
    )}>
      {/* Header Section */}
      <div className="p-5 pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            {/* Avatar/Icon */}
            <Link href={`/dashboard/provider/missions/${service.code}`} className="flex-shrink-0">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                <Icon icon="ph:briefcase" className="w-6 h-6 text-white" />
              </div>
            </Link>
            
            <div className="flex-1 min-w-0">
              {/* Title */}
              <Link href={`/dashboard/provider/missions/${service.code}`}>
                <h3 className="font-semibold text-text-primary dark:text-gray-100 group-hover:text-primary transition-colors line-clamp-1">
                  {service.title}
                </h3>
              </Link>
              
              {/* Meta info */}
              <div className="flex flex-wrap items-center gap-2 mt-1">
                <span className="text-xs text-text-secondary dark:text-gray-400">
                  {service.category?.name || "Non catégorisé"}
                </span>
                <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-600"></span>
                <span className="text-xs text-text-secondary dark:text-gray-400">
                  {service.client?.username || "Client"}
                </span>
                {service.is_urgent && (
                  <Badge variant="destructive" className="text-xs">
                    <Icon icon="ph:warning" className="w-3 h-3 mr-1" />
                    Urgent
                  </Badge>
                )}
                {service.is_featured && (
                  <Badge variant="default" className="text-xs bg-secondary/10 text-secondary border-secondary/20 dark:bg-secondary/20">
                    <Icon icon="ph:star" className="w-3 h-3 mr-1" />
                    À la une
                  </Badge>
                )}
                {statusInfo && variant !== "guest" && (
                  <Badge className={`${statusInfo} text-xs`}>
                    {service.status}
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* Favorite button (only for provider) */}
          {variant === "provider" && showActions && onFavoriteClick && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={onFavoriteClick}
                    className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center transition-colors flex-shrink-0",
                      "bg-gray-100 dark:bg-gray-700",
                      "hover:bg-gray-200 dark:hover:bg-gray-600"
                    )}
                  >
                    <Icon
                      icon={isFavorite ? "ph:heart-fill" : "ph:heart"}
                      className={`w-4 h-4 ${isFavorite ? "text-error dark:text-red-400" : "text-gray-400 dark:text-gray-500"}`}
                    />
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{isFavorite ? "Retirer des favoris" : "Ajouter aux favoris"}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      </div>

      {/* Description Section */}
      <div className="px-5 pb-3">
        <p className={`text-sm text-text-secondary dark:text-gray-400 leading-relaxed ${!isExpanded ? "line-clamp-2" : ""}`}>
          {service.short_description  + 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.' }
        </p>
        {service.short_description && service.short_description.length > 150 && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-xs text-primary hover:underline mt-1 dark:text-primary-400"
          >
            {isExpanded ? "Voir moins" : "Voir plus"}
          </button>
        )}
      </div>

      {/* Skills Section */}
      {service.required_skills && service.required_skills.length > 0 && (
        <div className="px-5 pb-3">
          <div className="flex flex-wrap gap-2">
            {service.required_skills.slice(0, 4).map((skill: string, idx: number) => (
              <Badge
                key={idx}
                variant="secondary"
                className={cn(
                  "text-text-secondary hover:bg-gray-200 text-xs",
                  "bg-gray-100 dark:bg-gray-700",
                  "dark:text-gray-300 dark:hover:bg-gray-600"
                )}
              >
                {skill}
              </Badge>
            ))}
            {service.required_skills.length > 4 && (
              <Badge variant="secondary" className="bg-gray-100 dark:bg-gray-700 text-text-secondary dark:text-gray-300">
                +{service.required_skills.length - 4}
              </Badge>
            )}
          </div>
        </div>
      )}

      {/* Divider */}
      <div className="border-t border-gray-100 dark:border-gray-700"></div>

      {/* Footer Section */}
      <div className="p-5 pt-4">
        <div className="flex items-center justify-between mb-4">
          {/* Price */}
          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-bold text-primary dark:text-primary-400">
                {service.proposed_amount?.toLocaleString()}€
              </span>
              <span className="text-xs text-text-secondary dark:text-gray-400">HT</span>
            </div>
            <p className="text-xs text-text-secondary dark:text-gray-400">Budget estimé</p>
          </div>

          {/* Location & Date */}
          <div className="flex flex-col items-end gap-1">
            <div className="flex items-center gap-1 text-xs text-text-secondary dark:text-gray-400">
              <Icon icon={service.location?.location_type === "remote" ? "ph:monitor" : "ph:map-pin"} className="w-3 h-3" />
              <span>
                {service.location?.location_type === "remote"
                  ? "Télétravail"
                  : service.location?.city || service.location?.country || "Sur site"}
              </span>
            </div>
            <div className="flex items-center gap-1 text-xs text-text-secondary dark:text-gray-400">
              <Icon icon="ph:calendar" className="w-3 h-3" />
              <span>Publié il y a {formatDate(service.created_at)}</span>
            </div>
          </div>
        </div>

        {/* Client Info (for guest/provider) */}
        {(variant === "guest" || variant === "provider") && service.client && (
          <div className="flex items-center gap-2 mb-4 p-2 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
            <Avatar className="w-6 h-6">
              <AvatarImage src={service.client.profile_picture} />
              <AvatarFallback className="text-xs dark:bg-gray-600 dark:text-gray-200">
                {service.client.username?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <p className="text-xs font-medium text-text-primary dark:text-gray-200">
                {service.client.username}
              </p>
              {service.client?.stats?.average_rating > 0 && (
                <div className="flex items-center gap-1">
                  <div className="flex items-center gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Icon
                        key={i}
                        icon={i < Math.floor(service.client.stats.average_rating) ? "ph:star-fill" : "ph:star"}
                        className="w-3 h-3 text-secondary dark:text-secondary-400"
                      />
                    ))}
                  </div>
                  <span className="text-xs text-text-secondary dark:text-gray-400">
                    ({service.client.stats.total_reviews || 0})
                  </span>
                </div>
              )}
            </div>
            {service.client.is_verified && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Icon icon="ph:check-circle" className="w-4 h-4 text-success dark:text-green-400" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Compte vérifié</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
        )}

        {/* Action Buttons */}
        {showActions && getActionButton()}
      </div>
    </div>
  );
}