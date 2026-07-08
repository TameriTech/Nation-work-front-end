// app/dashboard/customer/services/[id]/loading.tsx
export default function ServiceDetailLoading() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb skeleton */}
        <div className="h-6 w-64 bg-gray-200 rounded-lg animate-pulse mb-6" />

        {/* Header skeleton */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <div className="h-8 w-96 bg-gray-200 rounded-lg animate-pulse mb-2" />
            <div className="h-4 w-48 bg-gray-200 rounded-lg animate-pulse" />
          </div>
          <div className="flex gap-3">
            <div className="h-10 w-24 bg-gray-200 rounded-lg animate-pulse" />
            <div className="h-10 w-24 bg-gray-200 rounded-lg animate-pulse" />
          </div>
        </div>

        {/* Main grid skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column */}
          <div className="lg:col-span-2 space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-sm">
                <div className="h-6 w-48 bg-gray-200 rounded-lg animate-pulse mb-4" />
                <div className="space-y-3">
                  <div className="h-4 w-full bg-gray-200 rounded-lg animate-pulse" />
                  <div className="h-4 w-5/6 bg-gray-200 rounded-lg animate-pulse" />
                  <div className="h-4 w-4/6 bg-gray-200 rounded-lg animate-pulse" />
                </div>
              </div>
            ))}
          </div>

          {/* Right column */}
          <div className="space-y-6">
            {[1, 2].map((i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-sm">
                <div className="h-6 w-32 bg-gray-200 rounded-lg animate-pulse mb-4" />
                <div className="space-y-3">
                  <div className="h-4 w-full bg-gray-200 rounded-lg animate-pulse" />
                  <div className="h-4 w-full bg-gray-200 rounded-lg animate-pulse" />
                  <div className="h-4 w-3/4 bg-gray-200 rounded-lg animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
