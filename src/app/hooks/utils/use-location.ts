// hooks/location/useLocation.ts

import { useState, useEffect, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useToast } from '@/components/ui/use-toast';
import * as serviceService from '@/services/service.service';
import * as userService from '@/services/user.service';

// ==================== TYPES ====================

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface City {
  id: string;
  name: string;
  country: string;
  latitude: number;
  longitude: number;
  population?: number;
}

export interface Distance {
  km: number;
  miles: number;
  text: string;
}

// ==================== CLÉS DE QUERY ====================

export const locationKeys = {
  all: ['location'] as const,
  current: () => [...locationKeys.all, 'current'] as const,
  cities: (query: string) => [...locationKeys.all, 'cities', query] as const,
  nearby: (type: 'services' | 'freelancers', coords: Coordinates, radius: number) => 
    [...locationKeys.all, 'nearby', type, coords, radius] as const,
};

// ==================== HOOK PRINCIPAL ====================

export const useLocation = () => {
  const { toast } = useToast();
  const [currentLocation, setCurrentLocation] = useState<Coordinates | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);

  // ==================== GÉOLOCALISATION ====================

  /**
   * Obtient la position actuelle de l'utilisateur
   */
  const getUserLocation = useCallback((): Promise<Coordinates> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        const error = 'La géolocalisation n\'est pas supportée par votre navigateur';
        setLocationError(error);
        reject(error);
        return;
      }

      setIsLoadingLocation(true);
      setLocationError(null);

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          };
          setCurrentLocation(coords);
          setIsLoadingLocation(false);
          resolve(coords);
        },
        (error) => {
          let message = 'Impossible d\'obtenir votre position';
          switch (error.code) {
            case error.PERMISSION_DENIED:
              message = 'Vous avez refusé l\'accès à votre position';
              break;
            case error.POSITION_UNAVAILABLE:
              message = 'Position indisponible';
              break;
            case error.TIMEOUT:
              message = 'Délai d\'attente dépassé';
              break;
          }
          setLocationError(message);
          setIsLoadingLocation(false);
          reject(message);
          
          toast({
            title: "Erreur de localisation",
            description: message,
            variant: "destructive",
          });
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );
    });
  }, [toast]);

  // ==================== RECHERCHE DE VILLES ====================

  /**
   * Recherche des villes
   */
  const searchCities = useCallback(async (query: string): Promise<City[]> => {
    if (query.length < 2) return [];

    try {
      // Simulation d'API de villes (à remplacer par une vraie API)
      const mockCities: City[] = [
        { id: 'paris', name: 'Paris', country: 'France', latitude: 48.8566, longitude: 2.3522, population: 2148000 },
        { id: 'lyon', name: 'Lyon', country: 'France', latitude: 45.7640, longitude: 4.8357, population: 513275 },
        { id: 'marseille', name: 'Marseille', country: 'France', latitude: 43.2965, longitude: 5.3698, population: 861635 },
        { id: 'toulouse', name: 'Toulouse', country: 'France', latitude: 43.6047, longitude: 1.4442, population: 479638 },
        { id: 'nice', name: 'Nice', country: 'France', latitude: 43.7102, longitude: 7.2620, population: 342637 },
        { id: 'douala', name: 'Douala', country: 'Cameroun', latitude: 4.0511, longitude: 9.7679, population: 2768436 },
        { id: 'yaounde', name: 'Yaoundé', country: 'Cameroun', latitude: 3.8480, longitude: 11.5021, population: 2440462 },
      ];

      return mockCities.filter(city => 
        city.name.toLowerCase().includes(query.toLowerCase()) ||
        city.country.toLowerCase().includes(query.toLowerCase())
      );
    } catch (error) {
      console.error('Erreur recherche villes:', error);
      return [];
    }
  }, []);

  /**
   * Hook pour la recherche de villes avec cache
   */
  const useCitySearch = (query: string) => {
    return useQuery({
      queryKey: locationKeys.cities(query),
      queryFn: () => searchCities(query),
      enabled: query.length >= 2,
      staleTime: 60 * 60 * 1000, // 1 heure
    });
  };

  // ==================== CALCUL DE DISTANCE ====================

  /**
   * Calcule la distance entre deux points (formule de Haversine)
   */
  const getDistance = useCallback((
    point1: Coordinates,
    point2: Coordinates
  ): Distance => {
    const R = 6371; // Rayon de la Terre en km
    const dLat = (point2.latitude - point1.latitude) * Math.PI / 180;
    const dLon = (point2.longitude - point1.longitude) * Math.PI / 180;
    
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(point1.latitude * Math.PI / 180) * Math.cos(point2.latitude * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const km = R * c;
    const miles = km * 0.621371;

    return {
      km: Math.round(km * 10) / 10,
      miles: Math.round(miles * 10) / 10,
      text: km < 1 ? 'À proximité' : 
            km < 10 ? `À ${Math.round(km)} km` : 
            `À ${Math.round(km/10)*10} km`,
    };
  }, []);

  // ==================== SERVICES À PROXIMITÉ ====================

  /**
   * Récupère les services à proximité
   */
  const getNearbyServices = useCallback(async (
    coords: Coordinates,
    radius: number = 10
  ): Promise<any[]> => {
    try {
      // Utiliser l'API de recherche avec filtres de localisation
      const services = await serviceService.searchServices({
        latitude: coords.latitude,
        longitude: coords.longitude,
        radius_km: radius,
      });
      
      // Ajouter la distance à chaque service
      return services.services.map((service: any) => ({
        ...service,
        distance: getDistance(coords, {
          latitude: service.latitude || coords.latitude,
          longitude: service.longitude || coords.longitude,
        }),
      }));
    } catch (error) {
      console.error('Erreur récupération services à proximité:', error);
      return [];
    }
  }, [getDistance]);

  /**
   * Récupère les freelancers à proximité
   */
  const getNearbyFreelancers = useCallback(async (
    coords: Coordinates,
    radius: number = 10
  ): Promise<any[]> => {
    try {
      const freelancers = await userService.searchFreelancers({
        latitude: coords.latitude,
        longitude: coords.longitude,
        radius_km: radius,
      });
      
      return freelancers.map((f: any) => ({
        ...f,
        distance: getDistance(coords, {
          latitude: f.latitude || coords.latitude,
          longitude: f.longitude || coords.longitude,
        }),
      }));
    } catch (error) {
      console.error('Erreur récupération freelancers à proximité:', error);
      return [];
    }
  }, [getDistance]);

  /**
   * Hook pour les services à proximité avec cache
   */
  const useNearbyServices = (coords: Coordinates | null, radius: number = 10) => {
    return useQuery({
      queryKey: locationKeys.nearby('services', coords!, radius),
      queryFn: () => getNearbyServices(coords!, radius),
      enabled: !!coords,
      staleTime: 5 * 60 * 1000, // 5 minutes
    });
  };

  /**
   * Hook pour les freelancers à proximité avec cache
   */
  const useNearbyFreelancers = (coords: Coordinates | null, radius: number = 10) => {
    return useQuery({
      queryKey: locationKeys.nearby('freelancers', coords!, radius),
      queryFn: () => getNearbyFreelancers(coords!, radius),
      enabled: !!coords,
      staleTime: 5 * 60 * 1000,
    });
  };

  // ==================== RETOUR DU HOOK ====================

  return {
    // Position actuelle
    currentLocation,
    locationError,
    isLoadingLocation,
    getUserLocation,
    
    // Villes
    searchCities,
    useCitySearch,
    
    // Distance
    getDistance,
    
    // À proximité
    getNearbyServices,
    getNearbyFreelancers,
    useNearbyServices,
    useNearbyFreelancers,
  };
};
