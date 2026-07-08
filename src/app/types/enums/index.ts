// src/app/types/enums/index.ts

export enum UserRole {
  GUEST = "guest",
  CLIENT = "client",
  PROVIDER = "provider",
  ADMIN = "admin",
  SUPER_ADMIN = "super_admin",
  MODERATOR = "moderator"
}

export enum SkillLevel {
  BEGINNER = "beginner",
  INTERMEDIATE = "intermediate",
  ADVANCED = "advanced",
  EXPERT = "expert"
}

export enum SkillType {
  TECHNICAL = "technical",
  PROFESSIONAL = "professional",
  LANGUAGE = "language",
  SOFT = "soft",
  TOOL = "tool"
}

export enum SkillStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
  DEPRECATED = "deprecated"
}

export enum EmploymentType {
  FULL_TIME = "full_time",
  PART_TIME = "part_time",
  CONTRACT = "contract",
  INTERNSHIP = "internship",
  FREELANCE = "freelance"
}

export enum DocumentType {
  ID_CARD = "id_card",
  PASSPORT = "passport",
  DRIVER_LICENSE = "driver_license",
  DIPLOMA = "diploma",
  CERTIFICATE = "certificate",
  PROFESSIONAL_CARD = "professional_card",
  RESIDENCE_PERMIT = "residence_permit",
  OTHER = "other"
}

export enum DocumentStatus {
  PENDING = "pending",
  VERIFIED = "verified",
  REJECTED = "rejected",
  EXPIRED = "expired"
}

export enum BlockReason {
  FRAUD = "fraud",
  HARASSMENT = "harassment",
  INAPPROPRIATE_CONTENT = "inappropriate_content",
  SPAM = "spam",
  MULTIPLE_WARNINGS = "multiple_warnings",
  NON_PAYMENT = "non_payment",
  ABANDONED_SERVICES = "abandoned_services",
  FAKE_REVIEWS = "fake_reviews",
  TERMS_VIOLATION = "terms_violation",
  OTHER = "other"
}

export enum BlockAction {
  BLOCK = "block",
  UNBLOCK = "unblock"
}

export enum NotificationPriority {
  LOW = "low",
  NORMAL = "normal",
  HIGH = "high",
  URGENT = "urgent"
}

export enum NotificationChannel {
  IN_APP = "in_app",
  EMAIL = "email",
  PUSH = "push",
  SMS = "sms"
}

export enum VerificationLevel {
  NONE = "none",
  BASIC = "basic",
  ADVANCED = "advanced",
  PREMIUM = "premium"
}

// ==================== ENUMS ====================
export enum MissionType {
  HOURLY = "hourly",      // Prestation avec date/heure précise
  PROJECT = "project"
}

export enum DurationUnit {
  MINUTES = "minutes",
  HOURS = "hours",
  DAYS = "days",
  WEEKS = "weeks",
  MONTHS = "months"
}



export enum MissionStatus {
  OPEN = 'open',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export enum MissionUrgency {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
}


export enum PaymentType {
  FIXED = "fixed",
  HOURLY = "hourly",
  MILESTONE = "milestone"
}

export enum LocationType {
  ONSITE = "onsite",
  REMOTE = "remote",
  HYBRID = "hybrid"
}


export enum CandidatureStatus {
  PENDING = "pending",
  SHORTLISTED = "shortlisted",
  ACCEPTED = "accepted",
  REJECTED = "rejected",
  WITHDRAWN = "withdrawn",
  EXPIRED = "expired"
}



export enum DisputeStatus {
  OPEN = "open",
  UNDER_REVIEW = "under_review",
  IN_PROGRESS = "in_progress",
  RESOLVED = "resolved",
  DISMISSED = "dismissed",
  ESCALATED = "escalated",
  APPEALED = "appealed"
}

export enum DisputePriority {
  LOW = "low",
  NORMAL = "normal",
  HIGH = "high",
  URGENT = "urgent",
  CRITICAL = "critical"
}

export enum DisputeOutcome {
  IN_FAVOR_OF_RAISER = "in_favor_of_raiser",
  IN_FAVOR_OF_AGAINST = "in_favor_of_against",
  COMPROMISE = "compromise",
  DISMISSED = "dismissed",
  OTHER = "other"
}

export enum DisputeResolutionMethod {
  MEDIATION = "mediation",
  ARBITRATION = "arbitration",
  ADMIN_DECISION = "admin_decision",
  MUTUAL_AGREEMENT = "mutual_agreement",
  AUTOMATIC = "automatic"
}

export enum DisputeEscalationReason {
  UNSATISFACTORY_RESOLUTION = "unsatisfactory_resolution",
  NO_RESPONSE = "no_response",
  NEW_EVIDENCE = "new_evidence",
  UNFAIR_TREATMENT = "unfair_treatment",
  TECHNICAL_ISSUE = "technical_issue",
  ADMIN_UNRESPONSIVE = "admin_unresponsive",
  POLICY_VIOLATION = "policy_violation",
  FRAUD_SUSPECTED = "fraud_suspected",
  OTHER = "other"
}

export enum DisputeEscalationLevel {
  LEVEL_1 = "level_1",
  LEVEL_2 = "level_2",
  LEVEL_3 = "level_3",
  LEGAL = "legal"
}

export enum MessageType {
  TEXT = "text",
  SYSTEM = "system",
  EVIDENCE_REQUEST = "evidence_request",
  EVIDENCE_SUBMISSION = "evidence_submission",
  RESOLUTION_PROPOSAL = "resolution_proposal",
  ADMIN_NOTE = "admin_note"
}


export enum PaymentStatus {
  PENDING = "pending",
  PROCESSING = "processing",
  PAID = "paid",
  FAILED = "failed",
  CANCELLED = "cancelled",
  REFUNDED = "refunded",
  PARTIALLY_REFUNDED = "partially_refunded",
  DISPUTED = "disputed",
  ON_HOLD = "on_hold"
}

export enum PaymentMethod {
  CASH = "cash",
  CARD = "card",
  MOBILE_MONEY = "mobile_money",
  BANK_TRANSFER = "bank_transfer",
  ESCROW = "escrow",
  WALLET = "wallet",
  CRYPTO = "crypto"
}

export enum TransactionType {
  PAYMENT = "payment",
  REFUND = "refund",
  PARTIAL_REFUND = "partial_refund",
  PLATFORM_FEE = "platform_fee",
  provider_PAYOUT = "provider_payout",
  ESCROW_RELEASE = "escrow_release",
  CHARGEBACK = "chargeback",
  ADJUSTMENT = "adjustment"
}

export enum PayoutStatus {
  PENDING = "pending",
  PROCESSING = "processing",
  COMPLETED = "completed",
  FAILED = "failed",
  CANCELLED = "cancelled"
}


export enum NotificationType {
  INFO = "info",
  SUCCESS = "success",
  WARNING = "warning",
  ERROR = "error",
  CHAT = "chat",
  SERVICE = "service",
  PAYMENT = "payment",
  REVIEW = "review",
  DISPUTE = "dispute",
  SYSTEM = "system",
  WELCOME = "welcome",
  REMINDER = "reminder",
  PROMOTION = "promotion"
}


// ==================== ENUMS ====================

export enum MediaType {
  IMAGE = "image",
  VIDEO = "video",
  AUDIO = "audio",
  DOCUMENT = "document",
  FILE = "file"
}

export enum ReactionType {
  LIKE = "👍",
  LOVE = "❤️",
  HAHA = "😄",
  WOW = "😮",
  SAD = "😢",
  ANGRY = "😠"
}

export enum MessageStatus {
  SENDING = "sending",
  SENT = "sent",
  DELIVERED = "delivered",
  READ = "read",
  FAILED = "failed"
}


export enum AttachmentType {
  IMAGE = "image",
  VIDEO = "video",
  AUDIO = "audio",
  DOCUMENT = "document",
  SPREADSHEET = "spreadsheet",
  PRESENTATION = "presentation",
  ARCHIVE = "archive",
  CODE = "code",
  FILE = "file"
}
