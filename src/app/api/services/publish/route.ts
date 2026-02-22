import { NextResponse } from "next/server";
import { apiClient } from "@/app/lib/api-client";
import { cookies } from "next/headers";

//const token = (await cookies()).get('access_token')?.value || null;
// Dans votre route API
export async function POST(request: Request) {
  try {
    const token = (await cookies()).get('access_token')?.value || null;
    const formData = await request.json(); // ← formData est déjà un objet
    
    // Modèle attendu par le backend
    const modelFields = [
      "title", "service_type", "category_id", "short_description", 
      "full_description", "date_pratique", "start_time", "duration",
      "address", "quarter", "city", "postal_code", "country",
      "latitude", "longitude", "proposed_amount", "accepted_amount",
      "required_skills"
    ];
    
    // Filtrer les données
    const cleanData:any = {};
    modelFields.forEach(field => {
      if (formData.hasOwnProperty(field)) {
        cleanData[field] = formData[field];
      }
    });
    
    console.log("Sending to backend:", cleanData); // ← Ne pas stringifier ici
    
    // Envoyer au backend - L'APIClient va stringifier
    const response = await apiClient("/services/publish", {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(cleanData) // ← Envoyer l'objet, PAS stringifié !
    });
    
    return NextResponse.json(response);
  } catch (error) {
    console.error("Full error object:", JSON.stringify(error, null, 2));
    return NextResponse.json(
      { error: "Failed to publish service" },
      { status: 500 }
    );
  }
}
