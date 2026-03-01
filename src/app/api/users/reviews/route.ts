import { NextResponse } from "next/server";
import { backendFetch } from "@/app/lib/server/backend";
import { handleApiError } from "@/app/lib/server/errors";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const data = await backendFetch("/users/reviews", { 
      method: "POST", 
      body: JSON.stringify(body) 
    });
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}