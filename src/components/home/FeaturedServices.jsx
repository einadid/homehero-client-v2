// src/components/home/FeaturedServices.jsx
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';
import { axiosPublic } from '../../hooks/useAxios';
import SectionHeader from '../shared/SectionHeader';
import ServiceCard3D from '../3d/ServiceCard3D';

const FeaturedServices = () => {
  const { data: services = [], isLoading, error } = useQuery({
    queryKey: ['featuredServices'],
    queryFn: async () => {
      try {
        const res = await axiosPublic.get('/services/featured?limit=6');
        return res.data;
      } catch (err) {
        console.error("Error fetching services:", err);
        return []; // এরর হলে খালি অ্যারে রিটার্ন করবে
      }
    },
  });

  // Skeleton Card Component
  const SkeletonCard = () => (
    <div className="bg-light-100 dark:bg-dark-200 rounded-2xl overflow-hidden border border-light-400 dark:border-dark-100 animate-pulse">
      <div className="h-48 bg-light-300 dark:bg-dark-100" />
      <div className="p-5 space-y-4">
        <div className="h-6 bg-light-300 dark:bg-dark-100 rounded-lg w-3/4" />
        <div className="h-4 bg-light-300 dark:bg-dark-100 rounded-lg w-full" />
        <div className="h-4 bg-light-300 dark:bg-dark-100 rounded-lg w-2/3" />
        <div className="flex items-center gap-3 pt-4 border-t border-light-400 dark:border-dark-100">
          <div className="w-10 h-10 rounded-full bg-light-300 dark:bg-dark-100" />
          <div className="space-y-2 flex-1">
            <div className="h-4 bg-light-300 dark:bg-dark-100 rounded w-1/2" />
            <div className="h-3 bg-light-300 dark:bg-dark-100 rounded w-1/3" />
          </div>
        </div>
        <div className="h-12 bg-light-300 dark:bg-dark-100 rounded-xl" />
      </div>
    </div>
  );

  return (
    <section className="py-20 lg:py-28 relative">
      {/* Background */}
      <div className="absolute inset-0 bg-dots opacity-30 -z-10" />

      <div className="container mx-auto px-4 lg:px-8">
        {/* Section Header */}
        <SectionHeader
          badge="Our Services"
          title="Featured Services"
          subtitle="Discover our most popular and highly-rated services from trusted professionals in your area."
        />

        {/* Services Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-500">Failed to load services. Please check your connection.</p>
          </div>
        ) : !Array.isArray(services) || services.length === 0 ? (
          // এখানে চেক করা হচ্ছে services আসলেই Array কিনা
          <div className="text-center py-12">
            <p className="text-gray-500">No services available at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <ServiceCard3D key={service._id} service={service} index={index} />
            ))}
          </div>
        )}

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Link to="/services">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-primary-500 text-white font-semibold shadow-lg shadow-primary-500/30 hover:bg-primary-600 transition-colors"
            >
              View All Services
              <FiArrowRight />
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturedServices;