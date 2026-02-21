"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Settings,
  DollarSign,
  Mail,
  Shield,
  Percent,
  Euro,
  CreditCard,
  Wallet,
  Save,
  RefreshCw,
  Loader2,
  CheckCircle,
  XCircle,
  AlertCircle,
  Plus,
  Trash2,
  Edit,
  Eye,
  EyeOff,
  Copy,
  TestTube,
  Send,
  FileText,
  Clock,
  Users,
  Briefcase,
  Scale,
  Zap,
  ToggleLeft,
  ToggleRight,
  ArrowUpDown,
  Search,
  Filter,
} from "lucide-react";

// ==================== TYPES ====================

interface PlatformFee {
  id: number;
  name: string;
  type: "percentage" | "fixed";
  value: number;
  apply_to: "all" | "client" | "freelancer" | "both";
  min_amount?: number;
  max_amount?: number;
  is_active: boolean;
  priority: number;
  description?: string;
  created_at: string;
  updated_at?: string;
}

interface EmailTemplate {
  id: number;
  name: string;
  subject: string;
  content: string;
  type: "notification" | "alert" | "promotion" | "transactional";
  event: string;
  variables: string[];
  is_active: boolean;
  is_default: boolean;
  last_modified: string;
  description?: string;
}

interface ValidationRule {
  id: number;
  name: string;
  type: "service" | "user" | "payment" | "dispute";
  condition: {
    field: string;
    operator: "eq" | "neq" | "gt" | "lt" | "gte" | "lte" | "contains" | "in";
    value: any;
  }[];
  action: {
    type: "approve" | "reject" | "flag" | "notify" | "escalate";
    message?: string;
    notify_roles?: string[];
  };
  priority: number;
  is_active: boolean;
  created_at: string;
  updated_at?: string;
  description?: string;
}

// ==================== COMPOSANTS DE CARTES ====================

const SettingsCard = ({
  title,
  description,
  icon: Icon,
  children,
  color = "blue",
}: {
  title: string;
  description?: string;
  icon: any;
  children: React.ReactNode;
  color?: "blue" | "green" | "purple" | "orange" | "red";
}) => {
  const colors = {
    blue: "bg-blue-500",
    green: "bg-green-500",
    purple: "bg-purple-500",
    orange: "bg-orange-500",
    red: "bg-red-500",
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg overflow-hidden border border-gray-200 dark:border-slate-700">
      <div className={`h-2 ${colors[color]}`} />
      <div className="p-6">
        <div className="flex items-start mb-4">
          <div
            className={`w-10 h-10 ${colors[color]} rounded-lg flex items-center justify-center text-white shadow-lg mr-3`}
          >
            <Icon className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {title}
            </h2>
            {description && (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {description}
              </p>
            )}
          </div>
        </div>
        {children}
      </div>
    </div>
  );
};

const ToggleSwitch = ({
  enabled,
  onChange,
  label,
}: {
  enabled: boolean;
  onChange: (enabled: boolean) => void;
  label?: string;
}) => (
  <button
    onClick={() => onChange(!enabled)}
    className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
      enabled ? "bg-blue-600" : "bg-gray-300 dark:bg-gray-600"
    }`}
  >
    <span
      className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
        enabled ? "translate-x-6" : "translate-x-1"
      }`}
    />
    {label && (
      <span className="ml-3 text-sm text-gray-700 dark:text-gray-300">
        {label}
      </span>
    )}
  </button>
);

// ==================== SECTION FRAIS DE PLATEFORME ====================

const PlatformFeesSection = () => {
  const [fees, setFees] = useState<PlatformFee[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingFee, setEditingFee] = useState<PlatformFee | null>(null);
  const [showForm, setShowForm] = useState(false);

  // Données mockées
  useEffect(() => {
    const mockFees: PlatformFee[] = [
      {
        id: 1,
        name: "Commission standard",
        type: "percentage",
        value: 10,
        apply_to: "both",
        min_amount: 1,
        is_active: true,
        priority: 1,
        description: "Commission par défaut sur tous les services",
        created_at: "2024-01-01T00:00:00Z",
      },
      {
        id: 2,
        name: "Frais de service premium",
        type: "fixed",
        value: 5,
        apply_to: "client",
        min_amount: 50,
        is_active: true,
        priority: 2,
        description: "Frais fixes pour les services premium",
        created_at: "2024-01-01T00:00:00Z",
      },
      {
        id: 3,
        name: "Commission freelancer pro",
        type: "percentage",
        value: 8,
        apply_to: "freelancer",
        max_amount: 100,
        is_active: false,
        priority: 3,
        description: "Commission réduite pour les freelancers certifiés",
        created_at: "2024-01-01T00:00:00Z",
      },
    ];
    setFees(mockFees);
  }, []);

  const handleSaveFee = (fee: Partial<PlatformFee>) => {
    if (editingFee) {
      setFees(fees.map((f) => (f.id === editingFee.id ? { ...f, ...fee } : f)));
    } else {
      const newFee: PlatformFee = {
        id: Math.max(...fees.map((f) => f.id)) + 1,
        name: fee.name || "Nouvelle règle",
        type: fee.type || "percentage",
        value: fee.value || 0,
        apply_to: fee.apply_to || "both",
        is_active: fee.is_active ?? true,
        priority: fee.priority || fees.length + 1,
        description: fee.description,
        created_at: new Date().toISOString(),
      };
      setFees([...fees, newFee]);
    }
    setShowForm(false);
    setEditingFee(null);
  };

  const handleDeleteFee = (id: number) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cette règle de frais ?")) {
      setFees(fees.filter((f) => f.id !== id));
    }
  };

  return (
    <SettingsCard
      title="Frais de plateforme"
      description="Configurez les commissions et frais appliqués aux transactions"
      icon={DollarSign}
      color="green"
    >
      <div className="space-y-4">
        {/* Résumé des frais */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="bg-gray-50 dark:bg-slate-700/50 rounded-lg p-3">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Commission moyenne
            </p>
            <p className="text-lg font-bold text-gray-900 dark:text-gray-100">
              {fees
                .filter((f) => f.is_active)
                .reduce((acc, f) => acc + f.value, 0) /
                fees.filter((f) => f.is_active).length || 0}
              %
            </p>
          </div>
          <div className="bg-gray-50 dark:bg-slate-700/50 rounded-lg p-3">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Règles actives
            </p>
            <p className="text-lg font-bold text-gray-900 dark:text-gray-100">
              {fees.filter((f) => f.is_active).length}
            </p>
          </div>
          <div className="bg-gray-50 dark:bg-slate-700/50 rounded-lg p-3">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Priorité max
            </p>
            <p className="text-lg font-bold text-gray-900 dark:text-gray-100">
              {Math.max(...fees.map((f) => f.priority))}
            </p>
          </div>
        </div>

        {/* Liste des frais */}
        <div className="space-y-3">
          {fees.map((fee) => (
            <div
              key={fee.id}
              className={`p-4 rounded-lg border ${
                fee.is_active
                  ? "bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700"
                  : "bg-gray-50 dark:bg-slate-800/50 border-gray-200 dark:border-slate-700 opacity-60"
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <h3 className="font-medium text-gray-900 dark:text-gray-100">
                      {fee.name}
                    </h3>
                    <span
                      className={`px-2 py-0.5 text-xs rounded-full ${
                        fee.type === "percentage"
                          ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                          : "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                      }`}
                    >
                      {fee.type === "percentage" ? "Pourcentage" : "Fixe"}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      Priorité {fee.priority}
                    </span>
                  </div>

                  <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">
                        Valeur:
                      </span>
                      <span className="ml-1 font-medium text-gray-900 dark:text-gray-100">
                        {fee.type === "percentage"
                          ? `${fee.value}%`
                          : `${fee.value}€`}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">
                        Appliqué à:
                      </span>
                      <span className="ml-1 font-medium text-gray-900 dark:text-gray-100">
                        {fee.apply_to === "both" && "Les deux"}
                        {fee.apply_to === "client" && "Client"}
                        {fee.apply_to === "freelancer" && "Freelancer"}
                      </span>
                    </div>
                    {fee.min_amount && (
                      <div>
                        <span className="text-gray-500 dark:text-gray-400">
                          Min:
                        </span>
                        <span className="ml-1 font-medium text-gray-900 dark:text-gray-100">
                          {fee.min_amount}€
                        </span>
                      </div>
                    )}
                    {fee.max_amount && (
                      <div>
                        <span className="text-gray-500 dark:text-gray-400">
                          Max:
                        </span>
                        <span className="ml-1 font-medium text-gray-900 dark:text-gray-100">
                          {fee.max_amount}€
                        </span>
                      </div>
                    )}
                  </div>

                  {fee.description && (
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      {fee.description}
                    </p>
                  )}
                </div>

                <div className="flex items-center space-x-2 ml-4">
                  <ToggleSwitch
                    enabled={fee.is_active}
                    onChange={(enabled) => {
                      setFees(
                        fees.map((f) =>
                          f.id === fee.id ? { ...f, is_active: enabled } : f,
                        ),
                      );
                    }}
                  />
                  <button
                    onClick={() => {
                      setEditingFee(fee);
                      setShowForm(true);
                    }}
                    className="p-1 text-gray-500 hover:text-blue-600 dark:hover:text-blue-400"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteFee(fee.id)}
                    className="p-1 text-gray-500 hover:text-red-600 dark:hover:text-red-400"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bouton d'ajout */}
        <button
          onClick={() => {
            setEditingFee(null);
            setShowForm(true);
          }}
          className="w-full mt-4 px-4 py-2 border-2 border-dashed border-gray-300 dark:border-slate-600 rounded-lg text-gray-600 dark:text-gray-400 hover:border-blue-500 hover:text-blue-600 transition flex items-center justify-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          Ajouter une règle de frais
        </button>

        {/* Formulaire d'ajout/édition */}
        {showForm && (
          <FeeForm
            fee={editingFee}
            onSave={handleSaveFee}
            onCancel={() => {
              setShowForm(false);
              setEditingFee(null);
            }}
          />
        )}
      </div>
    </SettingsCard>
  );
};

const FeeForm = ({
  fee,
  onSave,
  onCancel,
}: {
  fee?: PlatformFee | null;
  onSave: (data: Partial<PlatformFee>) => void;
  onCancel: () => void;
}) => {
  const [formData, setFormData] = useState<Partial<PlatformFee>>(
    fee || {
      name: "",
      type: "percentage",
      value: 0,
      apply_to: "both",
      is_active: true,
      priority: 1,
      description: "",
    },
  );

  return (
    <div className="mt-4 p-4 bg-gray-50 dark:bg-slate-700/50 rounded-lg border border-gray-200 dark:border-slate-700">
      <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-4">
        {fee ? "Modifier la règle" : "Nouvelle règle de frais"}
      </h3>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Nom
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100"
            placeholder="ex: Commission standard"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Type
            </label>
            <select
              value={formData.type}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  type: e.target.value as "percentage" | "fixed",
                })
              }
              className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100"
            >
              <option value="percentage">Pourcentage</option>
              <option value="fixed">Fixe</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Valeur
            </label>
            <input
              type="number"
              value={formData.value}
              onChange={(e) =>
                setFormData({ ...formData, value: Number(e.target.value) })
              }
              className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100"
              step={formData.type === "percentage" ? 0.1 : 0.01}
              min={0}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Appliqué à
            </label>
            <select
              value={formData.apply_to}
              onChange={(e) =>
                setFormData({ ...formData, apply_to: e.target.value as any })
              }
              className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100"
            >
              <option value="both">Client et Freelancer</option>
              <option value="client">Client uniquement</option>
              <option value="freelancer">Freelancer uniquement</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Priorité
            </label>
            <input
              type="number"
              value={formData.priority}
              onChange={(e) =>
                setFormData({ ...formData, priority: Number(e.target.value) })
              }
              className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100"
              min={1}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Montant minimum (optionnel)
            </label>
            <input
              type="number"
              value={formData.min_amount || ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  min_amount: e.target.value
                    ? Number(e.target.value)
                    : undefined,
                })
              }
              className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100"
              min={0}
              step={0.01}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Montant maximum (optionnel)
            </label>
            <input
              type="number"
              value={formData.max_amount || ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  max_amount: e.target.value
                    ? Number(e.target.value)
                    : undefined,
                })
              }
              className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100"
              min={0}
              step={0.01}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Description
          </label>
          <textarea
            value={formData.description || ""}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            rows={2}
            className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100"
            placeholder="Description de cette règle de frais..."
          />
        </div>

        <div className="flex items-center justify-end space-x-3 pt-4">
          <button
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-300 transition"
          >
            Annuler
          </button>
          <button
            onClick={() => onSave(formData)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center"
          >
            <Save className="w-4 h-4 mr-2" />
            {fee ? "Mettre à jour" : "Créer"}
          </button>
        </div>
      </div>
    </div>
  );
};

// ==================== SECTION TEMPLATES D'EMAIL ====================

const EmailTemplatesSection = () => {
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] =
    useState<EmailTemplate | null>(null);
  const [previewMode, setPreviewMode] = useState(false);
  const [testEmail, setTestEmail] = useState("");

  // Données mockées
  useEffect(() => {
    const mockTemplates: EmailTemplate[] = [
      {
        id: 1,
        name: "Bienvenue",
        subject: "Bienvenue sur notre plateforme !",
        content: "<h1>Bonjour {{name}},</h1><p>Merci de nous rejoindre...</p>",
        type: "transactional",
        event: "user_registration",
        variables: ["name", "email"],
        is_active: true,
        is_default: true,
        last_modified: "2024-01-01T00:00:00Z",
        description: "Email de bienvenue pour les nouveaux utilisateurs",
      },
      {
        id: 2,
        name: "Confirmation de service",
        subject: "Votre service a été confirmé",
        content:
          "<h1>Bonjour {{client_name}},</h1><p>Votre service {{service_title}} a été confirmé...</p>",
        type: "transactional",
        event: "service_confirmed",
        variables: ["client_name", "service_title", "freelancer_name"],
        is_active: true,
        is_default: true,
        last_modified: "2024-01-01T00:00:00Z",
        description: "Notification de confirmation de service",
      },
      {
        id: 3,
        name: "Alerte litige",
        subject: "Litige ouvert sur le service {{service_id}}",
        content: "<h1>Alerte litige</h1><p>Un litige a été ouvert...</p>",
        type: "alert",
        event: "dispute_opened",
        variables: ["service_id", "client_name", "freelancer_name", "reason"],
        is_active: true,
        is_default: false,
        last_modified: "2024-01-02T00:00:00Z",
        description: "Notification d'ouverture de litige",
      },
    ];
    setTemplates(mockTemplates);
  }, []);

  const handleSaveTemplate = (template: Partial<EmailTemplate>) => {
    if (selectedTemplate) {
      setTemplates(
        templates.map((t) =>
          t.id === selectedTemplate.id ? { ...t, ...template } : t,
        ),
      );
    } else {
      const newTemplate: EmailTemplate = {
        id: Math.max(...templates.map((t) => t.id)) + 1,
        name: template.name || "Nouveau template",
        subject: template.subject || "",
        content: template.content || "",
        type: template.type || "notification",
        event: template.event || "",
        variables: template.variables || [],
        is_active: template.is_active ?? true,
        is_default: false,
        last_modified: new Date().toISOString(),
        description: template.description,
      };
      setTemplates([...templates, newTemplate]);
    }
    setSelectedTemplate(null);
  };

  const handleSendTest = (templateId: number) => {
    if (!testEmail) {
      alert("Veuillez entrer une adresse email de test");
      return;
    }
    alert(`Email de test envoyé à ${testEmail}`);
  };

  return (
    <SettingsCard
      title="Templates d'email"
      description="Personnalisez tous les emails envoyés par la plateforme"
      icon={Mail}
      color="purple"
    >
      <div className="space-y-4">
        {/* Barre de recherche et filtres */}
        <div className="flex items-center space-x-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Rechercher un template..."
              className="pl-10 w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100"
            />
          </div>
          <select className="px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100">
            <option value="">Tous les types</option>
            <option value="notification">Notification</option>
            <option value="alert">Alerte</option>
            <option value="promotion">Promotion</option>
            <option value="transactional">Transactionnel</option>
          </select>
        </div>

        {/* Liste des templates */}
        <div className="space-y-3 max-h-96 overflow-y-auto custom-scrollbar pr-2">
          {templates.map((template) => (
            <div
              key={template.id}
              className={`p-4 rounded-lg border ${
                template.is_active
                  ? "bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700"
                  : "bg-gray-50 dark:bg-slate-800/50 border-gray-200 dark:border-slate-700 opacity-60"
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <h3 className="font-medium text-gray-900 dark:text-gray-100">
                      {template.name}
                    </h3>
                    {template.is_default && (
                      <span className="px-2 py-0.5 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 rounded-full text-xs">
                        Par défaut
                      </span>
                    )}
                    <span className="px-2 py-0.5 bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400 rounded-full text-xs">
                      {template.type}
                    </span>
                  </div>

                  <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    {template.description}
                  </p>

                  <div className="mt-2">
                    <p className="text-xs text-gray-500 dark:text-gray-500">
                      <span className="font-medium">Sujet:</span>{" "}
                      {template.subject}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                      <span className="font-medium">Variables:</span>{" "}
                      {template.variables.join(", ")}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2 ml-4">
                  <button
                    onClick={() => setPreviewMode(!previewMode)}
                    className="p-1 text-gray-500 hover:text-blue-600 dark:hover:text-blue-400"
                    title="Aperçu"
                  >
                    {previewMode ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                  <button
                    onClick={() => setSelectedTemplate(template)}
                    className="p-1 text-gray-500 hover:text-blue-600 dark:hover:text-blue-400"
                    title="Modifier"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <ToggleSwitch
                    enabled={template.is_active}
                    onChange={(enabled) => {
                      setTemplates(
                        templates.map((t) =>
                          t.id === template.id
                            ? { ...t, is_active: enabled }
                            : t,
                        ),
                      );
                    }}
                  />
                </div>
              </div>

              {/* Aperçu */}
              {previewMode && (
                <div className="mt-4 p-3 bg-gray-50 dark:bg-slate-700 rounded-lg">
                  <div className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-line">
                    {template.content}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Test d'envoi */}
        <div className="mt-4 p-4 bg-gray-50 dark:bg-slate-700/50 rounded-lg">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Envoyer un test
          </h4>
          <div className="flex space-x-2">
            <input
              type="email"
              value={testEmail}
              onChange={(e) => setTestEmail(e.target.value)}
              placeholder="email@test.com"
              className="flex-1 px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100"
            />
            <button
              onClick={() => handleSendTest(templates[0]?.id)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
            >
              <Send className="w-4 h-4 mr-2" />
              Tester
            </button>
          </div>
        </div>

        {/* Bouton d'ajout */}
        <button
          onClick={() => setSelectedTemplate({} as EmailTemplate)}
          className="w-full mt-4 px-4 py-2 border-2 border-dashed border-gray-300 dark:border-slate-600 rounded-lg text-gray-600 dark:text-gray-400 hover:border-blue-500 hover:text-blue-600 transition flex items-center justify-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nouveau template
        </button>

        {/* Formulaire d'édition */}
        {selectedTemplate && (
          <TemplateForm
            template={selectedTemplate}
            onSave={handleSaveTemplate}
            onCancel={() => setSelectedTemplate(null)}
          />
        )}
      </div>
    </SettingsCard>
  );
};

const TemplateForm = ({
  template,
  onSave,
  onCancel,
}: {
  template: Partial<EmailTemplate>;
  onSave: (data: Partial<EmailTemplate>) => void;
  onCancel: () => void;
}) => {
  const [formData, setFormData] = useState<Partial<EmailTemplate>>(template);

  return (
    <div className="mt-4 p-4 bg-gray-50 dark:bg-slate-700/50 rounded-lg border border-gray-200 dark:border-slate-700">
      <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-4">
        {template.id ? "Modifier le template" : "Nouveau template"}
      </h3>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Nom
            </label>
            <input
              type="text"
              value={formData.name || ""}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100"
              placeholder="ex: Email de bienvenue"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Type
            </label>
            <select
              value={formData.type || "notification"}
              onChange={(e) =>
                setFormData({ ...formData, type: e.target.value as any })
              }
              className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100"
            >
              <option value="notification">Notification</option>
              <option value="aemaillert">Alerte</option>
              <option value="promotion">Promotion</option>
              <option value="transactional">Transactionnel</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Événement déclencheur
          </label>
          <select
            value={formData.event || ""}
            onChange={(e) =>
              setFormData({ ...formData, event: e.target.value })
            }
            className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100"
          >
            <option value="">Sélectionner un événement</option>
            <option value="user_registration">Inscription utilisateur</option>
            <option value="service_created">Service créé</option>
            <option value="service_confirmed">Service confirmé</option>
            <option value="service_completed">Service terminé</option>
            <option value="payment_received">Paiement reçu</option>
            <option value="dispute_opened">Litige ouvert</option>
            <option value="dispute_resolved">Litige résolu</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Sujet
          </label>
          <input
            type="text"
            value={formData.subject || ""}
            onChange={(e) =>
              setFormData({ ...formData, subject: e.target.value })
            }
            className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100"
            placeholder="Sujet de l'email"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Contenu (HTML)
          </label>
          <textarea
            value={formData.content || ""}
            onChange={(e) =>
              setFormData({ ...formData, content: e.target.value })
            }
            rows={8}
            className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 font-mono text-sm"
            placeholder="<h1>Bonjour {{name}},</h1>..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Variables disponibles
          </label>
          <div className="p-3 bg-gray-100 dark:bg-slate-800 rounded-lg">
            <code className="text-sm text-gray-700 dark:text-gray-300">
              {/* {name}, {email}, {service_title}, {client_name}, {freelancer_name} */}
            </code>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Description
          </label>
          <textarea
            value={formData.description || ""}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            rows={2}
            className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100"
            placeholder="Description du template..."
          />
        </div>

        <div className="flex items-center justify-end space-x-3 pt-4">
          <button
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-300 transition"
          >
            Annuler
          </button>
          <button
            onClick={() => onSave(formData)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center"
          >
            <Save className="w-4 h-4 mr-2" />
            {template.id ? "Mettre à jour" : "Créer"}
          </button>
        </div>
      </div>
    </div>
  );
};

// ==================== SECTION RÈGLES DE VALIDATION ====================

const ValidationRulesSection = () => {
  const [rules, setRules] = useState<ValidationRule[]>([]);
  const [editingRule, setEditingRule] = useState<ValidationRule | null>(null);
  const [showForm, setShowForm] = useState(false);

  // Données mockées
  useEffect(() => {
    const mockRules: ValidationRule[] = [
      {
        id: 1,
        name: "Validation automatique des clients vérifiés",
        type: "user",
        condition: [
          { field: "is_identity_verified", operator: "eq", value: true },
          { field: "completed_services", operator: "gte", value: 5 },
        ],
        action: {
          type: "approve",
          message: "Client vérifié automatiquement",
        },
        priority: 1,
        is_active: true,
        created_at: "2024-01-01T00:00:00Z",
        description:
          "Approuve automatiquement les clients vérifiés avec plus de 5 services",
      },
      {
        id: 2,
        name: "Flag des services à haut budget",
        type: "service",
        condition: [{ field: "proposed_amount", operator: "gt", value: 1000 }],
        action: {
          type: "flag",
          message: "Service à haut budget nécessitant une vérification",
          notify_roles: ["admin"],
        },
        priority: 2,
        is_active: true,
        created_at: "2024-01-01T00:00:00Z",
        description:
          "Marque les services de plus de 1000€ pour vérification manuelle",
      },
      {
        id: 3,
        name: "Rejet automatique des utilisateurs suspects",
        type: "user",
        condition: [{ field: "email", operator: "contains", value: "spam" }],
        action: {
          type: "reject",
          message: "Email suspect détecté",
        },
        priority: 3,
        is_active: false,
        created_at: "2024-01-01T00:00:00Z",
        description:
          "Rejette automatiquement les inscriptions avec emails suspects",
      },
    ];
    setRules(mockRules);
  }, []);

  const handleSaveRule = (rule: Partial<ValidationRule>) => {
    if (editingRule) {
      setRules(
        rules.map((r) => (r.id === editingRule.id ? { ...r, ...rule } : r)),
      );
    } else {
      const newRule: ValidationRule = {
        id: Math.max(...rules.map((r) => r.id)) + 1,
        name: rule.name || "Nouvelle règle",
        type: rule.type || "service",
        condition: rule.condition || [],
        action: rule.action || { type: "flag" },
        priority: rule.priority || rules.length + 1,
        is_active: rule.is_active ?? true,
        created_at: new Date().toISOString(),
        description: rule.description,
      };
      setRules([...rules, newRule]);
    }
    setShowForm(false);
    setEditingRule(null);
  };

  const handleDeleteRule = (id: number) => {
    if (
      confirm("Êtes-vous sûr de vouloir supprimer cette règle de validation ?")
    ) {
      setRules(rules.filter((r) => r.id !== id));
    }
  };

  const getActionIcon = (type: string) => {
    switch (type) {
      case "approve":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "reject":
        return <XCircle className="w-4 h-4 text-red-500" />;
      case "flag":
        return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      case "notify":
        return <Mail className="w-4 h-4 text-blue-500" />;
      case "escalate":
        return <Scale className="w-4 h-4 text-purple-500" />;
      default:
        return <Zap className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <SettingsCard
      title="Règles de validation"
      description="Automatisez les processus de validation et de modération"
      icon={Shield}
      color="orange"
    >
      <div className="space-y-4">
        {/* Statistiques rapides */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="bg-gray-50 dark:bg-slate-700/50 rounded-lg p-3">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Règles actives
            </p>
            <p className="text-lg font-bold text-gray-900 dark:text-gray-100">
              {rules.filter((r) => r.is_active).length}
            </p>
          </div>
          <div className="bg-gray-50 dark:bg-slate-700/50 rounded-lg p-3">
            <p className="text-xs text-gray-500 dark:text-gray-400">Par type</p>
            <p className="text-lg font-bold text-gray-900 dark:text-gray-100">
              {rules.filter((r) => r.type === "service").length}S /{" "}
              {rules.filter((r) => r.type === "user").length}U
            </p>
          </div>
          <div className="bg-gray-50 dark:bg-slate-700/50 rounded-lg p-3">
            <p className="text-xs text-gray-500 dark:text-gray-400">Actions</p>
            <p className="text-lg font-bold text-gray-900 dark:text-gray-100">
              {rules.filter((r) => r.action.type === "approve").length}A /{" "}
              {rules.filter((r) => r.action.type === "reject").length}R
            </p>
          </div>
        </div>

        {/* Liste des règles */}
        <div className="space-y-3">
          {rules.map((rule) => (
            <div
              key={rule.id}
              className={`p-4 rounded-lg border ${
                rule.is_active
                  ? "bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700"
                  : "bg-gray-50 dark:bg-slate-800/50 border-gray-200 dark:border-slate-700 opacity-60"
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <h3 className="font-medium text-gray-900 dark:text-gray-100">
                      {rule.name}
                    </h3>
                    <span
                      className={`px-2 py-0.5 text-xs rounded-full ${
                        rule.type === "service"
                          ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                          : rule.type === "user"
                            ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                            : rule.type === "payment"
                              ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400"
                              : "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400"
                      }`}
                    >
                      {rule.type === "service" && "Service"}
                      {rule.type === "user" && "Utilisateur"}
                      {rule.type === "payment" && "Paiement"}
                      {rule.type === "dispute" && "Litige"}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      Priorité {rule.priority}
                    </span>
                  </div>

                  <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    {rule.description}
                  </p>

                  <div className="mt-2 flex items-center space-x-4">
                    <div className="flex items-center">
                      {getActionIcon(rule.action.type)}
                      <span className="ml-1 text-xs text-gray-600 dark:text-gray-400">
                        {rule.action.type === "approve" &&
                          "Approbation automatique"}
                        {rule.action.type === "reject" && "Rejet automatique"}
                        {rule.action.type === "flag" &&
                          "Marquage pour révision"}
                        {rule.action.type === "notify" && "Notification"}
                        {rule.action.type === "escalate" && "Escalade"}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {rule.condition.length} condition(s)
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2 ml-4">
                  <ToggleSwitch
                    enabled={rule.is_active}
                    onChange={(enabled) => {
                      setRules(
                        rules.map((r) =>
                          r.id === rule.id ? { ...r, is_active: enabled } : r,
                        ),
                      );
                    }}
                  />
                  <button
                    onClick={() => {
                      setEditingRule(rule);
                      setShowForm(true);
                    }}
                    className="p-1 text-gray-500 hover:text-blue-600 dark:hover:text-blue-400"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteRule(rule.id)}
                    className="p-1 text-gray-500 hover:text-red-600 dark:hover:text-red-400"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bouton d'ajout */}
        <button
          onClick={() => {
            setEditingRule(null);
            setShowForm(true);
          }}
          className="w-full mt-4 px-4 py-2 border-2 border-dashed border-gray-300 dark:border-slate-600 rounded-lg text-gray-600 dark:text-gray-400 hover:border-blue-500 hover:text-blue-600 transition flex items-center justify-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          Ajouter une règle de validation
        </button>

        {/* Formulaire d'ajout/édition */}
        {showForm && (
          <ValidationRuleForm
            rule={editingRule}
            onSave={handleSaveRule}
            onCancel={() => {
              setShowForm(false);
              setEditingRule(null);
            }}
          />
        )}
      </div>
    </SettingsCard>
  );
};

const ValidationRuleForm = ({
  rule,
  onSave,
  onCancel,
}: {
  rule?: ValidationRule | null;
  onSave: (data: Partial<ValidationRule>) => void;
  onCancel: () => void;
}) => {
  const [formData, setFormData] = useState<Partial<ValidationRule>>(
    rule || {
      name: "",
      type: "service",
      condition: [],
      action: { type: "flag" },
      priority: 1,
      is_active: true,
      description: "",
    },
  );

  const [newCondition, setNewCondition] = useState({
    field: "",
    operator: "eq",
    value: "",
  });

  const addCondition = () => {
    if (!newCondition.field || !newCondition.value) return;
    setFormData({
      ...formData,
      condition: [
        ...(formData.condition || []),
        {
          field: newCondition.field,
          operator: newCondition.operator as any,
          value: newCondition.value,
        },
      ],
    });
    setNewCondition({ field: "", operator: "eq", value: "" });
  };

  const removeCondition = (index: number) => {
    setFormData({
      ...formData,
      condition: (formData.condition || []).filter((_, i) => i !== index),
    });
  };

  return (
    <div className="mt-4 p-4 bg-gray-50 dark:bg-slate-700/50 rounded-lg border border-gray-200 dark:border-slate-700">
      <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-4">
        {rule ? "Modifier la règle" : "Nouvelle règle de validation"}
      </h3>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Nom
            </label>
            <input
              type="text"
              value={formData.name || ""}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100"
              placeholder="ex: Validation automatique"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Type
            </label>
            <select
              value={formData.type}
              onChange={(e) =>
                setFormData({ ...formData, type: e.target.value as any })
              }
              className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100"
            >
              <option value="service">Service</option>
              <option value="user">Utilisateur</option>
              <option value="payment">Paiement</option>
              <option value="dispute">Litige</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Conditions
          </label>
          <div className="space-y-2 mb-2">
            {(formData.condition || []).map((cond, index) => (
              <div
                key={index}
                className="flex items-center space-x-2 bg-gray-100 dark:bg-slate-800 p-2 rounded-lg"
              >
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  {cond.field} {cond.operator} {cond.value}
                </span>
                <button
                  onClick={() => removeCondition(index)}
                  className="p-1 text-red-500 hover:text-red-600"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={newCondition.field}
              onChange={(e) =>
                setNewCondition({ ...newCondition, field: e.target.value })
              }
              placeholder="Champ"
              className="flex-1 px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 text-sm"
            />
            <select
              value={newCondition.operator}
              onChange={(e) =>
                setNewCondition({ ...newCondition, operator: e.target.value })
              }
              className="w-24 px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 text-sm"
            >
              <option value="eq">=</option>
              <option value="neq">≠</option>
              <option value="gt">&gt;</option>
              <option value="lt">&lt;</option>
              <option value="gte">≥</option>
              <option value="lte">≤</option>
              <option value="contains">contient</option>
              <option value="in">dans</option>
            </select>
            <input
              type="text"
              value={newCondition.value}
              onChange={(e) =>
                setNewCondition({ ...newCondition, value: e.target.value })
              }
              placeholder="Valeur"
              className="flex-1 px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 text-sm"
            />
            <button
              onClick={addCondition}
              className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Action
          </label>
          <div className="grid grid-cols-2 gap-4">
            <select
              value={formData.action?.type}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  action: { ...formData.action, type: e.target.value as any },
                })
              }
              className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100"
            >
              <option value="approve">Approuver automatiquement</option>
              <option value="reject">Rejeter automatiquement</option>
              <option value="flag">Marquer pour révision</option>
              <option value="notify">Notifier</option>
              <option value="escalate">Escalader</option>
            </select>

            <input
              type="text"
              value={formData.action?.message || ""}
              onChange={(e) => {
                if (!formData.action) return;

                setFormData({
                  ...formData,
                  action: {
                    ...formData.action,
                    message: e.target.value,
                  },
                });
              }}
              placeholder="Message (optionnel)"
              className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Priorité
            </label>
            <input
              type="number"
              value={formData.priority}
              onChange={(e) =>
                setFormData({ ...formData, priority: Number(e.target.value) })
              }
              className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100"
              min={1}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Description
            </label>
            <input
              type="text"
              value={formData.description || ""}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100"
              placeholder="Description de la règle"
            />
          </div>
        </div>

        <div className="flex items-center">
          <ToggleSwitch
            enabled={formData.is_active ?? true}
            onChange={(enabled) =>
              setFormData({ ...formData, is_active: enabled })
            }
            label="Règle active"
          />
        </div>

        <div className="flex items-center justify-end space-x-3 pt-4">
          <button
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-300 transition"
          >
            Annuler
          </button>
          <button
            onClick={() => onSave(formData)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center"
          >
            <Save className="w-4 h-4 mr-2" />
            {rule ? "Mettre à jour" : "Créer"}
          </button>
        </div>
      </div>
    </div>
  );
};

// ==================== PAGE PRINCIPALE ====================

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState<
    "idle" | "saving" | "success" | "error"
  >("idle");

  const handleSaveAll = async () => {
    setSaveStatus("saving");
    try {
      // Simuler une sauvegarde
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setSaveStatus("success");
      setTimeout(() => setSaveStatus("idle"), 3000);
    } catch (error) {
      setSaveStatus("error");
    }
  };

  return (
    <div className="min-h-screen dark:bg-slate-950">
      <div className="container mx-auto">
        {/* En-tête */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-100 flex items-center">
              <Settings className="w-6 h-6 mr-2 text-blue-400" />
              Paramètres administrateur
            </h1>
            <p className="text-gray-400 mt-1">
              Configurez les frais, les emails et les règles de validation
            </p>
          </div>

          <div className="flex items-center space-x-3">
            {saveStatus === "success" && (
              <span className="text-green-400 flex items-center">
                <CheckCircle className="w-5 h-5 mr-2" />
                Modifications enregistrées
              </span>
            )}
            {saveStatus === "error" && (
              <span className="text-red-400 flex items-center">
                <XCircle className="w-5 h-5 mr-2" />
                Erreur lors de la sauvegarde
              </span>
            )}
            <button
              onClick={handleSaveAll}
              disabled={saveStatus === "saving"}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center transition"
            >
              {saveStatus === "saving" ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              Enregistrer tout
            </button>
          </div>
        </div>

        {/* Grille des paramètres */}
        <div className="grid grid-cols-1 gap-6">
          <PlatformFeesSection />
          <EmailTemplatesSection />
          <ValidationRulesSection />
        </div>

        {/* Note de bas de page */}
        <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-500">
          <p>
            Les modifications prennent effet immédiatement après
            l'enregistrement.
          </p>
        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #1e293b;
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #475569;
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #64748b;
        }
      `}</style>
    </div>
  );
}
