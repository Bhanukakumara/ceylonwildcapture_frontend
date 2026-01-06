import Hero from '../../components/layout/Hero.tsx';
import FeaturedPhotos from '../../components/layout/FeaturedPhotos.tsx';
import Categories from '../../components/Categories.tsx';
import Photographers from '../../components/Photographers.tsx';

const HomePage = () => {
    return (
        <>
            <Hero />
            <FeaturedPhotos />
            <Categories />
            <Photographers />
        </>
    );
};

export default HomePage;
