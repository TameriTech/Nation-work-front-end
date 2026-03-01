import { NextResponse } from "next/server";
import { backendFetch } from "@/app/lib/server/backend";
import { handleApiError } from "@/app/lib/server/errors";

export async function POST(request: Request) {
  try {
    const formData = await request.json();
    
    const modelFields = [
      "title", "service_type", "category_id", "short_description", 
      "full_description", "date_pratique", "start_time", "duration",
      "address", "quarter", "city", "postal_code", "country",
      "latitude", "longitude", "proposed_amount", "accepted_amount",
      "required_skills"
    ];
    
    const cleanData: any = {};
    modelFields.forEach(field => {
      if (formData.hasOwnProperty(field)) {
        cleanData[field] = formData[field];
      }
    });
    
    const response = await backendFetch("/services/publish", {
      method: 'POST',
      body: JSON.stringify(cleanData)
    });
    
    return NextResponse.json(response);
  } catch (error) {
    return handleApiError(error);
  }
}
