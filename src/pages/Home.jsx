// src/pages/Home.jsx
import { motion } from 'framer-motion';
import HeroSection from '../components/home/HeroSection';
import FeaturedServices from '../components/home/FeaturedServices';
import TopRatedServices from '../components/home/TopRatedServices';
import ServiceCategories from '../components/home/ServiceCategories';
import WhyChooseUs from '../components/home/WhyChooseUs';
import HowItWorks from '../components/home/HowItWorks';
import Testimonials from '../components/home/Testimonials';
import CTASection from '../components/home/CTASection';

const Home = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Hero Section with Slider */}
      <HeroSection />

      {/* Service Categories */}
      <ServiceCategories />

      {/* Featured Services (Dynamic from DB) */}
      <FeaturedServices />

      {/* Why Choose Us */}
      <WhyChooseUs />

      {/* How It Works */}
      <HowItWorks />

      {/* Top Rated Services */}
      <TopRatedServices />

      {/* Testimonials */}
      <Testimonials />

      {/* CTA Section */}
      <CTASection />
    </motion.div>
  );
};

export default Home;