"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  MessageSquare,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Eye,
  RefreshCw,
  Loader2,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  User,
  Briefcase,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Send,
  Paperclip,
  Image as ImageIcon,
  FileText,
  MoreHorizontal,
  Check,
  Ban,
  Trash2,
  Archive,
  Star,
  Phone,
  Mail,
  MapPin,
  Shield,
  Users,
  MessageCircle,
} from "lucide-react";

import {
  getConversations,
  getConversationStats,
  archiveConversation,
  deleteConversation,
} from "@/app/services/chat.service";
import type {
  Conversation,
  ConversationFilters,
  PaginatedResponse,
  ConversationStats,
} from "@/app/types/admin";
import { messages as mockMessages } from "@/data/admin-mock-data";

// Composant de carte de statistiques
const StatsCard = ({
  title,
  value,
  subValue,
  icon: Icon,
  color,
}: {
  title: string;
  value: number | string;
  subValue?: string;
  icon: any;
  color: string;
}) => (
  <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-slate-700">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{title}</p>
        <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">
          {value}
        </p>
        {subValue && (
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {subValue}
          </p>
        )}
      </div>
      <div
        className={`w-12 h-12 ${color} rounded-lg flex items-center justify-center text-white shadow-lg`}
      >
        <Icon className="w-6 h-6" />
      </div>
    </div>
  </div>
);

// Composant de filtre
const ConversationFilters = ({
  filters,
  onFilterChange,
  onSearch,
}: {
  filters: ConversationFilters;
  onFilterChange: (filters: ConversationFilters) => void;
  onSearch: () => void;
}) => {
  const [localSearch, setLocalSearch] = useState(filters.search || "");

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      onFilterChange({ ...filters, search: localSearch });
      onSearch();
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-4 mb-6 border border-gray-200 dark:border-slate-700">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Recherche */}
        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Recherche
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-4 h-4" />
            <input
              type="text"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Client, freelancer, service..."
              className="pl-10 w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100"
            />
          </div>
        </div>

        {/* Filtre par statut */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Statut
          </label>
          <select
            value={
              filters.is_active !== undefined ? String(filters.is_active) : ""
            }
            onChange={(e) => {
              const value = e.target.value;
              onFilterChange({
                ...filters,
                is_active: value === "" ? undefined : value === "true",
              });
            }}
            className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100"
          >
            <option value="">Tous les statuts</option>
            <option value="true">Actives</option>
            <option value="false">Archivées</option>
          </select>
        </div>

        {/* Filtre par type de participant */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Participant
          </label>
          <select
            value={filters.participant_type || ""}
            onChange={(e) =>
              onFilterChange({
                ...filters,
                participant_type: e.target.value || undefined,
              })
            }
            className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100"
          >
            <option value="">Tous</option>
            <option value="client">Clients</option>
            <option value="freelancer">Freelancers</option>
            <option value="admin">Admins</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        {/* Date début */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Date début
          </label>
          <input
            type="date"
            value={filters.date_from || ""}
            onChange={(e) =>
              onFilterChange({
                ...filters,
                date_from: e.target.value || undefined,
              })
            }
            className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100"
          />
        </div>

        {/* Date fin */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Date fin
          </label>
          <input
            type="date"
            value={filters.date_to || ""}
            onChange={(e) =>
              onFilterChange({
                ...filters,
                date_to: e.target.value || undefined,
              })
            }
            className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100"
          />
        </div>
      </div>

      <div className="flex justify-end mt-4 space-x-2">
        <button
          onClick={() => {
            onFilterChange({});
            setLocalSearch("");
            onSearch();
          }}
          className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 border border-gray-300 dark:border-slate-600 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition"
        >
          Réinitialiser
        </button>
        <button
          onClick={onSearch}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center transition"
        >
          <Search className="w-4 h-4 mr-2" />
          Rechercher
        </button>
      </div>
    </div>
  );
};

// Carte de conversation
const ConversationCard = ({
  conversation,
  onView,
  onArchive,
  onDelete,
}: {
  conversation: Conversation;
  onView: (conversation: Conversation) => void;
  onArchive: (conversation: Conversation) => void;
  onDelete: (conversation: Conversation) => void;
}) => {
  const formatDate = (dateString?: string) => {
    if (!dateString) return "Jamais";
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return "Aujourd'hui";
    } else if (diffDays === 1) {
      return "Hier";
    } else if (diffDays < 7) {
      return `Il y a ${diffDays} jours`;
    } else {
      return date.toLocaleDateString("fr-FR");
    }
  };

  const formatTime = (dateString?: string) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getLastMessagePreview = () => {
    if (!conversation.last_message) return "Aucun message";
    const content = conversation.last_message.content || "Message média";
    return content.length > 50 ? content.substring(0, 50) + "..." : content;
  };

  const getParticipantRole = (userId: number) => {
    if (conversation.client_id === userId) return "Client";
    if (conversation.freelancer_id === userId) return "Freelancer";
    return "Admin";
  };

  const getParticipantName = (userId: number) => {
    if (conversation.client_id === userId && conversation.client) {
      return conversation.client.name;
    }
    if (conversation.freelancer_id === userId && conversation.freelancer) {
      return conversation.freelancer.name;
    }
    if (conversation.admin && conversation.admin.id === userId) {
      return conversation.admin.name;
    }
    return `Utilisateur #${userId}`;
  };

  return (
    <div
      className={`bg-white dark:bg-slate-800 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition border ${
        conversation.is_active
          ? "border-gray-200 dark:border-slate-700"
          : "border-gray-300 dark:border-slate-600 opacity-75"
      }`}
    >
      <div className="p-6">
        {/* En-tête avec service */}
        <div className="mb-4">
          <Link
            href={`/dashboard/admin/services/${conversation.service_id}`}
            className="text-lg font-semibold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition"
          >
            {conversation.service?.title ||
              `Service #${conversation.service_id}`}
          </Link>
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-1">
            <Briefcase className="w-4 h-4 mr-1" />
            <span>ID: {conversation.service_id}</span>
          </div>
        </div>

        {/* Participants */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          {/* Client */}
          <div className="flex items-center">
            {conversation.client?.avatar ? (
              <img
                src={conversation.client.avatar}
                alt={conversation.client.name}
                className="w-10 h-10 rounded-full mr-3 object-cover"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mr-3">
                <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
            )}
            <div>
              <Link
                href={`/admin/users/${conversation.client_id}`}
                className="font-medium text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition"
              >
                {conversation.client?.name ||
                  `Client #${conversation.client_id}`}
              </Link>
              <p className="text-xs text-gray-500 dark:text-gray-400">Client</p>
            </div>
          </div>

          {/* Freelancer */}
          <div className="flex items-center">
            {conversation.freelancer?.avatar ? (
              <img
                src={conversation.freelancer.avatar}
                alt={conversation.freelancer.name}
                className="w-10 h-10 rounded-full mr-3 object-cover"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mr-3">
                <User className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
            )}
            <div>
              <Link
                href={`/admin/users/${conversation.freelancer_id}`}
                className="font-medium text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition"
              >
                {conversation.freelancer?.name ||
                  `Freelancer #${conversation.freelancer_id}`}
              </Link>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Freelancer
              </p>
            </div>
          </div>
        </div>

        {/* Dernier message */}
        <div className="bg-gray-50 dark:bg-slate-700/50 rounded-lg p-3 mb-4">
          <div className="flex items-start">
            <MessageSquare className="w-4 h-4 text-gray-400 dark:text-gray-500 mr-2 mt-0.5 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2">
                {getLastMessagePreview()}
              </p>
              {conversation.last_message && (
                <div className="flex items-center mt-1 text-xs text-gray-500 dark:text-gray-400">
                  <span className="font-medium mr-1">
                    {getParticipantName(conversation.last_message.sender_id)}:
                  </span>
                  <span>
                    {formatTime(conversation.last_message.created_at)}
                  </span>
                  {!conversation.last_message.is_read && (
                    <span className="ml-2 px-1.5 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-xs">
                      Nouveau
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Métadonnées */}
        <div className="flex flex-wrap items-center justify-between text-sm">
          <div className="flex items-center space-x-4">
            <div className="flex items-center text-gray-500 dark:text-gray-400">
              <MessageSquare className="w-4 h-4 mr-1" />
              <span>{conversation.message_count || 0} messages</span>
            </div>
            <div className="flex items-center text-gray-500 dark:text-gray-400">
              <Clock className="w-4 h-4 mr-1" />
              <span>{formatDate(conversation.last_message_at)}</span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span
              className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                conversation.is_active
                  ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                  : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400"
              }`}
            >
              {conversation.is_active ? "Active" : "Archivée"}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-2 mt-4 pt-4 border-t border-gray-200 dark:border-slate-700">
          <button
            onClick={() => onView(conversation)}
            className="p-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition"
            title="Voir la conversation"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={() => onArchive(conversation)}
            className="p-2 text-gray-600 dark:text-gray-400 hover:text-yellow-600 dark:hover:text-yellow-400 hover:bg-yellow-50 dark:hover:bg-yellow-900/30 rounded-lg transition"
            title={conversation.is_active ? "Archiver" : "Désarchiver"}
          >
            <Archive className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(conversation)}
            className="p-2 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition"
            title="Supprimer"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

// Composant de pagination
const Pagination = ({
  currentPage,
  totalPages,
  totalItems,
  perPage,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  perPage: number;
  onPageChange: (page: number) => void;
}) => {
  const start = (currentPage - 1) * perPage + 1;
  const end = Math.min(currentPage * perPage, totalItems);

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-4 mt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border border-gray-200 dark:border-slate-700">
      <div className="text-sm text-gray-700 dark:text-gray-300">
        Affichage de{" "}
        <span className="font-medium text-gray-900 dark:text-gray-100">
          {start}
        </span>{" "}
        à{" "}
        <span className="font-medium text-gray-900 dark:text-gray-100">
          {end}
        </span>{" "}
        sur{" "}
        <span className="font-medium text-gray-900 dark:text-gray-100">
          {totalItems}
        </span>{" "}
        conversations
      </div>
      <div className="flex space-x-2">
        <button
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          className="p-2 border border-gray-300 dark:border-slate-600 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition text-gray-600 dark:text-gray-400"
        >
          <ChevronsLeft className="w-4 h-4" />
        </button>
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-2 border border-gray-300 dark:border-slate-600 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition text-gray-600 dark:text-gray-400"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <span className="px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-medium">
          {currentPage} / {totalPages}
        </span>
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-2 border border-gray-300 dark:border-slate-600 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition text-gray-600 dark:text-gray-400"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
        <button
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          className="p-2 border border-gray-300 dark:border-slate-600 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition text-gray-600 dark:text-gray-400"
        >
          <ChevronsRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

// Modal de confirmation de suppression
const DeleteConfirmModal = ({
  isOpen,
  onClose,
  conversation,
  onConfirm,
}: {
  isOpen: boolean;
  onClose: () => void;
  conversation: Conversation | null;
  onConfirm: () => void;
}) => {
  if (!isOpen || !conversation) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl max-w-md w-full p-6 border border-gray-200 dark:border-slate-700">
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
          Supprimer la conversation
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Êtes-vous sûr de vouloir supprimer définitivement cette conversation ?
          Cette action est irréversible et supprimera tous les messages
          associés.
        </p>
        <div className="bg-gray-50 dark:bg-slate-700/50 rounded-lg p-3 mb-4">
          <p className="text-sm text-gray-700 dark:text-gray-300">
            <span className="font-medium">Service:</span>{" "}
            {conversation.service?.title || `#${conversation.service_id}`}
          </p>
          <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
            <span className="font-medium">Participants:</span>{" "}
            {conversation.client?.name || `Client #${conversation.client_id}`} •{" "}
            {conversation.freelancer?.name ||
              `Freelancer #${conversation.freelancer_id}`}
          </p>
        </div>
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-300 transition"
          >
            Annuler
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
          >
            Supprimer
          </button>
        </div>
      </div>
    </div>
  );
};

// Page principale
export default function ConversationsPage() {
  const router = useRouter();

  // États
  const [loading, setLoading] = useState(true);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [stats, setStats] = useState<ConversationStats | null>(null);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    per_page: 12,
    total_pages: 1,
  });
  const [filters, setFilters] = useState<ConversationFilters>({
    page: 1,
    per_page: 12,
    sort_by: "last_message_at",
    sort_order: "desc",
  });
  const [selectedConversation, setSelectedConversation] =
    useState<Conversation | null>(null);
  const [deleteModal, setDeleteModal] = useState(false);

  // Charger les données
  const loadConversations = async () => {
    try {
      setLoading(true);

      // Utiliser les mock data
      const mockResponse = {
        items: mockMessages.conversations as Conversation[],
        total: mockMessages.conversations.length,
        page: filters.page || 1,
        per_page: filters.per_page || 12,
        total_pages: Math.ceil(
          mockMessages.conversations.length / (filters.per_page || 12),
        ),
      };
      setConversations(mockResponse.items);
      setPagination(mockResponse);
      setStats(mockMessages.stats as ConversationStats);
    } catch (error) {
      console.error("Erreur chargement conversations:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadConversations();
  }, [filters.page, filters.per_page, filters.sort_by, filters.sort_order]);

  // Gestionnaires d'événements
  const handleFilterChange = (newFilters: ConversationFilters) => {
    setFilters({ ...filters, ...newFilters, page: 1 });
  };

  const handleSearch = () => {
    loadConversations();
  };

  const handlePageChange = (page: number) => {
    setFilters({ ...filters, page });
  };

  const handleViewConversation = (conversation: Conversation) => {
    router.push(`/dashboard/admin/messages/${conversation.id}`);
  };

  const handleArchive = async (conversation: Conversation) => {
    try {
      await archiveConversation(conversation.id, !conversation.is_active);
      loadConversations();
    } catch (error) {
      console.error("Erreur archivage:", error);
    }
  };

  const handleDelete = async () => {
    if (!selectedConversation) return;
    try {
      await deleteConversation(selectedConversation.id);
      setDeleteModal(false);
      setSelectedConversation(null);
      loadConversations();
    } catch (error) {
      console.error("Erreur suppression:", error);
    }
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("fr-FR").format(num);
  };

  return (
    <div className="min-h-screen bg-slate-950">
      <div className="container mx-auto px-4 py-8">
        {/* En-tête */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-100 flex items-center">
            <MessageSquare className="w-6 h-6 mr-2 text-blue-400" />
            Gestion des conversations
          </h1>
          <p className="text-gray-400 mt-1">
            Suivez et gérez toutes les conversations entre utilisateurs
          </p>
        </div>

        {/* Cartes de statistiques */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <StatsCard
              title="Total conversations"
              value={formatNumber(stats.total)}
              subValue={`${stats.active} actives`}
              icon={MessageSquare}
              color="bg-blue-500"
            />
            <StatsCard
              title="Messages totaux"
              value={formatNumber(stats.total_messages)}
              subValue={`Moy. ${stats.avg_messages_per_conversation} par conv.`}
              icon={MessageCircle}
              color="bg-green-500"
            />
            <StatsCard
              title="Conversations actives"
              value={formatNumber(stats.active)}
              subValue={`${stats.unread} avec messages non lus`}
              icon={MessageSquare}
              color="bg-yellow-500"
            />
            <StatsCard
              title="Taux d'engagement"
              value={`${stats.engagement_rate}%`}
              subValue={`${stats.participants} participants uniques`}
              icon={Users}
              color="bg-purple-500"
            />
          </div>
        )}

        {/* Actions rapides */}
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-4 mb-6 flex flex-col sm:flex-row justify-between items-center gap-4 border border-gray-200 dark:border-slate-700">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={loadConversations}
              className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 border border-gray-300 dark:border-slate-600 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 flex items-center transition"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Actualiser
            </button>
          </div>
          <div className="flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400">
            <span className="flex items-center">
              <div className="w-2 h-2 rounded-full bg-green-500 mr-1"></div>
              Actives: {stats?.active || 0}
            </span>
            <span className="flex items-center">
              <div className="w-2 h-2 rounded-full bg-yellow-500 mr-1"></div>
              Non lues: {stats?.unread || 0}
            </span>
            <span className="flex items-center">
              <div className="w-2 h-2 rounded-full bg-gray-500 mr-1"></div>
              Archivées: {stats?.archived || 0}
            </span>
          </div>
        </div>

        {/* Filtres */}
        <ConversationFilters
          filters={filters}
          onFilterChange={handleFilterChange}
          onSearch={handleSearch}
        />

        {/* Grille des conversations */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          </div>
        ) : (
          <>
            {conversations.length === 0 ? (
              <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-12 text-center border border-gray-200 dark:border-slate-700">
                <MessageSquare className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
                  Aucune conversation trouvée
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Aucune conversation ne correspond à vos critères de recherche
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {conversations.map((conversation) => (
                  <ConversationCard
                    key={conversation.id}
                    conversation={conversation}
                    onView={handleViewConversation}
                    onArchive={handleArchive}
                    onDelete={(conv) => {
                      setSelectedConversation(conv);
                      setDeleteModal(true);
                    }}
                  />
                ))}
              </div>
            )}

            {/* Pagination */}
            <Pagination
              currentPage={pagination.page}
              totalPages={pagination.total_pages}
              totalItems={pagination.total}
              perPage={pagination.per_page}
              onPageChange={handlePageChange}
            />
          </>
        )}
      </div>

      {/* Modal de confirmation de suppression */}
      <DeleteConfirmModal
        isOpen={deleteModal}
        onClose={() => {
          setDeleteModal(false);
          setSelectedConversation(null);
        }}
        conversation={selectedConversation}
        onConfirm={handleDelete}
      />
    </div>
  );
}
