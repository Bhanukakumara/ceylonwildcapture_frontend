import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { publicStatsApi } from '../services/api';
import './Hero.css';

const Hero = () => {
    const [query, setQuery] = useState('');
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        photos: 10000,
        photographers: 500,
        species: 50
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const data = await publicStatsApi.getStats();

                setStats({
                    photos: data?.totalPhotos || 10000,
                    photographers: data?.totalPhotographers || 500,
                    species: data?.totalCategories || 50
                });
            } catch (error) {
                console.error('Failed to fetch stats:', error);
                // Keep default values on error
            }
        };

        fetchStats();
    }, []);

    const handleSearch = (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (query.trim()) {
            navigate(`/explore?search=${encodeURIComponent(query.trim())}`);
        } else {
            navigate('/explore');
        }
    };
    return (
        <section className="hero" id="home">
            <div className="hero-background">
                <img
                    src="/src/assets/hero-elephant.png"
                    alt="Majestic elephant in golden hour"
                    className="hero-image"
                />
                <div className="hero-overlay"></div>
            </div>

            <div className="hero-content">
                <div className="container">
                    <div className="hero-text">
                        <h1 className="hero-title" data-aos="fade-up">
                            Capture the <span className="gradient-text">Wild Beauty</span> of Ceylon
                        </h1>
                        <p className="hero-subtitle" data-aos="fade-up" data-aos-delay="100">
                            Discover and purchase stunning wildlife photography from Sri Lanka's most talented photographers.
                            Every image tells a story of nature's magnificence.
                        </p>

                        <form className="hero-search" data-aos="fade-up" data-aos-delay="200" onSubmit={handleSearch}>
                            <div className="search-input-wrapper">
                                <svg className="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none">
                                    <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
                                    <path d="M16 16L21 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                </svg>
                                <input
                                    type="text"
                                    placeholder="Search for elephants, leopards, birds..."
                                    className="search-input"
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                />
                            </div>
                            <button type="submit" className="btn btn-primary search-btn">Search</button>
                        </form>

                        <div className="hero-stats" data-aos="fade-up" data-aos-delay="300">
                            <div className="stat">
                                <div className="stat-number">{stats.photos.toLocaleString()}+</div>
                                <div className="stat-label">Photos</div>
                            </div>
                            <div className="stat-divider"></div>
                            <div className="stat">
                                <div className="stat-number">{stats.photographers}+</div>
                                <div className="stat-label">Photographers</div>
                            </div>
                            <div className="stat-divider"></div>
                            <div className="stat">
                                <div className="stat-number">{stats.species}+</div>
                                <div className="stat-label">Species</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="scroll-indicator">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M12 5v14M12 19l-4-4M12 19l4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </div>
        </section>
    );
};

export default Hero;
