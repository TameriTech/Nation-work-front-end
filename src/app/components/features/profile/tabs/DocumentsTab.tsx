// components/features/profile/tabs/DocumentsTabContent.tsx
"use client";
import { useState } from "react";
import { Progress } from "@/app/components/ui/progress";
import { Badge } from "@/app/components/ui/badge";
import { Button } from "@/app/components/ui/button";
import { Icon } from "@iconify/react";
import { useDocuments } from "@/app/hooks/profile/use-documents";
import { UploadDocumentModal } from "../modals/UploadDocumentModal";
import { CreateDocumentDto, DocumentDisplay, DocumentType } from "@/app/types";
import { DocumentsSkeleton } from "./loading";
import { DocumentsError } from "./error";
import {
  createDocumentSchema,
  type CreateDocumentFormData,
} from "@/app/lib/validators/document.validator";

export default function DocumentsTabContent() {
  const {
    documents,
    kycStatus,
    progress,
    isLoading,
    error,
    uploadDocument,
    deleteDocument,
    resubmitDocument,
    getDocumentsByStatus,
    refetch,
  } = useDocuments();

  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedDocument, setSelectedDocument] =
    useState<DocumentDisplay | null>(null);
  const [resubmitFile, setResubmitFile] = useState<File | null>(null);

  const { validated, inProgress, rejected, pending } = getDocumentsByStatus();

  const handleUpload = async (data: CreateDocumentFormData) => {
    if (selectedDocument) {
      // Mode resoumission
      await resubmitDocument({
        documentId: parseInt(selectedDocument.id),
        file: data.file,
      });
    } else {
      // Mode upload normal
      await uploadDocument(data);
    }
    setShowUploadModal(false);
    setSelectedDocument(null);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce document ?")) {
      await deleteDocument(parseInt(id));
    }
  };

  const handleResubmit = (document: DocumentDisplay) => {
    setSelectedDocument(document);
    setShowUploadModal(true);
  };

  const completionPercentage = progress?.percentage ?? 0;

  if (isLoading) {
    return <DocumentsSkeleton />;
  }

  if (error) {
    return <DocumentsError error={error} onRetry={refetch} />;
  }

  return (
    <div className="bg-white rounded-3xl p-6">
      {/* KYC Progress Header */}
      <div className="bg-white rounded-3xl pb-3">
        <div className="flex items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-900/10 flex items-center justify-center">
              <Icon icon="mdi:shield-check" className="h-5 w-5 text-blue-900" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-blue-900">
                Vérification KYC
              </h2>
              <p className="text-sm text-gray-500">
                {progress?.verified} sur {progress?.total.length} documents
                validés
              </p>
            </div>
          </div>
          <Button
            onClick={() => {
              setSelectedDocument(null);
              setShowUploadModal(true);
            }}
            className="bg-blue-600 text-white rounded-full hover:bg-blue-700"
            disabled={validated.length >= 5} // Limite de 5 documents
          >
            <Icon icon="mdi:upload" className="h-4 w-4 mr-2" />
            Upload new document
          </Button>
        </div>
        <Progress value={completionPercentage} className="h-3 rounded-full" />
        <p className="text-right text-sm text-gray-500 mt-1">
          {completionPercentage}% complété
        </p>
      </div>

      {/* Documents Validés */}
      {validated.length > 0 && (
        <DocumentSection
          title="Documents Validés"
          icon="mdi:check-circle"
          documents={validated}
          onDelete={handleDelete}
          showActions={true}
        />
      )}

      {/* Documents en cours */}
      {inProgress.length > 0 && (
        <DocumentSection
          title="Documents en cours de vérification"
          icon="mdi:clock"
          documents={inProgress}
          onDelete={handleDelete}
          showActions={true}
        />
      )}

      {/* Documents rejetés */}
      {rejected.length > 0 && (
        <DocumentSection
          title="Documents rejetés"
          icon="mdi:alert-circle"
          documents={rejected}
          onDelete={handleDelete}
          onResubmit={handleResubmit}
          showActions={true}
          showResubmit={true}
        />
      )}

      {/* Documents en attente */}
      {pending.length > 0 && (
        <DocumentSection
          title="Documents à fournir"
          icon="mdi:clock-outline"
          documents={pending}
          showActions={false}
          onUpload={(doc) => {
            setSelectedDocument(doc);
            setShowUploadModal(true);
          }}
        />
      )}

      {/* Message si aucun document */}
      {documents.length === 0 && (
        <div className="text-center py-12">
          <Icon
            icon="mdi:file-document-outline"
            className="h-16 w-16 text-gray-300 mx-auto mb-4"
          />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Aucun document
          </h3>
          <p className="text-gray-500 mb-6">
            Commencez par uploader vos documents pour vérifier votre identité.
          </p>
          <Button
            onClick={() => setShowUploadModal(true)}
            className="bg-blue-600 text-white rounded-full hover:bg-blue-700"
          >
            <Icon icon="mdi:upload" className="h-4 w-4 mr-2" />
            Uploader un document
          </Button>
        </div>
      )}

      {/* Modal d'upload */}
      <UploadDocumentModal
        isOpen={showUploadModal}
        onClose={() => {
          setShowUploadModal(false);
          setSelectedDocument(null);
        }}
        onUpload={handleUpload}
        initialDocumentType={selectedDocument?.document_type}
        isResubmit={!!selectedDocument}
      />
    </div>
  );
}

// ==================== SOUS-COMPOSANTS ====================

interface DocumentSectionProps {
  title: string;
  icon: string;
  documents: DocumentDisplay[];
  onDelete?: (id: string) => void;
  onResubmit?: (doc: DocumentDisplay) => void;
  onUpload?: (doc: DocumentDisplay) => void;
  showActions?: boolean;
  showResubmit?: boolean;
}

function DocumentSection({
  title,
  icon,
  documents,
  onDelete,
  onResubmit,
  onUpload,
  showActions = true,
  showResubmit = false,
}: DocumentSectionProps) {
  return (
    <div className="py-6 border-b border-gray-200 last:border-0">
      <SectionHeader icon={icon} title={title} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
        {documents.map((doc) => (
          <DocumentCard
            key={doc.id}
            document={doc}
            onDelete={onDelete}
            onResubmit={onResubmit}
            onUpload={onUpload}
            showActions={showActions}
            showResubmit={showResubmit}
          />
        ))}
      </div>
    </div>
  );
}

function DocumentCard({
  document,
  onDelete,
  onResubmit,
  onUpload,
  showActions,
  showResubmit,
}: any) {
  const getDocumentIcon = (type: string) => {
    switch (type) {
      case "passport":
        return "mdi:passport";
      case "id_card":
        return "mdi:card-account-details";
      case "driver_license":
        return "mdi:car";
      case "diploma":
        return "mdi:school";
      case "certificate":
        return "mdi:certificate";
      default:
        return "mdi:file-document-outline";
    }
  };

  return (
    <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 hover:shadow-md transition-shadow">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-lg bg-blue-900/10 flex items-center justify-center shrink-0">
          <Icon
            icon={getDocumentIcon(document.document_type)}
            className="h-6 w-6 text-blue-900"
          />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h4 className="font-semibold text-gray-900 truncate">
                {document.name}
              </h4>
              <p className="text-xs text-gray-500 mt-0.5">
                Soumis le {document.submission_date}
              </p>
              {document.expiry_date && (
                <p className="text-xs text-gray-500">
                  Expire le {document.expiry_date}
                </p>
              )}
            </div>
            <StatusBadge status={document.status} />
          </div>

          {document.admin_comment && (
            <div className="mt-3 p-3 bg-amber-50 rounded-lg border border-amber-200">
              <p className="text-xs font-medium text-amber-800 mb-1">
                Commentaire admin:
              </p>
              <p className="text-sm text-amber-700">{document.admin_comment}</p>
            </div>
          )}

          {showActions && (
            <div className="flex items-center justify-end gap-2 mt-3 pt-3 border-t border-gray-200">
              {document.file_url && (
                <a
                  href={document.file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                  title="Voir le document"
                >
                  <Icon icon="mdi:eye" className="h-4 w-4 text-gray-600" />
                </a>
              )}
              {showResubmit && onResubmit && (
                <button
                  onClick={() => onResubmit(document)}
                  className="p-2 hover:bg-blue-100 rounded-lg transition-colors"
                  title="Resoumettre"
                >
                  <Icon icon="mdi:refresh" className="h-4 w-4 text-blue-600" />
                </button>
              )}
              {onUpload && (
                <button
                  onClick={() => onUpload(document)}
                  className="p-2 hover:bg-blue-100 rounded-lg transition-colors"
                  title="Uploader"
                >
                  <Icon icon="mdi:upload" className="h-4 w-4 text-blue-600" />
                </button>
              )}
              {onDelete && (
                <button
                  onClick={() => onDelete(document.id)}
                  className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                  title="Supprimer"
                >
                  <Icon icon="mdi:trash" className="h-4 w-4 text-red-600" />
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function SectionHeader({ icon, title }: { icon: string; title: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 rounded-lg bg-blue-900/10 flex items-center justify-center">
        <Icon icon={icon} className="h-4 w-4 text-blue-900" />
      </div>
      <h3 className="text-base font-semibold text-blue-900">{title}</h3>
      <span className="text-sm text-gray-500 ml-auto">
        {/* Optionnel : compteur */}
      </span>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const config = {
    validated: {
      label: "Validé",
      className: "bg-emerald-100 text-emerald-700 border-emerald-200",
      icon: "mdi:check-circle",
    },
    in_progress: {
      label: "En cours",
      className: "bg-amber-100 text-amber-700 border-amber-200",
      icon: "mdi:clock",
    },
    rejected: {
      label: "Rejeté",
      className: "bg-red-100 text-red-700 border-red-200",
      icon: "mdi:close-circle",
    },
    pending: {
      label: "À fournir",
      className: "bg-gray-100 text-gray-700 border-gray-200",
      icon: "mdi:clock-outline",
    },
  };

  const { label, className, icon } =
    config[status as keyof typeof config] || config.pending;

  return (
    <Badge
      variant="outline"
      className={`${className} rounded-full px-3 py-1 text-xs font-medium flex items-center gap-1.5 whitespace-nowrap`}
    >
      <Icon icon={icon} className="h-3.5 w-3.5" />
      {label}
    </Badge>
  );
}
