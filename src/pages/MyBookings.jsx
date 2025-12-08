import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiCalendar, 
  FiClock, 
  FiDollarSign, 
  FiTrash2, 
  FiStar,
  FiUser,
  FiAlertCircle,
  FiCheckCircle,
  FiMessageSquare
} from 'react-icons/fi';
import Swal from 'sweetalert2';
import toast from 'react-hot-toast';
import { useAuth } from '../hooks/useAuth';
import { axiosSecure } from '../hooks/useAxios';
import LoadingSpinner from '../components/shared/LoadingSpinner';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import Badge from '../components/ui/Badge';
import { formatDate, formatPrice, getCategoryInfo } from '../utils/helpers';

const MyBookings = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewData, setReviewData] = useState({ rating: 5, comment: '' });

  // Fetch user's bookings with SAFETY CHECK
  const { data: bookings = [], isLoading, error } = useQuery({
    queryKey: ['myBookings', user?.email],
    queryFn: async () => {
      try {
        const res = await axiosSecure.get(`/bookings/user/${user?.email}`);
        // Ensure result is an array
        if (Array.isArray(res.data)) {
          return res.data;
        }
        return [];
      } catch (err) {
        console.error("Error fetching bookings:", err);
        return [];
      }
    },
    enabled: !!user?.email,
  });

  // Ensure bookings is always an array before using .filter or .map
  const safeBookings = Array.isArray(bookings) ? bookings : [];

  // Cancel booking mutation
  const cancelMutation = useMutation({
    mutationFn: async (bookingId) => {
      const res = await axiosSecure.delete(`/bookings/${bookingId}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['myBookings']);
      toast.success('Booking cancelled successfully!');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to cancel booking');
    },
  });

  // Add review mutation
  const reviewMutation = useMutation({
    mutationFn: async ({ serviceId, review }) => {
      const res = await axiosSecure.post(`/services/${serviceId}/reviews`, review);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['myBookings']);
      queryClient.invalidateQueries(['services']);
      toast.success('Review submitted successfully!');
      setIsReviewModalOpen(false);
      setSelectedBooking(null);
      setReviewData({ rating: 5, comment: '' });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to submit review');
    },
  });

  // Handle cancel booking
  const handleCancelBooking = (booking) => {
    Swal.fire({
      title: 'Cancel Booking?',
      text: `Are you sure you want to cancel your booking for "${booking.serviceName}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, Cancel it!',
      cancelButtonText: 'Keep Booking',
      background: document.documentElement.classList.contains('dark') ? '#1e1e2e' : '#ffffff',
      color: document.documentElement.classList.contains('dark') ? '#f8fafc' : '#1e1e2e',
    }).then((result) => {
      if (result.isConfirmed) {
        cancelMutation.mutate(booking._id);
      }
    });
  };

  // Handle submit review
  const handleSubmitReview = () => {
    if (!reviewData.comment.trim()) {
      toast.error('Please write a comment for your review');
      return;
    }

    const review = {
      userName: user?.displayName,
      userEmail: user?.email,
      userPhoto: user?.photoURL,
      rating: reviewData.rating,
      comment: reviewData.comment,
      date: new Date().toISOString(),
    };

    reviewMutation.mutate({
      serviceId: selectedBooking.serviceId,
      review,
    });
  };

  // Open review modal
  const openReviewModal = (booking) => {
    setSelectedBooking(booking);
    setIsReviewModalOpen(true);
  };

  // Get status badge
  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { variant: 'warning', label: 'Pending' },
      confirmed: { variant: 'info', label: 'Confirmed' },
      completed: { variant: 'success', label: 'Completed' },
      cancelled: { variant: 'danger', label: 'Cancelled' },
    };
    const config = statusConfig[status] || statusConfig.pending;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  if (isLoading) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <div className="min-h-screen py-12 px-4">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden -z-10">
        <div className="absolute top-20 right-20 w-72 h-72 rounded-full bg-primary-500/5 blur-3xl" />
        <div className="absolute bottom-20 left-20 w-72 h-72 rounded-full bg-primary-500/5 blur-3xl" />
      </div>

      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-heading font-bold text-dark-300 dark:text-light-100 mb-2">
            My Bookings
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your service bookings and leave reviews
          </p>
        </motion.div>

        {/* Stats Cards - Updated with safeBookings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          {[
            { 
              label: 'Total Bookings', 
              value: safeBookings.length, 
              icon: <FiCalendar className="text-primary-500" />,
              color: 'bg-primary-500/10'
            },
            { 
              label: 'Pending', 
              value: safeBookings.filter(b => b.status === 'pending').length, 
              icon: <FiClock className="text-amber-500" />,
              color: 'bg-amber-500/10'
            },
            { 
              label: 'Completed', 
              value: safeBookings.filter(b => b.status === 'completed').length, 
              icon: <FiCheckCircle className="text-emerald-500" />,
              color: 'bg-emerald-500/10'
            },
            { 
              label: 'Total Spent', 
              value: formatPrice(safeBookings.reduce((sum, b) => sum + (b.price || 0), 0)), 
              icon: <FiDollarSign className="text-cyan-500" />,
              color: 'bg-cyan-500/10'
            },
          ].map((stat, index) => (
            <div
              key={index}
              className={`p-4 rounded-2xl ${stat.color} border border-light-400 dark:border-dark-100`}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-light-100 dark:bg-dark-200 flex items-center justify-center">
                  {stat.icon}
                </div>
                <div>
                  <p className="text-xs text-gray-500">{stat.label}</p>
                  <p className="font-heading font-bold text-dark-300 dark:text-light-100">
                    {stat.value}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Bookings List */}
        {error ? (
          <div className="text-center py-12">
            <FiAlertCircle className="mx-auto text-red-500 mb-4" size={48} />
            <p className="text-red-500">Failed to load bookings. Please try again.</p>
          </div>
        ) : safeBookings.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20"
          >
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-primary-500/10 flex items-center justify-center">
              <FiCalendar className="text-primary-500" size={40} />
            </div>
            <h3 className="text-xl font-heading font-bold text-dark-300 dark:text-light-100 mb-2">
              No Bookings Yet
            </h3>
            <p className="text-gray-500 mb-6">
              You haven't booked any services yet. Start exploring!
            </p>
            <Button
              variant="primary"
              onClick={() => window.location.href = '/services'}
            >
              Browse Services
            </Button>
          </motion.div>
        ) : (
          <div className="space-y-4">
            <AnimatePresence>
              {safeBookings.map((booking, index) => {
                const categoryInfo = getCategoryInfo(booking.category) || { label: 'Service', icon: '🔧' };
                
                return (
                  <motion.div
                    key={booking._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-light-100 dark:bg-dark-200 rounded-2xl border border-light-400 dark:border-dark-100 overflow-hidden hover:shadow-xl transition-shadow"
                  >
                    <div className="flex flex-col lg:flex-row">
                      {/* Service Image */}
                      <div className="relative w-full lg:w-48 h-48 lg:h-auto flex-shrink-0">
                        <img
                          src={booking.serviceImage || 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=300'}
                          alt={booking.serviceName}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-dark-400/20" />
                        <div className="absolute top-3 left-3">
                          {getStatusBadge(booking.status)}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="flex-1 p-6">
                        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                          {/* Left Content */}
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-xl">{categoryInfo.icon}</span>
                              <span className="text-sm text-gray-500">{categoryInfo.label}</span>
                            </div>

                            <h3 className="text-xl font-heading font-bold text-dark-300 dark:text-light-100 mb-3">
                              {booking.serviceName}
                            </h3>

                            {/* Provider Info */}
                            <div className="flex items-center gap-3 mb-4 pb-4 border-b border-light-400 dark:border-dark-100">
                              <div className="w-10 h-10 rounded-full bg-primary-500/20 flex items-center justify-center">
                                <FiUser className="text-primary-500" />
                              </div>
                              <div>
                                <p className="font-medium text-dark-300 dark:text-light-100">
                                  {booking.providerName}
                                </p>
                                <p className="text-sm text-gray-500">{booking.providerEmail}</p>
                              </div>
                            </div>

                            {/* Booking Details */}
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                              <div className="flex items-center gap-2 text-sm">
                                <FiCalendar className="text-primary-500" />
                                <span className="text-gray-600 dark:text-gray-400">
                                  {formatDate(booking.bookingDate)}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 text-sm">
                                <FiDollarSign className="text-emerald-500" />
                                <span className="font-bold text-dark-300 dark:text-light-100">
                                  {formatPrice(booking.price)}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 text-sm">
                                <FiClock className="text-amber-500" />
                                <span className="text-gray-600 dark:text-gray-400">
                                  {formatDate(booking.createdAt)}
                                </span>
                              </div>
                            </div>

                            {/* Special Instructions */}
                            {booking.instructions && (
                              <div className="mt-4 p-3 rounded-xl bg-light-200 dark:bg-dark-100">
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                  <span className="font-medium">Note:</span> {booking.instructions}
                                </p>
                              </div>
                            )}
                          </div>

                          {/* Right Content - Actions */}
                          <div className="flex flex-row lg:flex-col gap-2">
                            {/* Review Button (only for completed bookings) */}
                            {booking.status === 'completed' && !booking.hasReviewed && (
                              <Button
                                variant="primary"
                                size="sm"
                                onClick={() => openReviewModal(booking)}
                                icon={<FiStar />}
                                className="flex-1 lg:flex-none"
                              >
                                Add Review
                              </Button>
                            )}

                            {booking.hasReviewed && (
                              <Badge variant="success" className="justify-center">
                                <FiCheckCircle className="mr-1" />
                                Reviewed
                              </Badge>
                            )}

                            {/* Cancel Button (only for pending bookings) */}
                            {(booking.status === 'pending' || booking.status === 'confirmed') && (
                              <Button
                                variant="danger"
                                size="sm"
                                onClick={() => handleCancelBooking(booking)}
                                loading={cancelMutation.isLoading}
                                icon={<FiTrash2 />}
                                className="flex-1 lg:flex-none"
                              >
                                Cancel
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}

        {/* Review Modal */}
        <Modal
          isOpen={isReviewModalOpen}
          onClose={() => {
            setIsReviewModalOpen(false);
            setSelectedBooking(null);
            setReviewData({ rating: 5, comment: '' });
          }}
          title="Leave a Review"
          size="md"
        >
          {selectedBooking && (
            <div className="space-y-6">
              {/* Service Info */}
              <div className="flex items-center gap-4 p-4 rounded-xl bg-light-200 dark:bg-dark-100">
                <img
                  src={selectedBooking.serviceImage || 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=100'}
                  alt={selectedBooking.serviceName}
                  className="w-16 h-16 rounded-xl object-cover"
                />
                <div>
                  <h4 className="font-semibold text-dark-300 dark:text-light-100">
                    {selectedBooking.serviceName}
                  </h4>
                  <p className="text-sm text-gray-500">
                    by {selectedBooking.providerName}
                  </p>
                </div>
              </div>

              {/* Rating */}
              <div>
                <label className="block text-sm font-medium text-dark-300 dark:text-light-100 mb-3">
                  Your Rating
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <motion.button
                      key={star}
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setReviewData({ ...reviewData, rating: star })}
                      className="focus:outline-none"
                    >
                      <FiStar
                        size={32}
                        className={`transition-colors ${
                          star <= reviewData.rating
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-gray-300 dark:text-gray-600'
                        }`}
                      />
                    </motion.button>
                  ))}
                  <span className="ml-2 text-lg font-semibold text-dark-300 dark:text-light-100">
                    {reviewData.rating}/5
                  </span>
                </div>
              </div>

              {/* Comment */}
              <div>
                <label className="block text-sm font-medium text-dark-300 dark:text-light-100 mb-2">
                  Your Review
                </label>
                <textarea
                  value={reviewData.comment}
                  onChange={(e) => setReviewData({ ...reviewData, comment: e.target.value })}
                  placeholder="Share your experience with this service..."
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl bg-light-100 dark:bg-dark-100 border-2 border-light-400 dark:border-dark-100 text-dark-300 dark:text-light-200 placeholder:text-gray-400 focus:outline-none focus:border-primary-500 resize-none"
                />
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <Button
                  variant="ghost"
                  onClick={() => {
                    setIsReviewModalOpen(false);
                    setSelectedBooking(null);
                    setReviewData({ rating: 5, comment: '' });
                  }}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  onClick={handleSubmitReview}
                  loading={reviewMutation.isLoading}
                  icon={<FiMessageSquare />}
                  className="flex-1"
                >
                  Submit Review
                </Button>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </div>
  );
};

export default MyBookings;