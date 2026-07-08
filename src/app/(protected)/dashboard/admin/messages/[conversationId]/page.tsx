// app/(protected)/dashboard/admin/messages/[conversationId]/page.tsx

"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Send,
  Paperclip,
  FileText,
  Check,
  CheckCheck,
  Clock,
  User,
  Briefcase,
  XCircle,
  Loader2,
  Eye,
  Trash2,
  Archive,
  MessageSquare,
  Info,
  Image as ImageIcon,
  File,
  Star,
  Mail,
  Phone,
  MapPin,
  DollarSign,
} from "lucide-react";

import { useAdminChat } from "@/app/hooks/admin/use-admin-chat";
import { useChat } from "@/app/hooks/social/use-chat";
import type { MessageType } from "@/app/types";
import type { 
  AdminConversationDetailResponse, 
  AdminMessageResponse 
} from "@/app/types/chat";

// ==================== COMPOSANTS ====================

const MessageStatusIcon = ({ status, isOwn }: { status: { is_read: boolean; is_delivered: boolean }; isOwn: boolean }) => {
  if (!isOwn) return null;
  if (status.is_read) return <CheckCheck className="w-4 h-4 text-blue-500" />;
  if (status.is_delivered) return <Check className="w-4 h-4 text-gray-400" />;
  return <Clock className="w-4 h-4 text-gray-400" />;
};

const MessageBubble = ({
  message,
  isOwn,
  onDelete,
  onViewMedia,
}: {
  message: AdminMessageResponse;
  isOwn: boolean;
  onDelete: (messageId: number) => void;
  onViewMedia: (url: string) => void;
}) => {
  const [showActions, setShowActions] = useState(false);

  const getSenderInfo = () => {
    if (message.sender_role === "admin") {
      return {
        name: message.sender_name,
        badge: "Admin",
        badgeColor: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
      };
    }
    if (message.sender_role === "provider") {
      return {
        name: message.sender_name,
        badge: "provider",
        badgeColor: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
      };
    }
    return {
      name: message.sender_name || "Client",
      badge: "Client",
      badgeColor: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    };
  };

  const senderInfo = getSenderInfo();
  const messageDate = new Date(message.time);
  const time = messageDate.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });

  const renderMedia = () => {
    if (!message.attachments || message.attachments.length === 0) return null;

    return (
      <div className="mt-2 space-y-2">
        {message.attachments.map((att, index) => {
          if (att.type === "image") {
            return (
              <div key={index} className="relative group">
                <img
                  src={att.url}
                  alt={att.name}
                  className="rounded-lg cursor-pointer hover:opacity-90 transition max-w-full h-auto max-h-64"
                  onClick={() => onViewMedia(att.url)}
                />
                <button
                  onClick={() => onViewMedia(att.url)}
                  className="absolute top-2 right-2 p-1 bg-black bg-opacity-50 rounded-lg text-white opacity-0 group-hover:opacity-100 transition"
                >
                  <Eye className="w-4 h-4" />
                </button>
              </div>
            );
          }
          return (
            <div key={index} className="flex items-center p-2 bg-gray-100 dark:bg-slate-700 rounded-lg">
              <FileText className="w-5 h-5 text-gray-500 dark:text-gray-400 mr-2" />
              <a
                href={att.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
              >
                {att.name}
              </a>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div
      className={`flex ${message.sender_role === 'provider' ? "justify-end" : "justify-start"} mb-4`}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <div className={`max-w-[70%] ${isOwn ? "order-1" : "order-0"}`}>
        {!isOwn && (
          <div className="flex items-center mb-1 ml-2">
            <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{senderInfo.name}</span>
            <span className={`ml-2 text-xs px-1.5 py-0.5 rounded ${senderInfo.badgeColor}`}>
              {senderInfo.badge}
            </span>
          </div>
        )}

        <div className={`relative group rounded-lg p-3 ${isOwn ? "bg-blue-600 text-white" : "bg-gray-100 dark:bg-slate-700 text-gray-900 dark:text-gray-100"}`}>
          {message.content && (
            <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
          )}
          {renderMedia()}

          <div className={`flex items-center justify-end mt-1 space-x-1 text-xs ${isOwn ? "text-blue-200" : "text-gray-500 dark:text-gray-400"}`}>
            <span>{time}</span>
            <MessageStatusIcon status={{ is_read: message.is_read, is_delivered: message.is_delivered }} isOwn={isOwn} />
          </div>

          {showActions && isOwn && (
            <div className="absolute top-2 right-2 flex space-x-1">
              <button
                onClick={() => onDelete(message.id)}
                className="p-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
                title="Supprimer"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const DateSeparator = ({ date }: { date: string }) => (
  <div className="flex items-center justify-center my-6">
    <div className="px-4 py-1 bg-gray-100 dark:bg-slate-800 rounded-full text-xs text-gray-600 dark:text-gray-400">
      {date}
    </div>
  </div>
);

const TypingIndicator = ({ names }: { names: string[] }) => {
  if (names.length === 0) return null;
  const text = names.length === 1 ? `${names[0]} écrit...` : `${names.join(" et ")} écrivent...`;

  return (
    <div className="flex items-center space-x-2 px-4 py-2">
      <div className="flex space-x-1">
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
      </div>
      <span className="text-sm text-gray-500 dark:text-gray-400">{text}</span>
    </div>
  );
};

const MediaViewer = ({ isOpen, onClose, url }: { isOpen: boolean; onClose: () => void; url: string | null }) => {
  if (!isOpen || !url) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center">
      <button onClick={onClose} className="absolute top-4 right-4 text-white hover:text-gray-300 transition">
        <XCircle className="w-8 h-8" />
      </button>
      <img src={url} alt="Media" className="max-w-full max-h-[90vh] object-contain" />
    </div>
  );
};

const InfoModal = ({
  isOpen,
  onClose,
  data,
}: {
  isOpen: boolean;
  onClose: () => void;
  data: AdminConversationDetailResponse | null;
}) => {
  if (!isOpen || !data) return null;

  const formatDate = (dateString?: string | null) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("fr-FR", {
      weekday: "long", year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit",
    });
  };

  const formatCurrency = (amount?: number) => {
    if (!amount) return "0 €";
    return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(amount);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl max-w-2xl w-full p-6 border border-gray-200 dark:border-slate-700 max-h-[90vh] overflow-y-auto">
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">Informations de la conversation</h3>

        <div className="space-y-4">
          {/* Service */}
          <div className="bg-gray-50 dark:bg-slate-700/50 rounded-lg p-4">
            <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center">
              <Briefcase className="w-4 h-4 mr-2 text-blue-600" /> Service concerné
            </h4>
            <Link href={`/admin/services/${data.conversation.service_id}`} className="block hover:bg-gray-100 dark:hover:bg-slate-700 p-2 rounded-lg transition">
              <p className="font-medium text-gray-900 dark:text-gray-100">{data.service?.title || `Service #${data.conversation.service_id}`}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Code: {data.service?.code} • Statut: {data.service?.status}
              </p>
              {data.service?.proposed_amount && (
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Montant: {formatCurrency(data.service.proposed_amount)}
                </p>
              )}
            </Link>
          </div>

          {/* Client */}
          {data.client && (
            <div className="bg-gray-50 dark:bg-slate-700/50 rounded-lg p-4">
              <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center">
                <User className="w-4 h-4 mr-2 text-blue-600" /> Client
              </h4>
              <Link href={`/admin/users/${data.client.id}`} className="flex items-center hover:bg-gray-100 dark:hover:bg-slate-700 p-2 rounded-lg transition">
                {data.client.avatar ? (
                  <img src={data.client.avatar} alt={data.client.full_name || data.client.username} className="w-10 h-10 rounded-full mr-3 object-cover" />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mr-3">
                    <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                )}
                <div>
                  <p className="font-medium text-gray-900 dark:text-gray-100">{data.client.full_name || data.client.username}</p>
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <Mail className="w-3 h-3 mr-1" /> {data.client.email}
                  </div>
                  {data.client.phone && (
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <Phone className="w-3 h-3 mr-1" /> {data.client.phone}
                    </div>
                  )}
                </div>
              </Link>
            </div>
          )}

          {/* provider */}
          {data.provider && (
            <div className="bg-gray-50 dark:bg-slate-700/50 rounded-lg p-4">
              <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center">
                <Briefcase className="w-4 h-4 mr-2 text-green-600" /> provider
              </h4>
              <Link href={`/admin/users/${data.provider.id}`} className="flex items-center hover:bg-gray-100 dark:hover:bg-slate-700 p-2 rounded-lg transition">
                {data.provider.avatar ? (
                  <img src={data.provider.avatar} alt={data.provider.full_name || data.provider.username} className="w-10 h-10 rounded-full mr-3 object-cover" />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mr-3">
                    <User className="w-5 h-5 text-green-600 dark:text-green-400" />
                  </div>
                )}
                <div>
                  <p className="font-medium text-gray-900 dark:text-gray-100">{data.provider.full_name || data.provider.username}</p>
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <Mail className="w-3 h-3 mr-1" /> {data.provider.email}
                  </div>
                  {data.provider.rating && (
                    <div className="flex items-center text-sm text-yellow-600">
                      <Star className="w-3 h-3 mr-1 fill-yellow-500" /> {data.provider.rating}/5
                    </div>
                  )}
                </div>
              </Link>
            </div>
          )}

          {/* Statistiques */}
          <div className="bg-gray-50 dark:bg-slate-700/50 rounded-lg p-4">
            <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center">
              <Info className="w-4 h-4 mr-2 text-purple-600" /> Statistiques
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div><p className="text-sm text-gray-500">Messages</p><p className="text-lg font-bold">{data.conversation.total_messages}</p></div>
              <div><p className="text-sm text-gray-500">Non lus</p><p className="text-lg font-bold text-yellow-600">{data.conversation.unread_count}</p></div>
              <div><p className="text-sm text-gray-500">Créée le</p><p className="text-sm font-medium">{formatDate(data.conversation.created_at)}</p></div>
              <div><p className="text-sm text-gray-500">Dernier message</p><p className="text-sm font-medium">{formatDate(data.conversation.last_message_at)}</p></div>
            </div>
          </div>
        </div>

        <div className="flex justify-end mt-6">
          <button onClick={onClose} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};

// ==================== PAGE PRINCIPALE ====================

export default function ConversationDetailPage() {
  const router = useRouter();
  const params = useParams();
  const conversationId = Number(params.conversationId);

  const { getConversation, archiveConversation: archiveConversationAdmin, isArchiving } = useAdminChat();
  const { data: adminConversationData, isLoading: isLoadingAdminConversation, refetch: refetchAdminConversation } = getConversation(conversationId);

  const {
    sendMessage,
    isSending,
    deleteMessage,
    markConversationAsRead,
    handleTyping,
    isConnected,
    refetchMessages,
  } = useChat(conversationId);

  const [newMessage, setNewMessage] = useState("");
  const [selectedMedia, setSelectedMedia] = useState<string | null>(null);
  const [infoModal, setInfoModal] = useState(false);
  const [localMessages, setLocalMessages] = useState<AdminMessageResponse[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Mettre à jour les messages locaux quand les données arrivent
  useEffect(() => {
    if (adminConversationData?.messages) {
      setLocalMessages(adminConversationData.messages);
    }
  }, [adminConversationData?.messages]);

  // Scroll vers le bas
  useEffect(() => {
    scrollToBottom();
  }, [localMessages]);

  // Marquer comme lu
  useEffect(() => {
    if (conversationId) {
      markConversationAsRead();
    }
  }, [conversationId, markConversationAsRead]);

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !conversationId) return;
    try {
      await sendMessage(newMessage.trim());
      setNewMessage("");
      refetchAdminConversation();
      refetchMessages();
    } catch (error) {
      console.error("Erreur envoi message:", error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleDeleteMessage = async (messageId: number) => {
    try {
      await deleteMessage(messageId);
      refetchAdminConversation();
      refetchMessages();
    } catch (error) {
      console.error("Erreur suppression message:", error);
    }
  };

  const handleArchive = async () => {
    if (!adminConversationData) return;
    try {
      await archiveConversationAdmin(conversationId, adminConversationData.conversation.is_active);
      setTimeout(() => {
        refetchAdminConversation();
      }, 500);
    } catch (error) {
      console.error("Erreur archivage:", error);
    }
  };

  // Grouper les messages par date
  const getGroupedMessages = () => {
    const groups = new Map<string, AdminMessageResponse[]>();
    localMessages.forEach((msg) => {
      const date = new Date(msg.time).toLocaleDateString("fr-FR");
      if (!groups.has(date)) groups.set(date, []);
      groups.get(date)!.push(msg);
    });
    return groups;
  };

  if (isLoadingAdminConversation) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  if (!adminConversationData) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <MessageSquare className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Conversation non trouvée</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">La conversation avec l'ID {conversationId} n'existe pas</p>
          <button onClick={() => router.back()} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
            Retour
          </button>
        </div>
      </div>
    );
  }

  const groupedMessages = getGroupedMessages();
  const isActive = adminConversationData.conversation.is_active;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 flex flex-col">
      {/* En-tête */}
      <div className="bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button onClick={() => router.back()} className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Conversation #{adminConversationData.conversation.id}
            </h1>
            <Link href={`/admin/services/${adminConversationData.conversation.service_id}`} className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
              {adminConversationData.service?.title || `Service #${adminConversationData.conversation.service_id}`}
            </Link>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <div className="flex items-center mr-2">
            <div className={`w-2 h-2 rounded-full mr-2 ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
            <span className="text-xs text-gray-500 dark:text-gray-400">{isConnected ? 'Connecté' : 'Déconnecté'}</span>
          </div>
          <button onClick={() => setInfoModal(true)} className="p-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition" title="Informations">
            <Info className="w-5 h-5" />
          </button>
          <button
            onClick={handleArchive}
            disabled={isArchiving}
            className={`p-2 rounded-lg transition disabled:opacity-50 ${
              isActive ? "text-gray-600 dark:text-gray-400 hover:text-yellow-600 dark:hover:text-yellow-400 hover:bg-yellow-50 dark:hover:bg-yellow-900/30"
                       : "text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/30"
            }`}
            title={isActive ? "Archiver" : "Désarchiver"}
          >
            {isArchiving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Archive className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-slate-900">
        {Array.from(groupedMessages.entries()).map(([date, msgs]) => (
          <div key={date}>
            <DateSeparator date={date} />
            {msgs.map((message) => (
              <MessageBubble
                key={message.id}
                message={message}
                isOwn={message.sender_role === "admin"}
                onDelete={handleDeleteMessage}
                onViewMedia={setSelectedMedia}
              />
            ))}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Zone de saisie */}
      <div className="bg-white dark:bg-slate-800 border-t border-gray-200 dark:border-slate-700 p-4">
        <div className="flex items-end space-x-2">
          <div className="flex-1">
            <textarea
              value={newMessage}
              onChange={(e) => { setNewMessage(e.target.value); handleTyping(); }}
              onKeyPress={handleKeyPress}
              placeholder="Écrivez votre message..."
              rows={1}
              disabled={isSending || !isActive}
              className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 resize-none disabled:opacity-50"
              style={{ minHeight: "44px", maxHeight: "120px" }}
            />
          </div>
          <button
            onClick={handleSendMessage}
            disabled={!newMessage.trim() || isSending || !isActive}
            className="p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {isSending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
          </button>
        </div>
        {!isActive && (
          <p className="text-sm text-yellow-600 dark:text-yellow-400 mt-2 text-center">
            Cette conversation est archivée. Vous ne pouvez plus envoyer de messages.
          </p>
        )}
      </div>

      {/* Modals */}
      <MediaViewer isOpen={!!selectedMedia} onClose={() => setSelectedMedia(null)} url={selectedMedia} />
      <InfoModal isOpen={infoModal} onClose={() => setInfoModal(false)} data={adminConversationData} />
    </div>
  );
}
