// app/admin/payments/[invoiceNumber]/page.tsx

"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  Clock,
  Shield,
  Download,
  Loader2,
  User,
  Briefcase,
  FileText,
  CreditCard,
  Smartphone,
  Banknote,
  Landmark,
  Copy,
  Check,
  RefreshCw,
  AlertCircle,
} from "lucide-react";

import { usePayments } from "@/app/hooks/payments/use-payments";

// Composants réutilisables
const InfoCard = ({ icon: Icon, title, children }: any) => (
  <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-slate-700">
    <h3 className="text-lg font-semibold mb-4 flex items-center text-gray-900 dark:text-gray-100">
      <Icon className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" />
      {title}
    </h3>
    <div className="space-y-3">{children}</div>
  </div>
);

const StatusBadge = ({ status }: { status: string }) => {
  const badges: Record<string, any> = {
    paid: { color: "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800", icon: CheckCircle, label: "Payé" },
    pending: { color: "bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800", icon: Clock, label: "En attente" },
    escrow: { color: "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800", icon: Shield, label: "Séquestre" },
    refunded: { color: "bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-800", icon: XCircle, label: "Remboursé" },
    failed: { color: "bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800", icon: AlertCircle, label: "Échoué" },
  };
  const badge = badges[status] || badges.pending;
  const Icon = badge.icon;

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${badge.color}`}>
      <Icon className="w-4 h-4 mr-2" />
      {badge.label}
    </span>
  );
};

const RefundModal = ({ isOpen, onClose, payment, onConfirm }: any) => {
  const [reason, setReason] = useState("");
  const [amount, setAmount] = useState<number>(payment?.amount || 0);
  const [fullRefund, setFullRefund] = useState(true);
  const [error, setError] = useState("");

  if (!isOpen || !payment) return null;

  const handleSubmit = () => {
    if (!reason.trim()) {
      setError("La raison est requise");
      return;
    }
    if (!fullRefund && (!amount || amount <= 0)) {
      setError("Le montant doit être supérieur à 0");
      return;
    }
    if (!fullRefund && amount > payment.amount) {
      setError("Le montant ne peut pas dépasser le montant original");
      return;
    }
    onConfirm(reason, fullRefund ? undefined : amount);
    setReason("");
    setAmount(payment.amount);
    setFullRefund(true);
    setError("");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl max-w-md w-full p-6 border border-gray-200 dark:border-slate-700">
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">Rembourser la transaction</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Vous êtes sur le point de rembourser la transaction{" "}
          <span className="font-medium text-gray-900 dark:text-gray-100">{payment.id || payment.invoice_number}</span>
        </p>

        <div className="mb-4">
          <label className="flex items-center mb-3">
            <input
              type="checkbox"
              checked={fullRefund}
              onChange={(e) => {
                setFullRefund(e.target.checked);
                if (e.target.checked) setAmount(payment.amount);
              }}
              className="rounded border-gray-300 dark:border-gray-600 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 dark:bg-slate-700"
            />
            <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Remboursement total</span>
          </label>

          {!fullRefund && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Montant à rembourser (max: {payment.amount}€)
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                max={payment.amount}
                min={0}
                step={0.01}
                className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100"
              />
            </div>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Raison du remboursement *</label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100"
            placeholder="Expliquez la raison du remboursement..."
          />
          {error && <p className="text-red-600 dark:text-red-400 text-sm mt-1">{error}</p>}
        </div>

        <div className="flex justify-end space-x-3">
          <button onClick={onClose} className="px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-300 transition">
            Annuler
          </button>
          <button onClick={handleSubmit} className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition">
            Confirmer le remboursement
          </button>
        </div>
      </div>
    </div>
  );
};

export default function PaymentDetailPage() {
  const router = useRouter();
  const params = useParams();
  const invoiceNumber = params.invoiceNumber as string;

  // Utilisation correcte du hook usePayments avec isAdmin=true
  const { 
    transaction, 
    markAsPaid, 
    isMarkingAsPaid,
    refundTransaction, 
    isRefunding,
    generateInvoice,
    refetchTransactions
  } = usePayments(true); // isAdmin = true

  // Récupérer la transaction spécifique
  const { 
    data: payment, 
    isLoading, 
    error,
    refetch 
  } = transaction(invoiceNumber);
  
  const [refundModal, setRefundModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [isRefetching, setIsRefetching] = useState(false);

  const handleMarkAsPaid = async () => {
    if (!payment) return;
    setActionLoading(true);
    
    try {
      await markAsPaid({
        transactionId: payment.id || payment.invoice_number,
        data: {
          notes: "Marqué comme payé par l'administrateur",
        },
      });
      await refetch(); // Recharge les données après l'action
    } catch (error) {
      console.error("Erreur marquage paiement:", error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleRefund = async (reason: string, amount?: number) => {
    if (!payment) return;
    setActionLoading(true);
    
    try {
      await refundTransaction({
        transactionId: payment.invoice_number,
        data: {
          reason,
          amount,
          notify_users: true,
        },
      });
      await refetch(); // Recharge les données après le remboursement
    } catch (error) {
      console.error("Erreur remboursement:", error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDownloadInvoice = async () => {
    if (!payment) return;
    setActionLoading(true);
    
    try {
      await generateInvoice(payment.id || payment.invoice_number);
    } catch (error) {
      console.error("Erreur téléchargement facture:", error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefetching(true);
    await refetch();
    setIsRefetching(false);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
    }).format(amount);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("fr-FR", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getMethodIcon = (method: string) => {
    const icons: Record<string, any> = {
      card: CreditCard,
      mobile_money: Smartphone,
      cash: Banknote,
      bank_transfer: Landmark,
    };
    const Icon = icons[method] || CreditCard;
    return <Icon className="w-5 h-5 text-gray-500 dark:text-gray-400" />;
  };

  const getMethodLabel = (method: string) => {
    const labels: Record<string, string> = {
      card: "Carte bancaire",
      mobile_money: "Mobile Money",
      cash: "Espèces",
      bank_transfer: "Virement bancaire",
    };
    return labels[method] || method;
  };

  // États de chargement
  if (isLoading) {
    return (
      <div className="min-h-screen dark:bg-slate-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  // États d'erreur
  if (error || !payment) {
    return (
      <div className="min-h-screen dark:bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Transaction non trouvée
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {error?.message || `La transaction avec le numéro de facture ${invoiceNumber} n'existe pas`}
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

  // Déterminer si une action est en cours
  const isActionLoading = actionLoading || isMarkingAsPaid || isRefunding;

  return (
    <div className="min-h-screen dark:bg-slate-950">
      <div className="container mx-auto px-4 py-8">
        {/* Barre de navigation */}
        <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <button
            onClick={() => router.back()}
            className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition"
            disabled={isActionLoading || isRefetching}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour à la liste
          </button>
          <div className="flex flex-wrap gap-2">
            {payment.status === "pending" && (
              <button
                onClick={handleMarkAsPaid}
                disabled={isActionLoading}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isActionLoading ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <CheckCircle className="w-4 h-4 mr-2" />
                )}
                Marquer comme payé
              </button>
            )}
            {(payment.status === "paid" || payment.status === "escrow") && (
              <button
                onClick={() => setRefundModal(true)}
                disabled={isActionLoading}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <XCircle className="w-4 h-4 mr-2" />
                Rembourser
              </button>
            )}
            <button
              onClick={handleDownloadInvoice}
              disabled={isActionLoading}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800 flex items-center text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isActionLoading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Download className="w-4 h-4 mr-2" />
              )}
              Facture
            </button>
            <button
              onClick={handleRefresh}
              disabled={isRefetching}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800 flex items-center text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isRefetching ? 'animate-spin' : ''}`} />
              Rafraîchir
            </button>
          </div>
        </div>

        {/* En-tête */}
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6 mb-6 border border-gray-200 dark:border-slate-700">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                  Transaction {payment.id || payment.invoice_number}
                </h1>
                <StatusBadge status={payment.status} />
              </div>
              <p className="text-gray-600 dark:text-gray-400">
                Créée le {formatDate(payment.created_at)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-gray-800 dark:text-gray-100">
                {formatCurrency(payment.amount)}
              </p>
              {payment.platform_fee > 0 && (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Frais: {formatCurrency(payment.platform_fee)}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Grille d'informations */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Détails transaction */}
          <InfoCard icon={FileText} title="Détails de la transaction">
            <div className="space-y-3">
              <div className="flex justify-between py-2 border-b border-gray-100 dark:border-slate-700">
                <span className="text-gray-600 dark:text-gray-400">Numéro facture</span>
                <div className="flex items-center">
                  <span className="font-medium text-gray-900 dark:text-gray-100 mr-2">
                    {payment.invoice_number || payment.id}
                  </span>
                  <button onClick={() => copyToClipboard(payment.invoice_number || payment.id)}>
                    {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4 text-gray-400" />}
                  </button>
                </div>
              </div>
              {payment.transaction_id && (
                <div className="flex justify-between py-2 border-b border-gray-100 dark:border-slate-700">
                  <span className="text-gray-600 dark:text-gray-400">ID Transaction</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    {payment.transaction_id}
                  </span>
                </div>
              )}
              <div className="flex justify-between py-2 border-b border-gray-100 dark:border-slate-700">
                <span className="text-gray-600 dark:text-gray-400">Méthode de paiement</span>
                <span className="font-medium text-gray-900 dark:text-gray-100 flex items-center">
                  {getMethodIcon(payment.payment_method)}
                  <span className="ml-1">{getMethodLabel(payment.payment_method)}</span>
                </span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-gray-600 dark:text-gray-400">Date de paiement</span>
                <span className="font-medium text-gray-900 dark:text-gray-100">
                  {payment.paid_at ? formatDate(payment.paid_at) : "-"}
                </span>
              </div>
            </div>
          </InfoCard>

          {/* Client */}
          <InfoCard icon={User} title="Client">
            {payment.client ? (
              <div className="space-y-3">
                <div className="flex justify-between py-2 border-b border-gray-100 dark:border-slate-700">
                  <span className="text-gray-600 dark:text-gray-400">Nom</span>
                  <Link href={`/admin/users/${payment.client.id}`} className="font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                    {payment.client.name}
                  </Link>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-600 dark:text-gray-400">Email</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">{payment.client.email || "-"}</span>
                </div>
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400 text-center py-4">Aucun client assigné</p>
            )}
          </InfoCard>

          {/* provider */}
          <InfoCard icon={Briefcase} title="provider">
            {payment.provider ? (
              <div className="space-y-3">
                <div className="flex justify-between py-2 border-b border-gray-100 dark:border-slate-700">
                  <span className="text-gray-600 dark:text-gray-400">Nom</span>
                  <Link href={`/admin/users/${payment.provider.id}`} className="font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                    {payment.provider.name}
                  </Link>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-600 dark:text-gray-400">Montant à reverser</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    {payment.provider_payout ? formatCurrency(payment.provider_payout) : "-"}
                  </span>
                </div>
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400 text-center py-4">Aucun provider assigné</p>
            )}
          </InfoCard>

          {/* Service */}
          <InfoCard icon={Briefcase} title="Service associé">
            {payment.service_id ? (
              <div className="space-y-3">
                <div className="flex justify-between py-2 border-b border-gray-100 dark:border-slate-700">
                  <span className="text-gray-600 dark:text-gray-400">Titre</span>
                  <Link href={`/admin/services/${payment.service_id}`} className="font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-right">
                    {payment.service_title || `Service #${payment.service_id}`}
                  </Link>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-600 dark:text-gray-400">ID Service</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">#{payment.service_id}</span>
                </div>
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400 text-center py-4">Aucun service associé</p>
            )}
          </InfoCard>
        </div>

        {/* Notes et historique */}
        <div className="grid grid-cols-1 gap-6">
          {payment.notes && (
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-slate-700">
              <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">Notes</h3>
              <p className="text-gray-700 dark:text-gray-300">{payment.notes}</p>
            </div>
          )}

          {payment.refund_reason && (
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-slate-700">
              <h3 className="text-lg font-semibold mb-4 flex items-center text-gray-900 dark:text-gray-100">
                <XCircle className="w-5 h-5 mr-2 text-purple-600" />
                Remboursement
              </h3>
              <div className="space-y-2">
                <p className="text-gray-700 dark:text-gray-300">
                  <span className="font-medium">Raison:</span> {payment.refund_reason}
                </p>
                {payment.refunded_at && (
                  <p className="text-gray-700 dark:text-gray-300">
                    <span className="font-medium">Date:</span> {formatDate(payment.refunded_at)}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <RefundModal
        isOpen={refundModal}
        onClose={() => setRefundModal(false)}
        payment={payment}
        onConfirm={handleRefund}
      />
    </div>
  );
}
