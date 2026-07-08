// app/api/auth/password/verify/route.ts

import { NextResponse } from "next/server";
import { backendFetch } from "@/app/lib/server/backend";
import { handleApiError, BackendError } from "@/app/lib/server/errors";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!body.email || !body.token) {
      throw new BackendError(
        "Email et token requis",
        422,
        { 
          email: body.email ? [] : ["L'email est requis"],
          token: body.token ? [] : ["Le token est requis"]
        }
      );
    }

    const data = await backendFetch("/auth/password-reset-verify", {
      method: "POST",
      body: JSON.stringify(body),
    });

    return NextResponse.json(data);
  } catch (error) {
    return handleApiError(error);
  }
}