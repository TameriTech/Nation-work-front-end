// app/dashboard/customer/reviews/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Star,
  StarHalf,
  MessageSquare,
  ThumbsUp,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Eye,
  Edit,
  Trash2,
  Filter,
  Search,
  RefreshCw,
  Loader2,
  Calendar,
  User,
  Briefcase,
  Award,
  TrendingUp,
  TrendingDown,
  Minus,
  ExternalLink,
  Reply,
  Send,
  MoreVertical,
  Download,
  Printer,
  Mail,
  Bell,
  Settings,
  LogOut,
  Home,
  Users,
  FileText,
  CreditCard,
  HelpCircle,
  Menu,
  X,
  Plus,
  Check,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUpDown,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Textarea } from "@/app/components/ui/textarea";
import { Label } from "@/app/components/ui/label";
import { Badge } from "@/app/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/app/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/app/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/app/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/app/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/components/ui/table";
import { Separator } from "@/app/components/ui/separator";
import { Progress } from "@/app/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/app/components/ui/radio-group";
import { Switch } from "@/app/components/ui/switch";
import { Slider } from "@/app/components/ui/slider";
import { toast } from "sonner";

import { useAuth } from "@/app/hooks/auth/use-auth";
import { useReviews } from "@/app/hooks/social/use-reviews";
import { CreateReviewFormData, ReviewResponseFormData } from "@/app/lib/validators/review.validator";
import { formatDate } from "@/app/lib/utils";
import { cn } from "@/app/lib/utils";

// Types pour les avis (basés sur le validator)
import type { Review, ReviewStats, ReviewFiltersFormData } from "@/app/lib/validators/review.validator";

// Données mockées pour l'affichage
const mockReviews: Review[] = [
  {
    id: 1,
    service_id: 101,
    service_title: "Développement site e-commerce",
    client_id: 1,
    client_name: "Vous",
    provider_id: 201,
    provider_name: "Jean Paul",
    provider_avatar: "https://i.pravatar.cc/150?u=201",
    rating: 5,
    communication_rating: 5,
    quality_rating: 5,
    deadline_rating: 4,
    professionalism_rating: 5,
    comment: "Excellent travail ! Jean Paul a été très professionnel et a livré le projet dans les délais. Le site est magnifique et fonctionne parfaitement. Je recommande vivement !",
    private_feedback: "Très bonne communication, a su comprendre mes besoins rapidement.",
    is_verified: true,
    is_public: true,
    helpful_count: 12,
    created_at: "2026-03-10T14:30:00Z",
  },
  {
    id: 2,
    service_id: 102,
    service_title: "Catering pour événement",
    client_id: 1,
    client_name: "Vous",
    provider_id: 202,
    provider_name: "Marie Claire",
    provider_avatar: "https://i.pravatar.cc/150?u=202",
    rating: 4,
    communication_rating: 4,
    quality_rating: 5,
    deadline_rating: 3,
    professionalism_rating: 4,
    comment: "Très bonne prestation culinaire. Les plats étaient délicieux et bien présentés. Petit retard à la livraison mais la qualité était au rendez-vous.",
    is_verified: true,
    is_public: true,
    helpful_count: 5,
    created_at: "2026-03-05T09:15:00Z",
  },
  {
    id: 3,
    service_id: 103,
    service_title: "Photographie mariage",
    client_id: 301,
    client_name: "Sophie Martin",
    client_avatar: "https://i.pravatar.cc/150?u=301",
    provider_id: 1,
    provider_name: "Vous",
    rating: 5,
    communication_rating: 5,
    quality_rating: 5,
    deadline_rating: 5,
    professionalism_rating: 5,
    comment: "Des photos magnifiques qui ont immortalisé notre mariage à la perfection ! Merci pour votre professionnalisme et votre créativité.",
    provider_response: "Merci beaucoup Sophie ! Ce fut un plaisir de photographier votre magnifique mariage. Je vous souhaite tout le bonheur du monde.",
    response_date: "2026-03-16T10:00:00Z",
    is_verified: true,
    is_public: true,
    helpful_count: 8,
    created_at: "2026-03-14T08:20:00Z",
  },
  {
    id: 4,
    service_id: 104,
    service_title: "Nettoyage bureaux",
    client_id: 302,
    client_name: "Entreprise ABC",
    provider_id: 1,
    provider_name: "Vous",
    rating: 5,
    comment: "Service de nettoyage impeccable. Équipe ponctuelle et efficace. Bureaux parfaitement propres. Je recommande !",
    is_verified: true,
    is_public: true,
    helpful_count: 3,
    created_at: "2026-03-01T11:45:00Z",
  },
  {
    id: 5,
    service_id: 105,
    service_title: "Cours de mathématiques",
    client_id: 1,
    client_name: "Vous",
    provider_id: 203,
    provider_name: "Pierre Kamga",
    rating: 3,
    comment: "Cours correct mais le professeur était parfois en retard. Les explications étaient claires mais le rythme était trop lent à mon goût.",
    is_verified: true,
    is_public: true,
    helpful_count: 1,
    created_at: "2026-02-28T16:30:00Z",
  },
];

// Composant d'étoiles
const StarRating = ({ 
  rating, 
  size = "sm",
  showValue = false,
  interactive = false,
  onRatingChange,
}: { 
  rating: number; 
  size?: "sm" | "md" | "lg";
  showValue?: boolean;
  interactive?: boolean;
  onRatingChange?: (rating: number) => void;
}) => {
  const [hoverRating, setHoverRating] = useState(0);
  
  const sizes = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  };
  
  const fullStars = Math.floor(rating);
  const hasHalf = rating % 1 >= 0.5;
  
  const handleClick = (value: number) => {
    if (interactive && onRatingChange) {
      onRatingChange(value);
    }
  };
  
  return (
    <div className="flex items-center gap-1">
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => {
          const filled = star <= (hoverRating || rating);
          const half = !filled && star === Math.ceil(rating) && hasHalf;
          
          return (
            <button
              key={star}
              type="button"
              disabled={!interactive}
              onClick={() => handleClick(star)}
              onMouseEnter={() => interactive && setHoverRating(star)}
              onMouseLeave={() => interactive && setHoverRating(0)}
              className={cn(
                "text-yellow-400 transition-colors",
                interactive && "cursor-pointer hover:scale-110"
              )}
            >
              {half ? (
                <StarHalf className={cn(sizes[size], "fill-yellow-400")} />
              ) : (
                <Star
                  className={cn(
                    sizes[size],
                    filled ? "fill-yellow-400" : "fill-gray-200 text-gray-200"
                  )}
                />
              )}
            </button>
          );
        })}
      </div>
      {showValue && (
        <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
};

// Composant de statistiques
const StatsCard = ({
  title,
  value,
  subValue,
  icon: Icon,
  color,
  trend,
}: {
  title: string;
  value: string | number;
  subValue?: string;
  icon: any;
  color: string;
  trend?: { value: number; direction: "up" | "down" | "neutral" };
}) => (
  <Card className="bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-gray-200 dark:border-slate-700">
    <CardContent className="p-6">
      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{value}</p>
          {subValue && (
            <p className="text-xs text-gray-500 dark:text-gray-400">{subValue}</p>
          )}
          {trend && (
            <div className="flex items-center gap-1 mt-2">
              {trend.direction === "up" && (
                <TrendingUp className="w-4 h-4 text-green-500" />
              )}
              {trend.direction === "down" && (
                <TrendingDown className="w-4 h-4 text-red-500" />
              )}
              {trend.direction === "neutral" && (
                <Minus className="w-4 h-4 text-gray-500" />
              )}
              <span className={cn(
                "text-xs",
                trend.direction === "up" && "text-green-500",
                trend.direction === "down" && "text-red-500",
                trend.direction === "neutral" && "text-gray-500"
              )}>
                {trend.value}% vs période précédente
              </span>
            </div>
          )}
        </div>
        <div className={cn(
          "w-12 h-12 rounded-lg flex items-center justify-center text-white shadow-lg",
          color
        )}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </CardContent>
  </Card>
);

// Composant de filtre
const ReviewFilters = ({
  filters,
  onFilterChange,
  onSearch,
}: {
  filters: ReviewFiltersFormData;
  onFilterChange: (filters: ReviewFiltersFormData) => void;
  onSearch: () => void;
}) => {
  const [localSearch, setLocalSearch] = useState(filters.search || "");

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      onFilterChange({ ...filters, search: localSearch, page: 1 });
      onSearch();
    }
  };

  return (
    <Card className="bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-gray-200 dark:border-slate-700 mb-6">
      <CardContent className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Recherche */}
          <div className="col-span-2">
            <Label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Recherche
            </Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-4 h-4" />
              <Input
                type="text"
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Service, commentaire..."
                className="pl-10"
              />
            </div>
          </div>

            <div>
            <Label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Note minimale
            </Label>
            <Select
                value={filters.min_rating?.toString() || "all"} // Utiliser "all" au lieu de chaîne vide
                onValueChange={(value) =>
                onFilterChange({
                    ...filters,
                    min_rating: value === "all" ? undefined : parseInt(value),
                    page: 1,
                })
                }
            >
                <SelectTrigger>
                <SelectValue placeholder="Toutes les notes" />
                </SelectTrigger>
                <SelectContent>
                <SelectItem value="all">Toutes les notes</SelectItem> {/* value explicite non-vide */}
                <SelectItem value="5">5 étoiles</SelectItem>
                <SelectItem value="4">4+ étoiles</SelectItem>
                <SelectItem value="3">3+ étoiles</SelectItem>
                <SelectItem value="2">2+ étoiles</SelectItem>
                <SelectItem value="1">1+ étoiles</SelectItem>
                </SelectContent>
            </Select>
            </div>

            <div>
            <Label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Rôle
            </Label>
            <Select
                value={filters.role || "all"}
                onValueChange={(value) =>
                onFilterChange({
                    ...filters,
                    role: value === "all" ? undefined : value as "client" | "provider",
                    page: 1,
                })
                }
            >
                <SelectTrigger>
                <SelectValue placeholder="Tous les avis" />
                </SelectTrigger>
                <SelectContent>
                <SelectItem value="all">Tous les avis</SelectItem>
                <SelectItem value="client">Avis donnés</SelectItem>
                <SelectItem value="provider">Avis reçus</SelectItem>
                </SelectContent>
            </Select>
            </div>

        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          {/* Date début */}
          <div>
            <Label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Date début
            </Label>
            <Input
              type="date"
              value={filters.date_from || ""}
              onChange={(e) =>
                onFilterChange({
                  ...filters,
                  date_from: e.target.value || undefined,
                  page: 1,
                })
              }
            />
          </div>

          {/* Date fin */}
          <div>
            <Label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Date fin
            </Label>
            <Input
              type="date"
              value={filters.date_to || ""}
              onChange={(e) =>
                onFilterChange({
                  ...filters,
                  date_to: e.target.value || undefined,
                  page: 1,
                })
              }
            />
          </div>

          
            <div>
            <Label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Réponse
            </Label>
            <Select
                value={filters.has_response?.toString() || "all"} // Utiliser "all" au lieu de chaîne vide
                onValueChange={(value) =>
                onFilterChange({
                    ...filters,
                    has_response: value === "all" ? undefined : value === "true",
                    page: 1,
                })
                }
            >
                <SelectTrigger>
                <SelectValue placeholder="Tous" />
                </SelectTrigger>
                <SelectContent>
                <SelectItem value="all">Tous</SelectItem>
                <SelectItem value="true">Avec réponse</SelectItem>
                <SelectItem value="false">Sans réponse</SelectItem>
                </SelectContent>
            </Select>
            </div>
        </div>

        <div className="flex justify-end mt-4 space-x-2">
          <Button
            variant="outline"
            onClick={() => {
              onFilterChange({
                page: 1,
                per_page: 10,
                sort_by: "created_at",
                sort_order: "desc",
              });
              setLocalSearch("");
              onSearch();
            }}
          >
            Réinitialiser
          </Button>
          <Button onClick={onSearch}>
            <Search className="w-4 h-4 mr-2" />
            Rechercher
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

// Composant de carte d'avis
const ReviewCard = ({
  review,
  type,
  onEdit,
  onDelete,
  onRespond,
  onMarkHelpful,
}: {
  review: Review;
  type: "given" | "received";
  onEdit?: (review: Review) => void;
  onDelete?: (review: Review) => void;
  onRespond?: (review: Review, response: string) => void;
  onMarkHelpful?: (reviewId: number) => void;
}) => {
  const [isResponding, setIsResponding] = useState(false);
  const [responseText, setResponseText] = useState(review.provider_response || "");
  const [showResponse, setShowResponse] = useState(!!review.provider_response);

  const handleSubmitResponse = () => {
    if (onRespond && responseText.trim()) {
      onRespond(review, responseText);
      setIsResponding(false);
    }
  };

  return (
    <Card className="bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-gray-200 dark:border-slate-700 mb-4 overflow-hidden">
      <CardContent className="p-6">
        {/* En-tête */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Avatar className="h-12 w-12 border-2 border-white shadow">
              <AvatarImage
                src={type === "given" ? review.provider_avatar : review.client_avatar}
                alt={type === "given" ? review.provider_name : review.client_name}
              />
              <AvatarFallback className="bg-blue-100 text-blue-600">
                {(type === "given" ? review.provider_name : review.client_name).charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                {type === "given" ? review.provider_name : review.client_name}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {type === "given" ? "provider" : "Client"}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant={review.is_verified ? "default" : "secondary"}>
              {review.is_verified ? "Vérifié" : "Non vérifié"}
            </Badge>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => window.open(`/services/${review.service_id}`, '_blank')}>
                  <Eye className="w-4 h-4 mr-2" />
                  Voir le service
                </DropdownMenuItem>
                {type === "given" && (
                  <DropdownMenuItem onClick={() => onEdit?.(review)}>
                    <Edit className="w-4 h-4 mr-2" />
                    Modifier
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={() => onDelete?.(review)} className="text-red-600">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Supprimer
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Service info */}
        <div className="mb-4 p-3 bg-gray-50 dark:bg-slate-700/50 rounded-lg">
          <p className="text-sm text-gray-500 dark:text-gray-400">Service</p>
          <Link 
            href={`/services/${review.service_id}`}
            className="text-blue-600 hover:underline font-medium inline-flex items-center"
          >
            {review.service_title}
            <ExternalLink className="w-3 h-3 ml-1" />
          </Link>
        </div>

        {/* Note */}
        <div className="flex items-center justify-between mb-4">
          <StarRating rating={review.rating} size="md" showValue />
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {formatDate(review.created_at)}
          </span>
        </div>

        {/* Commentaire */}
        <div className="mb-4">
          <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
            {review.comment}
          </p>
          {review.private_feedback && type === "received" && (
            <div className="mt-2 p-2 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded">
              <p className="text-xs font-medium text-yellow-700 dark:text-yellow-400 mb-1">
                Feedback privé (visible uniquement par vous)
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {review.private_feedback}
              </p>
            </div>
          )}
        </div>

        {/* Réponse */}
        {type === "given" && review.provider_response && (
          <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Reply className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <p className="text-sm font-medium text-blue-700 dark:text-blue-400">
                Réponse du provider
              </p>
              {review.response_date && (
                <span className="text-xs text-blue-500 dark:text-blue-500 ml-auto">
                  {formatDate(review.response_date)}
                </span>
              )}
            </div>
            <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
              {review.provider_response}
            </p>
          </div>
        )}

        {/* Zone de réponse (pour les avis reçus) */}
        {type === "received" && (
          <div className="mt-4">
            {!showResponse && !isResponding && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsResponding(true)}
                className="w-full"
              >
                <Reply className="w-4 h-4 mr-2" />
                Répondre à cet avis
              </Button>
            )}

            {isResponding && (
              <div className="space-y-3">
                <Textarea
                  placeholder="Écrivez votre réponse..."
                  value={responseText}
                  onChange={(e) => setResponseText(e.target.value)}
                  rows={3}
                />
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setIsResponding(false);
                      setResponseText(review.provider_response || "");
                    }}
                  >
                    Annuler
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleSubmitResponse}
                    disabled={!responseText.trim()}
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Envoyer
                  </Button>
                </div>
              </div>
            )}

            {showResponse && review.provider_response && !isResponding && (
              <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                    <p className="text-sm font-medium text-green-700 dark:text-green-400">
                      Votre réponse
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsResponding(true)}
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Modifier
                  </Button>
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                  {review.provider_response}
                </p>
                {review.response_date && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    Répondu le {formatDate(review.response_date)} {/*, "PPP 'à' HH:mm"* */}
                  </p>
                )}
              </div>
            )}
          </div>
        )}

        {/* Utilité */}
        <div className="flex items-center mt-4 pt-4 border-t border-gray-200 dark:border-slate-700">
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-gray-500"
            onClick={() => onMarkHelpful?.(review.id)}
          >
            <ThumbsUp className="w-4 h-4 mr-2" />
            {review.helpful_count} personnes ont trouvé cet avis utile
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

// Composant de distribution des notes
const RatingDistribution = ({ distribution }: { distribution: { 1: number; 2: number; 3: number; 4: number; 5: number } }) => {
  const total = Object.values(distribution).reduce((a, b) => a + b, 0);

  return (
    <Card className="bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-gray-200 dark:border-slate-700">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Distribution des notes
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {[5, 4, 3, 2, 1].map((rating) => {
            const count = distribution[rating as keyof typeof distribution] || 0;
            const percentage = total > 0 ? (count / total) * 100 : 0;

            return (
              <div key={rating} className="flex items-center gap-3">
                <div className="flex items-center w-16">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {rating} étoiles
                  </span>
                </div>
                <Progress value={percentage} className="flex-1 h-2" />
                <span className="text-sm text-gray-500 dark:text-gray-400 w-12 text-right">
                  {count}
                </span>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

// Composant de formulaire d'avis
const ReviewForm = ({
  open,
  onClose,
  onSubmit,
  initialData,
  service,
  isSubmitting,
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  initialData?: Review;
  service?: { id: number; title: string; provider_name: string };
  isSubmitting?: boolean;
}) => {
  const [rating, setRating] = useState(initialData?.rating || 0);
  const [communicationRating, setCommunicationRating] = useState(initialData?.communication_rating || 0);
  const [qualityRating, setQualityRating] = useState(initialData?.quality_rating || 0);
  const [deadlineRating, setDeadlineRating] = useState(initialData?.deadline_rating || 0);
  const [professionalismRating, setProfessionalismRating] = useState(initialData?.professionalism_rating || 0);
  const [comment, setComment] = useState(initialData?.comment || "");
  const [privateFeedback, setPrivateFeedback] = useState(initialData?.private_feedback || "");
  const [isPublic, setIsPublic] = useState(initialData?.is_public ?? true);

  const handleSubmit = () => {
    if (rating === 0) {
      toast.error("Veuillez attribuer une note");
      return;
    }
    if (!comment.trim()) {
      toast.error("Veuillez écrire un commentaire");
      return;
    }

    onSubmit({
      service_id: service?.id || 0,
      rating,
      communication_rating: communicationRating || undefined,
      quality_rating: qualityRating || undefined,
      deadline_rating: deadlineRating || undefined,
      professionalism_rating: professionalismRating || undefined,
      comment: comment.trim(),
      private_feedback: privateFeedback.trim() || undefined,
      is_public: isPublic,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {initialData ? "Modifier l'avis" : "Donner votre avis"}
          </DialogTitle>
          <DialogDescription>
            {service && (
              <div className="mt-2 p-3 bg-gray-50 dark:bg-slate-700/50 rounded-lg">
                <p className="text-sm text-gray-500 dark:text-gray-400">Service</p>
                <p className="font-medium">{service.title}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  provider: {service.provider_name}
                </p>
              </div>
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Note globale */}
          <div className="space-y-2">
            <Label className="text-base font-medium">
              Note globale <span className="text-red-500">*</span>
            </Label>
            <div className="flex items-center gap-4">
              <StarRating
                rating={rating}
                size="lg"
                interactive
                onRatingChange={setRating}
              />
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {rating}/5
              </span>
            </div>
          </div>

          {/* Notes détaillées */}
          <div className="space-y-4">
            <Label className="text-base font-medium">Notes détaillées (optionnel)</Label>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm">Communication</Label>
                <StarRating
                  rating={communicationRating}
                  size="sm"
                  interactive
                  onRatingChange={setCommunicationRating}
                />
              </div>
              <div>
                <Label className="text-sm">Qualité du travail</Label>
                <StarRating
                  rating={qualityRating}
                  size="sm"
                  interactive
                  onRatingChange={setQualityRating}
                />
              </div>
              <div>
                <Label className="text-sm">Respect des délais</Label>
                <StarRating
                  rating={deadlineRating}
                  size="sm"
                  interactive
                  onRatingChange={setDeadlineRating}
                />
              </div>
              <div>
                <Label className="text-sm">Professionnalisme</Label>
                <StarRating
                  rating={professionalismRating}
                  size="sm"
                  interactive
                  onRatingChange={setProfessionalismRating}
                />
              </div>
            </div>
          </div>

          {/* Commentaire public */}
          <div className="space-y-2">
            <Label htmlFor="comment" className="text-base font-medium">
              Commentaire public <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Partagez votre expérience avec ce provider..."
              rows={4}
            />
            <p className="text-xs text-gray-500">
              {comment.length}/2000 caractères
            </p>
          </div>

          {/* Feedback privé */}
          <div className="space-y-2">
            <Label htmlFor="private" className="text-base font-medium">
              Feedback privé (optionnel)
            </Label>
            <Textarea
              id="private"
              value={privateFeedback}
              onChange={(e) => setPrivateFeedback(e.target.value)}
              placeholder="Informations supplémentaires visibles uniquement par le provider..."
              rows={3}
            />
            <p className="text-xs text-gray-500">
              Ce feedback ne sera visible que par le provider
            </p>
          </div>

          {/* Visibilité */}
          <div className="flex items-center space-x-2">
            <Switch
              id="public"
              checked={isPublic}
              onCheckedChange={setIsPublic}
            />
            <Label htmlFor="public" className="cursor-pointer">
              Rendre cet avis public
            </Label>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Annuler
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                {initialData ? "Modification..." : "Publication..."}
              </>
            ) : (
              initialData ? "Mettre à jour" : "Publier l'avis"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// Page principale
export default function CustomerReviewsPage() {
  const router = useRouter();
  const { user } = useAuth();
  
  // Utilisation du hook useReviews
  const {
    reviews: hookReviews,
    isLoading,
    error,
    stats: hookStats,
    isLoadingStats,
    createReview,
    isCreating,
    respondToReview,
    isResponding,
    markHelpful,
    isMarkingHelpful,
    refetch,
  } = useReviews(user?.id);

  // États locaux pour les filtres et l'affichage
  const [displayReviews, setDisplayReviews] = useState<Review[]>([]);
  const [displayStats, setDisplayStats] = useState<ReviewStats | null>(null);
  const [filters, setFilters] = useState<ReviewFiltersFormData>({
    page: 1,
    per_page: 10,
    role: "all",
    sort_by: "created_at",
    sort_order: "desc",
  });
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    per_page: 10,
    total_pages: 1,
  });
  
  // États pour les modales
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [selectedReview, setSelectedReview] = useState<Review | undefined>();
  const [selectedService, setSelectedService] = useState<{ id: number; title: string; provider_name: string } | undefined>();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState<Review | undefined>();

  // Utiliser les données mockées pour l'affichage
  useEffect(() => {
    // Filtrer selon le rôle
    let filteredReviews = [...mockReviews];
    if (filters.role === "client") {
      filteredReviews = mockReviews.filter(r => r.client_id === user?.id);
    } else if (filters.role === "provider") {
      filteredReviews = mockReviews.filter(r => r.provider_id === user?.id);
    }

    // Filtrer par note minimale
    if (filters.min_rating) {
      filteredReviews = filteredReviews.filter(r => r.rating >= (filters.min_rating || 0));
    }

    // Filtrer par présence de réponse
    if (filters.has_response !== undefined) {
      filteredReviews = filteredReviews.filter(r => 
        filters.has_response ? !!r.provider_response : !r.provider_response
      );
    }

    // Filtrer par recherche
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filteredReviews = filteredReviews.filter(r =>
        r.service_title.toLowerCase().includes(searchLower) ||
        r.comment.toLowerCase().includes(searchLower) ||
        (r.provider_name?.toLowerCase().includes(searchLower)) ||
        (r.client_name?.toLowerCase().includes(searchLower))
      );
    }

    // Trier
    filteredReviews.sort((a, b) => {
      const aValue = a[filters.sort_by as keyof Review] as any;
      const bValue = b[filters.sort_by as keyof Review] as any;
      
      if (filters.sort_order === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    // Pagination
    const start = ((filters.page || 1) - 1) * (filters.per_page || 10);
    const end = start + (filters.per_page || 10);
    const paginatedReviews = filteredReviews.slice(start, end);

    setDisplayReviews(paginatedReviews);
    setPagination({
      total: filteredReviews.length,
      page: filters.page ?? 1,
      per_page: filters.per_page || 10,
      total_pages: Math.ceil(filteredReviews.length / (filters.per_page ?? 10)),
    });

    // Calculer les statistiques
    const givenReviews = mockReviews.filter(r => r.client_id === user?.id);
    const receivedReviews = mockReviews.filter(r => r.provider_id === user?.id);
    const allUserReviews = [...givenReviews, ...receivedReviews];
    
    const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    allUserReviews.forEach(r => {
      distribution[r.rating as keyof typeof distribution] += 1;
    });

    setDisplayStats({
      total_reviews: allUserReviews.length,
      average_rating: allUserReviews.reduce((acc, r) => acc + r.rating, 0) / allUserReviews.length || 0,
      rating_distribution: distribution,
      response_rate: (receivedReviews.filter(r => r.provider_response).length / receivedReviews.length) * 100 || 0,
      average_response_time: 2.5,
      reviews_by_role: {
        as_client: givenReviews.length,
        as_provider: receivedReviews.length,
      },
      monthly_trend: 5,
    });

  }, [filters, user?.id]);

  // Gestionnaires d'événements
  const handleFilterChange = (newFilters: ReviewFiltersFormData) => {
    setFilters(newFilters);
  };

  const handleSearch = () => {
    // Déjà géré par le useEffect
  };

  const handlePageChange = (page: number) => {
    setFilters({ ...filters, page });
  };

  const handleCreateReview = () => {
    setSelectedService({
      id: 101,
      title: "Développement site e-commerce",
      provider_name: "Jean Paul",
    });
    setShowReviewForm(true);
  };

  const handleEditReview = (review: Review) => {
    setSelectedReview(review);
    setShowReviewForm(true);
  };

  const handleDeleteReview = (review: Review) => {
    setReviewToDelete(review);
    setShowDeleteDialog(true);
  };

  const handleSubmitReview = async ( data: CreateReviewFormData) => {
    try {
      // Utiliser la mutation du hook
      const serviceId = selectedService?.id || data.service_id;
      createReview({ serviceId, data });
      
      toast.success(selectedReview ? "Avis modifié avec succès" : "Avis publié avec succès");
      setShowReviewForm(false);
      setSelectedReview(undefined);
      setSelectedService(undefined);
      
      // Rafraîchir les données
      refetch();
    } catch (error) {
      toast.error("Une erreur est survenue");
    }
  };

  const handleRespondToReview = async (review: Review, response: string) => {
    try {
      await respondToReview({ reviewId: review.id, response });
      toast.success("Réponse envoyée avec succès");
    } catch (error) {
      toast.error("Impossible d'envoyer la réponse");
    }
  };

  const handleMarkHelpful = async (reviewId: number) => {
    try {
      await markHelpful(reviewId);
    } catch (error) {
      toast.error("Impossible de voter");
    }
  };

  const handleConfirmDelete = async () => {
    if (!reviewToDelete) return;
    
    try {
      // TODO: Implémenter la suppression dans le hook
      toast.success("Avis supprimé avec succès");
      setShowDeleteDialog(false);
      setReviewToDelete(undefined);
    } catch (error) {
      toast.error("Impossible de supprimer l'avis");
    }
  };

  if (isLoading && !displayReviews.length) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 space-y-6">
      {/* En-tête */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <Star className="w-8 h-8 text-yellow-400 fill-yellow-400" />
            Avis et évaluations
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Gérez tous vos avis donnés et reçus
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => refetch()}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Actualiser
          </Button>
          <Button onClick={handleCreateReview}>
            <Plus className="w-4 h-4 mr-2" />
            Donner mon avis
          </Button>
        </div>
      </div>

      {/* Statistiques */}
      {displayStats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <StatsCard
            title="Total avis"
            value={displayStats.total_reviews}
            subValue={`${displayStats.reviews_by_role.as_client} donnés, ${displayStats.reviews_by_role.as_provider} reçus`}
            icon={MessageSquare}
            color="bg-blue-500"
          />
          <StatsCard
            title="Note moyenne"
            value={displayStats.average_rating.toFixed(1)}
            subValue="sur 5 étoiles"
            icon={Star}
            color="bg-yellow-500"
            trend={{ value: displayStats.monthly_trend || 0, direction: "up" }}
          />
          <StatsCard
            title="Taux de réponse"
            value={`${displayStats.response_rate.toFixed(0)}%`}
            subValue="avis avec réponse"
            icon={Reply}
            color="bg-green-500"
            trend={{ value: 2, direction: "up" }}
          />
          <StatsCard
            title="Délai moyen réponse"
            value={`${displayStats.average_response_time?.toFixed(1) || 0}h`}
            subValue="après l'avis"
            icon={Clock}
            color="bg-purple-500"
            trend={{ value: 10, direction: "down" }}
          />
        </div>
      )}

      {/* Distribution des notes */}
      {displayStats && (
        <RatingDistribution distribution={displayStats.rating_distribution} />
      )}

      {/* Filtres */}
      <ReviewFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onSearch={handleSearch}
      />

      {/* Tabs pour les avis donnés/reçus */}
      <Tabs
        value={filters.role}
        onValueChange={(value) =>
          setFilters({
            ...filters,
            role: value === "all" ? undefined : value as "client" | "provider",
            page: 1,
          })
        }
        className="space-y-4"
      >
        <TabsList className="bg-gray-100 dark:bg-slate-700 p-1">
          <TabsTrigger value="all">Tous les avis</TabsTrigger>
          <TabsTrigger value="client">Avis donnés</TabsTrigger>
          <TabsTrigger value="provider">Avis reçus</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {displayReviews.length === 0 ? (
            <Card className="bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-gray-200 dark:border-slate-700">
              <CardContent className="p-12 text-center">
                <MessageSquare className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  Aucun avis trouvé
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  Vous n'avez pas encore d'avis. Commencez par donner votre avis sur un service.
                </p>
                <Button onClick={handleCreateReview}>
                  <Plus className="w-4 h-4 mr-2" />
                  Donner mon avis
                </Button>
              </CardContent>
            </Card>
          ) : (
            displayReviews.map((review) => (
              <ReviewCard
                key={review.id}
                review={review}
                type={review.client_id === user?.id ? "given" : "received"}
                onEdit={review.client_id === user?.id ? handleEditReview : undefined}
                onDelete={review.client_id === user?.id ? handleDeleteReview : undefined}
                onRespond={review.provider_id === user?.id ? handleRespondToReview : undefined}
                onMarkHelpful={handleMarkHelpful}
              />
            ))
          )}
        </TabsContent>

        <TabsContent value="client" className="space-y-4">
          {displayReviews.filter(r => r.client_id === user?.id).length === 0 ? (
            <Card className="bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-gray-200 dark:border-slate-700">
              <CardContent className="p-12 text-center">
                <Edit className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  Aucun avis donné
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  Vous n'avez pas encore donné d'avis. Partagez votre expérience avec les providers.
                </p>
                <Button onClick={handleCreateReview}>
                  <Plus className="w-4 h-4 mr-2" />
                  Donner mon avis
                </Button>
              </CardContent>
            </Card>
          ) : (
            displayReviews
              .filter(r => r.client_id === user?.id)
              .map((review) => (
                <ReviewCard
                  key={review.id}
                  review={review}
                  type="given"
                  onEdit={handleEditReview}
                  onDelete={handleDeleteReview}
                  onMarkHelpful={handleMarkHelpful}
                />
              ))
          )}
        </TabsContent>

        <TabsContent value="provider" className="space-y-4">
          {displayReviews.filter(r => r.provider_id === user?.id).length === 0 ? (
            <Card className="bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-gray-200 dark:border-slate-700">
              <CardContent className="p-12 text-center">
                <Star className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  Aucun avis reçu
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Vous n'avez pas encore reçu d'avis. Les avis apparaîtront ici après la réalisation de services.
                </p>
              </CardContent>
            </Card>
          ) : (
            displayReviews
              .filter(r => r.provider_id === user?.id)
              .map((review) => (
                <ReviewCard
                  key={review.id}
                  review={review}
                  type="received"
                  onRespond={handleRespondToReview}
                  onMarkHelpful={handleMarkHelpful}
                />
              ))
          )}
        </TabsContent>
      </Tabs>

      {/* Pagination */}
      {pagination.total_pages > 1 && (
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-4 mt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border border-gray-200 dark:border-slate-700">
          <div className="text-sm text-gray-700 dark:text-gray-300">
            Affichage de{" "}
            <span className="font-medium">
              {(pagination.page - 1) * pagination.per_page + 1}
            </span>{" "}
            à{" "}
            <span className="font-medium">
              {Math.min(pagination.page * pagination.per_page, pagination.total)}
            </span>{" "}
            sur{" "}
            <span className="font-medium">{pagination.total}</span> résultats
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => handlePageChange(1)}
              disabled={pagination.page === 1}
            >
              <ChevronsLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-medium">
              {pagination.page} / {pagination.total_pages}
            </span>
            <Button
              variant="outline"
              size="icon"
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page === pagination.total_pages}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => handlePageChange(pagination.total_pages)}
              disabled={pagination.page === pagination.total_pages}
            >
              <ChevronsRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Formulaire d'avis */}
      <ReviewForm
        open={showReviewForm}
        onClose={() => {
          setShowReviewForm(false);
          setSelectedReview(undefined);
          setSelectedService(undefined);
        }}
        onSubmit={handleSubmitReview}
        initialData={selectedReview}
        service={selectedService}
        isSubmitting={isCreating}
      />

      {/* Dialogue de confirmation suppression */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr de vouloir supprimer cet avis ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. L'avis sera définitivement supprimé et ne pourra pas être récupéré.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Indicateur de chargement pour les actions */}
      {(isCreating || isResponding || isMarkingHelpful) && (
        <div className="fixed bottom-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Traitement en cours...</span>
        </div>
      )}
    </div>
  );
}
