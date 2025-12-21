import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { cartApi, type CartItem as BackendCartItem, type CartResponse } from '../services/cart-api';

// Frontend cart item interface (matching backend)
export interface CartItem {
    id: number;
    photoId: number;
    photoTitle: string;
    photoImageUrl: string;
    photographerName: string;
    license: 'PERSONAL' | 'COMMERCIAL' | 'EXTENDED';
    price: number;
    addedAt: string;
}

interface CartContextType {
    items: CartItem[];
    loading: boolean;
    error: string | null;
    addToCart: (photoId: number, photoTitle: string, photoImageUrl: string, photographerName: string, license: 'PERSONAL' | 'COMMERCIAL' | 'EXTENDED', price: number) => Promise<void>;
    removeFromCart: (cartItemId: number) => Promise<void>;
    clearCart: () => Promise<void>;
    getTotalPrice: () => number;
    getItemCount: () => number;
    refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
    const [items, setItems] = useState<CartItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Load cart from backend on mount
    useEffect(() => {
        // Only fetch cart if user is authenticated
        const token = localStorage.getItem('accessToken');
        if (token) {
            refreshCart();
        }
    }, []);

    const refreshCart = async () => {
        // Check if user is authenticated before making API call
        const token = localStorage.getItem('accessToken');
        if (!token) {
            setItems([]);
            return;
        }

        try {
            setLoading(true);
            setError(null);
            const cartResponse: CartResponse = await cartApi.getCart();

            // Map backend cart items to frontend format
            const mappedItems: CartItem[] = cartResponse.items.map((item: BackendCartItem) => ({
                id: item.id,
                photoId: item.photoId,
                photoTitle: item.photoTitle,
                photoImageUrl: item.photoThumbnailUrl || item.photoImageUrl,
                photographerName: item.photographerName,
                license: item.licenseType,
                price: item.price,
                addedAt: item.addedAt,
            }));

            setItems(mappedItems);
        } catch (err: any) {
            console.error('Failed to load cart:', err);
            // If user is not authenticated, just set empty cart
            if (err.response?.status === 401 || err.response?.status === 403) {
                setItems([]);
            } else {
                setError('Failed to load cart');
            }
        } finally {
            setLoading(false);
        }
    };

    const addToCart = async (
        photoId: number,
        photoTitle: string,
        photoImageUrl: string,
        photographerName: string,
        license: 'PERSONAL' | 'COMMERCIAL' | 'EXTENDED',
        price: number
    ) => {
        try {
            setLoading(true);
            setError(null);

            await cartApi.addToCart({
                photoId,
                licenseType: license,
            });

            // Refresh cart to get updated data
            await refreshCart();
        } catch (err: any) {
            console.error('Failed to add to cart:', err);
            const errorMessage = err.response?.data || 'Failed to add item to cart';
            setError(errorMessage);
            alert(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const removeFromCart = async (cartItemId: number) => {
        try {
            setLoading(true);
            setError(null);

            await cartApi.removeFromCart(cartItemId);

            // Refresh cart to get updated data
            await refreshCart();
        } catch (err: any) {
            console.error('Failed to remove from cart:', err);
            setError('Failed to remove item from cart');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const clearCart = async () => {
        try {
            setLoading(true);
            setError(null);

            await cartApi.clearCart();
            setItems([]);
        } catch (err: any) {
            console.error('Failed to clear cart:', err);
            setError('Failed to clear cart');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const getTotalPrice = () => {
        return items.reduce((total, item) => total + item.price, 0);
    };

    const getItemCount = () => {
        return items.length;
    };

    return (
        <CartContext.Provider value={{
            items,
            loading,
            error,
            addToCart,
            removeFromCart,
            clearCart,
            getTotalPrice,
            getItemCount,
            refreshCart,
        }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};
