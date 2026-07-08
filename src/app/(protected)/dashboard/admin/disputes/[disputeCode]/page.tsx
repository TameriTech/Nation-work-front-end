// app/(protected)/dashboard/admin/disputes/[disputeId]/page.tsx
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
  Send,
  Loader2,
  AlertTriangle,
  Info,
  Eye,
  ChevronDown,
  ChevronUp,
  DollarSign,
  CreditCard,
  FileCheck,
  Ban,
  Gavel,
  BookOpen,
  ThumbsUp,
  ThumbsDown,
  MinusCircle,
  FileQuestion,
  Building2,
  Users,
  Hash,
  Tag,
  CalendarDays,
  Timer,
  Receipt,
  Landmark,
  BadgeCheck,
  HelpingHand,
  LucideIcon
} from "lucide-react";

import { useDisputes } from "@/app/hooks/admin/use-disputes";
import { 
  type Dispute,
  type DisputeMessage,
  type DisputePriority, 
  type MessageType,
  DisputeEscalationReason,
  DisputeOutcome,
  DisputeResolutionMethod,
  DisputeStatus,
  type DisputeDecision,
  type DisputeAppeal,
  type DisputeEvidence
} from "@/app/types";
import type { 
  CreateDisputeMessageFormData,
  RejectDisputeFormData,
  EscalateDisputeFormData, 
  DisputeDecisionFormData
} from "@/app/lib/validators";

// ==================== COMPOSANTS DE BADGES ====================

const PriorityBadge = ({ priority }: { priority: DisputePriority }) => {
  const badges: Record<DisputePriority, { color: string; icon: LucideIcon; label: string }> = {
    urgent: {
      color: "bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800",
      icon: AlertTriangle,
      label: "Urgente",
    },
    high: {
      color: "bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-800",
      icon: AlertCircle,
      label: "Haute",
    },
    normal: {
      color: "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800",
      icon: Info,
      label: "Normale",
    },
    low: {
      color: "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800",
      icon: Clock,
      label: "Basse",
    },
  };
  const badge = badges[priority] || badges.normal;
  const Icon = badge.icon;

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${badge.color}`}>
      <Icon className="w-4 h-4 mr-2" />
      {badge.label}
    </span>
  );
};

const StatusBadge = ({ status }: { status: DisputeStatus }) => {
  const badges: Record<DisputeStatus, { color: string; icon: LucideIcon; label: string }> = {
    open: {
      color: "bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800",
      icon: AlertCircle,
      label: "Ouvert",
    },
    in_progress: {
      color: "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800",
      icon: Clock,
      label: "En cours",
    },
    resolved: {
      color: "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800",
      icon: CheckCircle,
      label: "Résolu",
    },
    dismissed: {
      color: "bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700",
      icon: XCircle,
      label: "Rejeté",
    },
    escalated: {
      color: "bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-800",
      icon: Shield,
      label: "Escaladé",
    },
  };
  const badge = badges[status] || badges.open;
  const Icon = badge.icon;

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${badge.color}`}>
      <Icon className="w-4 h-4 mr-2" />
      {badge.label}
    </span>
  );
};

const OutcomeBadge = ({ outcome }: { outcome: DisputeOutcome }) => {
  const badges: Record<DisputeOutcome, { color: string; icon: LucideIcon; label: string }> = {
    [DisputeOutcome.IN_FAVOR_OF_RAISER]: {
      color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
      icon: ThumbsUp,
      label: "En faveur du demandeur",
    },
    [DisputeOutcome.IN_FAVOR_OF_AGAINST]: {
      color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
      icon: ThumbsDown,
      label: "En faveur du défendeur",
    },
    [DisputeOutcome.COMPROMISE]: {
      color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
      icon: HelpingHand,
      label: "Compromis",
    },
    [DisputeOutcome.DISMISSED]: {
      color: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400",
      icon: Ban,
      label: "Rejeté",
    },
    [DisputeOutcome.OTHER]: {
      color: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
      icon: FileQuestion,
      label: "Autre",
    },
  };
  const badge = badges[outcome] || badges[DisputeOutcome.OTHER];
  const Icon = badge.icon;

  return (
    <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${badge.color}`}>
      <Icon className="w-3 h-3 mr-1" />
      {badge.label}
    </span>
  );
};

// ==================== COMPOSANTS DE CARTES ====================

const InfoCard = ({ icon: Icon, title, children }: { icon: LucideIcon; title: string; children: React.ReactNode }) => (
  <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-slate-700">
    <h3 className="text-lg font-semibold mb-4 flex items-center text-gray-900 dark:text-gray-100">
      <Icon className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" />
      {title}
    </h3>
    <div className="space-y-3">{children}</div>
  </div>
);

const DetailRow = ({ label, value, icon: Icon }: { label: string; value: React.ReactNode; icon?: LucideIcon }) => (
  <div className="flex items-start justify-between py-2 border-b border-gray-100 dark:border-gray-700 last:border-0">
    <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
      {Icon && <Icon className="w-4 h-4 mr-2" />}
      {label}
    </span>
    <span className="text-sm font-medium text-gray-900 dark:text-gray-100 text-right">{value || "-"}</span>
  </div>
);

const MessageCard = ({ message, isOwn }: { message: DisputeMessage; isOwn: boolean }) => {
  const formatTime = (timestamp: string) => new Date(timestamp).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });

  return (
    <div className={`flex ${isOwn ? "justify-end" : "justify-start"} mb-4`}>
      <div className={`max-w-[70%] rounded-lg p-3 ${
        isOwn ? "bg-blue-600 text-white" : message.is_private
          ? "bg-purple-100 dark:bg-purple-900/30 text-gray-900 dark:text-gray-100 border border-purple-200 dark:border-purple-800"
          : "bg-gray-100 dark:bg-slate-700 text-gray-900 dark:text-gray-100"
      }`}>
        {!isOwn && (
          <div className="flex items-center mb-1">
            <span className="font-medium text-sm">{message.sender_name}</span>
            {message.sender_role === "admin" && (
              <span className="ml-2 text-xs px-1.5 py-0.5 bg-blue-200 dark:bg-blue-800 rounded">Admin</span>
            )}
            {message.is_private && (
              <span className="ml-2 text-xs px-1.5 py-0.5 bg-purple-200 dark:bg-purple-800 rounded flex items-center">
                <Shield className="w-3 h-3 mr-1" /> Privé
              </span>
            )}
          </div>
        )}
        <p className="text-sm">{message.message}</p>
        <p className={`text-xs mt-1 ${isOwn ? "text-blue-100" : "text-gray-500 dark:text-gray-400"}`}>
          {formatTime(message.created_at)}
        </p>
      </div>
    </div>
  );
};

const EvidenceCard = ({ evidence, onView }: { evidence: DisputeEvidence; onView: (url: string) => void }) => {
  const getIcon = (type: string) => {
    const icons: Record<string, LucideIcon> = { image: ImageIcon, document: FileText, message: MessageSquare, payment: CreditCard };
    return icons[type] || FileText;
  };
  const Icon = getIcon(evidence.evidence_type);
  const formatDate = (date: string) => new Date(date).toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });

  return (
    <div className="bg-gray-50 dark:bg-slate-700/50 rounded-lg p-4 border border-gray-200 dark:border-slate-600">
      <div className="flex items-start justify-between">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center text-blue-600 dark:text-blue-400 mr-3">
            <Icon className="w-5 h-5" />
          </div>
          <div>
            <p className="font-medium text-gray-900 dark:text-gray-100 capitalize">{evidence.evidence_type}</p>
            {evidence.description && <p className="text-sm text-gray-600 dark:text-gray-400">{evidence.description}</p>}
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
              Ajouté par {evidence.uploaded_by_name} • {formatDate(evidence.created_at)}
            </p>
          </div>
        </div>
        <button onClick={() => onView(evidence.evidence_url)} className="p-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/30 transition">
          <Eye className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

const DecisionCard = ({ decision, isLatest }: { decision: DisputeDecision; isLatest: boolean }) => {
  const [expanded, setExpanded] = useState(false);
  const isResolution = decision.decision_type === "resolution";
  const formatDate = (date: string) => new Date(date).toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });
  const formatCurrency = (amount: number | null) => amount ? new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(amount) : "0 €";

  return (
    <div className={`border rounded-lg overflow-hidden ${isLatest ? "border-green-300 dark:border-green-700 bg-green-50/20 dark:bg-green-900/5" : "border-gray-200 dark:border-gray-700"}`}>
      <div className="p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition flex items-center justify-between" onClick={() => setExpanded(!expanded)}>
        <div className="flex items-center space-x-3">
          {isResolution ? <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" /> : <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />}
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-medium text-gray-900 dark:text-gray-100">{isResolution ? "Résolution" : "Rejet"} #{decision.id}</span>
              {isLatest && <span className="text-xs px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full">Décision finale</span>}
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Par {decision.made_by_name || "Admin"} • {formatDate(decision.created_at)}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {isResolution && decision.outcome && <OutcomeBadge outcome={decision.outcome} />}
          {expanded ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
        </div>
      </div>
      {expanded && (
        <div className="p-4 border-t border-gray-100 dark:border-gray-700 space-y-3">
          <div>
            <div className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"><FileText className="w-4 h-4 mr-1" /> Motif</div>
            <p className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">{decision.reason}</p>
          </div>
          {isResolution && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"><Gavel className="w-4 h-4 mr-1" /> Méthode</div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 capitalize">{decision.resolution_method?.replace(/_/g, " ").toLowerCase() || "-"}</p>
                </div>
                <div>
                  <div className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"><Shield className="w-4 h-4 mr-1" /> Appel</div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {decision.can_appeal ? <span className="text-green-600">Oui</span> : <span className="text-red-600">Non</span>}
                    {decision.appeal_deadline && decision.can_appeal && <span className="text-xs text-gray-500 ml-2">(jusqu'au {formatDate(decision.appeal_deadline)})</span>}
                  </p>
                </div>
              </div>
              {(decision.refund_amount || decision.compensation_amount || decision.platform_fee_refunded) && (
                <div>
                  <div className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"><DollarSign className="w-4 h-4 mr-1" /> Détails financiers</div>
                  <div className="space-y-1 text-sm">
                    {decision.refund_amount && decision.refund_amount > 0 && <p className="text-gray-600">Remboursement : {formatCurrency(decision.refund_amount)}</p>}
                    {decision.compensation_amount && decision.compensation_amount > 0 && <p className="text-gray-600">Compensation : {formatCurrency(decision.compensation_amount)}</p>}
                    {decision.platform_fee_refunded && <p className="text-gray-600">Frais de plateforme : Remboursés</p>}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

const ActiveAppealCard = ({ appeal }: { appeal: DisputeAppeal }) => {
  const formatDate = (date: string | null) => date ? new Date(date).toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" }) : "N/A";
  const statusConfig: Record<string, { label: string; color: string; icon: LucideIcon }> = {
    pending: { label: "En attente", color: "text-yellow-600 bg-yellow-50 dark:text-yellow-400 dark:bg-yellow-900/30", icon: Clock },
    under_review: { label: "En révision", color: "text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-900/30", icon: AlertCircle },
    approved: { label: "Approuvé", color: "text-green-600 bg-green-50 dark:text-green-400 dark:bg-green-900/30", icon: CheckCircle },
    rejected: { label: "Rejeté", color: "text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-900/30", icon: XCircle },
  };
  const status = statusConfig[appeal.status] || statusConfig.pending;
  const StatusIcon = status.icon;

  return (
    <div className="border border-orange-200 dark:border-orange-800 rounded-lg overflow-hidden">
      <div className="p-4 bg-orange-50 dark:bg-orange-900/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <AlertCircle className="w-5 h-5 text-orange-600 dark:text-orange-400" />
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-medium text-gray-900 dark:text-gray-100">Appel en cours</span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${status.color}`}><StatusIcon className="w-3 h-3 inline mr-1" />{status.label}</span>
              </div>
              <p className="text-sm text-gray-500">Déposé par {appeal.appealed_by_name || "Utilisateur"} • {formatDate(appeal.created_at)}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="p-4">
        <div className="mb-3">
          <div className="flex items-center text-sm font-medium text-gray-700 mb-1"><FileText className="w-4 h-4 mr-1" /> Motif</div>
          <p className="text-sm text-gray-600 bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">{appeal.reason}</p>
        </div>
        {appeal.reviewed_by_name && (
          <div className="text-sm text-gray-500">Révisé par {appeal.reviewed_by_name} • {formatDate(appeal.reviewed_at)}</div>
        )}
      </div>
    </div>
  );
};

// ==================== MODALS ====================

const ResolveModal = ({ isOpen, onClose, dispute, onConfirm, isResolving = false }: any) => {
  const [reason, setReason] = useState("");
  const [outcome, setOutcome] = useState<DisputeOutcome>(DisputeOutcome.IN_FAVOR_OF_RAISER);
  const [refundAmount, setRefundAmount] = useState(0);
  const [compensationAmount, setCompensationAmount] = useState(0);
  const [platformFeeRefunded, setPlatformFeeRefunded] = useState(false);
  const [notifyParties, setNotifyParties] = useState(true);
  const [canAppeal, setCanAppeal] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!isOpen) {
      setReason(""); setOutcome(DisputeOutcome.IN_FAVOR_OF_RAISER); setRefundAmount(0); setCompensationAmount(0);
      setPlatformFeeRefunded(false); setNotifyParties(true); setCanAppeal(true); setErrors({}); setTouched({});
    }
  }, [isOpen]);

  if (!isOpen || !dispute) return null;

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!reason.trim()) newErrors.reason = "La résolution est requise";
    else if (reason.trim().length < 10) newErrors.reason = "La résolution doit contenir au moins 10 caractères";
    else if (reason.trim().length > 2000) newErrors.reason = "La résolution ne peut pas dépasser 2000 caractères";
    if (refundAmount > 0 && refundAmount > (dispute.amount_in_dispute || 0)) newErrors.refund_amount = `Le remboursement ne peut pas dépasser ${dispute.amount_in_dispute}€`;
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    onConfirm({
      decision_type: "resolution", reason: reason.trim(), is_final: true, can_appeal: canAppeal,
      resolution_method: DisputeResolutionMethod.ADMIN_DECISION, outcome: outcome,
      platform_fee_refunded: platformFeeRefunded, refund_amount: refundAmount > 0 ? refundAmount : undefined,
      compensation_amount: compensationAmount > 0 ? compensationAmount : undefined, notify_parties: notifyParties
    });
  };

  const getOutcomeLabel = (o: DisputeOutcome) => ({ [DisputeOutcome.IN_FAVOR_OF_RAISER]: "En faveur du client", [DisputeOutcome.IN_FAVOR_OF_AGAINST]: "En faveur du freelance", [DisputeOutcome.COMPROMISE]: "Compromis", [DisputeOutcome.DISMISSED]: "Rejeté", [DisputeOutcome.OTHER]: "Autre" }[o]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl max-w-2xl w-full p-6 border max-h-[90vh] overflow-y-auto">
        <h3 className="text-lg font-semibold mb-4">Résoudre le litige #{dispute.id}</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Résolution *</label>
            <textarea value={reason} onChange={(e) => setReason(e.target.value)} rows={4} disabled={isResolving}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${touched.reason && errors.reason ? "border-red-500" : "border-gray-300"}`}
              placeholder="Décrivez la résolution du litige..." />
            {touched.reason && errors.reason && <p className="text-red-600 text-sm mt-1">{errors.reason}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Décision *</label>
            <select value={outcome} onChange={(e) => setOutcome(e.target.value as DisputeOutcome)} disabled={isResolving}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
              {Object.values(DisputeOutcome).map((v) => <option key={v} value={v}>{getOutcomeLabel(v)}</option>)}
            </select>
          </div>
          {(outcome === DisputeOutcome.IN_FAVOR_OF_RAISER || outcome === DisputeOutcome.COMPROMISE) && (
            <div className="grid grid-cols-2 gap-4">
              <div><label className="block text-sm font-medium mb-2">Montant à rembourser (€)</label>
                <input type="number" value={refundAmount} onChange={(e) => setRefundAmount(Number(e.target.value))} min={0} max={dispute.amount_in_dispute || 0} disabled={isResolving}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg" placeholder="0" />
              </div>
            </div>
          )}
          <div><label className="block text-sm font-medium mb-2">Compensation supplémentaire (€)</label>
            <input type="number" value={compensationAmount} onChange={(e) => setCompensationAmount(Number(e.target.value))} min={0} disabled={isResolving}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg" placeholder="0" />
          </div>
          <div className="space-y-2">
            <label className="flex items-center"><input type="checkbox" checked={platformFeeRefunded} onChange={(e) => setPlatformFeeRefunded(e.target.checked)} className="mr-2" /> Rembourser les frais de plateforme</label>
            <label className="flex items-center"><input type="checkbox" checked={canAppeal} onChange={(e) => setCanAppeal(e.target.checked)} className="mr-2" /> Autoriser l'appel de cette décision</label>
            <label className="flex items-center"><input type="checkbox" checked={notifyParties} onChange={(e) => setNotifyParties(e.target.checked)} className="mr-2" /> Notifier les parties concernées</label>
          </div>
        </div>
        <div className="flex justify-end space-x-3 mt-6">
          <button onClick={onClose} className="px-4 py-2 border rounded-lg">Annuler</button>
          <button onClick={handleSubmit} disabled={isResolving || !reason.trim()} className="px-4 py-2 bg-green-600 text-white rounded-lg flex items-center">
            {isResolving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />} Confirmer la résolution
          </button>
        </div>
      </div>
    </div>
  );
};

const RejectModal = ({ isOpen, onClose, dispute, onConfirm, isRejecting = false }: any) => {
  const [reason, setReason] = useState("");
  const [notifyUsers, setNotifyUsers] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => { if (!isOpen) { setReason(""); setNotifyUsers(true); setError(""); } }, [isOpen]);
  if (!isOpen || !dispute) return null;

  const handleSubmit = () => {
    if (!reason.trim()) { setError("La raison du rejet est requise"); return; }
    onConfirm({ reason: reason, notify_users: notifyUsers });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl max-w-md w-full p-6">
        <h3 className="text-lg font-semibold mb-4">Rejeter le litige #{dispute.id}</h3>
        <textarea value={reason} onChange={(e) => setReason(e.target.value)} rows={4} disabled={isRejecting}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-4" placeholder="Expliquez pourquoi ce litige est rejeté..." />
        {error && <p className="text-red-600 text-sm mb-2">{error}</p>}
        <label className="flex items-center mb-6"><input type="checkbox" checked={notifyUsers} onChange={(e) => setNotifyUsers(e.target.checked)} className="mr-2" /> Notifier les parties concernées</label>
        <div className="flex justify-end space-x-3">
          <button onClick={onClose} className="px-4 py-2 border rounded-lg">Annuler</button>
          <button onClick={handleSubmit} disabled={isRejecting} className="px-4 py-2 bg-red-600 text-white rounded-lg flex items-center">
            {isRejecting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />} Rejeter le litige
          </button>
        </div>
      </div>
    </div>
  );
};

const EscalateModal = ({ isOpen, onClose, dispute, onConfirm, isEscalating = false }: any) => {
  const [reason, setReason] = useState<DisputeEscalationReason>(DisputeEscalationReason.OTHER);
  const [details, setDetails] = useState("");
  const [requestedPriority, setRequestedPriority] = useState<DisputePriority>("high");
  const [error, setError] = useState("");

  useEffect(() => { if (!isOpen) { setReason(DisputeEscalationReason.OTHER); setDetails(""); setRequestedPriority("high"); setError(""); } }, [isOpen]);
  if (!isOpen || !dispute) return null;

  const handleSubmit = () => {
    if (!details.trim() || details.length < 10) { setError("Les détails doivent contenir au moins 10 caractères"); return; }
    onConfirm({ reason, details, requested_priority: requestedPriority, additional_evidence: {} });
  };

  const getReasonLabel = (r: DisputeEscalationReason) => ({ [DisputeEscalationReason.UNSATISFACTORY_RESOLUTION]: "Résolution insatisfaisante", [DisputeEscalationReason.NO_RESPONSE]: "Absence de réponse", [DisputeEscalationReason.NEW_EVIDENCE]: "Nouvelles preuves", [DisputeEscalationReason.UNFAIR_TREATMENT]: "Traitement injuste", [DisputeEscalationReason.TECHNICAL_ISSUE]: "Problème technique", [DisputeEscalationReason.ADMIN_UNRESPONSIVE]: "Admin non réactif", [DisputeEscalationReason.POLICY_VIOLATION]: "Violation des politiques", [DisputeEscalationReason.FRAUD_SUSPECTED]: "Fraude suspectée", [DisputeEscalationReason.OTHER]: "Autre" }[r]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white dark:bg-slate-800 border-b p-4"><h3 className="text-lg font-semibold">Escalader le litige #{dispute.id}</h3></div>
        <div className="p-6 space-y-4">
          <div className="bg-yellow-50 p-3 rounded-lg flex items-start"><AlertTriangle className="w-5 h-5 text-yellow-600 mr-2 flex-shrink-0 mt-0.5" /><p className="text-sm text-yellow-800">L'escalade est une action importante qui impliquera un supérieur.</p></div>
          <select value={reason} onChange={(e) => setReason(e.target.value as DisputeEscalationReason)} className="w-full px-3 py-2 border rounded-lg">
            {Object.values(DisputeEscalationReason).map((r) => <option key={r} value={r}>{getReasonLabel(r)}</option>)}
          </select>
          <textarea value={details} onChange={(e) => setDetails(e.target.value)} rows={5} placeholder="Expliquez pourquoi ce litige doit être escaladé..." className="w-full px-3 py-2 border rounded-lg" />
          <select value={requestedPriority} onChange={(e) => setRequestedPriority(e.target.value as DisputePriority)} className="w-full px-3 py-2 border rounded-lg">
            <option value="urgent">🚨 Urgente</option><option value="high">⚠️ Haute</option><option value="normal">📋 Normale</option><option value="low">⏰ Basse</option>
          </select>
          {error && <p className="text-red-600 text-sm">{error}</p>}
        </div>
        <div className="sticky bottom-0 bg-white dark:bg-slate-800 border-t p-4 flex justify-end space-x-3">
          <button onClick={onClose} className="px-4 py-2 border rounded-lg">Annuler</button>
          <button onClick={handleSubmit} disabled={isEscalating || !details.trim() || details.length < 10} className="px-4 py-2 bg-purple-600 text-white rounded-lg flex items-center">
            {isEscalating && <Loader2 className="w-4 h-4 mr-2 animate-spin" />} Confirmer l'escalade
          </button>
        </div>
      </div>
    </div>
  );
};

const DocumentViewer = ({ isOpen, onClose, url }: { isOpen: boolean; onClose: () => void; url: string | null }) => {
  if (!isOpen || !url) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="relative max-w-4xl max-h-[90vh]"><button onClick={onClose} className="absolute -top-10 right-0 text-white"><XCircle className="w-8 h-8" /></button><img src={url} alt="Document" className="max-w-full max-h-[90vh] object-contain" /></div>
    </div>
  );
};

// ==================== PAGE PRINCIPALE ====================

export default function DisputeDetailPage() {
  const router = useRouter();
  const params = useParams();
  const disputeCode = params.disputeCode;
  const { getDispute, addMessage, isAddingMessage, resolveDispute, isResolving, rejectDispute, isRejecting, escalateDispute, isEscalating } = useDisputes();
  const { data: dispute, isLoading, refetch } = getDispute(disputeCode);
  const [newMessage, setNewMessage] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<string | null>(null);
  const [resolveModal, setResolveModal] = useState(false);
  const [rejectModal, setRejectModal] = useState(false);
  const [escalateModal, setEscalateModal] = useState(false);
  const [activeTab, setActiveTab] = useState<"overview" | "messages" | "evidence" | "decisions" | "timeline">("overview");

  const handleSendMessage = async () => {
    if (!dispute || !newMessage.trim()) return;
    await addMessage({ disputeCode: dispute.code, data: { message: newMessage, message_type: "admin_message" as MessageType, attachments: [], is_private: isPrivate } });
    setNewMessage(""); setIsPrivate(false); refetch();
  };

  const handleResolve = async (data: DisputeDecisionFormData) => { await resolveDispute({ disputeCode: dispute.code, data }); setResolveModal(false); refetch(); };
  const handleReject = async (data: RejectDisputeFormData) => { await rejectDispute({ disputeCode: dispute.code, data }); setRejectModal(false); refetch(); };
  const handleEscalateConfirm = async (data: EscalateDisputeFormData) => { await escalateDispute({ disputeCode: dispute.code, data }); setEscalateModal(false); refetch(); };

  const formatDate = (date: string) => new Date(date).toLocaleDateString("fr-FR", { weekday: "long", year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" });
  const formatCurrency = (amount: number | null | undefined) => amount ? new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(amount) : "0 €";

  if (isLoading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 text-blue-600 animate-spin" /></div>;
  if (!dispute) return <div className="min-h-screen flex items-center justify-center"><div className="text-center"><XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" /><h2 className="text-2xl font-bold mb-2">Litige non trouvé</h2><button onClick={() => router.back()} className="px-4 py-2 bg-blue-600 text-white rounded-lg">Retour</button></div></div>;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6 flex flex-col sm:flex-row justify-between gap-4">
          <button onClick={() => router.back()} className="flex items-center text-gray-600 hover:text-gray-900"><ArrowLeft className="w-4 h-4 mr-2" /> Retour</button>
          {(dispute.status === "open" || dispute.status === "in_progress") && (
            <div className="flex gap-2">
              <button onClick={() => setResolveModal(true)} disabled={isResolving} className="px-4 py-2 bg-green-600 text-white rounded-lg flex items-center">
                {isResolving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <CheckCircle className="w-4 h-4 mr-2" />} Résoudre
              </button>
              <button onClick={() => setRejectModal(true)} disabled={isRejecting} className="px-4 py-2 bg-red-600 text-white rounded-lg flex items-center">
                {isRejecting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <XCircle className="w-4 h-4 mr-2" />} Rejeter
              </button>
              <button onClick={() => setEscalateModal(true)} disabled={isEscalating} className="px-4 py-2 bg-purple-600 text-white rounded-lg flex items-center">
                {isEscalating ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Shield className="w-4 h-4 mr-2" />} Escalader
              </button>
            </div>
          )}
        </div>

        {/* En-tête du litige */}
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6 mb-6 border">
          <div className="flex flex-wrap justify-between items-start gap-4">
            <div>
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <h1 className="text-2xl font-bold">{dispute.title}</h1>
                <StatusBadge status={dispute.status} />
                <PriorityBadge priority={dispute.priority} />
              </div>
              <p className="text-gray-500 text-sm mb-2">Code: {dispute.code} • Ouvert le {formatDate(dispute.created_at)} par {dispute.raised_by.full_name || dispute.raised_by.username}</p>
              <p className="text-gray-700">{dispute.reason}</p>
            </div>
            <div className="bg-gray-50 dark:bg-slate-700/50 rounded-lg p-3 min-w-[200px]">
              <p className="text-sm text-gray-500 mb-1">Montant du litige</p>
              <p className="text-2xl font-bold text-blue-600">{formatCurrency(dispute.amount_in_dispute)}</p>
            </div>
          </div>
        </div>

        {/* Grille d'informations */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <InfoCard icon={FileText} title="Description">
            <p className="text-gray-700 whitespace-pre-line">{dispute.description || "Aucune description fournie"}</p>
          </InfoCard>

          <InfoCard icon={Briefcase} title="Service concerné">
            <DetailRow label="Titre" value={<Link href={`/admin/services/${dispute.service?.id}`} className="text-blue-600 hover:underline">{dispute.service?.title}</Link>} icon={Tag} />
            <DetailRow label="Code" value={dispute.service?.code} icon={Hash} />
            <DetailRow label="Montant" value={formatCurrency(dispute.service?.proposed_amount)} icon={DollarSign} />
            <DetailRow label="Statut" value={<span className="capitalize">{dispute.service?.status}</span>} icon={AlertCircle} />
          </InfoCard>

          <InfoCard icon={Users} title="Parties prenantes">
            <DetailRow label="Demandeur" value={<div><div>{dispute.raised_by.full_name || dispute.raised_by.username}</div><div className="text-xs text-gray-500 capitalize">{dispute.raised_by.role}</div></div>} icon={User} />
            <DetailRow label="Défendeur" value={<div><div>{dispute.raised_against.full_name || dispute.raised_against.username}</div><div className="text-xs text-gray-500 capitalize">{dispute.raised_against.role}</div></div>} icon={Building2} />
            {dispute.resolved_by && <DetailRow label="Résolu par" value={dispute.resolved_by.full_name || dispute.resolved_by.username} icon={BadgeCheck} />}
          </InfoCard>
        </div>

        {/* Résolution existante */}
        {dispute.status === "resolved" && dispute.resolution && (
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold mb-3 flex items-center text-green-800 dark:text-green-300"><CheckCircle className="w-5 h-5 mr-2" /> Résolution du litige</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><p className="text-sm text-gray-500">Décision</p><OutcomeBadge outcome={dispute.outcome || DisputeOutcome.OTHER} /></div>
              <div><p className="text-sm text-gray-500">Méthode</p><p className="capitalize">{dispute.resolution_method?.replace(/_/g, " ").toLowerCase() || "-"}</p></div>
              {dispute.refund_amount && dispute.refund_amount > 0 && <div><p className="text-sm text-gray-500">Remboursement</p><p className="font-medium">{formatCurrency(dispute.refund_amount)}</p></div>}
              {dispute.compensation_amount && dispute.compensation_amount > 0 && <div><p className="text-sm text-gray-500">Compensation</p><p className="font-medium">{formatCurrency(dispute.compensation_amount)}</p></div>}
              {dispute.platform_fee_refunded && <div><p className="text-sm text-gray-500">Frais de plateforme</p><p className="text-green-600">Remboursés</p></div>}
              <div className="md:col-span-2"><p className="text-sm text-gray-500 mb-1">Détails</p><p className="text-gray-700">{dispute.resolution}</p></div>
            </div>
          </div>
        )}

        {/* Onglets */}
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg border">
          <div className="border-b px-6 overflow-x-auto">
            <nav className="flex gap-4">
              {[
                { key: "overview", icon: Info, label: "Aperçu" },
                { key: "messages", icon: MessageSquare, label: `Messages (${dispute.messages?.length || 0})` },
                { key: "evidence", icon: ImageIcon, label: `Preuves (${dispute.evidences?.length || 0})` },
                { key: "decisions", icon: Scale, label: `Décisions (${dispute.decisions?.length || 0})` },
                { key: "timeline", icon: Clock, label: "Chronologie" }
              ].map(tab => (
                <button key={tab.key} onClick={() => setActiveTab(tab.key as any)} className={`py-4 px-1 border-b-2 font-medium text-sm transition flex items-center ${activeTab === tab.key ? "border-blue-600 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700"}`}>
                  <tab.icon className="w-4 h-4 mr-2" /> {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {/* Onglet Aperçu */}
            {activeTab === "overview" && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 dark:bg-slate-700/30 rounded-lg p-4"><p className="text-sm text-gray-500">Soumis le</p><p className="font-medium">{formatDate(dispute.submitted_at)}</p></div>
                  {dispute.under_review_at && <div className="bg-gray-50 rounded-lg p-4"><p className="text-sm text-gray-500">Mis en révision le</p><p className="font-medium">{formatDate(dispute.under_review_at)}</p></div>}
                  {dispute.escalated_at && <div className="bg-gray-50 rounded-lg p-4"><p className="text-sm text-gray-500">Escaladé le</p><p className="font-medium">{formatDate(dispute.escalated_at)}</p></div>}
                  {dispute.resolved_at && <div className="bg-gray-50 rounded-lg p-4"><p className="text-sm text-gray-500">Résolu le</p><p className="font-medium">{formatDate(dispute.resolved_at)}</p></div>}
                  {dispute.escalation_level && <div className="bg-gray-50 rounded-lg p-4"><p className="text-sm text-gray-500">Niveau d'escalade</p><p className="font-medium capitalize">{dispute.escalation_level.replace(/_/g, " ").toLowerCase()}</p></div>}
                </div>
                {dispute.is_appealed && <div className="bg-amber-50 rounded-lg p-4"><p className="text-sm text-amber-600">Un appel a été déposé contre la décision</p></div>}
              </div>
            )}

            {/* Onglet Messages */}
            {activeTab === "messages" && (
              <div>
                <div className="space-y-4 mb-6 max-h-96 overflow-y-auto pr-2">
                  {dispute.messages && dispute.messages.length > 0 ? dispute.messages.map((msg) => <MessageCard key={msg.id} message={msg} isOwn={msg.sender_role === "admin"} />)
                    : <p className="text-center text-gray-500 py-8">Aucun message pour le moment</p>}
                </div>
                <div className="border-t pt-4">
                  <label className="flex items-center mb-2"><input type="checkbox" checked={isPrivate} onChange={(e) => setIsPrivate(e.target.checked)} className="mr-2" /> Message privé (visible uniquement par les admins)</label>
                  <div className="flex gap-2"><input type="text" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} onKeyPress={(e) => e.key === "Enter" && handleSendMessage()} disabled={isAddingMessage} placeholder="Écrivez votre message..." className="flex-1 px-4 py-2 border rounded-lg" />
                    <button onClick={handleSendMessage} disabled={!newMessage.trim() || isAddingMessage} className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center">{isAddingMessage ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Send className="w-4 h-4 mr-2" />} Envoyer</button>
                  </div>
                </div>
              </div>
            )}

            {/* Onglet Preuves */}
            {activeTab === "evidence" && (
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {dispute.evidences && dispute.evidences.length > 0 ? dispute.evidences.map((item) => <EvidenceCard key={item.id} evidence={item} onView={(url) => setSelectedDocument(url)} />)
                  : <p className="text-center text-gray-500 py-8">Aucune preuve fournie</p>}
              </div>
            )}

            {/* Onglet Décisions */}
            {activeTab === "decisions" && (
              <div className="space-y-4">
                {dispute.active_appeal && <ActiveAppealCard appeal={dispute.active_appeal} />}
                {dispute.decisions && dispute.decisions.length > 0 ? (
                  <div className="space-y-3">
                    <h3 className="text-md font-semibold">Historique des décisions</h3>
                    {dispute.decisions.map((decision, idx) => <DecisionCard key={decision.id} decision={decision} isLatest={idx === 0 && decision.is_final} />)}
                  </div>
                ) : <p className="text-center text-gray-500 py-8">Aucune décision n'a encore été prise pour ce litige</p>}
              </div>
            )}

            {/* Onglet Chronologie */}
            {activeTab === "timeline" && (
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {dispute.timeline && dispute.timeline.length > 0 ? dispute.timeline.map((event) => (
                  <div key={event.id} className="flex items-start space-x-3"><div className="w-2 h-2 mt-2 rounded-full bg-blue-500"></div><div><p className="font-medium">{event.action}</p><p className="text-sm text-gray-600">{event.description}</p><p className="text-xs text-gray-500 mt-1">{new Date(event.timestamp).toLocaleString("fr-FR")} • {event.user_name}</p></div></div>
                )) : <p className="text-center text-gray-500 py-8">Aucun événement enregistré</p>}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      <ResolveModal isOpen={resolveModal} onClose={() => setResolveModal(false)} dispute={dispute} onConfirm={handleResolve} isResolving={isResolving} />
      <RejectModal isOpen={rejectModal} onClose={() => setRejectModal(false)} dispute={dispute} onConfirm={handleReject} isRejecting={isRejecting} />
      <EscalateModal isOpen={escalateModal} onClose={() => setEscalateModal(false)} dispute={dispute} onConfirm={handleEscalateConfirm} isEscalating={isEscalating} />
      <DocumentViewer isOpen={!!selectedDocument} onClose={() => setSelectedDocument(null)} url={selectedDocument} />
    </div>
  );
}