import { Link } from 'react-router-dom';
import { Title, Paragraph, Button, Card } from '../../components/ui';
import './AboutPage.css';

// Feature cards data
const features = [
    {
        id: 1,
        icon: (
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <rect x="4" y="8" width="24" height="20" rx="2" stroke="currentColor" strokeWidth="2" />
                <circle cx="16" cy="18" r="4" stroke="currentColor" strokeWidth="2" />
                <path d="M10 8L12 4h8l2 4" stroke="currentColor" strokeWidth="2" />
            </svg>
        ),
        title: 'Curated Collection',
        description: 'We carefully curate a stunning collection of wildlife photographs from Sri Lanka\'s best photographers.'
    },
    {
        id: 2,
        icon: (
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <path d="M16 4v24M4 16h24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <circle cx="16" cy="16" r="12" stroke="currentColor" strokeWidth="2" />
            </svg>
        ),
        title: 'Support Photographers',
        description: 'We provide a platform for photographers to showcase and monetize their wildlife photography.'
    },
    {
        id: 3,
        icon: (
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <path d="M16 2l4 8h8l-6 6 2 8-8-4-8 4 2-8-6-6h8z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
            </svg>
        ),
        title: 'Quality Assurance',
        description: 'Every photo is reviewed to ensure the highest quality and authentic wildlife moments.'
    },
    {
        id: 4,
        icon: (
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <path d="M28 16c0 6.627-5.373 12-12 12m12-12c0-6.627-5.373-12-12-12m12 12H4m12 12C9.373 28 4 22.627 4 16m12 12c2.21 0 4-5.373 4-12s-1.79-12-4-12m0 24c-2.21 0-4-5.373-4-12s1.79-12 4-12M4 16c0-6.627 5.373-12 12-12" stroke="currentColor" strokeWidth="2" />
            </svg>
        ),
        title: 'Conservation Focus',
        description: 'A portion of proceeds supports wildlife conservation efforts in Sri Lanka.'
    }
];

// Why choose us data
const whyChooseUs = [
    {
        id: 1,
        emoji: '🎯',
        title: 'Authentic Wildlife Moments',
        description: 'Every photograph captures genuine wildlife behavior in their natural habitats across Sri Lanka.'
    },
    {
        id: 2,
        emoji: '📸',
        title: 'Professional Quality',
        description: 'High-resolution images from experienced wildlife photographers using professional equipment.'
    },
    {
        id: 3,
        emoji: '🌿',
        title: 'Ethical Photography',
        description: 'All our photographers follow strict ethical guidelines to ensure wildlife welfare comes first.'
    },
    {
        id: 4,
        emoji: '💼',
        title: 'Flexible Licensing',
        description: 'Choose from personal or commercial licenses to suit your specific needs.'
    },
    {
        id: 5,
        emoji: '🔒',
        title: 'Secure Transactions',
        description: 'Safe and secure payment processing with instant digital delivery.'
    },
    {
        id: 6,
        emoji: '🤝',
        title: 'Community Driven',
        description: 'Join a community of wildlife enthusiasts and conservation supporters.'
    }
];

const AboutPage = () => {
    return (
        <div className="about-page">
            <section className="about-hero">
                <div className="container">
                    <Title level={1} className="page-title">
                        About Ceylon Wild Capture
                    </Title>
                    <Paragraph className="page-subtitle" size="lg" color="light">
                        Celebrating Sri Lanka's incredible wildlife through the lens of talented photographers
                    </Paragraph>
                </div>
            </section>

            <section className="about-content">
                <div className="container">
                    {/* Mission Section */}
                    <div className="about-section">
                        <Title level={2}>Our Mission</Title>
                        <Paragraph>
                            Ceylon Wild Capture is dedicated to showcasing the breathtaking wildlife of Sri Lanka while supporting
                            the talented photographers who capture these incredible moments. We believe in the power of photography
                            to inspire conservation and appreciation for our natural world.
                        </Paragraph>
                        <Paragraph>
                            Our platform connects wildlife enthusiasts, researchers, and nature lovers with high-quality, authentic
                            wildlife photography from across Sri Lanka's diverse ecosystems - from the misty highlands to the coastal
                            wetlands, and from dense rainforests to arid plains.
                        </Paragraph>
                    </div>

                    {/* What We Do */}
                    <div className="about-section">
                        <Title level={2}>What We Do</Title>
                        <div className="features-grid">
                            {features.map((feature) => (
                                <Card key={feature.id} variant="feature" hover>
                                    <div className="feature-icon">
                                        {feature.icon}
                                    </div>
                                    <Title level={5}>{feature.title}</Title>
                                    <Paragraph size="sm" color="muted">
                                        {feature.description}
                                    </Paragraph>
                                </Card>
                            ))}
                        </div>
                    </div>

                    {/* Why Choose Us */}
                    <div className="about-section">
                        <Title level={2}>Why Choose Ceylon Wild Capture</Title>
                        <div className="why-grid">
                            {whyChooseUs.map((item) => (
                                <Card key={item.id} className="why-item">
                                    <Title level={3}>{item.emoji} {item.title}</Title>
                                    <Paragraph size="sm" color="muted">
                                        {item.description}
                                    </Paragraph>
                                </Card>
                            ))}
                        </div>
                    </div>

                    {/* Our Story */}
                    <div className="about-section story-section">
                        <Title level={2}>Our Story</Title>
                        <Paragraph>
                            Ceylon Wild Capture was born from a passion for Sri Lanka's incredible biodiversity and a desire to
                            create a sustainable platform for wildlife photographers. Sri Lanka, despite its small size, is home
                            to an astonishing variety of wildlife - from majestic elephants and elusive leopards to vibrant
                            endemic birds and rare amphibians.
                        </Paragraph>
                        <Paragraph>
                            We recognized that while many talented photographers were capturing these amazing moments, there
                            wasn't a dedicated platform to showcase and monetize their work while making it accessible to
                            those who appreciate wildlife photography. Ceylon Wild Capture bridges this gap.
                        </Paragraph>
                        <Paragraph>
                            Today, we're proud to be Sri Lanka's premier wildlife photography marketplace, supporting both
                            photographers and conservation efforts while sharing the beauty of our island's wildlife with
                            the world.
                        </Paragraph>
                    </div>

                    {/* Call to Action */}
                    <div className="about-cta">
                        <Title level={2}>Join Our Community</Title>
                        <Paragraph>
                            Whether you're a photographer, wildlife enthusiast, or simply appreciate nature's beauty,
                            there's a place for you at Ceylon Wild Capture.
                        </Paragraph>
                        <div className="cta-buttons">
                            <Link to="/explore">
                                <Button
                                    variant="primary"
                                    size="lg"
                                    icon={
                                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                            <path d="M4 10h12M12 6l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    }
                                    iconPosition="right"
                                >
                                    Explore Photos
                                </Button>
                            </Link>
                            <Link to="/contact">
                                <Button variant="secondary" size="lg">
                                    Get in Touch
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default AboutPage;
