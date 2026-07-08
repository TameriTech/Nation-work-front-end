// app/api/admin/chat/conversations/[id]/route.ts

import { NextRequest, NextResponse } from "next/server";
import { backendFetch } from "@/app/lib/server/backend";
import { handleApiError } from "@/app/lib/server/errors";


export async function GET(
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

    const data = await backendFetch(`/chat/admin/conversations/${conversationId}`, { method: "GET" });
    return NextResponse.json(data);
  } catch (error) {
    return handleApiError(error);
  }

}


// DELETE - Supprimer une conversation (admin)
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

    const searchParams = req.nextUrl.searchParams;
    const hard_delete = searchParams.get("hard_delete") === "true";
    
    const url = `/chat/admin/conversations/${conversationId}`;
    const data = await backendFetch(url, { method: "DELETE" });
    return NextResponse.json(data);
  } catch (error) {
    return handleApiError(error);
  }
}