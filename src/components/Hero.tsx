import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { publicStatsApi } from '../services/api';
import { Title, Paragraph, Button, Input, Text } from './ui';
import './Hero.css';

const Hero = () => {
    const [query, setQuery] = useState('');
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        photos: 0,
        photographers: 0,
        species: 0
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const data = await publicStatsApi.getStats();

                setStats({
                    photos: data?.totalPhotos,
                    photographers: data?.totalPhotographers,
                    species: data?.totalCategories
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
                        <Title
                            level={1}
                            className="hero-title"
                            dataAos="fade-up"
                        >
                            Capture the <span className="gradient-text">Wild Beauty</span> of Ceylon
                        </Title>

                        <Paragraph
                            className="hero-subtitle"
                            size="lg"
                            color="light"
                            dataAos="fade-up"
                            dataAosDelay="100"
                        >
                            Discover and purchase stunning wildlife photography from Sri Lanka's most talented photographers.
                            Every image tells a story of nature's magnificence.
                        </Paragraph>

                        <form className="hero-search" data-aos="fade-up" data-aos-delay="200" onSubmit={handleSearch}>
                            <Input
                                type="search"
                                placeholder="Search for elephants, leopards, birds..."
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                icon={
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                        <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
                                        <path d="M16 16L21 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                    </svg>
                                }
                                iconPosition="left"
                                className="hero-search-input"
                            />
                            <Button type="submit" variant="primary" className="search-btn">
                                Search
                            </Button>
                        </form>

                        <div className="hero-stats" data-aos="fade-up" data-aos-delay="300">
                            <div className="stat">
                                <Text as="div" className="stat-number" size="xl" weight="bold" color="gradient">
                                    {stats.photos.toLocaleString()}+
                                </Text>
                                <Text as="div" className="stat-label" size="sm" color="light">
                                    Photos
                                </Text>
                            </div>
                            <div className="stat-divider"></div>
                            <div className="stat">
                                <Text as="div" className="stat-number" size="xl" weight="bold" color="gradient">
                                    {stats.photographers}+
                                </Text>
                                <Text as="div" className="stat-label" size="sm" color="light">
                                    Photographers
                                </Text>
                            </div>
                            <div className="stat-divider"></div>
                            <div className="stat">
                                <Text as="div" className="stat-number" size="xl" weight="bold" color="gradient">
                                    {stats.species}+
                                </Text>
                                <Text as="div" className="stat-label" size="sm" color="light">
                                    Species
                                </Text>
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

