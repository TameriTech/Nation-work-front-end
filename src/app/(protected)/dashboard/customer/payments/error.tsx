// app/dashboard/customer/payments/error.tsx
"use client";

import { Button } from "@/app/components/ui/button";
import { Icon } from "@iconify/react";

export default function PaymentError({ error, onRetry }: { error: Error; onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
      <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
        <Icon icon="bi:exclamation-triangle" className="w-10 h-10 text-red-600" />
      </div>
      <h2 className="text-xl font-semibold text-gray-900">Une erreur est survenue</h2>
      <p className="text-gray-500 text-center max-w-md">{error.message}</p>
      <Button onClick={onRetry} className="mt-4 rounded-full">
        <Icon icon="bi:arrow-repeat" className="mr-2 h-4 w-4" />
        Réessayer
      </Button>
    </div>
  );
}