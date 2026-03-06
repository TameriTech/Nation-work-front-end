export function ExperienceSkeleton() {
  return (
    <div className="space-y-6">
      {[1, 2].map((section) => (
        <div key={section} className="rounded-3xl bg-white shadow-lg p-8">
          <div className="flex justify-between items-center mb-6 animate-pulse">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-200 rounded-xl"></div>
              <div className="h-6 w-48 bg-gray-200 rounded"></div>
            </div>
            <div className="w-24 h-10 bg-gray-200 rounded-full"></div>
          </div>

          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="py-5 border-b border-gray-200 last:border-0"
            >
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-gray-200 rounded-xl shrink-0"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-5 w-48 bg-gray-200 rounded"></div>
                  <div className="h-4 w-32 bg-gray-200 rounded"></div>
                  <div className="h-4 w-full bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

// components/features/profile/tabs/loading.tsx
export function DocumentsSkeleton() {
  return (
    <div className="bg-white rounded-3xl p-6">
      <div className="animate-pulse">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-200 rounded-xl"></div>
            <div>
              <div className="h-6 w-48 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 w-32 bg-gray-200 rounded"></div>
            </div>
          </div>
          <div className="h-10 w-40 bg-gray-200 rounded-full"></div>
        </div>

        {/* Progress bar */}
        <div className="h-3 bg-gray-200 rounded-full mb-8"></div>

        {/* Document sections */}
        {[1, 2, 3].map((section) => (
          <div key={section} className="py-6 border-b border-gray-200">
            <div className="h-6 w-40 bg-gray-200 rounded mb-4"></div>
            <div className="grid grid-cols-2 gap-6">
              {[1, 2].map((card) => (
                <div key={card} className="bg-gray-100 rounded-xl p-4">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
                    <div className="flex-1">
                      <div className="h-4 w-32 bg-gray-200 rounded mb-2"></div>
                      <div className="h-3 w-24 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// components/features/profile/tabs/loading.tsx
export function ReviewsSkeleton() {
  return (
    <div className="space-y-6">
      {/* Rating card skeleton */}
      <div className="rounded-3xl bg-white p-6 border border-gray-100 animate-pulse">
        <div className="flex justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-200 rounded-xl"></div>
            <div>
              <div className="h-5 w-48 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 w-32 bg-gray-200 rounded"></div>
            </div>
          </div>
          <div className="w-32 h-10 bg-gray-200 rounded-full"></div>
        </div>

        <div className="flex gap-8">
          <div className="w-32 h-20 bg-gray-200 rounded"></div>
          <div className="flex-1 h-40 bg-gray-200 rounded"></div>
          <div className="w-24 h-24 bg-gray-200 rounded-full"></div>
        </div>
      </div>

      {/* Comments section skeleton */}
      <div className="rounded-3xl bg-white p-6 border border-gray-100">
        <div className="flex justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-200 rounded-xl"></div>
            <div className="h-5 w-48 bg-gray-200 rounded"></div>
          </div>
          <div className="h-5 w-16 bg-gray-200 rounded"></div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-gray-100 rounded-2xl p-6">
              <div className="flex gap-3 mb-4">
                <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                <div>
                  <div className="h-4 w-32 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 w-24 bg-gray-200 rounded"></div>
                </div>
              </div>
              <div className="h-16 bg-gray-200 rounded mb-4"></div>
              <div className="flex justify-between">
                <div className="h-4 w-20 bg-gray-200 rounded"></div>
                <div className="h-4 w-20 bg-gray-200 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
