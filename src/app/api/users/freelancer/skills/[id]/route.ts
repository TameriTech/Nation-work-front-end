import { NextResponse } from "next/server";
import { backendFetch } from "@/app/lib/server/backend";
import { handleApiError } from "@/app/lib/server/errors";

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { searchParams } = new URL(req.url);
    const skill_type = searchParams.get('skill_type');
    const proficiency = searchParams.get('proficiency');
    const id = params.id;

    let url = `/users/freelancer/skills/${id}`;
    const queryParams = new URLSearchParams();
    if (skill_type) queryParams.append('skill_type', skill_type);
    if (proficiency) queryParams.append('proficiency', proficiency);
    
    if (queryParams.toString()) {
      url += `?${queryParams.toString()}`;
    }

    const data = await backendFetch(url, { method: "PUT" });
    return NextResponse.json(data);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;
    const data = await backendFetch(`/users/freelancer/skills/${id}`, { 
      method: "DELETE" 
    });
    return NextResponse.json(data);
  } catch (error) {
    return handleApiError(error);
  }
}
