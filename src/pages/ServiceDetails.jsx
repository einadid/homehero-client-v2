// src/pages/ServiceDetails.jsx
import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiArrowLeft, 
  FiStar, 
  FiClock, 
  FiMapPin, 
  FiMail,
  FiCalendar,
  FiUser,
  FiCheck,
  FiShare2
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import { axiosPublic } from '../hooks/useAxios';
import { useAuth } from '../hooks/useAuth';
import { formatPrice, formatDate, getCategoryInfo } from '../utils/helpers';
import LoadingSpinner from '../components/shared/LoadingSpinner';
import Modal from '../components/ui/Modal';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';

const ServiceDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [bookingDate, setBookingDate] = useState('');
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [isBooking, setIsBooking] = useState(false);

  // Fetch service details
  const { data, isLoading, error } = useQuery({
    queryKey: ['service', id],
    queryFn: async () => {
      const res = await axiosPublic.get(`/services/${id}`);
      return res.data.data;
    },
  });

  const service = data;

  const handleBookNow = () => {
    if (!user) {
      toast.error('Please login to book a service');
      navigate('/login', { state: { from: { pathname: `/services/${id}` } } });
      return;
    }

    if (user.email === service?.providerEmail) {
      toast.error("You cannot book your own service");
      return;
    }

    setIsBookingModalOpen(true);
  };

  const handleConfirmBooking = async () => {
    if (!bookingDate) {
      toast.error('Please select a booking date');
      return;
    }

    setIsBooking(true);
    try {
      const bookingData = {
        serviceId: id,
        userEmail: user.email,
        userName: user.displayName,
        userPhoto: user.photoURL,
        bookingDate,
        specialInstructions,
        price: service.price,
      };

      await axiosPublic.post('/bookings', bookingData);
      toast.success('Booking confirmed successfully!');
      setIsBookingModalOpen(false);
      setBookingDate('');
      setSpecialInstructions('');
      navigate('/my-bookings');
    } catch (error) {
      console.error('Booking error:', error);
      toast.error(error.response?.data?.message || 'Failed to book service');
    } finally {
      setIsBooking(false);
    }
  };

  if (isLoading) return <LoadingSpinner fullScreen />;

  if (error || !service) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-dark-300 dark:text-light-100 mb-4">
            Service Not Found
          </h2>
          <Link to="/services" className="btn-primary">
            Back to Services
          </Link>
        </div>
      </div>
    );
  }

  const categoryInfo = getCategoryInfo(service.category);
  const avgRating = service.reviews?.length > 0
    ? (service.reviews.reduce((sum, r) => sum + r.rating, 0) / service.reviews.length).toFixed(1)
    : 0;

  const isOwnService = user?.email === service.providerEmail;

  return (
    <div className="min-h-screen pb-20">
      {/* Hero Section */}
      <section className="relative h-[50vh] min-h-[400px]">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${service.imageUrl})` }}
        />
        <div className="absolute inset-0 bg-dark-400/60" />
        
        <div className="absolute inset-0 flex items-end">
          <div className="container mx-auto px-4 lg:px-8 pb-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Link
                to="/services"
                className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-4"
              >
                <FiArrowLeft />
                Back to Services
              </Link>

              <div className="flex flex-wrap items-center gap-3 mb-4">
                <Badge variant="primary">
                  {categoryInfo.icon} {categoryInfo.label}
                </Badge>
                {service.reviews?.length > 0 && (
                  <div className="flex items-center gap-1 text-white">
                    <FiStar className="text-amber-400 fill-amber-400" />
                    <span className="font-medium">{avgRating}</span>
                    <span className="text-white/60">({service.reviews.length} reviews)</span>
                  </div>
                )}
              </div>

              <h1 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-white mb-4">
                {service.serviceName}
              </h1>

              <div className="flex flex-wrap items-center gap-6 text-white/80">
                <span className="flex items-center gap-2">
                  <FiUser />
                  {service.providerName}
                </span>
                <span className="flex items-center gap-2">
                  <FiClock />
                  Added {formatDate(service.createdAt)}
                </span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="container mx-auto px-4 lg:px-8 -mt-10 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2 space-y-8"
          >
            {/* Description Card */}
            <div className="bg-light-100 dark:bg-dark-200 rounded-2xl p-6 shadow-xl border border-light-400 dark:border-dark-100">
              <h2 className="text-xl font-heading font-bold text-dark-300 dark:text-light-100 mb-4">
                About This Service
              </h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-line">
                {service.description}
              </p>

              {/* Features/Includes */}
              <div className="mt-6 pt-6 border-t border-light-400 dark:border-dark-100">
                <h3 className="font-semibold text-dark-300 dark:text-light-100 mb-4">
                  What's Included
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {[
                    'Professional service delivery',
                    'Quality materials used',
                    'Satisfaction guarantee',
                    'On-time arrival',
                    'Clean work environment',
                    'Post-service cleanup',
                  ].map((item, index) => (
                    <div key={index} className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                      <FiCheck className="text-accent-emerald flex-shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Reviews Section */}
            <div className="bg-light-100 dark:bg-dark-200 rounded-2xl p-6 shadow-xl border border-light-400 dark:border-dark-100">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-heading font-bold text-dark-300 dark:text-light-100">
                  Reviews ({service.reviews?.length || 0})
                </h2>
                {service.reviews?.length > 0 && (
                  <div className="flex items-center gap-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <FiStar
                          key={i}
                          className={`${
                            i < Math.round(avgRating)
                              ? 'text-amber-400 fill-amber-400'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="font-bold text-dark-300 dark:text-light-100">{avgRating}</span>
                  </div>
                )}
              </div>

              {service.reviews?.length > 0 ? (
                <div className="space-y-4">
                  {service.reviews.map((review, index) => (
                    <motion.div
                      key={review._id || index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-4 rounded-xl bg-light-200 dark:bg-dark-100"
                    >
                      <div className="flex items-start gap-4">
                        <img
                          src={review.userPhoto || 'https://i.ibb.co/5GzXkwq/user.png'}
                          alt={review.userName}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold text-dark-300 dark:text-light-100">
                              {review.userName}
                            </h4>
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <FiStar
                                  key={i}
                                  size={14}
                                  className={`${
                                    i < review.rating
                                      ? 'text-amber-400 fill-amber-400'
                                      : 'text-gray-300'
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                          <p className="text-gray-600 dark:text-gray-400 text-sm">
                            {review.comment}
                          </p>
                          <p className="text-xs text-gray-400 mt-2">
                            {formatDate(review.createdAt)}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-500 py-8">
                  No reviews yet. Be the first to review this service!
                </p>
              )}
            </div>
          </motion.div>

          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-1"
          >
            {/* Booking Card */}
            <div className="bg-light-100 dark:bg-dark-200 rounded-2xl p-6 shadow-xl border border-light-400 dark:border-dark-100 sticky top-28">
              {/* Price */}
              <div className="text-center mb-6 pb-6 border-b border-light-400 dark:border-dark-100">
                <p className="text-sm text-gray-500 mb-1">Service Price</p>
                <p className="text-4xl font-heading font-bold text-primary-600 dark:text-primary-400">
                  {formatPrice(service.price)}
                </p>
              </div>

              {/* Provider Info */}
              <div className="mb-6 pb-6 border-b border-light-400 dark:border-dark-100">
                <h3 className="font-semibold text-dark-300 dark:text-light-100 mb-4">
                  Service Provider
                </h3>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-primary-500/20 flex items-center justify-center">
                    <span className="text-primary-600 dark:text-primary-400 font-bold text-lg">
                      {service.providerName?.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-dark-300 dark:text-light-100">
                      {service.providerName}
                    </p>
                    <p className="text-sm text-gray-500 flex items-center gap-1">
                      <FiMail size={12} />
                      {service.providerEmail}
                    </p>
                  </div>
                </div>
              </div>

              {/* Book Now Button */}
              {isOwnService ? (
                <div className="text-center p-4 rounded-xl bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400">
                  <p className="font-medium">This is your service</p>
                  <Link
                    to="/my-services"
                    className="text-sm underline hover:no-underline"
                  >
                    Manage in My Services
                  </Link>
                </div>
              ) : (
                <Button
                  onClick={handleBookNow}
                  variant="primary"
                  size="lg"
                  className="w-full"
                  icon={<FiCalendar />}
                >
                  Book Now
                </Button>
              )}

              {/* Share Button */}
              <button
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  toast.success('Link copied to clipboard!');
                }}
                className="w-full mt-4 py-3 rounded-xl border border-light-400 dark:border-dark-100 flex items-center justify-center gap-2 text-gray-600 dark:text-gray-400 hover:bg-light-200 dark:hover:bg-dark-100 transition-colors"
              >
                <FiShare2 />
                Share Service
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Booking Modal */}
      <Modal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        title="Book Service"
        size="md"
      >
        <div className="space-y-6">
          {/* Service Summary */}
          <div className="flex items-center gap-4 p-4 rounded-xl bg-light-200 dark:bg-dark-100">
            <img
              src={service.imageUrl}
              alt={service.serviceName}
              className="w-20 h-20 rounded-xl object-cover"
            />
            <div>
              <h4 className="font-semibold text-dark-300 dark:text-light-100">
                {service.serviceName}
              </h4>
              <p className="text-sm text-gray-500">{service.providerName}</p>
              <p className="text-lg font-bold text-primary-600 dark:text-primary-400">
                {formatPrice(service.price)}
              </p>
            </div>
          </div>

          {/* User Info (read-only) */}
          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
              Your Email
            </label>
            <input
              type="email"
              value={user?.email || ''}
              readOnly
              className="w-full px-4 py-3 rounded-xl bg-light-200 dark:bg-dark-100 border border-light-400 dark:border-dark-100 text-gray-500 cursor-not-allowed"
            />
          </div>

          {/* Booking Date */}
          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
              Select Date *
            </label>
            <input
              type="date"
              value={bookingDate}
              onChange={(e) => setBookingDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className="w-full px-4 py-3 rounded-xl bg-light-100 dark:bg-dark-100 border border-light-400 dark:border-dark-100 focus:outline-none focus:border-primary-500"
            />
          </div>

          {/* Special Instructions */}
          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
              Special Instructions (Optional)
            </label>
            <textarea
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              rows={3}
              placeholder="Any specific requirements or instructions..."
              className="w-full px-4 py-3 rounded-xl bg-light-100 dark:bg-dark-100 border border-light-400 dark:border-dark-100 focus:outline-none focus:border-primary-500 resize-none"
            />
          </div>

          {/* Confirm Button */}
          <div className="flex gap-3 pt-4">
            <Button
              variant="ghost"
              onClick={() => setIsBookingModalOpen(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleConfirmBooking}
              loading={isBooking}
              className="flex-1"
            >
              Confirm Booking
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ServiceDetails;