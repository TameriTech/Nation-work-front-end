import { 
  GeneralSettings, 
  FeeSettings, 
  TimingSettings, 
  ThresholdSettings, 
  AdminUser,
  ActivityLog, 
  PaginatedResponse
} from '../types/admin';

/**
 * Récupère les paramètres généraux
 */
export async function getGeneralSettings(): Promise<GeneralSettings> {
  try {
    const res = await fetch('/api/admin/settings/general', {
      method: 'GET',
      cache: 'no-store',
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || 'Erreur lors du chargement des paramètres');
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error('Erreur getGeneralSettings:', error);
    throw error;
  }
}

/**
 * Met à jour les paramètres généraux
 */
export async function updateGeneralSettings(settings: Partial<GeneralSettings>): Promise<GeneralSettings> {
  try {
    const res = await fetch('/api/admin/settings/general', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(settings),
    });

    const responseData = await res.json();

    if (!res.ok) {
      throw {
        message: responseData.message || 'Erreur lors de la mise à jour',
        field: responseData.field,
      };
    }

    return responseData;
  } catch (error) {
    console.error('Erreur updateGeneralSettings:', error);
    throw error;
  }
}

/**
 * Récupère les paramètres des frais
 */
export async function getFeeSettings(): Promise<FeeSettings> {
  try {
    const res = await fetch('/api/admin/settings/fees', {
      method: 'GET',
      cache: 'no-store',
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || 'Erreur lors du chargement des frais');
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error('Erreur getFeeSettings:', error);
    throw error;
  }
}

/**
 * Met à jour les paramètres des frais
 */
export async function updateFeeSettings(settings: Partial<FeeSettings>): Promise<FeeSettings> {
  try {
    const res = await fetch('/api/admin/settings/fees', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(settings),
    });

    const responseData = await res.json();

    if (!res.ok) {
      throw {
        message: responseData.message || 'Erreur lors de la mise à jour',
        field: responseData.field,
      };
    }

    return responseData;
  } catch (error) {
    console.error('Erreur updateFeeSettings:', error);
    throw error;
  }
}

/**
 * Récupère les paramètres des délais
 */
export async function getTimingSettings(): Promise<TimingSettings> {
  try {
    const res = await fetch('/api/admin/settings/timings', {
      method: 'GET',
      cache: 'no-store',
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || 'Erreur lors du chargement des délais');
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error('Erreur getTimingSettings:', error);
    throw error;
  }
}

/**
 * Met à jour les paramètres des délais
 */
export async function updateTimingSettings(settings: Partial<TimingSettings>): Promise<TimingSettings> {
  try {
    const res = await fetch('/api/admin/settings/timings', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(settings),
    });

    const responseData = await res.json();

    if (!res.ok) {
      throw {
        message: responseData.message || 'Erreur lors de la mise à jour',
      };
    }

    return responseData;
  } catch (error) {
    console.error('Erreur updateTimingSettings:', error);
    throw error;
  }
}

/**
 * Récupère les seuils
 */
export async function getThresholdSettings(): Promise<ThresholdSettings> {
  try {
    const res = await fetch('/api/admin/settings/thresholds', {
      method: 'GET',
      cache: 'no-store',
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || 'Erreur lors du chargement des seuils');
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error('Erreur getThresholdSettings:', error);
    throw error;
  }
}

/**
 * Met à jour les seuils
 */
export async function updateThresholdSettings(settings: Partial<ThresholdSettings>): Promise<ThresholdSettings> {
  try {
    const res = await fetch('/api/admin/settings/thresholds', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(settings),
    });

    const responseData = await res.json();

    if (!res.ok) {
      throw {
        message: responseData.message || 'Erreur lors de la mise à jour',
      };
    }

    return responseData;
  } catch (error) {
    console.error('Erreur updateThresholdSettings:', error);
    throw error;
  }
}

/**
 * Récupère la liste des administrateurs
 */
export async function getAdmins(): Promise<AdminUser[]> {
  try {
    const res = await fetch('/api/admin/settings/admins', {
      method: 'GET',
      cache: 'no-store',
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || 'Erreur lors du chargement des administrateurs');
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error('Erreur getAdmins:', error);
    throw error;
  }
}

/**
 * Ajouter un administrateur
 */
export async function addAdmin(data: {
  name: string;
  email: string;
  role: string;
  permissions?: string[];
}): Promise<AdminUser> {
  try {
    const res = await fetch('/api/admin/settings/admins', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const responseData = await res.json();

    if (!res.ok) {
      throw {
        message: responseData.message || 'Erreur lors de l\'ajout',
        field: responseData.field,
      };
    }

    return responseData;
  } catch (error) {
    console.error('Erreur addAdmin:', error);
    throw error;
  }
}

/**
 * Modifier un administrateur
 */
export async function updateAdmin(
  adminId: number,
  data: Partial<AdminUser>
): Promise<AdminUser> {
  try {
    const res = await fetch(`/api/admin/settings/admins/${adminId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const responseData = await res.json();

    if (!res.ok) {
      throw {
        message: responseData.message || 'Erreur lors de la modification',
      };
    }

    return responseData;
  } catch (error) {
    console.error(`Erreur updateAdmin ${adminId}:`, error);
    throw error;
  }
}

/**
 * Supprimer un administrateur
 */
export async function deleteAdmin(adminId: number): Promise<{ message: string }> {
  try {
    const res = await fetch(`/api/admin/settings/admins/${adminId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const responseData = await res.json();

    if (!res.ok) {
      throw {
        message: responseData.message || 'Erreur lors de la suppression',
      };
    }

    return responseData;
  } catch (error) {
    console.error(`Erreur deleteAdmin ${adminId}:`, error);
    throw error;
  }
}

/**
 * Récupère les logs d'activité
 */
export async function getActivityLogs(filters?: {
  admin_id?: number;
  action?: string;
  date_from?: string;
  date_to?: string;
  page?: number;
  per_page?: number;
}): Promise<PaginatedResponse<ActivityLog>> {
  try {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, String(value));
        }
      });
    }

    const res = await fetch(`/api/admin/settings/logs?${params.toString()}`, {
      method: 'GET',
      cache: 'no-store',
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || 'Erreur lors du chargement des logs');
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error('Erreur getActivityLogs:', error);
    throw error;
  }
}

/**
 * Activer/désactiver le mode maintenance
 */
export async function toggleMaintenanceMode(enable: boolean): Promise<{ message: string }> {
  try {
    const res = await fetch('/api/admin/settings/maintenance', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ enabled: enable }),
    });

    const responseData = await res.json();

    if (!res.ok) {
      throw {
        message: responseData.message || 'Erreur lors du changement de mode',
      };
    }

    return responseData;
  } catch (error) {
    console.error('Erreur toggleMaintenanceMode:', error);
    throw error;
  }
}

/**
 * Récupère les templates d'email
 */
export async function getEmailTemplates(): Promise<any[]> {
  try {
    const res = await fetch('/api/admin/settings/email-templates', {
      method: 'GET',
      cache: 'no-store',
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || 'Erreur lors du chargement des templates');
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error('Erreur getEmailTemplates:', error);
    throw error;
  }
}

/**
 * Modifier un template d'email
 */
export async function updateEmailTemplate(
  templateId: string,
  data: {
    subject: string;
    body: string;
    variables?: string[];
  }
): Promise<any> {
  try {
    const res = await fetch(`/api/admin/settings/email-templates/${templateId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const responseData = await res.json();

    if (!res.ok) {
      throw {
        message: responseData.message || 'Erreur lors de la mise à jour',
      };
    }

    return responseData;
  } catch (error) {
    console.error(`Erreur updateEmailTemplate ${templateId}:`, error);
    throw error;
  }
}

/**
 * Tester un template d'email
 */
export async function testEmailTemplate(
  templateId: string,
  testEmail: string
): Promise<{ message: string }> {
  try {
    const res = await fetch(`/api/admin/settings/email-templates/${templateId}/test`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ test_email: testEmail }),
    });

    const responseData = await res.json();

    if (!res.ok) {
      throw {
        message: responseData.message || 'Erreur lors de l\'envoi du test',
      };
    }

    return responseData;
  } catch (error) {
    console.error(`Erreur testEmailTemplate ${templateId}:`, error);
    throw error;
  }
}