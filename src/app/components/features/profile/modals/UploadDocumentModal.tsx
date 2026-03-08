// components/features/profile/modals/UploadDocumentModal.tsx
"use client";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { CreateDocumentDto, DocumentType } from "@/app/types";
import { Icon } from "@iconify/react";
import {
  createDocumentSchema,
  type CreateDocumentFormData,
} from "@/app/lib/validators/document.validator";

interface UploadDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (documentData: CreateDocumentFormData) => Promise<void>;
  initialDocumentType?: DocumentType;
  isResubmit?: boolean;
}

const documentTypes = [
  { value: DocumentType.ID_CARD, label: "Carte d'identité" },
  { value: DocumentType.PASSPORT, label: "Passeport" },
  { value: DocumentType.DRIVER_LICENSE, label: "Permis de conduire" },
  { value: DocumentType.DIPLOMA, label: "Diplôme" },
  { value: DocumentType.CERTIFICATE, label: "Certificat" },
  { value: DocumentType.PROFESSIONAL_CARD, label: "Carte professionnelle" },
  { value: DocumentType.RESIDENCE_PERMIT, label: "Titre de séjour" },
  { value: DocumentType.OTHER, label: "Autre document" },
];

export function UploadDocumentModal({
  isOpen,
  onClose,
  onUpload,
  initialDocumentType,
  isResubmit = false,
}: UploadDocumentModalProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting, isValid },
    reset,
    setError,
    clearErrors,
  } = useForm<CreateDocumentFormData>({
    resolver: zodResolver(createDocumentSchema),
    mode: "onChange",
    defaultValues: {
      document_type: initialDocumentType || DocumentType.ID_CARD,
      document_number: "123456789",
      issue_date: "2020-01-01",
      expiry_date: "2030-01-01",
      issuing_country: "Cameroun",
    },
  });

  const selectedFile = watch("file");
  const documentType = watch("document_type");

  useEffect(() => {
    if (isOpen) {
      reset({
        document_type: initialDocumentType || DocumentType.ID_CARD,
        document_number: "123456789",
        issue_date: "2020-01-01",
        expiry_date: "2030-01-01",
        issuing_country: "Cameroun",
        file: undefined,
      });
    }
  }, [isOpen, initialDocumentType, reset]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      clearErrors("file");
      setValue("file", file, { shouldValidate: true });
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const onSubmit = async (data: CreateDocumentFormData) => {
    try {
      await onUpload(data);
      reset();
      onClose();
    } catch (error) {
      console.error("Error uploading document:", error);
      setError("root", {
        type: "manual",
        message:
          error instanceof Error
            ? error.message
            : "Erreur lors du téléchargement",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-900">
            {isResubmit ? "Resoumettre un document" : "Ajouter un document"}
          </DialogTitle>
          <p className="text-sm text-gray-500 mt-1">
            {isResubmit
              ? "Veuillez fournir une nouvelle version du document rejeté"
              : "Téléchargez un document pour vérifier votre identité"}
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Type de document */}
          <div className="space-y-2">
            <Label htmlFor="documentType" className="text-gray-700 font-medium">
              Type de document *
            </Label>
            <Select
              value={documentType}
              onValueChange={(value) =>
                setValue("document_type", value as DocumentType, {
                  shouldValidate: true,
                })
              }
            >
              <SelectTrigger
                className={errors.document_type ? "border-red-500" : ""}
              >
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
            {errors.document_type && (
              <p className="text-sm text-red-500">
                {errors.document_type.message}
              </p>
            )}
          </div>

          {/* Upload fichier */}
          <div className="space-y-2">
            <Label htmlFor="file" className="text-gray-700 font-medium">
              Fichier *
            </Label>
            <div
              className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                errors.file
                  ? "border-red-300 bg-red-50"
                  : selectedFile
                    ? "border-green-300 bg-green-50"
                    : "border-gray-300 hover:border-blue-500"
              }`}
            >
              <input
                type="file"
                id="file"
                accept=".jpg,.jpeg,.png,.pdf"
                onChange={handleFileChange}
                className="hidden"
              />
              <label htmlFor="file" className="cursor-pointer block">
                {selectedFile ? (
                  <div className="space-y-2">
                    <Icon
                      icon="bi:file-check"
                      className="h-8 w-8 text-green-500 mx-auto"
                    />
                    <p className="text-sm font-medium text-gray-700">
                      {selectedFile.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                    <p className="text-xs text-green-600 mt-1">
                      ✓ Fichier valide
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
            {errors.file && (
              <p className="text-sm text-red-500">{errors.file.message}</p>
            )}
          </div>

          {/* Informations supplémentaires */}
          <div className="space-y-2">
            <Label
              htmlFor="documentNumber"
              className="text-gray-700 font-medium"
            >
              Numéro de document
            </Label>
            <Input
              id="documentNumber"
              {...register("document_number")}
              placeholder="Ex: 123456789"
              className={errors.document_number ? "border-red-500" : ""}
            />
            {errors.document_number && (
              <p className="text-sm text-red-500">
                {errors.document_number.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="issueDate" className="text-gray-700 font-medium">
                Date d'émission
              </Label>
              <Input
                id="issueDate"
                type="date"
                {...register("issue_date")}
                className={errors.issue_date ? "border-red-500" : ""}
              />
              {errors.issue_date && (
                <p className="text-sm text-red-500">
                  {errors.issue_date.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="expiryDate" className="text-gray-700 font-medium">
                Date d'expiration
              </Label>
              <Input
                id="expiryDate"
                type="date"
                {...register("expiry_date")}
                className={errors.expiry_date ? "border-red-500" : ""}
              />
              {errors.expiry_date && (
                <p className="text-sm text-red-500">
                  {errors.expiry_date.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="issuingCountry"
              className="text-gray-700 font-medium"
            >
              Pays d'émission
            </Label>
            <Input
              id="issuingCountry"
              {...register("issuing_country")}
              placeholder="Ex: Cameroun"
              className={errors.issuing_country ? "border-red-500" : ""}
            />
            {errors.issuing_country && (
              <p className="text-sm text-red-500">
                {errors.issuing_country.message}
              </p>
            )}
          </div>

          {/* Erreur générale */}
          {errors.root && (
            <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-200">
              {errors.root.message}
            </div>
          )}

          <DialogFooter className="pt-4 border-t border-gray-200">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="rounded-full px-6"
            >
              Annuler
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !isValid}
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-6"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <Icon icon="mdi:loading" className="animate-spin h-4 w-4" />
                  Téléchargement...
                </span>
              ) : isResubmit ? (
                "Resoumettre"
              ) : (
                "Télécharger"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
