import { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { photoApi, categoryApi, type Photo, type Category } from '../services/api';
import AOS from 'aos';
import { useCart } from '../contexts/CartContext';
import './ExplorePage.css';

const ExplorePage = () => {
    const [photos, setPhotos] = useState<Photo[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [photographers, setPhotographers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchParams] = useSearchParams();
    const initialSearch = searchParams.get('search') || '';

    // Filters
    const [searchQuery, setSearchQuery] = useState<string>(initialSearch);
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [selectedPhotographer, setSelectedPhotographer] = useState<string>('');
    const [priceRange, setPriceRange] = useState<{ min: string; max: string }>({ min: '', max: '' });
    const [selectedOrientation, setSelectedOrientation] = useState<string>('');
    const [dateRange, setDateRange] = useState<{ start: string; end: string }>({ start: '', end: '' });
    const [sortBy, setSortBy] = useState<string>('newest');
    const [currentPage, setCurrentPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [isAddingMore, setIsAddingMore] = useState(false);
    const observer = useRef<IntersectionObserver | null>(null);

    // Cart functionality
    const { addToCart } = useCart();
    const [addingToCart, setAddingToCart] = useState<{ [key: number]: boolean }>({});
    const [addedToCart, setAddedToCart] = useState<{ [key: number]: boolean }>({});

    const pageSize = 12;

    // Load categories and photographers on mount
    useEffect(() => {
        loadCategories();
        loadPhotographers();
    }, []);

    // Sync search query from URL
    useEffect(() => {
        const queryParam = searchParams.get('search');
        if (queryParam !== null) {
            setSearchQuery(queryParam);
            setCurrentPage(0);
        }
    }, [searchParams]);

    // Load photos when filters change (with debounce for search)
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            loadPhotos(currentPage === 0);
        }, searchQuery ? 500 : 0); // Debounce search by 500ms

        return () => clearTimeout(timeoutId);
    }, [selectedCategory, selectedPhotographer, priceRange, selectedOrientation, dateRange, sortBy, currentPage, searchQuery]);

    // Intersection Observer for Infinite Scroll
    const lastPhotoElementRef = useCallback((node: HTMLAnchorElement | null) => {
        if (loading) return;
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore && !isAddingMore) {
                setCurrentPage(prevPage => prevPage + 1);
            }
        });
        if (node) observer.current.observe(node);
    }, [loading, hasMore, isAddingMore]);

    const loadCategories = async () => {
        try {
            const categoriesData = await categoryApi.getAllCategories();
            setCategories(categoriesData);
        } catch (err) {
            console.error('Failed to load categories:', err);
        }
    };

    const loadPhotographers = async () => {
        try {
            // Fetch photographers - in a real app, this might be a specific endpoint
            // For now, we'll use the approved photos to find photographers if there's no direct API
            // But let's check if there's a photographer API first.
            // Based on api.ts, adminUserApi.getAllUsers might work or we can fetch unique photographers from photos
            const response = await photoApi.getApprovedAndActive(0, 100);
            const uniquePhotographers = Array.from(new Set(response.content
                .filter(p => p.photographer)
                .map(p => JSON.stringify(p.photographer))))
                .map(p => JSON.parse(p));
            setPhotographers(uniquePhotographers);
        } catch (err) {
            console.error('Failed to load photographers:', err);
        }
    };

    const loadPhotos = async (isInitial: boolean = true) => {
        try {
            if (isInitial) {
                setLoading(true);
            } else {
                setIsAddingMore(true);
            }
            setError(null);

            let response;

            // Fetch base data
            if (searchQuery.trim()) {
                response = await photoApi.searchPhotos(searchQuery, currentPage, pageSize);
            } else if (selectedCategory) {
                response = await photoApi.getPhotosByCategory(selectedCategory, currentPage, pageSize);
            } else {
                response = await photoApi.getApprovedAndActive(currentPage, pageSize);
            }

            let filteredPhotos = response.content;

            // Client-side filtering for advanced options
            if (selectedPhotographer) {
                filteredPhotos = filteredPhotos.filter(p => p.photographer?.id.toString() === selectedPhotographer);
            }

            if (priceRange.min) {
                filteredPhotos = filteredPhotos.filter(p => p.basePrice >= parseFloat(priceRange.min));
            }
            if (priceRange.max) {
                filteredPhotos = filteredPhotos.filter(p => p.basePrice <= parseFloat(priceRange.max));
            }

            if (selectedOrientation) {
                filteredPhotos = filteredPhotos.filter(p => {
                    const ratio = p.width / p.height;
                    if (selectedOrientation === 'landscape') return ratio > 1.2;
                    if (selectedOrientation === 'portrait') return ratio < 0.8;
                    if (selectedOrientation === 'square') return ratio >= 0.8 && ratio <= 1.2;
                    return true;
                });
            }

            if (dateRange.start) {
                filteredPhotos = filteredPhotos.filter(p => new Date(p.createdAt) >= new Date(dateRange.start));
            }
            if (dateRange.end) {
                filteredPhotos = filteredPhotos.filter(p => new Date(p.createdAt) <= new Date(dateRange.end));
            }

            // Client-side sorting
            if (sortBy === 'popular') {
                filteredPhotos.sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0));
            } else if (sortBy === 'price-low') {
                filteredPhotos.sort((a, b) => a.basePrice - b.basePrice);
            } else if (sortBy === 'price-high') {
                filteredPhotos.sort((a, b) => b.basePrice - a.basePrice);
            }

            if (isInitial) {
                setPhotos(filteredPhotos);
            } else {
                setPhotos(prev => [...prev, ...filteredPhotos]);
            }

            setHasMore(currentPage < response.totalPages - 1);

            // Refresh AOS animations for new items
            setTimeout(() => {
                AOS.refresh();
            }, 100);

        } catch (err) {
            console.error('Failed to load photos:', err);
            setError('Failed to load photos. Please try again later.');
        } finally {
            setLoading(false);
            setIsAddingMore(false);
        }
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
        setCurrentPage(0);
    };

    const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedCategory(e.target.value);
        setSearchQuery('');
        setCurrentPage(0);
    };

    const handlePhotographerChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedPhotographer(e.target.value);
        setCurrentPage(0);
    };

    const handlePriceChange = (type: 'min' | 'max', value: string) => {
        setPriceRange(prev => ({ ...prev, [type]: value }));
        setCurrentPage(0);
    };

    const handleOrientationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedOrientation(e.target.value);
        setCurrentPage(0);
    };

    const handleDateChange = (type: 'start' | 'end', value: string) => {
        setDateRange(prev => ({ ...prev, [type]: value }));
        setCurrentPage(0);
    };

    const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSortBy(e.target.value);
        setCurrentPage(0);
    };

    const resetFilters = () => {
        setSelectedCategory('');
        setSelectedPhotographer('');
        setPriceRange({ min: '', max: '' });
        setSelectedOrientation('');
        setDateRange({ start: '', end: '' });
        setSearchQuery('');
        setSortBy('newest');
        setCurrentPage(0);
    };

    const handleAddToCart = async (photo: Photo, e: React.MouseEvent) => {
        e.preventDefault(); // Prevent navigation to photo detail
        e.stopPropagation();

        try {
            setAddingToCart(prev => ({ ...prev, [photo.id]: true }));

            await addToCart(
                photo.id,
                photo.title,
                photo.thumbnailUrl || photo.imageUrl,
                photo.photographer?.username || 'Unknown',
                'PERSONAL', // Default license type
                photo.basePrice
            );

            // Show success feedback
            setAddedToCart(prev => ({ ...prev, [photo.id]: true }));

            // Reset success feedback after 2 seconds
            setTimeout(() => {
                setAddedToCart(prev => ({ ...prev, [photo.id]: false }));
            }, 2000);
        } catch (error) {
            console.error('Failed to add to cart:', error);
        } finally {
            setAddingToCart(prev => ({ ...prev, [photo.id]: false }));
        }
    };

    return (
        <div className="explore-page">
            <div className="container">
                <div className="explore-header">
                    <h1 data-aos="fade-up">Explore Wildlife Photography</h1>
                    <p data-aos="fade-up" data-aos-delay="100">Browse through our collection of stunning wildlife photos from Sri Lanka</p>
                </div>


                <div className="explore-filters" data-aos="fade-up" data-aos-delay="200">
                    <div className="filter-group">
                        <label>Category</label>
                        <select
                            className="filter-select"
                            value={selectedCategory}
                            onChange={handleCategoryChange}
                        >
                            <option value="">All Categories</option>
                            {categories.map((category) => (
                                <option key={category.id} value={category.slug}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="filter-group search-group">
                        <label>Search</label>
                        <div className="search-input-wrapper">
                            <svg className="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none">
                                <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2" />
                                <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                            </svg>
                            <input
                                type="text"
                                className="search-input"
                                placeholder="Search by title, description, tags..."
                                value={searchQuery}
                                onChange={handleSearchChange}
                            />
                            {searchQuery && (
                                <button
                                    className="clear-search-btn"
                                    onClick={() => setSearchQuery('')}
                                    aria-label="Clear search"
                                >
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                        <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                    </svg>
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="filter-group">
                        <label>Price Range</label>
                        <div className="price-inputs">
                            <input
                                type="number"
                                placeholder="Min"
                                value={priceRange.min}
                                onChange={(e) => handlePriceChange('min', e.target.value)}
                                className="filter-input"
                            />
                            <input
                                type="number"
                                placeholder="Max"
                                value={priceRange.max}
                                onChange={(e) => handlePriceChange('max', e.target.value)}
                                className="filter-input"
                            />
                        </div>
                    </div>

                    <div className="filter-group">
                        <label>Photographer</label>
                        <select
                            className="filter-select"
                            value={selectedPhotographer}
                            onChange={handlePhotographerChange}
                        >
                            <option value="">All Photographers</option>
                            {photographers.map((p) => (
                                <option key={p.id} value={p.id.toString()}>
                                    {p.firstName} {p.lastName} (@{p.username})
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="filter-group">
                        <label>Orientation</label>
                        <select
                            className="filter-select"
                            value={selectedOrientation}
                            onChange={handleOrientationChange}
                        >
                            <option value="">All Orientations</option>
                            <option value="landscape">Landscape</option>
                            <option value="portrait">Portrait</option>
                            <option value="square">Square</option>
                        </select>
                    </div>

                    <div className="filter-group">
                        <label>Date Captured</label>
                        <div className="date-inputs">
                            <input
                                type="date"
                                value={dateRange.start}
                                onChange={(e) => handleDateChange('start', e.target.value)}
                                className="filter-input"
                            />
                            <input
                                type="date"
                                value={dateRange.end}
                                onChange={(e) => handleDateChange('end', e.target.value)}
                                className="filter-input"
                            />
                        </div>
                    </div>

                    <div className="filter-group">
                        <label>Sort By</label>
                        <select
                            className="filter-select"
                            value={sortBy}
                            onChange={handleSortChange}
                        >
                            <option value="newest">Newest</option>
                            <option value="popular">Popular</option>
                            <option value="price-low">Price: Low to High</option>
                            <option value="price-high">Price: High to Low</option>
                        </select>
                    </div>

                    <div className="filter-group reset-group">
                        <button className="btn btn-ghost reset-btn" onClick={resetFilters}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ marginRight: '6px' }}>
                                <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            Reset All
                        </button>
                    </div>
                </div>

                {loading ? (
                    <div className="loading-container">
                        <div className="loading-spinner"></div>
                        <p>Loading photos...</p>
                    </div>
                ) : error ? (
                    <div className="error-container">
                        <p className="error-message">{error}</p>
                    </div>
                ) : photos.length === 0 ? (
                    <div className="empty-state">
                        <p>No photos found</p>
                    </div>
                ) : (
                    <>
                        <div className="explore-grid">
                            {photos.map((photo, index) => (
                                <Link
                                    key={`${photo.id}-${index}`}
                                    ref={index === photos.length - 1 ? lastPhotoElementRef : null}
                                    to={`/photo/${photo.id}`}
                                    className="explore-card glass hover-lift"
                                    data-aos="fade-up"
                                    data-aos-delay={Math.min((index % 12) * 50, 300)}
                                >
                                    <div className="explore-image-wrapper">
                                        <img
                                            src={photo.thumbnailUrl || photo.imageUrl}
                                            alt={photo.title}
                                            className="explore-image"
                                            loading="lazy"
                                        />
                                    </div>
                                    <div className="explore-info">
                                        <h3>{photo.title}</h3>
                                        <p className="explore-photographer">
                                            by {photo.photographer?.username || 'Unknown'}
                                        </p>
                                        <div className="explore-footer">
                                            <span className="explore-price">${photo.basePrice.toFixed(2)}</span>
                                            <div className="explore-actions">
                                                <button
                                                    className={`btn btn-sm ${addedToCart[photo.id]
                                                        ? 'btn-success'
                                                        : 'btn-primary'
                                                        }`}
                                                    onClick={(e) => handleAddToCart(photo, e)}
                                                    disabled={addingToCart[photo.id]}
                                                >
                                                    {addingToCart[photo.id] ? (
                                                        <>
                                                            <svg className="spinner" width="14" height="14" viewBox="0 0 24 24" fill="none">
                                                                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.25" />
                                                                <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                                                            </svg>
                                                        </>
                                                    ) : addedToCart[photo.id] ? (
                                                        '✓ Added'
                                                    ) : (
                                                        <>
                                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ marginRight: '4px' }}>
                                                                <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-1.6 4.4M17 13l1.6 4.4M9 21a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm8 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                            </svg>
                                                            Add to Cart
                                                        </>
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>

                        {isAddingMore && (
                            <div className="load-more-container">
                                <div className="loading-spinner small"></div>
                                <p>Loading more breathtaking moments...</p>
                            </div>
                        )}

                        {!hasMore && photos.length > 0 && (
                            <div className="end-of-grid">
                                <p>You've seen all our current captures. Check back soon for more!</p>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default ExplorePage;
