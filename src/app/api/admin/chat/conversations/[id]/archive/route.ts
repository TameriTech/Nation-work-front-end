// app/api/admin/chat/conversations/[id]/archive/route.ts

import { NextRequest, NextResponse } from "next/server";
import { backendFetch } from "@/app/lib/server/backend";
import { handleApiError } from "@/app/lib/server/errors";
// DELETE - Archiver une conversation (admin)
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    
    const resolvedParams = await params;
    const conversationId = resolvedParams.id;
    
    if (!conversationId) {
      return NextResponse.json(
        { error: "Conversation ID is required" },
        { status: 400 }
      );
    }

    const data = await backendFetch(`/chat/admin/conversations/${conversationId}/archive`, { 
      method: "DELETE" 
    });
    return NextResponse.json(data);
  } catch (error) {
    return handleApiError(error);
  }
}
