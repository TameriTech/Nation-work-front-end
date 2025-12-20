import { Button } from "@/app/components/ui/button";
import { Icon } from "@iconify/react";
import { JobCard } from "../job/JobCard";
import { Badge } from "@/app/components/ui/badge";

interface JobFiltersProps {
  onApplyFilters?: () => void;
}

const job = {
  id: 5,
  title: "Titre du Job",
  price: "1000 Frs",
  duration: "30j",
  type: "à Distance",
  description:
    "Courte description du job Courte description du job Courte description du job Courte description du job Courte.",
  skills: ["compétence 1", "compétence 2", "compétence 3", "compétence N"],
  location: "Lagos",
  rating: 5,
  postedDate: "6 j",
};

export function AgendaSidebar({ onApplyFilters }: JobFiltersProps) {
  return (
    <div className="w-full lg:w-[312px] p-4 space-y-6 bg-white rounded-3xl flex-shrink-0">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-blue-900">
          +1500 Offres en cours
        </h2>
        <p className="text-gray-500 text-sm mt-1">
          {
            "Trouvez l’offre d’Emploi Unique qui vous convient le mieux grâce à notre  superbe méthode de filtre avancé et propulsé par l’Intelligence Artificiel. "
          }
        </p>
      </div>

      {/* Geographic Radius */}
      <div className="space-y-3">
        <h3 className="font-semibold text-blue-900">Prochaine prestation</h3>
        <JobCard {...job} showRate={false} />
        <div className="flex text-xs justify-between items-center text-gray-500">
          <span>Accepte il y a 6 jours</span>
          <Badge className="bg-blue-900/10 text-blue-900">
            <Icon icon={"bi:clock"} />A venir
          </Badge>
        </div>
      </div>
      <div className="space-y-3">
        <h3 className="font-semibold text-blue-900">
          Cette offre pourrait vpus interesser
        </h3>
        <JobCard {...job} showRate={false} />
        <div className="flex text-xs justify-between items-center text-gray-500">
          <span>Accepte il y a 6 jours</span>
          <Button className="bg-blue-900 text-white text-sm rounded-full">
            Postuler
          </Button>
        </div>
      </div>
    </div>
  );
}
