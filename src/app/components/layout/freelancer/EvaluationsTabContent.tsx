"use client";
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

const monthlyRatings = [
  { month: "Jan", rating: 2.0 },
  { month: "Fev", rating: 2.2 },
  { month: "Mar", rating: 1.8 },
  { month: "Avr", rating: 2.0 },
  { month: "Mai", rating: 3.5 },
  { month: "Jui", rating: 3.2 },
  { month: "Jul", rating: 2.8 },
  { month: "Aou", rating: 0.8 },
  { month: "Sep", rating: 3.0 },
  { month: "Oct", rating: 1.5 },
  { month: "Nov", rating: null },
  { month: "Dec", rating: null },
];

const clientComments = [
  {
    id: 1,
    name: "Nom Client",
    job: "travail concerné",
    comment:
      "court commentaire court commentaire court commentaire court commentaire court commentaire court commentaire court commentaire court commentaire court commentaire",
    rating: 4,
    daysAgo: 6,
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
  },
  {
    id: 2,
    name: "Nom Client",
    job: "travail concerné",
    comment:
      "court commentaire court commentaire court commentaire court commentaire court commentaire court commentaire court commentaire court commentaire court commentaire",
    rating: 3,
    daysAgo: 6,
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face",
  },
  {
    id: 3,
    name: "Nom Client",
    job: "travail concerné",
    comment:
      "court commentaire court commentaire court commentaire court commentaire court commentaire court commentaire court commentaire court commentaire court commentaire",
    rating: 4,
    daysAgo: 8,
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
  },
  {
    id: 4,
    name: "Nom Client",
    job: "travail concerné",
    comment:
      "court commentaire court commentaire court commentaire court commentaire court commentaire court commentaire court commentaire court commentaire court commentaire",
    rating: 5,
    daysAgo: 10,
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face",
  },
];

function StarRating({ rating, size = 24 }: { rating: number; size?: number }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Icon
          icon={"bx:star"}
          key={star}
          className={
            star <= rating
              ? "fill-amber-400 w-4 h-4 text-amber-400"
              : "fill-muted w-4 h-4 text-muted"
          }
        />
      ))}
    </div>
  );
}

function RatingOverviewCard() {
  return (
    <div className="rounded-3xl bg-white p-8 mb-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
            <Icon icon={"bx:star"} className="w-5 h-5 text-accent hidden" />
            <svg
              width="35"
              height="35"
              viewBox="0 0 35 35"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect width="35" height="35" rx="10" fill="#DCEFFF" />
              <path
                d="M20.3245 11.8416L21.4995 14.1916C21.6579 14.5166 22.0829 14.8249 22.4412 14.8916L24.5662 15.2416C25.9245 15.4666 26.2412 16.4499 25.2662 17.4332L23.6079 19.0916C23.3329 19.3666 23.1745 19.9082 23.2662 20.2999L23.7412 22.3499C24.1162 23.9666 23.2495 24.5999 21.8245 23.7499L19.8329 22.5666C19.4745 22.3499 18.8745 22.3499 18.5162 22.5666L16.5245 23.7499C15.0995 24.5916 14.2329 23.9666 14.6079 22.3499L15.0829 20.2999C15.1579 19.8999 14.9995 19.3582 14.7245 19.0832L13.0662 17.4249C12.0912 16.4499 12.4079 15.4666 13.7662 15.2332L15.8912 14.8832C16.2495 14.8249 16.6745 14.5082 16.8329 14.1832L18.0079 11.8332C18.6495 10.5666 19.6829 10.5666 20.3245 11.8416Z"
                fill="#05579B"
              />
              <path
                d="M14.166 12.2915H9.16602C8.82435 12.2915 8.54102 12.0082 8.54102 11.6665C8.54102 11.3248 8.82435 11.0415 9.16602 11.0415H14.166C14.5077 11.0415 14.791 11.3248 14.791 11.6665C14.791 12.0082 14.5077 12.2915 14.166 12.2915Z"
                fill="#05579B"
              />
              <path
                d="M11.666 23.9585H9.16602C8.82435 23.9585 8.54102 23.6752 8.54102 23.3335C8.54102 22.9918 8.82435 22.7085 9.16602 22.7085H11.666C12.0077 22.7085 12.291 22.9918 12.291 23.3335C12.291 23.6752 12.0077 23.9585 11.666 23.9585Z"
                fill="#05579B"
              />
              <path
                d="M9.99935 18.125H9.16602C8.82435 18.125 8.54102 17.8417 8.54102 17.5C8.54102 17.1583 8.82435 16.875 9.16602 16.875H9.99935C10.341 16.875 10.6243 17.1583 10.6243 17.5C10.6243 17.8417 10.341 18.125 9.99935 18.125Z"
                fill="#05579B"
              />
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-accent">
            Note Global et Évolution Moyenne par Mois
          </h2>
        </div>
        <Button className="rounded-full bg-blue-900 hover:bg-blue-800 text-white gap-2">
          <svg
            width="15"
            height="15"
            viewBox="0 0 15 15"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M10.5625 11.8813C10.3687 11.8813 10.175 11.8251 10.0062 11.7126L9.40625 11.3188C9.2375 11.2063 9.15625 10.9939 9.2125 10.8001C9.25625 10.6564 9.275 10.4876 9.275 10.3001V7.75632C9.275 6.73757 8.6375 6.1001 7.61875 6.1001H3.375C3.3 6.1001 3.23125 6.10636 3.1625 6.11261C3.03125 6.11886 2.90625 6.0751 2.80625 5.9876C2.70625 5.9001 2.65625 5.77511 2.65625 5.64386V3.9126C2.65625 2.0751 3.94375 0.787598 5.78125 0.787598H11.0938C12.9313 0.787598 14.2188 2.0751 14.2188 3.9126V7.10008C14.2188 8.00633 13.9125 8.80632 13.35 9.35632C12.9 9.81257 12.275 10.1063 11.5625 10.1938V10.8876C11.5625 11.2626 11.3562 11.6001 11.0312 11.7751C10.8812 11.8439 10.7187 11.8813 10.5625 11.8813ZM10.1875 10.7063L10.5937 10.9376C10.6312 10.9188 10.6312 10.8876 10.6312 10.8813V9.75008C10.6312 9.49383 10.8437 9.28133 11.1 9.28133C11.7562 9.28133 12.3125 9.07511 12.6937 8.68761C13.0875 8.30011 13.2875 7.75008 13.2875 7.09383V3.90634C13.2875 2.57509 12.4312 1.71884 11.1 1.71884H5.7875C4.45625 1.71884 3.6 2.57509 3.6 3.90634V5.15634H7.625C9.15 5.15634 10.2188 6.22511 10.2188 7.75011V10.2938C10.2125 10.4376 10.2063 10.5751 10.1875 10.7063Z"
              fill="white"
            />
            <path
              d="M3.79375 14.2188C3.65625 14.2188 3.5125 14.1875 3.38125 14.1188C3.0875 13.9625 2.90625 13.6625 2.90625 13.325V12.85C2.35625 12.7625 1.86875 12.5312 1.50625 12.1687C1.03125 11.6937 0.78125 11.0437 0.78125 10.2937V7.75002C0.78125 6.33752 1.70625 5.30001 3.08125 5.16876C3.18125 5.16251 3.275 5.15625 3.375 5.15625H7.61875C9.14375 5.15625 10.2125 6.22502 10.2125 7.75002V10.2937C10.2125 10.5687 10.1812 10.825 10.1125 11.0563C9.83125 12.1813 8.875 12.8875 7.61875 12.8875H6.0625L4.29375 14.0625C4.14375 14.1688 3.96875 14.2188 3.79375 14.2188ZM3.375 6.09375C3.3 6.09375 3.23125 6.10001 3.1625 6.10626C2.2625 6.18751 1.71875 6.80627 1.71875 7.75002V10.2937C1.71875 10.7937 1.875 11.2125 2.16875 11.5062C2.45625 11.7937 2.875 11.95 3.375 11.95C3.63125 11.95 3.84375 12.1625 3.84375 12.4187V13.2375L5.65625 12.0312C5.73125 11.9813 5.825 11.95 5.91875 11.95H7.61875C8.44375 11.95 9.025 11.5375 9.20625 10.8125C9.25 10.6562 9.275 10.4812 9.275 10.2937V7.75002C9.275 6.73127 8.6375 6.09375 7.61875 6.09375H3.375Z"
              fill="white"
            />
          </svg>
          <Icon icon={"bx:message-circle"} className="w-4 h-4 hidden" />
          Contester une note
        </Button>
      </div>

      {/* Content Row */}
      <div className="flex items-center gap-8">
        {/* Stars */}
        <div className="flex-shrink-0">
          <StarRating rating={4} size={36} />
        </div>

        {/* Chart */}
        <div className="flex-1 h-40">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={monthlyRatings}>
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
              />
              <YAxis
                domain={[0, 4]}
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                ticks={[0, 1, 2, 3, 4]}
              />
              <Tooltip
                contentStyle={{
                  background: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
              />
              <Line
                type="linear"
                dataKey="rating"
                stroke="#f97316"
                strokeWidth={2}
                dot={{ fill: "#fff", stroke: "#f97316", strokeWidth: 2, r: 4 }}
                connectNulls={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Rating Badge */}
        <div className="flex-shrink-0">
          <div className="w-24 h-24 rounded-full bg-white shadow-lg flex items-center justify-center">
            <span className="text-2xl flex gap-2 font-bold text-emerald-600">
              4.8 <span className="text-blue-900">/</span>{" "}
              <span className="text-blue-900">5</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function CommentCard({
  name,
  job,
  comment,
  rating,
  daysAgo,
  avatar,
}: {
  name: string;
  job: string;
  comment: string;
  rating: number;
  daysAgo: number;
  avatar: string;
}) {
  return (
    <div className="rounded-2xl bg-card shadow-md p-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <Avatar className="w-12 h-12">
          <AvatarImage src={avatar} alt={name} />
          <AvatarFallback className="bg-accent/10 text-accent">
            {name.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <div>
          <h4 className="font-semibold text-gray-900">{name}</h4>
          <p className="text-sm text-gray-600">{job}</p>
        </div>
      </div>

      {/* Comment */}
      <p className="text-sm text-gray-600 mb-4 leading-relaxed">{comment}</p>

      {/* Footer */}
      <div className="flex items-center justify-between">
        <StarRating rating={rating} size={18} />
        <span className="text-sm text-muted-foreground">
          noté il y a {daysAgo} j
        </span>
      </div>
    </div>
  );
}

function CommentsSection() {
  return (
    <div className="rounded-3xl bg-card  p-8">
      {/* Section Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-blue-900/10 flex items-center justify-center">
          <Icon icon={"bx:message-square"} className="w-5 h-5 text-blue-900" />
        </div>
        <h2 className="text-lg font-semibold text-blue-900">
          Commentaires laissés par le client
        </h2>
      </div>

      {/* Comments Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {clientComments.map((comment) => (
          <CommentCard
            key={comment.id}
            name={comment.name}
            job={comment.job}
            comment={comment.comment}
            rating={comment.rating}
            daysAgo={comment.daysAgo}
            avatar={comment.avatar}
          />
        ))}
      </div>
    </div>
  );
}

export default function EvaluationsTabContent() {
  return (
    <div className="space-y-6 bg-white rounded-3xl">
      <RatingOverviewCard />
      <CommentsSection />
    </div>
  );
}
