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
import useAxiosSecure from '../hooks/useAxiosSecure'; // আপনার হুকের নাম অনুযায়ী চেক করুন
import LoadingSpinner from '../components/shared/LoadingSpinner';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import Badge from '../components/ui/Badge';
import { formatDate, formatPrice, getCategoryInfo } from '../utils/helpers';

const MyBookings = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewData, setReviewData] = useState({ rating: 5, comment: '' });

  // 1. Fetch user's bookings
  const { data: bookings = [], isLoading, error } = useQuery({
    queryKey: ['myBookings', user?.email],
    queryFn: async () => {
      console.log("🔍 Fetching bookings for:", user?.email);
      const res = await axiosSecure.get(`/bookings/user/${user?.email}`);
      return Array.isArray(res.data.data) ? res.data.data : (Array.isArray(res.data) ? res.data : []);
    },
    enabled: !!user?.email,
  });

  const safeBookings = Array.isArray(bookings) ? bookings : [];

  // 2. Cancel booking mutation
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

  // 3. Add review mutation
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
      text: `Are you sure you want to cancel "${booking.serviceName}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      confirmButtonText: 'Yes, Cancel it!',
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
      toast.error('Please write a comment');
      return;
    }

    const review = {
      rating: reviewData.rating,
      comment: reviewData.comment,
      bookingId: selectedBooking._id // সার্ভার সাইড ভ্যালিডেশনের জন্য প্রয়োজনীয়
    };

    reviewMutation.mutate({
      serviceId: selectedBooking.serviceId,
      review,
    });
  };

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

  if (isLoading) return <LoadingSpinner fullScreen />;

  return (
    <div className="min-h-screen py-12 px-4 relative">
      <div className="container mx-auto max-w-6xl">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <h1 className="text-4xl font-heading font-bold dark:text-light-100 mb-2">My Bookings</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage your services and leave reviews</p>
        </motion.div>

        {/* Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <StatCard label="Total" value={safeBookings.length} icon={<FiCalendar />} />
            <StatCard label="Pending" value={safeBookings.filter(b => b.status === 'pending').length} icon={<FiClock />} color="text-amber-500" />
            <StatCard label="Completed" value={safeBookings.filter(b => b.status === 'completed').length} icon={<FiCheckCircle />} color="text-emerald-500" />
            <StatCard label="Spent" value={formatPrice(safeBookings.reduce((sum, b) => sum + (b.price || 0), 0))} icon={<FiDollarSign />} color="text-cyan-500" />
        </div>

        {safeBookings.length === 0 ? (
          <div className="text-center py-20">
            <h3 className="text-xl font-bold mb-4">No Bookings Found</h3>
            <Button variant="primary" onClick={() => window.location.href = '/services'}>Browse Services</Button>
          </div>
        ) : (
          <div className="space-y-4">
            <AnimatePresence>
              {safeBookings.map((booking, index) => (
                <motion.div
                  key={booking._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white dark:bg-dark-200 rounded-2xl border dark:border-dark-100 overflow-hidden flex flex-col lg:flex-row shadow-sm hover:shadow-md"
                >
                  <div className="lg:w-48 h-48 lg:h-auto relative">
                    <img src={booking.serviceImage} alt={booking.serviceName} className="w-full h-full object-cover" />
                    <div className="absolute top-2 left-2">{getStatusBadge(booking.status)}</div>
                  </div>

                  <div className="flex-1 p-6 flex flex-col lg:flex-row justify-between gap-4">
                    <div>
                      <h3 className="text-xl font-bold mb-2">{booking.serviceName}</h3>
                      <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                        <FiUser /> <span>{booking.providerName}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center gap-2"><FiCalendar /> {formatDate(booking.bookingDate)}</div>
                        <div className="flex items-center gap-2"><FiDollarSign /> {formatPrice(booking.price)}</div>
                      </div>
                      {/* Note: Server uses specialInstructions */}
                      {booking.specialInstructions && (
                        <p className="mt-3 text-xs bg-gray-100 dark:bg-dark-100 p-2 rounded">
                          <span className="font-bold">Instructions:</span> {booking.specialInstructions}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      {booking.status === 'completed' && !booking.hasReviewed && (
                        <Button variant="primary" size="sm" onClick={() => { setSelectedBooking(booking); setIsReviewModalOpen(true); }} icon={<FiStar />}>Review</Button>
                      )}
                      {booking.hasReviewed && <Badge variant="success">Reviewed</Badge>}
                      {(booking.status === 'pending' || booking.status === 'confirmed') && (
                        <Button variant="danger" size="sm" onClick={() => handleCancelBooking(booking)} icon={<FiTrash2 />}>Cancel</Button>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* Review Modal */}
        <Modal isOpen={isReviewModalOpen} onClose={() => setIsReviewModalOpen(false)} title="Add Review">
          {selectedBooking && (
            <div className="space-y-4">
              <div className="flex gap-1 justify-center py-2">
                {[1,2,3,4,5].map(s => (
                  <FiStar 
                    key={s} 
                    size={30} 
                    className={`cursor-pointer ${s <= reviewData.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}`} 
                    onClick={() => setReviewData({...reviewData, rating: s})}
                  />
                ))}
              </div>
              <textarea
                className="w-full p-3 border dark:bg-dark-100 rounded-xl resize-none focus:ring-2 focus:ring-primary-500 outline-none"
                rows="4"
                placeholder="How was the service?"
                value={reviewData.comment}
                onChange={(e) => setReviewData({...reviewData, comment: e.target.value})}
              />
              <div className="flex gap-2">
                <Button variant="ghost" className="flex-1" onClick={() => setIsReviewModalOpen(false)}>Cancel</Button>
                <Button variant="primary" className="flex-1" onClick={handleSubmitReview} loading={reviewMutation.isLoading} icon={<FiMessageSquare />}>Submit</Button>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </div>
  );
};

// Sub-component for Stats
const StatCard = ({ label, value, icon, color = "text-primary-500" }) => (
    <div className="p-4 rounded-2xl bg-white dark:bg-dark-200 border dark:border-dark-100 flex items-center gap-3">
      <div className={`w-10 h-10 rounded-xl bg-gray-50 dark:bg-dark-100 flex items-center justify-center ${color}`}>{icon}</div>
      <div>
        <p className="text-xs text-gray-500">{label}</p>
        <p className="font-bold">{value}</p>
      </div>
    </div>
);

export default MyBookings;