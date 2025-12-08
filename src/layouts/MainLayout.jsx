// src/layouts/MainLayout.jsx - NO ANIMATIONS VERSION
import { Outlet } from 'react-router-dom';
import Navbar from '../components/shared/Navbar';
import Footer from '../components/shared/Footer';
import ScrollToTop from '../components/shared/ScrollToTop';
import ScrollToTopButton from '../components/shared/ScrollToTopButton';

const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-light-200 dark:bg-dark-300 transition-colors duration-300">
      {/* Auto scroll to top on route change */}
      <ScrollToTop />
      
      {/* Navbar */}
      <Navbar />
      
      {/* Main Content - NO ANIMATION */}
      <main className="flex-1 pt-24 min-h-[calc(100vh-100px)]">
        <Outlet />
      </main>
      
      {/* Footer */}
      <Footer />
      
      {/* Scroll to Top Button */}
      <ScrollToTopButton />
    </div>
  );
};

export default MainLayout;