// src/app/types/settings/index.ts
import { Language, Currency, Theme, NotificationSetting } from '../enums';

export interface UserSettings {
  userId: number;
  language: Language;
  currency: Currency;
  theme: Theme;
  timezone: string;
  dateFormat: string;
  timeFormat: '12h' | '24h';
  notifications: NotificationSettings;
  privacy: PrivacySettings;
}

export interface NotificationSettings {
  email: boolean;
  push: boolean;
  sms: boolean;
  inApp: boolean;
  marketing: boolean;
  serviceUpdates: boolean;
  paymentUpdates: boolean;
  chatMessages: boolean;
  reviewNotifications: boolean;
  disputeNotifications: boolean;
}

export interface PrivacySettings {
  showProfile: boolean;
  showEmail: boolean;
  showPhone: boolean;
  showLocation: boolean;
  showEarnings: boolean;
  showActivity: boolean;
}

export interface PlatformSettings {
  siteName: string;
  siteUrl: string;
  supportEmail: string;
  noreplyEmail: string;
  platformFee: number;
  minPayoutAmount: number;
  maxDisputeDays: number;
  maintenanceMode: boolean;
  features: Record<string, boolean>;
}

export interface SecuritySettings {
  twoFactorRequired: boolean;
  passwordMinLength: number;
  sessionTimeout: number;
  maxLoginAttempts: number;
  ipWhitelist?: string[];
  allowedDomains?: string[];
}
