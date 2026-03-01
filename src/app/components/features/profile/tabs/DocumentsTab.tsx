// components/features/profile/tabs/DocumentsTab.tsx

"use client";
import { useState } from "react";
import { Progress } from "@/app/components/ui/progress";
import { Badge } from "@/app/components/ui/badge";
import { Button } from "@/app/components/ui/button";
import { Icon } from "@iconify/react";
import { useDocuments } from "@/app/hooks/use-documents";
import { UploadDocumentModal } from "../modals/UploadDocumentModal";
import { DocumentDisplay } from "@/app/types/user";
import { Doc } from "zod/v4/core";

export default function DocumentsTabContent() {
  const {
    getDocumentsByStatus,
    kycStatus,
    loading,
    sendDocument,
    deleteDocument,
    resubmitDocument,
    documents,
  } = useDocuments();

  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedDocument, setSelectedDocument] =
    useState<DocumentDisplay | null>(null);

  const { validated, inProgress, rejected, pending } = getDocumentsByStatus();

  const handleUpload = async (documentData?: any) => {
    await sendDocument(documentData);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce document ?")) {
      await deleteDocument(parseInt(id));
    }
  };

  const handleResubmit = async (document: DocumentDisplay) => {
    setSelectedDocument(document);
    // Ouvrir un modal d'upload avec le type pré-sélectionné
    setShowUploadModal(true);
  };

  const completionPercentage = kycStatus?.completion_percentage ?? 0;

  if (loading) {
    return (
      <div className="bg-white rounded-3xl p-6">
        <div className="text-center py-8">Chargement...</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl p-6">
      {/* KYC Progress Header */}
      <div className="bg-white rounded-3xl pb-3">
        <div className="flex items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-900/10 flex items-center justify-center">
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12.5 18.3332C12.1583 18.3332 11.875 18.0498 11.875 17.7082V2.2915C11.875 1.94984 12.1583 1.6665 12.5 1.6665C12.8417 1.6665 13.125 1.94984 13.125 2.2915V17.7082C13.125 18.0498 12.8417 18.3332 12.5 18.3332Z"
                  fill="#05579B"
                />
                <path
                  d="M15 16.6668H12.5V3.3335H15C16.8417 3.3335 18.3333 4.82516 18.3333 6.66683V13.3335C18.3333 15.1752 16.8417 16.6668 15 16.6668Z"
                  fill="#05579B"
                />
                <path
                  d="M4.99935 3.3335C3.15768 3.3335 1.66602 4.82516 1.66602 6.66683V13.3335C1.66602 15.1752 3.15768 16.6668 4.99935 16.6668H9.16602C9.62435 16.6668 9.99935 16.2918 9.99935 15.8335V4.16683C9.99935 3.7085 9.62435 3.3335 9.16602 3.3335H4.99935ZM6.45768 12.9168C6.45768 13.2585 6.17435 13.5418 5.83268 13.5418C5.49102 13.5418 5.20768 13.2585 5.20768 12.9168V7.0835C5.20768 6.74183 5.49102 6.4585 5.83268 6.4585C6.17435 6.4585 6.45768 6.74183 6.45768 7.0835V12.9168Z"
                  fill="#05579B"
                />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-blue-900">
              État de validation des KYC ({completionPercentage}%)
            </h2>
          </div>
          <Button
            onClick={() => setShowUploadModal(true)}
            className="bg-blue-600 text-white rounded-full"
          >
            Upload new document
          </Button>
        </div>
        <Progress value={completionPercentage} className="h-3 rounded-full" />
      </div>

      {/* Documents Validés */}
      {validated?.length > 0 && (
        <div className="py-3">
          <SectionHeader icon="bi:clipboard2-check" title="Documents Validés" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {validated.map((doc: DocumentDisplay) => (
              <ValidatedDocumentItem
                key={doc.id}
                document={doc}
                onDelete={() => handleDelete(doc.id)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Documents en cours */}
      {inProgress?.length > 0 && (
        <div className="py-3">
          <SectionHeader icon="bi:clock" title="Documents en cours" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {inProgress.map((doc: DocumentDisplay) => (
              <InProgressDocumentItem
                key={doc.id}
                document={doc}
                onDelete={() => handleDelete(doc.id)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Documents rejetés */}
      {rejected?.length > 0 && (
        <div className="py-3">
          <SectionHeader
            icon="bi:exclamation-triangle"
            title="Documents rejetés"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {rejected.map((doc: DocumentDisplay) => (
              <RejectedDocumentItem
                key={doc.id}
                document={doc}
                onResubmit={() => handleResubmit(doc)}
                onDelete={() => handleDelete(doc.id)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Documents en attente */}
      {pending?.length > 0 && (
        <div className="py-3">
          <SectionHeader
            icon="bx:time-five"
            title="Documents en attente"
            showAddButton
            onAdd={() => setShowUploadModal(true)}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {pending.map((doc: DocumentDisplay) => (
              <PendingDocumentItem
                key={doc.id}
                document={doc}
                onUpload={() => {
                  setSelectedDocument(doc);
                  setShowUploadModal(true);
                }}
              />
            ))}
          </div>
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
      />
    </div>
  );
}

// Composants auxiliaires (à garder tels quels)
function SectionHeader({ icon, title, showAddButton = false, onAdd }: any) {
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-blue-900/10 flex items-center justify-center">
          <Icon icon={icon} className="h-4 w-4 text-blue-900" />
        </div>
        <h3 className="text-base font-semibold text-blue-900">{title}</h3>
      </div>
      {showAddButton && (
        <Button
          size="sm"
          onClick={onAdd}
          className="rounded-full bg-blue-900 hover:bg-blue-900/90 text-white gap-1.5 px-4"
        >
          <Icon icon="mdi:plus" className="h-4 w-4" />
          Ajouter
        </Button>
      )}
    </div>
  );
}

function ValidatedDocumentItem({
  document,
  onDelete,
}: {
  document: DocumentDisplay;
  onDelete: () => void;
}) {
  return (
    <div className="py-4 border-b border-gray-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <DocumentIcon variant="blue" />
          <div>
            <p className="font-semibold text-sm text-gray-800">
              {document.name}
            </p>
            <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
              <Icon icon="mdi:calendar" className="h-3.5 w-3.5" />
              <span>{document.submission_date}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <StatusBadge status={document.status} />
          <button
            onClick={onDelete}
            className="p-1.5 hover:bg-red-500/10 rounded-md transition-colors"
          >
            <Icon icon="bi:trash" className="h-4 w-4 text-red-500" />
          </button>
        </div>
      </div>
    </div>
  );
}

function InProgressDocumentItem({
  document,
  onDelete,
}: {
  document: DocumentDisplay;
  onDelete: () => void;
}) {
  return (
    <div className="py-4 border-b border-gray-100">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <DocumentIcon variant="blue" />
          <div>
            <p className="font-semibold text-gray-800">{document.name}</p>
            <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
              <Icon icon="mdi:calendar" className="h-3.5 w-3.5" />
              <span>{document.submission_date}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <StatusBadge status={document.status} />
          <button
            onClick={onDelete}
            className="p-1.5 hover:bg-red-500/10 rounded-md transition-colors"
          >
            <Icon icon="bi:trash" className="h-4 w-4 text-red-500" />
          </button>
        </div>
      </div>
    </div>
  );
}

function RejectedDocumentItem({ document, onResubmit, onDelete }: any) {
  return (
    <div className="py-4 border-b border-border/40 last:border-0">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-4">
          <DocumentIcon variant="blue" />
          <div>
            <p className="font-semibold text-foreground">{document.name}</p>
            <div className="flex items-center gap-2 text-sm text-slate-400 mt-1">
              <Icon icon="mdi:calendar" className="h-3.5 w-3.5" />
              <span>{document.submissionDate}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <StatusBadge status={document.status} />
          <button
            onClick={onResubmit}
            className="p-1.5 hover:bg-muted rounded-md transition-colors"
          >
            <Icon icon="mdi:refresh-cw" className="h-4 w-4 text-slate-400" />
          </button>
          <button
            onClick={onDelete}
            className="p-1.5 hover:bg-destructive/10 rounded-md transition-colors"
          >
            <Icon icon="mdi:trash-2" className="h-4 w-4 text-destructive" />
          </button>
        </div>
      </div>
      {document.adminComment && (
        <div className="ml-14 pl-4 border-l-2 border-border/60">
          <p className="text-sm text-slate-400">{document.admin_comment}</p>
          <p className="text-xs text-slate-400/70 mt-1">
            {document.comment_date}
          </p>
        </div>
      )}
    </div>
  );
}

function PendingDocumentItem({ document, onUpload }: any) {
  return (
    <div className="py-4 border-b border-gray-100">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <DocumentIcon variant="blue" />
          <div>
            <p className="font-semibold text-gray-800">{document.name}</p>
            <StatusBadge status={document.status} />
          </div>
        </div>
        <button
          onClick={onUpload}
          className="w-10 h-10 rounded-full bg-blue-900 hover:bg-blue-900/90 flex items-center justify-center transition-colors"
        >
          <Icon icon="mdi:upload" className="h-5 w-5 text-white" />
        </button>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const config = {
    validated: {
      label: "validé",
      className: "bg-emerald-50 text-emerald-600 border-emerald-200",
      icon: "mdi:check-circle",
    },
    in_progress: {
      label: "en cours",
      className: "bg-amber-50 text-amber-600 border-amber-200",
      icon: "mdi:clock",
    },
    rejected: {
      label: "rejeté",
      className: "bg-red-50 text-red-600 border-red-200",
      icon: "mdi:close",
    },
    pending: {
      label: "en attente",
      className: "bg-amber-50 text-amber-600 border-amber-200",
      icon: "bi:exclamation-triangle-fill",
    },
  };

  const { label, className, icon } =
    config[status as keyof typeof config] || config.pending;

  return (
    <Badge
      variant="outline"
      className={`${className} rounded-full px-3 py-1 text-xs font-medium flex items-center gap-1.5`}
    >
      <Icon icon={icon} className="h-3.5 w-3.5" />
      {label}
    </Badge>
  );
}

function DocumentIcon({
  variant = "default",
}: {
  variant?: "default" | "blue";
}) {
  return (
    <div
      className={`w-10 h-10 rounded-lg flex items-center justify-center ${
        variant === "blue" ? "bg-blue-900/10" : "bg-gray-100"
      }`}
    >
      <Icon
        icon="mdi:file-document-outline"
        className={`h-5 w-5 ${
          variant === "blue" ? "text-blue-900" : "text-gray-600"
        }`}
      />
    </div>
  );
}
