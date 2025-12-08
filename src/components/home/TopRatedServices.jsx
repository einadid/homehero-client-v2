import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiStar, FiArrowRight } from 'react-icons/fi';
import { axiosPublic } from '../../hooks/useAxios';
import SectionHeader from '../shared/SectionHeader';
import { formatPrice, getCategoryInfo } from '../../utils/helpers';

const TopRatedServices = () => {
  const { data: services = [], isLoading, error } = useQuery({
    queryKey: ['topRatedServices'],
    queryFn: async () => {
      try {
        const res = await axiosPublic.get('/services/top-rated?limit=6');
        // যদি সার্ভার থেকে অ্যারে না আসে, খালি অ্যারে রিটার্ন করব
        if (Array.isArray(res.data)) {
          return res.data;
        }
        return [];
      } catch (err) {
        console.error("Error fetching top rated services:", err);
        return [];
      }
    },
  });

  const ServiceCard = ({ service, index }) => {
    // সেফটি চেক: ক্যাটাগরি না থাকলে ডিফল্ট ভ্যালু
    const categoryInfo = getCategoryInfo(service.category) || { label: 'Service', icon: '🔧' };
    
    // সেফটি চেক: রিভিউ ক্যালকুলেশন
    const avgRating = Array.isArray(service.reviews) && service.reviews.length > 0
      ? (service.reviews.reduce((sum, r) => sum + r.rating, 0) / service.reviews.length).toFixed(1)
      : 0;

    return (
      <motion.div
        initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ delay: index * 0.1 }}
        className="group"
      >
        <Link to={`/services/${service._id}`}>
          <div className="flex gap-4 p-4 rounded-2xl bg-light-100 dark:bg-dark-200 border border-light-400 dark:border-dark-100 hover:shadow-xl hover:shadow-primary-500/10 transition-all duration-300">
            {/* Image */}
            <div className="relative w-24 h-24 rounded-xl overflow-hidden flex-shrink-0">
              <img
                src={service.imageUrl || 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=200'}
                alt={service.serviceName}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-dark-400/20" />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 mb-1">
                <h4 className="font-semibold text-dark-300 dark:text-light-100 truncate">
                  {service.serviceName}
                </h4>
                <div className="flex items-center gap-1 text-sm text-amber-500 flex-shrink-0">
                  <FiStar className="fill-amber-500" />
                  <span className="font-medium">{avgRating}</span>
                </div>
              </div>
              
              <p className="text-sm text-gray-500 mb-2 flex items-center gap-1">
                <span>{categoryInfo.icon}</span>
                {categoryInfo.label}
              </p>
              
              <div className="flex items-center justify-between">
                <span className="font-bold text-primary-600 dark:text-primary-400">
                  {formatPrice(service.price)}
                </span>
                <span className="text-xs text-gray-400">
                  {service.reviews?.length || 0} reviews
                </span>
              </div>
            </div>

            {/* Arrow */}
            <motion.div
              className="self-center opacity-0 group-hover:opacity-100 transition-opacity"
              whileHover={{ x: 5 }}
            >
              <FiArrowRight className="text-primary-500" />
            </motion.div>
          </div>
        </Link>
      </motion.div>
    );
  };

  if (isLoading) {
    return (
      <section className="py-20 lg:py-28 bg-light-200 dark:bg-dark-300">
        <div className="container mx-auto px-4 lg:px-8">
          <SectionHeader
            badge="Top Rated"
            title="Highest Rated Services"
            subtitle="Services loved by our customers"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-32 bg-light-300 dark:bg-dark-200 rounded-2xl animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  // যদি কোনো সার্ভিস না থাকে বা এরর হয়, সেকশনটি দেখাবে না অথবা মেসেজ দেখাবে
  if (!Array.isArray(services) || services.length === 0) return null;

  return (
    <section className="py-20 lg:py-28 bg-light-200 dark:bg-dark-400/50">
      <div className="container mx-auto px-4 lg:px-8">
        <SectionHeader
          badge="⭐ Top Rated"
          title="Highest Rated Services"
          subtitle="These services have received the best reviews from our customers"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {services.map((service, index) => (
            <ServiceCard key={service._id} service={service} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TopRatedServices;