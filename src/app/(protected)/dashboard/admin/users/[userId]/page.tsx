// app/(protected)/dashboard/admin/users/[userId]/page.tsx

"use client";

import { useState, useMemo } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  ArrowLeft,
  Mail,
  Phone,
  Calendar,
  Clock,
  Star,
  Shield,
  CheckCircle,
  Ban,
  Briefcase,
  DollarSign,
  Scale,
  User as UserIcon,
  UserCheck,
  UserX,
  Eye,
  Loader2,
  RefreshCw,
  Wallet,
  MapPin,
  AlertCircle,
  Package,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useAdminUser } from "@/app/hooks/use-admin-users";
import type { User, Mission, Payment, Dispute, ProviderService } from "@/app/types";
import { BlockUserFormData, BlockUserSchema, UnblockFormData, UnblockUserSchema } from "@/app/lib/validators";

// ==================== COMPOSANTS UI ====================

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
    <h3 className="text-lg font-semibold mb-4 flex items-center text-gray-800 dark:text-gray-100">
      <Icon className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" />
      {title}
    </h3>
    <div className="space-y-3 text-gray-700 dark:text-gray-300">{children}</div>
  </div>
);

const StatusBadge = ({ isBlocked }: { isBlocked: boolean }) => {
  if (isBlocked) {
    return (
      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800">
        <UserX className="w-4 h-4 mr-2" />
        Suspendu
      </span>
    );
  }
  return (
    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800">
      <UserCheck className="w-4 h-4 mr-2" />
      Actif
    </span>
  );
};

const RoleBadge = ({ role }: { role: string }) => {
  const getRoleConfig = () => {
    switch (role) {
      case "super_admin":
        return { color: "bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-800", icon: Shield, label: "Super Admin" };
      case "admin":
        return { color: "bg-indigo-100 text-indigo-700 border-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-400 dark:border-indigo-800", icon: Shield, label: "Admin" };
      case "moderator":
        return { color: "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800", icon: UserCheck, label: "Modérateur" };
      case "provider":
        return { color: "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800", icon: Star, label: "Prestataire" };
      default:
        return { color: "bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700", icon: UserIcon, label: "Client" };
    }
  };

  const config = getRoleConfig();
  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${config.color}`}>
      <Icon className="w-4 h-4 mr-2" />
      {config.label}
    </span>
  );
};

// ==================== MODALS ====================

const SuspendModal = ({
  isOpen,
  onClose,
  user,
  onConfirm,
  isSuspending,
}: {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  onConfirm: (data: BlockUserFormData) => void;
  isSuspending: boolean;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<BlockUserFormData>({
    resolver: zodResolver(BlockUserSchema),
    defaultValues: {
      notify_user: true,
    },
  });

  if (!isOpen || !user) return null;

  const onSubmit = (data: BlockUserFormData) => {
    onConfirm(data);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 flex items-center justify-center z-50" onClick={handleClose}>
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl max-w-md w-full p-6 border border-gray-200 dark:border-slate-700" onClick={(e) => e.stopPropagation()}>
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">Suspendre l'utilisateur</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Vous êtes sur le point de suspendre <span className="font-medium text-gray-900 dark:text-gray-100">{user.full_name || user.username}</span>
        </p>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Raison de la suspension *</label>
            <select
              {...register("reason")}
              className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100"
              disabled={isSuspending}
            >
              <option value="">Sélectionnez une raison</option>
              <option value="fraud">Fraude</option>
              <option value="harassment">Harcèlement</option>
              <option value="inappropriate_content">Contenu inapproprié</option>
              <option value="spam">Spam</option>
              <option value="multiple_warnings">Avertissements multiples</option>
              <option value="non_payment">Non-paiement</option>
              <option value="terms_violation">Violation des conditions</option>
              <option value="other">Autre</option>
            </select>
            {errors.reason && <p className="text-red-600 dark:text-red-400 text-sm mt-1">{errors.reason.message}</p>}
          </div>

          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Suspendu jusqu'au *</label>
            <input
              type="datetime-local"
              {...register("block_until")}
              min={new Date().toISOString().split("T")[0]}
              className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100"
              disabled={isSuspending}
            />
            {errors.block_until && <p className="text-red-600 dark:text-red-400 text-sm mt-1">{errors.block_until.message}</p>}
          </div>

          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description détaillée *</label>
            <textarea
              {...register("reason_text")}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100"
              placeholder="Expliquez la raison de la suspension..."
              disabled={isSuspending}
            />
            {errors.reason_text && <p className="text-red-600 dark:text-red-400 text-sm mt-1">{errors.reason_text.message}</p>}
          </div>

          <div className="mb-6">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                {...register("notify_user")}
                className="w-4 h-4 rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                disabled={isSuspending}
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">Notifier l'utilisateur par email</span>
            </label>
          </div>

          <div className="flex justify-end space-x-3">
            <button type="button" onClick={handleClose} disabled={isSuspending} className="px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-300 transition disabled:opacity-50">
              Annuler
            </button>
            <button type="submit" disabled={isSuspending} className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition disabled:opacity-50 flex items-center">
              {isSuspending ? <><RefreshCw className="w-4 h-4 mr-2 animate-spin" /> Suspension...</> : "Suspendre"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const UnblockModal = ({
  isOpen,
  onClose,
  user,
  onConfirm,
  isUnblocking,
}: {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  onConfirm: (data: UnblockFormData) => void;
  isUnblocking: boolean;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<UnblockFormData>({
    resolver: zodResolver(UnblockUserSchema),
    defaultValues: { notify_user: true, reason: "" },
  });

  if (!isOpen || !user) return null;

  const onSubmit = (data: UnblockFormData) => {
    onConfirm(data);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 flex items-center justify-center z-50" onClick={handleClose}>
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl max-w-md w-full p-6 border border-gray-200 dark:border-slate-700" onClick={(e) => e.stopPropagation()}>
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">Activer l'utilisateur</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Vous êtes sur le point d'activer <span className="font-medium text-gray-900 dark:text-gray-100">{user.full_name || user.username}</span>
        </p>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Raison de l'activation *</label>
            <textarea
              {...register("reason")}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100"
              placeholder="Expliquez la raison de l'activation..."
              disabled={isUnblocking}
            />
            {errors.reason && <p className="text-red-600 dark:text-red-400 text-sm mt-1">{errors.reason.message}</p>}
          </div>

          <div className="mb-6">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                {...register("notify_user")}
                className="w-4 h-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                disabled={isUnblocking}
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">Notifier l'utilisateur par email</span>
            </label>
          </div>

          <div className="flex justify-end space-x-3">
            <button type="button" onClick={handleClose} disabled={isUnblocking} className="px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-300 transition disabled:opacity-50">
              Annuler
            </button>
            <button type="submit" disabled={isUnblocking} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50 flex items-center">
              {isUnblocking ? <><RefreshCw className="w-4 h-4 mr-2 animate-spin" /> Activation...</> : "Activer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ==================== COMPOSANTS DES ONGLETS ====================

// 🔥 Composant pour les services du provider
const ProviderServices = ({ 
  services, 
  isLoading,
}: { 
  services: ProviderService[]; 
  isLoading: boolean;
}) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-slate-700">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 flex items-center">
          <Package className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" />
          Services proposés
        </h3>
      </div>

      <div className="space-y-4">
        {!services || services.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-400 py-8">
            Aucun service proposé
          </p>
        ) : (
          services.map((service) => (
            <div
              key={service.id}
              className="border border-gray-200 dark:border-slate-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition"
            >
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-medium text-gray-900 dark:text-gray-100">
                      {service.name}
                    </h4>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      service.is_active 
                        ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                        : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400"
                    }`}>
                      {service.is_active ? "Actif" : "Inactif"}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    {service.description}
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                    <div className="text-gray-600 dark:text-gray-400">
                      <span className="font-medium">Prix:</span> {service.price}€
                    </div>
                    <div className="text-gray-600 dark:text-gray-400">
                      <span className="font-medium">Durée:</span> {service.duration} min
                    </div>
                    <div className="text-gray-600 dark:text-gray-400">
                      <span className="font-medium">Catégorie:</span> {service.category}
                    </div>
                    {service.subcategory && (
                      <div className="text-gray-600 dark:text-gray-400">
                        <span className="font-medium">Sous-catégorie:</span> {service.subcategory}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

// 🔥 Composant pour les missions
const MissionsHistory = ({ missions, isLoading }: { missions: Mission[]; isLoading: boolean }) => {
  const [filter, setFilter] = useState<string>("all");

  const filteredMissions = useMemo(() => {
    if (filter === "all") return missions;
    return missions.filter((m) => m.status === filter);
  }, [missions, filter]);

  const getStatusBadge = (status: string) => {
    const badges: Record<string, { color: string; label: string }> = {
      in_progress: { color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400", label: "En cours" },
      completed: { color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400", label: "Terminée" },
      cancelled: { color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400", label: "Annulée" },
      pending: { color: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400", label: "En attente" },
    };
    const badge = badges[status] || badges.pending;
    return <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${badge.color}`}>{badge.label}</span>;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-slate-700">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 flex items-center">
          <Briefcase className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" />
          Historique des missions
        </h3>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-700 text-gray-700 dark:text-gray-300"
        >
          <option value="all">Toutes les missions</option>
          <option value="in_progress">En cours</option>
          <option value="completed">Terminées</option>
          <option value="pending">En attente</option>
          <option value="cancelled">Annulées</option>
        </select>
      </div>

      <div className="space-y-4">
        {!missions || missions.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-400 py-8">Aucune mission trouvée</p>
        ) : (
          filteredMissions.map((mission) => (
            <div
              key={mission.id}
              className="border border-gray-200 dark:border-slate-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-medium text-gray-900 dark:text-gray-100">
                      {mission.title}
                    </h4>
                    {getStatusBadge(mission.status)}
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
                    <div className="text-gray-600 dark:text-gray-400">
                      <span className="font-medium">Client:</span> {mission.client?.full_name || "N/A"}
                    </div>
                    <div className="text-gray-600 dark:text-gray-400">
                      <span className="font-medium">Prix:</span> {mission.proposed_amount}€
                    </div>
                    <div className="text-gray-600 dark:text-gray-400">
                      <span className="font-medium">Créée le:</span>{" "}
                      {new Date(mission.created_at).toLocaleDateString("fr-FR")}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => window.open(`/dashboard/admin/missions/${mission.id}`, "_blank")}
                  className="px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-300 text-sm flex items-center"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Voir détails
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

// 🔥 Composant pour les paiements
const PaymentsHistory = ({ payments, isLoading }: { payments: Payment[]; isLoading: boolean }) => {
  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      completed: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
      pending: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
      failed: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
      refunded: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400",
    };
    const labels: Record<string, string> = {
      completed: "Complété",
      pending: "En attente",
      failed: "Échoué",
      refunded: "Remboursé",
    };
    return <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${colors[status] || colors.pending}`}>{labels[status] || status}</span>;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-slate-700">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 flex items-center">
          <DollarSign className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" />
          Historique des paiements
        </h3>
      </div>

      <div className="space-y-4">
        {!payments || payments.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-400 py-8">Aucun paiement trouvé</p>
        ) : (
          payments.map((payment) => (
            <div
              key={payment.id}
              className="border border-gray-200 dark:border-slate-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-gray-900 dark:text-gray-100">
                      {payment.status === 'refunded' ? "Remboursement" : "Paiement"}
                    </span>
                    {getStatusBadge(payment.status)}
                  </div>
                  {payment.service && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      Mission: {payment.service.title}
                    </p>
                  )}
                  {payment.refund_reason && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      Raison: {payment.refund_reason}
                    </p>
                  )}
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-xs text-gray-500 dark:text-gray-500">
                    <span>Facture: {payment.invoice_number}</span>
                    <span>Méthode: {payment.payment_method || "N/A"}</span>
                    <span>Date: {new Date(payment.created_at).toLocaleDateString("fr-FR")}</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`text-lg font-bold ${payment.status === 'refunded' ? 'text-red-600' : 'text-green-600'}`}>
                    {payment.status === 'refunded' ? '-' : '+'}{payment.amount}€
                  </span>
                  {payment.platform_fee > 0 && (
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Frais: -{payment.platform_fee}€
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

// 🔥 Composant pour les litiges
const DisputesHistory = ({ disputes, isLoading }: { disputes: Dispute[]; isLoading: boolean }) => {
  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      open: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
      resolved: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
      closed: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400",
    };
    const labels: Record<string, string> = {
      open: "Ouvert",
      resolved: "Résolu",
      closed: "Fermé",
    };
    return <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${colors[status] || colors.open}`}>{labels[status] || status}</span>;
  };

  const getPriorityBadge = (priority: string) => {
    const colors: Record<string, string> = {
      low: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400",
      medium: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
      high: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
      critical: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    };
    const labels: Record<string, string> = {
      low: "Basse",
      medium: "Moyenne",
      high: "Haute",
      critical: "Critique",
    };
    return <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${colors[priority] || colors.medium}`}>{labels[priority] || priority}</span>;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-slate-700">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 flex items-center">
          <Scale className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" />
          Historique des litiges
        </h3>
      </div>

      <div className="space-y-4">
        {!disputes || disputes.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-400 py-8">Aucun litige trouvé</p>
        ) : (
          disputes.map((dispute) => (
            <div
              key={dispute.id}
              className="border border-gray-200 dark:border-slate-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition"
            >
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-medium text-gray-900 dark:text-gray-100">{dispute.title}</h4>
                    {getStatusBadge(dispute.status)}
                    {getPriorityBadge(dispute.priority)}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    <span className="font-medium">Raison:</span> {dispute.reason}
                  </p>
                  {dispute.service && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      <span className="font-medium">Mission:</span> {dispute.service.title}
                    </p>
                  )}
                  <div className="grid grid-cols-2 gap-2 text-xs text-gray-500 dark:text-gray-500">
                    <span>Ouvert le: {new Date(dispute.created_at).toLocaleDateString("fr-FR")}</span>
                    <span>Messages: {dispute.message_count || 0}</span>
                  </div>
                </div>
                <button
                  onClick={() => window.open(`/dashboard/admin/disputes/${dispute.id}`, "_blank")}
                  className="px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-300 text-sm flex items-center"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Voir détails
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

// ==================== PAGE PRINCIPALE ====================

export default function UserDetailPage() {
  const router = useRouter();
  const params = useParams();
  const userId = params.userId as string;

  const [activeTab, setActiveTab] = useState<"info" | "missions" | "payments" | "disputes" | "services">("info");
  const [suspendModal, setSuspendModal] = useState<{ isOpen: boolean; user: User | null }>({
    isOpen: false,
    user: null,
  });
  const [unblockModal, setUnblockModal] = useState<{ isOpen: boolean; user: User | null }>({
    isOpen: false,
    user: null,
  });

  const {
    user,
    missions,
    missionsLoading,
    payments,
    paymentsLoading,
    disputes,
    disputesLoading,
    isLoading,
    error,
    refetch,
    blockUser,
    isBlocking,
    unblockUser,
    isUnblocking,
  } = useAdminUser(userId);

  // 🔥 Vérifier si l'utilisateur est un provider
  const isProvider = user?.role === "provider";
  
  // 🔥 Récupérer les services du provider depuis user.provider.services
  const providerServices = user?.provider?.services || [];

  const handleSuspend = async (data: BlockUserFormData) => {
    if (!user) return;
    await blockUser(data);
    setSuspendModal({ isOpen: false, user: null });
  };

  const handleUnblock = async (data: UnblockFormData) => {
    if (!unblockModal.user) return;
    await unblockUser(data);
    setUnblockModal({ isOpen: false, user: null });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Utilisateur non trouvé</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Impossible de charger les informations de l'utilisateur</p>
          <button onClick={() => refetch()} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950">
      <div className="container mx-auto px-4 py-8">
        {/* Barre de navigation */}
        <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <button
            onClick={() => router.back()}
            className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour à la liste
          </button>
          <div className="flex flex-wrap gap-2">
            {!user.is_blocked ? (
              <button
                onClick={() => setSuspendModal({ isOpen: true, user })}
                disabled={isBlocking}
                className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 flex items-center transition disabled:opacity-50"
              >
                <Ban className="w-4 h-4 mr-2" />
                Suspendre
              </button>
            ) : (
              <button
                onClick={() => setUnblockModal({ isOpen: true, user })}
                disabled={isUnblocking}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center transition disabled:opacity-50"
              >
                {isUnblocking ? (
                  <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Activation...</>
                ) : (
                  <><UserCheck className="w-4 h-4 mr-2" /> Réactiver</>
                )}
              </button>
            )}
          </div>
        </div>

        {/* En-tête du profil */}
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6 mb-6 border border-gray-200 dark:border-slate-700">
          <div className="flex flex-col md:flex-row items-start gap-6">
            <div className="flex-shrink-0">
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.full_name}
                  className="w-24 h-24 rounded-full object-cover border-4 border-white dark:border-slate-700 shadow-lg"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-gray-200 dark:bg-slate-700 flex items-center justify-center border-4 border-white dark:border-slate-700 shadow-lg">
                  <UserIcon className="w-12 h-12 text-gray-400 dark:text-gray-500" />
                </div>
              )}
            </div>
            <div className="flex-1">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{user.full_name}</h1>
                  <p className="text-gray-600 dark:text-gray-400">{user.email}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <StatusBadge isBlocked={user.is_blocked || false} />
                  <RoleBadge role={user.role} />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                <div className="flex items-center text-gray-600 dark:text-gray-400">
                  <Calendar className="w-4 h-4 mr-2 text-gray-400 dark:text-gray-500" />
                  <span className="text-sm">Inscrit le {new Date(user.created_at).toLocaleDateString("fr-FR")}</span>
                </div>
                {user.last_login_at && (
                  <div className="flex items-center text-gray-600 dark:text-gray-400">
                    <Clock className="w-4 h-4 mr-2 text-gray-400 dark:text-gray-500" />
                    <span className="text-sm">Dernière connexion {new Date(user.last_login_at).toLocaleDateString("fr-FR")}</span>
                  </div>
                )}
                {user.phone && (
                  <div className="flex items-center text-gray-600 dark:text-gray-400">
                    <Phone className="w-4 h-4 mr-2 text-gray-400 dark:text-gray-500" />
                    <span className="text-sm">{user.phone}</span>
                  </div>
                )}
                {user.wallet && (
                  <div className="flex items-center text-gray-600 dark:text-gray-400">
                    <Wallet className="w-4 h-4 mr-2 text-gray-400 dark:text-gray-500" />
                    <span className="text-sm">Solde: {user.wallet.balance}€</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Onglets */}
        <div className="border-b border-gray-200 dark:border-slate-700 mb-6">
          <nav className="flex flex-wrap gap-2 sm:gap-0">
            {[
              { id: "info", label: "Informations", icon: UserIcon },
              { id: "missions", label: "Missions", icon: Briefcase },
              { id: "payments", label: "Paiements", icon: DollarSign },
              { id: "disputes", label: "Litiges", icon: Scale },
              ...(isProvider ? [{ id: "services", label: "Services", icon: Package }] : []),
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2 font-medium text-sm transition flex items-center ${
                  activeTab === tab.id
                    ? "border-b-2 border-blue-600 text-blue-600 dark:text-blue-400"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                }`}
              >
                <tab.icon className="w-4 h-4 mr-2" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Contenu des onglets */}
        <div>
          {activeTab === "info" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Informations personnelles */}
              <InfoCard icon={UserIcon} title="Informations personnelles">
                <div className="space-y-3">
                  <div className="flex items-center">
                    <Mail className="w-4 h-4 mr-3 text-gray-400 dark:text-gray-500" />
                    <span className="flex-1">{user.email}</span>
                    {user.is_verified && <CheckCircle className="w-4 h-4 text-green-500" />}
                  </div>
                  {user.phone && (
                    <div className="flex items-center">
                      <Phone className="w-4 h-4 mr-3 text-gray-400 dark:text-gray-500" />
                      <span>{user.phone}</span>
                    </div>
                  )}
                  {user.addresses && user.addresses.length > 0 && (
                    <div className="flex items-start">
                      <MapPin className="w-4 h-4 mr-3 text-gray-400 dark:text-gray-500 mt-0.5" />
                      <div>
                        {user.addresses.map((addr) => (
                          <div key={addr.id} className="text-sm">
                            {addr.address_line1}, {addr.city} ({addr.postal_code}), {addr.country}
                            {addr.is_default && (
                              <span className="ml-2 text-xs bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 px-2 py-0.5 rounded-full">
                                Principal
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </InfoCard>

              {/* Rôle et statut */}
              <InfoCard icon={Shield} title="Rôle et statut">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Rôle</span>
                    <RoleBadge role={user.role} />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Statut</span>
                    <StatusBadge isBlocked={user.is_blocked || false} />
                  </div>
                  {user.is_blocked && user.blocked_reason && (
                    <div className="mt-2 p-3 bg-red-50 dark:bg-red-900/30 rounded-lg">
                      <p className="text-sm font-medium text-red-800 dark:text-red-300">Raison du blocage:</p>
                      <p className="text-sm text-red-700 dark:text-red-400 mt-1">{user.blocked_reason}</p>
                      {user.blocked_until && (
                        <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                          Jusqu'au: {new Date(user.blocked_until).toLocaleDateString("fr-FR")}
                        </p>
                      )}
                    </div>
                  )}
                  {user.provider && (
                    <>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Entreprise</span>
                        <span className="text-gray-900 dark:text-gray-100">{user.provider.business_name || "N/A"}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Note moyenne</span>
                        <span className="flex items-center text-gray-900 dark:text-gray-100">
                          <Star className="w-4 h-4 text-yellow-500 mr-1" />
                          {user.provider.average_rating || 0} / 5
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Missions complétées</span>
                        <span className="text-gray-900 dark:text-gray-100">{user.provider.completed_missions || 0}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Disponible</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          user.provider.is_available 
                            ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                            : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                        }`}>
                          {user.provider.is_available ? "Oui" : "Non"}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Vérification</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          user.provider.verification_status === "verified"
                            ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                            : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                        }`}>
                          {user.provider.verification_status === "verified" ? "Vérifié" : "En attente"}
                        </span>
                      </div>
                    </>
                  )}
                  {/* Block History */}
                  {user.block_history && user.block_history.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-slate-700">
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Historique des blocages</p>
                      <div className="space-y-2">
                        {user.block_history.map((block) => (
                          <div key={block.id} className="text-xs text-gray-600 dark:text-gray-400">
                            <span className="font-medium">Raison:</span> {block.reason}
                            {block.unblocked_at && (
                              <span className="ml-2 text-green-600 dark:text-green-400">
                                (Débloqué le {new Date(block.unblocked_at).toLocaleDateString("fr-FR")})
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </InfoCard>
            </div>
          )}

          {activeTab === "missions" && (
            <MissionsHistory missions={missions} isLoading={missionsLoading} />
          )}

          {activeTab === "payments" && (
            <PaymentsHistory payments={payments} isLoading={paymentsLoading} />
          )}

          {activeTab === "disputes" && (
            <DisputesHistory disputes={disputes} isLoading={disputesLoading} />
          )}

          {activeTab === "services" && isProvider && (
            <ProviderServices services={providerServices} isLoading={isLoading} />
          )}
        </div>
      </div>

      {/* Modals */}
      <SuspendModal
        isOpen={suspendModal.isOpen}
        onClose={() => setSuspendModal({ isOpen: false, user: null })}
        user={suspendModal.user}
        onConfirm={handleSuspend}
        isSuspending={isBlocking}
      />

      <UnblockModal
        isOpen={unblockModal.isOpen}
        onClose={() => setUnblockModal({ isOpen: false, user: null })}
        user={unblockModal.user}
        onConfirm={handleUnblock}
        isUnblocking={isUnblocking}
      />
    </div>
  );
}