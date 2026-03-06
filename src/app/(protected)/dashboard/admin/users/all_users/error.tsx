// app/(protected)/dashboard/admin/users/error.tsx
import { AlertCircle } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Card, CardContent } from "@/app/components/ui/card";

interface AdminUsersErrorProps {
  error: Error;
  onRetry: () => void;
}

export default function AdminUsersError({
  error,
  onRetry,
}: AdminUsersErrorProps) {
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center py-12">
        <AlertCircle className="h-12 w-12 text-destructive mb-4" />
        <h3 className="text-lg font-semibold mb-2">Erreur de chargement</h3>
        <p className="text-muted-foreground text-center max-w-md mb-6">
          {error.message ||
            "Une erreur est survenue lors du chargement des utilisateurs."}
        </p>
        <Button onClick={onRetry}>Réessayer</Button>
      </CardContent>
    </Card>
  );
}
