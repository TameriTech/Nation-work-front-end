// app/dashboard/customer/loading.tsx
export function DashboardSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      {/* Header skeleton */}
      <div className="flex justify-between">
        <div>
          <div className="h-8 w-48 bg-gray-200 rounded mb-2"></div>
          <div className="h-4 w-64 bg-gray-200 rounded"></div>
        </div>
        <div className="flex gap-3">
          <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
          <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
        </div>
      </div>

      {/* Stats cards skeleton */}
      <div className="grid gap-6 grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-gray-200 rounded-[30px] h-32"></div>
        ))}
      </div>

      {/* Table skeleton */}
      <div className="bg-white rounded-[30px] p-6">
        <div className="h-6 w-48 bg-gray-200 rounded mb-6"></div>
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-12 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    </div>
  );
}
