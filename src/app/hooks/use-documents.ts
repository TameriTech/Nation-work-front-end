// hooks/useDocuments.ts

import { useState, useEffect, useCallback } from 'react';
import { Document, KYCStatus, DocumentType, DocumentDisplay, CreateDocumentDto } from '@/app/types/user';
import { useToast } from '@/app/components/ui/use-toast';
import { getDocumentUrl, getKYCStatus, getMyDocuments, uploadDocument } from '../services/users.service';
import { log } from 'console';

export const useDocuments = () => {
  const [documents, setDocuments] = useState<DocumentDisplay[]>([]);
  const [kycStatus, setKycStatus] = useState<KYCStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const loadDocuments = useCallback(async () => {
    try {
      setLoading(true);
      const [docs, status] = await Promise.all([
        getMyDocuments(),
        getKYCStatus()
      ]);
      setDocuments(docs as DocumentDisplay[]);
      setKycStatus(status);
      console.log("Documents loaded:", docs, "KYC Status:", status);
      setError(null);
    } catch (err) {
      setError('Failed to load documents');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDocuments();
  }, [loadDocuments]);

  const getDocumentUrl = useCallback((documentId: number): string => {
    // Retourne l'URL directement (pas une Promise)
    return `${process.env.NEXT_PUBLIC_API_URL}/documents/${documentId}/view`;
  }, []);

  // Transformer les documents pour l'affichage
  const getDocumentsByStatus = useCallback((): {
    validated: DocumentDisplay[];
    inProgress: DocumentDisplay[];
    rejected: DocumentDisplay[];
    pending: DocumentDisplay[];
  } => {
    if (!documents.length && !kycStatus) {
      return {
        validated: [],
        inProgress: [],
        rejected: [],
        pending: []
      };
    }

    if (kycStatus) {
      const formatDate = (date?: string) => {
        if (!date) return '';
        return new Date(date).toLocaleDateString('fr-FR');
      };

      // ✅ Extraire les tableaux de kycStatus
      const { 
        validated_documents = [], 
        submitted_documents = [], 
        rejected_documents = [],
        pending_documents = [] 
      } = kycStatus;

      // ✅ Maintenant vous pouvez utiliser .map() sur ces tableaux
      const validated: DocumentDisplay[] = validated_documents.map(doc => ({
        id: doc.id.toString(),
        name: getDocumentLabel(doc.document_type),
        submission_date: formatDate(doc.created_at),
        status: 'validated',
        document_type: doc.document_type,
        file_url: getDocumentUrl(doc.id)
      }));

      const inProgress: DocumentDisplay[] = submitted_documents
        .filter(doc => doc.status === 'submitted' || doc.status === 'under_review')
        .map(doc => ({
          id: doc.id.toString(),
          name: getDocumentLabel(doc.document_type),
          submission_date: formatDate(doc.created_at),
          status: 'in_progress',
          document_type: doc.document_type,
          file_url: getDocumentUrl(doc.id)
        }));

      const rejected: DocumentDisplay[] = rejected_documents.map(doc => ({
        id: doc.id.toString(),
        name: getDocumentLabel(doc.document_type),
        submission_date: formatDate(doc.created_at),
        status: 'rejected',
        admin_comment: doc.rejection_reason || 'Document rejeté',
        comment_date: formatDate(doc.updated_at),
        document_type: doc.document_type
      }));

      const pending: DocumentDisplay[] = pending_documents.map(doc => ({
        id: doc.id.toString(),
        name: getDocumentLabel(doc.document_type),
        submission_date: formatDate(doc.created_at),
        status: 'pending',
        admin_comment: doc.rejection_reason || 'Document rejeté',
        comment_date: formatDate(doc.updated_at),
        document_type: doc.document_type
      }));

      return { validated, inProgress, rejected, pending };
    }

    // Si vous avez un tableau documents (de l'API directe)
    if (documents.length > 0) {
      const validated = documents.filter(d => d.status === 'validated');
      const inProgress = documents.filter(d => d.status === 'in_progress');
      const rejected = documents.filter(d => d.status === 'rejected');
      const pending = documents.filter(d => d.status === 'pending');
      
      return { validated, inProgress, rejected, pending };
    }

    return {
      validated: [],
      inProgress: [],
      rejected: [],
      pending: []
    };
  }, [documents, kycStatus]);


  const sendDocument = async (
    documentData: CreateDocumentDto
  ) => {
    try {
      setLoading(true);
      console.log("Uploading document with data: ", {
        document_type: documentData.document_type,
        file_name: documentData.file.name,
        file_size: documentData.file.size,
        mime_type: documentData.file.type,
        document_number: documentData.document_number,
        issue_date: documentData.issue_date,
        expiry_date: documentData.expiry_date,
        issuing_country: documentData.issuing_country
      });
      const newDoc: DocumentDisplay = await uploadDocument(documentData);
      await loadDocuments();
      toast({
        title: "Succès",
        description: "Document téléchargé avec succès",
      });
      return newDoc;
    } catch (err: any) {
      toast({
        title: "Erreur",
        description: err.message || "Échec du téléchargement",
        variant: "destructive",
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteDocument = async (documentId: number) => {
    try {
      setLoading(true);
      await deleteDocument(documentId);
      await loadDocuments();
      toast({
        title: "Succès",
        description: "Document supprimé avec succès",
      });
    } catch (err: any) {
      toast({
        title: "Erreur",
        description: err.message || "Échec de la suppression",
        variant: "destructive",
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const resubmitDocument = async (documentId: number, file: File): Promise<DocumentDisplay> => {
    try {
      setLoading(true);
      const updated = await resubmitDocument(documentId, file);
      await loadDocuments();
      toast({
        title: "Succès",
        description: "Document re-soumis avec succès",
      });
      return updated;
    } catch (err: any) {
      toast({
        title: "Erreur",
        description: err.message || "Échec de la re-soumission",
        variant: "destructive",
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    documents,
    kycStatus,
    loading,
    error,
    loadDocuments,
    getDocumentsByStatus,
    sendDocument,
    deleteDocument,
    resubmitDocument
  };
};

// Helper pour obtenir le libellé du type de document
function getDocumentLabel(type: DocumentType): string {
  const labels: Record<DocumentType, string> = {
    [DocumentType.ID_CARD]: "Carte d'identité",
    [DocumentType.PASSPORT]: "Passeport",
    [DocumentType.DRIVER_LICENSE]: "Permis de conduire",
    [DocumentType.DIPLOMA]: "Diplôme",
    [DocumentType.CERTIFICATE]: "Certificat",
    [DocumentType.PROFESSIONAL_CARD]: "Carte professionnelle",
    [DocumentType.BANK_RIB]: "RIB Bancaire",
    [DocumentType.TAX_CERTIFICATE]: "Attestation fiscale",
    [DocumentType.CRIMINAL_RECORD]: "Casier judiciaire",
    [DocumentType.PROFILE_PICTURE]: "Photo d'identité",
    [DocumentType.OTHER]: "Autre document"
  };
  return labels[type] || type;
}
