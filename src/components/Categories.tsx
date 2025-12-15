import './Categories.css';

interface Category {
    id: number;
    name: string;
    count: number;
    icon: string;
    color: string;
}

const categories: Category[] = [
    { id: 1, name: "Mammals", count: 2847, icon: "🦁", color: "#ff6b35" },
    { id: 2, name: "Birds", count: 4521, icon: "🦜", color: "#4a90e2" },
    { id: 3, name: "Reptiles", count: 1234, icon: "🦎", color: "#2d7a52" },
    { id: 4, name: "Landscapes", count: 3156, icon: "🏔️", color: "#8b6f47" },
    { id: 5, name: "Marine Life", count: 987, icon: "🐠", color: "#00a8cc" },
    { id: 6, name: "Insects", count: 1876, icon: "🦋", color: "#f7931e" },
];

const Categories = () => {
    return (
        <section className="categories section" id="categories">
            <div className="container">
                <div className="section-header">
                    <h2 className="section-title animate-fade-in-up">Explore by Category</h2>
                    <p className="section-subtitle animate-fade-in-up stagger-1">
                        Browse through our diverse collection of wildlife photography
                    </p>
                </div>

                <div className="categories-grid">
                    {categories.map((category, index) => (
                        <div
                            key={category.id}
                            className={`category-card hover-lift animate-scale-in stagger-${(index % 6) + 1}`}
                            style={{ '--category-color': category.color } as React.CSSProperties}
                        >
                            <div className="category-icon">{category.icon}</div>
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
