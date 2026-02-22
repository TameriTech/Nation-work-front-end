import { NextResponse } from "next/server";
import { apiClient } from "@/app/lib/api-client";
import { cookies } from "next/headers";

/**
 * Add a service to the user's wishlist
 * @param request 
 * @param param1 
 * @returns 
 */
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Await the params Promise first
    const { id } = await params;
    
    // Then use the id
    if (!id || isNaN(Number(id))) {
      return NextResponse.json({ error: "Invalid service ID" }, { status: 400 });
    }
    
    // Rest of your DELETE logic...
    const serviceId = parseInt(id);
    
    // Your existing code...
    const token = (await cookies()).get('access_token')?.value || null;
    const response = await apiClient(`/services/wishlist/${serviceId}`, {
      method: "POST",
      headers: {
          Authorization: `Bearer ${token}`,
      },
    });

    return NextResponse.json({ status: 204 });
  } catch (error) {
    console.error("Error adding service to wishlist:", error);
    return NextResponse.json(
      { error: "Failed to add service to wishlist" },
      { status: 500 }
    );
  }
}


export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Await the params Promise first
    const { id } = await params;
    
    // Then use the id
    if (!id || isNaN(Number(id))) {
      return NextResponse.json({ error: "Invalid service ID" }, { status: 400 });
    }
    
    // Rest of your DELETE logic...
    const serviceId = parseInt(id);
    
    // Your existing code...
    const token = (await cookies()).get('access_token')?.value || null;
    const response = await apiClient(`/services/wishlist/${serviceId}`, {
      method: "DELETE",
      headers: {
          Authorization: `Bearer ${token}`,
      },
    });

    return NextResponse.json({ status: 204 });
  } catch (error) {
    console.error("Error deleting service from wishlist:", error);
    return NextResponse.json(
      { error: "Failed to delete service from wishlist" },
      { status: 500 }
    );
  }
}