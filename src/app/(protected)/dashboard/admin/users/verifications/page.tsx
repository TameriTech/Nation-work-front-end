"use client";

import { useState, useEffect } from "react";
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

import {
  getPendingVerifications,
  approveVerification,
  rejectVerification,
} from "@/app/services/users.service";
import type { PendingVerification } from "@/app/types/admin";
import { users as mockUsers } from "@/data/admin-mock-data";

// Composant de carte de vérification
const VerificationCard = ({
  verification,
  onApprove,
  onReject,
  onViewDocument,
}: {
  verification: PendingVerification;
  onApprove: (id: number, notes?: string) => void;
  onReject: (id: number, reason: string) => void;
  onViewDocument: (url: string) => void;
}) => {
  const [showActions, setShowActions] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [notes, setNotes] = useState("");
  const [showRejectForm, setShowRejectForm] = useState(false);

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

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition border border-gray-200 dark:border-slate-700">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center text-blue-600 dark:text-blue-400">
              {getDocumentIcon(verification.document_type)}
            </div>
            <div className="ml-4">
              <h3 className="font-semibold text-gray-800 dark:text-gray-200">
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
            className="flex-1 px-3 py-2 bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-slate-600 flex items-center justify-center transition"
          >
            <Eye className="w-4 h-4 mr-2" />
            Voir recto
          </button>
          {verification.back_image && (
            <button
              onClick={() => onViewDocument(verification.back_image!)}
              className="flex-1 px-3 py-2 bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-slate-600 flex items-center justify-center transition"
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
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center transition"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Actions
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Raison du rejet..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-red-500 focus:border-red-500 dark:focus:border-red-400"
            />
            <div className="flex space-x-2">
              <button
                onClick={() => {
                  onReject(verification.id, rejectReason);
                  setShowRejectForm(false);
                  setRejectReason("");
                }}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                Confirmer le rejet
              </button>
              <button
                onClick={() => {
                  setShowRejectForm(false);
                  setRejectReason("");
                }}
                className="px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-300 transition"
              >
                Annuler
              </button>
            </div>
          </div>
        )}

        {showActions && !showRejectForm && (
          <div className="mt-4 pt-4 border-t border-gray-100 dark:border-slate-700 space-y-3">
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Notes (optionnel)..."
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:border-blue-400"
            />
            <div className="flex space-x-2">
              <button
                onClick={() => {
                  onApprove(verification.id, notes);
                  setShowActions(false);
                  setNotes("");
                }}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center justify-center transition"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Approuver
              </button>
              <button
                onClick={() => {
                  setShowRejectForm(true);
                  setShowActions(false);
                }}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center justify-center transition"
              >
                <XCircle className="w-4 h-4 mr-2" />
                Rejeter
              </button>
            </div>
          </div>
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
const StatsCard = ({ icon: Icon, title, value, color }: any) => (
  <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-slate-700">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-600 dark:text-gray-400">{title}</p>
        <p className="text-2xl font-bold text-gray-800 dark:text-gray-200">
          {value}
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

  const [loading, setLoading] = useState(true);
  const [verifications, setVerifications] = useState<PendingVerification[]>([]);
  const [selectedDocument, setSelectedDocument] = useState<string | null>(null);
  const [stats, setStats] = useState({
    pending: 0,
    approved: 0,
    rejected: 0,
  });

  // Charger les données
  useEffect(() => {
    const loadVerifications = async () => {
      try {
        setLoading(true);
        // Utiliser les mock data
        setVerifications(
          mockUsers.pending_verifications as PendingVerification[],
        );
        setStats({
          pending: mockUsers.pending_verifications.length,
          approved: 0,
          rejected: 0,
        });

        // Version API
        // const data = await getPendingVerifications();
        // setVerifications(data);
      } catch (error) {
        console.error("Erreur chargement vérifications:", error);
      } finally {
        setLoading(false);
      }
    };

    loadVerifications();
  }, []);

  const handleApprove = async (id: number, notes?: string) => {
    try {
      await approveVerification(id, notes);
      // Recharger la liste
      setVerifications(verifications.filter((v) => v.id !== id));
      setStats((prev) => ({
        ...prev,
        pending: prev.pending - 1,
        approved: prev.approved + 1,
      }));
    } catch (error) {
      console.error("Erreur approbation:", error);
    }
  };

  const handleReject = async (id: number, reason: string) => {
    if (!reason) {
      alert("Veuillez fournir une raison de rejet");
      return;
    }
    try {
      await rejectVerification(id, reason);
      // Recharger la liste
      setVerifications(verifications.filter((v) => v.id !== id));
      setStats((prev) => ({
        ...prev,
        pending: prev.pending - 1,
        rejected: prev.rejected + 1,
      }));
    } catch (error) {
      console.error("Erreur rejet:", error);
    }
  };

  const handleViewDocument = (url: string) => {
    setSelectedDocument(url);
  };

  if (loading) {
    return (
      <div className="min-h-screen dark:bg-slate-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen dark:bg-slate-950">
      <div className="container mx-auto">
        {/* En-tête */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-100 flex items-center">
            <Shield className="w-6 h-6 mr-2 text-blue-600" />
            Vérifications en attente
          </h1>
          <p className="text-gray-400 mt-1">
            Gérez les documents soumis par les utilisateurs pour vérification
          </p>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <StatsCard
            icon={Clock}
            title="En attente"
            value={stats.pending}
            color="bg-yellow-500"
          />
          <StatsCard
            icon={CheckCircle}
            title="Approuvées"
            value={stats.approved}
            color="bg-green-500"
          />
          <StatsCard
            icon={XCircle}
            title="Rejetées"
            value={stats.rejected}
            color="bg-red-500"
          />
        </div>

        {/* Actions */}
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-4 mb-6 flex justify-between items-center border border-gray-200 dark:border-slate-700">
          <div className="flex space-x-2">
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 border border-gray-300 dark:border-slate-600 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 flex items-center transition"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Actualiser
            </button>
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {stats.pending} document{stats.pending > 1 ? "s" : ""} en attente
          </div>
        </div>

        {/* Grille des vérifications */}
        {verifications.length === 0 ? (
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-12 text-center border border-gray-200 dark:border-slate-700">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
              Aucune vérification en attente
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
