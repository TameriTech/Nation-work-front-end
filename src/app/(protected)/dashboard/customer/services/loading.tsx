// app/dashboard/customer/services/loading.tsx
export default function ServicesLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="animate-pulse">
        {/* Header */}
        <div className="h-8 w-48 bg-gray-200 rounded mb-4"></div>
        <div className="h-4 w-64 bg-gray-200 rounded mb-8"></div>

        {/* Filtres */}
        <div className="bg-white rounded-xl p-4 mb-6">
          <div className="h-10 bg-gray-200 rounded"></div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl p-4">
              <div className="h-4 w-20 bg-gray-200 rounded mb-2"></div>
              <div className="h-6 w-16 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl p-6">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex gap-4 py-3 border-b last:border-0">
              <div className="h-12 w-12 bg-gray-200 rounded"></div>
              <div className="flex-1">
                <div className="h-4 w-48 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 w-64 bg-gray-200 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
