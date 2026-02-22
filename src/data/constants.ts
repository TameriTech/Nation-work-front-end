import { CalendarEvent } from "@/app/types/calender-events";

// src/constants.js
interface NavItem {
  label: string;
  href: string;
  icon: string;
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

export const navigation: NavGroup[] = [
  {
    title: "Général",
    items: [
      { label: "Accueil", href: "/dashboard/customer", icon: "bi:house" },
      {
        label: "Candidatures",
        href: "/dashboard/customer/candidatures",
        icon: "bi:people",
      },
      {
        label: "Messages",
        href: "/dashboard/customer/messaging",
        icon: "bi:chat",
      },
    ],
  },
  {
    title: "Suivi",
    items: [
      { label: "Calendrier", href: "/dashboard/customer/calendar", icon: "bi:calendar" },
      {
        label: "Services",
        href: "/dashboard/customer/services",
        icon: "bi:circle",
      },
      {
        label: "Avis & Compliments",
        href: "/dashboard/customer/avis",
        icon: "bi:star",
      },
    ],
  },
  {
    title: "Profil & Support",
    items: [
      { label: "Profil", href: "/profil", icon: "bi:person" },
      { label: "Paiements", href: "/paiements", icon: "bi:credit-card" },
      { label: "Centre d'aide", href: "/aide", icon: "bi:help-circle" },
      { label: "Paramètres", href: "/parametres", icon: "bi:settings" },
    ],
  },
];



export const providersByCategory = {
  "Assistance Maison": [
    { name: "Alice Dupont", occupation: "Plombier", rate: 4.5, skills: ["Plomberie", "Cuisine", "Électricité", "Jardinage", "Peinture"] },
    { name: "Jean Martin", occupation: "Électricien", rate: 4.2, skills: ["Électricité", "Domotique", "Sécurité", "Maintenance", "Installation"] },
    { name: "Claire Leroy", occupation: "Peintre", rate: 4.8, skills: ["Peinture", "Décoration", "Revêtements muraux", "Plâtrerie", "Rénovation"] },
    { name: "Marc Dubois", occupation: "Menuisier", rate: 4.0, skills: ["Menuiserie", "Fabrication meubles", "Réparation portes", "Bois", "Agencement"] },
    { name: "Sophie Bernard", occupation: "Aide ménagère", rate: 4.3, skills: ["Nettoyage", "Organisation", "Courses", "Lessive", "Cuisine"] }
  ],
  "Assistance Entreprise": [
    { name: "Bob Durand", occupation: "Consultant", rate: 4.6, skills: ["Finance", "Stratégie", "Management", "Analyse", "Marketing"] },
    { name: "Élodie Petit", occupation: "Juriste", rate: 4.4, skills: ["Droit", "Contrats", "RGPD", "Conseil", "Compliance"] },
    { name: "Thomas Moreau", occupation: "Comptable", rate: 4.1, skills: ["Comptabilité", "Fiscalité", "Reporting", "Audit", "Budget"] },
    { name: "Laura Simon", occupation: "Chargée RH", rate: 4.7, skills: ["Recrutement", "Formation", "Gestion personnel", "Paie", "Onboarding"] },
    { name: "Julien Faure", occupation: "Chef de projet", rate: 4.3, skills: ["Gestion projet", "Planning", "Coordination", "Communication", "Agile"] }
  ],
  "Technique": [
    { name: "Charlie Petit", occupation: "Technicien", rate: 4.2, skills: ["Électricité", "Maintenance", "Installation", "Diagnostic", "Sécurité"] },
    { name: "Amélie Rousseau", occupation: "Développeuse", rate: 4.8, skills: ["React", "Next.js", "Tailwind", "API", "Testing"] },
    { name: "Victor Morel", occupation: "Technicien réseau", rate: 4.5, skills: ["Réseau", "Serveurs", "Sécurité", "Configuration", "Dépannage"] },
    { name: "Lucie Garnier", occupation: "Technicien support", rate: 4.1, skills: ["Support", "Diagnostic", "Réparation", "Documentation", "Assistance utilisateur"] },
    { name: "Nicolas Fabre", occupation: "Ingénieur technique", rate: 4.6, skills: ["Automatisation", "Projets techniques", "Maintenance", "Planification", "Test"] }
  ],
  "Industriel": [
    { name: "David Mercier", occupation: "Ingénieur", rate: 4.7, skills: ["Mécanique", "Maintenance industrielle", "Process", "Sécurité", "Automatisation"] },
    { name: "Isabelle Leroy", occupation: "Technicien industriel", rate: 4.3, skills: ["Production", "Maintenance", "Qualité", "Sécurité", "Logistique"] },
    { name: "François Colin", occupation: "Chef d'atelier", rate: 4.2, skills: ["Gestion équipe", "Production", "Planification", "Maintenance", "Sécurité"] },
    { name: "Claire Dubois", occupation: "Opératrice machine", rate: 4.0, skills: ["Machines industrielles", "Contrôle qualité", "Maintenance légère", "Sécurité", "Rapports"] },
    { name: "Pierre Lambert", occupation: "Technicien maintenance", rate: 4.5, skills: ["Équipements industriels", "Réparation", "Diagnostic", "Sécurité", "Amélioration continue"] }
  ]
};


export const CATEGORY_SERVICES/*: ServiceMap*/ = {
  "Assistance Maison": [
    "Plomberie",
    "Électricité",
    "Cuisine",
    "Aide aux personnes âgées",
    "Baby-sitting",
    "Soin à domicile",
    "Lessive et repassage",
    "Nettoyage",
    "Jardinage",
    "Peinture intérieure",
  ],

  "Assistance Entreprise": [
    "Comptabilité",
    "Secrétariat",
    "Maintenance IT",
    "Sécurité et gardiennage",
    "Nettoyage bureaux",
    "Gestion RH",
    "Consulting stratégique",
    "Support client",
    "Marketing digital",
  ],

  "Technique": [
    "Technicien réseau",
    "Électronique",
    "Réparation PC",
    "CCTV / Vidéosurveillance",
    "Domotique",
    "Télécommunications",
    "Systèmes embarqués",
    "Maintenance technique",
    "Installation Fibre Optique",
  ],

  "Industriel": [
    "Soudure",
    "Électromécanique",
    "Mécanique lourde",
    "Maintenance industrielle",
    "Hydraulique",
    "Usinage CNC",
    "Chaudronnerie",
    "Automatisation industrielle",
    "Robotique",
  ],
};


export const sampleEvents: CalendarEvent[] = [
  {
    id: "1",
    title: "Nom du service",
    start: new Date(2025, 8, 22, 9, 0),
    end: new Date(2025, 8, 22, 10, 0),
    price: 5000,
    status: "completed",
    avatarUrl:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
  },
  {
    id: "2",
    title: "Nom du service",
    start: new Date(2025, 8, 22, 11, 0),
    end: new Date(2025, 8, 22, 12, 0),
    price: 7800,
    status: "published",
  },
  {
    id: "3",
    title: "Nom du service",
    start: new Date(2025, 8, 22, 12, 0),
    end: new Date(2025, 8, 22, 13, 0),
    price: 17000,
    status: "assigned",
    avatarUrl:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
  },
  {
    id: "4",
    title: "Nom du service",
    start: new Date(2025, 8, 24, 9, 0),
    end: new Date(2025, 8, 24, 10, 0),
    price: 300,
    status: "completed",
    avatarUrl:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
  },
  {
    id: "5",
    title: "Nom du service",
    start: new Date(2025, 8, 24, 10, 0),
    end: new Date(2025, 8, 24, 11, 0),
    price: 7800,
    status: "published",
  },
  {
    id: "6",
    title: "Nom du service",
    start: new Date(2025, 8, 24, 12, 0),
    end: new Date(2025, 8, 24, 13, 0),
    price: 6900,
    status: "published",
  },
  {
    id: "7",
    title: "Nom du service",
    start: new Date(2025, 8, 27, 9, 0),
    end: new Date(2025, 8, 27, 10, 0),
    price: 36000,
    status: "upcoming",
    avatarUrl:
      "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&h=100&fit=crop",
  },
  {
    id: "8",
    title: "Nom du service",
    start: new Date(2025, 8, 27, 10, 0),
    end: new Date(2025, 8, 27, 11, 0),
    price: 17000,
    status: "upcoming",
    avatarUrl:
      "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&h=100&fit=crop",
  },
  {
    id: "9",
    title: "Nom du service",
    start: new Date(2025, 8, 28, 12, 0),
    end: new Date(2025, 8, 28, 13, 0),
    price: 5000,
    status: "completed",
    avatarUrl:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
  },
];


export const icons = [
    // Technologies & Développement
    "💻", // Développement web
    "📱", // Applications mobiles
    "🖥️", // Développement desktop
    "⚙️", // Ingénierie
    "🤖", // Intelligence Artificielle
    "🔌", // Électronique
    "📡", // Télécommunications
    "🎮", // Gaming / Jeux vidéo
    "🖨️", // Impression 3D
    "💽", // Base de données
    "☁️", // Cloud computing
    "🔒", // Cybersécurité

    // Création & Design
    "🎨", // Design graphique
    "✏️", // Illustration
    "🎬", // Vidéo / Montage
    "📷", // Photographie
    "🎵", // Musique / Audio
    "🎭", // Arts / Théâtre
    "🖌️", // Peinture
    "✂️", // Couture / Stylisme
    "🏺", // Artisanat / Poterie
    "🪄", // Effets spéciaux
    "🎪", // Animation / Spectacle

    // Réparation & Maintenance
    "🔧", // Réparation générale
    "🛠️", // Outillage
    "🔨", // Bricolage
    "⚡", // Électricité
    "💧", // Plomberie
    "🔥", // Chauffage
    "❄️", // Climatisation
    "🏗️", // Construction
    "🪚", // Menuiserie
    "🪛", // Montage meubles
    "🧰", // Boîte à outils

    // Nettoyage & Entretien
    "🧹", // Nettoyage
    "🧼", // Lavage
    "🧽", // Nettoyage approfondi
    "🧺", // Blanchisserie
    "🧴", // Entretien spécifique
    "🗑️", // Gestion des déchets
    "🧪", // Nettoyage industriel
    "🚿", // Nettoyage auto

    // Nature & Extérieur
    "🌿", // Jardinage
    "🌳", // Paysagisme
    "🌸", // Fleuriste
    "🌾", // Agriculture
    "🐓", // Élevage
    "🐕", // Soins animaux
    "🦮", // Promenade chiens
    "🐱", // Garde animaux
    "🏊", // Piscine entretien

    // Santé & Bien-être
    "💪", // Coaching sportif
    "🧘", // Yoga / Méditation
    "🥗", // Nutrition
    "💊", // Santé / Pharmacie
    "🩺", // Médecine
    "🦷", // Dentiste
    "👁️", // Optique
    "💆", // Massage
    "💅", // Manucure
    "💇", // Coiffure
    "🧖", // Spa / Hammam
    "🤰", // Préparation naissance
    "👴", // Soins personnes âgées
    "🩹", // Soins infirmiers

    // Éducation & Formation
    "📚", // Formation / Cours
    "🎓", // Éducation
    "📖", // Tutorat
    "🗣️", // Coaching oral
    "🧠", // Coaching mental
    "🎯", // Coaching personnel
    "📝", // Rédaction / Correction
    "🔤", // Langues
    "🧮", // Mathématiques
    "🔬", // Sciences
    "🎹", // Cours musique

    // Administration & Juridique
    "📁", // Gestion / Organisation
    "📊", // Analyse de données
    "📈", // Consulting business
    "📉", // Stratégie
    "⚖️", // Juridique / Droit
    "📋", // Secrétariat
    "📑", // Rédaction documents
    "🔍", // Recherche / Audit
    "💰", // Finance / Comptabilité
    "💳", // Gestion financière
    "🏦", // Banque / Assurance
    "📃", // Administration

    // Marketing & Communication
    "📢", // Marketing digital
    "📣", // Publicité
    "📧", // Email marketing
    "🌐", // SEO / Web marketing
    "🎥", // Marketing vidéo (supprimé 📸 qui était en double avec Photographie)
    "📞", // Télémarketing
    "🤝", // Relations publiques
    "✉️", // Newsletter

    // Transport & Logistique
    "🚗", // Transport particulier
    "🚕", // Taxi / VTC
    "🚚", // Livraison
    "🚛", // Transport de marchandises
    "📦", // Déménagement
    "✈️", // Transport aérien
    "🚢", // Transport maritime
    "🚂", // Transport ferroviaire
    "🚲", // Livraison vélo
    "🛵", // Livraison scooter
    "📍", // Courses / Commissions

    // Événementiel & Services
    "🎉", // Organisation événements
    "🎂", // Traiteur / Gâteaux
    "🍽️", // Service traiteur
    "🥂", // Service cocktails
    "🎤", // Animation / DJ
    "🎫", // Billetterie (supprimé 🎪 qui était en double avec Animation/Spectacle)
    "💍", // Organisation mariage
    "🎄", // Décorations

    // Bricolage & Travaux
    "🏠", // Rénovation maison
    "🏢", // Rénovation bureau
    "🪑", // Assemblage meubles
    "🪟", // Installation fenêtres
    "🚪", // Portes / Serrurerie
    "🪞", // Miroiterie
    "🧱", // Maçonnerie
    "🪜", // Travaux en hauteur
    "🪒", // Barbier (déplacé de Beauté)

    // Beauté & Esthétique
    "💄", // Maquillage
    "💋", // Permanent make-up
    "✨", // Soins esthétiques

    // Services à la personne
    "👶", // Baby-sitting
    "🧓", // Aide aux personnes
    "🍳", // Chef à domicile
    "🛒", // Courses / Shopping
    "👕", // Repassage

    // Digital & Multimédia
    "🎧", // Podcasts
    "📹", // Streaming
    "📼", // Montage vidéo
    "🎚️", // Mixage audio
    "🎛️", // Production musicale
    "📻", // Radio / Podcast

    // Animaux
    "🐶", // Toilettage
    "🐴", // Soins équins
    "🐠", // Aquariophilie
    "🦜", // Soins oiseaux
    "🐰", // Pension animaux

    // Sports & Loisirs
    "⚽", // Football
    "🏀", // Basketball
    "🎾", // Tennis
    "🚴", // Cyclisme
    "🧗", // Escalade
    "🏋️", // Musculation
    "🥋", // Arts martiaux
    "🏃", // Running
    "⛰️", // Randonnée
];


export const colors = [
    // Bleus
    "#3b82f6", // bleu primaire
    "#2563eb", // bleu foncé
    "#1d4ed8", // bleu profond
    "#60a5fa", // bleu clair
    "#93c5fd", // bleu très clair
    "#06b6d4", // cyan
    "#0891b2", // cyan foncé
    "#0e7490", // bleu-vert
    "#22d3ee", // turquoise
    "#67e8f9", // turquoise clair
    
    // Verts
    "#10b981", // vert émeraude
    "#059669", // vert forêt
    "#047857", // vert profond
    "#34d399", // vert menthe
    "#6ee7b7", // vert clair
    "#84cc16", // vert lime
    "#65a30d", // vert olive
    "#4d7c0f", // vert kaki
    "#a3e635", // vert fluo
    "#bef264", // vert très clair
    
    // Oranges & Jaunes
    "#f59e0b", // orange
    "#d97706", // orange foncé
    "#fbbf24", // jaune orangé
    "#fcd34d", // jaune
    "#fde68a", // jaune clair
    "#f97316", // orange vif
    "#ea580c", // orange profond
    "#fb923c", // orange pastel
    "#fdba74", // pêche
    
    // Rouges & Roses
    "#ef4444", // rouge
    "#dc2626", // rouge foncé
    "#b91c1c", // rouge profond
    "#f87171", // rouge clair
    "#fca5a5", // rouge pastel
    "#ec4899", // rose
    "#db2777", // rose foncé
    "#be185d", // rose profond
    "#f472b6", // rose clair
    "#f9a8d4", // rose pastel
    
    // Violets & Pourpres
    "#8b5cf6", // violet
    "#7c3aed", // violet foncé
    "#6d28d9", // violet profond
    "#a78bfa", // violet clair
    "#c4b5fd", // violet pastel
    "#d946ef", // magenta
    "#c026d3", // magenta foncé
    "#a21caf", // pourpre
    "#e879f9", // magenta clair
    "#f0abfc", // magenta pastel
    
    // Couleurs neutres
    "#64748b", // gris-bleu
    "#475569", // ardoise
    "#334155", // ardoise foncée
    "#6b7280", // gris
    "#4b5563", // gris foncé
    "#374151", // gris profond
    "#78716c", // taupe
    "#57534e", // taupe foncé
    "#a8a29e", // taupe clair
    "#d6d3d1", // beige
    
    // Teintes naturelles
    "#8b5a2b", // brun
    "#92400e", // brun foncé
    "#b45309", // terre cuite
    "#ca8a04", // ocre
    "#a16207", // moutarde
    "#854d0e", // brun olive
    "#9ca3af", // argent
    "#d1d5db", // gris perle
    "#f3f4f6", // blanc cassé
    "#e5e7eb", // gris très clair
    
    // Couleurs vives
    "#00ffff", // cyan vif
    "#ff00ff", // magenta vif
    "#ffff00", // jaune vif
    "#00ff00", // vert vif
    "#ff6b6b", // corail
    "#4ecdc4", // vert d'eau
    "#45b7d1", // bleu ciel
    "#96ceb4", // vert sauge
    "#ffeead", // jaune pâle
    "#ffcc5c", // jaune moutarde
    
    // Dégradés potentiels (à utiliser comme base)
    "#1e40af", // bleu nuit
    "#1e3a8a", // bleu très foncé
    "#065f46", // vert sapin
    "#064e3b", // vert très foncé
    "#7f1d1d", // rouge bordeaux
    "#831843", // prune
    "#581c87", // violet nuit
    "#2d3748", // charbon
];
//export type CategoryName = keyof typeof SERVICE_CATEGORIES;
