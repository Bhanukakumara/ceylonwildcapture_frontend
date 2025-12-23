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

// Audit Log DTO matching backend structure
export interface AuditLogDto {
    id: number;
    eventType: string;      // LOGIN, PHOTO_DOWNLOAD, PHOTO_UPLOAD, etc.
    entityType?: string;    // USER, PHOTO, ORDER, PAYOUT, etc.
    entityId?: number;
    userId?: number;
    username?: string;
    action: string;         // CREATE, UPDATE, DELETE, APPROVE, REJECT, etc.
    description?: string;
    ipAddress?: string;
    userAgent?: string;
    timestamp: string;
    metadata?: string;
}

const adminApi = {
    getDashboardStats: async (): Promise<DashboardStats> => {
        const response = await api.get('/v1/admin/analytics/dashboard');
        return response.data;
    },

    // Audit Log API Methods
    getAllAuditLogs: async (page: number = 0, size: number = 20): Promise<{ content: AuditLogDto[], totalElements: number, totalPages: number }> => {
        const response = await api.get(`/v1/admin/audit-logs?page=${page}&size=${size}&sort=createdAt,desc`);
        return response.data;
    },

    getAuditLogsByEventType: async (eventType: string, page: number = 0, size: number = 20): Promise<{ content: AuditLogDto[], totalElements: number, totalPages: number }> => {
        const response = await api.get(`/v1/admin/audit-logs/event-type/${eventType}?page=${page}&size=${size}&sort=createdAt,desc`);
        return response.data;
    },

    getAuditLogsByEntityType: async (entityType: string, page: number = 0, size: number = 20): Promise<{ content: AuditLogDto[], totalElements: number, totalPages: number }> => {
        const response = await api.get(`/v1/admin/audit-logs/entity-type/${entityType}?page=${page}&size=${size}&sort=createdAt,desc`);
        return response.data;
    },

    getAuditLogsByUser: async (userId: number, page: number = 0, size: number = 20): Promise<{ content: AuditLogDto[], totalElements: number, totalPages: number }> => {
        const response = await api.get(`/v1/admin/audit-logs/user/${userId}?page=${page}&size=${size}&sort=createdAt,desc`);
        return response.data;
    },

    getAuditLogsByDateRange: async (startDate: string, endDate: string, page: number = 0, size: number = 20): Promise<{ content: AuditLogDto[], totalElements: number, totalPages: number }> => {
        const response = await api.get(`/v1/admin/audit-logs/date-range?startDate=${startDate}&endDate=${endDate}&page=${page}&size=${size}&sort=createdAt,desc`);
        return response.data;
    },

    getAuditLogsForEntity: async (entityType: string, entityId: number, page: number = 0, size: number = 20): Promise<{ content: AuditLogDto[], totalElements: number, totalPages: number }> => {
        const response = await api.get(`/v1/admin/audit-logs/entity/${entityType}/${entityId}?page=${page}&size=${size}&sort=createdAt,desc`);
        return response.data;
    },

    getDownloadAuditLogs: async (page: number = 0, size: number = 20): Promise<{ content: AuditLogDto[], totalElements: number, totalPages: number }> => {
        const response = await api.get(`/v1/admin/audit-logs/downloads?page=${page}&size=${size}&sort=createdAt,desc`);
        return response.data;
    },

    getLoginAuditLogs: async (page: number = 0, size: number = 20): Promise<{ content: AuditLogDto[], totalElements: number, totalPages: number }> => {
        const response = await api.get(`/v1/admin/audit-logs/logins?page=${page}&size=${size}&sort=createdAt,desc`);
        return response.data;
    },

    getFailedLoginAttempts: async (page: number = 0, size: number = 20): Promise<{ content: AuditLogDto[], totalElements: number, totalPages: number }> => {
        const response = await api.get(`/v1/admin/audit-logs/failed-logins?page=${page}&size=${size}&sort=createdAt,desc`);
        return response.data;
    },

    getAuditLogsByAction: async (action: string, page: number = 0, size: number = 20): Promise<{ content: AuditLogDto[], totalElements: number, totalPages: number }> => {
        const response = await api.get(`/v1/admin/audit-logs/action/${action}?page=${page}&size=${size}&sort=createdAt,desc`);
        return response.data;
    },

    searchAuditLogs: async (searchTerm: string, page: number = 0, size: number = 20): Promise<{ content: AuditLogDto[], totalElements: number, totalPages: number }> => {
        const response = await api.get(`/v1/admin/audit-logs/search?searchTerm=${encodeURIComponent(searchTerm)}&page=${page}&size=${size}&sort=createdAt,desc`);
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

    // Category Management API Methods
    getAllCategories: async (page: number = 0, size: number = 20): Promise<{ content: any[], totalElements: number, totalPages: number }> => {
        const response = await api.get(`/v1/admin/categories-tags/categories?page=${page}&size=${size}`);
        return response.data;
    },

    createCategory: async (category: any): Promise<any> => {
        const response = await api.post('/v1/admin/categories-tags/categories', category);
        return response.data;
    },

    updateCategory: async (categoryId: number, category: any): Promise<any> => {
        const response = await api.put(`/v1/admin/categories-tags/categories/${categoryId}`, category);
        return response.data;
    },

    deleteCategory: async (categoryId: number): Promise<void> => {
        await api.delete(`/v1/admin/categories-tags/categories/${categoryId}`);
    },

    mergeCategories: async (sourceCategoryId: number, targetCategoryId: number): Promise<any> => {
        const response = await api.post(`/v1/admin/categories-tags/categories/merge?sourceCategoryId=${sourceCategoryId}&targetCategoryId=${targetCategoryId}`);
        return response.data;
    },

    getUnusedCategories: async (): Promise<any[]> => {
        const response = await api.get('/v1/admin/categories-tags/categories/unused');
        return response.data;
    },

    deleteUnusedCategories: async (): Promise<number> => {
        const response = await api.delete('/v1/admin/categories-tags/categories/unused');
        return response.data;
    },

    // Tag Management API Methods
    getAllTags: async (page: number = 0, size: number = 20): Promise<{ content: any[], totalElements: number, totalPages: number }> => {
        const response = await api.get(`/v1/admin/categories-tags/tags?page=${page}&size=${size}`);
        return response.data;
    },

    createTag: async (tag: any): Promise<any> => {
        const response = await api.post('/v1/admin/categories-tags/tags', tag);
        return response.data;
    },

    updateTag: async (tagId: number, tag: any): Promise<any> => {
        const response = await api.put(`/v1/admin/categories-tags/tags/${tagId}`, tag);
        return response.data;
    },

    deleteTag: async (tagId: number): Promise<void> => {
        await api.delete(`/v1/admin/categories-tags/tags/${tagId}`);
    },

    mergeTags: async (sourceTagId: number, targetTagId: number): Promise<any> => {
        const response = await api.post(`/v1/admin/categories-tags/tags/merge?sourceTagId=${sourceTagId}&targetTagId=${targetTagId}`);
        return response.data;
    },

    getUnusedTags: async (): Promise<any[]> => {
        const response = await api.get('/v1/admin/categories-tags/tags/unused');
        return response.data;
    },

    deleteUnusedTags: async (): Promise<number> => {
        const response = await api.delete('/v1/admin/categories-tags/tags/unused');
        return response.data;
    },

    // Upload category image to Cloudinary
    uploadCategoryImage: async (file: File): Promise<string> => {
        const formData = new FormData();
        formData.append('file', file);
        const response = await api.post('/v1/admin/categories-tags/upload-image', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    },

    // Financial Reports API Methods
    generateFinancialReport: async (startDate: string, endDate: string): Promise<any> => {
        const response = await api.get(`/v1/admin/reports/financial?startDate=${startDate}&endDate=${endDate}`);
        return response.data;
    },

    generateMonthlyReport: async (year: number, month: number): Promise<any> => {
        const response = await api.get(`/v1/admin/reports/financial/monthly?year=${year}&month=${month}`);
        return response.data;
    },

    generateYearlyReport: async (year: number): Promise<any> => {
        const response = await api.get(`/v1/admin/reports/financial/yearly?year=${year}`);
        return response.data;
    },

    exportReportToPdf: async (report: any): Promise<Blob> => {
        const response = await api.post('/v1/admin/reports/financial/export/pdf', report, {
            responseType: 'blob'
        });
        return response.data;
    },

    exportReportToExcel: async (report: any): Promise<Blob> => {
        const response = await api.post('/v1/admin/reports/financial/export/excel', report, {
            responseType: 'blob'
        });
        return response.data;
    },

    exportReportToCsv: async (report: any): Promise<Blob> => {
        const response = await api.post('/v1/admin/reports/financial/export/csv', report, {
            responseType: 'blob'
        });
        return response.data;
    },
};

export default adminApi;
