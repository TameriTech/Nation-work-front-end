// components/sections/customer/CandidatureTable.tsx
"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Badge } from "@/app/components/ui/badge";
import { Checkbox } from "@/app/components/ui/checkbox";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/app/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/components/ui/table";
import { Icon } from "@iconify/react";
import { useState } from "react";
import { Candidature, CandidatureStatus } from "@/app/types/candidatures";
import { formatDate } from "@/app/lib/utils";

interface CandidatureTableProps {
  candidatures: Candidature[];
  onStatusChange?: (params: {
    id: number;
    status: CandidatureStatus;
    options?: {
      rejection_reason?: string;
      message?: string;
    };
  }) => void;
}

const statusConfig = {
  draft: {
    label: "Brouillon",
    className: "bg-gray-100 text-gray-700 border-gray-200",
  },
  published: {
    label: "Publié",
    className: "bg-blue-100 text-blue-700 border-blue-200",
  },
  closed: {
    label: "Fermé",
    className: "bg-emerald-100 text-emerald-700 border-emerald-200",
  },
  canceled: {
    label: "Annulé",
    className: "bg-red-100 text-red-700 border-red-200",
  },
  pending: {
    label: "En attente",
    className: "bg-orange-100 text-orange-700 border-orange-200",
  },
  accepted: {
    label: "Accepté",
    className: "bg-green-100 text-green-700 border-green-200",
  },
  rejected: {
    label: "Rejeté",
    className: "bg-red-100 text-red-700 border-red-200",
  },
} as const;

export const CandidatureTable = ({
  candidatures = [],
  onStatusChange,
}: CandidatureTableProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [rejectionReason, setRejectionReason] = useState<{
    [key: number]: string;
  }>({});
  const [showRejectModal, setShowRejectModal] = useState<number | null>(null);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(candidatures.map((c) => c.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id: number, checked: boolean) => {
    if (checked) {
      setSelectedIds((prev) => [...prev, id]);
    } else {
      setSelectedIds((prev) => prev.filter((item) => item !== id));
    }
  };

  const handleBulkReject = () => {
    if (selectedIds.length > 0) {
      setShowRejectModal(-1); // -1 pour le rejet groupé
    }
  };

  const handleAccept = (id: number) => {
    onStatusChange?.({
      id,
      status: "accepted",
      options: { message: "Votre candidature a été acceptée" },
    });
  };

  const handleReject = (id: number, reason?: string) => {
    onStatusChange?.({
      id,
      status: "rejected",
      options: {
        rejection_reason: reason || "Candidature non retenue",
        message: "Nous vous remercions pour votre candidature",
      },
    });
    setShowRejectModal(null);
  };

  const filteredCandidatures = candidatures.filter(
    (c) =>
      c.service?.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.provider?.name?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <>
      <Card className="bg-white text-gray-800 rounded-[30px] border-0 shadow-none">
        <CardHeader className="flex-col gap-4 lg:flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-sm font-semibold uppercase tracking-wide text-gray-400">
            Liste des candidatures
          </CardTitle>

          <div className="flex flex-row md:flex-row md:items-center gap-4 md:gap-2 w-full md:w-auto">
            {/* Search bar */}
            <div className="relative flex-1 md:flex-initial">
              <input
                type="text"
                placeholder="Rechercher..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-gray-50 text-gray-900 placeholder:text-gray-400 border rounded-full text-sm py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
              <Icon
                icon="bi:search"
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
              />
            </div>

            {selectedIds.length > 0 && (
              <Button
                variant="outline"
                onClick={handleBulkReject}
                className="gap-2 text-red-600 bg-transparent rounded-full border-red-200 hover:bg-red-50 hover:border-red-300"
              >
                <Icon icon="bi:x" className="h-4 w-4" />
                Rejeter ({selectedIds.length})
              </Button>
            )}
          </div>
        </CardHeader>

        <CardContent>
          {filteredCandidatures.length === 0 ? (
            <div className="text-center py-12">
              <Icon
                icon="bi:inbox"
                className="w-12 h-12 text-gray-300 mx-auto mb-4"
              />
              <p className="text-gray-500">Aucune candidature trouvée</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-b border-gray-200 bg-gray-50">
                    <TableHead className="w-12 rounded-l-lg">
                      <Checkbox
                        checked={
                          selectedIds.length === filteredCandidatures.length
                        }
                        onCheckedChange={handleSelectAll}
                      />
                    </TableHead>
                    <TableHead>Offre</TableHead>
                    <TableHead>Statut offre</TableHead>
                    <TableHead>Prestataire</TableHead>
                    <TableHead>Date candidature</TableHead>
                    <TableHead>Note moyenne</TableHead>
                    <TableHead>Statut candidature</TableHead>
                    <TableHead>Montant</TableHead>
                    <TableHead className="rounded-r-lg w-32"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCandidatures.map((candidature) => {
                    const serviceStatus =
                      candidature.service?.status || "draft";
                    const status =
                      statusConfig[
                        serviceStatus as keyof typeof statusConfig
                      ] || statusConfig.draft;
                    const candidatureStatus =
                      statusConfig[
                        candidature.status as keyof typeof statusConfig
                      ] || statusConfig.pending;

                    return (
                      <TableRow
                        key={candidature.id}
                        className="border-b border-gray-100 hover:bg-gray-50"
                      >
                        <TableCell>
                          <Checkbox
                            checked={selectedIds.includes(candidature.id)}
                            onCheckedChange={(checked) =>
                              handleSelectOne(
                                candidature.id,
                                checked as boolean,
                              )
                            }
                          />
                        </TableCell>
                        <TableCell className="font-medium">
                          {candidature.service?.title || "N/A"}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={`${status.className} border-0`}
                          >
                            <span className="flex items-center gap-1.5">
                              <span
                                className={`w-1.5 h-1.5 rounded-full ${
                                  serviceStatus === "in_progress"
                                    ? "bg-amber-500"
                                    : serviceStatus === "published"
                                      ? "bg-blue-500"
                                      : serviceStatus === "canceled"
                                        ? "bg-red-500"
                                        : "bg-gray-400"
                                }`}
                              />
                              {status.label}
                            </span>
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                              <AvatarImage
                                src={
                                  candidature.provider.avatar ||
                                  "/images/avatar-placeholder.png"
                                }
                                alt={candidature.provider.name || "Avatar"}
                              />
                              <AvatarFallback className="bg-blue-100 text-blue-900">
                                {candidature.provider.name?.charAt(0) || "F"}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="text-sm font-medium">
                                {candidature.provider.name || "Anonyme"}
                              </p>
                              <p className="text-xs text-gray-400">
                                ID: {candidature.freelancer_id}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-gray-500 whitespace-nowrap">
                          {formatDate(candidature.application_date)}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-0.5">
                            {[...Array(5)].map((_, index) => (
                              <Icon
                                icon={
                                  index <
                                  Math.floor(
                                    candidature.provider.average_rating || 0,
                                  )
                                    ? "bi:star-fill"
                                    : "bi:star"
                                }
                                key={index}
                                className={`w-3.5 h-3.5 ${
                                  index <
                                  Math.floor(
                                    candidature.provider.average_rating || 0,
                                  )
                                    ? "text-yellow-400"
                                    : "text-gray-300"
                                }`}
                              />
                            ))}
                            <span className="text-xs text-gray-500 ml-1">
                              {candidature.provider.average_rating?.toFixed(
                                1,
                              ) || "-"}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={`${candidatureStatus.className} border-0 whitespace-nowrap`}
                          >
                            <span className="flex items-center gap-1.5">
                              <span
                                className={`w-1.5 h-1.5 rounded-full ${
                                  candidature.status === "pending"
                                    ? "bg-amber-500"
                                    : candidature.status === "accepted"
                                      ? "bg-green-500"
                                      : candidature.status === "rejected"
                                        ? "bg-red-500"
                                        : "bg-gray-400"
                                }`}
                              />
                              {candidatureStatus.label}
                            </span>
                          </Badge>
                        </TableCell>
                        <TableCell className="font-medium">
                          {candidature.service.proposed_amount?.toLocaleString() ||
                            "-"}{" "}
                          FCFA
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 hover:bg-gray-100"
                              title="Voir détails"
                            >
                              <Icon
                                icon="bi:eye"
                                className="h-4 w-4 text-gray-500"
                              />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 hover:bg-gray-100"
                              title="Contacter"
                            >
                              <Icon
                                icon="bi:chat"
                                className="h-4 w-4 text-gray-500"
                              />
                            </Button>
                            {candidature.status === "pending" && (
                              <>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 hover:bg-green-100"
                                  title="Accepter"
                                  onClick={() => handleAccept(candidature.id)}
                                >
                                  <Icon
                                    icon="bi:check-lg"
                                    className="h-4 w-4 text-green-600"
                                  />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 hover:bg-red-100"
                                  title="Rejeter"
                                  onClick={() =>
                                    setShowRejectModal(candidature.id)
                                  }
                                >
                                  <Icon
                                    icon="bi:x-lg"
                                    className="h-4 w-4 text-red-600"
                                  />
                                </Button>
                              </>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal de rejet individuel */}
      {showRejectModal && showRejectModal > 0 && (
        <RejectModal
          isOpen={true}
          onClose={() => setShowRejectModal(null)}
          onConfirm={(reason) => handleReject(showRejectModal, reason)}
          title="Rejeter la candidature"
        />
      )}

      {/* Modal de rejet groupé */}
      {showRejectModal === -1 && (
        <RejectModal
          isOpen={true}
          onClose={() => setShowRejectModal(null)}
          onConfirm={(reason) => {
            selectedIds.forEach((id) => handleReject(id, reason));
            setSelectedIds([]);
          }}
          title={`Rejeter ${selectedIds.length} candidature${selectedIds.length > 1 ? "s" : ""}`}
          isBulk
        />
      )}
    </>
  );
};

// Composant Modal de rejet
function RejectModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  isBulk = false,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
  title: string;
  isBulk?: boolean;
}) {
  const [reason, setReason] = useState("");
  const [customReason, setCustomReason] = useState("");

  const predefinedReasons = [
    "Profil ne correspond pas aux attentes",
    "Expérience insuffisante",
    "Tarif trop élevé",
    "Délais non compatibles",
    "Autre raison",
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm(reason === "Autre raison" ? customReason : reason);
    setReason("");
    setCustomReason("");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 max-w-md w-full">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-500 text-sm mb-4">
          Veuillez indiquer la raison du rejet
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            {predefinedReasons.map((r) => (
              <label
                key={r}
                className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded-lg cursor-pointer"
              >
                <input
                  type="radio"
                  name="rejectionReason"
                  value={r}
                  checked={reason === r}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-4 h-4 text-blue-600"
                />
                <span className="text-sm text-gray-700">{r}</span>
              </label>
            ))}
          </div>

          {reason === "Autre raison" && (
            <textarea
              value={customReason}
              onChange={(e) => setCustomReason(e.target.value)}
              placeholder="Précisez la raison..."
              className="w-full p-2 border rounded-lg text-sm"
              rows={3}
              required
            />
          )}

          <div className="flex gap-2 justify-end pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button
              type="submit"
              disabled={!reason || (reason === "Autre raison" && !customReason)}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Confirmer le rejet
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
