import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formate une date en français avec différentes options
 * @param dateString - La date à formater (string ISO ou timestamp)
 * @param options - Options de formatage
 * @returns La date formatée
 */
export const formatDate = (
  dateString: string | number | Date,
  options?: {
    style?: 'relative' | 'short' | 'long' | 'full' | 'custom';
    includeTime?: boolean;
    customFormat?: Intl.DateTimeFormatOptions;
    relativeThreshold?: number; // Seuil en jours pour le format relatif (défaut: 30)
  }
): string => {
  const {
    style = 'relative',
    includeTime = false,
    customFormat,
    relativeThreshold = 30
  } = options || {};

  const date = new Date(dateString);
  const now = new Date();
  
  // Vérifier si la date est valide
  if (isNaN(date.getTime())) {
    console.error('Invalid date:', dateString);
    return 'Date invalide';
  }

  // Style personnalisé
  if (style === 'custom' && customFormat) {
    return date.toLocaleDateString('fr-FR', customFormat);
  }

  // Style complet avec heure
  if (style === 'full') {
    return date.toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      ...(includeTime && {
        hour: '2-digit',
        minute: '2-digit'
      })
    });
  }

  // Style court (JJ/MM/AAAA)
  if (style === 'short') {
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      ...(includeTime && {
        hour: '2-digit',
        minute: '2-digit'
      })
    });
  }

  // Style long (JJ Mois AAAA)
  if (style === 'long') {
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      ...(includeTime && {
        hour: '2-digit',
        minute: '2-digit'
      })
    });
  }

  // Style relatif (par défaut)
  const diffMs = now.getTime() - date.getTime();
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);
  const diffWeeks = Math.floor(diffDays / 7);
  const diffMonths = Math.floor(diffDays / 30);
  const diffYears = Math.floor(diffDays / 365);

  // Futur ou passé
  const isFuture = diffMs < 0;
  const absDiffDays = Math.abs(diffDays);

  // Ne pas dépasser le seuil relatif
  if (absDiffDays > relativeThreshold) {
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  }

  // Formatage relatif
  if (absDiffDays === 0) {
    if (diffHours === 0) {
      if (diffMinutes === 0) {
        return isFuture ? 'À l\'instant' : 'À l\'instant';
      }
      return isFuture 
        ? `Dans ${diffMinutes} minute${diffMinutes > 1 ? 's' : ''}`
        : `Il y a ${Math.abs(diffMinutes)} minute${Math.abs(diffMinutes) > 1 ? 's' : ''}`;
    }
    if (absDiffDays === 0 && diffHours < 24) {
      return isFuture
        ? `Dans ${Math.abs(diffHours)} heure${Math.abs(diffHours) > 1 ? 's' : ''}`
        : `Il y a ${diffHours} heure${diffHours > 1 ? 's' : ''}`;
    }
    return isFuture ? 'Aujourd\'hui' : 'Aujourd\'hui';
  }

  if (absDiffDays === 1) {
    return isFuture ? 'Demain' : 'Hier';
  }

  if (absDiffDays < 7) {
    return isFuture
      ? `Dans ${absDiffDays} jours`
      : `Il y a ${absDiffDays} jours`;
  }

  if (absDiffDays < 30) {
    if (diffWeeks === 1) {
      return isFuture ? 'Dans 1 semaine' : 'Il y a 1 semaine';
    }
    return isFuture
      ? `Dans ${diffWeeks} semaines`
      : `Il y a ${diffWeeks} semaines`;
  }

  if (absDiffDays < 365) {
    if (diffMonths === 1) {
      return isFuture ? 'Dans 1 mois' : 'Il y a 1 mois';
    }
    return isFuture
      ? `Dans ${diffMonths} mois`
      : `Il y a ${diffMonths} mois`;
  }

  if (diffYears === 1) {
    return isFuture ? 'Dans 1 an' : 'Il y a 1 an';
  }

  return isFuture
    ? `Dans ${diffYears} ans`
    : `Il y a ${diffYears} ans`;
};

// Fonctions utilitaires additionnelles
export const dateUtils = {
  /**
   * Formate une date en français standard
   */
  standard: (date: string | number | Date) => {
    return formatDate(date, { style: 'short' });
  },

  /**
   * Formate une date avec le mois en toutes lettres
   */
  long: (date: string | number | Date) => {
    return formatDate(date, { style: 'long' });
  },

  /**
   * Formate une date complète avec jour de la semaine
   */
  full: (date: string | number | Date, includeTime = false) => {
    return formatDate(date, { style: 'full', includeTime });
  },

  /**
   * Formate une date de façon relative (il y a X jours, etc.)
   */
  relative: (date: string | number | Date, threshold = 30) => {
    return formatDate(date, { style: 'relative', relativeThreshold: threshold });
  },

  /**
   * Formate une date avec heure
   */
  withTime: (date: string | number | Date) => {
    return formatDate(date, { style: 'short', includeTime: true });
  },

  /**
   * Retourne l'âge à partir d'une date de naissance
   */
  getAge: (birthDate: string | number | Date): number => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
  },

  /**
   * Vérifie si une date est aujourd'hui
   */
  isToday: (date: string | number | Date): boolean => {
    const d = new Date(date);
    const today = new Date();
    return d.toDateString() === today.toDateString();
  },

  /**
   * Vérifie si une date est dans le futur
   */
  isFuture: (date: string | number | Date): boolean => {
    return new Date(date).getTime() > Date.now();
  },

  /**
   * Vérifie si une date est dans le passé
   */
  isPast: (date: string | number | Date): boolean => {
    return new Date(date).getTime() < Date.now();
  },

  /**
   * Retourne le nombre de jours entre deux dates
   */
  daysBetween: (date1: string | number | Date, date2: string | number | Date): number => {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    const diffTime = Math.abs(d2.getTime() - d1.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }
};
