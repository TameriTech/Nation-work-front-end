// app/(protected)/dashboard/admin/users/[userId]/page.tsx
"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Clock,
  Star,
  Shield,
  CheckCircle,
  XCircleIcon,
  Ban,
  Edit,
  Send,
  AlertCircle,
  Briefcase,
  DollarSign,
  TrendingUp,
  Users,
  MessageSquare,
  CreditCard,
  FileText,
  Scale,
  Activity,
  Download,
  Printer,
  MoreHorizontal,
  Loader2,
  User as UserIcon,
  UserCheck,
  UserX,
  UserMinus,
  Award,
  Globe,
  Link as LinkIcon,
  Github,
  Twitter,
  Linkedin,
  Facebook,
  Instagram,
  Filter,
  Eye,
  FileCheck,
  FileX,
  Wallet,
  CreditCard as PaymentIcon,
  History,
  LogIn,
  LogOut,
  Settings,
  ShieldAlert,
  CircleDollarSign,
  CheckCircle2,
  LucideXCircle,
  AlertTriangle,
  MessageCircle,
  ThumbsUp,
  ThumbsDown,
  RefreshCw,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { useAdminUser } from "@/app/hooks/admin/use-admin-users";
import type {
  ActivityLog,
  DisputeHistory,
  PaymentHistory,
  ServiceHistory,
  User,
} from "@/app/types";
import UserDetailLoading from "./loading";
import UserDetailError from "./error";
import { SuspendFormData, suspendSchema } from "@/app/lib/validators";

// Schéma pour le modal d'email
const emailSchema = z.object({
  subject: z.string().min(5, "Le sujet doit contenir au moins 5 caractères"),
  message: z
    .string()
    .min(20, "Le message doit contenir au moins 20 caractères"),
});

type EmailFormData = z.infer<typeof emailSchema>;

// Composant d'information
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

// Badge de statut
const StatusBadge = ({ status }: { status: string }) => {
  const badges: Record<string, { color: string; icon: any; label: string }> = {
    active: {
      color:
        "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800",
      icon: UserCheck,
      label: "Actif",
    },
    suspended: {
      color:
        "bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800",
      icon: UserX,
      label: "Suspendu",
    },
    pending_verification: {
      color:
        "bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800",
      icon: AlertCircle,
      label: "En attente",
    },
    inactive: {
      color:
        "bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700",
      icon: UserMinus,
      label: "Inactif",
    },
  };
  const badge = badges[status] || badges.inactive;
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

// Badge de rôle
const RoleBadge = ({ role }: { role: string }) => {
  const badges: Record<string, { color: string; icon: any; label: string }> = {
    admin: {
      color:
        "bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-800",
      icon: Shield,
      label: "Administrateur",
    },
    freelancer: {
      color:
        "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800",
      icon: Star,
      label: "Freelancer",
    },
    client: {
      color:
        "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800",
      icon: UserIcon,
      label: "Client",
    },
  };
  const badge = badges[role] || badges.client;
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

// Modal de suspension avec React Hook Form
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
  onConfirm: (data: SuspendFormData) => void;
  isSuspending: boolean;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<SuspendFormData>({
    resolver: zodResolver(suspendSchema),
    defaultValues: {
      reason: "fraud",
      block_until: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0], // Format YYYY-MM-DD
      reason_text: "",
      notify_user: true,
    },
  });

  if (!isOpen || !user) return null;

  const onSubmit = (data: SuspendFormData) => {
    console.log("📝 Form submitted with data:", data);
    console.log("👤 User being suspended:", user);

    // Call the parent's onConfirm function
    onConfirm(data);

    // DON'T reset and close here - let the parent handle it after API success
    // The parent component should call onClose() after successful API call
  };

  // Handle manual close with reset
  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 flex items-center justify-center z-50"
      onClick={(e) => e.stopPropagation()} // Prevent closing when clicking outside
    >
      <div
        className="bg-white dark:bg-slate-800 rounded-lg shadow-xl max-w-md w-full p-6 border border-gray-200 dark:border-slate-700"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
          Suspendre l'utilisateur
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Vous êtes sur le point de suspendre{" "}
          <span className="font-medium text-gray-900 dark:text-gray-100">
            {user.username}
          </span>
        </p>

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Raison de la suspension - FIXED options */}
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Raison de la suspension *
            </label>
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
              <option value="multiple_warnings">
                Avertissements multiples
              </option>
              <option value="non_payment">Non-paiement</option>
              <option value="abandoned_services">Services abandonnés</option>
              <option value="fake_reviews">Avis faux</option>
              <option value="terms_violation">Violation des conditions</option>
              <option value="other">Autre</option>
            </select>
            {errors.reason && (
              <p className="text-red-600 dark:text-red-400 text-sm mt-1">
                {errors.reason.message}
              </p>
            )}
          </div>

          {/* Suspendu jusqu'au */}
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Suspendu jusqu'au *
            </label>
            <input
              type="date"
              {...register("block_until")}
              min={new Date().toISOString().split("T")[0]} // Can't select past dates
              className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100"
              disabled={isSuspending}
            />
            {errors.block_until && (
              <p className="text-red-600 dark:text-red-400 text-sm mt-1">
                {errors.block_until.message}
              </p>
            )}
          </div>

          {/* Raison détaillée */}
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Description détaillée *
            </label>
            <textarea
              {...register("reason_text")}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100"
              placeholder="Expliquez la raison de la suspension..."
              disabled={isSuspending}
            />
            {errors.reason_text && (
              <p className="text-red-600 dark:text-red-400 text-sm mt-1">
                {errors.reason_text.message}
              </p>
            )}
          </div>

          {/* Notifier l'utilisateur - FIXED missing register */}
          <div className="mb-6">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                {...register("notify_user")}
                className="w-4 h-4 rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                disabled={isSuspending}
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                Notifier l'utilisateur par email
              </span>
            </label>
          </div>

          {/* Boutons d'action */}
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={handleClose}
              disabled={isSuspending}
              className="px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-300 transition disabled:opacity-50"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isSuspending}
              className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition disabled:opacity-50 flex items-center"
            >
              {isSuspending ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Suspension en cours...
                </>
              ) : (
                "Suspendre"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Modal d'envoi d'email avec React Hook Form
const EmailModal = ({
  isOpen,
  onClose,
  user,
  onSend,
  isSending,
}: {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  onSend: (data: EmailFormData) => void;
  isSending: boolean;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<EmailFormData>({
    resolver: zodResolver(emailSchema),
  });

  if (!isOpen || !user) return null;

  const onSubmit = (data: EmailFormData) => {
    onSend(data);
    reset();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl max-w-2xl w-full p-6 border border-gray-200 dark:border-slate-700">
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
          Envoyer un email à {user.username}
        </h3>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Sujet *
            </label>
            <input
              type="text"
              {...register("subject")}
              className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100"
              disabled={isSending}
            />
            {errors.subject && (
              <p className="text-red-600 dark:text-red-400 text-sm mt-1">
                {errors.subject.message}
              </p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Message *
            </label>
            <textarea
              {...register("message")}
              rows={6}
              className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100"
              disabled={isSending}
            />
            {errors.message && (
              <p className="text-red-600 dark:text-red-400 text-sm mt-1">
                {errors.message.message}
              </p>
            )}
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => {
                reset();
                onClose();
              }}
              disabled={isSending}
              className="px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-300 transition disabled:opacity-50"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isSending}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 flex items-center"
            >
              {isSending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Envoi...
                </>
              ) : (
                "Envoyer"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Composant pour l'historique des services
const ServicesHistory = ({ userId }: { userId: number }) => {
  const { services, servicesLoading } = useAdminUser(userId);
  const [filter, setFilter] = useState<string>("all");

  const filteredServices =
    filter === "all"
      ? services.items
      : services.items.filter((s: ServiceHistory) => s.status === filter);

  console.log("Services: ", filteredServices);
  const getStatusBadge = (status: string) => {
    const badges = {
      active: {
        color:
          "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
        icon: CheckCircle,
        label: "En cours",
      },
      completed: {
        color:
          "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
        icon: CheckCircle2,
        label: "Terminé",
      },
      cancelled: {
        color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
        icon: XCircleIcon,
        label: "Annulé",
      },
      pending: {
        color:
          "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
        icon: AlertCircle,
        label: "En attente",
      },
    };
    const badge = badges[status as keyof typeof badges];
    const Icon = badge?.icon || AlertCircle;
    return (
      <span
        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${badge?.color}`}
      >
        <Icon className="w-3 h-3 mr-1" />
        {badge?.label}
      </span>
    );
  };

  if (servicesLoading) {
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
          Historique des services
        </h3>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-700 text-gray-700 dark:text-gray-300"
        >
          <option value="all">Tous les services</option>
          <option value="active">En cours</option>
          <option value="completed">Terminés</option>
          <option value="pending">En attente</option>
          <option value="cancelled">Annulés</option>
        </select>
      </div>

      <div className="space-y-4">
        {filteredServices.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-400 py-8">
            Aucun service trouvé
          </p>
        ) : (
          filteredServices?.map((service: ServiceHistory) => (
            <div
              key={service.id}
              className="border border-gray-200 dark:border-slate-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-medium text-gray-900 dark:text-gray-100">
                      {service.title}
                    </h4>
                    {getStatusBadge(service.status)}
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                    <div className="text-gray-600 dark:text-gray-400">
                      <span className="font-medium">Client:</span>{" "}
                      {service.client.username}
                    </div>
                    <div className="text-gray-600 dark:text-gray-400">
                      <span className="font-medium">Catégorie:</span>{" "}
                      {service.category?.name}
                    </div>
                    <div className="text-gray-600 dark:text-gray-400">
                      <span className="font-medium">Prix:</span>{" "}
                      {service.proposed_amount}€
                    </div>
                    <div className="text-gray-600 dark:text-gray-400">
                      <span className="font-medium">Créé le:</span>{" "}
                      {new Date(service.created_at).toLocaleDateString("fr-FR")}
                    </div>
                  </div>
                  {service.rating && (
                    <div className="mt-2 flex items-center text-sm">
                      <span className="flex items-center text-yellow-500 mr-2">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${i < service.rating! ? "fill-current" : "stroke-current"}`}
                          />
                        ))}
                      </span>
                      <span className="text-gray-600 dark:text-gray-400 mr-2">
                        {service.rating}/5
                      </span>
                      {service.reviews_count && (
                        <span className="text-gray-500 dark:text-gray-500 italic">
                          "{service.reviews_count}"
                        </span>
                      )}
                    </div>
                  )}
                </div>
                <button
                  onClick={() =>
                    window.open(`/admin/services/${service.id}`, "_blank")
                  }
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

// Composant pour l'historique des paiements
const PaymentsHistory = ({ userId }: { userId: number }) => {
  const { payments, paymentsLoading } = useAdminUser(userId);
  const [filter, setFilter] = useState<string>("all");

  console.log("Payments: ", payments);

  const getTypeIcon = (type: string) => {
    const icons = {
      payment: { icon: CircleDollarSign, color: "text-green-500" },
      withdrawal: { icon: Wallet, color: "text-blue-500" },
      refund: { icon: XCircleIcon, color: "text-red-500" },
      fee: { icon: CreditCard, color: "text-purple-500" },
    };
    const Icon = icons[type as keyof typeof icons]?.icon || CircleDollarSign;
    return (
      <Icon className={`w-5 h-5 ${icons[type as keyof typeof icons]?.color}`} />
    );
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      completed:
        "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
      pending:
        "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
      failed: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    };
    return (
      <span
        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${badges[status as keyof typeof badges]}`}
      >
        {status === "completed" && "Complété"}
        {status === "pending" && "En attente"}
        {status === "failed" && "Échoué"}
      </span>
    );
  };

  if (paymentsLoading) {
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
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-700 text-gray-700 dark:text-gray-300"
        >
          <option value="all">Tous les paiements</option>
          <option value="payment">Paiements reçus</option>
          <option value="withdrawal">Retraits</option>
          <option value="fee">Frais</option>
        </select>
      </div>

      <div className="space-y-4">
        {payments.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-400 py-8">
            Aucun paiement trouvé
          </p>
        ) : (
          payments.map((payment: PaymentHistory) => (
            <div
              key={payment.id}
              className="border border-gray-200 dark:border-slate-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    {getTypeIcon(payment.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-gray-900 dark:text-gray-100">
                        {payment.type === "payment" && "Paiement reçu"}
                        {payment.type === "withdrawal" && "Retrait"}
                        {payment.type === "fee" && "Frais"}
                        {payment.type === "refund" && "Remboursement"}
                      </span>
                      {getStatusBadge(payment.status)}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                      {payment.description}
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs text-gray-500 dark:text-gray-500">
                      <span>ID: {payment.transaction_id}</span>
                      <span>Méthode: {payment.method}</span>
                      <span>
                        Date:{" "}
                        {new Date(payment.created_at).toLocaleDateString(
                          "fr-FR",
                        )}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <span
                    className={`text-lg font-bold ${payment.amount > 0 ? "text-green-600" : "text-red-600"}`}
                  >
                    {payment.type === "payment"
                      ? "+"
                      : payment.type === "fee"
                        ? "-"
                        : ""}
                    {payment.amount}€
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

// Composant pour l'historique des litiges
const DisputesHistory = ({ userId }: { userId: number }) => {
  const { disputes, disputesLoading } = useAdminUser(userId);
  const [filter, setFilter] = useState<string>("all");

  console.log("Disputes: ", disputes);

  const getPriorityBadge = (priority: string) => {
    const badges = {
      low: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400",
      medium:
        "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
      high: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
      critical: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    };
    return (
      <span
        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${badges[priority as keyof typeof badges]}`}
      >
        {priority === "low" && "Basse"}
        {priority === "medium" && "Moyenne"}
        {priority === "high" && "Haute"}
        {priority === "critical" && "Critique"}
      </span>
    );
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      open: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
      resolved:
        "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
      closed: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400",
    };
    return (
      <span
        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${badges[status as keyof typeof badges]}`}
      >
        {status === "open" && "Ouvert"}
        {status === "resolved" && "Résolu"}
        {status === "closed" && "Fermé"}
      </span>
    );
  };

  if (disputesLoading) {
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
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-700 text-gray-700 dark:text-gray-300"
        >
          <option value="all">Tous les litiges</option>
          <option value="open">Ouverts</option>
          <option value="resolved">Résolus</option>
          <option value="closed">Fermés</option>
        </select>
      </div>

      <div className="space-y-4">
        {disputes.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-400 py-8">
            Aucun litige trouvé
          </p>
        ) : (
          disputes.map((dispute: DisputeHistory) => (
            <div
              key={dispute.id}
              className="border border-gray-200 dark:border-slate-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition"
            >
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-medium text-gray-900 dark:text-gray-100">
                      {dispute.service_title}
                    </h4>
                    {getStatusBadge(dispute.status)}
                    {getPriorityBadge(dispute.priority)}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    <span className="font-medium">Raison:</span>{" "}
                    {dispute.reason}
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs text-gray-500 dark:text-gray-500">
                    <span>Ouvert par: {dispute.opened_by}</span>
                    <span>
                      Date:{" "}
                      {new Date(dispute.created_at).toLocaleDateString("fr-FR")}
                    </span>
                    <span>Messages: {dispute.messages_count}</span>
                    {dispute.resolved_at && (
                      <span>
                        Résolu le:{" "}
                        {new Date(dispute.resolved_at).toLocaleDateString(
                          "fr-FR",
                        )}
                      </span>
                    )}
                  </div>
                  {dispute.resolution && (
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-slate-700 p-2 rounded">
                      <span className="font-medium">Résolution:</span>{" "}
                      {dispute.resolution}
                    </p>
                  )}
                </div>
                <button
                  onClick={() =>
                    window.open(`/admin/disputes/${dispute.id}`, "_blank")
                  }
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

// Composant pour le journal d'activité
const ActivityLogs = ({ userId }: { userId: number }) => {
  const { logs, logsLoading } = useAdminUser(userId);
  const [filter, setFilter] = useState<string>("all");

  console.log("Activities logs: ", logs);

  const getTypeIcon = (type: string) => {
    const icons = {
      auth: {
        icon: LogIn,
        color:
          "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
      },
      service: {
        icon: Briefcase,
        color:
          "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400",
      },
      payment: {
        icon: CircleDollarSign,
        color:
          "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400",
      },
      profile: {
        icon: UserIcon,
        color:
          "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400",
      },
      security: {
        icon: Shield,
        color: "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400",
      },
      dispute: {
        icon: Scale,
        color:
          "bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400",
      },
    };
    const Icon = icons[type as keyof typeof icons]?.icon || Activity;
    return Icon;
  };

  const filteredLogs =
    filter === "all"
      ? logs.items
      : logs.items.filter((log: ActivityLog) => log.type === filter);

  if (logsLoading) {
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
          <History className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" />
          Journal d'activité
        </h3>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-700 text-gray-700 dark:text-gray-300"
        >
          <option value="all">Toutes les activités</option>
          <option value="auth">Authentification</option>
          <option value="service">Services</option>
          <option value="payment">Paiements</option>
          <option value="profile">Profil</option>
          <option value="security">Sécurité</option>
          <option value="dispute">Litiges</option>
        </select>
      </div>

      <div className="space-y-4 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
        {filteredLogs.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-400 py-8">
            Aucune activité trouvée
          </p>
        ) : (
          filteredLogs?.map((log: ActivityLog) => {
            const Icon = getTypeIcon(log.type);
            return (
              <div
                key={log.id}
                className="flex items-start space-x-4 p-3 hover:bg-gray-50 dark:hover:bg-slate-700/50 rounded-lg transition"
              >
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 bg-opacity-20`}
                >
                  <Icon className={`w-4 h-4`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {log.action}
                    </p>
                    <span className="text-xs text-gray-500 dark:text-gray-500">
                      {new Date(log.created_at).toLocaleString("fr-FR")}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {log.description}
                  </p>
                  {log.ip_address && (
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                      IP: {log.ip_address}
                    </p>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default function UserDetailPage() {
  const router = useRouter();
  const params = useParams();
  const userId = Number(params.userId);

  const [activeTab, setActiveTab] = useState<
    "info" | "services" | "payments" | "disputes" | "logs"
  >("info");
  const [suspendModal, setSuspendModal] = useState<{
    isOpen: boolean;
    user: User | null;
  }>({
    isOpen: false,
    user: null,
  });
  const [emailModal, setEmailModal] = useState<{
    isOpen: boolean;
    user: User | null;
  }>({
    isOpen: false,
    user: null,
  });

  // Hook personnalisé
  const {
    user,
    isLoading,
    error,
    suspendUser,
    isSuspending,
    activateUser,
    isActivating,
    sendEmail,
    isSendingEmail,
    refetch,
  } = useAdminUser(userId);

  const handleSuspend = async (data: SuspendFormData) => {
    if (!user) return;
    await suspendUser(data);
  };

  const handleActivate = async () => {
    if (!user) return;
    if (confirm(`Êtes-vous sûr de vouloir réactiver ${user.username} ?`)) {
      await activateUser({ reason: "Bann period ended", notify_user: true });
    }
  };

  const handleSendEmail = async (data: EmailFormData) => {
    if (!user) return;
    await sendEmail(data);
  };

  if (isLoading) {
    return <UserDetailLoading />;
  }

  if (error || !user) {
    return <UserDetailError error={error} userId={userId} onRetry={refetch} />;
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
            <button
              onClick={() => setEmailModal({ isOpen: true, user })}
              disabled={isSendingEmail}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center transition disabled:opacity-50"
            >
              <Send className="w-4 h-4 mr-2" />
              Envoyer un email
            </button>
            <button className="px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 flex items-center text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 transition">
              <Edit className="w-4 h-4 mr-2" />
              Modifier
            </button>
            {user.status === "active" ? (
              <button
                onClick={() => setSuspendModal({ isOpen: true, user })}
                disabled={isSuspending}
                className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 flex items-center transition disabled:opacity-50"
              >
                <Ban className="w-4 h-4 mr-2" />
                Suspendre
              </button>
            ) : user.status === "suspended" ? (
              <button
                onClick={handleActivate}
                disabled={isActivating}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center transition disabled:opacity-50"
              >
                {isActivating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Activation...
                  </>
                ) : (
                  <>
                    <UserCheck className="w-4 h-4 mr-2" />
                    Réactiver
                  </>
                )}
              </button>
            ) : null}
          </div>
        </div>

        {/* En-tête du profil */}
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6 mb-6 border border-gray-200 dark:border-slate-700">
          <div className="flex flex-col md:flex-row items-start gap-6">
            <div className="flex-shrink-0">
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.username}
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
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {user.username}
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400">
                    {user.email}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <StatusBadge status={user.status} />
                  <RoleBadge role={user.role} />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                <div className="flex items-center text-gray-600 dark:text-gray-400">
                  <Calendar className="w-4 h-4 mr-2 text-gray-400 dark:text-gray-500" />
                  <span className="text-sm">
                    Inscrit le{" "}
                    {new Date(user.created_at).toLocaleDateString("fr-FR")}
                  </span>
                </div>
                {user.last_login && (
                  <div className="flex items-center text-gray-600 dark:text-gray-400">
                    <Clock className="w-4 h-4 mr-2 text-gray-400 dark:text-gray-500" />
                    <span className="text-sm">
                      Dernière connexion{" "}
                      {new Date(user.last_login).toLocaleDateString("fr-FR")}
                    </span>
                  </div>
                )}
                {user.phone && (
                  <div className="flex items-center text-gray-600 dark:text-gray-400">
                    <Phone className="w-4 h-4 mr-2 text-gray-400 dark:text-gray-500" />
                    <span className="text-sm">{user.phone}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Statistiques rapides */}
        {user.stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-4 border border-gray-200 dark:border-slate-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Services
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {user.stats.services_completed || 0}
                  </p>
                </div>
                <Briefcase className="w-8 h-8 text-blue-500 opacity-50 dark:opacity-30" />
              </div>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-4 border border-gray-200 dark:border-slate-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Gains
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {user.stats.total_earned
                      ? `${user.stats.total_earned}€`
                      : "0€"}
                  </p>
                </div>
                <DollarSign className="w-8 h-8 text-green-500 opacity-50 dark:opacity-30" />
              </div>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-4 border border-gray-200 dark:border-slate-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Note
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {user.stats.average_rating || "N/A"}
                  </p>
                </div>
                <Star className="w-8 h-8 text-yellow-500 opacity-50 dark:opacity-30" />
              </div>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-4 border border-gray-200 dark:border-slate-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Taux de réponse
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {user.stats.response_rate || 0}%
                  </p>
                </div>
                <TrendingUp className="w-8 h-8 text-purple-500 opacity-50 dark:opacity-30" />
              </div>
            </div>
          </div>
        )}

        {/* Onglets */}
        <div className="border-b border-gray-200 dark:border-slate-700 mb-6">
          <nav className="flex flex-wrap gap-2 sm:gap-0">
            {[
              { id: "info", label: "Informations", icon: UserIcon },
              { id: "services", label: "Services", icon: Briefcase },
              { id: "payments", label: "Paiements", icon: DollarSign },
              { id: "disputes", label: "Litiges", icon: Scale },
              { id: "logs", label: "Journal", icon: History },
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
                    {user.is_verified && (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    )}
                  </div>
                  {user.phone && (
                    <div className="flex items-center">
                      <Phone className="w-4 h-4 mr-3 text-gray-400 dark:text-gray-500" />
                      <span>{user.phone}</span>
                    </div>
                  )}
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-3 text-gray-400 dark:text-gray-500" />
                    <span>
                      Membre depuis le{" "}
                      {new Date(user.created_at).toLocaleDateString("fr-FR")}
                    </span>
                  </div>
                </div>
              </InfoCard>

              {/* Profil freelancer */}
              {user.role === "freelancer" && user.freelancer_profile && (
                <InfoCard icon={Briefcase} title="Profil professionnel">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 dark:text-gray-400">
                        Tarif horaire
                      </span>
                      <span className="font-medium text-gray-900 dark:text-gray-100">
                        {user.freelancer_profile.hourly_rate}€/h
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 dark:text-gray-400">
                        Expérience
                      </span>
                      <span className="font-medium text-gray-900 dark:text-gray-100">
                        {user.freelancer_profile.years_experience} ans
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 dark:text-gray-400">
                        Compétence principale
                      </span>
                      <span className="font-medium text-gray-900 dark:text-gray-100">
                        {user.freelancer_profile.primary_skill}
                      </span>
                    </div>
                    {user.freelancer_profile.secondary_skill && (
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600 dark:text-gray-400">
                          Compétence secondaire
                        </span>
                        <span className="font-medium text-gray-900 dark:text-gray-100">
                          {user.freelancer_profile.secondary_skill}
                        </span>
                      </div>
                    )}
                    {user.freelancer_profile.city && (
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-3 text-gray-400 dark:text-gray-500" />
                        <span>
                          {user.freelancer_profile.city},{" "}
                          {user.freelancer_profile.country}
                        </span>
                      </div>
                    )}
                  </div>
                </InfoCard>
              )}

              {/* Badges et vérifications */}
              <InfoCard icon={Award} title="Badges et certifications">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400">
                      Vérification d'identité
                    </span>
                    {user.is_verified ? (
                      <span className="inline-flex items-center text-green-600 dark:text-green-400">
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Vérifié
                      </span>
                    ) : (
                      <span className="inline-flex items-center text-yellow-600 dark:text-yellow-400">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        En attente
                      </span>
                    )}
                  </div>
                  {user.top_rated && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 dark:text-gray-400">
                        Top Rated
                      </span>
                      <span className="inline-flex items-center text-yellow-600 dark:text-yellow-400">
                        <Star className="w-4 h-4 mr-1 fill-current" />
                        Actif
                      </span>
                    </div>
                  )}
                  {user.pending_documents &&
                    user.pending_documents.length > 0 && (
                      <div className="mt-4">
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Documents en attente:
                        </p>
                        <ul className="space-y-2">
                          {user.pending_documents.map((doc, index) => (
                            <li
                              key={index}
                              className="flex items-center text-sm text-gray-600 dark:text-gray-400"
                            >
                              <FileText className="w-4 h-4 mr-2 text-gray-400 dark:text-gray-500" />
                              {doc}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                </div>
              </InfoCard>

              {/* Réseaux sociaux */}
              <InfoCard icon={Globe} title="Réseaux sociaux">
                <div className="space-y-3">
                  {user.freelancer_profile?.website && (
                    <a
                      href={user.freelancer_profile.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition"
                    >
                      <Globe className="w-4 h-4 mr-3 text-gray-400 dark:text-gray-500" />
                      <span>Site web</span>
                    </a>
                  )}
                  {user.freelancer_profile?.linkedin && (
                    <a
                      href={user.freelancer_profile.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition"
                    >
                      <Linkedin className="w-4 h-4 mr-3 text-gray-400 dark:text-gray-500" />
                      <span>LinkedIn</span>
                    </a>
                  )}
                  {user.freelancer_profile?.github && (
                    <a
                      href={user.freelancer_profile.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition"
                    >
                      <Github className="w-4 h-4 mr-3 text-gray-400 dark:text-gray-500" />
                      <span>GitHub</span>
                    </a>
                  )}
                  {user.freelancer_profile?.twitter && (
                    <a
                      href={user.freelancer_profile.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-gray-700 dark:text-gray-300 hover:text-blue-400 transition"
                    >
                      <Twitter className="w-4 h-4 mr-3 text-gray-400 dark:text-gray-500" />
                      <span>Twitter</span>
                    </a>
                  )}
                  {!user.freelancer_profile?.website &&
                    !user.freelancer_profile?.linkedin &&
                    !user.freelancer_profile?.github &&
                    !user.freelancer_profile?.twitter && (
                      <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                        Aucun réseau social renseigné
                      </p>
                    )}
                </div>
              </InfoCard>
            </div>
          )}

          {activeTab === "services" && <ServicesHistory userId={userId} />}
          {activeTab === "payments" && <PaymentsHistory userId={userId} />}
          {activeTab === "disputes" && <DisputesHistory userId={userId} />}
          {activeTab === "logs" && <ActivityLogs userId={userId} />}
        </div>
      </div>

      {/* Modals */}
      <SuspendModal
        isOpen={suspendModal.isOpen}
        onClose={() => setSuspendModal({ isOpen: false, user: null })}
        user={suspendModal.user}
        onConfirm={handleSuspend}
        isSuspending={isSuspending}
      />

      <EmailModal
        isOpen={emailModal.isOpen}
        onClose={() => setEmailModal({ isOpen: false, user: null })}
        user={emailModal.user}
        onSend={handleSendEmail}
        isSending={isSendingEmail}
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
