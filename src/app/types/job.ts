export type JobStatus = "completed" | "canceled" | "inProgress";

export interface JobCardProps {
    id: number;
  title: string;
  price: string;
  duration: string;
  status?: JobStatus;
  showRate?: boolean;
  type: string;
  description: string;
  skills: string[];
  location: string;
  rating?: number;
  postedDate: string;
  avatarUrl?: string;
  isVerified?: boolean;
  isFavorite?: boolean;
  onFavoriteClick?: () => void;
}
