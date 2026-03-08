// ============================================================================
// TYPES POUR LES PARAMÈTRES ADMIN
// ============================================================================

export interface GeneralSettings {
  site_name: string;
  site_url: string;
  contact_email: string;
  support_email: string;
  default_language: string;
  timezone: string;
  maintenance_mode: boolean;
}

export interface FeeSettings {
  platform_fee_percentage: number;
  minimum_fee: number;
  maximum_fee: number;
  withdrawal_fee: number;
  escrow_fee_percentage: number;
}

export interface TimingSettings {
  client_validation_hours: number;
  dispute_opening_days: number;
  payout_processing_days: number;
  auto_accept_candidature_hours: number;
  session_timeout_minutes: number;
}

export interface ThresholdSettings {
  min_profile_completion: number;
  min_freelancer_rating: number;
  max_disputes_before_suspension: number;
  auto_suspend_after_inactivity_days: number;
}
