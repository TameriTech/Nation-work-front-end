import { Service } from "./service";

// ============================================================================
// TYPES POUR LA WISHLIST
// ============================================================================

export interface WishlistItem {
  id: number;
  service_id: number;
  service: Service;
  created_at: string;
}
