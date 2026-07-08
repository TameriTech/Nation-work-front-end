// app/api/auth/password/reset-request/route.ts

import { NextResponse } from "next/server";
import { backendFetch } from "@/app/lib/server/backend";
import { handleApiError, BackendError } from "@/app/lib/server/errors";

export async function POST(req: Request) {
  try {
    const body = await req.json();


    if (!body.email) {
      throw new BackendError(
        "L'email est requis",
        422,
        { email: ["L'email est requis"] }
      );
    }

    const data = await backendFetch("/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    return NextResponse.json(data);
  } catch (error) {
    return handleApiError(error);
  }
}
