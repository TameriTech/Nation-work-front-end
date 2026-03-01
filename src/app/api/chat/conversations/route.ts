import { NextResponse } from "next/server";
import { backendFetch } from "@/app/lib/server/backend";
import { handleApiError } from "@/app/lib/server/errors";

export async function GET() {
  try {
    const data = await backendFetch("/chat/conversations");
    return NextResponse.json(data);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(req: Request) {
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