// loading.tsx
"use client";

import { Card } from "@/app/components/ui/card";

export default function DashboardSkeleton() {
  <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-12">
    <div className="col-span-1 md:col-span-2 lg:col-span-8 space-y-6">
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="bg-white rounded-[30px] shadow-lg p-5">
            <div className="animate-pulse space-y-4">
              <div className="h-10 w-10 rounded-full bg-gray-200"></div>
              <div className="space-y-2">
                <div className="h-4 w-24 bg-gray-200 rounded"></div>
                <div className="h-8 w-16 bg-gray-200 rounded"></div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
    <div className="col-span-1 md:col-span-2 lg:col-span-4">
      <Card className="bg-white rounded-[30px] shadow-lg p-5">
        <div className="animate-pulse space-y-4">
          <div className="h-40 bg-gray-200 rounded"></div>
        </div>
      </Card>
    </div>
  </div>;
}
