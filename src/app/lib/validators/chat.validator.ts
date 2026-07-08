// src/app/lib/validators/chat.validator.ts
import { z } from 'zod';
import { MessageType, ReactionType } from '../../types/enums';

// ==================== CONVERSATION SCHEMAS ====================

export const ConversationCreateSchema = z.object({
  service_id: z.number({
    error: "L'ID du service doit être un nombre"
  }).refine(val => val !== undefined && val !== null, {
    message: "L'ID du service est requis"
  }),
  
  other_user_id: z.number({
    error: "L'ID de l'autre utilisateur doit être un nombre"
  }).optional()
});

export type ConversationCreateFormData = z.infer<typeof ConversationCreateSchema>;

export const ConversationFiltersSchema = z.object({
  search: z.string().optional(),
  unread_only: z.boolean().optional(),
  limit: z.number().min(1).max(100).default(50),
  skip: z.number().min(0).default(0),
  page: z.number().min(1).default(1),
  include_inactive: z.boolean().default(false),
  sort_by: z.enum(['last_message_at', 'created_at', 'message_count']).default('last_message_at'),
  sort_order: z.enum(['asc', 'desc']).default('desc'),
  is_active: z.boolean().optional(),
  participant_type: z.enum(['client', 'provider', 'admin']).optional(),
  date_from: z.string().datetime().optional(),
  date_to: z.string().datetime().optional()
});

export type ConversationFiltersFormData = z.infer<typeof ConversationFiltersSchema>;

export const UpdateConversationSchema = z.object({
  is_active: z.boolean().optional()
});

export type UpdateConversationFormData = z.infer<typeof UpdateConversationSchema>;

// ==================== MESSAGE SCHEMAS ====================
export const MessageCreateSimpleSchema = z.object({
  content: z.string()
    .max(5000, "Le message ne peut pas dépasser 5000 caractères")
    .optional(),
  
  attachments: z.array(z.object({
    url: z.string().url("URL invalide"),
    type: z.enum(['image', 'video', 'audio', 'document', 'file', 'code', 'spreadsheet', 'presentation', 'archive']),
    name: z.string(),
    size: z.number(),
    mime_type: z.string().optional()
  })).max(10, "Maximum 10 fichiers par message")
    .default([]),  // ← retiré .optional(), default([]) suffit
  
  message_type: z.string().default("user"),
  reply_to: z.number().optional().nullable()

}).refine(data => {
  return (data.content && data.content.trim().length > 0) || data.attachments.length > 0;
}, {
  message: "Vous devez fournir soit un contenu texte, soit au moins un fichier",
  path: ['content']
});

export type MessageCreateSimpleFormData = z.infer<typeof MessageCreateSimpleSchema>;

export const MessageFiltersSchema = z.object({
  limit: z.number().min(1).max(200).default(50),
  before_id: z.number().optional(),
  after_id: z.number().optional(),
  message_type: z.nativeEnum(MessageType).optional(),
  include_system: z.boolean().default(true)
});

export type MessageFiltersFormData = z.infer<typeof MessageFiltersSchema>;

// ==================== REACTION SCHEMAS ====================

export const MessageReactionSchema = z.object({
  reaction: z.nativeEnum(ReactionType, {
    error: "La réaction doit être valide"
  })
});

export type MessageReactionFormData = z.infer<typeof MessageReactionSchema>;

// ==================== TYPING SCHEMAS ====================

export const TypingIndicatorSchema = z.object({
  conversation_id: z.number({
    error: "L'ID de la conversation doit être un nombre"
  }).refine(val => val !== undefined && val !== null, {
    message: "L'ID de la conversation est requis"
  }),
  
  user_id: z.number({
    error: "L'ID de l'utilisateur doit être un nombre"
  }).refine(val => val !== undefined && val !== null, {
    message: "L'ID de l'utilisateur est requis"
  }),
  
  is_typing: z.boolean({
    error: "is_typing doit être un booléen"
  })
});

export type TypingIndicatorFormData = z.infer<typeof TypingIndicatorSchema>;

// ==================== SEARCH SCHEMAS ====================

export const MessageSearchSchema = z.object({
  q: z.string({
    error: "La requête de recherche doit être une chaîne de caractères"
  }).min(2, "La recherche doit contenir au moins 2 caractères"),
  
  conversation_id: z.number().optional(),
  user_id: z.number().optional(),
  date_from: z.string().datetime().optional(),
  date_to: z.string().datetime().optional(),
  limit: z.number().min(1).max(100).default(50)
});

export type MessageSearchFormData = z.infer<typeof MessageSearchSchema>;


export const ChatFiltersSchema = z.object({
  page: z.number().int().positive().default(1).optional(),
  limit: z.number().int().positive().max(100).default(20).optional(),
  search: z.string().max(100).optional(),
  is_active: z.boolean().optional(),
  participant_type: z.enum(['client', 'provider', 'admin']).optional(),
  date_from: z.string().datetime().optional(),
  date_to: z.string().datetime().optional(),
  sort_by: z.enum(['last_message_at', 'created_at', 'message_count']).default('last_message_at').optional(),
  sort_order: z.enum(['asc', 'desc']).default('desc').optional(),
});

export type ChatFiltersFormData = z.infer<typeof ChatFiltersSchema>;