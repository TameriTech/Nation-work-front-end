import { handleResponse } from "../lib/error-handler";
import { Dispute, GetDataResponse } from "../types";


/**
 * Get user disputes
 */
export async function getUserDisputes(userId: string): Promise<GetDataResponse<Dispute[]>> {
  try {
    const res = await fetch(`api/admin/users/${userId}/disputes`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    return await handleResponse<GetDataResponse<Dispute[]>>(res);
  } catch (error) {
    console.error('Erreur getUserDisputes:', error);
    throw error;
  }
}