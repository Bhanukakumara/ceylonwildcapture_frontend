import api from './api';

export interface DashboardStats {
    totalUsers: number;
    totalPhotographers: number;
    totalCustomers: number;
    totalPhotos: number;
    pendingPhotos: number;
    approvedPhotos: number;
    totalOrders: number;
    totalRevenue: number;
    generatedAt: string;
}

export interface CategoryPerformance {
    categoryId: number;
    categoryName: string;
    categorySlug: string;
    photoCount: number;
    salesCount: number;
    totalRevenue: number;
}

export interface RecentActivity {
    type: string;
    action: string;
    userName: string;
    userId: number;
    timestamp: string;
    timeAgo: string;
}

export interface OrderStats {
    totalOrders: number;
    pendingOrders: number;
    processingOrders: number;
    completedOrders: number;
    cancelledOrders: number;
    refundedOrders: number;
    totalRevenue: number;
    averageOrderValue: number;
}

export interface OrderSummary {
    id: number;
    orderNumber: string;
    buyerName: string;
    buyerEmail: string;
    totalAmount: number;
    status: string;
    itemCount: number;
    paymentMethod?: string;
    transactionId?: string;
    firstPhotoThumbnail?: string;
    createdAt: string;
}

export interface AuditEventResponse {
    id: number;
    auditType: string;
    actorId?: number;
    actorName?: string;
    actorType?: string;
    entityType?: string;
    entityId?: number;
    action: string;
    actionResult: string;
    description?: string;
    metadata?: string;
    ipAddress?: string;
    createdAt: string;
    details?: Record<string, any>;
}

const adminApi = {
    getDashboardStats: async (): Promise<DashboardStats> => {
        const response = await api.get('/v1/admin/analytics/dashboard');
        return response.data;
    },

    getAuditLogs: async (
        page: number = 0,
        size: number = 20,
        auditType?: string,
        userId?: number
    ): Promise<{ content: AuditEventResponse[], totalElements: number }> => {
        let url = `/v1/audit?page=${page}&size=${size}`;
        if (auditType && auditType !== 'ALL') url += `&auditType=${auditType}`;
        if (userId) url += `&userId=${userId}`;

        const response = await api.get(url);
        return response.data;
    },

    getCategoryPerformance: async (limit: number = 5): Promise<CategoryPerformance[]> => {
        const response = await api.get(`/v1/admin/analytics/category-performance/top?limit=${limit}`);
        return response.data;
    },

    getRecentActivity: async (limit: number = 10): Promise<RecentActivity[]> => {
        const response = await api.get(`/v1/admin/analytics/recent-activity?limit=${limit}`);
        return response.data;
    },

    getOrderStats: async (): Promise<OrderStats> => {
        const response = await api.get('/v1/orders/query/statistics');
        return response.data;
    },

    getOrders: async (page: number = 0, size: number = 10, status?: string, searchTerm?: string): Promise<{ content: OrderSummary[], totalElements: number }> => {
        let url = `/v1/orders/query/all?page=${page}&size=${size}`;
        if (status && status !== 'ALL') url += `&status=${status}`;
        if (searchTerm) url += `&searchTerm=${searchTerm}`;
        const response = await api.get(url);
        return response.data;
    },

    getOrderDetails: async (orderId: number): Promise<any> => {
        const response = await api.get(`/v1/orders/${orderId}`);
        return response.data;
    },

    updateOrderStatus: async (orderId: number, status: string, notes?: string): Promise<any> => {
        const response = await api.put(`/v1/orders/${orderId}/status`, { status, notes });
        return response.data;
    },
};

export default adminApi;
