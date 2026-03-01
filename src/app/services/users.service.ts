// services/userService.ts
import { handleResponse } from '@/app/lib/error-handler';
import {
  User,
  FreelancerFullProfile,
  UpdateFreelancerProfileDto,
  CreateExperienceDto,
  Education,
  Skill,
  FreelancerSkill,
  Review,
  CreateReviewDto,
  AuthResponse,
  LoginCredentials,
  SignUpData,
  ProfessionalExperience,
  CreateEducationDto,
  UpdateFreelancerProfileData,
  DocumentDisplay,
  KYCStatus,
  CreateDocumentDto,
  UpdateExperienceDto,
  UpdateEducationDto
} from '@/app/types/user';

// ==================== AUTHENTIFICATION ====================

/**
 * Inscription d'un nouvel utilisateur
 */
export async function signUp(userData: SignUpData): Promise<User> {
  try {
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    return await handleResponse<User>(res);
  } catch (error) {
    console.error("Erreur signUp:", error);
    throw error;
  }
}

/**
 * Connexion utilisateur
 */
export async function login(credentials: LoginCredentials): Promise<AuthResponse> {
  try {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    return await handleResponse<AuthResponse>(res);
  } catch (error) {
    console.error("Erreur login:", error);
    throw error;
  }
}

/**
 * Récupérer l'utilisateur connecté
 */
export async function getCurrentUser(): Promise<User | null> {
  try {
    const res = await fetch("/api/users/auth/me", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    });

    if (res.status === 401) {
      return null; // ← Important : ne pas throw
    }

    return await handleResponse<User>(res);
  } catch (error) {
    console.error("Erreur getCurrentUser:", error);
    return null; // ← Important : ne pas throw
  }
}

export async function uploadAvatar(file: File): Promise<User>{
  try {
    const res = await fetch("/api/auth/logout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    return await handleResponse<User>(res);
  } catch (error) {
    console.error("Erreur logout:", error);
    throw error;
  }
}

/**
 * Déconnexion
 */
export async function logout(): Promise<{ message: string }> {
  try {
    const res = await fetch("/api/auth/logout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    return await handleResponse<{ message: string }>(res);
  } catch (error) {
    console.error("Erreur logout:", error);
    throw error;
  }
}

export async function changePassword(data: {
    current_password: string;
    new_password: string;
}): Promise<string>{
  try {
    const res = await fetch("/api/auth/update_password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    return await handleResponse<string>(res);
  } catch (error) {
    console.error("Erreur login:", error);
    throw error;
  }
}

// ==================== FREELANCER ====================

/**
 * Récupérer son propre profil freelancer
 */
export async function getMyFreelancerProfile(): Promise<FreelancerFullProfile> {
  try {
    const res = await fetch("/api/users/freelancer/profile", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    return await handleResponse<FreelancerFullProfile>(res);
  } catch (error) {
    console.error("Erreur getMyFreelancerProfile:", error);
    throw error;
  }
}

/**
 * Mettre à jour son profil freelancer
 */
export async function updateMyFreelancerProfile(data: UpdateFreelancerProfileData): Promise<FreelancerFullProfile> {
  try {
    const res = await fetch("/api/users/freelancer/profile", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    return await handleResponse<FreelancerFullProfile>(res);
  } catch (error) {
    console.error("Erreur updateMyFreelancerProfile:", error);
    throw error;
  }
}

/**
 * Supprimer son compte
 */
export async function deleteMyAccount(password: string): Promise<void> {
  try {
    const res = await fetch(`/api/users/freelancer/account?password=${encodeURIComponent(password)}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    return await handleResponse<void>(res);
  } catch (error) {
    console.error("Erreur deleteMyAccount:", error);
    throw error;
  }
}

// ==================== DOCUMENTS ====================

/**
 * Récupérer les documents du freelancer connecté
 */
export async function getMyDocuments(): Promise<DocumentDisplay[]> {
  try {
    const res = await fetch("/api/users/freelancer/documents", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    return await handleResponse<DocumentDisplay[]>(res);
  } catch (error) {
    console.error("Erreur getMyDocuments:", error);
    throw error;
  }
}

/**
 * Récupérer le statut KYC du freelancer connecté
 */
export async function getKYCStatus(): Promise<KYCStatus> {
  try {
    const res = await fetch("/api/users/freelancer/kyc-status", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    return await handleResponse<KYCStatus>(res);
  } catch (error) {
    console.error("Erreur getKYCStatus:", error);
    throw error;
  }
}

/**
 * Récupérer l'URL d'un document pour le téléchargement
 */
export async function getDocumentUrl(documentId: number): Promise<string> {
  try {
    const res = await fetch(`/api/users/freelancer/documents/${documentId}/url`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await handleResponse<{ url: string }>(res);
    return data.url;
  } catch (error) {
    console.error("Erreur getDocumentUrl:", error);
    throw error;
  }
}

/**
 * Soumettre un nouveau document pour vérification KYC
 */
export async function uploadDocument(document: CreateDocumentDto): Promise<DocumentDisplay> {
  try {
    const formData = new FormData();
    formData.append('document_type', document.document_type);
    formData.append('file', document.file);
    if (document.document_number) formData.append('document_number', document.document_number);
    if (document.issue_date) formData.append('issue_date', document.issue_date);
    if (document.expiry_date) formData.append('expiry_date', document.expiry_date);
    if (document.issuing_country) formData.append('issuing_country', document.issuing_country);

    const res = await fetch("/api/users/freelancer/documents", {
      method: "POST",
      body: formData,
      // Ne PAS mettre Content-Type - le navigateur le gère automatiquement
    });

    return await handleResponse<DocumentDisplay>(res);
  } catch (error) {
    console.error("Erreur uploadDocument:", error);
    throw error;
  }
}

/**
 * Resoumettre un document précédemment rejeté
 */
export async function resubmitDocument(documentId: number, file: File): Promise<DocumentDisplay> {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch(`/api/users/freelancer/documents/${documentId}/resubmit`, {
      method: "POST",
      body: formData,
    });

    return await handleResponse<DocumentDisplay>(res);
  } catch (error) {
    console.error("Erreur resubmitDocument:", error);
    throw error;
  }
}

/**
 * Supprimer un document
 */
export async function deleteDocument(documentId: number): Promise<{ message: string }> {
  try {
    const res = await fetch(`/api/users/freelancer/documents/${documentId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    return await handleResponse<{ message: string }>(res);
  } catch (error) {
    console.error("Erreur deleteDocument:", error);
    throw error;
  }
}

// ==================== EXPÉRIENCES ====================

/**
 * Lister les experiences d'un freelancer
 */
export async function getExperiences(): Promise<ProfessionalExperience[]> {
  try {    const res = await fetch("/api/users/freelancer/experiences", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    return await handleResponse<ProfessionalExperience[]>(res);
  } catch (error) {
    console.error("Erreur getMyExperiences:", error);
    throw error;
  }
}

/**
 * Ajouter une expérience
 */
export async function addExperience(data: CreateExperienceDto): Promise<ProfessionalExperience> {
  try {
    const res = await fetch("/api/users/freelancer/experiences", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    return await handleResponse<ProfessionalExperience>(res);
  } catch (error) {
    console.error("Erreur addExperience:", error);
    throw error;
  }
}

/**
 * Modifier une expérience
 */
export async function updateExperience(id: number, data: UpdateExperienceDto): Promise<ProfessionalExperience> {
  try {
    const res = await fetch(`/api/users/freelancer/experiences/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    return await handleResponse<ProfessionalExperience>(res);
  } catch (error) {
    console.error("Erreur updateExperience:", error);
    throw error;
  }
}

/**
 * Supprimer une expérience
 */
export async function deleteExperience(id: number): Promise<{ message: string }> {
  try {
    const res = await fetch(`/api/users/freelancer/experiences/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    return await handleResponse<{ message: string }>(res);
  } catch (error) {
    console.error("Erreur deleteExperience:", error);
    throw error;
  }
}

// ==================== FORMATIONS ====================
/**
 * Lister les formations d'un freelancer
 */
export async function getEducation(): Promise<Education[]> {
  try {
    const res = await fetch("/api/users/freelancer/education", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    return await handleResponse<Education[]>(res);
  } catch (error) {
    console.error("Erreur getEducation:", error);
    throw error;
  }
}

/**
 * Ajouter une formation
 */
export async function addEducation(data: CreateEducationDto): Promise<Education> {
  try {
    const res = await fetch("/api/users/freelancer/education", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    return await handleResponse<Education>(res);
  } catch (error) {
    console.error("Erreur addEducation:", error);
    throw error;
  }
}

/**
 * Modifier une formation
 */
export async function updateEducation(id: number, data: UpdateEducationDto): Promise<Education> {
  try {
    const res = await fetch(`/api/users/freelancer/education/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    return await handleResponse<Education>(res);
  } catch (error) {
    console.error("Erreur updateEducation:", error);
    throw error;
  }
}

/**
 * Supprimer une formation
 */
export async function deleteEducation(id: number): Promise<{ message: string }> {
  try {
    const res = await fetch(`/api/users/freelancer/education/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    return await handleResponse<{ message: string }>(res);
  } catch (error) {
    console.error("Erreur deleteEducation:", error);
    throw error;
  }
}

// ==================== COMPÉTENCES ====================

/**
 * Récupérer toutes les compétences disponibles
 */
export async function getAllSkills(category?: string): Promise<Skill[]> {
  try {
    const url = category 
      ? `/api/users/skills?category=${encodeURIComponent(category)}`
      : "/api/users/skills";
    
    const res = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    return await handleResponse<Skill[]>(res);
  } catch (error) {
    console.error("Erreur getAllSkills:", error);
    throw error;
  }
}

/**
 * Récupérer les compétences d'un freelancer
 */
export async function getMySkills(): Promise<FreelancerSkill[]> {
  try {
    const res = await fetch("/api/users/freelancer/skills", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    return await handleResponse<FreelancerSkill[]>(res);
  } catch (error) {
    console.error("Erreur getMySkills:", error);
    throw error;
  }
}

/**
 * Ajouter une compétence
 */
export async function addSkill(skillId: number, skillType: string = 'primary', proficiency: number = 3): Promise<{ message: string; id: number }> {
  try {
    const params = new URLSearchParams({
      skill_id: skillId.toString(),
      skill_type: skillType,
      proficiency: proficiency.toString()
    });
    
    const res = await fetch(`/api/users/freelancer/skills?${params}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    return await handleResponse<{ message: string; id: number }>(res);
  } catch (error) {
    console.error("Erreur addSkill:", error);
    throw error;
  }
}

/**
 * Modifier une compétence
 */
export async function updateSkill(skillId: number, skillType?: string, proficiency?: number): Promise<{ message: string }> {
  try {
    const params = new URLSearchParams();
    if (skillType) params.append('skill_type', skillType);
    if (proficiency) params.append('proficiency', proficiency.toString());
    
    const res = await fetch(`/api/users/freelancer/skills/${skillId}?${params}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
    });

    return await handleResponse<{ message: string }>(res);
  } catch (error) {
    console.error("Erreur updateSkill:", error);
    throw error;
  }
}

/**
 * Supprimer une compétence
 */
export async function removeSkill(skillId: number): Promise<{ message: string }> {
  try {
    const res = await fetch(`/api/users/freelancer/skills/${skillId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    return await handleResponse<{ message: string }>(res);
  } catch (error) {
    console.error("Erreur removeSkill:", error);
    throw error;
  }
}

// ==================== CLIENT ====================

/**
 * Voir le profil public d'un freelancer
 */
export async function getFreelancerPublicProfile(freelancerId: number): Promise<FreelancerFullProfile> {
  try {
    const res = await fetch(`/api/users/client/freelancer/${freelancerId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    return await handleResponse<FreelancerFullProfile>(res);
  } catch (error) {
    console.error("Erreur getFreelancerPublicProfile:", error);
    throw error;
  }
}

/**
 * Rechercher des freelancers
 */
export async function searchFreelancers(params: {
  skill?: string;
  city?: string;
  minRating?: number;
  maxHourlyRate?: number;
  isAvailable?: boolean;
  skip?: number;
  limit?: number;
}): Promise<FreelancerFullProfile[]> {
  try {
    const queryParams = new URLSearchParams();
    if (params.skill) queryParams.append('skill', params.skill);
    if (params.city) queryParams.append('city', params.city);
    if (params.minRating) queryParams.append('min_rating', params.minRating.toString());
    if (params.maxHourlyRate) queryParams.append('max_hourly_rate', params.maxHourlyRate.toString());
    if (params.isAvailable !== undefined) queryParams.append('is_available', params.isAvailable.toString());
    if (params.skip) queryParams.append('skip', params.skip.toString());
    if (params.limit) queryParams.append('limit', params.limit.toString());
    
    const res = await fetch(`/api/users/client/freelancers/search?${queryParams}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    return await handleResponse<FreelancerFullProfile[]>(res);
  } catch (error) {
    console.error("Erreur searchFreelancers:", error);
    throw error;
  }
}

// ==================== ÉVALUATIONS ====================

/**
 * Créer une évaluation
 */
export async function createReview(data: CreateReviewDto): Promise<Review> {
  try {
    const res = await fetch("/api/users/reviews", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    return await handleResponse<Review>(res);
  } catch (error) {
    console.error("Erreur createReview:", error);
    throw error;
  }
}

/**
 * Récupérer les évaluations d'un freelancer
 */
export async function getFreelancerReviews(freelancerId: number, skip: number = 0, limit: number = 20): Promise<Review[]> {
  try {
    const res = await fetch(`/api/users/reviews/freelancer/${freelancerId}?skip=${skip}&limit=${limit}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    return await handleResponse<Review[]>(res);
  } catch (error) {
    console.error("Erreur getFreelancerReviews:", error);
    throw error;
  }
}

/**
 * Répondre à une évaluation
 */
export async function respondToReview(reviewId: number, response: string): Promise<{ message: string }> {
  try {
    const res = await fetch(`/api/users/reviews/${reviewId}/respond?response=${encodeURIComponent(response)}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    return await handleResponse<{ message: string }>(res);
  } catch (error) {
    console.error("Erreur respondToReview:", error);
    throw error;
  }
}

/**
 * Marquer une évaluation comme utile
 */
export async function markReviewHelpful(reviewId: number): Promise<{ message: string }> {
  try {
    const res = await fetch(`/api/users/reviews/${reviewId}/helpful`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    return await handleResponse<{ message: string }>(res);
  } catch (error) {
    console.error("Erreur markReviewHelpful:", error);
    throw error;
  }
}

// ==================== ADMIN ====================

/**
 * Créer un utilisateur (admin)
 */
export async function adminCreateUser(userData: any): Promise<User> {
  try {
    const res = await fetch("/api/users/admin/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    return await handleResponse<User>(res);
  } catch (error) {
    console.error("Erreur adminCreateUser:", error);
    throw error;
  }
}

/**
 * Bloquer/débloquer un utilisateur (admin)
 */
export async function blockUser(userId: number, isActive: boolean, reason?: string): Promise<User> {
  try {
    const res = await fetch(`/api/users/admin/users/${userId}/block`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ is_active: isActive, reason }),
    });

    return await handleResponse<User>(res);
  } catch (error) {
    console.error("Erreur blockUser:", error);
    throw error;
  }
}

/**
 * Changer le rôle d'un utilisateur (super admin)
 */
export async function changeUserRole(userId: number, role: string): Promise<User> {
  try {
    const res = await fetch(`/api/users/admin/users/${userId}/role`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ role }),
    });

    return await handleResponse<User>(res);
  } catch (error) {
    console.error("Erreur changeUserRole:", error);
    throw error;
  }
}

/**
 * Récupérer tous les utilisateurs (admin)
 */
export async function getAllUsers(params?: {
  role?: string;
  is_active?: boolean;
  skip?: number;
  limit?: number;
}): Promise<User[]> {
  try {
    const queryParams = new URLSearchParams();
    if (params?.role) queryParams.append('role', params.role);
    if (params?.is_active !== undefined) queryParams.append('is_active', params.is_active.toString());
    if (params?.skip) queryParams.append('skip', params.skip.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    
    const url = queryParams.toString() 
      ? `/api/users/admin/users?${queryParams}`
      : "/api/users/admin/users";
    
    const res = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    return await handleResponse<User[]>(res);
  } catch (error) {
    console.error("Erreur getAllUsers:", error);
    throw error;
  }
}



export async function getUserById(userId: number):Promise<User>{
  try {
    const res = await fetch(`/api/admin/users/${userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    return await handleResponse<User>(res);
  } catch (error) {
    console.error("Erreur getCurrentUser:", error);
    throw error;
  }
}

export async function updateUser(userId: number, data: any): Promise<User>{
  try {
    const res = await fetch(`/api/admin/users/${userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    return await handleResponse<User>(res);
  } catch (error) {
    console.error("Erreur getCurrentUser:", error);
    throw error;
  }
}

export async function getUserStats(userId: number): Promise<any>{

}

export async function getUserHistory(userId: number, filters: any): Promise<any>{
  
}
