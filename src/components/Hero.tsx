import { useEffect, useState } from 'react';
import './Hero.css';

const Hero = () => {
    const [scrollY, setScrollY] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            setScrollY(window.scrollY);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <section className="hero" id="home">
            <div
                className="hero-background"
                style={{ transform: `translateY(${scrollY * 0.5}px)` }}
            >
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

                        <div className="hero-search" data-aos="fade-up" data-aos-delay="200">
                            <svg className="search-icon" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
                                <path d="M16 16L21 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                            </svg>
                            <input
                                type="text"
                                placeholder="Search for elephants, leopards, birds..."
                                className="search-input"
                            />
                            <button className="btn btn-primary search-btn">Search</button>
                        </div>

                        <div className="hero-stats" data-aos="fade-up" data-aos-delay="300">
                            <div className="stat">
                                <div className="stat-number">10,000+</div>
                                <div className="stat-label">Photos</div>
                            </div>
                            <div className="stat-divider"></div>
                            <div className="stat">
                                <div className="stat-number">500+</div>
                                <div className="stat-label">Photographers</div>
                            </div>
                            <div className="stat-divider"></div>
                            <div className="stat">
                                <div className="stat-number">50+</div>
                                <div className="stat-label">Species</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="scroll-indicator animate-float">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M12 5v14M12 19l-4-4M12 19l4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </div>
        </section>
    );
};

export default Hero;
