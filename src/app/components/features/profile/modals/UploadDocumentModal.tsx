// components/features/profile/modals/UploadDocumentModal.tsx

"use client";
import { useState } from "react";
import { Button } from "@/app/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/app/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { DocumentType } from "@/app/types/user";
import { Icon } from "@iconify/react";
import { fi } from "zod/v4/locales";

interface UploadDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (documentData: any) => Promise<void>;
}

const documentTypes = [
  { value: DocumentType.ID_CARD, label: "Carte d'identité" },
  { value: DocumentType.PASSPORT, label: "Passeport" },
  { value: DocumentType.DRIVER_LICENSE, label: "Permis de conduire" },
  { value: DocumentType.DIPLOMA, label: "Diplôme" },
  { value: DocumentType.CERTIFICATE, label: "Certificat" },
  { value: DocumentType.PROFESSIONAL_CARD, label: "Carte professionnelle" },
  { value: DocumentType.BANK_RIB, label: "RIB Bancaire" },
  { value: DocumentType.TAX_CERTIFICATE, label: "Attestation fiscale" },
  { value: DocumentType.CRIMINAL_RECORD, label: "Casier judiciaire" },
  { value: DocumentType.PROFILE_PICTURE, label: "Photo d'identité" },
  { value: DocumentType.OTHER, label: "Autre document" },
];

export function UploadDocumentModal({
  isOpen,
  onClose,
  onUpload,
}: UploadDocumentModalProps) {
  const [selectedType, setSelectedType] = useState<DocumentType | "id_card">(
    "id_card",
  );
  const [file, setFile] = useState<File | null>(null);
  const [document_number, setDocumentNumber] = useState("123456789");
  const [issue_date, setIssueDate] = useState("2020-01-01");
  const [expiry_date, setExpiryDate] = useState("2030-01-01");
  const [issuing_country, setIssuingCountry] = useState("Cameroun");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      // Vérifier la taille (max 10MB)
      if (selected.size > 10 * 1024 * 1024) {
        setError("Le fichier ne doit pas dépasser 10MB");
        return;
      }

      // Vérifier le type
      const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/jpg",
        "application/pdf",
      ];
      if (!allowedTypes.includes(selected.type)) {
        setError("Format accepté : JPEG, PNG, PDF");
        return;
      }

      setFile(selected);
      setError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedType) {
      setError("Veuillez sélectionner un type de document");
      return;
    }

    if (!file) {
      setError("Veuillez sélectionner un fichier");
      return;
    }

    setLoading(true);
    try {
      const documentData = {
        document_type: selectedType,
        file: file,
        document_number: document_number || undefined,
        issue_date: issue_date || undefined,
        expiry_date: expiry_date || undefined,
        issuing_country: issuing_country || undefined,
      };

      await onUpload(documentData);
      resetForm();
      onClose();
    } catch (error) {
      console.error("Error uploading document:", error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setSelectedType("id_card");
    setFile(null);
    setDocumentNumber("");
    setIssueDate("");
    setExpiryDate("");
    setIssuingCountry("");
    setError(null);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Ajouter un document</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Type de document */}
          <div className="space-y-2">
            <Label htmlFor="documentType">Type de document *</Label>
            <Select
              value={selectedType}
              onValueChange={(value) => setSelectedType(value as DocumentType)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionnez le type" />
              </SelectTrigger>
              <SelectContent>
                {documentTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Upload fichier */}
          <div className="space-y-2">
            <Label htmlFor="file">Fichier *</Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors">
              <input
                type="file"
                id="file"
                accept=".jpg,.jpeg,.png,.pdf"
                onChange={handleFileChange}
                className="hidden"
              />
              <label htmlFor="file" className="cursor-pointer">
                {file ? (
                  <div className="space-y-2">
                    <Icon
                      icon="bi:file-check"
                      className="h-8 w-8 text-green-500 mx-auto"
                    />
                    <p className="text-sm text-gray-600">{file.name}</p>
                    <p className="text-xs text-gray-400">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Icon
                      icon="bi:cloud-upload"
                      className="h-8 w-8 text-gray-400 mx-auto"
                    />
                    <p className="text-sm text-gray-600">
                      Cliquez pour sélectionner ou glissez-déposez
                    </p>
                    <p className="text-xs text-gray-400">
                      JPEG, PNG, PDF (max 10MB)
                    </p>
                  </div>
                )}
              </label>
            </div>
          </div>

          {/* Informations supplémentaires */}
          <div className="space-y-2">
            <Label htmlFor="documentNumber">Numéro de document</Label>
            <Input
              id="documentNumber"
              value={document_number}
              onChange={(e) => setDocumentNumber(e.target.value)}
              placeholder="Ex: 123456789"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="issueDate">Date d'émission</Label>
              <Input
                id="issueDate"
                type="date"
                value={issue_date}
                onChange={(e) => setIssueDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="expiryDate">Date d'expiration</Label>
              <Input
                id="expiryDate"
                type="date"
                value={expiry_date}
                onChange={(e) => setExpiryDate(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="issuingCountry">Pays d'émission</Label>
            <Input
              id="issuingCountry"
              value={issuing_country}
              onChange={(e) => setIssuingCountry(e.target.value)}
              placeholder="Ex: Cameroun"
            />
          </div>

          {error && (
            <div className="text-sm text-red-500 bg-red-50 p-2 rounded">
              {error}
            </div>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button type="submit" disabled={loading || !selectedType || !file}>
              {loading ? "Téléchargement..." : "Télécharger"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
