"use client";
import { useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/app/components/ui/tabs";
import { TabsContent } from "@radix-ui/react-tabs";
import { ServiceCalendar } from "../../shared/calendar/Agenda";
import { sampleEvents } from "@/data/constants";
import { JobHistoryContent } from "./JobHistoriqueList";
import { PaymentsTable } from "./PaymentsTable";
import { PaymentProps } from "@/app/types/payments";

const payments: PaymentProps[] = [
  {
    id: 1,
    issue_date: "2024-11-03",
    bill_number: "INV-2024-001",
    amount: 150000, // XAF
    job: {
      provider: "TameriTech",
      title: "Développement site vitrine",
      avatar: "/avatars/tameritech.png",
    },
    status: "paid",
  },
  {
    id: 2,
    issue_date: "2024-11-18",
    bill_number: "INV-2024-002",
    amount: 85000,
    job: {
      provider: "KamerDev",
      title: "Maintenance application web",
      avatar: "/avatars/kamerdev.png",
    },
    status: "pending",
  },
  {
    id: 3,
    issue_date: "2024-12-02",
    bill_number: "INV-2024-003",
    amount: 200000,
    job: {
      provider: "Freelance Hub",
      title: "Audit sécurité (OWASP)",
      avatar: "/avatars/freelancehub.png",
    },
    status: "canceled",
  },
  {
    id: 4,
    issue_date: "2024-12-08",
    bill_number: "INV-2024-004",
    amount: 120000,
    job: {
      provider: "Digital Africa",
      title: "Intégration dashboard admin",
      avatar: "/avatars/digitalafrica.png",
    },
    status: "paid",
  },
];

export function AgendaTab() {
  const [activeTab, setActiveTab] = useState("calendar");
  const [favorites, setFavorites] = useState<number[]>([]);

  const toggleFavorite = (id: number) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((fid) => fid !== id) : [...prev, id]
    );
  };

  return (
    <div className="flex-1 p-6 bg-transparent overflow-auto">
      {/* Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="mb-6 bg-transparent"
      >
        <TabsList className="bg-white px-6 py-4 rounded-4xl w-full justify-start gap-8 h-auto">
          <TabsTrigger
            value="calendar"
            className="data-[state=active]:text-orange-500 text-gray-800 data-[state=active]:border-b-2 px-4 data-[state=active]:bg-transparent data-[state=active]:border-orange-500 border-0 rounded-none pb-3"
          >
            {"Calendar"}
          </TabsTrigger>
          <TabsTrigger
            value="history"
            className="data-[state=active]:text-orange-500 text-gray-800 data-[state=active]:border-b-2 px-4 data-[state=active]:bg-transparent data-[state=active]:border-orange-500 border-0 rounded-none pb-3"
          >
            {"Service history"}
          </TabsTrigger>
          <TabsTrigger
            value="payments"
            className="data-[state=active]:text-orange-500 text-gray-800 data-[state=active]:border-b-2 px-4 data-[state=active]:bg-transparent data-[state=active]:border-orange-500 border-0 rounded-none pb-3"
          >
            {"Payment history"}
          </TabsTrigger>
        </TabsList>

        <TabsContent
          value="calendar"
          className="mt-6 bg-white rounded-4xl overflow-hidden"
        >
          <ServiceCalendar events={sampleEvents} showPublishService={false} />
        </TabsContent>
        <TabsContent value="history" className="mt-6 bg-white rounded-4xl p-4">
          <JobHistoryContent
            favorites={favorites}
            toggleFavorite={toggleFavorite}
          />
        </TabsContent>
        <TabsContent value="payments" className="mt-6 bg-white rounded-4xl p-4">
          <PaymentsTable payments={payments} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
