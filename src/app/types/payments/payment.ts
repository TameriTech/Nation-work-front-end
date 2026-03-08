// ============================================================================
// TYPES POUR LES PAIEMENTS
// ============================================================================

export interface Payment {
  id: string;
  service_id: number;
  service_title: string;
  client: {
    id: number;
    name: string;
  };
  client_id: number;
  freelancer?: {
    id: number;
    name: string;
  } | null;
  freelancer_id?: number | null;
  amount: number;
  platform_fee: number;
  freelancer_payout: number | null;
  status: "pending" | "paid" | "escrow" | "refunded" | "failed";
  payment_method: "card" | "mobile_money" | "cash" | "bank_transfer";
  transaction_id?: string;
  payment_intent_id?: string;
  paid_at?: string;
  created_at: string;
  updated_at?: string;
  refund_reason?: string;
  refunded_at?: string;
  escrow_release_date?: string;
  notes?: string;
}

export interface PaymentHistory {
  id: number;
  transaction_id: string;
  type: 'payment' | 'withdrawal' | 'refund' | 'fee';
  amount: number;
  status: 'completed' | 'pending' | 'failed';
  method: string;
  description: string;
  created_at: string;
  service_id?: number;
  service_title?: string;
}

export interface PaymentSummary {
  total_revenue: number;
  platform_fees: number;
  pending_payouts: number;
  monthly_revenue: number;
  monthly_growth: number;
  by_status: {
    pending: number;
    paid: number;
    escrow: number;
    refunded: number;
    failed: number;
  };
  by_method: {
    card: number;
    mobile_money: number;
    cash: number;
    bank_transfer: number;
  };
}

export interface PaymentFilters {
  status?: string;
  method?: string;
  client_id?: number;
  freelancer_id?: number;
  date_from?: string;
  date_to?: string;
  min_amount?: number;
  max_amount?: number;
  search?: string;
  page?: number;
  per_page?: number;
  sort_by?: string;
  sort_order?: "asc" | "desc";
}

export interface PaymentProps {
  id: number;
  issue_date: string;
  bill_number: string;
  amount: number;
  job: {
    provider: string;
    avatar?: string;
    title: string;
  };
  status: "canceled" | "paid" | "pending";
}
