import { Button } from "@/app/components/ui/button";
import { Icon } from "@iconify/react";
import { JobCard } from "../job/JobCard";
import { Badge } from "@/app/components/ui/badge";
import { User } from "@/app/types/user";
import { Client, ServiceStatus, ServiceType } from "@/app/types/services";

interface JobFiltersProps {
  onApplyFilters?: () => void;
}

const job = {
  id: 1,
  title: "UI/UX Design for Web App",
  short_description: "Professional UI/UX design for your web application",
  full_description:
    "Complete UI/UX design including wireframes, interactive prototypes, and high-fidelity mockups tailored to your web app's needs.",
  service_type: "premium" as ServiceType,
  category_id: 3,
  date_pratique: "2026-02-10",
  start_time: "09:00",
  duration: "5h",
  address: "12 Rue de la République",
  city: "Paris",
  quarter: "1er arrondissement",
  postal_code: "75001",
  country: "France",
  latitude: 48.8566,
  longitude: 2.3522,
  required_skills: ["Figma", "Adobe XD", "User Research"],
  proposed_amount: 500,
  accepted_amount: 450,
  status: "published" as ServiceStatus,
  client_id: 101,
  assigned_freelancer_id: 201,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  client: {
    id: 10,
    name: "Ludivin",
    email: "ludivin@example.com",
    role: "client",
    avatar: "/avatars/ludivin.png",
    rating: 4.5,
    total_services: 20,
    acceptance_rate: 5,
  } as Client,
  images: [
    "https://images.unsplash.com/photo-1593642532973-d31b6557fa68?w=400&h=300&fit=crop",
    "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=300&fit=crop",
  ],
  candidatures: [],
  provider: {
    name: "John Freelance",
    email: "john.freelance@example.com",
    role: "freelancer",
    avatar: "https://randomuser.me/api/portraits/men/45.jpg",
  } as User,
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
        <JobCard service={job} showRate={false} />
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
        <JobCard service={job} showRate={false} />
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
