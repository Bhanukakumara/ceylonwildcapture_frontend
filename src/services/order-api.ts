import apiClient from './api';

export interface BillingInfo {
    billingName: string;
    billingEmail: string;
    billingAddress: string;
    billingCity: string;
    billingState: string;
    billingCountry: string;
    billingZip: string;
}

export interface OrderItemRequest {
    photoId: number;
    licenseType: 'PERSONAL' | 'COMMERCIAL' | 'EDITORIAL' | 'EXTENDED';
    price: number;
}

export interface CreateOrderRequest {
    items: OrderItemRequest[];
    billingInfo: BillingInfo;
    couponCode?: string;
}

export interface OrderItem {
    id: number;
    photo: {
        id: number;
        title: string;
        imageUrl: string;
    };
    licenseType: string;
    price: number;
}

export interface OrderResponse {
    id: number;
    orderNumber: string;
    buyerId: number;
    totalAmount: number;
    subtotal: number;
    taxAmount: number;
    discountAmount: number;
    status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'CANCELLED' | 'REFUNDED';
    itemCount: number;
    createdAt: string;
    orderItems: OrderItem[];
}

export const orderApi = {
    /**
     * Create a new order
     */
    createOrder: async (request: CreateOrderRequest): Promise<OrderResponse> => {
        const response = await apiClient.post<OrderResponse>('/v1/orders', request);
        return response.data;
    },

    /**
     * Get order by ID
     */
    getOrderById: async (orderId: number): Promise<OrderResponse> => {
        const response = await apiClient.get<OrderResponse>(`/v1/orders/${orderId}`);
        return response.data;
    },

    /**
     * Get current user's orders
     */
    getMyOrders: async (page: number = 0, size: number = 20): Promise<any> => {
        const response = await apiClient.get(`/v1/orders/my-orders?page=${page}&size=${size}`);
        return response.data;
    },

    /**
     * Cancel an order
     */
    cancelOrder: async (orderId: number): Promise<OrderResponse> => {
        const response = await apiClient.post<OrderResponse>(`/v1/orders/${orderId}/cancel`);
        return response.data;
    }
};
