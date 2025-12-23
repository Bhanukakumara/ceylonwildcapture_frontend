import { Link } from 'react-router-dom';
import './AboutPage.css';

const AboutPage = () => {
    return (
        <div className="about-page">
            <section className="about-hero">
                <div className="container">
                    <h1 className="page-title">About Ceylon Wild Capture</h1>
                    <p className="page-subtitle">
                        Celebrating Sri Lanka's incredible wildlife through the lens of talented photographers
                    </p>
                </div>
            </section>

            <section className="about-content">
                <div className="container">
                    {/* Mission Section */}
                    <div className="about-section">
                        <h2>Our Mission</h2>
                        <p>
                            Ceylon Wild Capture is dedicated to showcasing the breathtaking wildlife of Sri Lanka while supporting
                            the talented photographers who capture these incredible moments. We believe in the power of photography
                            to inspire conservation and appreciation for our natural world.
                        </p>
                        <p>
                            Our platform connects wildlife enthusiasts, researchers, and nature lovers with high-quality, authentic
                            wildlife photography from across Sri Lanka's diverse ecosystems - from the misty highlands to the coastal
                            wetlands, and from dense rainforests to arid plains.
                        </p>
                    </div>

                    {/* What We Do */}
                    <div className="about-section">
                        <h2>What We Do</h2>
                        <div className="features-grid">
                            <div className="feature-card">
                                <div className="feature-icon">
                                    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                                        <rect x="4" y="8" width="24" height="20" rx="2" stroke="currentColor" strokeWidth="2" />
                                        <circle cx="16" cy="18" r="4" stroke="currentColor" strokeWidth="2" />
                                        <path d="M10 8L12 4h8l2 4" stroke="currentColor" strokeWidth="2" />
                                    </svg>
                                </div>
                                <h3>Curated Collection</h3>
                                <p>We carefully curate a stunning collection of wildlife photographs from Sri Lanka's best photographers.</p>
                            </div>

                            <div className="feature-card">
                                <div className="feature-icon">
                                    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                                        <path d="M16 4v24M4 16h24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                        <circle cx="16" cy="16" r="12" stroke="currentColor" strokeWidth="2" />
                                    </svg>
                                </div>
                                <h3>Support Photographers</h3>
                                <p>We provide a platform for photographers to showcase and monetize their wildlife photography.</p>
                            </div>

                            <div className="feature-card">
                                <div className="feature-icon">
                                    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                                        <path d="M16 2l4 8h8l-6 6 2 8-8-4-8 4 2-8-6-6h8z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
                                    </svg>
                                </div>
                                <h3>Quality Assurance</h3>
                                <p>Every photo is reviewed to ensure the highest quality and authentic wildlife moments.</p>
                            </div>

                            <div className="feature-card">
                                <div className="feature-icon">
                                    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                                        <path d="M28 16c0 6.627-5.373 12-12 12m12-12c0-6.627-5.373-12-12-12m12 12H4m12 12C9.373 28 4 22.627 4 16m12 12c2.21 0 4-5.373 4-12s-1.79-12-4-12m0 24c-2.21 0-4-5.373-4-12s1.79-12 4-12M4 16c0-6.627 5.373-12 12-12" stroke="currentColor" strokeWidth="2" />
                                    </svg>
                                </div>
                                <h3>Conservation Focus</h3>
                                <p>A portion of proceeds supports wildlife conservation efforts in Sri Lanka.</p>
                            </div>
                        </div>
                    </div>

                    {/* Why Choose Us */}
                    <div className="about-section">
                        <h2>Why Choose Ceylon Wild Capture</h2>
                        <div className="why-grid">
                            <div className="why-item">
                                <h3>🎯 Authentic Wildlife Moments</h3>
                                <p>Every photograph captures genuine wildlife behavior in their natural habitats across Sri Lanka.</p>
                            </div>
                            <div className="why-item">
                                <h3>📸 Professional Quality</h3>
                                <p>High-resolution images from experienced wildlife photographers using professional equipment.</p>
                            </div>
                            <div className="why-item">
                                <h3>🌿 Ethical Photography</h3>
                                <p>All our photographers follow strict ethical guidelines to ensure wildlife welfare comes first.</p>
                            </div>
                            <div className="why-item">
                                <h3>💼 Flexible Licensing</h3>
                                <p>Choose from personal or commercial licenses to suit your specific needs.</p>
                            </div>
                            <div className="why-item">
                                <h3>🔒 Secure Transactions</h3>
                                <p>Safe and secure payment processing with instant digital delivery.</p>
                            </div>
                            <div className="why-item">
                                <h3>🤝 Community Driven</h3>
                                <p>Join a community of wildlife enthusiasts and conservation supporters.</p>
                            </div>
                        </div>
                    </div>

                    {/* Our Story */}
                    <div className="about-section story-section">
                        <h2>Our Story</h2>
                        <p>
                            Ceylon Wild Capture was born from a passion for Sri Lanka's incredible biodiversity and a desire to
                            create a sustainable platform for wildlife photographers. Sri Lanka, despite its small size, is home
                            to an astonishing variety of wildlife - from majestic elephants and elusive leopards to vibrant
                            endemic birds and rare amphibians.
                        </p>
                        <p>
                            We recognized that while many talented photographers were capturing these amazing moments, there
                            wasn't a dedicated platform to showcase and monetize their work while making it accessible to
                            those who appreciate wildlife photography. Ceylon Wild Capture bridges this gap.
                        </p>
                        <p>
                            Today, we're proud to be Sri Lanka's premier wildlife photography marketplace, supporting both
                            photographers and conservation efforts while sharing the beauty of our island's wildlife with
                            the world.
                        </p>
                    </div>

                    {/* Call to Action */}
                    <div className="about-cta">
                        <h2>Join Our Community</h2>
                        <p>Whether you're a photographer, wildlife enthusiast, or simply appreciate nature's beauty,
                            there's a place for you at Ceylon Wild Capture.</p>
                        <div className="cta-buttons">
                            <Link to="/explore" className="btn btn-primary btn-lg">
                                Explore Photos
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                    <path d="M4 10h12M12 6l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </Link>
                            <Link to="/contact" className="btn btn-secondary btn-lg">
                                Get in Touch
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default AboutPage;
