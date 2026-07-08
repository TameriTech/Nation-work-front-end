// app/api/admin/chat/conversations/route.ts

import { NextRequest, NextResponse } from "next/server";
import { backendFetch } from "@/app/lib/server/backend";
import { handleApiError } from "@/app/lib/server/errors";

// GET - Récupérer toutes les conversations (admin)
export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const params = new URLSearchParams();
    
    // Récupérer tous les paramètres de filtrage
    const page = searchParams.get("page");
    const limit = searchParams.get("limit");
    const search = searchParams.get("search");
    const is_active = searchParams.get("is_active");
    const participant_type = searchParams.get("participant_type");
    const date_from = searchParams.get("date_from");
    const date_to = searchParams.get("date_to");
    const sort_by = searchParams.get("sort_by");
    const sort_order = searchParams.get("sort_order");
    
    if (page) params.append("page", page);
    if (limit) params.append("limit", limit);
    if (search) params.append("search", search);
    if (is_active) params.append("is_active", is_active);
    if (participant_type) params.append("participant_type", participant_type);
    if (date_from) params.append("date_from", date_from);
    if (date_to) params.append("date_to", date_to);
    if (sort_by) params.append("sort_by", sort_by);
    if (sort_order) params.append("sort_order", sort_order);
    
    const queryString = params.toString();
    const url = `/chat/admin/conversations${queryString ? `?${queryString}` : ""}`;
    
    const data = await backendFetch(url, { method: "GET" });
    return NextResponse.json(data);
  } catch (error) {
    return handleApiError(error);
  }
}

// POST - Créer une nouvelle conversation (admin)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = await backendFetch("/chat/conversations", { 
      method: "POST", 
      body: JSON.stringify(body) 
    });
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
