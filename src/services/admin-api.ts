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

const adminApi = {
    getDashboardStats: async (): Promise<DashboardStats> => {
        const response = await api.get('/v1/admin/analytics/dashboard');
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
};

export default adminApi;
