import { Mission } from "../missions";

export interface Wallet {
  id: string;
  user_id: string;
  balance: number;
  currency: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Payment {
  id: string;
  user_id: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  payment_method: string;
  invoice_number: string;
  platform_fee: number;
  provider_payout: number;
  refund_amount: number;
  refund_reason?: string;
  service_id?: string;
  service?: Mission;
  transactions?: PaymentTransaction[];
  created_at: string;
  updated_at: string;
}

export interface PaymentTransaction {
  id: string;
  payment_id: string;
  amount: number;
  type: 'charge' | 'refund' | 'fee';
  status: 'pending' | 'completed' | 'failed';
  transaction_id: string;
  created_at: string;
}
