// app/components/features/messaging/MessageBubble.tsx
"use client";

import { cn } from "@/app/lib/utils";
import { formatMessageDate } from "@/app/services/chat.service";
import { MessageListResponse, Attachment } from "@/app/types/chat";
import { Icon } from "@iconify/react";

interface MessageBubbleProps {
  message: MessageListResponse;
}

const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const getFileIcon = (mimeType?: string, fileType?: string) => {
  if (mimeType?.startsWith("image/") || fileType === "image") return "ph:image";
  if (mimeType === "application/pdf") return "ph:file-pdf";
  if (mimeType?.includes("word")) return "ph:file-doc";
  if (mimeType?.includes("excel")) return "ph:file-xls";
  if (mimeType?.startsWith("video/") || fileType === "video") return "ph:video";
  if (mimeType?.startsWith("audio/") || fileType === "audio") return "ph:music-note";
  if (mimeType?.includes("zip")) return "ph:archive";
  if (fileType === "document") return "ph:file-text";
  if (fileType === "code") return "ph:code";
  return "ph:file";
};

const AttachmentItem = ({ attachment }: { attachment: Attachment }) => {
  if (attachment.type === "image") {
    return (
      <img 
        src={attachment.url} 
        alt={attachment.name}
        className="max-w-[200px] max-h-[200px] rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
        onClick={() => window.open(attachment.url, '_blank')}
      />
    );
  }
  
  return (
    <a 
      href={attachment.url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
    >
      <Icon icon={getFileIcon(attachment.mime_type, attachment.type)} className="h-5 w-5 text-gray-500 dark:text-gray-400" />
      <div>
        <p className="text-sm font-medium truncate max-w-[200px] text-text-primary dark:text-gray-100">{attachment.name}</p>
        <p className="text-xs text-gray-400 dark:text-gray-500">{formatFileSize(attachment.size)}</p>
      </div>
      <Icon icon="ph:arrow-square-out" className="h-4 w-4 text-gray-400" />
    </a>
  );
};

const MessageBubble = ({ message }: MessageBubbleProps) => {
  const hasAttachments = message.attachments && message.attachments.length > 0;
  const hasContent = message.content && message.content.trim().length > 0;
  const isSent = message.is_sent;

  const renderStatus = () => {
    if (!isSent) return null;
    if (message.status === "read") return <Icon icon="ph:check-double" className="h-3 w-3 text-blue-500" />;
    if (message.status === "delivered") return <Icon icon="ph:check-double" className="h-3 w-3 text-gray-400" />;
    return <Icon icon="ph:check" className="h-3 w-3 text-gray-400" />;
  };

  return (
    <div
      className={cn(
        "flex flex-col gap-1 max-w-[70%]",
        isSent ? "items-end" : "items-start"
      )}
    >
      {/* Attachments */}
      {hasAttachments && (
        <div className={cn(
          "flex flex-wrap gap-2",
          isSent ? "justify-end" : "justify-start"
        )}>
          {message.attachments.map((att, index) => (
            <AttachmentItem key={index} attachment={att} />
          ))}
        </div>
      )}

      {/* Text content */}
      {hasContent && (
        <div
          className={cn(
            "px-4 py-2 rounded-2xl shadow-sm max-w-full break-words",
            isSent
              ? "bg-gradient-to-r from-primary to-secondary text-white rounded-br-sm"
              : "bg-gray-100 dark:bg-gray-700 text-text-primary dark:text-gray-100 rounded-bl-sm"
          )}
        >
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
        </div>
      )}

      {/* Timestamp and status */}
      <div className={cn(
        "flex items-center gap-1 text-xs px-1",
        isSent ? "justify-end" : "justify-start",
        isSent ? "text-text-secondary dark:text-gray-400" : "text-text-secondary dark:text-gray-500"
      )}>
        <span>{formatMessageDate(message.time)}</span>
        {renderStatus()}
      </div>
    </div>
  );
};

export default MessageBubble;
