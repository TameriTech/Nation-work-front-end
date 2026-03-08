// ============================================================================
// TYPES POUR L'ACTIVITÉ RÉCENTE
// ============================================================================

export interface RecentActivity {
  id: string;
  type: 'user_registration' | 'service_created' | 'payment_received' | 'dispute_opened' | 'verification_pending';
  user?: {
    name: string;
    role: string;
    avatar?: string;
  };
  service?: {
    id: number;
    title: string;
  };
  payment?: {
    id: string;
    amount: number;
  };
  dispute?: {
    id: string;
  };
  description: string;
  timestamp: string;
  time_ago: string;
}
