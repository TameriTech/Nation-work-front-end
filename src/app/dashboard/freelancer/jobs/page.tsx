"use client";
import { JobFilters } from "@/app/components/layout/freelancer/JobFilters";
import { JobListings } from "@/app/components/layout/freelancer/JobListingsTab";

export default function JobListingsPage() {
  return (
    <div className="min-h-screen bg-white mt-5 rounded-3xl flex">
      <JobFilters onApplyFilters={() => console.log("Filters applied")} />
      <JobListings />
    </div>
  );
}
