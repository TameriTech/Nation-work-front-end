import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/app/components/ui/tabs";
import { GeneraleTabContent } from "./GeneraleTabContent";
import { ExperienceTabContent } from "./ExperienceTabContent";
import CompetencesTabContent from "./CompetencesTabContent";

const tabs = [
  { value: "generale", label: "Générale" },
  { value: "experience", label: "Expérience" },
  { value: "competences", label: "Compétences" },
  { value: "documents", label: "Documents & Vérification" },
  { value: "evaluation", label: "Evaluation" },
];

export function ProfileTabs() {
  return (
    <Tabs defaultValue="generale" className="w-full">
      <TabsList className="w-full py-4 px-2 justify-between bg-white rounded-[30px] h-auto gap-0">
        {tabs.map((tab) => (
          <TabsTrigger
            key={tab.value}
            value={tab.value}
            className="relative px-6  text-sm font-medium text-gray-600 rounded-none border-b-2 border-transparent data-[state=active]:border-[#F3742C] data-[state=active]:text-[#F3742C] data-[state=active]:bg-transparent data-[state=active]:shadow-none hover:text-[#F3742C] hover:border-[#F3742C] transition-colors"
          >
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>

      <TabsContent value="generale" className="mt-6">
        <GeneraleTabContent />
      </TabsContent>

      <TabsContent value="experience" className="mt-6">
        <ExperienceTabContent />
      </TabsContent>

      <TabsContent value="competences" className="mt-6">
        <CompetencesTabContent />
      </TabsContent>

      <TabsContent value="documents" className="mt-6">
        <div className="rounded-3xl bg-card shadow-lg p-8">
          <p className="text-muted-foreground">
            {"Contenu de l'onglet Documents & Vérification à venir..."}
          </p>
        </div>
      </TabsContent>

      <TabsContent value="evaluation" className="mt-6">
        <div className="rounded-3xl bg-card shadow-lg p-8">
          <p className="text-muted-foreground">
            {"Contenu de l'onglet Évaluation à venir..."}
          </p>
        </div>
      </TabsContent>
    </Tabs>
  );
}
