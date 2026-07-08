// app/(dashboard)/provider/profile/reviews/page.tsx - Page avis
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@iconify/react";
import { Button } from "@/app/components/ui/button";
import { Card } from "@/app/components/ui/card";
import { Avatar, AvatarFallback } from "@/app/components/ui/avatar";
import { Badge } from "@/app/components/ui/badge";
import { Input } from "@/app/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/app/components/ui/dialog";
import { useReviews } from "@/app/hooks/social/use-reviews";
import { useprovider } from "@/app/hooks/provider-profile/use-profile";
import { Label } from "@radix-ui/react-dropdown-menu";

export default function ReviewsPage() {
  const router = useRouter();
  const { profile } = useprovider();
  const { reviews, stats, respondToReview, isLoading } = useReviews(profile?.id);
  const [responseInput, setResponseInput] = useState<Record<number, string>>({});
  const [responseDialog, setResponseDialog] = useState<number | null>(null);

  const handleRespond = async (reviewId: number) => {
    const response = responseInput[reviewId];
    if (!response?.trim()) return;
    await respondToReview({ reviewId, response: response.trim() });
    setResponseDialog(null);
    setResponseInput({});
  };

  if (isLoading) {
    return <div className="min-h-screen bg-background dark:bg-gray-900 flex items-center justify-center">Chargement...</div>;
  }

  return (
    <div className="min-h-screen bg-background dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-16">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button onClick={() => router.back()} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
            <Icon icon="ph:arrow-left" className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-text-primary dark:text-gray-100">
              Avis & Évaluations
            </h1>
            <p className="text-text-secondary dark:text-gray-400">
              Consultez et répondez aux avis de vos clients
            </p>
          </div>
        </div>

        {/* Statistiques */}
        <Card className="rounded-2xl p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold text-primary">{stats?.average_rating || 0}</div>
              <div className="flex justify-center gap-1 my-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Icon key={star} icon="ph:star-fill" className={`w-5 h-5 ${star <= (stats?.average_rating || 0) ? "text-yellow-500" : "text-gray-300"}`} />
                ))}
              </div>
              <div className="text-sm text-text-secondary">Note moyenne</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary">{stats?.total_reviews || 0}</div>
              <div className="text-sm text-text-secondary mt-2">Avis reçus</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary">{stats?.response_rate || 0}%</div>
              <div className="text-sm text-text-secondary mt-2">Taux de réponse</div>
            </div>
          </div>
        </Card>

        {/* Liste des avis */}
        <Card className="rounded-2xl p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Icon icon="ph:chat-circle" className="w-5 h-5 text-primary" />
            Tous les avis
          </h2>

          {reviews?.length === 0 ? (
            <p className="text-center text-text-secondary py-8">Aucun avis pour le moment</p>
          ) : (
            <div className="space-y-6">
              {reviews?.map((review: any) => (
                <div key={review.id} className="border-b border-gray-100 dark:border-gray-700 pb-6 last:border-0">
                  <div className="flex items-start gap-4">
                    <Avatar className="w-12 h-12">
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {review.client_name?.charAt(0) || "C"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex flex-wrap justify-between items-start gap-2">
                        <div>
                          <h3 className="font-semibold">{review.client_name}</h3>
                          <p className="text-xs text-text-secondary">{new Date(review.created_at).toLocaleDateString("fr-FR")}</p>
                        </div>
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Icon key={star} icon="ph:star-fill" className={`w-4 h-4 ${star <= review.rating ? "text-yellow-500" : "text-gray-300"}`} />
                          ))}
                        </div>
                      </div>
                      <p className="text-text-secondary mt-3">{review.comment}</p>
                      {review.service_title && (
                        <p className="text-xs text-primary mt-2">Mission: {review.service_title}</p>
                      )}
                      {review.provider_response ? (
                        <div className="mt-4 p-3 bg-primary/5 rounded-lg border border-primary/10">
                          <p className="text-xs font-medium text-primary mb-1">Votre réponse:</p>
                          <p className="text-sm text-text-secondary">{review.provider_response}</p>
                        </div>
                      ) : (
                        <Button variant="outline" size="sm" onClick={() => setResponseDialog(review.id)} className="mt-3 rounded-full">
                          <Icon icon="ph:reply" className="w-4 h-4 mr-2" />
                          Répondre
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        <div className="mt-6 flex justify-end">
          <Button variant="outline" onClick={() => router.push("/dashboard/provider/profile")} className="rounded-full">
            Retour au profil
          </Button>
        </div>
      </div>

      {/* Dialog réponse */}
      <Dialog open={responseDialog !== null} onOpenChange={() => setResponseDialog(null)}>
        <DialogContent className="sm:max-w-[450px] dark:bg-gray-800">
          <DialogHeader>
            <DialogTitle>Répondre à l'avis</DialogTitle>
          </DialogHeader>
          <div>
            <Label>Votre réponse</Label>
            <Input
              value={responseInput[responseDialog || 0] || ""}
              onChange={(e) => setResponseInput({ ...responseInput, [responseDialog || 0]: e.target.value })}
              placeholder="Merci pour votre avis..."
              className="mt-2"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setResponseDialog(null)}>Annuler</Button>
            <Button onClick={() => responseDialog && handleRespond(responseDialog)} className="bg-primary">
              Envoyer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
