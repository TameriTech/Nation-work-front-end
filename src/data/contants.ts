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

//export type CategoryName = keyof typeof SERVICE_CATEGORIES;
