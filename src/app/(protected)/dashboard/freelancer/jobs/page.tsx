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
import { useServices } from "@/app/hooks/services/use-services";
import { useCategories } from "@/app/hooks/use-categories";

// app/jobs/page.tsx (extrait)

export default function JobListingsPage() {
  const { filters, updateFilters, services, loading } = useServices({
    initialFilters: {
      page: 1,
      limit: 10,
      sort_by: "date",
      sort_order: "desc",
    },
  });

  const { categories } = useCategories();

  return (
    <div className="min-h-screen bg-white mt-5 rounded-3xl flex flex-col lg:flex-row">
      {/* Filters sidebar */}
      <div className="hidden lg:block border-r">
        <JobFilters
          filters={filters}
          onApplyFilters={updateFilters}
          categories={categories}
        />
      </div>

      {/* Mobile filters accordion */}
      <div className="lg:hidden w-full px-8">
        <Accordion type="single" collapsible>
          <AccordionItem value="filters">
            <AccordionTrigger>
              <span className="flex items-center gap-2">
                <Icon icon="bi:filter" /> Filtres
              </span>
            </AccordionTrigger>
            <AccordionContent>
              <JobFilters
                filters={filters}
                onApplyFilters={updateFilters}
                categories={categories}
              />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      {/* Results */}
      <JobListings />
    </div>
  );
}
