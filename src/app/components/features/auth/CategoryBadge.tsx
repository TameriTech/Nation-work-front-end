import { Icon } from "@iconify/react";

interface CategoryBadgeProps {
  label: string;
  onRemove: () => void;
}

const CategoryBadge = ({ label, onRemove }: CategoryBadgeProps) => {
  return (
    <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-900/10 text-blue-900 text-sm font-medium">
      {label}
      <button
        type="button"
        onClick={onRemove}
        className="hover:bg-blue-900/20 rounded-full p-0.5 transition-colors"
      >
        <Icon icon="bi:x" className="w-4 h-4" />
      </button>
    </span>
  );
};

export default CategoryBadge;
