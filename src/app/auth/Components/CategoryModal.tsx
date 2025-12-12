"use client";
import { useState, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/app/components/ui/dialog";
import { Input } from "@/app/components/ui/input";
import { Button } from "@/app/components/ui/button";
import { cn } from "@/app/lib/utils";
import { Icon } from "@iconify/react";

const ALL_CATEGORIES = [
  "Réparation",
  "Babysitting",
  "Déménagement",
  "Assistance",
  "Ménage",
  "Jardinage",
  "Plomberie",
  "Électricité",
  "Peinture",
  "Informatique",
  "Cours particuliers",
  "Cuisine",
  "Livraison",
  "Design",
  "Développement web",
  "Photographie",
];

interface CategoryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedCategories: string[];
  onConfirm: (categories: string[]) => void;
}

const CategoryModal = ({
  open,
  onOpenChange,
  selectedCategories,
  onConfirm,
}: CategoryModalProps) => {
  const [search, setSearch] = useState("");
  const [tempSelected, setTempSelected] =
    useState<string[]>(selectedCategories);

  const filteredCategories = useMemo(() => {
    if (!search.trim()) return ALL_CATEGORIES;
    return ALL_CATEGORIES.filter((cat) =>
      cat.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  const toggleCategory = (category: string) => {
    if (tempSelected.includes(category)) {
      setTempSelected(tempSelected.filter((c) => c !== category));
    } else if (tempSelected.length < 5) {
      setTempSelected([...tempSelected, category]);
    }
  };

  const handleConfirm = () => {
    onConfirm(tempSelected);
    onOpenChange(false);
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (newOpen) {
      setTempSelected(selectedCategories);
    }
    onOpenChange(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-lg p-8 rounded-3xl">
        <DialogHeader className="space-y-4">
          <div className="text-center">
            <span className="text-primary font-bold text-xl">Nation</span>
            <span className="text-accent font-bold text-xl ml-1">Work</span>
          </div>
          <DialogTitle className="text-xl font-bold text-foreground">
            Trouvez vos Catégorie - Max 5
          </DialogTitle>
        </DialogHeader>

        <div className="mt-4 space-y-6">
          {/* Search Input */}
          <div className="relative">
            <div className="space-y-1">
              <label className="text-xs text-muted-foreground px-4">
                Catégorie disponible
              </label>
              <div className="relative">
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder=""
                  className="h-12 rounded-2xl border-border pl-4 pr-12"
                />
                <Icon
                  icon={"bi:search"}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground"
                />
              </div>
            </div>
          </div>

          {/* Categories Grid */}
          <div className="grid grid-cols-2 gap-3 max-h-64 overflow-y-auto">
            {filteredCategories.map((category) => {
              const isSelected = tempSelected.includes(category);
              const isDisabled = !isSelected && tempSelected.length >= 5;

              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => !isDisabled && toggleCategory(category)}
                  disabled={isDisabled}
                  className={cn(
                    "flex items-center justify-between px-4 py-3 rounded-full border-2 text-left transition-all",
                    "text-sm font-medium",
                    isSelected
                      ? "border-accent text-accent bg-accent/5"
                      : "border-border text-accent hover:border-accent/50",
                    isDisabled && "opacity-50 cursor-not-allowed"
                  )}
                >
                  <span>{category}</span>
                  <div
                    className={cn(
                      "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all",
                      isSelected
                        ? "border-accent bg-accent"
                        : "border-muted-foreground/30"
                    )}
                  >
                    {isSelected && (
                      <Icon
                        icon={"bi:check"}
                        className="w-3 h-3 text-accent-foreground"
                      />
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Confirm Button */}
          <div className="flex justify-end">
            <Button
              onClick={handleConfirm}
              className="px-8 py-3 rounded-full bg-accent hover:bg-accent/90 text-accent-foreground font-medium"
            >
              Ajouter
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CategoryModal;
