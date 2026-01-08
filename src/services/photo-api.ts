import apiClient from './api';

// ============================================================================
// TypeScript Interfaces
// ============================================================================

export interface Photo {
    id: number;
    title: string;
    description?: string;
    imageUrl: string;
    thumbnailUrl: string;
    watermarkedUrl?: string;
    photographerId?: number;
    photographerName?: string;
    photographer?: {
        id: number;
        firstName: string;
        lastName: string;
        username: string;
        email: string;
    };
    fileSize: number;
    width: number;
    height: number;
    format: string;
    basePrice: number;
    commercialPrice?: number;
    editorialPrice?: number;
    extendedPrice?: number;
    isApproved: boolean;
    isFeatured: boolean;
    isActive: boolean;
    viewCount: number;
    downloadCount: number;
    likeCount: number;
    location?: string;
    cameraModel?: string;
    lens?: string;
    focalLength?: string;
    aperture?: string;
    shutterSpeed?: string;
    iso?: string;
    captureDate?: string;
    createdAt: string;
    updatedAt?: string;
    tags?: Tag[] | null;
    categories?: Category[] | null | string;
}

export interface Category {
    id: number;
    name: string;
    description?: string;
    slug: string;
    imageUrl?: string;
    isActive: boolean;
    displayOrder?: number;
    createdAt: string;
    updatedAt?: string;
}

export interface Tag {
    id: number;
    name: string;
    description?: string;
    usageCount: number;
    createdAt: string;
    updatedAt?: string;
}

export interface PhotoStats {
    totalPhotos: number;
    pendingApproval: number;
    approved: number;
    rejected: number;
    featured: number;
    totalViews: number;
    totalDownloads: number;
}

export interface PageResponse<T> {
    content: T[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
    first: boolean;
    last: boolean;
}

export interface CategoryCreateDto {
    name: string;
    description?: string;
    slug?: string;
    imageUrl?: string;
    isActive?: boolean;
    displayOrder?: number;
}

export interface CategoryUpdateDto {
    name?: string;
    description?: string;
    imageUrl?: string;
    isActive?: boolean;
    displayOrder?: number;
}

export interface CategoryWithCount {
    category: Category;
    photoCount: number;
}

export interface CategoryStats {
    totalCategories: number;
    activeCategories: number;
    inactiveCategories: number;
    emptyCategories: number;
}

// ============================================================================
// Photo Management API
// ============================================================================

export const photoApi = {
    /**
     * Get all photos with pagination
     */
    getAllPhotos: async (
        page: number = 0,
        size: number = 20,
        sort: string = 'createdAt,desc'
    ): Promise<PageResponse<Photo>> => {
        const params = new URLSearchParams({
            page: page.toString(),
            size: size.toString(),
            sort: sort,
        });
        const response = await apiClient.get(`/v1/photos?${params.toString()}`);
        return response.data;
    },

    /**
     * Upload a new photo with file and metadata
     */
    uploadPhoto: async (formData: FormData): Promise<Photo> => {
        const response = await apiClient.post('/v1/photos/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    /**
     * Get photo by ID
     */
    getPhotoById: async (id: number): Promise<Photo> => {
        const response = await apiClient.get(`/v1/photos/${id}`);
        return response.data;
    },

    /**
     * Get photo by ID with photographer details
     */
    getPhotoWithPhotographer: async (id: number): Promise<Photo> => {
        const response = await apiClient.get(`/v1/photos/${id}/with-photographer`);
        return response.data;
    },

    /**
     * Get pending approval photos
     */
    getPendingApproval: async (
        page: number = 0,
        size: number = 20
    ): Promise<PageResponse<Photo>> => {
        const params = new URLSearchParams({
            page: page.toString(),
            size: size.toString(),
        });
        const response = await apiClient.get(`/v1/photos/pending-approval?${params.toString()}`);
        return response.data;
    },

    /**
     * Get featured photos
     */
    getFeaturedPhotos: async (
        page: number = 0,
        size: number = 20
    ): Promise<PageResponse<Photo>> => {
        const params = new URLSearchParams({
            page: page.toString(),
            size: size.toString(),
        });
        const response = await apiClient.get(`/v1/photos/featured?${params.toString()}`);
        return response.data;
    },

    /**
     * Get approved and active photos
     */
    getApprovedAndActive: async (
        page: number = 0,
        size: number = 20
    ): Promise<PageResponse<Photo>> => {
        const params = new URLSearchParams({
            page: page.toString(),
            size: size.toString(),
        });
        const response = await apiClient.get(`/v1/photos/approved-active?${params.toString()}`);
        return response.data;
    },

    /**
     * Get most viewed photos
     */
    getMostViewed: async (
        page: number = 0,
        size: number = 20
    ): Promise<PageResponse<Photo>> => {
        const params = new URLSearchParams({
            page: page.toString(),
            size: size.toString(),
        });
        const response = await apiClient.get(`/v1/photos/most-viewed?${params.toString()}`);
        return response.data;
    },

    /**
     * Get most downloaded photos
     */
    getMostDownloaded: async (
        page: number = 0,
        size: number = 20
    ): Promise<PageResponse<Photo>> => {
        const params = new URLSearchParams({
            page: page.toString(),
            size: size.toString(),
        });
        const response = await apiClient.get(`/v1/photos/most-downloaded?${params.toString()}`);
        return response.data;
    },

    /**
     * Get most liked photos
     */
    getMostLiked: async (
        page: number = 0,
        size: number = 20
    ): Promise<PageResponse<Photo>> => {
        const params = new URLSearchParams({
            page: page.toString(),
            size: size.toString(),
        });
        const response = await apiClient.get(`/v1/photos/most-liked?${params.toString()}`);
        return response.data;
    },

    /**
     * Get recently uploaded photos
     */
    getRecentlyUploaded: async (
        page: number = 0,
        size: number = 20
    ): Promise<PageResponse<Photo>> => {
        const params = new URLSearchParams({
            page: page.toString(),
            size: size.toString(),
        });
        const response = await apiClient.get(`/v1/photos/recent?${params.toString()}`);
        return response.data;
    },

    /**
     * Search photos by keyword
     */
    searchPhotos: async (
        query: string,
        page: number = 0,
        size: number = 20
    ): Promise<PageResponse<Photo>> => {
        const params = new URLSearchParams({
            q: query,
            page: page.toString(),
            size: size.toString(),
        });
        const response = await apiClient.get(`/v1/photos/search?${params.toString()}`);
        return response.data;
    },

    /**
     * Get photos by category
     */
    getPhotosByCategory: async (
        categorySlug: string,
        page: number = 0,
        size: number = 20
    ): Promise<PageResponse<Photo>> => {
        const params = new URLSearchParams({
            page: page.toString(),
            size: size.toString(),
        });
        const response = await apiClient.get(`/v1/photos/by-category/${categorySlug}?${params.toString()}`);
        return response.data;
    },

    /**
     * Get photos by tag
     */
    getPhotosByTag: async (
        tagName: string,
        page: number = 0,
        size: number = 20
    ): Promise<PageResponse<Photo>> => {
        const params = new URLSearchParams({
            page: page.toString(),
            size: size.toString(),
        });
        const response = await apiClient.get(`/v1/photos/by-tag/${tagName}?${params.toString()}`);
        return response.data;
    },

    /**
     * Get photos by photographer
     */
    getPhotosByPhotographer: async (
        photographerId: number,
        page: number = 0,
        size: number = 20
    ): Promise<PageResponse<Photo>> => {
        const params = new URLSearchParams({
            page: page.toString(),
            size: size.toString(),
        });
        const response = await apiClient.get(`/v1/photos/photographer/${photographerId}?${params.toString()}`);
        return response.data;
    },

    // ============================================================================
    // Photo Moderation API
    // ============================================================================

    /**
     * Approve photo
     */
    approvePhoto: async (id: number): Promise<Photo> => {
        const response = await apiClient.patch(`/v1/photos/${id}/approve`);
        return response.data;
    },

    /**
     * Reject photo with reason
     */
    rejectPhoto: async (id: number, reason: string): Promise<Photo> => {
        const response = await apiClient.patch(`/v1/photos/${id}/reject?reason=${encodeURIComponent(reason)}`);
        return response.data;
    },

    /**
     * Set featured status
     */
    setFeatured: async (id: number, featured: boolean): Promise<Photo> => {
        const response = await apiClient.patch(`/v1/photos/${id}/featured?featured=${featured}`);
        return response.data;
    },

    /**
     * Activate photo
     */
    activatePhoto: async (id: number): Promise<Photo> => {
        const response = await apiClient.patch(`/v1/photos/${id}/activate`);
        return response.data;
    },

    /**
     * Deactivate photo
     */
    deactivatePhoto: async (id: number): Promise<Photo> => {
        const response = await apiClient.patch(`/v1/photos/${id}/deactivate`);
        return response.data;
    },

    /**
     * Delete photo
     */
    deletePhoto: async (id: number): Promise<void> => {
        await apiClient.delete(`/v1/photos/${id}`);
    },

    // ============================================================================
    // Photo Statistics API
    // ============================================================================

    /**
     * Get total photo count
     */
    countTotal: async (): Promise<number> => {
        const response = await apiClient.get('/v1/photos/count');
        return response.data;
    },

    /**
     * Get pending approval count
     */
    countPending: async (): Promise<number> => {
        const response = await apiClient.get('/v1/photos/count-pending');
        return response.data;
    },

    /**
     * Get photo statistics for admin dashboard
     */
    getPhotoStats: async (): Promise<PhotoStats> => {
        try {
            // Fetch all required data in parallel
            const [totalPhotos, pendingApproval, featuredResponse, allPhotosResponse] = await Promise.all([
                photoApi.countTotal(),
                photoApi.countPending(),
                photoApi.getFeaturedPhotos(0, 1),
                photoApi.getAllPhotos(0, 1000), // Get a large batch to calculate stats
            ]);

            const allPhotos = allPhotosResponse.content;

            // Calculate statistics
            const approved = allPhotos.filter(p => p.isApproved).length;
            const rejected = totalPhotos - approved - pendingApproval;
            const featured = featuredResponse.totalElements;
            const totalViews = allPhotos.reduce((sum, p) => sum + p.viewCount, 0);
            const totalDownloads = allPhotos.reduce((sum, p) => sum + p.downloadCount, 0);

            return {
                totalPhotos,
                pendingApproval,
                approved,
                rejected,
                featured,
                totalViews,
                totalDownloads,
            };
        } catch (error) {
            console.error('Failed to fetch photo stats:', error);
            // Return default stats on error
            return {
                totalPhotos: 0,
                pendingApproval: 0,
                approved: 0,
                rejected: 0,
                featured: 0,
                totalViews: 0,
                totalDownloads: 0,
            };
        }
    },
};

// ============================================================================
// Category API
// ============================================================================

export const categoryApi = {
    // ============================================================================
    // Category CRUD Operations
    // ============================================================================

    /**
     * Create new category
     */
    createCategory: async (data: CategoryCreateDto): Promise<Category> => {
        const response = await apiClient.post('/v1/categories', data);
        return response.data;
    },

    /**
     * Update category (full update)
     */
    updateCategory: async (id: number, data: CategoryUpdateDto): Promise<Category> => {
        const response = await apiClient.put(`/v1/categories/${id}`, data);
        return response.data;
    },

    /**
     * Update category info (partial update)
     */
    updateCategoryInfo: async (id: number, name?: string, description?: string): Promise<Category> => {
        const params = new URLSearchParams();
        if (name) params.append('name', name);
        if (description) params.append('description', description);
        const response = await apiClient.patch(`/v1/categories/${id}/info?${params.toString()}`);
        return response.data;
    },

    /**
     * Update category image
     */
    updateCategoryImage: async (id: number, imageUrl: string): Promise<Category> => {
        const response = await apiClient.patch(`/v1/categories/${id}/image?imageUrl=${encodeURIComponent(imageUrl)}`);
        return response.data;
    },

    /**
     * Update category display order
     */
    updateDisplayOrder: async (id: number, displayOrder: number): Promise<Category> => {
        const response = await apiClient.patch(`/v1/categories/${id}/order?displayOrder=${displayOrder}`);
        return response.data;
    },

    /**
     * Delete category
     */
    deleteCategory: async (id: number): Promise<void> => {
        await apiClient.delete(`/v1/categories/${id}`);
    },

    // ============================================================================
    // Category Retrieval Operations
    // ============================================================================

    /**
     * Get all active categories
     */
    getAllCategories: async (): Promise<Category[]> => {
        const response = await apiClient.get('/v1/categories/active/list');
        return response.data;
    },

    /**
     * Get all categories with pagination
     */
    getCategories: async (
        page: number = 0,
        size: number = 50
    ): Promise<PageResponse<Category>> => {
        const params = new URLSearchParams({
            page: page.toString(),
            size: size.toString(),
            sort: 'displayOrder,asc',
        });
        const response = await apiClient.get(`/v1/categories?${params.toString()}`);
        return response.data;
    },

    /**
     * Get category by ID
     */
    getCategoryById: async (id: number): Promise<Category> => {
        const response = await apiClient.get(`/v1/categories/${id}`);
        return response.data;
    },

    /**
     * Get category by slug
     */
    getCategoryBySlug: async (slug: string): Promise<Category> => {
        const response = await apiClient.get(`/v1/categories/slug/${slug}`);
        return response.data;
    },

    /**
     * Get category by name
     */
    getCategoryByName: async (name: string): Promise<Category> => {
        const response = await apiClient.get(`/v1/categories/name/${name}`);
        return response.data;
    },

    /**
     * Get active categories (paginated)
     */
    getActiveCategories: async (
        page: number = 0,
        size: number = 50
    ): Promise<PageResponse<Category>> => {
        const params = new URLSearchParams({
            page: page.toString(),
            size: size.toString(),
        });
        const response = await apiClient.get(`/v1/categories/active?${params.toString()}`);
        return response.data;
    },

    /**
     * Get ordered categories
     */
    getOrderedCategories: async (): Promise<Category[]> => {
        const response = await apiClient.get('/v1/categories/ordered');
        return response.data;
    },

    /**
     * Get active ordered categories
     */
    getActiveOrderedCategories: async (): Promise<Category[]> => {
        const response = await apiClient.get('/v1/categories/active/ordered');
        return response.data;
    },

    /**
     * Search categories
     */
    searchCategories: async (
        query: string,
        page: number = 0,
        size: number = 50
    ): Promise<PageResponse<Category>> => {
        const params = new URLSearchParams({
            q: query,
            page: page.toString(),
            size: size.toString(),
        });
        const response = await apiClient.get(`/v1/categories/search?${params.toString()}`);
        return response.data;
    },

    /**
     * Get empty categories (categories with no photos)
     */
    getEmptyCategories: async (): Promise<Category[]> => {
        const response = await apiClient.get('/v1/categories/empty');
        return response.data;
    },

    /**
     * Get categories with photo count
     */
    getCategoriesWithPhotoCount: async (
        page: number = 0,
        size: number = 50
    ): Promise<PageResponse<any>> => {
        const params = new URLSearchParams({
            page: page.toString(),
            size: size.toString(),
        });
        const response = await apiClient.get(`/v1/categories/with-photo-count?${params.toString()}`);
        return response.data;
    },

    // ============================================================================
    // Category Statistics
    // ============================================================================

    /**
     * Count active categories
     */
    countActiveCategories: async (): Promise<number> => {
        const response = await apiClient.get('/v1/categories/counts/active');
        return response.data;
    },

    /**
     * Count total categories
     */
    countTotalCategories: async (): Promise<number> => {
        const response = await apiClient.get('/v1/categories/counts/total');
        return response.data;
    },

    /**
     * Get category statistics for admin dashboard
     */
    getCategoryStats: async (): Promise<CategoryStats> => {
        try {
            const [totalCategories, activeCategories, emptyCategories] = await Promise.all([
                categoryApi.countTotalCategories(),
                categoryApi.countActiveCategories(),
                categoryApi.getEmptyCategories(),
            ]);

            return {
                totalCategories,
                activeCategories,
                inactiveCategories: totalCategories - activeCategories,
                emptyCategories: emptyCategories.length,
            };
        } catch (error) {
            console.error('Failed to fetch category stats:', error);
            return {
                totalCategories: 0,
                activeCategories: 0,
                inactiveCategories: 0,
                emptyCategories: 0,
            };
        }
    },

    // ============================================================================
    // Category Bulk Operations
    // ============================================================================

    /**
     * Reorder categories
     */
    reorderCategories: async (categoryOrders: Array<{ id: number; displayOrder: number }>): Promise<void> => {
        await apiClient.post('/v1/categories/reorder', categoryOrders);
    },

    /**
     * Activate category
     */
    activateCategory: async (id: number): Promise<Category> => {
        const response = await apiClient.post(`/v1/categories/${id}/activate`);
        return response.data;
    },

    /**
     * Deactivate category
     */
    deactivateCategory: async (id: number): Promise<Category> => {
        const response = await apiClient.post(`/v1/categories/${id}/deactivate`);
        return response.data;
    },
};

// ============================================================================
// Tag API
// ============================================================================

export const tagApi = {
    /**
     * Get all tags
     */
    getAllTags: async (): Promise<Tag[]> => {
        const response = await apiClient.get('/v1/tags');
        return response.data;
    },

    /**
     * Get popular tags
     */
    getPopularTags: async (limit: number = 20): Promise<Tag[]> => {
        const response = await apiClient.get(`/v1/tags/popular?limit=${limit}`);
        return response.data;
    },

    /**
     * Get tag by ID
     */
    getTagById: async (id: number): Promise<Tag> => {
        const response = await apiClient.get(`/v1/tags/${id}`);
        return response.data;
    },

    /**
     * Get tag by name
     */
    getTagByName: async (name: string): Promise<Tag> => {
        const response = await apiClient.get(`/v1/tags/name/${name}`);
        return response.data;
    },
};

// ============================================================================
// Public Stats API
// ============================================================================

export interface PublicStats {
    totalPhotos: number;
    totalPhotographers: number;
    totalCategories: number;
}

export interface TopPhotographer {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    profileImageUrl: string | null;
    photoCount: number;
}

export const publicStatsApi = {
    /**
     * Get public platform statistics (no authentication required)
     */
    getStats: async (): Promise<PublicStats> => {
        const response = await apiClient.get('/v1/public/stats');
        return response.data;
    },

    /**
     * Get top photographers by photo count (no authentication required)
     */
    getTopPhotographers: async (limit: number = 4): Promise<TopPhotographer[]> => {
        const response = await apiClient.get(`/v1/public/stats/top-photographers?limit=${limit}`);
        return response.data;
    },
};
// ============================================================================
// Photographer Stats API
// ============================================================================

export interface PhotographerStats {
    totalPhotos: number;
    totalEarnings: number;
    totalSales: number;
    averageRating: number;
}

export interface MonthlyEarning {
    month: string;
    amount: number;
}

export interface Payout {
    id: number;
    amount: number;
    date: string;
    status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
    method: string;
}

export interface EarningsData {
    photographerId: number;
    photographerUsername?: string;
    totalEarnings: number;
    pendingEarnings: number;
    paidEarnings: number;
    availableForWithdrawal: number;
    completedOrdersAmount?: number;
    refundedAmount?: number;
    totalOrders?: number;
    completedOrders?: number;
    refundedOrders?: number;
    averageOrderValue?: number;
    lastUpdated?: string;
    lastPayoutDate?: string;
    monthlyEarnings: MonthlyEarning[];
    recentPayouts: Payout[];
}

export interface PayoutRequest {
    photographerId: number;
    amount: number;
    payoutMethod?: string;
    bankAccountNumber?: string;
    paypalEmail?: string;
    cryptoWalletAddress?: string;
    notes?: string;
}

export interface PayoutResponse {
    id: number;
    payoutReference: string;
    photographerId: number;
    photographerUsername?: string;
    amount: number;
    fee?: number;
    netAmount?: number;
    status: 'PENDING' | 'APPROVED' | 'PROCESSING' | 'COMPLETED' | 'REJECTED' | 'CANCELLED';
    payoutMethod?: string;
    requestedAt: string;
    approvedAt?: string;
    completedAt?: string;
    rejectedAt?: string;
    rejectionReason?: string;
    notes?: string;
    transactionId?: string;
}

export const photographerStatsApi = {
    /**
     * Get statistics for a specific photographer
     * @param userId the ID of the photographer
     */
    getStats: async (userId: number): Promise<PhotographerStats> => {
        const response = await apiClient.get(`/v1/photographer/stats/${userId}`);
        return response.data;
    },

    /**
     * Get earnings summary for a photographer
     * @param userId the ID of the photographer
     */
    getEarnings: async (userId: number): Promise<EarningsData> => {
        const response = await apiClient.get(`/v1/earnings/photographer/${userId}/summary`);
        return response.data;
    },

    /**
     * Request a withdrawal/payout
     * @param amount the amount to withdraw
     * @param photographerId optional photographer ID (if not using current user)
     */
    requestWithdrawal: async (amount: number, photographerId?: number): Promise<PayoutResponse> => {
        const payoutRequest: PayoutRequest = {
            photographerId: photographerId || 0, // Will be set by backend from auth context if 0
            amount: amount,
            payoutMethod: 'BANK_TRANSFER', // Default method
        };
        const response = await apiClient.post('/v1/payouts/requests', payoutRequest);
        return response.data;
    },

    /**
     * Get payout history for a photographer
     * @param photographerId the ID of the photographer
     * @param page page number (default 0)
     * @param size page size (default 10)
     */
    getPayoutHistory: async (
        photographerId: number,
        page: number = 0,
        size: number = 10
    ): Promise<PageResponse<PayoutResponse>> => {
        const params = new URLSearchParams({
            page: page.toString(),
            size: size.toString(),
        });
        const response = await apiClient.get(`/v1/payouts/photographer/${photographerId}/history?${params.toString()}`);
        return response.data;
    },
};
