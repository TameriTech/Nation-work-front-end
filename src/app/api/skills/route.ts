import { NextResponse } from "next/server";
import { backendFetch } from "@/app/lib/server/backend";
import { handleApiError } from "@/app/lib/server/errors";
import { headers } from "next/headers";

export async function GET() {
  try {
    const data = await backendFetch("/skills/");
    return NextResponse.json(data);
  } catch (error) {
    return handleApiError(error);
  }
}
