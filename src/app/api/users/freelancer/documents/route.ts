import { NextResponse } from "next/server";
import { backendFetch, backendFetchFormData } from "@/app/lib/server/backend";
import { handleApiError } from "@/app/lib/server/errors";

export async function GET() {
  try {
    const data = await backendFetch("/users/freelancer/verification/documents");
    console.log("Documents fetched successfully:", data);
    return NextResponse.json(data);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(req: Request) {
  try {
    const contentType = req.headers.get('content-type') || '';
    if (!contentType.includes('multipart/form-data')) {
      return NextResponse.json(
        { error: "Expected multipart/form-data" },
        { status: 400 }
      );
    }

    const formData = await req.formData();
    console.log('Received form data:', formData);
    const data = await backendFetchFormData("/users/freelancer/verification/documents", formData);
    console.log('Document uploaded successfully:', data);
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}