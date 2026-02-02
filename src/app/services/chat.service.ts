import { apiClient } from "../lib/api-client";
import { NewConversationPayload, NewMessagePayload } from "../types/chat";


// Chat Service API Calls

// Get Conversations
export function getConversations() {
    return apiClient(`/chat/conversations`, {
        method: "GET",
    });
}


// Get Conversation by ID
export function getConversation(conversationId: number) {
    return apiClient(`/chat/conversations/${conversationId}`, {
        method: "GET",
    });
}

// Get Messages
export function getMessages(conversationId: number) {
    return apiClient(`/chat/conversations/${conversationId}/messages`, {
        method: "GET",
    });
}

// Create Conversation
export function createConversation(payload: NewConversationPayload) {
    return apiClient(`/chat/conversations`, {
        method: "POST",
        body: JSON.stringify(payload),
    });
}

// Send Message
export function sendMessage(conversationId: number, payload: NewMessagePayload) {
    return apiClient(`/chat/conversations/${conversationId}/messages`, {
        method: "POST",
        body: JSON.stringify(payload),
    });
}

// Upload Chat Media
export function uploadChatMedia(conversationId: number, file: File) {
    const formData = new FormData();
    formData.append("file", file);

    return apiClient(`/chat/conversations/${conversationId}/upload`, {
        method: "POST",
        body: formData,
    });
}

// Mark Message As Read
export function markMessageAsRead(messageId: number) {
    return apiClient(`/chat/messages/${messageId}/read`, {
        method: "PUT",
    });
}