// ============================================================================
// TYPES POUR LES LOGS ET ACTIVITÉS
// ============================================================================

export interface ActivityLog {
  id: number | string;
  action: string;
  type: 'auth' | 'service' | 'payment' | 'profile' | 'security' | 'dispute' | 'admin';
  description: string;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
  details?: Record<string, any>;
  
  // Pour les logs admin
  admin?: {
    id: number;
    name: string;
  };
  target_type?: string;
  target_id?: number | string;
  target_name?: string;
}
