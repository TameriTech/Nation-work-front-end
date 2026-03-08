// ============================================================================
// TYPES POUR LES PAIEMENTS AUX FREELANCERS
// ============================================================================

export interface Payout {
  id: string;
  freelancer: {
    id: number;
    name: string;
    avatar?: string;
  };
  amount: number;
  period: string;
  method: "bank_transfer" | "mobile_money" | "paypal";
  status: "pending" | "processed" | "paid" | "failed";
  requested_at: string;
  processed_at?: string;
  paid_at?: string;
  transaction_id?: string;
  notes?: string;
  bank_details?: {
    bank_name: string;
    account_number: string;
    iban?: string;
    bic?: string;
  };
}

export interface PayoutFilters {
  status?: string;
  method?: string;
  freelancer_id?: number;
  date_from?: string;
  date_to?: string;
  page?: number;
  per_page?: number;
  sort_by?: string;
  sort_order?: "asc" | "desc";
  search?: string;
}
