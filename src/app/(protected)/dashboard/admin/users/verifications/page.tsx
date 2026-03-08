// app/(protected)/dashboard/admin/verifications/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  CheckCircle,
  XCircle,
  AlertCircle,
  Clock,
  User,
  FileText,
  Download,
  Eye,
  ChevronLeft,
  ChevronRight,
  Loader2,
  RefreshCw,
  Shield,
  Camera,
  IdCard,
  FileCheck as Passport,
  GraduationCap,
  Award,
  FileCheck,
  FileX,
  MessageSquare,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { useAdminVerifications } from "@/app/hooks/admin/use-verification";
import type { PendingVerification } from "@/app/types";
import VerificationsLoading from "./loading";
import AdminVerificationsError from "./error";

// Schéma de validation pour le rejet
const rejectSchema = z.object({
  reason: z.string().min(10, "La raison doit contenir au moins 10 caractères"),
});

type RejectFormData = z.infer<typeof rejectSchema>;

// Schéma pour les notes d'approbation
const approveSchema = z.object({
  notes: z.string().optional(),
});

type ApproveFormData = z.infer<typeof approveSchema>;

// Composant de carte de vérification (identique à votre code)
const VerificationCard = ({
  verification,
  onApprove,
  onReject,
  onViewDocument,
  isApproving,
  isRejecting,
}: {
  verification: PendingVerification;
  onApprove: (id: number, notes?: string) => void;
  onReject: (id: number, reason: string) => void;
  onViewDocument: (url: string) => void;
  isApproving: boolean;
  isRejecting: boolean;
}) => {
  const [showActions, setShowActions] = useState(false);
  const [showRejectForm, setShowRejectForm] = useState(false);

  const {
    register: registerReject,
    handleSubmit: handleRejectSubmit,
    formState: { errors: rejectErrors },
    reset: resetReject,
  } = useForm<RejectFormData>({
    resolver: zodResolver(rejectSchema),
  });

  const {
    register: registerApprove,
    handleSubmit: handleApproveSubmit,
    reset: resetApprove,
  } = useForm<ApproveFormData>({
    resolver: zodResolver(approveSchema),
  });

  const getDocumentIcon = (type: string) => {
    const icons: Record<string, any> = {
      cni: IdCard,
      passport: Passport,
      diploma: GraduationCap,
      certificate: Award,
    };
    const Icon = icons[type] || FileText;
    return <Icon className="w-8 h-8" />;
  };

  const getDocumentLabel = (type: string) => {
    const labels: Record<string, string> = {
      cni: "Carte d'identité",
      passport: "Passeport",
      diploma: "Diplôme",
      certificate: "Certificat",
    };
    return labels[type] || type;
  };

  const onApproveSubmit = (data: ApproveFormData) => {
    onApprove(verification.id, data.notes);
    setShowActions(false);
    resetApprove();
  };

  const onRejectSubmit = (data: RejectFormData) => {
    onReject(verification.id, data.reason);
    setShowRejectForm(false);
    resetReject();
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition border border-gray-200 dark:border-slate-700">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center text-blue-600 dark:text-blue-400">
              {getDocumentIcon(verification.document_type)}
            </div>
            <div className="ml-4">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                {verification.user_name}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {verification.user_email}
              </p>
            </div>
          </div>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400">
            <Clock className="w-3 h-3 mr-1" />
            En attente
          </span>
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
            <FileText className="w-4 h-4 mr-2 text-gray-400 dark:text-gray-500" />
            <span className="font-medium mr-2">Type:</span>
            {getDocumentLabel(verification.document_type)}
          </div>
          {verification.document_number && (
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
              <IdCard className="w-4 h-4 mr-2 text-gray-400 dark:text-gray-500" />
              <span className="font-medium mr-2">N°:</span>
              {verification.document_number}
            </div>
          )}
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
            <Clock className="w-4 h-4 mr-2 text-gray-400 dark:text-gray-500" />
            <span className="font-medium mr-2">Soumis le:</span>
            {new Date(verification.submitted_at).toLocaleDateString("fr-FR")}
          </div>
        </div>

        <div className="flex space-x-2 mb-4">
          <button
            onClick={() => onViewDocument(verification.front_image)}
            disabled={isApproving || isRejecting}
            className="flex-1 px-3 py-2 bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-slate-600 flex items-center justify-center transition disabled:opacity-50"
          >
            <Eye className="w-4 h-4 mr-2" />
            Voir recto
          </button>
          {verification.back_image && (
            <button
              onClick={() => onViewDocument(verification.back_image!)}
              disabled={isApproving || isRejecting}
              className="flex-1 px-3 py-2 bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-slate-600 flex items-center justify-center transition disabled:opacity-50"
            >
              <Eye className="w-4 h-4 mr-2" />
              Voir verso
            </button>
          )}
        </div>

        {!showRejectForm ? (
          <div className="flex space-x-2">
            <button
              onClick={() => setShowActions(!showActions)}
              disabled={isApproving || isRejecting}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center transition disabled:opacity-50"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Actions
            </button>
          </div>
        ) : (
          <form
            onSubmit={handleRejectSubmit(onRejectSubmit)}
            className="space-y-3"
          >
            <div>
              <textarea
                {...registerReject("reason")}
                placeholder="Raison du rejet..."
                rows={3}
                disabled={isRejecting}
                className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-red-500 focus:border-red-500 dark:focus:border-red-400 disabled:opacity-50"
              />
              {rejectErrors.reason && (
                <p className="text-red-600 dark:text-red-400 text-sm mt-1">
                  {rejectErrors.reason.message}
                </p>
              )}
            </div>
            <div className="flex space-x-2">
              <button
                type="submit"
                disabled={isRejecting}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:opacity-50 flex items-center justify-center"
              >
                {isRejecting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Rejet...
                  </>
                ) : (
                  "Confirmer le rejet"
                )}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowRejectForm(false);
                  resetReject();
                }}
                disabled={isRejecting}
                className="px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-300 transition disabled:opacity-50"
              >
                Annuler
              </button>
            </div>
          </form>
        )}

        {showActions && !showRejectForm && (
          <form
            onSubmit={handleApproveSubmit(onApproveSubmit)}
            className="mt-4 pt-4 border-t border-gray-100 dark:border-slate-700 space-y-3"
          >
            <div>
              <textarea
                {...registerApprove("notes")}
                placeholder="Notes (optionnel)..."
                rows={2}
                disabled={isApproving}
                className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:border-blue-400 disabled:opacity-50"
              />
            </div>
            <div className="flex space-x-2">
              <button
                type="submit"
                disabled={isApproving}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center justify-center transition disabled:opacity-50"
              >
                {isApproving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Approbation...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Approuver
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowRejectForm(true);
                  setShowActions(false);
                }}
                disabled={isApproving}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center justify-center transition disabled:opacity-50"
              >
                <XCircle className="w-4 h-4 mr-2" />
                Rejeter
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

// Modal de visualisation de document
const DocumentViewer = ({
  isOpen,
  onClose,
  imageUrl,
}: {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string | null;
}) => {
  if (!isOpen || !imageUrl) return null;

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
          src={imageUrl}
          alt="Document"
          className="max-w-full max-h-[90vh] object-contain"
        />
      </div>
    </div>
  );
};

// Statistiques
const StatsCard = ({ icon: Icon, title, value, color, loading }: any) => (
  <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-slate-700">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-600 dark:text-gray-400">{title}</p>
        <p className="text-2xl font-bold text-gray-800 dark:text-gray-200">
          {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : value}
        </p>
      </div>
      <div
        className={`w-12 h-12 ${color} rounded-lg flex items-center justify-center text-white`}
      >
        <Icon className="w-6 h-6" />
      </div>
    </div>
  </div>
);

export default function VerificationsPage() {
  const router = useRouter();
  const [selectedDocument, setSelectedDocument] = useState<string | null>(null);
  const [filter, setFilter] = useState<{ status?: string }>({
    status: "pending",
  });

  // Hook personnalisé - maintenant avec un objet filter
  const {
    verifications,
    isLoading,
    error,
    stats,
    statsLoading,
    approveVerification,
    isApproving,
    rejectVerification,
    isRejecting,
    refetch,
  } = useAdminVerifications(filter.status);

  // Fonction pour changer le filtre
  const handleFilterChange = (status: string | null) => {
    if (status) {
      setFilter({ status });
    } else {
      setFilter({});
    }
  };

  const handleApprove = async (id: number, notes?: string) => {
    await approveVerification({ id, notes });
  };

  const handleReject = async (id: number, reason: string) => {
    await rejectVerification({ id, reason });
  };

  const handleViewDocument = (url: string) => {
    setSelectedDocument(url);
  };

  if (isLoading) {
    return <VerificationsLoading />;
  }

  if (error) {
    return <AdminVerificationsError error={error} onRetry={refetch} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950">
      <div className="container mx-auto px-4 py-8">
        {/* En-tête */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center">
            <Shield className="w-6 h-6 mr-2 text-blue-600 dark:text-blue-400" />
            Vérifications en attente
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Gérez les documents soumis par les utilisateurs pour vérification
          </p>
        </div>

        {/* Statistiques - Note: backend retourne "verified" pas "approved" */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <StatsCard
            icon={Clock}
            title="En attente"
            value={stats?.pending || 0}
            color="bg-yellow-500"
            loading={statsLoading}
          />
          <StatsCard
            icon={CheckCircle}
            title="Vérifiées"
            value={stats?.approved || 0}
            color="bg-green-500"
            loading={statsLoading}
          />
          <StatsCard
            icon={XCircle}
            title="Rejetées"
            value={stats?.rejected || 0}
            color="bg-red-500"
            loading={statsLoading}
          />
        </div>

        {/* Filtres (optionnel) */}
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-4 mb-6 border border-gray-200 dark:border-slate-700">
          <div className="flex space-x-4">
            <button
              onClick={() => handleFilterChange("pending")}
              className={`px-4 py-2 rounded-lg transition ${
                filter.status === "pending"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600"
              }`}
            >
              En attente
            </button>
            <button
              onClick={() => handleFilterChange("verified")}
              className={`px-4 py-2 rounded-lg transition ${
                filter.status === "verified"
                  ? "bg-green-600 text-white"
                  : "bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600"
              }`}
            >
              Vérifiées
            </button>
            <button
              onClick={() => handleFilterChange("rejected")}
              className={`px-4 py-2 rounded-lg transition ${
                filter.status === "rejected"
                  ? "bg-red-600 text-white"
                  : "bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600"
              }`}
            >
              Rejetées
            </button>
            <button
              onClick={() => handleFilterChange(null)}
              className={`px-4 py-2 rounded-lg transition ${
                !filter.status
                  ? "bg-gray-600 text-white"
                  : "bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600"
              }`}
            >
              Toutes
            </button>
          </div>
        </div>

        {/* Actions */}
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-4 mb-6 flex justify-between items-center border border-gray-200 dark:border-slate-700">
          <div className="flex space-x-2">
            <button
              onClick={() => refetch()}
              disabled={isLoading}
              className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 border border-gray-300 dark:border-slate-600 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 flex items-center transition disabled:opacity-50"
            >
              <RefreshCw
                className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`}
              />
              Actualiser
            </button>
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {verifications.length} document{verifications.length > 1 ? "s" : ""}{" "}
            {filter.status === "pending"
              ? "en attente"
              : filter.status === "verified"
                ? "vérifiés"
                : filter.status === "rejected"
                  ? "rejetés"
                  : "total"}
          </div>
        </div>

        {/* Grille des vérifications */}
        {verifications.length === 0 ? (
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-12 text-center border border-gray-200 dark:border-slate-700">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
              Aucune vérification{" "}
              {filter.status === "pending" ? "en attente" : ""}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Tous les documents ont été traités
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {verifications.map((verification) => (
              <VerificationCard
                key={verification.id}
                verification={verification}
                onApprove={handleApprove}
                onReject={handleReject}
                onViewDocument={handleViewDocument}
                isApproving={isApproving}
                isRejecting={isRejecting}
              />
            ))}
          </div>
        )}

        {/* Modal de visualisation */}
        <DocumentViewer
          isOpen={!!selectedDocument}
          onClose={() => setSelectedDocument(null)}
          imageUrl={selectedDocument}
        />
      </div>
    </div>
  );
}
