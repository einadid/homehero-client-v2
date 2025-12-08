// src/pages/AddService.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { 
  FiType, 
  FiList, 
  FiDollarSign, 
  FiAlignLeft, 
  FiPlus, 
  FiUploadCloud,
  FiImage,
  FiX
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useAuth } from '../hooks/useAuth';
import { axiosSecure } from '../hooks/useAxios';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import SectionHeader from '../components/shared/SectionHeader';
import { SERVICE_CATEGORIES, getCategoryDefaultImage } from '../utils/helpers';

// ডিফল্ট প্লেইসহোল্ডার ইমেজ (কোনো ক্যাটাগরি সিলেক্ট না হলে)
const PLACEHOLDER_IMAGE = 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&auto=format&fit=crop&q=60';

// ImageBB API
const IMGBB_API_KEY = import.meta.env.VITE_IMGBB_API_KEY;
const IMGBB_HOSTING_URL = `https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`;

const AddService = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);
  
  // Form States
  const [formData, setFormData] = useState({
    serviceName: '',
    category: '',
    price: '',
    description: '',
    location: '',
    duration: '',
  });
  
  // Image States
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(PLACEHOLDER_IMAGE);
  const [isCustomImage, setIsCustomImage] = useState(false); // ইউজার কি নিজে ছবি দিয়েছে?

  // Handle Input Change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // ✅ Handle Category Change - ক্যাটাগরি পাল্টালে ছবি অটো চেঞ্জ
  const handleCategoryChange = (e) => {
    const categoryValue = e.target.value;
    
    // ফর্ম ডেটা আপডেট
    setFormData(prev => ({ ...prev, category: categoryValue }));

    // যদি ইউজার ম্যানুয়ালি কোনো ছবি আপলোড না করে থাকে,
    // তাহলে ক্যাটাগরির ডিফল্ট ছবি সেট হবে
    if (!isCustomImage) {
      const defaultImage = getCategoryDefaultImage(categoryValue);
      setPreviewUrl(defaultImage);
    }
  };

  // ✅ Handle File Change & Preview
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // File size check (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB');
        return;
      }

      // File type check
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file');
        return;
      }

      setSelectedFile(file);
      setIsCustomImage(true); // ইউজার নিজে ছবি দিয়েছে
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
    }
  };

  // ✅ Remove Custom Image - ইউজার চাইলে তার দেওয়া ছবি রিমুভ করতে পারবে
  const handleRemoveImage = () => {
    setSelectedFile(null);
    setIsCustomImage(false);
    
    // যদি ক্যাটাগরি সিলেক্ট করা থাকে, সেই ক্যাটাগরির ডিফল্ট ছবি দেখাও
    if (formData.category) {
      const defaultImage = getCategoryDefaultImage(formData.category);
      setPreviewUrl(defaultImage);
    } else {
      setPreviewUrl(PLACEHOLDER_IMAGE);
    }
  };

  // ✅ Upload Image to ImageBB
  const uploadImage = async () => {
    // যদি ইউজার কাস্টম ফাইল সিলেক্ট করে থাকে
    if (selectedFile) {
      const imageFormData = new FormData();
      imageFormData.append('image', selectedFile);

      try {
        const res = await axios.post(IMGBB_HOSTING_URL, imageFormData);
        if (res.data.success) {
          return res.data.data.url;
        }
        throw new Error('Image upload failed');
      } catch (error) {
        console.error('Image upload error:', error);
        toast.error('Failed to upload image, using category default.');
        // আপলোড ফেইল হলে ক্যাটাগরি ডিফল্ট ব্যবহার করো
        return getCategoryDefaultImage(formData.category);
      }
    }
    
    // যদি কাস্টম ফাইল না থাকে, ক্যাটাগরি ডিফল্ট ইমেজ URL রিটার্ন করো
    return previewUrl;
  };

  // ✅ Mutation with Query Invalidation
  const addServiceMutation = useMutation({
    mutationFn: async (serviceData) => {
      const res = await axiosSecure.post('/services', serviceData);
      return res.data;
    },
    onSuccess: () => {
      // সব সম্পর্কিত queries invalidate করুন
      queryClient.invalidateQueries({ queryKey: ['services'] });
      queryClient.invalidateQueries({ queryKey: ['myServices'] });
      queryClient.invalidateQueries({ queryKey: ['featuredServices'] });
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      
      toast.success('🎉 Service added successfully!');
      navigate('/my-services');
    },
    onError: (error) => {
      console.error(error);
      toast.error(error.response?.data?.message || 'Failed to add service');
    },
    onSettled: () => {
      setIsLoading(false);
    }
  });

  // ✅ Handle Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.serviceName.trim()) {
      toast.error('Please enter service name');
      return;
    }
    if (!formData.category) {
      toast.error('Please select a category');
      return;
    }
    if (!formData.price || parseFloat(formData.price) <= 0) {
      toast.error('Please enter a valid price');
      return;
    }
    if (!formData.description.trim() || formData.description.length < 20) {
      toast.error('Description should be at least 20 characters');
      return;
    }

    setIsLoading(true);

    try {
      // ছবি আপলোড (কাস্টম হলে ImageBB তে, না হলে ডিফল্ট URL)
      const imageUrl = await uploadImage();

      const serviceData = {
        serviceName: formData.serviceName.trim(),
        category: formData.category,
        price: parseFloat(formData.price),
        description: formData.description.trim(),
        imageUrl: imageUrl,
        providerName: user?.displayName || 'Anonymous',
        providerEmail: user?.email,
        providerImage: user?.photoURL || null,
        location: formData.location.trim() || 'Not specified',
        duration: formData.duration.trim() || null,
      };

      addServiceMutation.mutate(serviceData);

    } catch (error) {
      console.error(error);
      toast.error('Something went wrong. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-12 px-4 bg-light-200 dark:bg-dark-300">
      <div className="container mx-auto max-w-2xl">
        <SectionHeader 
          title="Add New Service" 
          subtitle="Share your expertise with the world"
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-light-100 dark:bg-dark-200 rounded-2xl p-8 shadow-xl border border-light-400 dark:border-dark-100"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* ✅ Image Upload Section */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-dark-300 dark:text-light-200">
                Service Image
              </label>
              <div className="relative w-full h-56 rounded-xl overflow-hidden border-2 border-dashed border-primary-500/50 bg-light-200 dark:bg-dark-100 group">
                <img 
                  src={previewUrl} 
                  alt="Service Preview" 
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  onError={(e) => {
                    e.target.src = PLACEHOLDER_IMAGE;
                  }}
                />
                
                {/* Overlay */}
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <FiUploadCloud className="text-white text-5xl mb-2" />
                  <p className="text-white font-medium">Click to upload custom image</p>
                  <p className="text-white/70 text-sm mt-1">Max size: 5MB</p>
                </div>
                
                {/* File Input */}
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                
                {/* Remove Button (শুধু কাস্টম ইমেজ থাকলে দেখাবে) */}
                {isCustomImage && (
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute top-3 right-3 p-2 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-lg transition-colors z-10"
                    title="Remove custom image"
                  >
                    <FiX className="text-lg" />
                  </button>
                )}
              </div>
              
              {/* Image Info */}
              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                <FiImage className="text-primary-500" />
                {isCustomImage ? (
                  <span className="text-green-600 dark:text-green-400">
                    ✓ Custom image selected
                  </span>
                ) : formData.category ? (
                  <span>Using default image for "{formData.category}" category</span>
                ) : (
                  <span>Select a category to see default image, or upload your own</span>
                )}
              </div>
            </div>

            {/* Service Name */}
            <Input
              label="Service Name"
              name="serviceName"
              value={formData.serviceName}
              onChange={handleChange}
              placeholder="e.g., Professional House Cleaning"
              icon={<FiType />}
              required
            />

            {/* ✅ Category Select with Auto Image Change */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-dark-300 dark:text-light-200">
                Category <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <FiList />
                </span>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleCategoryChange}
                  className="w-full pl-12 pr-4 py-3 rounded-xl bg-light-100 dark:bg-dark-100 border-2 border-light-400 dark:border-dark-100 text-dark-300 dark:text-light-200 focus:outline-none focus:border-primary-500 appearance-none cursor-pointer transition-colors"
                  required
                >
                  <option value="" disabled>Select a Category</option>
                  {SERVICE_CATEGORIES.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
                {/* Custom Arrow */}
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                  ▼
                </span>
              </div>
            </div>

            {/* Price & Duration Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Price */}
              <Input
                label="Price ($)"
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="e.g., 50"
                icon={<FiDollarSign />}
                min="1"
                step="0.01"
                required
              />

              {/* Duration (Optional) */}
              <Input
                label="Duration (Optional)"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                placeholder="e.g., 2-3 hours"
                icon={<FiType />}
              />
            </div>

            {/* Location (Optional) */}
            <Input
              label="Service Area (Optional)"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="e.g., Dhaka, Bangladesh"
              icon={<FiType />}
            />

            {/* Description */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-dark-300 dark:text-light-200">
                Description <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-4 top-4 text-gray-400">
                  <FiAlignLeft />
                </span>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe your service in detail... (minimum 20 characters)"
                  rows="5"
                  className="w-full pl-12 pr-4 py-3 rounded-xl bg-light-100 dark:bg-dark-100 border-2 border-light-400 dark:border-dark-100 text-dark-300 dark:text-light-200 focus:outline-none focus:border-primary-500 resize-none transition-colors"
                  required
                  minLength={20}
                />
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 text-right">
                {formData.description.length}/20 characters minimum
              </p>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              loading={isLoading}
              disabled={isLoading}
              icon={<FiPlus />}
            >
              {isLoading ? 'Adding Service...' : 'Add Service'}
            </Button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default AddService;