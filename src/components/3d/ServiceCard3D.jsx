// src/components/3d/ServiceCard3D.jsx - FIXED
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiStar, FiMapPin, FiArrowRight } from 'react-icons/fi';
import { formatPrice, getCategoryInfo } from '../../utils/helpers';
import Badge from '../ui/Badge';

const ServiceCard3D = ({ service, index = 0 }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const {
    _id,
    serviceName,
    category,
    price,
    description,
    imageUrl,
    providerName,
    providerEmail,
    reviews = [],
  } = service;

  const categoryInfo = getCategoryInfo(category);
  
  // Calculate average rating
  const avgRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : 0;

  // 🔥 FIX: Reduced rotation intensity
  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) / 40; // Increased divisor from 20 to 40
    const y = (e.clientY - rect.top - rect.height / 2) / 40; // Increased divisor from 20 to 40
    setMousePosition({ x, y });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setMousePosition({ x: 0, y: 0 });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="perspective-1000"
    >
      <motion.div
        onMouseEnter={() => setIsHovered(true)}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        animate={{
          rotateX: -mousePosition.y,
          rotateY: mousePosition.x,
          // 🔥 FIX: Added slight lift on hover instead of rotation
          y: isHovered ? -8 : 0,
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        className="relative preserve-3d"
      >
        <div className="relative bg-light-100 dark:bg-dark-200 rounded-2xl overflow-hidden border border-light-400 dark:border-dark-100 shadow-xl hover:shadow-2xl transition-shadow duration-300">
          {/* Image Container */}
          <div className="relative h-48 overflow-hidden">
            <motion.img
              src={imageUrl || 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=500'}
              alt={serviceName}
              className="w-full h-full object-cover"
              animate={{ scale: isHovered ? 1.1 : 1 }}
              transition={{ duration: 0.4 }}
              onError={(e) => {
                e.target.src = 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=500';
              }}
            />
            
            {/* Overlay */}
            <motion.div
              className="absolute inset-0 bg-dark-400/40"
              animate={{ opacity: isHovered ? 0.6 : 0.3 }}
            />

            {/* Category Badge */}
            <div className="absolute top-4 left-4 z-10">
              <Badge variant="primary">
                <span className="mr-1">{categoryInfo?.icon || '🏠'}</span>
                {categoryInfo?.label || category}
              </Badge>
            </div>

            {/* Price Tag */}
            <motion.div
              className="absolute top-4 right-4 px-4 py-2 rounded-xl bg-light-100 dark:bg-dark-200 shadow-lg z-10"
              animate={{ y: isHovered ? 0 : 0 }}
            >
              <span className="font-heading font-bold text-primary-600 dark:text-primary-400">
                {formatPrice(price)}
              </span>
            </motion.div>

            {/* Rating */}
            {reviews.length > 0 && (
              <div className="absolute bottom-4 left-4 flex items-center gap-1 px-3 py-1 rounded-full bg-dark-400/80 text-white text-sm z-10">
                <FiStar className="text-amber-400 fill-amber-400" />
                <span className="font-medium">{avgRating}</span>
                <span className="text-gray-300">({reviews.length})</span>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-5 relative z-10">
            <h3 className="text-lg font-heading font-bold text-dark-300 dark:text-light-100 mb-2 line-clamp-1 group-hover:text-primary-500 transition-colors">
              {serviceName}
            </h3>
            
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
              {description}
            </p>

            {/* Provider Info */}
            <div className="flex items-center gap-3 mb-4 pb-4 border-b border-light-400 dark:border-dark-100">
              <div className="w-10 h-10 rounded-full bg-primary-500/20 flex items-center justify-center flex-shrink-0">
                <span className="text-primary-600 dark:text-primary-400 font-bold">
                  {providerName?.charAt(0)?.toUpperCase() || 'P'}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-dark-300 dark:text-light-100 truncate">
                  {providerName || 'Service Provider'}
                </p>
                <p className="text-xs text-gray-500 flex items-center gap-1">
                  <FiMapPin size={10} />
                  Service Provider
                </p>
              </div>
            </div>

            {/* 🔥 FIX: Action Button with proper event handling */}
            <Link 
              to={`/services/${_id}`}
              onClick={(e) => {
                e.stopPropagation(); // Prevent card interaction
                console.log('Navigating to:', `/services/${_id}`); // Debug
              }}
              onMouseDown={(e) => e.stopPropagation()}
              className="block relative z-20"
              style={{ 
                pointerEvents: 'auto',
                cursor: 'pointer',
                userSelect: 'none'
              }}
            >
              <motion.button
                whileHover={{ x: 5 }}
                whileTap={{ scale: 0.98 }} // 🔥 Added tap feedback
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-primary-500/10 text-primary-600 dark:text-primary-400 font-semibold hover:bg-primary-500/20 transition-colors pointer-events-auto"
                style={{ 
                  pointerEvents: 'auto',
                  touchAction: 'auto'
                }}
              >
                View Details
                <FiArrowRight className="transition-transform group-hover:translate-x-1" />
              </motion.button>
            </Link>
          </div>

          {/* 3D Shadow Effect */}
          <motion.div
            className="absolute -z-10 inset-4 rounded-2xl bg-primary-500/20 blur-2xl pointer-events-none"
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ServiceCard3D;