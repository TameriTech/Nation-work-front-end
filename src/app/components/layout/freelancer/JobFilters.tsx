import { Slider } from "@/app/components/ui/slider";
import { Checkbox } from "@/app/components/ui/checkbox";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Icon } from "@iconify/react";

interface JobFiltersProps {
  onApplyFilters?: () => void;
}

export function JobFilters({ onApplyFilters }: JobFiltersProps) {
  return (
    <div className="w-[312px] p-6 space-y-6 flex-shrink-0">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-blue-900">
          +1500 Offres en cours
        </h2>
        <p className="text-gray-500 text-sm mt-1">
          {"Trouvez l'offre d'Emploi qui vous convient le Mieux grâce à notre"}
          {" méthode de Filtre avancé et propulsé par l'IA."}
        </p>
      </div>

      {/* Geographic Radius */}
      <div className="space-y-3">
        <h3 className="font-semibold text-gray-800">Rayon Géographique</h3>
        <div className="flex items-center justify-between text-sm text-blue-900 font-medium">
          <span>5km</span>
          <span>10km</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <span>2k</span>
          <Slider
            defaultValue={[5, 10]}
            min={2}
            max={20}
            step={1}
            className="flex-1"
          />
          <span>20km</span>
        </div>
      </div>

      {/* Estimated Duration */}
      <div className="space-y-3">
        <h3 className="font-semibold text-gray-800">Durée estimé</h3>
        <div className="flex items-center justify-between text-sm text-blue-900 font-medium">
          <span>2h</span>
          <span>3h</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <span>-1h</span>
          <Slider
            defaultValue={[2, 3]}
            min={-1}
            max={5}
            step={0.5}
            className="flex-1"
          />
          <span>+5h</span>
        </div>
      </div>

      {/* Remuneration Rate */}
      <div className="space-y-3">
        <h3 className="font-semibold text-foreground">Taux de rémunération</h3>
        <div className="flex items-center justify-between text-sm text-blue-900 font-medium">
          <span>15k</span>
          <span>30k</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <span>1000</span>
          <Slider
            defaultValue={[15, 30]}
            min={1}
            max={50}
            step={1}
            className="flex-1"
          />
          <span>50k</span>
        </div>
      </div>

      {/* Client Rating */}
      <div className="space-y-3">
        <h3 className="font-semibold text-foreground">Évaluation du Client</h3>
        <div className="flex items-center justify-between text-sm text-blue-900 font-medium">
          <span>2.5</span>
          <span>3.5</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <span>1.0</span>
          <Slider
            defaultValue={[2.5, 3.5]}
            min={1}
            max={5}
            step={0.1}
            className="flex-1"
          />
          <span>5.0</span>
        </div>
      </div>

      {/* Service Type */}
      <div className="space-y-3">
        <h3 className="font-semibold text-gray-800">Type de Service</h3>
        <div className="grid grid-cols-2 gap-3">
          <label className="flex items-center gap-2 cursor-pointer">
            <Checkbox
              defaultChecked
              className="data-[state=checked]:bg-blue-900 data-[state=checked]:border-blue-900"
            />
            <span className="text-sm text-gray-800">Standard</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <Checkbox className="data-[state=checked]:bg-blue-900 data-[state=checked]:border-blue-900" />
            <span className="text-sm text-gray-800">Candidature</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <Checkbox className="data-[state=checked]:bg-blue-900 data-[state=checked]:border-blue-900" />
            <span className="text-sm text-gray-500">Premium</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <Checkbox
              defaultChecked
              className="data-[state=checked]:bg-blue-900 data-[state=checked]:border-blue-900"
            />
            <span className="text-sm text-gray-500">Directe</span>
          </label>
        </div>
      </div>

      {/* Availability */}
      <div className="space-y-3">
        <h3 className="font-semibold text-gray-500">Disponibilités horaires</h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-xs text-gray-500">À partir de</label>
            <div className="relative">
              <Input
                type="time"
                defaultValue="10:30"
                className="border-border text-gray-900 bg-white pr-0"
              />
              <Icon
                icon={"bi:clock"}
                className="absolute hidden right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-800"
              />
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-xs text-gray-500">{"Jusqu'à"}</label>
            <div className="relative">
              <Input
                type="time"
                defaultValue="15:30"
                className="border-border bg-white text-gray-800"
              />
              <Icon
                icon={"bi:clock"}
                className="absolute hidden right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Apply Button */}
      <Button
        onClick={onApplyFilters}
        className="w-full bg-blue-900 hover:bg-blue-800/90 text-white rounded-full"
      >
        <Icon icon={"bi:filter"} className="w-4 h-4 mr-2" />
        Appliquer le Filtre
      </Button>
    </div>
  );
}
