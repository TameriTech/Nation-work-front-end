// app/(public)/jobs/[id]/loading.tsx
export default function JobDetailSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="w-full space-y-6">
        {/* Breadcrumb skeleton */}
        <div className="h-6 w-64 bg-gray-200 rounded-lg animate-pulse" />

        {/* Title skeleton */}
        <div className="flex justify-between">
          <div className="h-8 w-96 bg-gray-200 rounded-lg animate-pulse" />
          <div className="flex gap-3">
            <div className="h-10 w-32 bg-gray-200 rounded-full animate-pulse" />
            <div className="h-10 w-32 bg-gray-200 rounded-full animate-pulse" />
          </div>
        </div>

        {/* Description skeleton */}
        <div className="space-y-3">
          <div className="h-6 w-48 bg-gray-200 rounded-lg animate-pulse" />
          <div className="h-4 w-full bg-gray-200 rounded-lg animate-pulse" />
          <div className="h-4 w-5/6 bg-gray-200 rounded-lg animate-pulse" />
          <div className="h-4 w-4/6 bg-gray-200 rounded-lg animate-pulse" />
        </div>

        {/* Project tracking skeleton */}
        <div className="space-y-4">
          <div className="h-6 w-64 bg-gray-200 rounded-lg animate-pulse" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 bg-gray-100 rounded-xl p-5">
                <div className="h-4 w-20 bg-gray-200 rounded-lg animate-pulse mb-2" />
                <div className="h-6 w-32 bg-gray-200 rounded-lg animate-pulse" />
              </div>
            ))}
          </div>
        </div>

        {/* Info section skeleton */}
        <div className="space-y-4">
          <div className="h-6 w-48 bg-gray-200 rounded-lg animate-pulse" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 bg-gray-100 rounded-xl p-5">
                <div className="h-4 w-20 bg-gray-200 rounded-lg animate-pulse mb-2" />
                <div className="h-6 w-32 bg-gray-200 rounded-lg animate-pulse" />
              </div>
            ))}
          </div>
        </div>

        {/* Skills skeleton */}
        <div className="space-y-4">
          <div className="h-6 w-48 bg-gray-200 rounded-lg animate-pulse" />
          <div className="flex gap-2">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-8 w-24 bg-gray-200 rounded-full animate-pulse"
              />
            ))}
          </div>
        </div>

        {/* Client info skeleton */}
        <div className="space-y-4 pt-6">
          <div className="h-6 w-48 bg-gray-200 rounded-lg animate-pulse" />
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-gray-200 animate-pulse" />
            <div>
              <div className="h-5 w-32 bg-gray-200 rounded-lg animate-pulse mb-2" />
              <div className="h-4 w-40 bg-gray-200 rounded-lg animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
