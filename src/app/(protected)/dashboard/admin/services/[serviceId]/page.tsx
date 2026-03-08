// app/(protected)/dashboard/admin/services/[serviceId]/page.tsx
"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Briefcase,
  Calendar,
  Clock,
  MapPin,
  DollarSign,
  User,
  Star,
  FileText,
  MessageSquare,
  Scale,
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader2,
  Edit,
  Ban,
  Trash2,
  Send,
  Phone,
  Mail,
  Tag,
  Users,
  Image as ImageIcon,
  ChevronLeft,
  ChevronRight,
  Download,
  Printer,
  MoreHorizontal,
  Shield,
  Award,
  Clock as ClockIcon,
  ArrowRight,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";

import { useServices } from "@/app/hooks/services/use-services";
import type {
  Service,
  ServiceImage,
  ServiceStatus,
} from "@/app/types/services";
import ServiceDetailLoading from "./loading";
import ServiceDetailError from "./error";
import { getAdminServiceDetails } from "@/app/services/service.service";

// Schéma de validation pour l'annulation
const cancelSchema = z.object({
  reason: z.string().min(10, "La raison doit contenir au moins 10 caractères"),
  notify: z.boolean().default(true),
}) satisfies z.ZodType<{
  reason: string;
  notify: boolean;
}>;

type CancelFormData = z.infer<typeof cancelSchema>;

// Badge de statut
const StatusBadge = ({ status }: { status: ServiceStatus }) => {
  const badges: Record<
    ServiceStatus,
    { color: string; icon: any; label: string }
  > = {
    published: {
      color:
        "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800",
      icon: Clock,
      label: "Publié",
    },
    assigned: {
      color:
        "bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-800",
      icon: User,
      label: "Assigné",
    },
    in_progress: {
      color:
        "bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800",
      icon: Loader2,
      label: "En cours",
    },
    completed: {
      color:
        "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800",
      icon: CheckCircle,
      label: "Terminé",
    },
    cancelled: {
      color:
        "bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700",
      icon: XCircle,
      label: "Annulé",
    },
    disputed: {
      color:
        "bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800",
      icon: Scale,
      label: "Litige",
    },
  };
  const badge = badges[status];
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

// Section d'information
const InfoSection = ({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: any;
  children: React.ReactNode;
}) => (
  <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-slate-700">
    <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white flex items-center">
      <Icon className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" />
      {title}
    </h3>
    <div className="space-y-4">{children}</div>
  </div>
);

// Info row
const InfoRow = ({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string | React.ReactNode;
  icon?: any;
}) => (
  <div className="flex items-start">
    {Icon && (
      <Icon className="w-4 h-4 mr-3 text-gray-400 dark:text-gray-500 mt-0.5" />
    )}
    <div className="flex-1">
      <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
      <p className="text-base font-medium text-gray-900 dark:text-white">
        {value}
      </p>
    </div>
  </div>
);

// Timeline
const Timeline = ({ service }: { service: Service }) => {
  const events = [
    {
      status: "published",
      label: "Service publié",
      date: service.created_at,
      icon: Clock,
      completed: true,
    },
    {
      status: "assigned",
      label: "Freelancer assigné",
      date: service.assigned_at,
      icon: User,
      completed: service.status !== "published",
    },
    {
      status: "in_progress",
      label: "Service en cours",
      date: service.started_at,
      icon: Loader2,
      completed: ["in_progress", "completed", "disputed"].includes(
        service.status,
      ),
    },
    {
      status: "completed",
      label: "Service terminé",
      date: service.completed_at,
      icon: CheckCircle,
      completed: service.status === "completed",
    },
  ];

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-slate-700">
      <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white flex items-center">
        <ClockIcon className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" />
        Chronologie
      </h3>
      <div className="space-y-4">
        {events.map((event, index) => {
          const Icon = event.icon;
          return (
            <div key={index} className="flex items-start">
              <div className="relative">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    event.completed
                      ? "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400"
                      : "bg-gray-100 text-gray-400 dark:bg-slate-700 dark:text-gray-500"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                {index < events.length - 1 && (
                  <div
                    className={`absolute top-8 left-4 w-0.5 h-12 ${
                      events[index + 1].completed
                        ? "bg-green-200 dark:bg-green-800"
                        : "bg-gray-200 dark:bg-slate-700"
                    }`}
                  />
                )}
              </div>
              <div className="ml-4 flex-1">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {event.label}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {event.date
                    ? new Date(event.date).toLocaleString("fr-FR")
                    : "En attente"}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Galerie d'images
const ImageGallery = ({ images }: { images?: ServiceImage[] }) => {
  const [selectedImage, setSelectedImage] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-slate-700">
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white flex items-center">
          <ImageIcon className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" />
          Photos
        </h3>
        <div className="flex items-center justify-center h-48 bg-gray-100 dark:bg-slate-700 rounded-lg">
          <p className="text-gray-500 dark:text-gray-400">Aucune photo</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-slate-700">
      <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white flex items-center">
        <ImageIcon className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" />
        Photos ({images.length})
      </h3>
      <div className="space-y-4">
        <div className="relative h-64 bg-gray-100 dark:bg-slate-700 rounded-lg overflow-hidden">
          <img
            src={images[selectedImage].image_url}
            alt={`Service ${selectedImage + 1}`}
            className="w-full h-full object-contain"
          />
        </div>
        {images.length > 1 && (
          <div className="flex space-x-2 overflow-x-auto pb-2">
            {images.map((img, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 ${
                  selectedImage === index
                    ? "border-blue-500 dark:border-blue-400"
                    : "border-transparent hover:border-gray-300 dark:hover:border-gray-600"
                }`}
              >
                <img
                  src={img.image_url}
                  alt={`Miniature ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Modal d'annulation avec React Hook Form
const CancelModal = ({
  isOpen,
  onClose,
  service,
  onConfirm,
  isCancelling,
}: {
  isOpen: boolean;
  onClose: () => void;
  service: Service | null;
  onConfirm: (data: CancelFormData) => Promise<void>;
  isCancelling: boolean;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CancelFormData>({
    resolver: zodResolver(cancelSchema),
    defaultValues: {
      reason: "",
      notify: true,
    },
  });

  if (!isOpen || !service) return null;

  const onSubmit = async (data: CancelFormData) => {
    await onConfirm(data);
    reset();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl max-w-md w-full p-6 border border-gray-200 dark:border-slate-700">
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
          Annuler le service
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Vous êtes sur le point d'annuler le service{" "}
          <span className="font-medium text-gray-900 dark:text-gray-100">
            {service.title}
          </span>
        </p>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Raison de l'annulation *
            </label>
            <textarea
              {...register("reason")}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100"
              placeholder="Expliquez la raison de l'annulation..."
              disabled={isCancelling}
            />
            {errors.reason && (
              <p className="text-red-600 dark:text-red-400 text-sm mt-1">
                {errors.reason.message}
              </p>
            )}
          </div>

          <div className="mb-6">
            <label className="flex items-center">
              <input
                type="checkbox"
                {...register("notify")}
                className="rounded border-gray-300 dark:border-gray-600 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 dark:bg-slate-700"
                disabled={isCancelling}
              />
              <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                Notifier les utilisateurs concernés
              </span>
            </label>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => {
                reset();
                onClose();
              }}
              disabled={isCancelling}
              className="px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-300 transition disabled:opacity-50"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isCancelling}
              className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition disabled:opacity-50 flex items-center"
            >
              {isCancelling ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Annulation...
                </>
              ) : (
                "Confirmer l'annulation"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Page principale
export default function ServiceDetailPage() {
  const router = useRouter();
  const params = useParams();
  const serviceId = Number(params.serviceId);

  const [cancelModal, setCancelModal] = useState<{
    isOpen: boolean;
    service: Service | null;
  }>({
    isOpen: false,
    service: null,
  });

  // Hook personnalisé
  const {
    getAdminServiceDetails,
    changeStatus,
    isChangingStatus,
    deleteService,
    isDeleting,
  } = useServices();
  const {
    data: service,
    isLoading,
    error,
    refetch,
  } = getAdminServiceDetails(serviceId);

  console.log("Service: ", service);

  const handleUpdateStatus = async (newStatus: ServiceStatus) => {
    if (!service) return;
    if (service.status === newStatus) return;

    if (newStatus === "cancelled") {
      setCancelModal({ isOpen: true, service });
      return;
    }

    if (confirm(`Changer le statut en ${newStatus} ?`)) {
      try {
        await changeStatus({ id: service.id, status: newStatus });
        toast.success(`Statut changé en ${newStatus}`);
        refetch();
      } catch (error) {
        toast.error("Erreur lors du changement de statut");
      }
    }
  };

  const handleCancel = async (data: CancelFormData) => {
    if (!cancelModal.service) return;
    try {
      await changeStatus({
        id: cancelModal.service.id,
        status: "cancelled",
        reason: data.reason,
        notify: data.notify,
      });
      toast.success("Service annulé avec succès");
      refetch();
    } catch (error) {
      toast.error("Erreur lors de l'annulation");
    }
  };

  const handleDelete = async () => {
    if (!service) return;
    if (
      confirm(
        "Êtes-vous sûr de vouloir supprimer ce service ? Cette action est irréversible.",
      )
    ) {
      try {
        await deleteService(service.id);
        toast.success("Service supprimé avec succès");
        router.push("/dashboard/admin/services");
      } catch (error) {
        toast.error("Erreur lors de la suppression");
      }
    }
  };

  const handleOpenChat = () => {
    if (!service) return;
    router.push(`/dashboard/admin/messages?service=${service.id}`);
  };

  const handleEdit = () => {
    if (!service) return;
    router.push(`/dashboard/admin/services/${service.id}/edit`);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
    }).format(amount);
  };

  if (isLoading) {
    return <ServiceDetailLoading />;
  }

  if (error || !service) {
    return (
      <ServiceDetailError
        error={error as Error}
        serviceId={serviceId}
        onRetry={refetch}
      />
    );
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
              onClick={handleOpenChat}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center transition disabled:opacity-50"
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              Voir la conversation
            </button>
            <button
              onClick={handleEdit}
              className="px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 flex items-center transition"
            >
              <Edit className="w-4 h-4 mr-2" />
              Modifier
            </button>
            {service.status !== "cancelled" &&
              service.status !== "completed" && (
                <button
                  onClick={() => handleUpdateStatus("cancelled")}
                  disabled={isChangingStatus}
                  className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 flex items-center transition disabled:opacity-50"
                >
                  {isChangingStatus ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Ban className="w-4 h-4 mr-2" />
                  )}
                  Annuler
                </button>
              )}
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center transition disabled:opacity-50"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Suppression...
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Supprimer
                </>
              )}
            </button>
          </div>
        </div>

        {/* En-tête */}
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6 mb-6 border border-gray-200 dark:border-slate-700">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {service.title}
                </h1>
                <StatusBadge status={service.status} />
                {service.priority === "high" && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border border-red-200 dark:border-red-800">
                    <AlertCircle className="w-4 h-4 mr-2" />
                    Prioritaire
                  </span>
                )}
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {service.short_description}
              </p>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <Calendar className="w-4 h-4 mr-2" />
                  Créé le{" "}
                  {new Date(service.created_at).toLocaleDateString("fr-FR")}
                </div>
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <Tag className="w-4 h-4 mr-2" />
                  {service?.category?.name || "Catégorie inconnue"}
                </div>
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <DollarSign className="w-4 h-4 mr-2" />
                  {formatCurrency(service.proposed_amount)}
                </div>
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <Users className="w-4 h-4 mr-2" />
                  {service.candidatures_count} candidature(s)
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Grille principale */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Colonne de gauche - 2/3 */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description détaillée */}
            <InfoSection title="Description détaillée" icon={FileText}>
              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                {service.full_description || service.short_description}
              </p>
            </InfoSection>

            {/* Compétences requises */}
            {service.required_skills && service.required_skills.length > 0 && (
              <InfoSection title="Compétences requises" icon={Award}>
                <div className="flex flex-wrap gap-2">
                  {service.required_skills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm dark:bg-blue-900/30 dark:text-blue-400 border border-blue-200 dark:border-blue-800"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </InfoSection>
            )}

            {/* Évaluation */}
            {service?.rating && (
              <InfoSection title="Évaluation" icon={Star}>
                <div className="flex items-center mb-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${
                          i < service?.rating
                            ? "text-yellow-400 fill-current"
                            : "text-gray-300 dark:text-gray-600"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                    {service.rating}/5
                  </span>
                </div>
                <p className="text-gray-700 dark:text-gray-300 italic">
                  "{service.rating || "Aucun commentaire fourni."}"
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  {new Date(service.created_at).toLocaleDateString("fr-FR")}
                </p>
              </InfoSection>
            )}

            {/* Litige */}
            {service.dispute && (
              <InfoSection title="Litige en cours" icon={Scale}>
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                  <div className="flex items-start">
                    <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 mr-3 mt-0.5" />
                    <div>
                      <p className="font-medium text-red-800 dark:text-red-200">
                        Litige ouvert par {service.dispute.opened_by}
                      </p>
                      <p className="text-sm text-red-600 dark:text-red-300 mt-1">
                        {service.dispute.reason}
                      </p>
                      <p className="text-xs text-red-500 dark:text-red-400 mt-2">
                        Ouvert le{" "}
                        {new Date(service.dispute.opened_at).toLocaleDateString(
                          "fr-FR",
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </InfoSection>
            )}

            {/* Galerie d'images */}
            <ImageGallery images={service.service_images} />
          </div>

          {/* Colonne de droite - 1/3 */}
          <div className="space-y-6">
            {/* Client */}
            <InfoSection title="Client" icon={User}>
              <div className="flex items-center mb-4">
                <div className="flex-shrink-0 h-12 w-12">
                  {service.client.avatar ? (
                    <img
                      className="h-12 w-12 rounded-full object-cover"
                      src={service.client.avatar}
                      alt={service.client.name}
                    />
                  ) : (
                    <div className="h-12 w-12 rounded-full bg-gray-200 dark:bg-slate-700 flex items-center justify-center">
                      <User className="w-6 h-6 text-gray-500 dark:text-gray-400" />
                    </div>
                  )}
                </div>
                <div className="ml-4">
                  <p className="text-lg font-medium text-gray-900 dark:text-white">
                    {service.client.name}
                  </p>
                  <Link
                    href={`/dashboard/admin/users/${service.client.id}`}
                    className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    Voir le profil
                  </Link>
                </div>
              </div>
              {service.client.email && (
                <InfoRow
                  label="Email"
                  value={service.client.email}
                  icon={Mail}
                />
              )}
              {service.client.phone && (
                <InfoRow
                  label="Téléphone"
                  value={service.client.phone}
                  icon={Phone}
                />
              )}
            </InfoSection>

            {/* Freelancer */}
            <InfoSection title="Freelancer" icon={User}>
              {service.freelancer ? (
                <>
                  <div className="flex items-center mb-4">
                    <div className="flex-shrink-0 h-12 w-12">
                      {service.freelancer.avatar ? (
                        <img
                          className="h-12 w-12 rounded-full object-cover"
                          src={service.freelancer.avatar}
                          alt={service.freelancer.name}
                        />
                      ) : (
                        <div className="h-12 w-12 rounded-full bg-gray-200 dark:bg-slate-700 flex items-center justify-center">
                          <User className="w-6 h-6 text-gray-500 dark:text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div className="ml-4">
                      <p className="text-lg font-medium text-gray-900 dark:text-white">
                        {service.freelancer.name}
                      </p>
                      {service.freelancer.average_rating && (
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                          <Star className="w-4 h-4 mr-1 text-yellow-400 fill-current" />
                          {service.freelancer.average_rating}/5
                        </div>
                      )}
                      <Link
                        href={`/dashboard/admin/users/${service.freelancer.id}`}
                        className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                      >
                        Voir le profil
                      </Link>
                    </div>
                  </div>
                  {service.freelancer.email && (
                    <InfoRow
                      label="Email"
                      value={service.freelancer.email}
                      icon={Mail}
                    />
                  )}
                </>
              ) : (
                <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                  Aucun freelancer assigné
                </p>
              )}
            </InfoSection>

            <InfoSection title="Candidatures" icon={Users}>
              {service.candidatures && service.candidatures.length > 0 ? (
                <div className="space-y-4">
                  {service.candidatures.map((candidature, index) => (
                    <div
                      key={index}
                      className="border border-gray-200 dark:border-slate-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          {/* Avatar du candidat */}
                          <div className="flex-shrink-0 h-10 w-10">
                            {candidature.freelancer?.avatar ? (
                              <img
                                className="h-10 w-10 rounded-full object-cover"
                                src={candidature.freelancer.avatar}
                                alt={candidature.freelancer.name}
                              />
                            ) : (
                              <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-slate-700 flex items-center justify-center">
                                <User className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                              </div>
                            )}
                          </div>

                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">
                              {candidature.freelancer?.name || "Candidat"}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              {candidature.freelancer?.average_rating && (
                                <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                                  <Star className="w-3 h-3 mr-1 text-yellow-400 fill-current" />
                                  {candidature.freelancer.average_rating}/5
                                </div>
                              )}
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                • Postulé le{" "}
                                {new Date(
                                  candidature.application_date,
                                ).toLocaleDateString("fr-FR")}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Statut de la candidature */}
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            candidature.status === "accepted"
                              ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                              : candidature.status === "rejected"
                                ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                                : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                          }`}
                        >
                          {candidature.status === "accepted"
                            ? "Acceptée"
                            : candidature.status === "rejected"
                              ? "Refusée"
                              : "En attente"}
                        </span>
                      </div>

                      {/* Prix proposé */}
                      {candidature.proposed_amount && (
                        <div className="mt-3 flex items-center text-sm">
                          <DollarSign className="w-4 h-4 mr-1 text-gray-400" />
                          <span className="font-medium text-gray-900 dark:text-white">
                            {candidature.proposed_amount.toLocaleString()} FCFA
                          </span>
                          <span className="text-xs text-gray-500 ml-2">
                            (vs {service.proposed_amount.toLocaleString()} FCFA
                            proposé)
                          </span>
                        </div>
                      )}

                      {/* Lettre de motivation (tronquée) */}
                      {candidature.cover_letter && (
                        <div className="mt-2">
                          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                            {candidature.cover_letter}
                          </p>
                        </div>
                      )}

                      {/* Bouton d'action */}
                      <div className="mt-3 flex justify-end">
                        <Link
                          href={`/dashboard/admin/users/${candidature.freelancer_id}`}
                          className="text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 flex items-center"
                        >
                          Voir le profil
                          <ArrowRight className="w-3 h-3 ml-1" />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                  Aucune candidature pour ce service
                </p>
              )}
            </InfoSection>

            {/* Détails pratiques */}
            <InfoSection title="Détails pratiques" icon={MapPin}>
              <InfoRow
                label="Date et heure"
                value={`${new Date(service.date_pratique).toLocaleDateString("fr-FR")} ${
                  service.start_time ? `à ${service.start_time}` : ""
                }`}
                icon={Calendar}
              />
              {service.duration && (
                <InfoRow label="Durée" value={service.duration} icon={Clock} />
              )}
              <InfoRow label="Adresse" value={service.address} icon={MapPin} />
              {service.city && (
                <InfoRow label="Ville" value={service.city} icon={MapPin} />
              )}
            </InfoSection>

            {/* Paiement */}
            <InfoSection title="Paiement" icon={DollarSign}>
              <InfoRow
                label="Budget proposé"
                value={formatCurrency(service.proposed_amount)}
              />
              {service.accepted_amount && (
                <InfoRow
                  label="Montant accepté"
                  value={formatCurrency(service.accepted_amount)}
                />
              )}
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-slate-700">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                  Frais plateforme (10%):{" "}
                  {formatCurrency(service.proposed_amount * 0.1)}
                </p>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  Net freelancer:{" "}
                  {formatCurrency(service.proposed_amount * 0.9)}
                </p>
              </div>
            </InfoSection>

            {/* Timeline */}
            <Timeline service={service} />
          </div>
        </div>
      </div>

      {/* Modal d'annulation */}
      <CancelModal
        isOpen={cancelModal.isOpen}
        onClose={() => setCancelModal({ isOpen: false, service: null })}
        service={cancelModal.service}
        onConfirm={handleCancel}
        isCancelling={isChangingStatus}
      />
    </div>
  );
}
