import { NextResponse } from "next/server";
import { backendFetch } from "@/app/lib/server/backend";
import { handleApiError } from "@/app/lib/server/errors";

export async function GET() {
  try {
    const data = await backendFetch("/users/freelancer/skills");
    return NextResponse.json(data);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const skill_id = searchParams.get('skill_id');
    const skill_type = searchParams.get('skill_type') || 'primary';
    const proficiency = searchParams.get('proficiency') || '3';

    if (!skill_id) {
      return NextResponse.json(
        { error: "skill_id is required" },
        { status: 400 }
      );
    }

    const data = await backendFetch(
      `/users/freelancer/skills?skill_id=${skill_id}&skill_type=${skill_type}&proficiency=${proficiency}`,
      { method: "POST" }
    );
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
