"use client";
import { AgendaTab } from "../components/AgendaTab";
import { AgendaSidebar } from "../components/AgendaSidebar";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@radix-ui/react-accordion";
import { Icon } from "@iconify/react";

export default function AgendasPage() {
  return (
    <div className="min-h-screen bg-white mt-5 rounded-3xl flex flex-col lg:flex-row py-6">
      {/* Mobile */}
      <div className="flex lg:hidden w-full px-8">
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="filters" className="">
            <AccordionTrigger className="px-0 text-gray-800 w-full border-blue-50 border-b ">
              <span className="text-lg font-medium flex items-center gap-2">
                <Icon icon={"bi:filter"} /> Filters
              </span>
            </AccordionTrigger>
            <AccordionContent>
              <AgendaSidebar
                onApplyFilters={() => console.log("Filters applied")}
              />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      {/* Desktop */}
      <div className="hidden lg:flex border-r p-">
        <AgendaSidebar onApplyFilters={() => console.log("Filters applied")} />
      </div>

      <AgendaTab />
    </div>
  );
}
