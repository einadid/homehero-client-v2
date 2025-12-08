// src/pages/Services.jsx - Complete Updated Version
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FiSearch, 
  FiFilter, 
  FiX, 
  FiGrid, 
  FiList,
  FiSliders,
  FiChevronDown
} from 'react-icons/fi';
import { axiosPublic } from '../hooks/useAxios';
import SectionHeader from '../components/shared/SectionHeader';
import ServiceCard3D from '../components/3d/ServiceCard3D';
import LoadingSpinner from '../components/shared/LoadingSpinner';
import Button from '../components/ui/Button';
import { SERVICE_CATEGORIES, formatPrice, debounce, getCategoryInfo } from '../utils/helpers';

const Services = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [viewMode, setViewMode] = useState('grid');
  const [showFilters, setShowFilters] = useState(false);
  
  // Filter states
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    sortBy: searchParams.get('sortBy') || 'newest',
  });

  // Build query string - UPDATED VERSION
  const buildQueryString = () => {
    const params = new URLSearchParams();
    
    // Search parameter
    if (filters.search && filters.search.trim()) {
      params.append('search', filters.search.trim());
    }
    
    // Category parameter - চেক করুন যেন 'All Categories' বা খালি না হয়
    if (filters.category && 
        filters.category !== 'All Categories' && 
        filters.category.trim() !== '') {
      params.append('category', filters.category.trim());
    }
    
    // Price range parameters
    if (filters.minPrice && !isNaN(filters.minPrice)) {
      params.append('minPrice', filters.minPrice);
    }
    
    if (filters.maxPrice && !isNaN(filters.maxPrice)) {
      params.append('maxPrice', filters.maxPrice);
    }
    
    // Sort parameter
    if (filters.sortBy && filters.sortBy !== 'newest') {
      params.append('sortBy', filters.sortBy);
    }
    
    return params.toString();
  };

  // Fetch services with Safety Check
  const { data: services = [], isLoading, error, refetch } = useQuery({
    queryKey: ['services', filters],
    queryFn: async () => {
      try {
        const queryString = buildQueryString();
        const endpoint = queryString ? `/services?${queryString}` : '/services';
        
        console.log('Fetching services with URL:', endpoint); // Debug log
        
        const res = await axiosPublic.get(endpoint);
        
        // Safety checks
        if (!res || !res.data) {
          console.error('Invalid response structure');
          return [];
        }

        // Fix: Ensure every service has a valid _id (no typo this time)
        const ensureValidIds = (servicesArray) => {
          return servicesArray.map(service => ({
            ...service,
            // Fallback chain: _id -> id -> generated unique temp ID
            _id: service._id || service.id || `service-\({Date.now()}-\){Math.random().toString(36).slice(2, 10)}`
          }));
        };
        
        // Ensure the response is an array
        if (Array.isArray(res.data)) {
          return ensureValidIds(res.data);
        } else if (res.data.data && Array.isArray(res.data.data)) {
          return ensureValidIds(res.data.data);
        } else if (res.data.services && Array.isArray(res.data.services)) {
          return ensureValidIds(res.data.services);
        }
        
        console.warn('Response is not an array:', res.data);
        return [];
      } catch (err) {
        console.error("Error fetching services:", err);
        console.error("Error details:", err.response?.data);
        return []; // Return empty array on error
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
    retry: 2,
    refetchOnWindowFocus: false,
  });

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== '' && value !== 'All Categories') {
        params.set(key, value);
      }
    });
    setSearchParams(params);
  }, [filters, setSearchParams]);

  // Debounced search handler
  const handleSearchChange = debounce((value) => {
    setFilters(prev => ({ ...prev, search: value }));
  }, 500);

  // Handle filter change
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      search: '',
      category: '',
      minPrice: '',
      maxPrice: '',
      sortBy: 'newest',
    });
  };

  // Check if any filter is active
  const hasActiveFilters = 
    filters.search || 
    (filters.category && filters.category !== 'All Categories') || 
    filters.minPrice || 
    filters.maxPrice;

  // Sort options
  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'rating', label: 'Highest Rated' },
  ];

  return (
    <div className="min-h-screen py-12 px-4">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden -z-10">
        <div className="absolute inset-0 bg-dots opacity-30" />
      </div>

      <div className="container mx-auto">
        {/* Header */}
        <SectionHeader
          badge="All Services"
          title="Find Your Perfect Service"
          subtitle="Browse through our extensive collection of professional home services"
        />

        {/* Search & Filter Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="bg-light-100 dark:bg-dark-200 rounded-2xl border border-light-400 dark:border-dark-100 p-4 lg:p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search Input */}
              <div className="relative flex-1">
                <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search services..."
                  defaultValue={filters.search}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-xl bg-light-200 dark:bg-dark-100 border-2 border-transparent focus:border-primary-500 text-dark-300 dark:text-light-200 placeholder:text-gray-400 focus:outline-none transition-colors"
                />
              </div>

              {/* Category Select */}
              <div className="relative min-w-[200px]">
                <select
                  value={filters.category}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-light-200 dark:bg-dark-100 border-2 border-transparent focus:border-primary-500 text-dark-300 dark:text-light-200 focus:outline-none appearance-none cursor-pointer"
                >
                  <option value="">All Categories</option>
                  {SERVICE_CATEGORIES && SERVICE_CATEGORIES.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
                <FiChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>

              {/* Sort Select */}
              <div className="relative min-w-[180px]">
                <select
                  value={filters.sortBy}
                  onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-light-200 dark:bg-dark-100 border-2 border-transparent focus:border-primary-500 text-dark-300 dark:text-light-200 focus:outline-none appearance-none cursor-pointer"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <FiChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>

              {/* Filter Toggle Button */}
              <Button
                variant={showFilters ? 'primary' : 'ghost'}
                onClick={() => setShowFilters(!showFilters)}
                icon={<FiSliders />}
              >
                Filters
              </Button>
            </div>

            {/* Advanced Filters */}
            <motion.div
              initial={false}
              animate={{ height: showFilters ? 'auto' : 0, opacity: showFilters ? 1 : 0 }}
              className="overflow-hidden"
            >
              <div className="pt-6 mt-6 border-t border-light-400 dark:border-dark-100">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Price Range */}
                  <div>
                    <label className="block text-sm font-medium text-dark-300 dark:text-light-100 mb-2">
                      Price Range
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        placeholder="Min"
                        value={filters.minPrice}
                        onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                        min="0"
                        className="w-full px-3 py-2 rounded-lg bg-light-200 dark:bg-dark-100 border border-light-400 dark:border-dark-100 text-dark-300 dark:text-light-200 focus:outline-none focus:border-primary-500"
                      />
                      <span className="text-gray-400">-</span>
                      <input
                        type="number"
                        placeholder="Max"
                        value={filters.maxPrice}
                        onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                        min="0"
                        className="w-full px-3 py-2 rounded-lg bg-light-200 dark:bg-dark-100 border border-light-400 dark:border-dark-100 text-dark-300 dark:text-light-200 focus:outline-none focus:border-primary-500"
                      />
                    </div>
                  </div>

                  {/* Quick Price Buttons */}
                  <div>
                    <label className="block text-sm font-medium text-dark-300 dark:text-light-100 mb-2">
                      Quick Select
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {[
                        { label: 'Under $50', min: '', max: '50' },
                        { label: '$50-$100', min: '50', max: '100' },
                        { label: '$100-$200', min: '100', max: '200' },
                        { label: '$200+', min: '200', max: '' },
                      ].map((range, index) => (
                        <button
                          key={index}
                          onClick={() => {
                            handleFilterChange('minPrice', range.min);
                            handleFilterChange('maxPrice', range.max);
                          }}
                          className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                            filters.minPrice === range.min && filters.maxPrice === range.max
                              ? 'bg-primary-500 text-white'
                              : 'bg-light-300 dark:bg-dark-100 text-gray-600 dark:text-gray-400 hover:bg-primary-500/20'
                          }`}
                        >
                          {range.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Clear Filters */}
                  <div className="flex items-end">
                    {hasActiveFilters && (
                      <Button
                        variant="ghost"
                        onClick={clearFilters}
                        icon={<FiX />}
                        className="text-red-500"
                      >
                        Clear All Filters
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Results Header */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-600 dark:text-gray-400">
            {isLoading ? (
              'Loading...'
            ) : (
              <>
                Showing <span className="font-semibold text-dark-300 dark:text-light-100">{services?.length || 0}</span> services
                {filters.category && filters.category !== 'All Categories' && (
                  <> in <span className="font-semibold text-primary-500">{getCategoryInfo(filters.category)?.label || filters.category}</span></>
                )}
              </>
            )}
          </p>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-2 bg-light-200 dark:bg-dark-100 p-1 rounded-xl">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'grid'
                  ? 'bg-primary-500 text-white'
                  : 'text-gray-500 hover:text-primary-500'
              }`}
              aria-label="Grid view"
            >
              <FiGrid size={20} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'list'
                  ? 'bg-primary-500 text-white'
                  : 'text-gray-500 hover:text-primary-500'
              }`}
              aria-label="List view"
            >
              <FiList size={20} />
            </button>
          </div>
        </div>

        {/* Active Filters Display */}
        {hasActiveFilters && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-wrap gap-2 mb-6"
          >
            {filters.search && (
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-500/10 text-primary-600 dark:text-primary-400 text-sm">
                Search: "{filters.search}"
                <button 
                  onClick={() => handleFilterChange('search', '')}
                  className="hover:text-primary-700 dark:hover:text-primary-300"
                >
                  <FiX size={14} />
                </button>
              </span>
            )}
            {filters.category && filters.category !== 'All Categories' && (
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-500/10 text-primary-600 dark:text-primary-400 text-sm">
                Category: {getCategoryInfo(filters.category)?.label || filters.category}
                <button 
                  onClick={() => handleFilterChange('category', '')}
                  className="hover:text-primary-700 dark:hover:text-primary-300"
                >
                  <FiX size={14} />
                </button>
              </span>
            )}
            {(filters.minPrice || filters.maxPrice) && (
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-500/10 text-primary-600 dark:text-primary-400 text-sm">
                Price: {filters.minPrice ? formatPrice(filters.minPrice) : '$0'} - {filters.maxPrice ? formatPrice(filters.maxPrice) : 'Any'}
                <button 
                  onClick={() => {
                    handleFilterChange('minPrice', '');
                    handleFilterChange('maxPrice', '');
                  }}
                  className="hover:text-primary-700 dark:hover:text-primary-300"
                >
                  <FiX size={14} />
                </button>
              </span>
            )}
          </motion.div>
        )}

        {/* Services Grid/List */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-light-100 dark:bg-dark-200 rounded-2xl overflow-hidden animate-pulse">
                <div className="h-48 bg-light-300 dark:bg-dark-100" />
                <div className="p-5 space-y-4">
                  <div className="h-6 bg-light-300 dark:bg-dark-100 rounded-lg w-3/4" />
                  <div className="h-4 bg-light-300 dark:bg-dark-100 rounded-lg w-full" />
                  <div className="h-4 bg-light-300 dark:bg-dark-100 rounded-lg w-2/3" />
                  <div className="h-12 bg-light-300 dark:bg-dark-100 rounded-xl" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20"
          >
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-red-500/10 flex items-center justify-center">
              <FiX className="text-red-500" size={40} />
            </div>
            <h3 className="text-xl font-heading font-bold text-dark-300 dark:text-light-100 mb-2">
              Failed to Load Services
            </h3>
            <p className="text-red-500 mb-6">
              {error?.message || 'Please check server connection and try again.'}
            </p>
            <Button variant="primary" onClick={() => refetch()}>
              Retry
            </Button>
          </motion.div>
        ) : !Array.isArray(services) || services.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20"
          >
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-primary-500/10 flex items-center justify-center">
              <FiSearch className="text-primary-500" size={40} />
            </div>
            <h3 className="text-xl font-heading font-bold text-dark-300 dark:text-light-100 mb-2">
              No Services Found
            </h3>
            <p className="text-gray-500 mb-6">
              {hasActiveFilters 
                ? 'Try adjusting your filters or search term' 
                : 'No services are currently available'
              }
            </p>
            {hasActiveFilters && (
              <Button variant="primary" onClick={clearFilters}>
                Clear Filters
              </Button>
            )}
          </motion.div>
        ) : (
          <div className={viewMode === 'grid' 
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'
            : 'space-y-4'
          }>
            {services.map((service, index) => (
              <ServiceCard3D 
                key={service._id || `service-${index}`} 
                service={service} 
                index={index}
                viewMode={viewMode}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Services;