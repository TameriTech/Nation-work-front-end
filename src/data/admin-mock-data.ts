
  export const dashboard  = {
    "stats": {
      "users": {
        "total": 1234,
        "new": 45,
        "growth": 12,
        "breakdown": {
          "clients": 876,
          "freelancers": 345,
          "admins": 13
        }
      },
      "services": {
        "total": 567,
        "active": 234,
        "completed": 298,
        "cancelled": 35,
        "growth": 8
      },
      "payments": {
        "total_amount": 45678.50,
        "platform_fees": 4567.85,
        "pending_payouts": 2345.60,
        "growth": 15
      },
      "disputes": {
        "open": 12,
        "resolved": 45,
        "escalated": 3,
        "change": -2
      }
    },
    "recent_activities": [
      {
        "id": "ACT001",
        "type": "user_registration",
        "user": {
          "name": "Jean Dupont",
          "role": "freelancer",
          "avatar": "https://randomuser.me/api/portraits/men/1.jpg"
        },
        "description": "Nouvelle inscription",
        "timestamp": "2026-02-16T09:30:00Z",
        "time_ago": "il y a 5 minutes"
      },
      {
        "id": "ACT002",
        "type": "service_created",
        "service": {
          "id": 1234,
          "title": "Réparation fuite d'eau"
        },
        "user": {
          "name": "Marie Lambert",
          "role": "client"
        },
        "description": "Nouvelle mission créée",
        "timestamp": "2026-02-16T09:23:00Z",
        "time_ago": "il y a 12 minutes"
      },
      {
        "id": "ACT003",
        "type": "payment_received",
        "payment": {
          "id": "INV001",
          "amount": 150.00
        },
        "service": {
          "id": 1234,
          "title": "Cours de piano"
        },
        "description": "Paiement reçu",
        "timestamp": "2026-02-16T09:10:00Z",
        "time_ago": "il y a 25 minutes"
      },
      {
        "id": "ACT004",
        "type": "dispute_opened",
        "dispute": {
          "id": "DIS001"
        },
        "service": {
          "id": 1235,
          "title": "Jardinage"
        },
        "user": {
          "name": "Pierre Moreau",
          "role": "client"
        },
        "description": "Litige ouvert",
        "timestamp": "2026-02-16T08:45:00Z",
        "time_ago": "il y a 1 heure"
      },
      {
        "id": "ACT005",
        "type": "verification_pending",
        "user": {
          "name": "Sophie Bernard",
          "role": "freelancer"
        },
        "description": "Document en attente de vérification",
        "timestamp": "2026-02-16T08:30:00Z",
        "time_ago": "il y a 2 heures"
      }
    ],
    "charts": {
      "registrations": {
        "labels": ["01/02", "02/02", "03/02", "04/02", "05/02", "06/02", "07/02", "08/02", "09/02", "10/02", "11/02", "12/02", "13/02", "14/02", "15/02"],
        "data": [12, 15, 18, 14, 22, 25, 30, 28, 32, 35, 38, 42, 45, 40, 48]
      },
      "service_status": {
        "labels": ["Publiées", "Assignées", "En cours", "Terminées", "Annulées"],
        "data": [145, 89, 123, 298, 35],
        "colors": ["#3b82f6", "#8b5cf6", "#f59e0b", "#10b981", "#ef4444"]
      },
      "revenue": {
        "labels": ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin", "Juil", "Août", "Sep", "Oct", "Nov", "Déc"],
        "data": [12500, 14800, 16200, 15800, 17900, 19200, 20500, 21800, 23400, 25100, 26800, 28900]
      }
    }
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
        "role": "freelancer",
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
        "role": "freelancer",
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
        "role": "freelancer",
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
        "role": "freelancer",
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
        "freelancer": null,
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
        "freelancer": {
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
        "freelancer": {
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
        "freelancer": {
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
        "freelancer": {
          "id": 1003,
          "name": "Pierre Leroy",
          "avatar": "https://randomuser.me/api/portraits/men/4.jpg"
        },
        "date": "2026-02-10T08:00:00Z",
        "cancelled_at": "2026-02-09T16:20:00Z",
        "cancellation_reason": "Indisponibilité du freelancer",
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
        "freelancer": {
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
        "freelancers_count": 23,
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
        "freelancers_count": 18,
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
        "freelancers_count": 45,
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
        "freelancers_count": 12,
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
        "freelancers_count": 34,
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
        "freelancers_count": 41,
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
        "freelancers_count": 8,
        "average_price": 150.00
      }
    ]
  };

  export const payments = {
    "summary": {
      "total_revenue": 45678.50,
      "platform_fees": 4567.85,
      "pending_payouts": 2345.60,
      "monthly_revenue": 12500.00,
      "monthly_growth": 15.5
    },
    "transactions": [
      {
        "id": "INV001",
        "service_id": 10004,
        "service_title": "Réparation ordinateur",
        "client": {
          "id": 1010,
          "name": "Michel Blanc"
        },
        "freelancer": {
          "id": 1006,
          "name": "Emilie Dubois"
        },
        "amount": 80.00,
        "platform_fee": 8.00,
        "freelancer_payout": 72.00,
        "status": "paid",
        "payment_method": "card",
        "transaction_id": "tr_abc123def456",
        "paid_at": "2026-02-15T15:30:00Z",
        "created_at": "2026-02-15T10:15:00Z"
      },
      {
        "id": "INV002",
        "service_id": 10003,
        "service_title": "Nettoyage appartement",
        "client": {
          "id": 1009,
          "name": "Claire Fontaine"
        },
        "freelancer": {
          "id": 1002,
          "name": "Marie Martin"
        },
        "amount": 120.00,
        "platform_fee": 12.00,
        "freelancer_payout": 108.00,
        "status": "pending",
        "payment_method": "mobile_money",
        "transaction_id": "mm_789ghi012jkl",
        "created_at": "2026-02-16T09:00:00Z",
        "estimated_payout": "2026-02-19"
      },
      {
        "id": "INV003",
        "service_id": 10001,
        "service_title": "Réparation fuite d'eau",
        "client": {
          "id": 1001,
          "name": "Jean Dupont"
        },
        "freelancer": null,
        "amount": 150.00,
        "platform_fee": 15.00,
        "freelancer_payout": null,
        "status": "escrow",
        "payment_method": "card",
        "transaction_id": "tr_345mno678pqr",
        "created_at": "2026-02-16T08:30:00Z",
        "escrow_release_date": "2026-02-23"
      },
      {
        "id": "INV004",
        "service_id": 10006,
        "service_title": "Déménagement studio",
        "client": {
          "id": 1011,
          "name": "Sophie Martin"
        },
        "freelancer": {
          "id": 1003,
          "name": "Pierre Leroy"
        },
        "amount": 180.00,
        "platform_fee": 18.00,
        "freelancer_payout": 0.00,
        "status": "refunded",
        "payment_method": "card",
        "transaction_id": "tr_901stu234vwx",
        "refund_reason": "Litige - Travail non conforme",
        "paid_at": "2026-02-14T14:00:00Z",
        "refunded_at": "2026-02-15T11:20:00Z"
      },
      {
        "id": "INV005",
        "service_id": 10002,
        "service_title": "Cours de piano",
        "client": {
          "id": 1005,
          "name": "Thomas Petit"
        },
        "freelancer": {
          "id": 1006,
          "name": "Emilie Dubois"
        },
        "amount": 50.00,
        "platform_fee": 5.00,
        "freelancer_payout": 45.00,
        "status": "paid",
        "payment_method": "cash",
        "notes": "Paiement en espèces, frais réduits",
        "paid_at": "2026-02-15T18:00:00Z",
        "created_at": "2026-02-14T10:45:00Z"
      }
    ],
    "payouts": [
      {
        "id": "PO001",
        "freelancer": {
          "id": 1006,
          "name": "Emilie Dubois"
        },
        "amount": 450.00,
        "period": "01/02/2026 - 15/02/2026",
        "method": "bank_transfer",
        "status": "pending",
        "requested_at": "2026-02-15T20:00:00Z",
        "estimated_payment": "2026-02-18"
      },
      {
        "id": "PO002",
        "freelancer": {
          "id": 1002,
          "name": "Marie Martin"
        },
        "amount": 230.00,
        "period": "01/02/2026 - 15/02/2026",
        "method": "mobile_money",
        "status": "processed",
        "requested_at": "2026-02-14T14:30:00Z",
        "processed_at": "2026-02-15T10:00:00Z",
        "transaction_id": "mm_po_123456"
      },
      {
        "id": "PO003",
        "freelancer": {
          "id": 1003,
          "name": "Pierre Leroy"
        },
        "amount": 1250.00,
        "period": "01/02/2026 - 15/02/2026",
        "method": "bank_transfer",
        "status": "paid",
        "requested_at": "2026-02-10T09:15:00Z",
        "paid_at": "2026-02-12T16:30:00Z",
        "transaction_id": "tr_bt_789012"
      }
    ]
  };

  export const disputes =  {
    "list": [
      {
        "id": "DIS001",
        "service": {
          "id": 10006,
          "title": "Déménagement studio"
        },
        "client": {
          "id": 1011,
          "name": "Sophie Martin",
          "avatar": null
        },
        "freelancer": {
          "id": 1003,
          "name": "Pierre Leroy",
          "avatar": "https://randomuser.me/api/portraits/men/4.jpg"
        },
        "opened_by": "client",
        "opened_by_name": "Sophie Martin",
        "reason": "Travail non conforme",
        "description": "Le freelance est arrivé avec 2h de retard et n'a pas terminé le travail. Des objets ont été endommagés.",
        "priority": "high",
        "status": "open",
        "created_at": "2026-02-15T10:30:00Z",
        "evidence": [
          {
            "type": "image",
            "url": "/mock/evidence/photo1.jpg",
            "description": "Objet endommagé"
          },
          {
            "type": "image",
            "url": "/mock/evidence/photo2.jpg",
            "description": "Travail non terminé"
          }
        ],
        "messages": [
          {
            "from": "Sophie Martin",
            "role": "client",
            "message": "Je demande un remboursement complet",
            "timestamp": "2026-02-15T10:35:00Z"
          },
          {
            "from": "Pierre Leroy",
            "role": "freelancer",
            "message": "Le retard était dû à un problème de transport, et les objets étaient déjà abîmés",
            "timestamp": "2026-02-15T11:20:00Z"
          },
          {
            "from": "Support",
            "role": "admin",
            "message": "Nous analysons votre litige, merci de votre patience",
            "timestamp": "2026-02-15T14:00:00Z"
          }
        ]
      },
      {
        "id": "DIS002",
        "service": {
          "id": 10007,
          "title": "Réparation lave-linge"
        },
        "client": {
          "id": 1012,
          "name": "Philippe Dubois",
          "avatar": null
        },
        "freelancer": {
          "id": 1008,
          "name": "Lucas Moreau",
          "avatar": null
        },
        "opened_by": "freelancer",
        "opened_by_name": "Lucas Moreau",
        "reason": "Non-paiement",
        "description": "Le client refuse de payer après la prestation effectuée",
        "priority": "high",
        "status": "in_progress",
        "created_at": "2026-02-14T16:45:00Z",
        "assigned_to": "Jean (Admin)",
        "assigned_at": "2026-02-14T17:30:00Z"
      },
      {
        "id": "DIS003",
        "service": {
          "id": 10008,
          "title": "Cours d'anglais"
        },
        "client": {
          "id": 1013,
          "name": "Isabelle Petit",
          "avatar": null
        },
        "freelancer": {
          "id": 1009,
          "name": "Sarah Cohen",
          "avatar": "https://randomuser.me/api/portraits/women/10.jpg"
        },
        "opened_by": "client",
        "opened_by_name": "Isabelle Petit",
        "reason": "Qualité insuffisante",
        "description": "Le niveau d'anglais n'était pas celui attendu",
        "priority": "normal",
        "status": "resolved",
        "resolution": "Remboursement partiel de 50%",
        "created_at": "2026-02-10T09:00:00Z",
        "resolved_at": "2026-02-12T15:30:00Z",
        "resolved_by": "Anne (Support)"
      },
      {
        "id": "DIS004",
        "service": {
          "id": 10009,
          "title": "Montage meuble IKEA"
        },
        "client": {
          "id": 1014,
          "name": "Antoine Girard",
          "avatar": null
        },
        "freelancer": {
          "id": 1010,
          "name": "David Bernard",
          "avatar": null
        },
        "opened_by": "client",
        "opened_by_name": "Antoine Girard",
        "reason": "Travail mal fait",
        "priority": "low",
        "status": "dismissed",
        "rejection_reason": "Le travail correspondait à la description",
        "created_at": "2026-02-08T11:20:00Z",
        "dismissed_at": "2026-02-09T14:10:00Z",
        "dismissed_by": "Paul (Admin)"
      }
    ],
    "stats": {
      "open": 12,
      "in_progress": 5,
      "resolved": 45,
      "dismissed": 8,
      "avg_resolution_time": "48h",
      "by_reason": {
        "Travail non conforme": 23,
        "Non-paiement": 12,
        "Qualité insuffisante": 15,
        "Retard": 8,
        "Autre": 7
      }
    }
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
      "min_freelancer_rating": 4.0,
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
      "message": "J'ai payé mais le freelancer n'a pas été notifié",
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
        "role": "freelancer"
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
        "role": "freelancer"
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
