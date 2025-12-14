export interface Candidature {
  id: string;
  offerTitle: string;
  offerStatus: "draft" | "published" | "closed" | "canceled" | "pending";
  provider?: {
    name: string;
    phone: string;
    avatar?: string;
  };
  candidacyDate: string;
  averageNote: number;
  candidacyStatus: "pending" | "accepted" | "rejected";
  amount: string;
}