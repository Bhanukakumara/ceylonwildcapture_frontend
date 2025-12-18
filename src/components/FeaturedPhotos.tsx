import { Link } from 'react-router-dom';
import './FeaturedPhotos.css';

interface Photo {
    id: number;
    title: string;
    photographer: string;
    price: number;
    image: string;
    category: string;
}

const photos: Photo[] = [
    {
        id: 1,
        title: "Leopard's Gaze",
        photographer: "Rajitha Silva",
        price: 149,
        image: "/src/assets/featured-leopard.png",
        category: "Mammals"
    },
    {
        id: 2,
        title: "Kingfisher Moment",
        photographer: "Amara Fernando",
        price: 99,
        image: "/src/assets/featured-kingfisher.png",
        category: "Birds"
    },
    {
        id: 3,
        title: "Sunset Migration",
        photographer: "Nuwan Perera",
        price: 199,
        image: "/src/assets/featured-elephants-sunset.png",
        category: "Landscapes"
    },
    {
        id: 4,
        title: "Sloth Bear",
        photographer: "Kasun Jayawardena",
        price: 129,
        image: "/src/assets/featured-sloth-bear.png",
        category: "Mammals"
    },
    {
        id: 5,
        title: "Peacock Display",
        photographer: "Dilshan Mendis",
        price: 89,
        image: "/src/assets/featured-peacock.png",
        category: "Birds"
    },
    {
        id: 6,
        title: "Misty Mountains",
        photographer: "Tharaka Wijesinghe",
        price: 179,
        image: "/src/assets/featured-landscape.png",
        category: "Landscapes"
    }
];

const FeaturedPhotos = () => {
    return (
        <section className="featured-photos section" id="explore">
            <div className="container">
                <div className="section-header">
                    <h2 className="section-title animate-fade-in-up">Featured Collection</h2>
                    <p className="section-subtitle animate-fade-in-up stagger-1">
                        Handpicked masterpieces from our talented community of wildlife photographers
                    </p>
                </div>

                <div className="photos-grid">
                    {photos.map((photo, index) => (
                        <Link
                            key={photo.id}
                            to={`/photo/${photo.id}`}
                            className={`photo-card animate-scale-in stagger-${(index % 6) + 1}`}
                        >
                            <div className="photo-image-wrapper image-zoom">
                                <img src={photo.image} alt={photo.title} className="photo-image" />
                                <div className="photo-overlay">
                                    <div className="photo-actions">
                                        <button className="btn btn-ghost btn-icon" aria-label="Quick view" onClick={(e) => e.preventDefault()}>
                                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                                <path d="M10 4C5 4 1.73 7.11 1 10c.73 2.89 4 6 9 6s8.27-3.11 9-6c-.73-2.89-4-6-9-6z" stroke="currentColor" strokeWidth="2" />
                                                <circle cx="10" cy="10" r="3" stroke="currentColor" strokeWidth="2" />
                                            </svg>
                                        </button>
                                        <button className="btn btn-primary btn-icon" aria-label="Add to cart" onClick={(e) => e.preventDefault()}>
                                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                                <path d="M2 2h2l3.6 12h8.8l3.6-8H6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="photo-info glass-dark">
                                <div className="photo-header">
                                    <div>
                                        <h3 className="photo-title">{photo.title}</h3>
                                        <p className="photo-photographer">by {photo.photographer}</p>
                                    </div>
                                    <div className="photo-price">${photo.price}</div>
                                </div>
                                <div className="photo-footer">
                                    <span className="photo-category">{photo.category}</span>
                                    <span className="btn-link">
                                        View Details
                                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                            <path d="M6 12l4-4-4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                <div className="section-cta">
                    <button className="btn btn-secondary btn-lg">
                        Explore All Photos
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                            <path d="M4 10h12M12 6l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                </div>
            </div>
        </section>
    );
};

export default FeaturedPhotos;
