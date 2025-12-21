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
        "hover:border-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-900",
        selected ? "border-blue-900 bg-blue-900/5" : "border-blue-500 bg-white"
      )}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <h3
            className={cn(
              "text-lg font-semibold",
              selected ? "text-blue-500" : "text-blue-500"
            )}
          >
            {title}
          </h3>
          <p className="text-sm text-gray-700">{description}</p>
        </div>
        <div
          className={cn(
            "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all",
            selected
              ? "border-blue-900 bg-blue-900"
              : "border-gray-900/30 bg-transparent"
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
