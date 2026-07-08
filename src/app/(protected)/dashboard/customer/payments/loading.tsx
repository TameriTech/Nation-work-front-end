// app/dashboard/customer/payments/loading.tsx
export default function PaymentSummarySkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      <div className="h-8 bg-gray-200 rounded w-1/4"></div>
      <div className="grid gap-6 grid-cols-1 md:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-32 bg-gray-100 rounded-[30px]"></div>
        ))}
      </div>
      <div className="h-96 bg-gray-100 rounded-[30px]"></div>
    </div>
  );
}