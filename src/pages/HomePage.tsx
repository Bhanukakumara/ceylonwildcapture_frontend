import Hero from '../components/Hero';
import FeaturedPhotos from '../components/FeaturedPhotos';
import Categories from '../components/Categories';
import Photographers from '../components/Photographers';
import CallToAction from '../components/CallToAction';

const HomePage = () => {
    return (
        <>
            <Hero />
            <FeaturedPhotos />
            <Categories />
            <Photographers />
            <CallToAction />
        </>
    );
};

export default HomePage;
