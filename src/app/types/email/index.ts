// src/app/types/email/index.ts

export interface EmailTemplate {
  id: number;
  name: string;
  subject: string;
  body: string;
  variables: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface EmailSendRequest {
  to: string | string[];
  cc?: string[];
  bcc?: string[];
  subject: string;
  template?: string;
  variables?: Record<string, any>;
  attachments?: Array<{
    filename: string;
    content: string;
    encoding?: string;
  }>;
}

export interface EmailLog {
  id: number;
  from: string;
  to: string[];
  subject: string;
  status: 'sent' | 'failed' | 'pending';
  error?: string;
  openedAt?: string;
  clickedAt?: string;
  createdAt: string;
}

export interface EmailStats {
  total: number;
  sent: number;
  failed: number;
  openRate: number;
  clickRate: number;
  byTemplate: Record<string, number>;
}
