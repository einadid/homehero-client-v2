// src/pages/MyServices.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiPlus, 
  FiEdit2, 
  FiTrash2, 
  FiEye,
  FiStar,
  FiAlertCircle
} from 'react-icons/fi';
import Swal from 'sweetalert2';
import toast from 'react-hot-toast';
import { axiosPublic } from '../hooks/useAxios';
import { useAuth } from '../hooks/useAuth';
import { formatPrice, formatDate, getCategoryInfo } from '../utils/helpers';
import LoadingSpinner from '../components/shared/LoadingSpinner';
import Badge from '../components/ui/Badge';

const MyServices = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Fetch user's services
  const { data, isLoading, error } = useQuery({
    queryKey: ['myServices', user?.email],
    queryFn: async () => {
      const res = await axiosPublic.get(`/services/provider/${user?.email}`);
      return res.data.data;
    },
    enabled: !!user?.email,
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      return await axiosPublic.delete(`/services/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['myServices']);
      toast.success('Service deleted successfully');
    },
    onError: () => {
      toast.error('Failed to delete service');
    },
  });

  const handleDelete = (service) => {
    Swal.fire({
      title: 'Are you sure?',
      text: `Delete "${service.serviceName}"? This action cannot be undone.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, delete it!',
      background: document.documentElement.classList.contains('dark') ? '#1e1e2e' : '#ffffff',
      color: document.documentElement.classList.contains('dark') ? '#f8fafc' : '#1e1e2e',
    }).then((result) => {
      if (result.isConfirmed) {
        deleteMutation.mutate(service._id);
      }
    });
  };

  const services = data || [];

  if (isLoading) return <LoadingSpinner fullScreen />;

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8"
        >
          <div>
            <h1 className="text-3xl font-heading font-bold text-dark-300 dark:text-light-100 mb-2">
              My Services
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage your service listings
            </p>
          </div>

          <Link to="/add-service">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-primary flex items-center gap-2"
            >
              <FiPlus />
              Add New Service
            </motion.button>
          </Link>
        </motion.div>

        {/* Services Table */}
        {services.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20 bg-light-100 dark:bg-dark-200 rounded-2xl border border-light-400 dark:border-dark-100"
          >
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-light-300 dark:bg-dark-100 flex items-center justify-center">
              <FiAlertCircle size={40} className="text-gray-400" />
            </div>
            <h3 className="text-xl font-heading font-bold text-dark-300 dark:text-light-100 mb-2">
              No Services Yet
            </h3>
            <p className="text-gray-500 mb-6">
              Start by adding your first service listing
            </p>
            <Link to="/add-service" className="btn-primary inline-flex items-center gap-2">
              <FiPlus />
              Add Your First Service
            </Link>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-light-100 dark:bg-dark-200 rounded-2xl border border-light-400 dark:border-dark-100 overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-light-200 dark:bg-dark-100 border-b border-light-400 dark:border-dark-100">
                    <th className="text-left px-6 py-4 font-semibold text-dark-300 dark:text-light-100">
                      Service
                    </th>
                    <th className="text-left px-6 py-4 font-semibold text-dark-300 dark:text-light-100">
                      Category
                    </th>
                    <th className="text-left px-6 py-4 font-semibold text-dark-300 dark:text-light-100">
                      Price
                    </th>
                    <th className="text-left px-6 py-4 font-semibold text-dark-300 dark:text-light-100">
                      Rating
                    </th>
                    <th className="text-left px-6 py-4 font-semibold text-dark-300 dark:text-light-100">
                      Date Added
                    </th>
                    <th className="text-center px-6 py-4 font-semibold text-dark-300 dark:text-light-100">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence>
                    {services.map((service, index) => {
                      const categoryInfo = getCategoryInfo(service.category);
                      const avgRating = service.reviews?.length > 0
                        ? (service.reviews.reduce((sum, r) => sum + r.rating, 0) / service.reviews.length).toFixed(1)
                        : 0;

                      return (
                        <motion.tr
                          key={service._id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          transition={{ delay: index * 0.05 }}
                          className="border-b border-light-400 dark:border-dark-100 last:border-0 hover:bg-light-200 dark:hover:bg-dark-100 transition-colors"
                        >
                          {/* Service */}
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={service.imageUrl}
                                alt={service.serviceName}
                                className="w-12 h-12 rounded-xl object-cover"
                              />
                              <div>
                                <h4 className="font-semibold text-dark-300 dark:text-light-100 line-clamp-1">
                                  {service.serviceName}
                                </h4>
                                <p className="text-sm text-gray-500 line-clamp-1 max-w-[200px]">
                                  {service.description}
                                </p>
                              </div>
                            </div>
                          </td>

                          {/* Category */}
                          <td className="px-6 py-4">
                            <Badge variant="primary">
                              {categoryInfo.icon} {categoryInfo.label}
                            </Badge>
                          </td>

                          {/* Price */}
                          <td className="px-6 py-4">
                            <span className="font-bold text-primary-600 dark:text-primary-400">
                              {formatPrice(service.price)}
                            </span>
                          </td>

                          {/* Rating */}
                          <td className="px-6 py-4">
                            {service.reviews?.length > 0 ? (
                              <div className="flex items-center gap-1">
                                <FiStar className="text-amber-400 fill-amber-400" />
                                <span className="font-medium">{avgRating}</span>
                                <span className="text-gray-400 text-sm">
                                  ({service.reviews.length})
                                </span>
                              </div>
                            ) : (
                              <span className="text-gray-400">No reviews</span>
                            )}
                          </td>

                          {/* Date */}
                          <td className="px-6 py-4 text-gray-500">
                            {formatDate(service.createdAt)}
                          </td>

                          {/* Actions */}
                          <td className="px-6 py-4">
                            <div className="flex items-center justify-center gap-2">
                              <Link to={`/services/${service._id}`}>
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  className="p-2 rounded-lg bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 hover:bg-primary-200 dark:hover:bg-primary-900/50 transition-colors"
                                  title="View"
                                >
                                  <FiEye size={18} />
                                </motion.button>
                              </Link>

                              <Link to={`/update-service/${service._id}`}>
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  className="p-2 rounded-lg bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 hover:bg-amber-200 dark:hover:bg-amber-900/50 transition-colors"
                                  title="Edit"
                                >
                                  <FiEdit2 size={18} />
                                </motion.button>
                              </Link>

                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => handleDelete(service)}
                                className="p-2 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
                                title="Delete"
                              >
                                <FiTrash2 size={18} />
                              </motion.button>
                            </div>
                          </td>
                        </motion.tr>
                      );
                    })}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default MyServices;