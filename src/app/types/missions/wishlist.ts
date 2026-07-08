// src/app/types/services/wishlist.ts
import { Service } from './service';

export interface WishlistItem {
  id: number;
  serviceId: number;
  service: Service;
  createdAt: string;
}

export interface WishlistCheckResponse {
  inWishlist: boolean;
}

export interface AddToWishlistResponse {
  message: string;
}

export interface RemoveFromWishlistResponse {
  message: string;
}
