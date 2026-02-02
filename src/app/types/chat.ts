export interface Conversation {
    id: number;
    service_id: number;
    client_id: number;
    freelancer_id: number;
    is_active: boolean;
    last_message_at: string;
    created_at: string;
    client_name: string;
    freelancer_name: string;
    service_title: string;
    other_user_name: string;
    other_user_profile_picture: string;
    unread_count: number;
    last_message_preview: string;
    last_message_time: string;
}
  
export interface Message {
    id: number;
    conversation_id: number;
    sender_id: number;
    recipient_id: number;
    content: string;
    media_url: [];
    media_type: string;
    is_read: boolean;
    read_at: string;
    created_at: string;
    sender_name: string;
    sender_profile_picture: string;
}

export interface NewConversationPayload { 
    id: number;
    service_id: number;
    client_id: number;
    freelancer_id: number;
    is_active: boolean;
    last_message_at: string;
    created_at: string;
    client_name: string;
    freelancer_name: string;
    service_title: string;
    other_user_name: string;
    other_user_profile_picture: string;
    unread_count: number;
    last_message_preview: string;
    last_message_time: string;
}


export interface NewMessagePayload {
    id: number;
    conversation_id: number;
    sender_id: number;
    recipient_id: number;
    content: string;
    media_url: string;
    media_type: string;
    is_read: boolean;
    read_at: string;
    created_at: string;
    sender_name: string;
    sender_profile_picture: string;
}