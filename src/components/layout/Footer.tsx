import { Link } from 'react-router-dom';
import { Title, Paragraph, Text } from '../ui';
import './Footer.css';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-content">
                    {/* Brand Section */}
                    <div className="footer-section">
                        <div className="footer-brand">
                            <svg className="footer-logo" viewBox="0 0 40 40" fill="none">
                                <circle cx="20" cy="20" r="18" stroke="currentColor" strokeWidth="2" />
                                <path d="M20 10 L28 20 L20 30 L12 20 Z" fill="currentColor" />
                            </svg>
                            <Text as="span" className="footer-brand-name" weight="semibold">
                                Ceylon Wild Capture
                            </Text>
                        </div>
                        <Paragraph className="footer-description" size="sm" color="muted">
                            Discover and purchase stunning wildlife photography from Sri Lanka's most talented photographers.
                        </Paragraph>
                        <div className="footer-social">
                            <a href="https://www.facebook.com/share/1CyUXkctJV/" className="social-link" aria-label="Facebook">
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M20 10c0-5.523-4.477-10-10-10S0 4.477 0 10c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V10h2.54V7.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V10h2.773l-.443 2.89h-2.33v6.988C16.343 19.128 20 14.991 20 10z" />
                                </svg>
                            </a>
                            <a href="https://www.instagram.com/macro_by_thilina?igsh=MTQwNmtyZGhwNTcyNA==" className="social-link" aria-label="Instagram">
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M10 0C7.284 0 6.944.012 5.877.06 4.813.11 4.086.278 3.45.525a4.92 4.92 0 00-1.772 1.153A4.92 4.92 0 00.525 3.45C.278 4.086.109 4.813.06 5.877.012 6.944 0 7.284 0 10s.012 3.056.06 4.123c.05 1.064.218 1.791.465 2.427a4.92 4.92 0 001.153 1.772 4.92 4.92 0 001.772 1.153c.636.247 1.363.416 2.427.465 1.067.048 1.407.06 4.123.06s3.056-.012 4.123-.06c1.064-.05 1.791-.218 2.427-.465a4.92 4.92 0 001.772-1.153 4.92 4.92 0 001.153-1.772c.247-.636.416-1.363.465-2.427.048-1.067.06-1.407.06-4.123s-.012-3.056-.06-4.123c-.05-1.064-.218-1.791-.465-2.427a4.92 4.92 0 00-1.153-1.772A4.92 4.92 0 0016.55.525C15.914.278 15.187.109 14.123.06 13.056.012 12.716 0 10 0zm0 1.802c2.67 0 2.987.01 4.041.059.976.045 1.505.207 1.858.344.466.181.8.398 1.15.748.35.35.567.684.748 1.15.137.353.3.882.344 1.857.048 1.055.058 1.37.058 4.04 0 2.671-.01 2.986-.058 4.041-.045.976-.207 1.505-.344 1.858-.181.466-.398.8-.748 1.15-.35.35-.684.567-1.15.748-.353.137-.882.3-1.857.344-1.054.048-1.37.058-4.041.058-2.67 0-2.987-.01-4.04-.058-.976-.045-1.505-.207-1.858-.344a3.097 3.097 0 01-1.15-.748 3.097 3.097 0 01-.748-1.15c-.137-.353-.3-.882-.344-1.857-.048-1.055-.058-1.37-.058-4.041 0-2.67.01-2.986.058-4.04.045-.976.207-1.505.344-1.858.181-.466.398-.8.748-1.15.35-.35.684-.567 1.15-.748.353-.137.882-.3 1.857-.344 1.055-.048 1.37-.058 4.041-.058z" />
                                    <path d="M10 13.333a3.333 3.333 0 110-6.666 3.333 3.333 0 010 6.666zm0-8.468a5.135 5.135 0 100 10.27 5.135 5.135 0 000-10.27zm6.538-.203a1.2 1.2 0 11-2.4 0 1.2 1.2 0 012.4 0z" />
                                </svg>
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="footer-section">
                        <Title level={4} className="footer-heading">
                            Quick Links
                        </Title>
                        <ul className="footer-links">
                            <li><Link to="/explore">Explore Photos</Link></li>
                            <li><a href="#categories">Categories</a></li>
                            <li><a href="#photographers">Photographers</a></li>
                            <li><Link to="/about">About Us</Link></li>
                        </ul>
                    </div>

                    {/* Support */}
                    <div className="footer-section">
                        <Title level={4} className="footer-heading">
                            Support
                        </Title>
                        <ul className="footer-links">
                            <li><Link to="/contact">Contact Us</Link></li>
                            <li><Link to="/faq">FAQ</Link></li>
                        </ul>
                    </div>

                    {/* Legal */}
                    <div className="footer-section">
                        <Title level={4} className="footer-heading">
                            Legal
                        </Title>
                        <ul className="footer-links">
                            <li><Link to="/terms">Terms of Service</Link></li>
                            <li><Link to="/privacy">Privacy Policy</Link></li>
                            <li><Link to="/cookies">Cookie Policy</Link></li>
                            <li><Link to="/copyright">Copyright</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="footer-bottom">
                    <Text as="p" className="footer-copyright" size="sm" color="muted">
                        © {new Date().getFullYear()} Ceylon Wild Capture. All rights reserved.
                    </Text>
                    <Text as="p" className="footer-tagline" size="sm" color="muted">
                        Made by Bhanuka Kumara
                    </Text>
                </div>
            </div>
        </footer>
    );
};

export default Footer;

