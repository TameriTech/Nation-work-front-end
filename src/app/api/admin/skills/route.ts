// app/api/admin/skills/route.ts
import { NextRequest, NextResponse } from "next/server";
import { backendFetch } from "@/app/lib/server/backend";
import { handleApiError } from "@/app/lib/server/errors";

// GET /api/admin/skills - Récupérer toutes les compétences
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const skillType = searchParams.get('skill_type');
    const search = searchParams.get('search');
    const skip = searchParams.get('skip');
    const limit = searchParams.get('limit');

    const queryParams = new URLSearchParams();
    if (category) queryParams.append('category', category);
    if (skillType) queryParams.append('skill_type', skillType);
    if (search) queryParams.append('search', search);
    if (skip) queryParams.append('skip', skip);
    if (limit) queryParams.append('limit', limit);

    const url = queryParams.toString() 
      ? `/skills?${queryParams.toString()}`
      : "/skills";

    const data = await backendFetch(url);
    return NextResponse.json(data);
  } catch (error) {
    return handleApiError(error);
  }
}

// POST /api/admin/skills - Créer une nouvelle compétence
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = await backendFetch("/skills", {
      method: "POST",
      body: JSON.stringify(body),
    });
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
