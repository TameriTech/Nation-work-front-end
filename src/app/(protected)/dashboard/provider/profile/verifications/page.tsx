// app/(dashboard)/provider/profile/documents/page.tsx - Page documents
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@iconify/react";
import { Button } from "@/app/components/ui/button";
import { Card } from "@/app/components/ui/card";
import { Progress } from "@/app/components/ui/progress";
import { Badge } from "@/app/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/app/components/ui/dialog";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import { useDocuments } from "@/app/hooks/provider-profile/use-documents";

const documentTypes = [
  { value: "id_card", label: "Carte d'identité" },
  { value: "passport", label: "Passeport" },
  { value: "driver_license", label: "Permis de conduire" },
  { value: "diploma", label: "Diplôme" },
  { value: "certificate", label: "Certificat" },
  { value: "other", label: "Autre document" },
];

export default function DocumentsPage() {
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const { documents, kycStatus, progress, uploadDocument, deleteDocument, isLoading } = useDocuments();

  const getStatusBadge = (status: string) => {
    const config: Record<string, { label: string; className: string; icon: string }> = {
      verified: { label: "Validé", className: "bg-green-100 text-green-700", icon: "ph:check-circle" },
      pending: { label: "En cours", className: "bg-yellow-100 text-yellow-700", icon: "ph:clock" },
      rejected: { label: "Rejeté", className: "bg-red-100 text-red-700", icon: "ph:warning" },
      expired: { label: "Expiré", className: "bg-gray-100 text-gray-700", icon: "ph:clock" },
    };
    return config[status] || config.pending;
  };

  const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setUploading(true);
    const formData = new FormData(e.currentTarget);
    await uploadDocument({
      document_type: formData.get("document_type")  || "other",
      file: formData.get("file") as File,
    });
    setUploading(false);
    setModalOpen(false);
  };

  if (isLoading) {
    return <div className="min-h-screen bg-background dark:bg-gray-900 flex items-center justify-center">Chargement...</div>;
  }

  const completionPercentage = progress?.percentage || 0;
  const groupedDocs = {
    verified: documents?.filter((d: any) => d.status === "verified") || [],
    pending: documents?.filter((d: any) => d.status === "pending") || [],
    rejected: documents?.filter((d: any) => d.status === "rejected") || [],
  };

  return (
    <div className="min-h-screen bg-background dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-16">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button onClick={() => router.back()} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
            <Icon icon="ph:arrow-left" className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-text-primary dark:text-gray-100">
              Documents & Vérification
            </h1>
            <p className="text-text-secondary dark:text-gray-400">
              Téléchargez vos documents pour la vérification KYC
            </p>
          </div>
        </div>

        {/* Progression KYC */}
        <Card className="rounded-2xl p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-lg font-semibold">Vérification KYC</h2>
              <p className="text-sm text-text-secondary">{progress?.verified || 0} sur {kycStatus?.total_documents || 0} documents validés</p>
            </div>
            <Button onClick={() => setModalOpen(true)} className="rounded-full">
              <Icon icon="ph:upload" className="w-4 h-4 mr-2" /> Uploader
            </Button>
          </div>
          <Progress value={completionPercentage} className="h-3" />
          <p className="text-right text-sm text-text-secondary mt-1">{completionPercentage}% complété</p>
        </Card>

        {/* Documents validés */}
        {groupedDocs.verified.length > 0 && (
          <DocumentSection title="Documents validés" icon="ph:check-circle" textColor="text-green-600" documents={groupedDocs.verified} onDelete={deleteDocument} />
        )}

        {/* Documents en attente */}
        {groupedDocs.pending.length > 0 && (
          <DocumentSection title="En cours de vérification" icon="ph:clock" textColor="text-yellow-600" documents={groupedDocs.pending} onDelete={deleteDocument} />
        )}

        {/* Documents rejetés */}
        {groupedDocs.rejected.length > 0 && (
          <DocumentSection title="Documents rejetés" icon="ph:warning" textColor="text-red-600" documents={groupedDocs.rejected} onDelete={deleteDocument} />
        )}

        {/* Message vide */}
        {documents?.length === 0 && (
          <Card className="rounded-2xl p-12 text-center">
            <Icon icon="ph:file-text" className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Aucun document</h3>
            <p className="text-text-secondary mb-4">Commencez par uploader vos documents pour vérifier votre identité.</p>
            <Button onClick={() => setModalOpen(true)} className="rounded-full">
              <Icon icon="ph:upload" className="w-4 h-4 mr-2" /> Uploader un document
            </Button>
          </Card>
        )}

        <div className="mt-6 flex justify-end">
          <Button variant="outline" onClick={() => router.push("/dashboard/provider/profile")} className="rounded-full">
            Retour au profil
          </Button>
        </div>
      </div>

      {/* Modal upload */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-[450px] dark:bg-gray-800">
          <DialogHeader><DialogTitle>Ajouter un document</DialogTitle></DialogHeader>
          <form onSubmit={handleUpload} className="space-y-4">
            <div>
              <Label>Type de document *</Label>
              <Select name="document_type" required>
                <SelectTrigger className="mt-1"><SelectValue placeholder="Sélectionnez" /></SelectTrigger>
                <SelectContent>
                  {documentTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Fichier *</Label>
              <Input name="file" type="file" accept=".jpg,.jpeg,.png,.pdf" required className="mt-1" />
              <p className="text-xs text-text-secondary mt-1">Formats acceptés: JPEG, PNG, PDF (max 10MB)</p>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>Annuler</Button>
              <Button type="submit" disabled={uploading} className="bg-primary">
                {uploading ? "Téléchargement..." : "Télécharger"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Composant section documents
function DocumentSection({ title, icon, textColor, documents, onDelete }: any) {
  const formatDate = (date: string) => new Date(date).toLocaleDateString("fr-FR");

  return (
    <Card className="rounded-2xl p-6 mb-6">
      <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <Icon icon={icon} className={`w-5 h-5 ${textColor}`} />
        {title}
      </h2>
      <div className="space-y-3">
        {documents.map((doc: any) => (
          <div key={doc.id} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
            <div>
              <p className="font-medium">{doc.document_type_display}</p>
              <p className="text-xs text-text-secondary">Soumis le {formatDate(doc.created_at)}</p>
            </div>
            <div className="flex gap-2">
              {doc.document_url && (
                <a href={doc.document_url} target="_blank" rel="noopener noreferrer" className="p-2 hover:bg-gray-200 rounded-lg">
                  <Icon icon="ph:eye" className="w-4 h-4" />
                </a>
              )}
              <button onClick={() => onDelete(doc.id)} className="p-2 hover:bg-red-100 rounded-lg">
                <Icon icon="ph:trash" className="w-4 h-4 text-red-500" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
