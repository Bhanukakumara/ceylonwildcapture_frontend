import './Photographers.css';

interface Photographer {
    id: number;
    name: string;
    specialty: string;
    photoCount: number;
    avatar: string;
    featured: boolean;
}

const photographers: Photographer[] = [
    {
        id: 1,
        name: "Rajitha Silva",
        specialty: "Big Cats & Mammals",
        photoCount: 342,
        avatar: "👨‍🎨",
        featured: true
    },
    {
        id: 2,
        name: "Amara Fernando",
        specialty: "Bird Photography",
        photoCount: 567,
        avatar: "👩‍🎨",
        featured: true
    },
    {
        id: 3,
        name: "Nuwan Perera",
        specialty: "Landscape & Wildlife",
        photoCount: 423,
        avatar: "🧑‍🎨",
        featured: true
    },
    {
        id: 4,
        name: "Kasun Jayawardena",
        specialty: "Macro & Insects",
        photoCount: 289,
        avatar: "👨‍🎨",
        featured: false
    }
];

const Photographers = () => {
    return (
        <section className="photographers section-sm" id="photographers">
            <div className="container">
                <div className="section-header">
                    <h2 className="section-title animate-fade-in-up">Featured Photographers</h2>
                    <p className="section-subtitle animate-fade-in-up stagger-1">
                        Meet the talented artists behind these stunning captures
                    </p>
                </div>

                <div className="photographers-grid">
                    {photographers.map((photographer, index) => (
                        <div
                            key={photographer.id}
                            className={`photographer-card glass hover-lift animate-scale-in stagger-${(index % 4) + 1}`}
                        >
                            <div className="photographer-avatar">
                                <div className="avatar-icon">{photographer.avatar}</div>
                                {photographer.featured && (
                                    <div className="featured-badge">
                                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                            <path d="M8 1l2 5h5l-4 3.5 2 5.5-5-3.5-5 3.5 2-5.5-4-3.5h5z" fill="currentColor" />
                                        </svg>
                                    </div>
                                )}
                            </div>

                            <div className="photographer-info">
                                <h3 className="photographer-name">{photographer.name}</h3>
                                <p className="photographer-specialty">{photographer.specialty}</p>
                                <div className="photographer-stats">
                                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                        <rect x="2" y="4" width="12" height="10" rx="2" stroke="currentColor" strokeWidth="1.5" />
                                        <circle cx="8" cy="9" r="2" stroke="currentColor" strokeWidth="1.5" />
                                        <path d="M5 4L6 2h4l1 2" stroke="currentColor" strokeWidth="1.5" />
                                    </svg>
                                    <span>{photographer.photoCount} photos</span>
                                </div>
                            </div>

                            <button className="btn btn-ghost btn-full">
                                View Portfolio
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                    <path d="M6 12l4-4-4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </button>
                        </div>
                    ))}
                </div>

                <div className="section-cta">
                    <button className="btn btn-secondary">
                        View All Photographers
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                            <path d="M4 10h12M12 6l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                </div>
            </div>
        </section>
    );
};

export default Photographers;
