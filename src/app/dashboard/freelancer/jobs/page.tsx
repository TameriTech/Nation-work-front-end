"use client";
import { JobFilters } from "../components/JobFilters";
import { JobListings } from "../components/JobListingsTab";

export default function JobListingsPage() {
  return (
    <div className="min-h-screen bg-white mt-5 rounded-3xl flex">
      <JobFilters onApplyFilters={() => console.log("Filters applied")} />
      <JobListings />
    </div>
  );
}
