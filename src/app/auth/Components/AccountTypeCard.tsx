import { cn } from "@/app/lib/utils";
import { Icon } from "@iconify/react";

interface AccountTypeCardProps {
  title: string;
  description: string;
  selected: boolean;
  onClick: () => void;
}

const AccountTypeCard = ({
  title,
  description,
  selected,
  onClick,
}: AccountTypeCardProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex-1 p-5 rounded-xl border-2 text-left transition-all duration-200",
        "hover:border-accent focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2",
        selected ? "border-accent bg-accent/5" : "border-border bg-card"
      )}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <h3 className="text-lg font-semibold text-accent">{title}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        <div
          className={cn(
            "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all",
            selected
              ? "border-accent bg-accent"
              : "border-muted-foreground/30 bg-transparent"
          )}
        >
          {selected && (
            <Icon icon="bi:check" className="w-4 h-4 text-accent-foreground" />
          )}
        </div>
      </div>
    </button>
  );
};

export default AccountTypeCard;
