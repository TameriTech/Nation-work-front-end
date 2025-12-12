"use client";
import { useState } from "react";
import { useRegistration } from "@/contexts/RegistrationContext";
import { Button } from "@/app/components/ui/button";
import CategoryBadge from "../CategoryBadge";
import CategoryModal from "../CategoryModal";
import { Icon } from "@iconify/react";

const Step2Categories = () => {
  const { data, setCategories, removeCategory, nextStep, prevStep } =
    useRegistration();
  const [modalOpen, setModalOpen] = useState(false);

  const canProceed = data.categories.length > 0;

  const handleNext = () => {
    if (canProceed) {
      nextStep();
    }
  };

  return (
    <div className="space-y-8">
      {/* Title */}
      <h2 className="text-xl font-medium text-foreground">
        Pour quoi êtes vous doués ?
      </h2>

      {/* Search Input - Opens Modal */}
      <button
        type="button"
        onClick={() => setModalOpen(true)}
        className="w-full text-left"
      >
        <div className="relative border border-border rounded-2xl p-4 hover:border-accent transition-colors cursor-pointer">
          <label className="text-xs text-muted-foreground block mb-1">
            Catégorie disponible
          </label>
          <div className="flex items-center justify-between">
            <span className="text-foreground font-medium">
              Ajouter une Catégorie
            </span>
            <Icon
              icon={"bi:search"}
              className="w-5 h-5 text-muted-foreground"
            />
          </div>
        </div>
      </button>

      {/* Selected Categories */}
      {data.categories.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-foreground">
            Catégories sélectionnées
          </h3>
          <div className="flex flex-wrap gap-2">
            {data.categories.map((category) => (
              <CategoryBadge
                key={category}
                label={category}
                onRemove={() => removeCategory(category)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Category Modal */}
      <CategoryModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        selectedCategories={data.categories}
        onConfirm={setCategories}
      />

      {/* Navigation */}
      <div className="flex justify-between pt-8">
        <Button
          variant="secondary"
          onClick={prevStep}
          className="px-10 py-3 rounded-full bg-muted text-muted-foreground font-medium"
        >
          Précédent
        </Button>
        <Button
          onClick={handleNext}
          disabled={!canProceed}
          className="px-10 py-3 rounded-full bg-accent hover:bg-accent/90 text-accent-foreground font-medium disabled:opacity-50"
        >
          Suivant
        </Button>
      </div>
    </div>
  );
};

export default Step2Categories;
