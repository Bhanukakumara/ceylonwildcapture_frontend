import { useState, useEffect } from 'react';
import { categoryApi } from '../services/api';
import './Categories.css';

interface Category {
    id: number;
    name: string;
    count: number;
    icon: string;
    color: string;
    imageUrl?: string;
}

// Icon and color mapping for common wildlife categories
const getCategoryIcon = (name: string): string => {
    const lowerName = name.toLowerCase();
    if (lowerName.includes('mammal') || lowerName.includes('leopard') || lowerName.includes('elephant')) return '🦁';
    if (lowerName.includes('bird')) return '�';
    if (lowerName.includes('reptile') || lowerName.includes('snake') || lowerName.includes('lizard')) return '🦎';
    if (lowerName.includes('landscape') || lowerName.includes('mountain') || lowerName.includes('forest')) return '🏔️';
    if (lowerName.includes('marine') || lowerName.includes('fish') || lowerName.includes('ocean')) return '🐠';
    if (lowerName.includes('insect') || lowerName.includes('butterfly') || lowerName.includes('bee')) return '🦋';
    if (lowerName.includes('amphibian') || lowerName.includes('frog')) return '🐸';
    if (lowerName.includes('plant') || lowerName.includes('flora')) return '🌿';
    return '📷'; // Default camera icon
};

const getCategoryColor = (index: number): string => {
    const colors = ['#ff6b35', '#4a90e2', '#2d7a52', '#8b6f47', '#00a8cc', '#f7931e'];
    return colors[index % colors.length];
};

const Categories = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                setLoading(true);
                // Fetch categories with photo count
                const response = await categoryApi.getCategoriesWithPhotoCount(0, 6);

                // Map backend categories to frontend format
                // Backend returns: [[category, photoCount], ...]
                const mappedCategories: Category[] = (response.content || []).map((item: any, index: number) => {
                    const category = item[0]; // Category object is first element
                    const photoCount = item[1]; // Photo count is second element

                    return {
                        id: category.id,
                        name: category.name,
                        count: photoCount,
                        icon: getCategoryIcon(category.name),
                        color: getCategoryColor(index),
                        imageUrl: category.imageUrl // Include imageUrl from backend
                    };
                });

                setCategories(mappedCategories);
            } catch (error) {
                console.error('Failed to fetch categories:', error);
                // Keep empty array on error
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
    }, []);

    if (loading) {
        return (
            <section className="categories section" id="categories">
                <div className="container">
                    <div className="section-header">
                        <h2 className="section-title" data-aos="fade-up">Explore by Category</h2>
                        <p className="section-subtitle" data-aos="fade-up" data-aos-delay="100">
                            Browse through our diverse collection of wildlife photography
                        </p>
                    </div>
                    <div className="loading-container">
                        <div className="loading-spinner"></div>
                        <p>Loading categories...</p>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="categories section" id="categories">
            <div className="container">
                <div className="section-header">
                    <h2 className="section-title" data-aos="fade-up">Explore by Category</h2>
                    <p className="section-subtitle" data-aos="fade-up" data-aos-delay="100">
                        Browse through our diverse collection of wildlife photography
                    </p>
                </div>

                <div className="categories-grid">
                    {categories.map((category, index) => (
                        <div
                            key={category.id}
                            className="category-card hover-lift"
                            data-aos="zoom-in"
                            data-aos-delay={(index % 6) * 100}
                            style={{ '--category-color': category.color } as React.CSSProperties}
                        >
                            {category.imageUrl ? (
                                <div className="category-image-wrapper">
                                    <img src={category.imageUrl} alt={category.name} className="category-image" />
                                </div>
                            ) : (
                                <div className="category-icon">{category.icon}</div>
                            )}
                            <h3 className="category-name">{category.name}</h3>
                            <p className="category-count">{category.count.toLocaleString()} photos</p>
                            <div className="category-arrow">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                    <path d="M7 17l10-10M17 7H7v10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                            <div className="category-glow"></div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Categories;
