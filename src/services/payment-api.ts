import apiClient from './api';

export interface PaymentIntentRequest {
    orderId: number;
    amount: number;
    currency: string;
    provider: 'STRIPE' | 'PAYPAL' | 'RAZORPAY';
    returnUrl: string;
    cancelUrl: string;
    metadata?: Record<string, string>;
}

export interface PaymentIntentResponse {
    paymentId: number;
    clientSecret?: string;
    providerPaymentId: string;
    amount: number;
    currency: string;
    status: string;
    redirectUrl?: string;
    publicKey?: string;
    expiresAt: string;
    orderId: number;
    orderNumber: string;
}

export const paymentApi = {
    /**
     * Create a payment intent
     */
    createPaymentIntent: async (request: PaymentIntentRequest): Promise<PaymentIntentResponse> => {
        const response = await apiClient.post<PaymentIntentResponse>('/v1/payments/intent', request);
        return response.data;
    },

    /**
     * Get payment by order ID
     */
    getPaymentByOrderId: async (orderId: number): Promise<PaymentIntentResponse> => {
        const response = await apiClient.get<PaymentIntentResponse>(`/v1/payments/order/${orderId}`);
        return response.data;
    }
};
