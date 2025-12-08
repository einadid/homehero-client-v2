// src/pages/Profile.jsx - Clean & Optimized
import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiUser, 
  FiMail, 
  FiCalendar, 
  FiClock, 
  FiEdit2, 
  FiCamera, 
  FiSave,
  FiX,
  FiShield,
  FiCheckCircle,
  FiGrid,
  FiDollarSign,
  FiStar,
  FiTrendingUp,
  FiUploadCloud
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useAuth } from '../hooks/useAuth';
import { axiosSecure } from '../hooks/useAxios';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';
import LoadingSpinner from '../components/shared/LoadingSpinner';
import { formatPrice } from '../utils/helpers';

// ImageBB Configuration
const IMGBB_API_KEY = import.meta.env.VITE_IMGBB_API_KEY;
const IMGBB_UPLOAD_URL = `https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`;
const DEFAULT_AVATAR = 'https://i.ibb.co/5GzXkwq/user.png';

const Profile = () => {
  const { user, updateUserProfile, getLastSignInTime, getCreationTime } = useAuth();
  const queryClient = useQueryClient();
  
  // Modal State
  const [isEditing, setIsEditing] = useState(false);
  
  // Image States
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  
  // Loading States
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
    displayName: user?.displayName || '',
    photoURL: user?.photoURL || '',
  });
  
  const [errors, setErrors] = useState({});

  // ==================== QUERIES ====================
  
  // Fetch User Statistics
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['userStats', user?.email],
    queryFn: async () => {
      const { data } = await axiosSecure.get(`/users/stats/${user?.email}`);
      return data;
    },
    enabled: !!user?.email,
  });

  // ==================== HANDLERS ====================
  
  // Handle Input Change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // Handle File Selection
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select a valid image file');
      return;
    }
    
    // Validate file size (2MB max)
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Image size must be less than 2MB');
      return;
    }

    // Set file and create preview
    setSelectedFile(file);
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    
    // Clear photo URL error if exists
    if (errors.photoURL) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.photoURL;
        return newErrors;
      });
    }
  };

  // Remove Selected Image
  const handleRemoveImage = () => {
    if (previewUrl && previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(previewUrl);
    }
    setSelectedFile(null);
    setPreviewUrl(null);
  };

  // Upload Image to ImageBB
  const uploadImage = async () => {
    if (!selectedFile) return null;

    const formDataImg = new FormData();
    formDataImg.append('image', selectedFile);

    try {
      setIsUploading(true);
      const { data } = await axios.post(IMGBB_UPLOAD_URL, formDataImg);
      
      if (data.success) {
        return data.data.url;
      }
      throw new Error('Upload failed');
      
    } catch (error) {
      console.error('Image upload error:', error);
      toast.error('Failed to upload image');
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  // Validate Form
  const validateForm = () => {
    const newErrors = {};

    // Validate display name
    const name = formData.displayName.trim();
    if (!name) {
      newErrors.displayName = 'Name is required';
    } else if (name.length < 3) {
      newErrors.displayName = 'Name must be at least 3 characters';
    } else if (name.length > 50) {
      newErrors.displayName = 'Name must be less than 50 characters';
    }

    // Validate photo URL (if provided)
    if (formData.photoURL && formData.photoURL.trim()) {
      const urlPattern = /^https?:\/\/.+\..+/;
      if (!urlPattern.test(formData.photoURL.trim())) {
        newErrors.photoURL = 'Please enter a valid URL';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle Form Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    setIsSubmitting(true);
    const loadingToast = toast.loading('Updating profile...');

    try {
      let photoURL = formData.photoURL?.trim() || user?.photoURL || '';

      // Upload image if selected
      if (selectedFile) {
        toast.loading('Uploading image...', { id: loadingToast });
        const uploadedUrl = await uploadImage();
        
        if (uploadedUrl) {
          photoURL = uploadedUrl;
        } else {
          throw new Error('Image upload failed');
        }
      }

      // Update Firebase profile
      toast.loading('Saving changes...', { id: loadingToast });
      await updateUserProfile(formData.displayName.trim(), photoURL);
      
      // Success
      toast.success('Profile updated successfully!', { id: loadingToast });
      
      // Refresh stats
      queryClient.invalidateQueries(['userStats']);
      
      // Close modal
      handleCloseModal();
      
    } catch (error) {
      console.error('Profile update error:', error);
      toast.error(
        error.message || 'Failed to update profile. Please try again.',
        { id: loadingToast }
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Open Edit Modal
  const handleOpenModal = () => {
    setFormData({
      displayName: user?.displayName || '',
      photoURL: user?.photoURL || '',
    });
    setErrors({});
    setSelectedFile(null);
    setPreviewUrl(null);
    setIsEditing(true);
  };

  // Close Edit Modal
  const handleCloseModal = () => {
    // Cleanup
    if (previewUrl && previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(previewUrl);
    }
    
    setFormData({
      displayName: user?.displayName || '',
      photoURL: user?.photoURL || '',
    });
    setSelectedFile(null);
    setPreviewUrl(null);
    setErrors({});
    setIsEditing(false);
  };

  // Get Current Photo URL
  const getCurrentPhotoUrl = () => {
    if (previewUrl) return previewUrl;
    if (formData.photoURL?.trim()) return formData.photoURL.trim();
    if (user?.photoURL) return user.photoURL;
    return DEFAULT_AVATAR;
  };

  // ==================== DATA ====================
  
  const infoItems = [
    { 
      label: 'Member Since', 
      value: getCreationTime(), 
      icon: <FiCalendar className="text-primary-500" /> 
    },
    { 
      label: 'Last Login', 
      value: getLastSignInTime(), 
      icon: <FiClock className="text-emerald-500" /> 
    },
    { 
      label: 'Account Status', 
      value: user?.emailVerified ? 'Verified' : 'Active', 
      icon: <FiShield className="text-amber-500" /> 
    },
  ];

  const statCards = [
    {
      label: 'My Services',
      value: stats?.totalServices || 0,
      icon: <FiGrid />,
      color: 'bg-primary-500',
    },
    {
      label: 'Total Bookings',
      value: stats?.totalBookingsReceived || 0,
      icon: <FiCalendar />,
      color: 'bg-emerald-500',
    },
    {
      label: 'Total Revenue',
      value: formatPrice(stats?.totalRevenue || 0),
      icon: <FiDollarSign />,
      color: 'bg-amber-500',
    },
    {
      label: 'Average Rating',
      value: stats?.averageRating?.toFixed(1) || '0.0',
      icon: <FiStar />,
      color: 'bg-rose-500',
    },
  ];

  // ==================== RENDER ====================
  
  return (
    <div className="min-h-screen py-12 px-4">
      {/* Background Decoration */}
      <div className="absolute inset-0 overflow-hidden -z-10">
        <div className="absolute top-20 left-10 w-72 h-72 rounded-full bg-primary-500/5 blur-3xl" />
        <div className="absolute bottom-20 right-10 w-72 h-72 rounded-full bg-primary-500/5 blur-3xl" />
      </div>

      <div className="container mx-auto max-w-6xl">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-heading font-bold text-dark-300 dark:text-light-100 mb-2">
            My Profile
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your account settings and view statistics
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* ========== LEFT SIDEBAR ========== */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-1"
          >
            {/* Profile Card */}
            <Card className="text-center p-8" hover={false}>
              {/* Avatar */}
              <div className="relative inline-block mb-6">
                <motion.div whileHover={{ scale: 1.05 }} className="relative">
                  <img
                    src={user?.photoURL || DEFAULT_AVATAR}
                    alt={user?.displayName || 'User'}
                    className="w-32 h-32 rounded-2xl object-cover border-4 border-primary-500/20 shadow-xl"
                    onError={(e) => { e.target.src = DEFAULT_AVATAR; }}
                  />
                  <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-xl bg-primary-500 flex items-center justify-center shadow-lg">
                    <FiCamera className="text-white" />
                  </div>
                  {/* Online Indicator */}
                  <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white dark:border-dark-200" />
                </motion.div>
              </div>

              {/* User Info */}
              <h2 className="text-2xl font-heading font-bold text-dark-300 dark:text-light-100 mb-2">
                {user?.displayName || 'User'}
              </h2>
              
              <p className="text-gray-500 dark:text-gray-400 flex items-center justify-center gap-2 text-sm mb-4">
                <FiMail size={16} />
                <span className="truncate max-w-[200px]">{user?.email}</span>
              </p>

              {/* Verified Badge */}
              {user?.emailVerified && (
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-sm mb-6">
                  <FiCheckCircle size={14} />
                  <span>Verified Account</span>
                </div>
              )}

              {/* Edit Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleOpenModal}
                type="button"
                className="w-full py-3 rounded-xl bg-primary-500/10 text-primary-600 dark:text-primary-400 font-semibold flex items-center justify-center gap-2 hover:bg-primary-500/20 transition-colors"
              >
                <FiEdit2 />
                Edit Profile
              </motion.button>
            </Card>

            {/* Info Stats */}
            <div className="mt-6 space-y-3">
              {infoItems.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                >
                  <Card className="p-4" hover={false}>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-light-200 dark:bg-dark-100 flex items-center justify-center flex-shrink-0">
                        {item.icon}
                      </div>
                      <div className="text-left flex-1 min-w-0">
                        <p className="text-xs text-gray-500 dark:text-gray-400">{item.label}</p>
                        <p className="font-semibold text-dark-300 dark:text-light-100 text-sm truncate">
                          {item.value}
                        </p>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* ========== RIGHT CONTENT ========== */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {statCards.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                >
                  <Card className="p-4 text-center" hover={false}>
                    <div className={`w-12 h-12 mx-auto mb-3 rounded-xl ${stat.color} flex items-center justify-center text-white`}>
                      {stat.icon}
                    </div>
                    <p className="text-2xl font-heading font-bold text-dark-300 dark:text-light-100">
                      {statsLoading ? (
                        <span className="inline-block w-12 h-8 bg-light-300 dark:bg-dark-100 rounded animate-pulse" />
                      ) : (
                        stat.value
                      )}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {stat.label}
                    </p>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Profile Information */}
            <Card className="p-6" hover={false}>
              <h3 className="text-lg font-heading font-semibold text-dark-300 dark:text-light-100 mb-6 flex items-center gap-2">
                <FiUser className="text-primary-500" />
                Profile Information
              </h3>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-xl bg-light-200 dark:bg-dark-100">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Full Name</p>
                    <p className="font-semibold text-dark-300 dark:text-light-100 truncate">
                      {user?.displayName || 'Not set'}
                    </p>
                  </div>
                  <FiUser className="text-gray-400 flex-shrink-0 ml-4" />
                </div>

                <div className="flex items-center justify-between p-4 rounded-xl bg-light-200 dark:bg-dark-100">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Email Address</p>
                    <p className="font-semibold text-dark-300 dark:text-light-100 truncate">
                      {user?.email}
                    </p>
                  </div>
                  <FiMail className="text-gray-400 flex-shrink-0 ml-4" />
                </div>

                <div className="flex items-center justify-between p-4 rounded-xl bg-light-200 dark:bg-dark-100">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Photo URL</p>
                    <p className="font-semibold text-dark-300 dark:text-light-100 truncate text-sm">
                      {user?.photoURL || 'Default avatar'}
                    </p>
                  </div>
                  <FiCamera className="text-gray-400 flex-shrink-0 ml-4" />
                </div>

                <div className="flex items-center justify-between p-4 rounded-xl bg-light-200 dark:bg-dark-100">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">User ID</p>
                    <p className="font-semibold text-dark-300 dark:text-light-100 truncate text-xs font-mono">
                      {user?.uid}
                    </p>
                  </div>
                  <FiShield className="text-gray-400 flex-shrink-0 ml-4" />
                </div>
              </div>
            </Card>

            {/* Performance Overview */}
            <Card className="p-6" hover={false}>
              <h3 className="text-lg font-heading font-semibold text-dark-300 dark:text-light-100 mb-6 flex items-center gap-2">
                <FiTrendingUp className="text-primary-500" />
                Performance Overview
              </h3>

              {statsLoading ? (
                <div className="flex justify-center py-8">
                  <LoadingSpinner size="md" />
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Monthly Goal */}
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-500 dark:text-gray-400">Monthly Goal</span>
                      <span className="font-medium text-dark-300 dark:text-light-100">
                        {formatPrice(stats?.totalRevenue || 0)} / $1,000
                      </span>
                    </div>
                    <div className="h-3 rounded-full bg-light-300 dark:bg-dark-100 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min((stats?.totalRevenue || 0) / 10, 100)}%` }}
                        transition={{ duration: 1, delay: 0.5 }}
                        className="h-full bg-primary-500 rounded-full"
                      />
                    </div>
                  </div>

                  {/* Average Rating */}
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-500 dark:text-gray-400">Average Rating</span>
                      <span className="font-medium text-dark-300 dark:text-light-100">
                        {stats?.averageRating?.toFixed(1) || '0.0'} / 5.0
                      </span>
                    </div>
                    <div className="h-3 rounded-full bg-light-300 dark:bg-dark-100 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${((stats?.averageRating || 0) / 5) * 100}%` }}
                        transition={{ duration: 1, delay: 0.7 }}
                        className="h-full bg-amber-500 rounded-full"
                      />
                    </div>
                  </div>

                  {/* Completed Bookings */}
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-500 dark:text-gray-400">Completed Bookings</span>
                      <span className="font-medium text-dark-300 dark:text-light-100">
                        {stats?.completedBookings || 0} / {stats?.totalBookingsReceived || 0}
                      </span>
                    </div>
                    <div className="h-3 rounded-full bg-light-300 dark:bg-dark-100 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ 
                          width: `${stats?.totalBookingsReceived ? 
                            ((stats?.completedBookings || 0) / stats.totalBookingsReceived) * 100 : 0}%` 
                        }}
                        transition={{ duration: 1, delay: 0.9 }}
                        className="h-full bg-emerald-500 rounded-full"
                      />
                    </div>
                  </div>
                </div>
              )}
            </Card>

            {/* Sign-in Methods */}
            <Card className="p-6" hover={false}>
              <h3 className="text-lg font-heading font-semibold text-dark-300 dark:text-light-100 mb-6">
                Sign-in Methods
              </h3>
              <div className="flex flex-wrap gap-3">
                {user?.providerData?.map((provider, index) => (
                  <div
                    key={index}
                    className="px-4 py-2 rounded-xl bg-light-200 dark:bg-dark-100 flex items-center gap-2"
                  >
                    {provider.providerId === 'google.com' ? (
                      <img
                        src="https://www.google.com/favicon.ico"
                        alt="Google"
                        className="w-5 h-5"
                      />
                    ) : (
                      <FiMail className="text-primary-500" size={20} />
                    )}
                    <span className="text-sm font-medium text-dark-300 dark:text-light-100 capitalize">
                      {provider.providerId.replace('.com', '')}
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        </div>

        {/* ========== EDIT MODAL ========== */}
        <AnimatePresence>
          {isEditing && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={handleCloseModal}
                className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm"
              />

              {/* Modal Container */}
              <div className="fixed inset-0 z-[101] overflow-y-auto pointer-events-none">
                <div className="flex min-h-full items-center justify-center p-4">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    transition={{ duration: 0.2 }}
                    className="w-full max-w-md pointer-events-auto"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Card className="p-6" hover={false}>
                      {/* Modal Header */}
                      <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-heading font-bold text-dark-300 dark:text-light-100">
                          Edit Profile
                        </h2>
                        <button
                          type="button"
                          onClick={handleCloseModal}
                          disabled={isSubmitting}
                          className="p-2 rounded-lg hover:bg-light-300 dark:hover:bg-dark-100 transition-colors disabled:opacity-50"
                          aria-label="Close modal"
                        >
                          <FiX size={20} className="text-gray-500" />
                        </button>
                      </div>

                      {/* Image Preview & Upload */}
                      <div className="flex flex-col items-center mb-6">
                        <div className="relative group">
                          <img
                            src={getCurrentPhotoUrl()}
                            alt="Profile preview"
                            className="w-32 h-32 rounded-2xl object-cover border-4 border-primary-500/20 shadow-xl"
                            onError={(e) => { e.target.src = DEFAULT_AVATAR; }}
                          />
                          
                          {/* Upload Overlay */}
                          <label className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer rounded-2xl">
                            <FiUploadCloud className="text-white text-2xl mb-1" />
                            <span className="text-white text-xs font-medium">Change Photo</span>
                            <input 
                              type="file" 
                              accept="image/*"
                              onChange={handleFileChange}
                              disabled={isSubmitting}
                              className="hidden"
                              aria-label="Upload profile photo"
                            />
                          </label>

                          {/* Remove Button */}
                          {previewUrl && (
                            <button
                              type="button"
                              onClick={handleRemoveImage}
                              disabled={isSubmitting}
                              className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-colors shadow-lg z-10 disabled:opacity-50"
                              aria-label="Remove image"
                            >
                              <FiX size={16} />
                            </button>
                          )}
                        </div>

                        {/* Upload Progress */}
                        {isUploading && (
                          <div className="mt-3 flex items-center gap-2 text-sm text-primary-500">
                            <div className="w-4 h-4 border-2 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" />
                            <span>Uploading image...</span>
                          </div>
                        )}
                        
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
                          Click image to upload new photo (max 2MB)
                        </p>
                      </div>

                      {/* Edit Form */}
                      <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Display Name */}
                        <Input
                          label="Display Name"
                          type="text"
                          name="displayName"
                          value={formData.displayName}
                          onChange={handleChange}
                          placeholder="Enter your name"
                          icon={<FiUser />}
                          error={errors.displayName}
                          disabled={isSubmitting}
                          required
                        />

                        {/* Photo URL */}
                        <Input
                          label="Photo URL (Optional)"
                          type="url"
                          name="photoURL"
                          value={formData.photoURL}
                          onChange={handleChange}
                          placeholder="https://example.com/photo.jpg"
                          icon={<FiCamera />}
                          error={errors.photoURL}
                          disabled={isSubmitting}
                        />

                        {/* Info Box */}
                        <div className="p-3 rounded-xl bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800">
                          <p className="text-xs text-primary-600 dark:text-primary-400">
                            💡 <strong>Tip:</strong> You can either upload an image or paste a URL. Uploaded images will be stored permanently.
                          </p>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3 pt-4">
                          <button
                            type="button"
                            onClick={handleCloseModal}
                            disabled={isSubmitting}
                            className="flex-1 px-4 py-3 rounded-xl font-semibold transition-all duration-200 bg-light-300 dark:bg-dark-100 text-dark-300 dark:text-light-100 hover:bg-light-400 dark:hover:bg-dark-50 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Cancel
                          </button>
                          
                          <button
                            type="submit"
                            disabled={isSubmitting || isUploading}
                            className="flex-1 px-4 py-3 rounded-xl font-semibold transition-all duration-200 bg-primary-500 text-white hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                          >
                            {isSubmitting ? (
                              <>
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                <span>Saving...</span>
                              </>
                            ) : (
                              <>
                                <FiSave />
                                <span>Save Changes</span>
                              </>
                            )}
                          </button>
                        </div>
                      </form>
                    </Card>
                  </motion.div>
                </div>
              </div>
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Profile;