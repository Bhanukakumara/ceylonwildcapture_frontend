import { Outlet } from 'react-router-dom';
import Header from '../components/layout/Header.tsx';
import Footer from '../components/layout/Footer.tsx';

const MainLayout = () => {
    return (
        <div className="main-layout">
            <Header />
            <main className="main-content">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
};

export default MainLayout;
