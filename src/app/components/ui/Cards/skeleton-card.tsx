// app/components/ui/skeleton-card.tsx
"use client";

import { Icon } from "@iconify/react";

export function SkeletonCard() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-5 space-y-4 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          {/* Avatar Skeleton */}
          <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700"></div>
          <div className="space-y-2">
            {/* Title Skeleton */}
            <div className="h-5 w-48 bg-gray-200 dark:bg-gray-700 rounded"></div>
            {/* Subtitle Skeleton */}
            <div className="h-3 w-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        </div>
        {/* Favorite Button Skeleton */}
        <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700"></div>
      </div>

      {/* Description Skeleton */}
      <div className="space-y-2">
        <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded"></div>
        <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-700 rounded"></div>
        <div className="h-4 w-1/2 bg-gray-200 dark:bg-gray-700 rounded"></div>
      </div>

      {/* Skills Skeleton */}
      <div className="flex flex-wrap gap-2">
        <div className="h-6 w-20 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
        <div className="h-6 w-24 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
        <div className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
      </div>

      {/* Footer Skeleton */}
      <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-700">
        <div className="flex items-center gap-4">
          <div className="h-4 w-28 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
        <div className="flex items-center gap-3">
          <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>

      {/* Apply Button Skeleton */}
      <div className="h-10 w-full bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
    </div>
  );
}

// Alternative: More compact skeleton for grid layouts
export function SkeletonCardCompact() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-4 space-y-3 animate-pulse">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700"></div>
        <div className="flex-1 space-y-2">
          <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="h-3 w-1/2 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
      <div className="h-3 w-full bg-gray-200 dark:bg-gray-700 rounded"></div>
      <div className="h-3 w-2/3 bg-gray-200 dark:bg-gray-700 rounded"></div>
      <div className="flex gap-2">
        <div className="h-5 w-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
        <div className="h-5 w-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
      </div>
      <div className="flex justify-between">
        <div className="h-3 w-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
        <div className="h-3 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
      </div>
    </div>
  );
}

// Grid of skeleton cards
export function SkeletonGrid({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-5">
      {[...Array(count)].map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}

// For the stats cards skeleton
export function SkeletonStats() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="bg-white dark:bg-gray-800 rounded-xl p-4 animate-pulse">
          <div className="flex items-center justify-between mb-2">
            <div className="w-8 h-8 rounded-lg bg-gray-200 dark:bg-gray-700"></div>
            <div className="w-12 h-5 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
          <div className="h-7 w-16 bg-gray-200 dark:bg-gray-700 rounded mt-2"></div>
          <div className="h-3 w-20 bg-gray-200 dark:bg-gray-700 rounded mt-2"></div>
        </div>
      ))}
    </div>
  );
}

// For the filters skeleton
export function SkeletonFilters() {
  return (
    <div className="w-full lg:w-[312px] p-6 space-y-6 animate-pulse">
      <div>
        <div className="h-7 w-40 bg-gray-200 dark:bg-gray-700 rounded"></div>
        <div className="h-4 w-48 bg-gray-200 dark:bg-gray-700 rounded mt-2"></div>
      </div>
      <div className="h-12 w-full bg-gray-200 dark:bg-gray-700 rounded-full"></div>
      <div className="space-y-3">
        <div className="h-5 w-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
        <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded"></div>
        <div className="h-2 w-full bg-gray-200 dark:bg-gray-700 rounded"></div>
      </div>
      <div className="space-y-3">
        <div className="h-5 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
        <div className="h-10 w-full bg-gray-200 dark:bg-gray-700 rounded"></div>
      </div>
      <div className="space-y-3">
        <div className="h-5 w-28 bg-gray-200 dark:bg-gray-700 rounded"></div>
        <div className="space-y-2">
          <div className="h-5 w-full bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="h-5 w-full bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
      <div className="flex gap-2 pt-4">
        <div className="flex-1 h-10 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
        <div className="flex-1 h-10 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
      </div>
    </div>
  );
}
