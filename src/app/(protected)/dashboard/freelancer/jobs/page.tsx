"use client";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/app/components/ui/accordion";
import { JobFilters } from "@/app/components/features/job/JobFilters";
import { JobListings } from "@/app/components/features/job/JobListingsTab";
import { Icon } from "@iconify/react";

export default function JobListingsPage() {
  return (
    <div className="min-h-screen bg-white mt-5 rounded-3xl flex flex-col lg:flex-row">
      {/** Use accordion on small screens */}
      {/* Mobile */}
      <div className="flex lg:hidden w-full px-8">
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="filters">
            <AccordionTrigger className="px-0 text-gray-800 border-blue-50 border-b">
              <span className="text-lg font-medium flex items-center gap-2">
                {" "}
                <Icon icon={"bi:filter"} /> Filters
              </span>
            </AccordionTrigger>
            <AccordionContent className="pt-4">
              <JobFilters
                onApplyFilters={() => console.log("Filters applied")}
              />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      {/* Desktop */}
      <div className="hidden lg:flex border-r">
        <JobFilters onApplyFilters={() => console.log("Filters applied")} />
      </div>

      <JobListings />
    </div>
  );
}
