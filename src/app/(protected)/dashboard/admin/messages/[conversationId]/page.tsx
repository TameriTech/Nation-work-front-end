"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Send,
  Paperclip,
  Image as ImageIcon,
  FileText,
  MoreHorizontal,
  Check,
  CheckCheck,
  Clock,
  User,
  Briefcase,
  Calendar,
  Phone,
  Mail,
  MapPin,
  Star,
  XCircle,
  Loader2,
  Download,
  Eye,
  Trash2,
  Archive,
  AlertCircle,
  MessageSquare,
  Info,
  ChevronDown,
} from "lucide-react";

import {
  getConversationById,
  getMessages,
  sendMessage,
  uploadMessageMedia,
  markMessageAsRead,
  markConversationAsRead,
  deleteMessage,
  archiveConversation,
  formatMessageDate,
  groupMessagesByDate,
  connectWebSocket,
  disconnectWebSocket,
  addMessageListener,
  sendTypingIndicator,
  startTyping,
  stopTyping,
} from "@/app/services/chat.service";
import type { Conversation, Message } from "@/app/types/admin";
import { messages as mockMessages } from "@/data/admin-mock-data";

// Badge de statut de message
const MessageStatusIcon = ({
  status,
  isOwn,
}: {
  status: { is_read: boolean; is_delivered: boolean };
  isOwn: boolean;
}) => {
  if (!isOwn) return null;

  if (status.is_read) {
    return <CheckCheck className="w-4 h-4 text-blue-500" />;
  }
  if (status.is_delivered) {
    return <Check className="w-4 h-4 text-gray-400" />;
  }
  return <Clock className="w-4 h-4 text-gray-400" />;
};

// Composant de message
const MessageBubble = ({
  message,
  isOwn,
  onDelete,
  onViewMedia,
}: {
  message: Message;
  isOwn: boolean;
  onDelete: (messageId: number) => void;
  onViewMedia: (url: string) => void;
}) => {
  const [showActions, setShowActions] = useState(false);

  const getSenderInfo = () => {
    if (message.sender?.role === "admin") {
      return {
        name: message.sender.name,
        badge: "Admin",
        badgeColor:
          "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
      };
    }
    if (message.sender?.role === "freelancer") {
      return {
        name: message.sender.name,
        badge: "Freelancer",
        badgeColor:
          "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
      };
    }
    return {
      name: message.sender?.name || "Client",
      badge: "Client",
      badgeColor:
        "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    };
  };

  const senderInfo = getSenderInfo();
  const messageDate = new Date(message.created_at);
  const time = messageDate.toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const renderMedia = () => {
    if (!message.media_url) return null;

    if (message.media_type?.startsWith("image/")) {
      return (
        <div className="mt-2 relative group">
          <img
            src={message.media_url}
            alt="Media"
            className="max-w-xs rounded-lg cursor-pointer hover:opacity-90 transition"
            onClick={() => onViewMedia(message.media_url!)}
          />
          <button
            onClick={() => onViewMedia(message.media_url!)}
            className="absolute top-2 right-2 p-1 bg-black bg-opacity-50 rounded-lg text-white opacity-0 group-hover:opacity-100 transition"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>
      );
    }

    return (
      <div className="mt-2 flex items-center p-2 bg-gray-100 dark:bg-slate-700 rounded-lg">
        <FileText className="w-5 h-5 text-gray-500 dark:text-gray-400 mr-2" />
        <a
          href={message.media_url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
        >
          Télécharger le fichier
        </a>
      </div>
    );
  };

  return (
    <div
      className={`flex ${isOwn ? "justify-end" : "justify-start"} mb-4`}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <div className={`max-w-[70%] ${isOwn ? "order-1" : "order-0"}`}>
        {/* En-tête du message (pour les messages des autres) */}
        {!isOwn && (
          <div className="flex items-center mb-1 ml-2">
            <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
              {senderInfo.name}
            </span>
            <span
              className={`ml-2 text-xs px-1.5 py-0.5 rounded ${senderInfo.badgeColor}`}
            >
              {senderInfo.badge}
            </span>
          </div>
        )}

        {/* Bulle de message */}
        <div
          className={`relative group rounded-lg p-3 ${
            isOwn
              ? "bg-blue-600 text-white"
              : "bg-gray-100 dark:bg-slate-700 text-gray-900 dark:text-gray-100"
          }`}
        >
          {/* Contenu du message */}
          {message.content && (
            <p className="text-sm whitespace-pre-wrap break-words">
              {message.content}
            </p>
          )}

          {/* Média joint */}
          {renderMedia()}

          {/* Pied du message */}
          <div
            className={`flex items-center justify-end mt-1 space-x-1 text-xs ${
              isOwn ? "text-blue-200" : "text-gray-500 dark:text-gray-400"
            }`}
          >
            <span>{time}</span>
            <MessageStatusIcon
              status={{
                is_read: message.is_read,
                is_delivered: message.is_delivered,
              }}
              isOwn={isOwn}
            />
          </div>

          {/* Actions (au survol) */}
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

// Séparateur de date
const DateSeparator = ({ date }: { date: string }) => (
  <div className="flex items-center justify-center my-6">
    <div className="px-4 py-1 bg-gray-100 dark:bg-slate-800 rounded-full text-xs text-gray-600 dark:text-gray-400">
      {date}
    </div>
  </div>
);

// Indicateur de frappe
const TypingIndicator = ({ names }: { names: string[] }) => {
  if (names.length === 0) return null;

  const text =
    names.length === 1
      ? `${names[0]} écrit...`
      : `${names.join(" et ")} écrivent...`;

  return (
    <div className="flex items-center space-x-2 px-4 py-2">
      <div className="flex space-x-1">
        <div
          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
          style={{ animationDelay: "0ms" }}
        />
        <div
          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
          style={{ animationDelay: "150ms" }}
        />
        <div
          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
          style={{ animationDelay: "300ms" }}
        />
      </div>
      <span className="text-sm text-gray-500 dark:text-gray-400">{text}</span>
    </div>
  );
};

// Modal de visualisation média
const MediaViewer = ({
  isOpen,
  onClose,
  url,
}: {
  isOpen: boolean;
  onClose: () => void;
  url: string | null;
}) => {
  if (!isOpen || !url) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white hover:text-gray-300 transition"
      >
        <XCircle className="w-8 h-8" />
      </button>
      <img
        src={url}
        alt="Media"
        className="max-w-full max-h-[90vh] object-contain"
      />
    </div>
  );
};

// Modal d'informations
const InfoModal = ({
  isOpen,
  onClose,
  conversation,
}: {
  isOpen: boolean;
  onClose: () => void;
  conversation: Conversation | null;
}) => {
  if (!isOpen || !conversation) return null;

  const formatDate = (dateString?: string) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("fr-FR", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl max-w-2xl w-full p-6 border border-gray-200 dark:border-slate-700">
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
          Informations de la conversation
        </h3>

        <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
          {/* Service */}
          <div className="bg-gray-50 dark:bg-slate-700/50 rounded-lg p-4">
            <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center">
              <Briefcase className="w-4 h-4 mr-2 text-blue-600" />
              Service concerné
            </h4>
            <Link
              href={`/admin/services/${conversation.service_id}`}
              className="block hover:bg-gray-100 dark:hover:bg-slate-700 p-2 rounded-lg transition"
            >
              <p className="font-medium text-gray-900 dark:text-gray-100">
                {conversation.service?.title ||
                  `Service #${conversation.service_id}`}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                ID: {conversation.service_id}
              </p>
            </Link>
          </div>

          {/* Client */}
          <div className="bg-gray-50 dark:bg-slate-700/50 rounded-lg p-4">
            <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center">
              <User className="w-4 h-4 mr-2 text-blue-600" />
              Client
            </h4>
            <Link
              href={`/admin/users/${conversation.client_id}`}
              className="flex items-center hover:bg-gray-100 dark:hover:bg-slate-700 p-2 rounded-lg transition"
            >
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
                <p className="font-medium text-gray-900 dark:text-gray-100">
                  {conversation.client?.name ||
                    `Client #${conversation.client_id}`}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {conversation.client?.email || "Email non disponible"}
                </p>
              </div>
            </Link>
          </div>

          {/* Freelancer */}
          <div className="bg-gray-50 dark:bg-slate-700/50 rounded-lg p-4">
            <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center">
              <Briefcase className="w-4 h-4 mr-2 text-green-600" />
              Freelancer
            </h4>
            <Link
              href={`/admin/users/${conversation.freelancer_id}`}
              className="flex items-center hover:bg-gray-100 dark:hover:bg-slate-700 p-2 rounded-lg transition"
            >
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
                <p className="font-medium text-gray-900 dark:text-gray-100">
                  {conversation.freelancer?.name ||
                    `Freelancer #${conversation.freelancer_id}`}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {conversation.freelancer?.email || "Email non disponible"}
                </p>
              </div>
            </Link>
          </div>

          {/* Statistiques */}
          <div className="bg-gray-50 dark:bg-slate-700/50 rounded-lg p-4">
            <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center">
              <Info className="w-4 h-4 mr-2 text-purple-600" />
              Statistiques
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Messages
                </p>
                <p className="text-lg font-bold text-gray-900 dark:text-gray-100">
                  {conversation.message_count || 0}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Non lus
                </p>
                <p className="text-lg font-bold text-yellow-600 dark:text-yellow-400">
                  {conversation.unread_count || 0}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Créée le
                </p>
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {formatDate(conversation.created_at)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Dernier message
                </p>
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {formatDate(conversation.last_message_at)}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};

export default function ConversationDetailPage() {
  const router = useRouter();
  const params = useParams();
  const conversationId = Number(params.conversationId);

  const [loading, setLoading] = useState(true);
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [sending, setSending] = useState(false);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const [selectedMedia, setSelectedMedia] = useState<string | null>(null);
  const [infoModal, setInfoModal] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout>();

  // Charger les données
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);

        // Utiliser les mock data
        const foundConversation = mockMessages.conversations.find(
          (c) => c.id === conversationId,
        ) as Conversation;

        if (foundConversation) {
          setConversation(foundConversation);
          setMessages(mockMessages.messages || []);

          // Marquer la conversation comme lue
          await markConversationAsRead(conversationId);
        }
      } catch (error) {
        console.error("Erreur chargement conversation:", error);
      } finally {
        setLoading(false);
      }
    };

    if (conversationId) {
      loadData();
    }
  }, [conversationId]);

  // WebSocket pour les messages en temps réel
  useEffect(() => {
    // Simuler la connexion WebSocket
    const ws = connectWebSocket("fake-token");

    const unsubscribe = addMessageListener((newMsg) => {
      if (newMsg.conversation_id === conversationId) {
        setMessages((prev) => [...prev, newMsg]);
        markMessageAsRead(newMsg.id);
      }
    });

    return () => {
      unsubscribe();
      disconnectWebSocket();
    };
  }, [conversationId]);

  // Scroll vers le bas quand de nouveaux messages arrivent
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async () => {
    if ((!newMessage.trim() && !selectedFile) || !conversation) return;

    try {
      setSending(true);
      stopTyping(conversationId);

      let mediaUrl: string | undefined;
      let mediaType: string | undefined;

      if (selectedFile) {
        setUploading(true);
        const uploadResult = await uploadMessageMedia(
          conversationId,
          selectedFile,
        );
        mediaUrl = uploadResult.url;
        mediaType = uploadResult.type;
        setUploading(false);
      }

      const message = await sendMessage({
        conversation_id: conversationId,
        content: newMessage.trim() || undefined,
        media: selectedFile || undefined,
        media_type: mediaType,
      });

      setMessages((prev) => [...prev, message]);
      setNewMessage("");
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.error("Erreur envoi message:", error);
    } finally {
      setSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleTyping = () => {
    if (!conversation) return;

    startTyping(conversationId);

    // Simuler la réception de l'indicateur de frappe des autres participants
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      stopTyping(conversationId);
    }, 3000);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleDeleteMessage = async (messageId: number) => {
    try {
      await deleteMessage(messageId);
      setMessages((prev) => prev.filter((m) => m.id !== messageId));
    } catch (error) {
      console.error("Erreur suppression message:", error);
    }
  };

  const handleArchive = async () => {
    if (!conversation) return;
    try {
      await archiveConversation(conversationId, !conversation.is_active);
      setConversation({ ...conversation, is_active: !conversation.is_active });
    } catch (error) {
      console.error("Erreur archivage:", error);
    }
  };

  // Grouper les messages par date
  const groupedMessages = groupMessagesByDate(messages);

  if (loading) {
    return (
      <div className="min-h-screen dark:bg-slate-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  if (!conversation) {
    return (
      <div className="min-h-screen dark:bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <MessageSquare className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-100 mb-2">
            Conversation non trouvée
          </h2>
          <p className="text-gray-400 mb-4">
            La conversation avec l'ID {conversationId} n'existe pas
          </p>
          <button
            onClick={() => router.back()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Retour
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      {/* En-tête */}
      <div className="bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => router.back()}
            className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div>
            <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Conversation #{conversation.id}
            </h1>
            <Link
              href={`/admin/services/${conversation.service_id}`}
              className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
            >
              {conversation.service?.title ||
                `Service #${conversation.service_id}`}
            </Link>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setInfoModal(true)}
            className="p-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition"
            title="Informations"
          >
            <Info className="w-5 h-5" />
          </button>
          <button
            onClick={handleArchive}
            className={`p-2 rounded-lg transition ${
              conversation.is_active
                ? "text-gray-600 dark:text-gray-400 hover:text-yellow-600 dark:hover:text-yellow-400 hover:bg-yellow-50 dark:hover:bg-yellow-900/30"
                : "text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/30"
            }`}
            title={conversation.is_active ? "Archiver" : "Désarchiver"}
          >
            <Archive className="w-5 h-5" />
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
                isOwn={message.sender?.role === "admin"}
                onDelete={handleDeleteMessage}
                onViewMedia={setSelectedMedia}
              />
            ))}
          </div>
        ))}
        <div ref={messagesEndRef} />

        {/* Indicateur de frappe */}
        <TypingIndicator names={typingUsers} />
      </div>

      {/* Zone de saisie */}
      <div className="bg-white dark:bg-slate-800 border-t border-gray-200 dark:border-slate-700 p-4">
        {/* Aperçu du fichier sélectionné */}
        {selectedFile && (
          <div className="mb-2 p-2 bg-gray-100 dark:bg-slate-700 rounded-lg flex items-center justify-between">
            <div className="flex items-center">
              <FileText className="w-4 h-4 text-gray-500 dark:text-gray-400 mr-2" />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                {selectedFile.name}
              </span>
            </div>
            <button
              onClick={() => {
                setSelectedFile(null);
                if (fileInputRef.current) {
                  fileInputRef.current.value = "";
                }
              }}
              className="p-1 text-gray-500 hover:text-red-600 rounded"
            >
              <XCircle className="w-4 h-4" />
            </button>
          </div>
        )}

        <div className="flex items-end space-x-2">
          <div className="flex-1">
            <textarea
              value={newMessage}
              onChange={(e) => {
                setNewMessage(e.target.value);
                handleTyping();
              }}
              onKeyPress={handleKeyPress}
              placeholder="Écrivez votre message..."
              rows={1}
              className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 resize-none"
              style={{ minHeight: "44px", maxHeight: "120px" }}
            />
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              accept="image/*,.pdf,.doc,.docx"
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading || sending}
              className="p-3 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition disabled:opacity-50"
              title="Joindre un fichier"
            >
              <Paperclip className="w-5 h-5" />
            </button>

            <button
              onClick={handleSendMessage}
              disabled={
                (!newMessage.trim() && !selectedFile) || sending || uploading
              }
              className="p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {sending || uploading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Modals */}
      <MediaViewer
        isOpen={!!selectedMedia}
        onClose={() => setSelectedMedia(null)}
        url={selectedMedia}
      />

      <InfoModal
        isOpen={infoModal}
        onClose={() => setInfoModal(false)}
        conversation={conversation}
      />

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #1e293b;
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #475569;
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #64748b;
        }
      `}</style>
    </div>
  );
}
