// app/components/features/messaging/MessageInput.tsx
"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Input } from "@/app/components/ui/input";
import { Button } from "@/app/components/ui/button";
import { Icon } from "@iconify/react";
import { Attachment } from "@/app/types/chat";
import { useMediaUpload } from "@/app/hooks/social/use-media-upload";
import { cn } from "@/app/lib/utils";

interface MessageInputProps {
  onSend: (content: string, attachments: Attachment[]) => void;
  onTyping?: () => void;
  disabled?: boolean;
  conversationId: number;
}

const MessageInput = ({ 
  onSend, 
  onTyping, 
  disabled = false,
  conversationId 
}: MessageInputProps) => {
  const [message, setMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = useRef<NodeJS.Timeout>('' as unknown as NodeJS.Timeout);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const {
    attachments,
    isUploading,
    hasUploading,
    addFiles,
    uploadAll,
    removeAttachment,
    clearAttachments
  } = useMediaUpload(conversationId);

  const handleSend = useCallback(async () => {
    if ((!message.trim() && attachments.length === 0) || disabled) return;
    
    let uploadedAttachments: Attachment[] = [];
    if (attachments.length > 0) {
      uploadedAttachments = await uploadAll();
    }
    
    onSend(message.trim(), uploadedAttachments);
    
    setMessage("");
    clearAttachments();
    
    if (isTyping) {
      setIsTyping(false);
      onTyping?.();
    }
  }, [message, attachments, disabled, uploadAll, onSend, clearAttachments, isTyping, onTyping]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
    
    if (!isTyping && e.target.value) {
      setIsTyping(true);
      onTyping?.();
    }

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

    typingTimeoutRef.current = setTimeout(() => {
      if (isTyping) {
        setIsTyping(false);
        onTyping?.();
      }
    }, 2000);
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      await addFiles(e.target.files);
    }
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith("image/")) return "ph:image";
    if (type === "application/pdf") return "ph:file-pdf";
    if (type.includes("word")) return "ph:file-doc";
    if (type.includes("excel")) return "ph:file-xls";
    if (type.startsWith("video/")) return "ph:video";
    if (type.startsWith("audio/")) return "ph:music-note";
    if (type.includes("zip")) return "ph:archive";
    return "ph:file";
  };

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    };
  }, []);

  const isDisabled = disabled || isUploading || hasUploading;

  return (
    <div className="flex flex-col p-4 bg-surface dark:bg-gray-800 rounded-b-2xl border-t border-gray-100 dark:border-gray-700">
      {/* Attachments preview */}
      {attachments.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3 max-h-32 overflow-y-auto">
          {attachments.map((att) => (
            <div key={att.id} className="relative group">
              {att.preview && att.file.type.startsWith("image/") ? (
                <div className="relative w-16 h-16 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                  <img src={att.preview} alt={att.file.name} className="w-full h-full object-cover" />
                  {att.uploading && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <Icon icon="ph:spinner" className="h-4 w-4 animate-spin text-white" />
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                  <Icon icon={getFileIcon(att.file.type)} className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                  <div className="text-xs max-w-[120px]">
                    <p className="truncate font-medium text-text-primary dark:text-gray-100">{att.file.name}</p>
                    <p className="text-gray-400 dark:text-gray-500">{formatFileSize(att.file.size)}</p>
                  </div>
                  {att.uploading && <Icon icon="ph:spinner" className="h-3 w-3 animate-spin" />}
                </div>
              )}
              
              {!att.uploading && (
                <button
                  onClick={() => removeAttachment(att.id)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Icon icon="ph:x" className="h-3 w-3" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
      
      {/* Input area */}
      <div className="flex items-center gap-3">
        <div className="flex-1 relative">
          <Input
            value={message}
            onChange={handleChange}
            onKeyPress={handleKeyPress}
            placeholder={attachments.length > 0 ? "Ajouter un message..." : "Écrivez un message..."}
            disabled={isDisabled}
            className="pr-12 rounded-full border-gray-200 dark:border-gray-700 focus:border-primary focus:ring-primary bg-gray-50 dark:bg-gray-900 text-text-primary dark:text-gray-100"
          />
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.txt,.zip,.mp4,.mp3"
            multiple
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isDisabled}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-primary transition-colors disabled:opacity-50"
          >
            <Icon icon="ph:paperclip" className="h-5 w-5" />
          </button>
        </div>

        <Button
          onClick={handleSend}
          disabled={(!message.trim() && attachments.length === 0) || isDisabled}
          className="rounded-full px-6 gap-2 bg-gradient-to-r from-primary to-secondary text-white hover:shadow-lg transition-all disabled:opacity-50"
        >
          {isUploading || hasUploading ? (
            <Icon icon="ph:spinner" className="h-4 w-4 animate-spin" />
          ) : (
            <Icon icon="ph:paper-plane-right" className="h-4 w-4" />
          )}
          <span className="hidden md:inline">
            {isUploading || hasUploading ? "Envoi..." : "Envoyer"}
          </span>
        </Button>
      </div>
    </div>
  );
};

export default MessageInput;