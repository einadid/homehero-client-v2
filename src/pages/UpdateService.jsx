// src/pages/UpdateService.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { 
  FiSave, 
  FiImage, 
  FiDollarSign, 
  FiTag,
  FiFileText,
  FiArrowLeft
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import { axiosPublic } from '../hooks/useAxios';
import { useAuth } from '../hooks/useAuth';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import LoadingSpinner from '../components/shared/LoadingSpinner';
import { SERVICE_CATEGORIES } from '../utils/helpers';

const UpdateService = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    serviceName: '',
    category: '',
    price: '',
    description: '',
    imageUrl: '',
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Fetch service data
  const { data: service, isLoading: isFetching } = useQuery({
    queryKey: ['service', id],
    queryFn: async () => {
      const res = await axiosPublic.get(`/services/${id}`);
      return res.data.data;
    },
  });

  // Populate form when data is loaded
  useEffect(() => {
    if (service) {
      // Check ownership
      if (service.providerEmail !== user?.email) {
        toast.error('You are not authorized to edit this service');
        navigate('/my-services');
        return;
      }

      setFormData({
        serviceName: service.serviceName || '',
        category: service.category || '',
        price: service.price?.toString() || '',
        description: service.description || '',
        imageUrl: service.imageUrl || '',
      });
    }
  }, [service, user, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.serviceName.trim()) {
      newErrors.serviceName = 'Service name is required';
    }

    if (!formData.category) {
      newErrors.category = 'Please select a category';
    }

    if (!formData.price || parseFloat(formData.price) <= 0) {
      newErrors.price = 'Please enter a valid price';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.length < 50) {
      newErrors.description = 'Description should be at least 50 characters';
    }

    if (!formData.imageUrl.trim()) {
      newErrors.imageUrl = 'Image URL is required';
    } else if (!/^https?:\/\/.+/.test(formData.imageUrl)) {
      newErrors.imageUrl = 'Please enter a valid URL';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    setIsLoading(true);
    try {
      await axiosPublic.put(`/services/${id}`, {
        ...formData,
        price: parseFloat(formData.price),
      });
      toast.success('Service updated successfully!');
      navigate('/my-services');
    } catch (error) {
      console.error('Error updating service:', error);
      toast.error(error.response?.data?.message || 'Failed to update service');
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) return <LoadingSpinner fullScreen />;

  return (
    <div className="min-h-screen py-12 px-4">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden -z-10">
        <div className="absolute top-20 right-10 w-72 h-72 rounded-full bg-primary-500/5 blur-3xl" />
        <div className="absolute bottom-20 left-10 w-72 h-72 rounded-full bg-primary-500/5 blur-3xl" />
      </div>

      <div className="container mx-auto max-w-4xl">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-primary-500 mb-6"
        >
          <FiArrowLeft />
          Back to My Services
        </motion.button>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-amber-500 text-white mb-4">
            <FiSave size={32} />
          </div>
          <h1 className="text-4xl font-heading font-bold text-dark-300 dark:text-light-100 mb-2">
            Update Service
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Modify your service listing details
          </p>
        </motion.div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="p-8" hover={false}>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Service Name */}
                <div className="md:col-span-2">
                  <Input
                    label="Service Name"
                    name="serviceName"
                    value={formData.serviceName}
                    onChange={handleChange}
                    placeholder="e.g., Professional Electrical Repair"
                    icon={<FiTag />}
                    error={errors.serviceName}
                    disabled={isLoading}
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-dark-300 dark:text-light-200 mb-2">
                    Category
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    disabled={isLoading}
                    className={`
                      w-full px-4 py-3 rounded-xl appearance-none cursor-pointer
                      bg-light-100 dark:bg-dark-100
                      border-2 ${errors.category ? 'border-red-500' : 'border-light-400 dark:border-dark-100'}
                      focus:outline-none focus:border-primary-500
                      transition-colors
                    `}
                  >
                    <option value="">Select a category</option>
                    {SERVICE_CATEGORIES.map((cat) => (
                      <option key={cat.value} value={cat.value}>
                        {cat.icon} {cat.label}
                      </option>
                    ))}
                  </select>
                  {errors.category && (
                    <p className="mt-2 text-sm text-red-500">{errors.category}</p>
                  )}
                </div>

                {/* Price */}
                <div>
                  <Input
                    label="Price (USD)"
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="e.g., 99.99"
                    icon={<FiDollarSign />}
                    error={errors.price}
                    disabled={isLoading}
                    min="0"
                    step="0.01"
                  />
                </div>

                {/* Image URL */}
                <div className="md:col-span-2">
                  <Input
                    label="Image URL"
                    type="url"
                    name="imageUrl"
                    value={formData.imageUrl}
                    onChange={handleChange}
                    placeholder="https://example.com/service-image.jpg"
                    icon={<FiImage />}
                    error={errors.imageUrl}
                    disabled={isLoading}
                  />
                  {formData.imageUrl && !errors.imageUrl && (
                    <div className="mt-3">
                      <img
                        src={formData.imageUrl}
                        alt="Preview"
                        className="h-32 w-auto rounded-xl object-cover border border-light-400 dark:border-dark-100"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                </div>

                {/* Description */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-dark-300 dark:text-light-200 mb-2">
                    Description
                  </label>
                  <div className="relative">
                    <FiFileText className="absolute left-4 top-4 text-gray-400" />
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      placeholder="Describe your service in detail..."
                      rows={5}
                      disabled={isLoading}
                      className={`
                        w-full pl-12 pr-4 py-3 rounded-xl resize-none
                        bg-light-100 dark:bg-dark-100
                        border-2 ${errors.description ? 'border-red-500' : 'border-light-400 dark:border-dark-100'}
                        focus:outline-none focus:border-primary-500
                        transition-colors
                      `}
                    />
                  </div>
                  <div className="flex justify-between mt-2">
                    {errors.description && (
                      <p className="text-sm text-red-500">{errors.description}</p>
                    )}
                    <p className="text-sm text-gray-400 ml-auto">
                      {formData.description.length} characters
                    </p>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex gap-4 pt-4">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => navigate(-1)}
                  disabled={isLoading}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  loading={isLoading}
                  icon={<FiSave />}
                  className="flex-1"
                >
                  Save Changes
                </Button>
              </div>
            </form>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default UpdateService;