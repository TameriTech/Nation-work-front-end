import { Card, CardContent } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { cn } from "@/app/lib/utils";
import { Icon } from "@iconify/react";

interface StatCardProps {
  icon: string;
  label: string;
  value: string | number;
  change?: string;
  actionLabel?: string;
  onAction?: () => void;
  variant?: "default" | "primary";
  description?: string;
}

export const StatCard = ({
  icon: AnIcon,
  label,
  value,
  change,
  actionLabel,
  onAction,
  variant = "default",
  description,
}: StatCardProps) => {
  const isPrimary = variant === "primary";

  return (
    <Card
      className={cn(
        "relative overflow-hidden p-3 bg-white text-gray-900 rounded-[30px]",
        isPrimary && "bg-blue-900 text-primary-foreground"
      )}
    >
      <CardContent className="p-[10px]">
        <div className="flex items-start justify-between">
          <div
            className={cn(
              "flex h-10 w-10 items-center justify-center rounded-full",
              isPrimary ? "bg-primary-foreground/20" : "bg-primary/10"
            )}
          >
            <Icon
              icon={AnIcon}
              className={cn(
                "h-5 w-5",
                isPrimary ? "text-white" : "text-blue-900"
              )}
            />
          </div>
          {actionLabel && (
            <Button
              variant={isPrimary ? "secondary" : "outline"}
              size="sm"
              onClick={onAction}
              className={cn(
                isPrimary
                  ? "text-xs border-1 bg-transparent border-white rounded-[50px]"
                  : "text-xs bg-transparent border-1 border-blue-900 rounded-[50px]"
              )}
            >
              {actionLabel}
            </Button>
          )}
        </div>
        <div className="mt-">
          <p
            className={cn(
              "text-sm",
              isPrimary ? "text-primary-foreground/80" : "text-muted-foreground"
            )}
          >
            {label}
          </p>
          <div className="mt-1 flex items-center gap-2">
            <span className="text-3xl font-bold">{value}</span>
            {change && (
              <span
                className={cn(
                  "text-xs",
                  isPrimary
                    ? "text-primary-foreground/70"
                    : "text-muted-foreground"
                )}
              >
                {change}
              </span>
            )}
          </div>
          {description && (
            <p
              className={cn(
                "mt-1 text-sm",
                isPrimary
                  ? "text-primary-foreground/70"
                  : "text-muted-foreground"
              )}
            >
              {description}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
