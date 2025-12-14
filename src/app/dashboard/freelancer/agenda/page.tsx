"use client";
import { AgendaTab } from "@/app/components/layout/freelancer/AgendaTab";
import { AgendaSidebar } from "@/app/components/layout/freelancer/AgendaSidebar";

export default function AgendasPage() {
  return (
    <div className="min-h-screen mt-5 rounded-3xl flex">
      <AgendaSidebar onApplyFilters={() => console.log("Filters applied")} />
      <AgendaTab />
    </div>
  );
}
