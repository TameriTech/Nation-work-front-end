// components/features/profile/tabs/EvaluationsTabContent.tsx
"use client";
import { useParams } from "next/navigation";
import { Button } from "@/app/components/ui/button";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/app/components/ui/avatar";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { Icon } from "@iconify/react";
import { useReviews } from "@/app/hooks/social/use-reviews";
import { useAuth } from "@/app/hooks/auth/use-auth";
import { formatDate } from "@/app/lib/utils";
import { ReviewsSkeleton } from "./loading";
import { ReviewsError } from "./error";
import { useState } from "react";

export default function EvaluationsTabContent() {
  const params = useParams();
  const freelancerId = params.freelancerId
    ? Number(params.freelancerId)
    : undefined;
  const { user } = useAuth();

  // Déterminer si on affiche les évaluations du freelancer connecté ou d'un autre
  const targetId = freelancerId || user?.id;

  const {
    reviews,
    stats,
    isLoading,
    error,
    hasMore,
    loadMore,
    respondToReview,
    markHelpful,
    isResponding,
    refetch,
  } = useReviews(targetId);

  const [responseInputs, setResponseInputs] = useState<Record<number, string>>(
    {},
  );

  const handleRespond = async (reviewId: number) => {
    const response = responseInputs[reviewId];
    if (!response?.trim()) return;

    await respondToReview({ reviewId, response: response.trim() });
    setResponseInputs((prev) => ({ ...prev, [reviewId]: "" }));
  };

  if (isLoading) {
    return <ReviewsSkeleton />;
  }

  if (error) {
    return <ReviewsError error={error} onRetry={refetch} />;
  }

  return (
    <div className="space-y-6 bg-white rounded-3xl">
      <RatingOverviewCard stats={stats} />
      <CommentsSection
        reviews={reviews}
        currentUserId={user?.id}
        responseInputs={responseInputs}
        setResponseInputs={setResponseInputs}
        onRespond={handleRespond}
        onMarkHelpful={markHelpful}
        isResponding={isResponding}
        hasMore={hasMore}
        onLoadMore={loadMore}
      />
    </div>
  );
}

// ==================== COMPOSANTS ====================

function RatingOverviewCard({ stats }: { stats: any }) {
  const averageRating = stats?.average || 0;
  const totalReviews = stats?.total || 0;

  // Générer les données du graphique (simulées ou réelles)
  const chartData = generateChartData(stats?.distribution);

  return (
    <div className="rounded-3xl bg-white p-6 mb-6 border border-gray-100 shadow-sm">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start lg:items-center justify-between mb-6 gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-900/10 flex items-center justify-center">
            <Icon icon="bx:star" className="w-5 h-5 text-blue-900" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-blue-900">
              Note Globale et Évolution
            </h2>
            <p className="text-sm text-gray-500">
              Basé sur {totalReviews} évaluation{totalReviews > 1 ? "s" : ""}
            </p>
          </div>
        </div>
        {averageRating < 3 && (
          <Button
            variant="outline"
            className="rounded-full border-red-200 text-red-600 hover:bg-red-50 gap-2"
          >
            <Icon icon="bx:message-square-x" className="w-4 h-4" />
            Contester une note
          </Button>
        )}
      </div>

      {/* Content Row */}
      <div className="flex flex-col md:flex-row items-center gap-8">
        {/* Stars */}
        <div className="flex-shrink-0 text-center">
          <StarRating rating={averageRating} size={36} />
          <p className="text-sm text-gray-500 mt-2">Moyenne générale</p>
        </div>

        {/* Chart */}
        <div className="flex-1 h-40 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "#64748B" }}
              />
              <YAxis
                domain={[0, 5]}
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "#64748B" }}
                ticks={[0, 1, 2, 3, 4, 5]}
              />
              <Tooltip
                contentStyle={{
                  background: "white",
                  border: "1px solid #E2E8F0",
                  borderRadius: "8px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                }}
                formatter={(value: any) => [value.toFixed(1), "Note"]}
              />
              <Line
                type="monotone"
                dataKey="rating"
                stroke="#F97316"
                strokeWidth={2}
                dot={{ fill: "white", stroke: "#F97316", strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Rating Badge */}
        <div className="flex-shrink-0 text-center">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-50 to-blue-100 flex flex-col items-center justify-center shadow-inner">
            <span className="text-3xl font-bold text-blue-900">
              {averageRating.toFixed(1)}
            </span>
            <span className="text-xs text-gray-500">/5</span>
          </div>
          <p className="text-sm font-medium text-gray-700 mt-2">
            {totalReviews} avis
          </p>
        </div>
      </div>

      {/* Distribution des notes */}
      {stats?.distribution && (
        <div className="mt-6 pt-6 border-t border-gray-100">
          <h3 className="text-sm font-medium text-gray-700 mb-3">
            Distribution des notes
          </h3>
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map((rating) => (
              <div key={rating} className="flex items-center gap-2">
                <span className="text-xs text-gray-500 w-8">{rating} ★</span>
                <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-400 rounded-full"
                    style={{
                      width: `${((stats.distribution[rating] || 0) / totalReviews) * 100}%`,
                    }}
                  />
                </div>
                <span className="text-xs text-gray-500 w-12">
                  {stats.distribution[rating] || 0}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function CommentsSection({
  reviews,
  currentUserId,
  responseInputs,
  setResponseInputs,
  onRespond,
  onMarkHelpful,
  isResponding,
  hasMore,
  onLoadMore,
}: any) {
  return (
    <div className="rounded-3xl bg-white p-6 border border-gray-100 shadow-sm">
      {/* Section Header */}
      <div className="flex items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-900/10 flex items-center justify-center">
            <Icon icon="bx:message-square" className="w-5 h-5 text-blue-900" />
          </div>
          <h2 className="text-lg font-semibold text-blue-900">
            Commentaires des clients
          </h2>
        </div>
        <span className="text-sm text-gray-500">
          {reviews.length} commentaire{reviews.length > 1 ? "s" : ""}
        </span>
      </div>

      {/* Comments Grid */}
      {reviews.length === 0 ? (
        <div className="text-center py-12">
          <Icon
            icon="bx:message-square-detail"
            className="w-16 h-16 text-gray-300 mx-auto mb-4"
          />
          <p className="text-gray-500">Aucun commentaire pour le moment</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {reviews.map((review: any) => (
              <CommentCard
                key={review.id}
                review={review}
                currentUserId={currentUserId}
                responseInput={responseInputs[review.id]}
                onResponseChange={(value: string) =>
                  setResponseInputs((prev: any) => ({
                    ...prev,
                    [review.id]: value,
                  }))
                }
                onRespond={() => onRespond(review.id)}
                onMarkHelpful={() => onMarkHelpful(review.id)}
                isResponding={isResponding}
              />
            ))}
          </div>

          {hasMore && (
            <div className="flex justify-center mt-8">
              <Button
                variant="outline"
                onClick={onLoadMore}
                className="rounded-full"
              >
                <Icon icon="bx:refresh" className="w-4 h-4 mr-2" />
                Charger plus
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function CommentCard({
  review,
  currentUserId,
  responseInput,
  onResponseChange,
  onRespond,
  onMarkHelpful,
  isResponding,
}: any) {
  const [showResponseInput, setShowResponseInput] = useState(false);
  const isOwner = currentUserId === review.freelancer_id;

  return (
    <div className="rounded-2xl bg-gray-50 hover:bg-white border border-gray-100 hover:shadow-md transition-all p-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <Avatar className="w-12 h-12 border-2 border-white shadow-sm">
          <AvatarImage src={review.client?.avatar} alt={review.client?.name} />
          <AvatarFallback className="bg-blue-900/10 text-blue-900">
            {review.client?.name?.charAt(0) || "C"}
          </AvatarFallback>
        </Avatar>
        <div>
          <h4 className="font-semibold text-gray-900">
            {review.client?.name || "Client"}
          </h4>
          <p className="text-xs text-gray-500">
            {review.client?.totalReviews || 0} avis
          </p>
        </div>
      </div>

      {/* Service info */}
      <p className="text-xs text-gray-400 mb-2">
        Pour: {review.service?.title || "Service"}
      </p>

      {/* Comment */}
      <p className="text-sm text-gray-600 mb-4 leading-relaxed">
        "{review.comment}"
      </p>

      {/* Rating and Date */}
      <div className="flex items-center justify-between mb-4">
        <StarRating rating={review.rating} size={18} />
        <span className="text-xs text-gray-400">
          {formatDate(review.created_at)}
        </span>
      </div>

      {/* Freelancer Response */}
      {review.freelancer_response && (
        <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
          <p className="text-xs font-medium text-blue-800 mb-1">Réponse:</p>
          <p className="text-sm text-blue-700">{review.freelancer_response}</p>
          <p className="text-xs text-blue-400 mt-1">
            {formatDate(review.response_date)}
          </p>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-200">
        <button
          onClick={onMarkHelpful}
          className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-blue-600 transition-colors"
        >
          <Icon icon="bx:like" className="w-4 h-4" />
          Utile ({review.helpful_count || 0})
        </button>

        {isOwner && !review.freelancer_response && !showResponseInput && (
          <button
            onClick={() => setShowResponseInput(true)}
            className="text-xs text-blue-600 hover:text-blue-800"
          >
            Répondre
          </button>
        )}

        {isOwner && showResponseInput && (
          <div className="flex-1 ml-2">
            <input
              type="text"
              value={responseInput}
              onChange={(e) => onResponseChange(e.target.value)}
              placeholder="Votre réponse..."
              className="w-full px-3 py-1 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              disabled={isResponding}
            />
            <div className="flex justify-end gap-2 mt-2">
              <button
                onClick={() => setShowResponseInput(false)}
                className="text-xs text-gray-500 hover:text-gray-700"
              >
                Annuler
              </button>
              <button
                onClick={onRespond}
                disabled={!responseInput?.trim() || isResponding}
                className="text-xs text-blue-600 hover:text-blue-800 disabled:opacity-50"
              >
                Envoyer
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function StarRating({ rating, size = 24 }: { rating: number; size?: number }) {
  const starSize = size === 24 ? "w-5 h-5" : "w-4 h-4";

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Icon
          key={star}
          icon={star <= rating ? "bx:bxs-star" : "bx:bx-star"}
          className={`${starSize} ${
            star <= rating ? "text-amber-400" : "text-gray-300"
          }`}
        />
      ))}
    </div>
  );
}

// Fonction utilitaire pour générer les données du graphique
function generateChartData(distribution?: any) {
  const months = [
    "Jan",
    "Fév",
    "Mar",
    "Avr",
    "Mai",
    "Juin",
    "Juil",
    "Aoû",
    "Sep",
    "Oct",
    "Nov",
    "Déc",
  ];
  const currentMonth = new Date().getMonth();

  return months.map((month, index) => ({
    month,
    rating:
      index <= currentMonth
        ? distribution?.[index + 1] || 3 + Math.random()
        : null,
  }));
}
