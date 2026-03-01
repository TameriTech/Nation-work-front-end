// services/auth.service.ts (ou dans votre fichier existant)

import { handleResponse } from "@/app/lib/error-handler";
import { LoginCredentials } from "../types/user";


/**
 * Authenticate user
 * @returns 
 */

export async function login(data:LoginCredentials): Promise<{ message: string }> {
  try {
    const res = await fetch('/api/auth/login', {
      method: "POST",
      cache: "no-store",
      body: JSON.stringify(data)
    })

    return await handleResponse<{ message: string }>(res);
  } catch (error) {
    console.error("Erreur login:", error);
    throw error;
  }
}

/**
 * Déconnecte l'utilisateur
 */
export async function logout(): Promise<{ message: string }> {
  try {
    const res = await fetch(`/api/auth/logout`, {
      method: "POST",
      cache: "no-store",
    });

    return await handleResponse<{ message: string }>(res);
  } catch (error) {
    console.error("Erreur logout:", error);
    throw error;
  }
}

/**
 * Vérifie le rôle de l'utilisateur connecté
 */
export async function verifyRole(): Promise<{ role: string }> {
  try {
    const res = await fetch(`/api/auth/verify-role`, {
      method: "GET",
      cache: "no-store",
    });

    return await handleResponse<{ role: string }>(res);
  } catch (error) {
    console.error("Erreur verifyRole:", error);
    throw error;
  }
}

/**
 * Vérifie si l'utilisateur a un rôle spécifique
 */
export async function hasRole(requiredRole: string | string[]): Promise<boolean> {
  try {
    const { role } = await verifyRole();
    
    if (Array.isArray(requiredRole)) {
      return requiredRole.includes(role);
    }
    
    return role === requiredRole;
  } catch (error) {
    console.error("Erreur hasRole:", error);
    return false;
  }
}

/**
 * Récupère les permissions de l'utilisateur
 */
export async function getUserPermissions(): Promise<string[]> {
  try {
    const res = await fetch(`/api/auth/permissions`, {
      method: "GET",
      cache: "no-store",
    });

    return await handleResponse<string[]>(res);
  } catch (error) {
    console.error("Erreur getUserPermissions:", error);
    throw error;
  }
}

/**
 * Vérifie si l'utilisateur a une permission spécifique
 */
export async function hasPermission(permission: string): Promise<boolean> {
  try {
    const permissions = await getUserPermissions();
    return permissions.includes(permission);
  } catch (error) {
    console.error("Erreur hasPermission:", error);
    return false;
  }
}

/**
 * Rafraîchit le token d'authentification
 */
export async function refreshToken(): Promise<{ access_token: string }> {
  try {
    const res = await fetch(`/api/auth/refresh`, {
      method: "POST",
      cache: "no-store",
    });

    return await handleResponse<{ access_token: string }>(res);
  } catch (error) {
    console.error("Erreur refreshToken:", error);
    throw error;
  }
}
