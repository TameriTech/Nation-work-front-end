import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/app/components/ui/tabs";
import { GeneraleTabContent } from "./GeneraleTabContent";
import { ExperienceTabContent } from "./ExperienceTabContent";
import CompetencesTabContent from "./CompetencesTabContent";
import DocumentsTabContent from "./DocumentsTabContent";
import EvaluationsTabContent from "./EvaluationsTabContent";

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
      <TabsList className="w-full py-4 px-2 justify-between flex-wrap bg-white rounded-[30px] h-auto gap-0">
        {tabs.map((tab) => (
          <TabsTrigger
            key={tab.value}
            value={tab.value}
            className="relative px-4 py-2 text-sm font-medium text-gray-600 border-b-2 border-transparent rounded-none flex-shrink-0 data-[state=active]:border-[#F3742C] data-[state=active]:text-[#F3742C]  data-[state=active]:bg-transparent  hover:text-[#F3742C] transition-colors md:px-6 "
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
        <DocumentsTabContent />
      </TabsContent>

      <TabsContent value="evaluation" className="mt-6">
        <EvaluationsTabContent />
      </TabsContent>
    </Tabs>
  );
}
