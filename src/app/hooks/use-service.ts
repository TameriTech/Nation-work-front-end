import { useState } from "react";
import {
  createService as apiCreate,
  updateService as apiUpdate,
  getService as apiGet,
} from "@/app/services/service.service";
import { CreateServicePayload, UpdateServicePayload } from "@/app/types/services";

export function useService() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createService = async (payload: CreateServicePayload) => {
    console.log("Creating service with payload:", payload);
    
    setLoading(true);
    setError(null);
    try {
      const response = await apiCreate(payload);
      console.log("Service created successfully:", response);
    } catch (e: any) {
      setError(e.message ?? "Creation failed");
      console.log("Error creating service:", e);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  const updateService = async (
    id: number,
    payload: UpdateServicePayload
  ) => {
    setLoading(true);
    setError(null);
    try {
      await apiUpdate(id, payload);
    } catch (e: any) {
      setError(e.message ?? "Update failed");
      throw e;
    } finally {
      setLoading(false);
    }
  };

  const deleteService = async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      await apiDelete(id);
    } catch (e: any) {
      setError(e.message ?? "Deletion failed");
      throw e;
    } finally {
      setLoading(false);
    }
  };

  const getService = async (id: number) => {
    return apiGet(id);
  };

  return {
    loading,
    error,
    createService,
    updateService,
    getService,
    deleteService,
  };
}
