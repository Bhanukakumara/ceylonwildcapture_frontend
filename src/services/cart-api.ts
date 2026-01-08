import apiClient from './api';

export interface CartItem {
    id: number;
    photoId: number;
    photoTitle: string;
    photoImageUrl: string;
    photoThumbnailUrl: string;
    photographerName: string;
    photographerId: number;
    price: number;
    addedAt: string;
}

export interface CartResponse {
    items: CartItem[];
    itemCount: number;
    subtotal: number;
    tax: number;
    total: number;
}

export interface AddToCartRequest {
    photoId: number;
}

export const cartApi = {
    /**
     * Get user's cart
     */
    getCart: async (): Promise<CartResponse> => {
        const response = await apiClient.get<CartResponse>('/cart');
        return response.data;
    },

    /**
     * Add item to cart
     */
    addToCart: async (request: AddToCartRequest): Promise<CartItem> => {
        const response = await apiClient.post<CartItem>('/cart/items', request);
        return response.data;
    },

    /**
     * Remove item from cart
     */
    removeFromCart: async (cartItemId: number): Promise<void> => {
        await apiClient.delete(`/cart/items/${cartItemId}`);
    },


    /**
     * Get cart item count
     */
    getCartItemCount: async (): Promise<number> => {
        const response = await apiClient.get<number>('/cart/count');
        return response.data;
    },

    /**
     * Clear cart
     */
    clearCart: async (): Promise<void> => {
        await apiClient.delete('/cart');
    },

    /**
     * Check if photo is in cart
     */
    isPhotoInCart: async (photoId: number): Promise<boolean> => {
        const response = await apiClient.get<boolean>(`/cart/check/${photoId}`);
        return response.data;
    },

    /**
     * Get cart summary
     */
    getCartSummary: async (): Promise<CartResponse> => {
        const response = await apiClient.get<CartResponse>('/cart/summary');
        return response.data;
    },

    /**
     * Refresh cart prices
     */
    refreshCartPrices: async (): Promise<CartResponse> => {
        const response = await apiClient.post<CartResponse>('/cart/refresh-prices');
        return response.data;
    },
};
