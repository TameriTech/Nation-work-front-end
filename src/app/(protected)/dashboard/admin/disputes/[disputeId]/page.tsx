"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Scale,
  AlertCircle,
  Clock,
  CheckCircle,
  XCircle,
  Shield,
  User,
  Briefcase,
  Calendar,
  MessageSquare,
  FileText,
  Image as ImageIcon,
  Download,
  Send,
  MoreHorizontal,
  Loader2,
  AlertTriangle,
  Info,
  Flag,
  Check,
  Ban,
  Zap,
  Users,
  Mail,
  Phone,
  MapPin,
  Star,
  DollarSign,
  CreditCard,
  FileCheck,
  FileX,
  Eye,
  Trash2,
  Edit,
  Plus,
} from "lucide-react";

import {
  getDisputeById,
  addDisputeMessage,
  resolveDispute,
  rejectDispute,
  escalateDispute,
  assignDispute,
  getDisputeHistory,
} from "@/app/services/disputes.service";
import type {
  Dispute,
  ResolveData,
  RejectData,
  MessageData,
} from "@/app/types/admin";
import { disputes as mockDisputes } from "@/data/admin-mock-data";

// Badge de priorité
const PriorityBadge = ({ priority }: { priority: string }) => {
  const badges: Record<string, { color: string; icon: any; label: string }> = {
    urgent: {
      color:
        "bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800",
      icon: AlertTriangle,
      label: "Urgente",
    },
    high: {
      color:
        "bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-800",
      icon: AlertCircle,
      label: "Haute",
    },
    normal: {
      color:
        "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800",
      icon: Info,
      label: "Normale",
    },
    low: {
      color:
        "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800",
      icon: Clock,
      label: "Basse",
    },
  };
  const badge = badges[priority] || badges.normal;
  const Icon = badge.icon;

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${badge.color}`}
    >
      <Icon className="w-4 h-4 mr-2" />
      {badge.label}
    </span>
  );
};

// Badge de statut
const StatusBadge = ({ status }: { status: string }) => {
  const badges: Record<string, { color: string; icon: any; label: string }> = {
    open: {
      color:
        "bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800",
      icon: AlertCircle,
      label: "Ouvert",
    },
    in_progress: {
      color:
        "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800",
      icon: Clock,
      label: "En cours",
    },
    resolved: {
      color:
        "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800",
      icon: CheckCircle,
      label: "Résolu",
    },
    dismissed: {
      color:
        "bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700",
      icon: XCircle,
      label: "Rejeté",
    },
    escalated: {
      color:
        "bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-800",
      icon: Shield,
      label: "Escaladé",
    },
  };
  const badge = badges[status] || badges.open;
  const Icon = badge.icon;

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${badge.color}`}
    >
      <Icon className="w-4 h-4 mr-2" />
      {badge.label}
    </span>
  );
};

// Carte d'information
const InfoCard = ({
  icon: Icon,
  title,
  children,
}: {
  icon: any;
  title: string;
  children: React.ReactNode;
}) => (
  <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-slate-700">
    <h3 className="text-lg font-semibold mb-4 flex items-center text-gray-900 dark:text-gray-100">
      <Icon className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" />
      {title}
    </h3>
    <div className="space-y-3">{children}</div>
  </div>
);

// Carte de message
const MessageCard = ({
  message,
  isOwn,
}: {
  message: {
    id: string;
    from: string;
    role: string;
    message: string;
    timestamp: string;
    is_private?: boolean;
  };
  isOwn: boolean;
}) => {
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className={`flex ${isOwn ? "justify-end" : "justify-start"} mb-4`}>
      <div
        className={`max-w-[70%] rounded-lg p-3 ${
          isOwn
            ? "bg-blue-600 text-white"
            : message.is_private
              ? "bg-purple-100 dark:bg-purple-900/30 text-gray-900 dark:text-gray-100 border border-purple-200 dark:border-purple-800"
              : "bg-gray-100 dark:bg-slate-700 text-gray-900 dark:text-gray-100"
        }`}
      >
        {!isOwn && (
          <div className="flex items-center mb-1">
            <span className="font-medium text-sm">{message.from}</span>
            {message.role === "admin" && (
              <span className="ml-2 text-xs px-1.5 py-0.5 bg-blue-200 dark:bg-blue-800 rounded">
                Admin
              </span>
            )}
            {message.is_private && (
              <span className="ml-2 text-xs px-1.5 py-0.5 bg-purple-200 dark:bg-purple-800 rounded flex items-center">
                <Shield className="w-3 h-3 mr-1" />
                Privé
              </span>
            )}
          </div>
        )}
        <p className="text-sm">{message.message}</p>
        <p
          className={`text-xs mt-1 ${
            isOwn ? "text-blue-100" : "text-gray-500 dark:text-gray-400"
          }`}
        >
          {formatTime(message.timestamp)}
        </p>
      </div>
    </div>
  );
};

// Carte de preuve
const EvidenceCard = ({
  evidence,
  onView,
}: {
  evidence: {
    id: string;
    type: string;
    url: string;
    description?: string;
    uploaded_at: string;
    uploaded_by: { name: string; role: string };
  };
  onView: (url: string) => void;
}) => {
  const getIcon = (type: string) => {
    const icons: Record<string, any> = {
      image: ImageIcon,
      document: FileText,
      message: MessageSquare,
      payment: CreditCard,
    };
    const Icon = icons[type] || FileText;
    return <Icon className="w-5 h-5" />;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="bg-gray-50 dark:bg-slate-700/50 rounded-lg p-4 border border-gray-200 dark:border-slate-600">
      <div className="flex items-start justify-between">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center text-blue-600 dark:text-blue-400 mr-3">
            {getIcon(evidence.type)}
          </div>
          <div>
            <p className="font-medium text-gray-900 dark:text-gray-100">
              {evidence.type === "image" && "Image"}
              {evidence.type === "document" && "Document"}
              {evidence.type === "message" && "Message"}
              {evidence.type === "payment" && "Paiement"}
            </p>
            {evidence.description && (
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {evidence.description}
              </p>
            )}
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
              Ajouté par {evidence.uploaded_by.name} •{" "}
              {formatDate(evidence.uploaded_at)}
            </p>
          </div>
        </div>
        <button
          onClick={() => onView(evidence.url)}
          className="p-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/30 transition"
        >
          <Eye className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

// Modal de résolution
const ResolveModal = ({
  isOpen,
  onClose,
  dispute,
  onConfirm,
}: {
  isOpen: boolean;
  onClose: () => void;
  dispute: Dispute | null;
  onConfirm: (data: ResolveData) => void;
}) => {
  const [resolution, setResolution] = useState("");
  const [refundPercentage, setRefundPercentage] = useState(100);
  const [compensation, setCompensation] = useState(0);
  const [notifyUsers, setNotifyUsers] = useState(true);
  const [error, setError] = useState("");

  if (!isOpen || !dispute) return null;

  const handleSubmit = () => {
    if (!resolution.trim()) {
      setError("La résolution est requise");
      return;
    }
    onConfirm({
      resolution,
      refund_percentage: refundPercentage,
      compensation: compensation > 0 ? compensation : undefined,
      notify_users: notifyUsers,
    });
    setResolution("");
    setRefundPercentage(100);
    setCompensation(0);
    setError("");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl max-w-2xl w-full p-6 border border-gray-200 dark:border-slate-700">
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
          Résoudre le litige {dispute.id}
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Résolution *
            </label>
            <textarea
              value={resolution}
              onChange={(e) => setResolution(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100"
              placeholder="Décrivez la résolution du litige..."
            />
            {error && (
              <p className="text-red-600 dark:text-red-400 text-sm mt-1">
                {error}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Remboursement (%)
              </label>
              <select
                value={refundPercentage}
                onChange={(e) => setRefundPercentage(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100"
              >
                <option value={0}>0% - Aucun remboursement</option>
                <option value={25}>25% - Remboursement partiel</option>
                <option value={50}>50% - Remboursement partiel</option>
                <option value={75}>75% - Remboursement partiel</option>
                <option value={100}>100% - Remboursement total</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Compensation (€)
              </label>
              <input
                type="number"
                value={compensation}
                onChange={(e) => setCompensation(Number(e.target.value))}
                min={0}
                step={10}
                className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100"
                placeholder="0"
              />
            </div>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="notifyUsers"
              checked={notifyUsers}
              onChange={(e) => setNotifyUsers(e.target.checked)}
              className="rounded border-gray-300 dark:border-gray-600 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 dark:bg-slate-700"
            />
            <label
              htmlFor="notifyUsers"
              className="ml-2 text-sm text-gray-700 dark:text-gray-300"
            >
              Notifier les parties concernées
            </label>
          </div>
        </div>

        <div className="flex justify-end space-x-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-300 transition"
          >
            Annuler
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
          >
            Résoudre le litige
          </button>
        </div>
      </div>
    </div>
  );
};

// Modal de rejet
const RejectModal = ({
  isOpen,
  onClose,
  dispute,
  onConfirm,
}: {
  isOpen: boolean;
  onClose: () => void;
  dispute: Dispute | null;
  onConfirm: (data: RejectData) => void;
}) => {
  const [reason, setReason] = useState("");
  const [notifyUsers, setNotifyUsers] = useState(true);
  const [error, setError] = useState("");

  if (!isOpen || !dispute) return null;

  const handleSubmit = () => {
    if (!reason.trim()) {
      setError("La raison du rejet est requise");
      return;
    }
    onConfirm({ reason, notify_users: notifyUsers });
    setReason("");
    setError("");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl max-w-md w-full p-6 border border-gray-200 dark:border-slate-700">
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
          Rejeter le litige {dispute.id}
        </h3>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Raison du rejet *
          </label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100"
            placeholder="Expliquez pourquoi ce litige est rejeté..."
          />
          {error && (
            <p className="text-red-600 dark:text-red-400 text-sm mt-1">
              {error}
            </p>
          )}
        </div>

        <div className="flex items-center mb-6">
          <input
            type="checkbox"
            id="notifyUsers"
            checked={notifyUsers}
            onChange={(e) => setNotifyUsers(e.target.checked)}
            className="rounded border-gray-300 dark:border-gray-600 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 dark:bg-slate-700"
          />
          <label
            htmlFor="notifyUsers"
            className="ml-2 text-sm text-gray-700 dark:text-gray-300"
          >
            Notifier les parties concernées
          </label>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-300 transition"
          >
            Annuler
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
          >
            Rejeter le litige
          </button>
        </div>
      </div>
    </div>
  );
};

// Visualiseur de document
const DocumentViewer = ({
  isOpen,
  onClose,
  url,
}: {
  isOpen: boolean;
  onClose: () => void;
  url: string | null;
}) => {
  if (!isOpen || !url) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 dark:bg-opacity-90 flex items-center justify-center z-50">
      <div className="relative max-w-4xl max-h-[90vh]">
        <button
          onClick={onClose}
          className="absolute -top-10 right-0 text-white hover:text-gray-300 transition"
        >
          <XCircle className="w-8 h-8" />
        </button>
        <img
          src={url}
          alt="Document"
          className="max-w-full max-h-[90vh] object-contain"
        />
      </div>
    </div>
  );
};

export default function DisputeDetailPage() {
  const router = useRouter();
  const params = useParams();
  const disputeId = params.disputeId as string;

  const [loading, setLoading] = useState(true);
  const [dispute, setDispute] = useState<Dispute | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<string | null>(null);
  const [resolveModal, setResolveModal] = useState(false);
  const [rejectModal, setRejectModal] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "messages" | "evidence" | "timeline"
  >("messages");

  // Charger les données
  useEffect(() => {
    const loadDispute = async () => {
      try {
        setLoading(true);
        // Utiliser les mock data
        const foundDispute = mockDisputes.list.find(
          (d) => d.id === disputeId,
        ) as Dispute;
        setDispute(foundDispute || null);
      } catch (error) {
        console.error("Erreur chargement litige:", error);
      } finally {
        setLoading(false);
      }
    };

    if (disputeId) {
      loadDispute();
    }
  }, [disputeId]);

  const handleSendMessage = async () => {
    if (!dispute || !newMessage.trim()) return;
    try {
      await addDisputeMessage(dispute.id, {
        message: newMessage,
        is_private: isPrivate,
      });
      setNewMessage("");
      setIsPrivate(false);
      // Recharger le litige
    } catch (error) {
      console.error("Erreur envoi message:", error);
    }
  };

  const handleResolve = async (data: ResolveData) => {
    if (!dispute) return;
    try {
      await resolveDispute(dispute.id, data);
      // Recharger le litige
    } catch (error) {
      console.error("Erreur résolution:", error);
    }
  };

  const handleReject = async (data: RejectData) => {
    if (!dispute) return;
    try {
      await rejectDispute(dispute.id, data);
      // Recharger le litige
    } catch (error) {
      console.error("Erreur rejet:", error);
    }
  };

  const handleEscalate = async () => {
    if (!dispute) return;
    const reason = prompt("Raison de l'escalade:");
    if (reason) {
      try {
        await escalateDispute(dispute.id, reason);
        // Recharger le litige
      } catch (error) {
        console.error("Erreur escalade:", error);
      }
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  if (!dispute) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-100 mb-2">
            Litige non trouvé
          </h2>
          <p className="text-gray-400 mb-4">
            Le litige avec l'ID {disputeId} n'existe pas
          </p>
          <button
            onClick={() => router.back()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Retour
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950">
      <div className="container mx-auto px-4 py-8">
        {/* Barre de navigation */}
        <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <button
            onClick={() => router.back()}
            className="flex items-center text-gray-400 hover:text-gray-200 transition"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour à la liste
          </button>
          <div className="flex flex-wrap gap-2">
            {dispute.status === "open" || dispute.status === "in_progress" ? (
              <>
                <button
                  onClick={() => setResolveModal(true)}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center transition"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Résoudre
                </button>
                <button
                  onClick={() => setRejectModal(true)}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center transition"
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  Rejeter
                </button>
                <button
                  onClick={handleEscalate}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center transition"
                >
                  <Shield className="w-4 h-4 mr-2" />
                  Escalader
                </button>
              </>
            ) : null}
          </div>
        </div>

        {/* En-tête */}
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6 mb-6 border border-gray-200 dark:border-slate-700">
          <div className="flex flex-col lg:flex-row items-start justify-between gap-4">
            <div>
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                  Litige {dispute.id}
                </h1>
                <StatusBadge status={dispute.status} />
                <PriorityBadge priority={dispute.priority} />
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-2">
                Ouvert le {formatDate(dispute.created_at)} par{" "}
                {dispute.opened_by_name}
              </p>
              <p className="text-gray-800 dark:text-gray-200 font-medium">
                {dispute.reason}
              </p>
            </div>
            {dispute.assigned_to && (
              <div className="text-right">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                  Assigné à
                </p>
                <div className="flex items-center">
                  {dispute.assigned_to.avatar ? (
                    <img
                      src={dispute.assigned_to.avatar}
                      alt={dispute.assigned_to.name}
                      className="w-8 h-8 rounded-full mr-2 object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-slate-700 flex items-center justify-center mr-2">
                      <User className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                    </div>
                  )}
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    {dispute.assigned_to.name}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Grille d'informations */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Description du litige */}
          <div className="lg:col-span-2">
            <InfoCard icon={FileText} title="Description">
              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                {dispute.description}
              </p>
            </InfoCard>
          </div>

          {/* Informations sur le service */}
          <InfoCard icon={Briefcase} title="Service concerné">
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Titre
                </p>
                <Link
                  href={`/admin/services/${dispute.service.id}`}
                  className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium transition"
                >
                  {dispute.service.title}
                </Link>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  ID Service
                </p>
                <p className="font-medium text-gray-900 dark:text-gray-100">
                  #{dispute.service.id}
                </p>
              </div>
            </div>
          </InfoCard>

          {/* Client */}
          <InfoCard icon={User} title="Client">
            <div className="flex items-center">
              {dispute.client.avatar ? (
                <img
                  src={dispute.client.avatar}
                  alt={dispute.client.name}
                  className="w-10 h-10 rounded-full mr-3 object-cover"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-slate-700 flex items-center justify-center mr-3">
                  <User className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                </div>
              )}
              <div>
                <Link
                  href={`/admin/users/${dispute.client.id}`}
                  className="font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition"
                >
                  {dispute.client.name}
                </Link>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {dispute.opened_by === "client"
                    ? "A ouvert le litige"
                    : "Mis en cause"}
                </p>
              </div>
            </div>
          </InfoCard>

          {/* Freelancer */}
          <InfoCard icon={Briefcase} title="Freelancer">
            <div className="flex items-center">
              {dispute.freelancer.avatar ? (
                <img
                  src={dispute.freelancer.avatar}
                  alt={dispute.freelancer.name}
                  className="w-10 h-10 rounded-full mr-3 object-cover"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-slate-700 flex items-center justify-center mr-3">
                  <User className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                </div>
              )}
              <div>
                <Link
                  href={`/admin/users/${dispute.freelancer.id}`}
                  className="font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition"
                >
                  {dispute.freelancer.name}
                </Link>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {dispute.opened_by === "freelancer"
                    ? "A ouvert le litige"
                    : "Mis en cause"}
                </p>
              </div>
            </div>
          </InfoCard>
        </div>

        {/* Onglets */}
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-gray-200 dark:border-slate-700">
          <div className="border-b border-gray-200 dark:border-slate-700 px-6">
            <nav className="flex flex-wrap gap-2">
              <button
                onClick={() => setActiveTab("messages")}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition ${
                  activeTab === "messages"
                    ? "border-blue-600 text-blue-600 dark:text-blue-400"
                    : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                }`}
              >
                <MessageSquare className="w-4 h-4 inline mr-2" />
                Messages ({dispute.messages?.length || 0})
              </button>
              <button
                onClick={() => setActiveTab("evidence")}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition ${
                  activeTab === "evidence"
                    ? "border-blue-600 text-blue-600 dark:text-blue-400"
                    : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                }`}
              >
                <ImageIcon className="w-4 h-4 inline mr-2" />
                Preuves ({dispute.evidence?.length || 0})
              </button>
              <button
                onClick={() => setActiveTab("timeline")}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition ${
                  activeTab === "timeline"
                    ? "border-blue-600 text-blue-600 dark:text-blue-400"
                    : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                }`}
              >
                <Clock className="w-4 h-4 inline mr-2" />
                Chronologie
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === "messages" && (
              <div>
                {/* Liste des messages */}
                <div className="space-y-4 mb-6 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
                  {dispute.messages && dispute.messages.length > 0 ? (
                    dispute.messages.map((message) => (
                      <MessageCard
                        key={message.id}
                        message={message}
                        isOwn={message.role === "admin"}
                      />
                    ))
                  ) : (
                    <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                      Aucun message pour le moment
                    </p>
                  )}
                </div>

                {/* Formulaire d'envoi de message */}
                <div className="border-t border-gray-200 dark:border-slate-700 pt-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <input
                      type="checkbox"
                      id="privateMessage"
                      checked={isPrivate}
                      onChange={(e) => setIsPrivate(e.target.checked)}
                      className="rounded border-gray-300 dark:border-gray-600 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 dark:bg-slate-700"
                    />
                    <label
                      htmlFor="privateMessage"
                      className="text-sm text-gray-700 dark:text-gray-300 flex items-center"
                    >
                      <Shield className="w-4 h-4 mr-1" />
                      Message privé (visible uniquement par les admins)
                    </label>
                  </div>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) =>
                        e.key === "Enter" && handleSendMessage()
                      }
                      placeholder="Écrivez votre message..."
                      className="flex-1 px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100"
                    />
                    <button
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim()}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center transition"
                    >
                      <Send className="w-4 h-4 mr-2" />
                      Envoyer
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "evidence" && (
              <div className="space-y-4 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
                {dispute.evidence && dispute.evidence.length > 0 ? (
                  dispute.evidence.map((item) => (
                    <EvidenceCard
                      key={item.id}
                      evidence={item}
                      onView={(url) => setSelectedDocument(url)}
                    />
                  ))
                ) : (
                  <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                    Aucune preuve fournie
                  </p>
                )}
              </div>
            )}

            {activeTab === "timeline" && (
              <div className="space-y-4 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
                {dispute.timeline && dispute.timeline.length > 0 ? (
                  dispute.timeline.map((event) => (
                    <div key={event.id} className="flex items-start space-x-3">
                      <div className="w-2 h-2 mt-2 rounded-full bg-blue-500"></div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 dark:text-gray-100">
                          {event.action}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {event.description}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                          {new Date(event.timestamp).toLocaleString("fr-FR")} •{" "}
                          {event.user.name}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                    Aucun événement enregistré
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      <ResolveModal
        isOpen={resolveModal}
        onClose={() => setResolveModal(false)}
        dispute={dispute}
        onConfirm={handleResolve}
      />

      <RejectModal
        isOpen={rejectModal}
        onClose={() => setRejectModal(false)}
        dispute={dispute}
        onConfirm={handleReject}
      />

      <DocumentViewer
        isOpen={!!selectedDocument}
        onClose={() => setSelectedDocument(null)}
        url={selectedDocument}
      />

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
