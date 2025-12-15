import './CallToAction.css';

const CallToAction = () => {
    return (
        <section className="cta-section section">
            <div className="container">
                <div className="cta-grid">
                    {/* Photographer CTA */}
                    <div className="cta-card cta-photographer glass animate-fade-in-up">
                        <div className="cta-icon">
                            <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                                <rect x="6" y="12" width="36" height="30" rx="4" stroke="currentColor" strokeWidth="3" />
                                <circle cx="24" cy="27" r="6" stroke="currentColor" strokeWidth="3" />
                                <path d="M15 12L18 6h12l3 6" stroke="currentColor" strokeWidth="3" />
                            </svg>
                        </div>
                        <h3 className="cta-title">Are You a Photographer?</h3>
                        <p className="cta-description">
                            Join our community and showcase your wildlife photography to thousands of buyers worldwide.
                        </p>
                        <button className="btn btn-primary">
                            Start Selling
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                <path d="M4 10h12M12 6l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>
                        <ul className="cta-features">
                            <li>
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                    <path d="M3 8l3 3 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                70% revenue share
                            </li>
                            <li>
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                    <path d="M3 8l3 3 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                Global exposure
                            </li>
                            <li>
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                    <path d="M3 8l3 3 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                Easy upload process
                            </li>
                        </ul>
                    </div>

                    {/* Newsletter CTA */}
                    <div className="cta-card cta-newsletter glass animate-fade-in-up stagger-2">
                        <div className="cta-icon">
                            <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                                <rect x="6" y="10" width="36" height="28" rx="4" stroke="currentColor" strokeWidth="3" />
                                <path d="M6 14l18 12 18-12" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                        <h3 className="cta-title">Stay Updated</h3>
                        <p className="cta-description">
                            Subscribe to our newsletter and get exclusive access to new photos, photographer stories, and special offers.
                        </p>
                        <div className="newsletter-form">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="newsletter-input"
                            />
                            <button className="btn btn-primary">Subscribe</button>
                        </div>
                        <p className="newsletter-note">
                            Join 10,000+ wildlife enthusiasts. Unsubscribe anytime.
                        </p>
                    </div>
                </div>
            </div>

            {/* Background decoration */}
            <div className="cta-decoration"></div>
        </section>
    );
};

export default CallToAction;
