import { useState, useEffect } from 'react';
import { publicStatsApi } from '../../services/api.ts';
import { Title, Paragraph, Button, Text } from '../ui';
import './Photographers.css';

interface Photographer {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    profileImageUrl: string | null;
    photoCount: number;
}

const Photographers = () => {
    const [photographers, setPhotographers] = useState<Photographer[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPhotographers = async () => {
            try {
                const data = await publicStatsApi.getTopPhotographers(4);
                setPhotographers(Array.isArray(data) ? data : []);
                setError(null);
            } catch (err) {
                console.error('Error fetching photographers:', err);
                setError('Failed to load photographers');
            } finally {
                setLoading(false);
            }
        };

        fetchPhotographers();
    }, []);

    if (loading) {
        return (
            <section className="photographers section-sm" id="photographers">
                <div className="container">
                    <div className="section-header">
                        <Title level={2} className="section-title">
                            Top Photographers
                        </Title>
                        <Paragraph className="section-subtitle">
                            Loading...
                        </Paragraph>
                    </div>
                </div>
            </section>
        );
    }

    if (error) {
        return (
            <section className="photographers section-sm" id="photographers">
                <div className="container">
                    <div className="section-header">
                        <Title level={2} className="section-title">
                            Top Photographers
                        </Title>
                        <Paragraph className="section-subtitle" style={{ color: 'red' }}>
                            {error}
                        </Paragraph>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="photographers section-sm" id="photographers">
            <div className="container">
                <div className="section-header">
                    <Title level={2} className="section-title">
                        Top Photographers
                    </Title>
                    <Paragraph className="section-subtitle">
                        Our most active photographers with the highest contributions
                    </Paragraph>
                </div>

                <div className="photographers-grid">
                    {photographers.length === 0 ? (
                        <Paragraph style={{ textAlign: 'center', padding: '40px' }}>
                            No photographers found
                        </Paragraph>
                    ) : (
                        photographers.map((photographer) => (
                            <div key={photographer.id} className="photographer-card glass hover-lift">
                                <div className="photographer-avatar">
                                    {photographer.profileImageUrl ? (
                                        <img
                                            src={photographer.profileImageUrl}
                                            alt={`${photographer.firstName} ${photographer.lastName}`}
                                            style={{
                                                width: '80px',
                                                height: '80px',
                                                borderRadius: '50%',
                                                objectFit: 'cover'
                                            }}
                                        />
                                    ) : (
                                        <div className="avatar-icon">👨‍🎨</div>
                                    )}
                                    <div className="featured-badge">
                                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                            <path d="M8 1l2 5h5l-4 3.5 2 5.5-5-3.5-5 3.5 2-5.5-4-3.5h5z" fill="currentColor" />
                                        </svg>
                                    </div>
                                </div>

                                <div className="photographer-info">
                                    <Title level={3} className="photographer-name">
                                        {photographer.firstName} {photographer.lastName}
                                    </Title>
                                    <Text as="p" className="photographer-specialty" size="sm" color="muted">
                                        Wildlife Photography
                                    </Text>
                                    <div className="photographer-stats">
                                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                            <rect x="2" y="4" width="12" height="10" rx="2" stroke="currentColor" strokeWidth="1.5" />
                                            <circle cx="8" cy="9" r="2" stroke="currentColor" strokeWidth="1.5" />
                                            <path d="M5 4L6 2h4l1 2" stroke="currentColor" strokeWidth="1.5" />
                                        </svg>
                                        <Text as="span" size="sm">
                                            {photographer.photoCount} photos
                                        </Text>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                <div className="section-cta">
                    <Button
                        variant="secondary"
                        icon={
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                <path d="M4 10h12M12 6l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        }
                        iconPosition="right"
                    >
                        View All Photographers
                    </Button>
                </div>
            </div>
        </section>
    );
};

export default Photographers;
