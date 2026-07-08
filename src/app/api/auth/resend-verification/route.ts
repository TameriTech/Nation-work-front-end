import { NextResponse } from "next/server";
import { backendFetch } from "@/app/lib/server/backend";
import { handleApiError } from "@/app/lib/server/errors";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!body.email) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Email requis',
          code: 'missing_email'
        },
        { status: 422 }
      );
    }

    const data = await backendFetch<{
      success: boolean;
      message: string;
      data: any;
    }>("/auth/resend-verification", {
      method: "POST",
      body: JSON.stringify(body),
    });

    return NextResponse.json(data);

  } catch (error: any) {
    console.error("Resend OTP error:", error);
    return handleApiError(error);
  }
}