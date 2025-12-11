import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/app/components/ui/avatar";
import { Badge } from "@/app/components/ui/badge";
import { Progress } from "@/app/components/ui/progress";
import { Button } from "@/app/components/ui/button";
import { Icon } from "@iconify/react";

interface UserProfile {
  name: string;
  avatar?: string;
  rating: number;
  tags: string[];
  isVerified: boolean;
  profileCompletion: number;
  summary: string;
  email: string;
  phone: string;
  nationality: string;
  gender: string;
  age: number;
}

interface CustomerProfileSidebarProps {
  profile?: UserProfile;
}

const defaultProfile: UserProfile = {
  name: "Cali Biba",
  rating: 4,
  tags: ["Etudiante / Garde enfant"],
  isVerified: true,
  profileCompletion: 30,
  summary:
    "Étudiante en 4e année, je propose mes services de garde d'enfants, ménage et aide aux devoirs. Sérieuse, ponctuelle et disponible en...",
  email: "nom@tamari.com",
  phone: "+237 655 31 60 13",
  nationality: "Camerounais",
  gender: "Femme",
  age: 25,
};

interface InfoRowProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  editable?: boolean;
}

function InfoRow({ icon, label, value, editable = true }: InfoRowProps) {
  return (
    <div className="flex items-center justify-between py-2">
      <div className="flex items-center gap-3">
        <div className="h-9 w-9 rounded-full bg-gray-100 flex items-center justify-center">
          {icon}
        </div>
        <div>
          <p className="text-xs text-gray-500">{label}</p>
          <p className="text-sm font-medium text-gray-800">{value}</p>
        </div>
      </div>
      {editable && (
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-primary hover:text-primary/80"
        >
          <Icon icon={"bx:bx-edit-alt"} className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}

export function CustomerProfileSidebar({
  profile = defaultProfile,
}: CustomerProfileSidebarProps) {
  return (
    <aside className="w-full max-w-sm">
      <div className="rounded-3xl flex flex-col gap-4 bg-transparent overflow-hidden">
        {/* Welcome banner */}
        <div className="relative rounded-[30px] h-32 bg-gradient-to-r from-blue-900 to-blue-900/80 p-6">
          <div className="absolute rounded-[30px]  inset-0 bg-[url('https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=200&fit=crop')] bg-cover bg-center opacity-30" />
          <div className="relative z-10">
            <h2 className="text-xl font-bold text-white">Bienvenue</h2>
            <p className="text-blue-50">dans votre espace Freelancer,</p>
          </div>

          {/* Avatar overlapping banner */}
          <div className="absolute -bottom-20 left-6 z-10">
            <div className="relative">
              <Avatar className="h-28 w-28 border-4 border-white shadow-lg">
                <AvatarImage src={profile.avatar} alt={profile.name} />
                <AvatarFallback className="bg-primary/20 text-primary text-2xl font-bold">
                  {profile.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>

        {/* Profile content */}
        <div className="pt-10 flex flex-col relative z-0 px-6 pb-6 bg-white rounded-[30px]">
          <Button
            size="icon"
            className="ml-auto text-white h-8 w-8 rounded-full bg-blue-800 hover:bg-blue-800/90 shadow-md"
          >
            <Icon icon={"bx:bx-edit-alt"} className="h-4 w-4" />
          </Button>
          {/* Name and rating */}
          <div className="flex items-center gap-2 mb-2 pt-5">
            <h3 className="text-lg font-bold text-gray-800">{profile.name}</h3>
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Icon
                  icon={"bi:star"}
                  key={i}
                  className={`h-4 w-4 ${
                    i < profile.rating
                      ? "fill-accent text-accent"
                      : "text-muted"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {profile.tags.map((tag, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="rounded-full bg-blue-900/10 text-blue-900 hover:bg-blue-900/20"
              >
                {tag}
              </Badge>
            ))}
            {profile.isVerified && (
              <Badge
                variant="secondary"
                className="rounded-full bg-green-100 text-green-700 hover:bg-green-200 gap-1"
              >
                <Icon icon={"bi:check-circle"} className="h-3 w-3" />
                Identité vérifiée
              </Badge>
            )}
          </div>

          {/* Profile completion */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-800 font-semibold">
                État de validation du Profil -
              </span>
              <span className="text-sm font-bold text-accent text-red-500">
                {profile.profileCompletion}%
              </span>
            </div>
            <Progress value={profile.profileCompletion} className="h-2" />
          </div>

          {/* Summary */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-semibold text-gray-800">Résumé</h4>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-primary hover:text-primary/80"
              >
                <Icon icon={"bx:bx-edit-alt"} className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-sm text-gray-700 leading-relaxed">
              {profile.summary}
            </p>
          </div>

          {/* Basic information */}
          <div>
            <h4 className="text-sm font-semibold text-gray-800 mb-3">
              Information de base
            </h4>
            <div className="space-y-1 text-gray-800">
              <InfoRow
                icon={
                  <Icon
                    icon={"bi:envelope"}
                    className="h-4 w-4 text-gray-800"
                  />
                }
                label="Email"
                value={profile.email}
              />
              <InfoRow
                icon={
                  <Icon
                    icon={"bi:telephone"}
                    className="h-4 w-4 text-muted-foreground"
                  />
                }
                label="Téléphone"
                value={profile.phone}
              />
              <InfoRow
                icon={
                  <Icon
                    icon={"bi:flag"}
                    className="h-4 w-4 text-muted-foreground"
                  />
                }
                label="Nationalité"
                value={profile.nationality}
              />
              <InfoRow
                icon={
                  <Icon
                    icon={"bi:gender"}
                    className="h-4 w-4 text-muted-foreground"
                  />
                }
                label="Sexe"
                value={profile.gender}
              />
              <InfoRow
                icon={
                  <Icon
                    icon={"bi:calendar"}
                    className="h-4 w-4 text-muted-foreground"
                  />
                }
                label="Age"
                value={`${profile.age} ans`}
              />
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
