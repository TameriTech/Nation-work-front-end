"use client";
import { AgendaTab } from "../components/AgendaTab";
import { AgendaSidebar } from "../components/AgendaSidebar";

export default function AgendasPage() {
  return (
    <div className="min-h-screen mt-5 rounded-3xl flex">
      <AgendaSidebar onApplyFilters={() => console.log("Filters applied")} />
      <AgendaTab />
    </div>
  );
}
