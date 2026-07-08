
import type { DashboardStats, RecentActivity, ChartData, PerformanceMetrics, ReportStats, RevenueData, ServicesByCategory, ServicesByStatus, Topprovider, ActivityData, GeographicDistribution, DisputeStats, Dispute } from "@/app/types/admin";
  import type {
  Payment,
  PaymentSummary,
  Payout,
} from "@/app/types/admin";

export const dashboard = {
  stats: {
    users: {
      total: 1234,
      new: 45,
      growth: 12,
      breakdown: {
        clients: 876,
        providers: 345,
        admins: 13
      }
    },
    services: {
      total: 567,
      active: 234,
      completed: 298,
      cancelled: 35,
      growth: 8
    },
    payments: {
      total_amount: 45678.50,
      platform_fees: 4567.85,
      pending_payouts: 2345.60,
      growth: 15
    },
    disputes: {
      open: 12,
      resolved: 45,
      escalated: 3,
      change: -2
    }
  } as DashboardStats,
  
  recent_activities: [
    {
      id: "ACT001",
      type: "user_registration",
      user: {
        name: "Jean Dupont",
        role: "provider",
        avatar: "https://randomuser.me/api/portraits/men/1.jpg"
      },
      description: "Nouvelle inscription",
      timestamp: "2026-02-16T09:30:00Z",
      time_ago: "il y a 5 minutes"
    },
    {
      id: "ACT002",
      type: "service_created",
      service: {
        id: 1234,
        title: "Réparation fuite d'eau"
      },
      user: {
        name: "Marie Lambert",
        role: "client"
      },
      description: "Nouvelle mission créée",
      timestamp: "2026-02-16T09:23:00Z",
      time_ago: "il y a 12 minutes"
    },
    {
      id: "ACT003",
      type: "payment_received",
      payment: {
        id: "INV001",
        amount: 150.00
      },
      service: {
        id: 1234,
        title: "Cours de piano"
      },
      description: "Paiement reçu",
      timestamp: "2026-02-16T09:10:00Z",
      time_ago: "il y a 25 minutes"
    },
    {
      id: "ACT004",
      type: "dispute_opened",
      dispute: {
        id: "DIS001"
      },
      service: {
        id: 1235,
        title: "Jardinage"
      },
      user: {
        name: "Pierre Moreau",
        role: "client"
      },
      description: "Litige ouvert",
      timestamp: "2026-02-16T08:45:00Z",
      time_ago: "il y a 1 heure"
    },
    {
      id: "ACT005",
      type: "verification_pending",
      user: {
        name: "Sophie Bernard",
        role: "provider"
      },
      description: "Document en attente de vérification",
      timestamp: "2026-02-16T08:30:00Z",
      time_ago: "il y a 2 heures"
    }
  ] as RecentActivity[],
  
  charts: {
    registrations: {
      labels: ["01/02", "02/02", "03/02", "04/02", "05/02", "06/02", "07/02", "08/02", "09/02", "10/02", "11/02", "12/02", "13/02", "14/02", "15/02"],
      data: [12, 15, 18, 14, 22, 25, 30, 28, 32, 35, 38, 42, 45, 40, 48]
    },
    service_status: {
      labels: ["Publiées", "Assignées", "En cours", "Terminées", "Annulées"],
      data: [145, 89, 123, 298, 35],
      colors: ["#3b82f6", "#8b5cf6", "#f59e0b", "#10b981", "#ef4444"]
    },
    revenue: {
      labels: ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin", "Juil", "Août", "Sep", "Oct", "Nov", "Déc"],
      data: [12500, 14800, 16200, 15800, 17900, 19200, 20500, 21800, 23400, 25100, 26800, 28900]
    }
  } as ChartData
};

export const users = {
  "list": [
    {
      "id": 1001,
      "email": "jean.dupont@email.com",
      "username": "Jean Dupont",
      "role": "client",
      "status": "active",
      "is_verified": true,
      "phone": "+33 6 12 34 56 78",
      "avatar": "https://randomuser.me/api/portraits/men/2.jpg",
      "created_at": "2026-01-15T10:30:00Z",
      "last_login": "2026-02-15T14:20:00Z",
      "stats": {
        "services_posted": 5,
        "total_spent": 750.00,
        "average_rating": 4.8
      }
    },
    {
      "id": 1002,
      "email": "marie.martin@email.com",
      "username": "Marie Martin",
      "role": "provider",
      "status": "active",
      "is_verified": true,
      "verified_badge": true,
      "phone": "+33 6 23 45 67 89",
      "avatar": "https://randomuser.me/api/portraits/women/3.jpg",
      "created_at": "2026-01-10T09:15:00Z",
      "last_login": "2026-02-15T18:30:00Z",
      "stats": {
        "services_completed": 12,
        "total_earned": 1850.00,
        "average_rating": 4.9,
        "response_rate": 98,
        "completion_rate": 100
      }
    },
    {
      "id": 1003,
      "email": "pierre.leroy@email.com",
      "username": "Pierre Leroy",
      "role": "provider",
      "status": "suspended",
      "is_verified": false,
      "suspension_reason": "Non-paiement des frais",
      "suspended_until": "2026-03-01",
      "phone": "+33 6 34 56 78 90",
      "avatar": "https://randomuser.me/api/portraits/men/4.jpg",
      "created_at": "2025-12-05T14:20:00Z",
      "last_login": "2026-02-10T11:45:00Z",
      "stats": {
        "services_completed": 8,
        "total_earned": 1250.00,
        "average_rating": 4.2
      }
    },
    {
      "id": 1004,
      "email": "sophie.bernard@email.com",
      "username": "Sophie Bernard",
      "role": "provider",
      "status": "pending_verification",
      "is_verified": false,
      "phone": "+33 6 45 67 89 01",
      "avatar": "https://randomuser.me/api/portraits/women/5.jpg",
      "created_at": "2026-02-14T16:45:00Z",
      "last_login": "2026-02-14T16:45:00Z",
      "pending_documents": ["cni", "diplome"]
    },
    {
      "id": 1005,
      "email": "thomas.petit@email.com",
      "username": "Thomas Petit",
      "role": "client",
      "status": "inactive",
      "is_verified": true,
      "phone": "+33 6 56 78 90 12",
      "avatar": "https://randomuser.me/api/portraits/men/6.jpg",
      "created_at": "2026-01-20T11:30:00Z",
      "last_login": "2026-02-01T09:20:00Z"
    },
    {
      "id": 1006,
      "email": "emilie.dubois@email.com",
      "username": "Emilie Dubois",
      "role": "provider",
      "status": "active",
      "is_verified": true,
      "verified_badge": true,
      "top_rated": true,
      "phone": "+33 6 67 89 01 23",
      "avatar": "https://randomuser.me/api/portraits/women/7.jpg",
      "created_at": "2025-11-15T08:00:00Z",
      "last_login": "2026-02-15T20:15:00Z",
      "stats": {
        "services_completed": 45,
        "total_earned": 6750.00,
        "average_rating": 4.95,
        "response_rate": 100,
        "completion_rate": 100
      }
    },
    {
      "id": 1007,
      "email": "nicolas.robert@email.com",
      "username": "Nicolas Robert",
      "role": "admin",
      "status": "active",
      "is_verified": true,
      "admin_role": "super_admin",
      "phone": "+33 6 78 90 12 34",
      "avatar": "https://randomuser.me/api/portraits/men/8.jpg",
      "created_at": "2025-10-01T09:00:00Z",
      "last_login": "2026-02-16T08:30:00Z"
    }
  ],
  "pending_verifications": [
    {
      "id": 2001,
      "user_id": 1004,
      "user_name": "Sophie Bernard",
      "document_type": "cni",
      "document_number": "CNI123456789",
      "front_image": "/mock/documents/cni_front.jpg",
      "back_image": "/mock/documents/cni_back.jpg",
      "submitted_at": "2026-02-14T16:50:00Z",
      "status": "pending"
    },
    {
      "id": 2002,
      "user_id": 1004,
      "user_name": "Sophie Bernard",
      "document_type": "diplome",
      "document_number": "DIP2025-123",
      "front_image": "/mock/documents/diplome.jpg",
      "submitted_at": "2026-02-14T16:52:00Z",
      "status": "pending"
    },
    {
      "id": 2003,
      "user_id": 1008,
      "user_name": "Lucas Moreau",
      "document_type": "passport",
      "document_number": "PASS987654321",
      "front_image": "/mock/documents/passport.jpg",
      "submitted_at": "2026-02-15T10:15:00Z",
      "status": "pending"
    }
  ]
};

export const services = {
  "list": [
    {
      "id": 10001,
      "title": "Réparation fuite d'eau",
      "short_description": "Fuite sous l'évier de la cuisine",
      "category": "Plomberie",
      "status": "published",
      "client": {
        "id": 1001,
        "name": "Jean Dupont",
        "avatar": "https://randomuser.me/api/portraits/men/2.jpg"
      },
      "provider": null,
      "date": "2026-02-20T14:00:00Z",
      "address": "15 rue de Paris, 75001 Paris",
      "budget": 150.00,
      "candidatures_count": 3,
      "created_at": "2026-02-16T08:00:00Z",
      "priority": "normal"
    },
    {
      "id": 10002,
      "title": "Cours de piano pour débutant",
      "short_description": "Cours pour enfant de 8 ans",
      "category": "Musique",
      "status": "assigned",
      "client": {
        "id": 1005,
        "name": "Thomas Petit",
        "avatar": "https://randomuser.me/api/portraits/men/6.jpg"
      },
      "provider": {
        "id": 1006,
        "name": "Emilie Dubois",
        "avatar": "https://randomuser.me/api/portraits/women/7.jpg"
      },
      "date": "2026-02-18T16:30:00Z",
      "address": "8 rue des Lilas, 69002 Lyon",
      "budget": 50.00,
      "candidatures_count": 5,
      "created_at": "2026-02-14T10:30:00Z"
    },
    {
      "id": 10003,
      "title": "Nettoyage appartement 70m²",
      "short_description": "Ménage complet, 3 pièces",
      "category": "Ménage",
      "status": "in_progress",
      "client": {
        "id": 1009,
        "name": "Claire Fontaine",
        "avatar": null
      },
      "provider": {
        "id": 1002,
        "name": "Marie Martin",
        "avatar": "https://randomuser.me/api/portraits/women/3.jpg"
      },
      "date": "2026-02-16T09:00:00Z",
      "address": "25 rue de la République, 13001 Marseille",
      "budget": 120.00,
      "candidatures_count": 2,
      "created_at": "2026-02-10T14:15:00Z"
    },
    {
      "id": 10004,
      "title": "Réparation ordinateur",
      "short_description": "PC qui ne démarre plus",
      "category": "Informatique",
      "status": "completed",
      "client": {
        "id": 1010,
        "name": "Michel Blanc",
        "avatar": null
      },
      "provider": {
        "id": 1006,
        "name": "Emilie Dubois",
        "avatar": "https://randomuser.me/api/portraits/women/7.jpg"
      },
      "date": "2026-02-15T10:00:00Z",
      "completed_at": "2026-02-15T12:30:00Z",
      "address": "42 avenue Victor Hugo, 75016 Paris",
      "budget": 80.00,
      "candidatures_count": 4,
      "created_at": "2026-02-12T09:45:00Z",
      "rating": {
        "score": 5,
        "comment": "Excellent travail, rapide et efficace"
      }
    },
    {
      "id": 10005,
      "title": "Jardinage - Taille de haies",
      "short_description": "Taille de 50m de haies",
      "category": "Jardinage",
      "status": "cancelled",
      "client": {
        "id": 1001,
        "name": "Jean Dupont",
        "avatar": "https://randomuser.me/api/portraits/men/2.jpg"
      },
      "provider": {
        "id": 1003,
        "name": "Pierre Leroy",
        "avatar": "https://randomuser.me/api/portraits/men/4.jpg"
      },
      "date": "2026-02-10T08:00:00Z",
      "cancelled_at": "2026-02-09T16:20:00Z",
      "cancellation_reason": "Indisponibilité du provider",
      "address": "5 chemin des Bois, 69100 Villeurbanne",
      "budget": 200.00,
      "candidatures_count": 2,
      "created_at": "2026-02-05T11:30:00Z"
    },
    {
      "id": 10006,
      "title": "Déménagement studio",
      "short_description": "Aide pour déménagement, pas de meubles lourds",
      "category": "Déménagement",
      "status": "disputed",
      "client": {
        "id": 1011,
        "name": "Sophie Martin",
        "avatar": null
      },
      "provider": {
        "id": 1003,
        "name": "Pierre Leroy",
        "avatar": "https://randomuser.me/api/portraits/men/4.jpg"
      },
      "date": "2026-02-14T13:00:00Z",
      "address": "12 rue du Bac, 75007 Paris",
      "budget": 180.00,
      "candidatures_count": 3,
      "created_at": "2026-02-08T15:20:00Z",
      "dispute": {
        "id": "DIS001",
        "reason": "Travail non conforme",
        "opened_by": "client",
        "opened_at": "2026-02-15T10:30:00Z"
      }
    }
  ],
  "categories": [
    {
      "id": 1,
      "name": "Plomberie",
      "description": "Travaux de plomberie et dépannage",
      "icon": "🔧",
      "color": "#3b82f6",
      "is_active": true,
      "services_count": 45,
      "providers_count": 23,
      "average_price": 150.00
    },
    {
      "id": 2,
      "name": "Électricité",
      "description": "Installations et réparations électriques",
      "icon": "⚡",
      "color": "#f59e0b",
      "is_active": true,
      "services_count": 32,
      "providers_count": 18,
      "average_price": 180.00
    },
    {
      "id": 3,
      "name": "Ménage",
      "description": "Nettoyage de bureaux et habitations",
      "icon": "🧹",
      "color": "#10b981",
      "is_active": true,
      "services_count": 78,
      "providers_count": 45,
      "average_price": 80.00
    },
    {
      "id": 4,
      "name": "Jardinage",
      "description": "Entretien de jardins et espaces verts",
      "icon": "🌿",
      "color": "#84cc16",
      "is_active": true,
      "services_count": 23,
      "providers_count": 12,
      "average_price": 120.00
    },
    {
      "id": 5,
      "name": "Informatique",
      "description": "Dépannage et assistance informatique",
      "icon": "💻",
      "color": "#8b5cf6",
      "is_active": true,
      "services_count": 56,
      "providers_count": 34,
      "average_price": 70.00
    },
    {
      "id": 6,
      "name": "Cours particuliers",
      "description": "Soutien scolaire et cours à domicile",
      "icon": "📚",
      "color": "#ec4899",
      "is_active": true,
      "services_count": 67,
      "providers_count": 41,
      "average_price": 45.00
    },
    {
      "id": 7,
      "name": "Déménagement",
      "description": "Aide au déménagement",
      "icon": "📦",
      "color": "#f97316",
      "is_active": false,
      "services_count": 12,
      "providers_count": 8,
      "average_price": 150.00
    }
  ],
  "stats": {
    "total": 100,
    "by_status": 20,
    "by_category": 200,
    "average_budget": 5000,
    "completion_rate": 60,
    "total_revenue": 25000,
    "platform_fees": 5000,
  }
};





export const payments = {
  summary: {
    total_revenue: 45678.50,
    platform_fees: 4567.85,
    pending_payouts: 2345.60,
    monthly_revenue: 12500.00,
    monthly_growth: 15.5,
    by_status: {
      pending: 8,
      paid: 42,
      escrow: 5,
      refunded: 3,
      failed: 2,
    },
    by_method: {
      card: 28,
      mobile_money: 15,
      cash: 10,
      bank_transfer: 7,
    },
  } as PaymentSummary,

  transactions: [
    {
      id: "INV001",
      service_id: 10004,
      service_title: "Réparation ordinateur",
      client: {
        id: 1010,
        name: "Michel Blanc",
      },
      client_id: 1010,
      provider: {
        id: 1006,
        name: "Emilie Dubois",
      },
      provider_id: 1006,
      amount: 80.0,
      platform_fee: 8.0,
      provider_payout: 72.0,
      status: "paid",
      payment_method: "card",
      transaction_id: "tr_abc123def456",
      payment_intent_id: "pi_123456789",
      paid_at: "2026-02-15T15:30:00Z",
      created_at: "2026-02-15T10:15:00Z",
      updated_at: "2026-02-15T15:30:00Z",
    },
    {
      id: "INV002",
      service_id: 10003,
      service_title: "Nettoyage appartement 70m²",
      client: {
        id: 1009,
        name: "Claire Fontaine",
      },
      client_id: 1009,
      provider: {
        id: 1002,
        name: "Marie Martin",
      },
      provider_id: 1002,
      amount: 120.0,
      platform_fee: 12.0,
      provider_payout: 108.0,
      status: "pending",
      payment_method: "mobile_money",
      transaction_id: "mm_789ghi012jkl",
      payment_intent_id: "pi_234567890",
      created_at: "2026-02-16T09:00:00Z",
      updated_at: "2026-02-16T09:00:00Z",
    },
    {
      id: "INV003",
      service_id: 10001,
      service_title: "Réparation fuite d'eau",
      client: {
        id: 1001,
        name: "Jean Dupont",
      },
      client_id: 1001,
      provider: null,
      provider_id: null,
      amount: 150.0,
      platform_fee: 15.0,
      provider_payout: null,
      status: "escrow",
      payment_method: "card",
      transaction_id: "tr_345mno678pqr",
      payment_intent_id: "pi_345678901",
      created_at: "2026-02-16T08:30:00Z",
      updated_at: "2026-02-16T08:30:00Z",
      escrow_release_date: "2026-02-23T00:00:00Z",
    },
    {
      id: "INV004",
      service_id: 10006,
      service_title: "Déménagement studio",
      client: {
        id: 1011,
        name: "Sophie Martin",
      },
      client_id: 1011,
      provider: {
        id: 1003,
        name: "Pierre Leroy",
      },
      provider_id: 1003,
      amount: 180.0,
      platform_fee: 18.0,
      provider_payout: 0.0,
      status: "refunded",
      payment_method: "card",
      transaction_id: "tr_901stu234vwx",
      payment_intent_id: "pi_456789012",
      refund_reason: "Litige - Travail non conforme",
      paid_at: "2026-02-14T14:00:00Z",
      refunded_at: "2026-02-15T11:20:00Z",
      created_at: "2026-02-08T15:20:00Z",
      updated_at: "2026-02-15T11:20:00Z",
      notes: "Remboursement effectué après médiation",
    },
    {
      id: "INV005",
      service_id: 10002,
      service_title: "Cours de piano pour débutant",
      client: {
        id: 1005,
        name: "Thomas Petit",
      },
      client_id: 1005,
      provider: {
        id: 1006,
        name: "Emilie Dubois",
      },
      provider_id: 1006,
      amount: 50.0,
      platform_fee: 5.0,
      provider_payout: 45.0,
      status: "paid",
      payment_method: "cash",
      notes: "Paiement en espèces, frais réduits",
      paid_at: "2026-02-15T18:00:00Z",
      created_at: "2026-02-14T10:45:00Z",
      updated_at: "2026-02-15T18:00:00Z",
    },
    {
      id: "INV006",
      service_id: 10007,
      service_title: "Installation cuisine équipée",
      client: {
        id: 1012,
        name: "Philippe Dubois",
      },
      client_id: 1012,
      provider: null,
      provider_id: null,
      amount: 450.0,
      platform_fee: 45.0,
      provider_payout: null,
      status: "pending",
      payment_method: "bank_transfer",
      transaction_id: "bt_567rst890uvw",
      payment_intent_id: "pi_567890123",
      created_at: "2026-02-16T11:00:00Z",
      updated_at: "2026-02-16T11:00:00Z",
    },
    {
      id: "INV007",
      service_id: 10008,
      service_title: "Cours d'anglais conversationnel",
      client: {
        id: 1013,
        name: "Isabelle Petit",
      },
      client_id: 1013,
      provider: {
        id: 1009,
        name: "Sarah Cohen",
      },
      provider_id: 1009,
      amount: 40.0,
      platform_fee: 4.0,
      provider_payout: 36.0,
      status: "pending",
      payment_method: "card",
      transaction_id: "tr_678stu901xyz",
      payment_intent_id: "pi_678901234",
      created_at: "2026-02-15T15:30:00Z",
      updated_at: "2026-02-15T15:30:00Z",
    },
    {
      id: "INV008",
      service_id: 10009,
      service_title: "Réparation lave-linge",
      client: {
        id: 1014,
        name: "Antoine Girard",
      },
      client_id: 1014,
      provider: {
        id: 1010,
        name: "David Bernard",
      },
      provider_id: 1010,
      amount: 90.0,
      platform_fee: 9.0,
      provider_payout: 81.0,
      status: "paid",
      payment_method: "mobile_money",
      transaction_id: "mm_901abc234def",
      payment_intent_id: "pi_789012345",
      paid_at: "2026-02-16T15:30:00Z",
      created_at: "2026-02-14T13:15:00Z",
      updated_at: "2026-02-16T15:30:00Z",
    },
    {
      id: "INV009",
      service_id: 10010,
      service_title: "Coiffure à domicile",
      client: {
        id: 1015,
        name: "Julie Mercier",
      },
      client_id: 1015,
      provider: null,
      provider_id: null,
      amount: 60.0,
      platform_fee: 6.0,
      provider_payout: null,
      status: "pending",
      payment_method: "cash",
      created_at: "2026-02-15T10:00:00Z",
      updated_at: "2026-02-15T10:00:00Z",
    },
    {
      id: "INV010",
      service_id: 10005,
      service_title: "Jardinage - Taille de haies",
      client: {
        id: 1001,
        name: "Jean Dupont",
      },
      client_id: 1001,
      provider: {
        id: 1003,
        name: "Pierre Leroy",
      },
      provider_id: 1003,
      amount: 200.0,
      platform_fee: 20.0,
      provider_payout: 0.0,
      status: "failed",
      payment_method: "card",
      transaction_id: "tr_345def678ghi",
      payment_intent_id: "pi_890123456",
      created_at: "2026-02-05T11:30:00Z",
      updated_at: "2026-02-09T16:20:00Z",
      notes: "Paiement annulé suite à l'annulation de la mission",
    },
  ] as Payment[],

  payouts: [
    {
      id: "PO001",
      provider: {
        id: 1006,
        name: "Emilie Dubois",
        avatar: "https://randomuser.me/api/portraits/women/7.jpg",
      },
      amount: 450.0,
      period: "01/02/2026 - 15/02/2026",
      method: "bank_transfer",
      status: "pending",
      requested_at: "2026-02-15T20:00:00Z",
      bank_details: {
        bank_name: "BNP Paribas",
        account_number: "FR76 1234 5678 9012 3456 7890 123",
        iban: "FR76 1234 5678 9012 3456 7890 123",
        bic: "BNPAFRPP",
      },
    },
    {
      id: "PO002",
      provider: {
        id: 1002,
        name: "Marie Martin",
        avatar: "https://randomuser.me/api/portraits/women/3.jpg",
      },
      amount: 230.0,
      period: "01/02/2026 - 15/02/2026",
      method: "mobile_money",
      status: "processed",
      requested_at: "2026-02-14T14:30:00Z",
      processed_at: "2026-02-15T10:00:00Z",
      transaction_id: "MM789012",
      notes: "Paiement en attente de confirmation du prestataire",
    },
    {
      id: "PO003",
      provider: {
        id: 1003,
        name: "Pierre Leroy",
        avatar: "https://randomuser.me/api/portraits/men/4.jpg",
      },
      amount: 1250.0,
      period: "01/02/2026 - 15/02/2026",
      method: "bank_transfer",
      status: "paid",
      requested_at: "2026-02-10T09:15:00Z",
      processed_at: "2026-02-11T14:20:00Z",
      paid_at: "2026-02-12T16:30:00Z",
      transaction_id: "TR-BT-789012",
      bank_details: {
        bank_name: "Société Générale",
        account_number: "FR76 9876 5432 1098 7654 3210 987",
        iban: "FR76 9876 5432 1098 7654 3210 987",
        bic: "SOGEFRPP",
      },
    },
    {
      id: "PO004",
      provider: {
        id: 1009,
        name: "Sarah Cohen",
        avatar: "https://randomuser.me/api/portraits/women/10.jpg",
      },
      amount: 180.0,
      period: "01/02/2026 - 15/02/2026",
      method: "paypal",
      status: "pending",
      requested_at: "2026-02-16T08:15:00Z",
    },
    {
      id: "PO005",
      provider: {
        id: 1010,
        name: "David Bernard",
        avatar: null,
      },
      amount: 320.0,
      period: "01/02/2026 - 15/02/2026",
      method: "bank_transfer",
      status: "failed",
      requested_at: "2026-02-13T11:45:00Z",
      processed_at: "2026-02-14T09:30:00Z",
      notes: "Coordonnées bancaires invalides - Demande de mise à jour envoyée",
      bank_details: {
        bank_name: "Crédit Agricole",
        account_number: "FR76 1111 2222 3333 4444 5555 666",
      },
    },
    {
      id: "PO006",
      provider: {
        id: 1006,
        name: "Emilie Dubois",
        avatar: "https://randomuser.me/api/portraits/women/7.jpg",
      },
      amount: 850.0,
      period: "16/01/2026 - 31/01/2026",
      method: "bank_transfer",
      status: "paid",
      requested_at: "2026-02-01T10:30:00Z",
      processed_at: "2026-02-02T09:15:00Z",
      paid_at: "2026-02-03T14:20:00Z",
      transaction_id: "TR-BT-456789",
      bank_details: {
        bank_name: "BNP Paribas",
        account_number: "FR76 1234 5678 9012 3456 7890 123",
        iban: "FR76 1234 5678 9012 3456 7890 123",
        bic: "BNPAFRPP",
      },
    },
    {
      id: "PO007",
      provider: {
        id: 1002,
        name: "Marie Martin",
        avatar: "https://randomuser.me/api/portraits/women/3.jpg",
      },
      amount: 560.0,
      period: "16/01/2026 - 31/01/2026",
      method: "mobile_money",
      status: "paid",
      requested_at: "2026-02-01T09:45:00Z",
      processed_at: "2026-02-01T16:20:00Z",
      paid_at: "2026-02-01T16:20:00Z",
      transaction_id: "MM456789",
    },
    {
      id: "PO008",
      provider: {
        id: 1009,
        name: "Sarah Cohen",
        avatar: "https://randomuser.me/api/portraits/women/10.jpg",
      },
      amount: 420.0,
      period: "16/01/2026 - 31/01/2026",
      method: "paypal",
      status: "paid",
      requested_at: "2026-02-01T14:15:00Z",
      processed_at: "2026-02-02T11:30:00Z",
      paid_at: "2026-02-02T11:30:00Z",
      transaction_id: "PP-123456",
    },
  ] as Payout[],

  // Pour les graphiques et statistiques détaillées
  monthly_revenue: [
    { month: "Janvier", revenue: 12500, fees: 1250, payouts: 9800 },
    { month: "Février", revenue: 14800, fees: 1480, payouts: 11200 },
    { month: "Mars", revenue: 16200, fees: 1620, payouts: 12800 },
    { month: "Avril", revenue: 15800, fees: 1580, payouts: 12400 },
    { month: "Mai", revenue: 17900, fees: 1790, payouts: 14100 },
    { month: "Juin", revenue: 19200, fees: 1920, payouts: 15300 },
    { month: "Juillet", revenue: 20500, fees: 2050, payouts: 16400 },
    { month: "Août", revenue: 21800, fees: 2180, payouts: 17500 },
    { month: "Septembre", revenue: 23400, fees: 2340, payouts: 18800 },
    { month: "Octobre", revenue: 25100, fees: 2510, payouts: 20200 },
    { month: "Novembre", revenue: 26800, fees: 2680, payouts: 21500 },
    { month: "Décembre", revenue: 28900, fees: 2890, payouts: 23300 },
  ],

  // Top providers par gains
  top_providers: [
    {
      id: 1006,
      name: "Emilie Dubois",
      avatar: "https://randomuser.me/api/portraits/women/7.jpg",
      total_earned: 6750,
      services_completed: 45,
      average_rating: 4.95,
    },
    {
      id: 1002,
      name: "Marie Martin",
      avatar: "https://randomuser.me/api/portraits/women/3.jpg",
      total_earned: 1850,
      services_completed: 12,
      average_rating: 4.9,
    },
    {
      id: 1009,
      name: "Sarah Cohen",
      avatar: "https://randomuser.me/api/portraits/women/10.jpg",
      total_earned: 1420,
      services_completed: 9,
      average_rating: 4.8,
    },
    {
      id: 1003,
      name: "Pierre Leroy",
      avatar: "https://randomuser.me/api/portraits/men/4.jpg",
      total_earned: 1250,
      services_completed: 8,
      average_rating: 4.2,
    },
  ],

  // Paiements récents (pour le dashboard)
  recent_payments: [
    {
      id: "INV008",
      amount: 90.0,
      client: "Antoine Girard",
      provider: "David Bernard",
      status: "paid",
      date: "2026-02-16T15:30:00Z",
    },
    {
      id: "INV002",
      amount: 120.0,
      client: "Claire Fontaine",
      provider: "Marie Martin",
      status: "pending",
      date: "2026-02-16T09:00:00Z",
    },
    {
      id: "INV003",
      amount: 150.0,
      client: "Jean Dupont",
      provider: null,
      status: "escrow",
      date: "2026-02-16T08:30:00Z",
    },
    {
      id: "INV001",
      amount: 80.0,
      client: "Michel Blanc",
      provider: "Emilie Dubois",
      status: "paid",
      date: "2026-02-15T15:30:00Z",
    },
    {
      id: "INV005",
      amount: 50.0,
      client: "Thomas Petit",
      provider: "Emilie Dubois",
      status: "paid",
      date: "2026-02-15T18:00:00Z",
    },
  ],

  // Statistiques par méthode de paiement
  payment_methods_stats: {
    card: {
      count: 28,
      total: 12560.50,
      average: 448.59,
      success_rate: 96.4,
    },
    mobile_money: {
      count: 15,
      total: 4890.00,
      average: 326.00,
      success_rate: 100,
    },
    cash: {
      count: 10,
      total: 1850.00,
      average: 185.00,
      success_rate: 100,
    },
    bank_transfer: {
      count: 7,
      total: 3150.00,
      average: 450.00,
      success_rate: 85.7,
    },
  },

  // Historique des reversements par provider
  provider_payout_history: [
    {
      provider_id: 1006,
      provider_name: "Emilie Dubois",
      payouts: [
        { date: "2026-02-03", amount: 850, status: "paid" },
        { date: "2026-01-06", amount: 920, status: "paid" },
        { date: "2025-12-05", amount: 780, status: "paid" },
      ],
    },
    {
      provider_id: 1002,
      provider_name: "Marie Martin",
      payouts: [
        { date: "2026-02-01", amount: 560, status: "paid" },
        { date: "2026-01-04", amount: 490, status: "paid" },
      ],
    },
  ],
};

export const disputes = {
  list: [
    {
      id: 1,
      service: {
        id: 10006,
        title: "Déménagement studio",
      },
      client: {
        id: 1011,
        name: "Sophie Martin",
        avatar: null,
      },
      provider: {
        id: 1003,
        name: "Pierre Leroy",
        avatar: "https://randomuser.me/api/portraits/men/4.jpg",
      },
      opened_by: "client",
      opened_by_name: "Sophie Martin",
      reason: "Travail non conforme",
      description:
        "Le freelance est arrivé avec 2h de retard et n'a pas terminé le travail. Des objets ont été endommagés.",
      priority: "high",
      status: "open",
      created_at: "2026-02-15T10:30:00Z",
      assigned_to: {
        id: 1,
        name: "Jean Martin",
        avatar: "https://randomuser.me/api/portraits/men/1.jpg",
      },
      assigned_at: "2026-02-15T14:00:00Z",
      evidence: [
        {
          id: "EVD001",
          type: "image",
          url: "/mock/evidence/photo1.jpg",
          description: "Objet endommagé",
          uploaded_at: "2026-02-15T10:35:00Z",
          uploaded_by: {
            id: 1011,
            name: "Sophie Martin",
            role: "client",
          },
        },
        {
          id: "EVD002",
          type: "image",
          url: "/mock/evidence/photo2.jpg",
          description: "Travail non terminé",
          uploaded_at: "2026-02-15T10:36:00Z",
          uploaded_by: {
            id: 1011,
            name: "Sophie Martin",
            role: "client",
          },
        },
      ],
      messages: [
        {
          id: "MSG001",
          from: "Sophie Martin",
          from_id: 1011,
          role: "client",
          message: "Je demande un remboursement complet",
          timestamp: "2026-02-15T10:35:00Z",
        },
        {
          id: "MSG002",
          from: "Pierre Leroy",
          from_id: 1003,
          role: "provider",
          message:
            "Le retard était dû à un problème de transport, et les objets étaient déjà abîmés",
          timestamp: "2026-02-15T11:20:00Z",
        },
        {
          id: "MSG003",
          from: "Jean Martin",
          from_id: 1,
          role: "admin",
          message: "Nous analysons votre litige, merci de votre patience",
          timestamp: "2026-02-15T14:00:00Z",
        },
        {
          id: "MSG004",
          from: "Jean Martin",
          from_id: 1,
          role: "admin",
          message:
            "Pouvez-vous fournir plus de photos des objets endommagés ?",
          timestamp: "2026-02-15T14:05:00Z",
          is_private: true,
        },
      ],
      timeline: [
        {
          id: "TIM001",
          action: "Litige ouvert",
          description: "Litige ouvert par Sophie Martin",
          timestamp: "2026-02-15T10:30:00Z",
          user: {
            id: 1011,
            name: "Sophie Martin",
            role: "client",
          },
        },
        {
          id: "TIM002",
          action: "Message ajouté",
          description: "Réponse de Pierre Leroy",
          timestamp: "2026-02-15T11:20:00Z",
          user: {
            id: 1003,
            name: "Pierre Leroy",
            role: "provider",
          },
        },
        {
          id: "TIM003",
          action: "Assignation",
          description: "Litige assigné à Jean Martin",
          timestamp: "2026-02-15T14:00:00Z",
          user: {
            id: 1,
            name: "Jean Martin",
            role: "admin",
          },
        },
      ],
    },
    {
      id: 2,
      service: {
        id: 10007,
        title: "Réparation lave-linge",
      },
      client: {
        id: 1012,
        name: "Philippe Dubois",
        avatar: null,
      },
      provider: {
        id: 1008,
        name: "Lucas Moreau",
        avatar: null,
      },
      opened_by: "provider",
      opened_by_name: "Lucas Moreau",
      reason: "Non-paiement",
      description: "Le client refuse de payer après la prestation effectuée",
      priority: "urgent",
      status: "in_progress",
      created_at: "2026-02-14T16:45:00Z",
      assigned_to: {
        id: 2,
        name: "Anne Bernard",
        avatar: "https://randomuser.me/api/portraits/women/3.jpg",
      },
      assigned_at: "2026-02-14T17:30:00Z",
      evidence: [
        {
          id: "EVD003",
          type: "document",
          url: "/mock/evidence/facture.pdf",
          description: "Facture de la prestation",
          uploaded_at: "2026-02-14T16:50:00Z",
          uploaded_by: {
            id: 1008,
            name: "Lucas Moreau",
            role: "provider",
          },
        },
      ],
      messages: [
        {
          id: "MSG005",
          from: "Lucas Moreau",
          from_id: 1008,
          role: "provider",
          message: "Le client refuse de payer après la réparation effectuée",
          timestamp: "2026-02-14T16:45:00Z",
        },
        {
          id: "MSG006",
          from: "Anne Bernard",
          from_id: 2,
          role: "admin",
          message: "Nous avons contacté le client pour obtenir sa version",
          timestamp: "2026-02-14T17:45:00Z",
        },
      ],
      timeline: [
        {
          id: "TIM004",
          action: "Litige ouvert",
          description: "Litige ouvert par Lucas Moreau",
          timestamp: "2026-02-14T16:45:00Z",
          user: {
            id: 1008,
            name: "Lucas Moreau",
            role: "provider",
          },
        },
        {
          id: "TIM005",
          action: "Assignation",
          description: "Litige assigné à Anne Bernard",
          timestamp: "2026-02-14T17:30:00Z",
          user: {
            id: 2,
            name: "Anne Bernard",
            role: "admin",
          },
        },
      ],
    },
    {
      id: 3,
      service: {
        id: 10008,
        title: "Cours d'anglais",
      },
      client: {
        id: 1013,
        name: "Isabelle Petit",
        avatar: null,
      },
      provider: {
        id: 1009,
        name: "Sarah Cohen",
        avatar: "https://randomuser.me/api/portraits/women/10.jpg",
      },
      opened_by: "client",
      opened_by_name: "Isabelle Petit",
      reason: "Qualité insuffisante",
      description: "Le niveau d'anglais n'était pas celui attendu",
      priority: "normal",
      status: "resolved",
      created_at: "2026-02-10T09:00:00Z",
      resolved_at: "2026-02-12T15:30:00Z",
      resolved_by: {
        id: 3,
        name: "Paul Dubois",
      },
      resolution: "Remboursement partiel de 50% accordé au client",
      assigned_to: {
        id: 3,
        name: "Paul Dubois",
        avatar: "https://randomuser.me/api/portraits/men/2.jpg",
      },
      evidence: [],
      messages: [
        {
          id: "MSG007",
          from: "Isabelle Petit",
          from_id: 1013,
          role: "client",
          message:
            "Le professeur n'avait pas le niveau annoncé, je demande un remboursement",
          timestamp: "2026-02-10T09:00:00Z",
        },
        {
          id: "MSG008",
          from: "Sarah Cohen",
          from_id: 1009,
          role: "provider",
          message:
            "Je suis désolée que vous n'ayez pas été satisfaite, je suis ouverte à une discussion",
          timestamp: "2026-02-10T10:15:00Z",
        },
      ],
      timeline: [
        {
          id: "TIM006",
          action: "Litige ouvert",
          description: "Litige ouvert par Isabelle Petit",
          timestamp: "2026-02-10T09:00:00Z",
          user: {
            id: 1013,
            name: "Isabelle Petit",
            role: "client",
          },
        },
        {
          id: "TIM007",
          action: "Assignation",
          description: "Litige assigné à Paul Dubois",
          timestamp: "2026-02-10T10:30:00Z",
          user: {
            id: 3,
            name: "Paul Dubois",
            role: "admin",
          },
        },
        {
          id: "TIM008",
          action: "Résolution",
          description: "Litige résolu avec remboursement partiel de 50%",
          timestamp: "2026-02-12T15:30:00Z",
          user: {
            id: 3,
            name: "Paul Dubois",
            role: "admin",
          },
        },
      ],
    },
    {
      id: 4,
      service: {
        id: 10009,
        title: "Montage meuble IKEA",
      },
      client: {
        id: 1014,
        name: "Antoine Girard",
        avatar: null,
      },
      provider: {
        id: 1010,
        name: "David Bernard",
        avatar: null,
      },
      opened_by: "client",
      opened_by_name: "Antoine Girard",
      reason: "Travail mal fait",
      description: "Le meuble a été monté à l'envers",
      priority: "low",
      status: "dismissed",
      created_at: "2026-02-08T11:20:00Z",
      dismissed_at: "2026-02-09T14:10:00Z",
      dismissed_by: {
        id: 3,
        name: "Paul Dubois",
      },
      rejection_reason: "Le travail correspondait à la description",
      evidence: [
        {
          id: "EVD004",
          type: "image",
          url: "/mock/evidence/meuble.jpg",
          description: "Photo du meuble monté",
          uploaded_at: "2026-02-08T11:25:00Z",
          uploaded_by: {
            id: 1014,
            name: "Antoine Girard",
            role: "client",
          },
        },
      ],
      messages: [
        {
          id: "MSG009",
          from: "Antoine Girard",
          from_id: 1014,
          role: "client",
          message: "Le meuble est monté à l'envers, je suis très mécontent",
          timestamp: "2026-02-08T11:20:00Z",
        },
        {
          id: "MSG010",
          from: "David Bernard",
          from_id: 1010,
          role: "provider",
          message:
            "J'ai suivi la notice à la lettre, le meuble est correctement monté",
          timestamp: "2026-02-08T13:45:00Z",
        },
      ],
      timeline: [
        {
          id: "TIM009",
          action: "Litige ouvert",
          description: "Litige ouvert par Antoine Girard",
          timestamp: "2026-02-08T11:20:00Z",
          user: {
            id: 1014,
            name: "Antoine Girard",
            role: "client",
          },
        },
        {
          id: "TIM010",
          action: "Rejet",
          description: "Litige rejeté - travail conforme à la description",
          timestamp: "2026-02-09T14:10:00Z",
          user: {
            id: 3,
            name: "Paul Dubois",
            role: "admin",
          },
        },
      ],
    },
    {
      id: 5,
      service: {
        id: 10010,
        title: "Coiffure à domicile",
      },
      client: {
        id: 1015,
        name: "Julie Mercier",
        avatar: null,
      },
      provider: {
        id: 1011,
        name: "Camille Laurent",
        avatar: "https://randomuser.me/api/portraits/women/15.jpg",
      },
      opened_by: "client",
      opened_by_name: "Julie Mercier",
      reason: "Rendez-vous non honoré",
      description:
        "La coiffeuse ne s'est pas présentée au rendez-vous et ne répond plus aux appels",
      priority: "high",
      status: "escalated",
      created_at: "2026-02-16T09:30:00Z",
      escalated_at: "2026-02-16T14:00:00Z",
      escalated_reason: "Absence de réponse du freelance après 24h",
      evidence: [],
      messages: [
        {
          id: "MSG011",
          from: "Julie Mercier",
          from_id: 1015,
          role: "client",
          message:
            "Elle ne s'est pas présentée et ne répond pas à mes messages",
          timestamp: "2026-02-16T09:30:00Z",
        },
      ],
      timeline: [
        {
          id: "TIM011",
          action: "Litige ouvert",
          description: "Litige ouvert par Julie Mercier",
          timestamp: "2026-02-16T09:30:00Z",
          user: {
            id: 1015,
            name: "Julie Mercier",
            role: "client",
          },
        },
        {
          id: "TIM012",
          action: "Escalade",
          description: "Litige escaladé - absence de réponse du freelance",
          timestamp: "2026-02-16T14:00:00Z",
          user: {
            id: 1,
            name: "Jean Martin",
            role: "admin",
          },
        },
      ],
    },
  ] as Dispute[],

  stats: {
    open: 2,
    in_progress: 1,
    resolved: 1,
    dismissed: 1,
    escalated: 1,
    total: 6,
    avg_resolution_time: "48h",
    by_priority: {
      low: 1,
      normal: 1,
      high: 2,
      urgent: 1,
    },
    by_reason: {
      "Travail non conforme": 2,
      "Non-paiement": 1,
      "Qualité insuffisante": 1,
      "Rendez-vous non honoré": 1,
    },
    by_month: [
      { month: "Janvier", count: 3 },
      { month: "Février", count: 6 },
      { month: "Mars", count: 4 },
    ],
  } as DisputeStats,
};

export const settings = {
  "general": {
    "site_name": "FreelanceConnect",
    "site_url": "https://www.freelanceconnect.com",
    "contact_email": "contact@freelanceconnect.com",
    "support_email": "support@freelanceconnect.com",
    "default_language": "fr",
    "timezone": "Europe/Paris",
    "maintenance_mode": false
  },
  "fees": {
    "platform_fee_percentage": 10,
    "minimum_fee": 2.00,
    "maximum_fee": 50.00,
    "withdrawal_fee": 1.00,
    "escrow_fee_percentage": 0.5
  },
  "timings": {
    "client_validation_hours": 48,
    "dispute_opening_days": 7,
    "payout_processing_days": 3,
    "auto_accept_candidature_hours": 24,
    "session_timeout_minutes": 120
  },
  "thresholds": {
    "min_profile_completion": 70,
    "min_provider_rating": 4.0,
    "max_disputes_before_suspension": 3,
    "auto_suspend_after_inactivity_days": 90
  }
};

export const admins = [
  {
    "id": 1,
    "name": "Jean Martin",
    "email": "jean.martin@admin.com",
    "role": "super_admin",
    "permissions": ["all"],
    "avatar": "https://randomuser.me/api/portraits/men/1.jpg",
    "last_login": "2026-02-16T08:30:00Z",
    "created_at": "2025-10-01T00:00:00Z",
    "status": "active"
  },
  {
    "id": 2,
    "name": "Paul Dubois",
    "email": "paul.dubois@admin.com",
    "role": "moderator",
    "permissions": ["users:read", "users:write", "services:read", "services:write", "disputes:read"],
    "avatar": "https://randomuser.me/api/portraits/men/2.jpg",
    "last_login": "2026-02-15T14:20:00Z",
    "created_at": "2025-11-15T00:00:00Z",
    "status": "active"
  },
  {
    "id": 3,
    "name": "Anne Bernard",
    "email": "anne.bernard@admin.com",
    "role": "support",
    "permissions": ["users:read", "services:read", "disputes:read", "disputes:write", "tickets:all"],
    "avatar": "https://randomuser.me/api/portraits/women/3.jpg",
    "last_login": "2026-02-15T18:45:00Z",
    "created_at": "2025-12-10T00:00:00Z",
    "status": "active"
  }
];

export const activity_logs = [
  {
    "id": "LOG001",
    "admin": {
      "id": 1,
      "name": "Jean Martin"
    },
    "action": "user_suspend",
    "target_type": "user",
    "target_id": 1003,
    "target_name": "Pierre Leroy",
    "details": "Suspension pour non-paiement des frais",
    "ip_address": "192.168.1.100",
    "timestamp": "2026-02-15T10:30:00Z"
  },
  {
    "id": "LOG002",
    "admin": {
      "id": 3,
      "name": "Anne Bernard"
    },
    "action": "verification_approve",
    "target_type": "verification",
    "target_id": 2001,
    "target_name": "Sophie Bernard",
    "details": "Vérification d'identité approuvée",
    "ip_address": "192.168.1.102",
    "timestamp": "2026-02-15T09:15:00Z"
  },
  {
    "id": "LOG003",
    "admin": {
      "id": 2,
      "name": "Paul Dubois"
    },
    "action": "dispute_resolve",
    "target_type": "dispute",
    "target_id": "DIS003",
    "target_name": "Litige #DIS003",
    "details": "Résolution: remboursement partiel 50%",
    "ip_address": "192.168.1.101",
    "timestamp": "2026-02-12T15:30:00Z"
  },
  {
    "id": "LOG004",
    "admin": {
      "id": 1,
      "name": "Jean Martin"
    },
    "action": "settings_update",
    "target_type": "settings",
    "details": "Modification des frais plateforme: 8% → 10%",
    "ip_address": "192.168.1.100",
    "timestamp": "2026-02-10T11:45:00Z"
  },
  {
    "id": "LOG005",
    "admin": {
      "id": 2,
      "name": "Paul Dubois"
    },
    "action": "category_create",
    "target_type": "category",
    "target_id": 8,
    "target_name": "Coaching sportif",
    "details": "Nouvelle catégorie créée",
    "ip_address": "192.168.1.101",
    "timestamp": "2026-02-08T14:20:00Z"
  }
];

export const notifications = {
  "unread_count": 3,
  "list": [
    {
      "id": "NOTIF001",
      "type": "urgent",
      "title": "Nouveau litige prioritaire",
      "message": "Un litige haute priorité a été ouvert pour la mission #10006",
      "action_url": "/admin/disputes/DIS001",
      "created_at": "2026-02-15T10:35:00Z",
      "is_read": false
    },
    {
      "id": "NOTIF002",
      "type": "info",
      "title": "Vérifications en attente",
      "message": "3 documents sont en attente de vérification",
      "action_url": "/admin/users/verifications",
      "created_at": "2026-02-15T09:00:00Z",
      "is_read": false
    },
    {
      "id": "NOTIF003",
      "type": "warning",
      "title": "Paiements en retard",
      "message": "2 paiements sont en attente depuis plus de 5 jours",
      "action_url": "/admin/payments?status=pending",
      "created_at": "2026-02-14T08:00:00Z",
      "is_read": false
    },
    {
      "id": "NOTIF004",
      "type": "success",
      "title": "Mission terminée",
      "message": "La mission #10004 a été complétée avec succès",
      "action_url": "/admin/services/10004",
      "created_at": "2026-02-13T16:30:00Z",
      "is_read": true
    }
  ]
};

export const support_tickets = [
  {
    "id": "T001",
    "user": {
      "id": 1001,
      "name": "Jean Dupont",
      "role": "client"
    },
    "subject": "Problème de paiement",
    "message": "J'ai payé mais le provider n'a pas été notifié",
    "priority": "high",
    "status": "open",
    "created_at": "2026-02-15T14:30:00Z",
    "assigned_to": null
  },
  {
    "id": "T002",
    "user": {
      "id": 1006,
      "name": "Emilie Dubois",
      "role": "provider"
    },
    "subject": "Bug dans l'upload de photos",
    "message": "Impossible d'ajouter des photos au portfolio",
    "priority": "normal",
    "status": "in_progress",
    "created_at": "2026-02-14T11:20:00Z",
    "assigned_to": "Paul Dubois",
    "assigned_at": "2026-02-14T14:00:00Z",
    "messages": [
      {
        "from": "Emilie Dubois",
        "message": "L'erreur persiste après plusieurs essais",
        "timestamp": "2026-02-14T16:30:00Z"
      },
      {
        "from": "Paul Dubois",
        "message": "Nous investiguons le problème",
        "timestamp": "2026-02-15T09:15:00Z"
      }
    ]
  },
  {
    "id": "T003",
    "user": {
      "id": 1002,
      "name": "Marie Martin",
      "role": "provider"
    },
    "subject": "Question sur les frais",
    "message": "Comment sont calculés les frais de plateforme ?",
    "priority": "low",
    "status": "closed",
    "created_at": "2026-02-13T09:45:00Z",
    "closed_at": "2026-02-13T11:30:00Z",
    "resolution": "Documentation envoyée par email"
  }
]

export const reports = {
  stats: {
    total_revenue: 45678.50,
    total_services: 567,
    total_users: 1234,
    total_providers: 345,
    average_rating: 4.7,
    completion_rate: 94.5,
    response_rate: 97.2,
    dispute_rate: 2.3,
    previous_period: {
      revenue: 38900.00,
      services: 512,
      users: 1100,
      providers: 320,
    },
  } as ReportStats,

  revenueData: [
    { date: "01/02", revenue: 1250, fees: 125, payouts: 1000 },
    { date: "02/02", revenue: 1480, fees: 148, payouts: 1180 },
    { date: "03/02", revenue: 1620, fees: 162, payouts: 1300 },
    { date: "04/02", revenue: 1580, fees: 158, payouts: 1260 },
    { date: "05/02", revenue: 1790, fees: 179, payouts: 1430 },
    { date: "06/02", revenue: 1920, fees: 192, payouts: 1540 },
    { date: "07/02", revenue: 2050, fees: 205, payouts: 1640 },
    { date: "08/02", revenue: 2180, fees: 218, payouts: 1740 },
    { date: "09/02", revenue: 2340, fees: 234, payouts: 1870 },
    { date: "10/02", revenue: 2510, fees: 251, payouts: 2010 },
    { date: "11/02", revenue: 2680, fees: 268, payouts: 2140 },
    { date: "12/02", revenue: 2890, fees: 289, payouts: 2310 },
    { date: "13/02", revenue: 2750, fees: 275, payouts: 2200 },
    { date: "14/02", revenue: 2980, fees: 298, payouts: 2380 },
    { date: "15/02", revenue: 3120, fees: 312, payouts: 2500 },
  ] as RevenueData[],

  servicesByCategory: [
    { category: "Plomberie", count: 45, percentage: 8, color: "#3b82f6" },
    { category: "Électricité", count: 32, percentage: 5.6, color: "#f59e0b" },
    { category: "Ménage", count: 78, percentage: 13.8, color: "#10b981" },
    { category: "Jardinage", count: 23, percentage: 4.1, color: "#84cc16" },
    { category: "Informatique", count: 56, percentage: 9.9, color: "#8b5cf6" },
    { category: "Cours particuliers", count: 67, percentage: 11.8, color: "#ec4899" },
    { category: "Déménagement", count: 12, percentage: 2.1, color: "#f97316" },
    { category: "Bricolage", count: 34, percentage: 6, color: "#a855f7" },
    { category: "Électroménager", count: 18, percentage: 3.2, color: "#06b6d4" },
    { category: "Beauté", count: 29, percentage: 5.1, color: "#d946ef" },
    { category: "Autres", count: 173, percentage: 30.4, color: "#6b7280" },
  ] as ServicesByCategory[],

  servicesByStatus: [
    { status: "Publiées", count: 145, percentage: 25.6, color: "#3b82f6" },
    { status: "Assignées", count: 89, percentage: 15.7, color: "#8b5cf6" },
    { status: "En cours", count: 123, percentage: 21.7, color: "#f59e0b" },
    { status: "Terminées", count: 298, percentage: 52.6, color: "#10b981" },
    { status: "Annulées", count: 35, percentage: 6.2, color: "#ef4444" },
  ] as ServicesByStatus[],

  topproviders: [
    {
      id: 1006,
      name: "Emilie Dubois",
      avatar: "https://randomuser.me/api/portraits/women/7.jpg",
      services_completed: 45,
      total_earned: 6750,
      average_rating: 4.95,
      response_rate: 100,
    },
    {
      id: 1002,
      name: "Marie Martin",
      avatar: "https://randomuser.me/api/portraits/women/3.jpg",
      services_completed: 12,
      total_earned: 1850,
      average_rating: 4.9,
      response_rate: 98,
    },
    {
      id: 1009,
      name: "Sarah Cohen",
      avatar: "https://randomuser.me/api/portraits/women/10.jpg",
      services_completed: 9,
      total_earned: 1420,
      average_rating: 4.8,
      response_rate: 95,
    },
    {
      id: 1006,
      name: "Pierre Leroy",
      avatar: "https://randomuser.me/api/portraits/men/4.jpg",
      services_completed: 8,
      total_earned: 1250,
      average_rating: 4.2,
      response_rate: 85,
    },
    {
      id: 1010,
      name: "David Bernard",
      avatar: null,
      services_completed: 6,
      total_earned: 980,
      average_rating: 4.5,
      response_rate: 92,
    },
  ] as Topprovider[],

  activityData: [
    { date: "09/02", registrations: 12, services: 15, payments: 1250 },
    { date: "10/02", registrations: 15, services: 18, payments: 1480 },
    { date: "11/02", registrations: 18, services: 22, payments: 1620 },
    { date: "12/02", registrations: 14, services: 19, payments: 1580 },
    { date: "13/02", registrations: 22, services: 25, payments: 1790 },
    { date: "14/02", registrations: 25, services: 28, payments: 1920 },
    { date: "15/02", registrations: 30, services: 32, payments: 2050 },
  ] as ActivityData[],

  geographicDistribution: [
    { city: "Paris", count: 345, percentage: 28 },
    { city: "Lyon", count: 189, percentage: 15.3 },
    { city: "Marseille", count: 156, percentage: 12.6 },
    { city: "Bordeaux", count: 98, percentage: 7.9 },
    { city: "Lille", count: 87, percentage: 7.1 },
    { city: "Toulouse", count: 76, percentage: 6.2 },
    { city: "Nice", count: 54, percentage: 4.4 },
    { city: "Nantes", count: 48, percentage: 3.9 },
    { city: "Strasbourg", count: 42, percentage: 3.4 },
    { city: "Autres", count: 139, percentage: 11.2 },
  ] as GeographicDistribution[],

  performanceMetrics: [
    {
      metric: "Taux de conversion",
      value: 68,
      target: 75,
      previous: 65,
      unit: "%",
    },
    {
      metric: "Temps de réponse",
      value: 2.5,
      target: 2,
      previous: 3.2,
      unit: "h",
    },
    {
      metric: "Satisfaction client",
      value: 4.8,
      target: 4.5,
      previous: 4.7,
      unit: "/5",
    },
    {
      metric: "Services par jour",
      value: 18.5,
      target: 20,
      previous: 17.2,
      unit: "",
    },
  ] as PerformanceMetrics[],
};

export const messages = {
  conversations: [
    {
      id: 1,
      service_id: 10001,
      client_id: 1,
      provider_id: 2,
      is_active: true,
      last_message_at: "2024-03-15T14:30:00",
      created_at: "2024-03-10T09:00:00",
      service: {
        id: 10001,
        title: "Développement site e-commerce",
        status: "in_progress",
      },
      client: {
        id: 1,
        name: "Jean Dupont",
        username: "jdupont",
        email: "jean.dupont@email.com",
        avatar: "https://randomuser.me/api/portraits/men/1.jpg",
      },
      provider: {
        id: 2,
        name: "Marie Martin",
        username: "mmartin",
        email: "marie.martin@email.com",
        avatar: "https://randomuser.me/api/portraits/women/1.jpg",
      },
      last_message: {
        id: 101,
        conversation_id: 1,
        sender_id: 2,
        recipient_id: 1,
        content: "J'ai terminé la maquette, pouvez-vous me donner votre avis ?",
        is_read: false,
        created_at: "2024-03-15T14:30:00",
      },
      message_count: 24,
      unread_count: 1,
    },
    {
      id: 2,
      service_id: 10002,
      client_id: 3,
      provider_id: 4,
      is_active: true,
      last_message_at: "2024-03-15T11:15:00",
      created_at: "2024-03-09T16:20:00",
      service: {
        id: 10002,
        title: "Design logo entreprise",
        status: "in_progress",
      },
      client: {
        id: 3,
        name: "Pierre Durand",
        username: "pdurand",
        email: "pierre.durand@email.com",
        avatar: "https://randomuser.me/api/portraits/men/2.jpg",
      },
      provider: {
        id: 4,
        name: "Sophie Bernard",
        username: "sbernard",
        email: "sophie.bernard@email.com",
        avatar: "https://randomuser.me/api/portraits/women/2.jpg",
      },
      last_message: {
        id: 102,
        conversation_id: 2,
        sender_id: 3,
        recipient_id: 4,
        content: "Pouvez-vous faire une version avec des couleurs plus vives ?",
        is_read: true,
        created_at: "2024-03-15T11:15:00",
      },
      message_count: 18,
      unread_count: 0,
    },
    {
      id: 3,
      service_id: 10003,
      client_id: 5,
      provider_id: 6,
      is_active: false,
      last_message_at: "2024-03-14T09:45:00",
      created_at: "2024-03-05T10:30:00",
      service: {
        id: 10003,
        title: "Rédaction articles blog",
        status: "completed",
      },
      client: {
        id: 5,
        name: "Sophie Martin",
        username: "smartin",
        email: "sophie.martin@email.com",
        avatar: "https://randomuser.me/api/portraits/women/3.jpg",
      },
      provider: {
        id: 6,
        name: "Thomas Dubois",
        username: "tdubois",
        email: "thomas.dubois@email.com",
        avatar: "https://randomuser.me/api/portraits/men/3.jpg",
      },
      last_message: {
        id: 103,
        conversation_id: 3,
        sender_id: 6,
        recipient_id: 5,
        content: "Merci pour votre confiance, au plaisir de collaborer à nouveau !",
        is_read: true,
        created_at: "2024-03-14T09:45:00",
      },
      message_count: 42,
      unread_count: 0,
    },
  ],
  stats: {
    total: 156,
    active: 89,
    archived: 67,
    unread: 23,
    total_messages: 2345,
    avg_messages_per_conversation: 15,
    participants: 178,
    engagement_rate: 85,
  },
};