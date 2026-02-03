import {
  NewConversationPayload,
  NewMessagePayload,
} from "@/app/types/chat";

export async function getConversations() {
  const res = await fetch("/api/chat/conversations", {
    method: "GET",
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch conversations");
  }

  return res.json();
}

export async function getConversation(conversationId: number) {
  const res = await fetch(
    `/api/chat/conversations/${conversationId}`,
    {
      method: "GET",
      cache: "no-store",
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch conversation");
  }

  return res.json();
}

export async function getMessages(conversationId: number) {
  const res = await fetch(
    `/api/chat/conversations/${conversationId}/messages`,
    {
      method: "GET",
      cache: "no-store",
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch messages");
  }

  return res.json();
}

export async function createConversation(
  payload: NewConversationPayload
) {
  const res = await fetch("/api/chat/conversations", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error("Failed to create conversation");
  }

  return res.json();
}

export async function sendMessage(
  conversationId: number,
  payload: NewMessagePayload
) {
  const res = await fetch(
    `/api/chat/conversations/${conversationId}/messages`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    }
  );

  if (!res.ok) {
    throw new Error("Failed to send message");
  }

  return res.json();
}

export async function uploadChatMedia(
  conversationId: number,
  file: File
) {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(
    `/api/chat/conversations/${conversationId}/upload`,
    {
      method: "POST",
      body: formData,
    }
  );

  if (!res.ok) {
    throw new Error("Failed to upload chat media");
  }

  return res.json();
}

export async function markMessageAsRead(messageId: number) {
  const res = await fetch(
    `/api/chat/messages/${messageId}/read`,
    {
      method: "PUT",
    }
  );

  if (!res.ok) {
    throw new Error("Failed to mark message as read");
  }

  return res.json();
}
