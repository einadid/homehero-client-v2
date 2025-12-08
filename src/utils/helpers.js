// src/utils/helpers.js

// ============================================================
// SERVICE CATEGORIES WITH ICONS & DEFAULT IMAGES
// ============================================================

export const SERVICE_CATEGORIES = [
  { 
    value: 'cleaning', 
    label: 'Cleaning',
    icon: '🧹',
    color: 'bg-blue-500',
    defaultImage: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&auto=format&fit=crop&q=60'
  },
  { 
    value: 'plumbing', 
    label: 'Plumbing',
    icon: '🔧',
    color: 'bg-cyan-500',
    defaultImage: 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=800&auto=format&fit=crop&q=60'
  },
  { 
    value: 'electrical', 
    label: 'Electrical',
    icon: '⚡',
    color: 'bg-yellow-500',
    defaultImage: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&auto=format&fit=crop&q=60'
  },
  { 
    value: 'painting', 
    label: 'Painting',
    icon: '🎨',
    color: 'bg-pink-500',
    defaultImage: 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=800&auto=format&fit=crop&q=60'
  },
  { 
    value: 'carpentry', 
    label: 'Carpentry',
    icon: '🔨',
    color: 'bg-amber-600',
    defaultImage: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=800&auto=format&fit=crop&q=60'
  },
  { 
    value: 'gardening', 
    label: 'Gardening',
    icon: '🌿',
    color: 'bg-green-500',
    defaultImage: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&auto=format&fit=crop&q=60'
  },
  { 
    value: 'moving', 
    label: 'Moving & Shifting',
    icon: '📦',
    color: 'bg-orange-500',
    defaultImage: 'https://images.unsplash.com/photo-1600518464441-9154a4dea21b?w=800&auto=format&fit=crop&q=60'
  },
  { 
    value: 'appliance', 
    label: 'Appliance Repair',
    icon: '🔌',
    color: 'bg-slate-500',
    defaultImage: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&auto=format&fit=crop&q=60'
  },
  { 
    value: 'pest-control', 
    label: 'Pest Control',
    icon: '🐛',
    color: 'bg-red-500',
    defaultImage: 'https://images.unsplash.com/photo-1632935191446-60ef0e857a4e?w=800&auto=format&fit=crop&q=60'
  },
  { 
    value: 'ac-service', 
    label: 'AC Service',
    icon: '❄️',
    color: 'bg-sky-500',
    defaultImage: 'https://images.unsplash.com/photo-1631545308218-f29cead4c6ce?w=800&auto=format&fit=crop&q=60'
  },
  { 
    value: 'beauty', 
    label: 'Beauty & Spa',
    icon: '💅',
    color: 'bg-purple-500',
    defaultImage: 'https://images.unsplash.com/photo-1560750588-73207b1ef5b8?w=800&auto=format&fit=crop&q=60'
  },
  { 
    value: 'tutoring', 
    label: 'Tutoring',
    icon: '📚',
    color: 'bg-indigo-500',
    defaultImage: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&auto=format&fit=crop&q=60'
  },
  { 
    value: 'catering', 
    label: 'Catering',
    icon: '🍽️',
    color: 'bg-rose-500',
    defaultImage: 'https://images.unsplash.com/photo-1555244162-803834f70033?w=800&auto=format&fit=crop&q=60'
  },
  { 
    value: 'photography', 
    label: 'Photography',
    icon: '📷',
    color: 'bg-violet-500',
    defaultImage: 'https://images.unsplash.com/photo-1554048612-b6a482bc67e5?w=800&auto=format&fit=crop&q=60'
  },
  { 
    value: 'security', 
    label: 'Security',
    icon: '🔒',
    color: 'bg-gray-600',
    defaultImage: 'https://images.unsplash.com/photo-1558002038-1055907df827?w=800&auto=format&fit=crop&q=60'
  },
  { 
    value: 'laundry', 
    label: 'Laundry',
    icon: '👕',
    color: 'bg-teal-500',
    defaultImage: 'https://images.unsplash.com/photo-1545173168-9f1947eebb7f?w=800&auto=format&fit=crop&q=60'
  },
  { 
    value: 'other', 
    label: 'Other',
    icon: '🔧',
    color: 'bg-gray-500',
    defaultImage: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=800&auto=format&fit=crop&q=60'
  },
];

// ============================================================
// CATEGORY HELPER FUNCTIONS
// ============================================================

/**
 * Get category info by value
 * @param {string} categoryValue - The category value (e.g., 'cleaning', 'plumbing')
 * @returns {object} - Category object with value, label, icon, color, defaultImage
 */
export const getCategoryInfo = (categoryValue) => {
  const category = SERVICE_CATEGORIES.find(
    (cat) => cat.value === categoryValue || cat.label.toLowerCase() === categoryValue?.toLowerCase()
  );
  
  if (category) return category;

  // Default fallback if category not found
  return {
    value: categoryValue || 'other',
    label: categoryValue ? categoryValue.charAt(0).toUpperCase() + categoryValue.slice(1) : 'Other',
    icon: '🔧',
    color: 'bg-gray-500',
    defaultImage: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=800&auto=format&fit=crop&q=60'
  };
};

/**
 * Get default image by category value
 * @param {string} categoryValue - The category value
 * @returns {string} - Default image URL for the category
 */
export const getCategoryDefaultImage = (categoryValue) => {
  const category = getCategoryInfo(categoryValue);
  return category.defaultImage;
};

/**
 * Get category label by value
 * @param {string} categoryValue - The category value
 * @returns {string} - Category label
 */
export const getCategoryLabel = (categoryValue) => {
  const category = getCategoryInfo(categoryValue);
  return category.label;
};

/**
 * Get category icon by value
 * @param {string} categoryValue - The category value
 * @returns {string} - Category icon (emoji)
 */
export const getCategoryIcon = (categoryValue) => {
  const category = getCategoryInfo(categoryValue);
  return category.icon;
};

// ============================================================
// FORMATTING FUNCTIONS
// ============================================================

/**
 * Format price to currency string
 * @param {number} price - Price value
 * @param {string} currency - Currency code (default: USD)
 * @returns {string} - Formatted price string
 */
export const formatPrice = (price, currency = 'USD') => {
  if (price === null || price === undefined || isNaN(price)) {
    return '$0.00';
  }
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(price);
};

/**
 * Format date to readable string
 * @param {string|Date} dateString - Date string or Date object
 * @param {object} options - Intl.DateTimeFormat options
 * @returns {string} - Formatted date string
 */
export const formatDate = (dateString, options = {}) => {
  if (!dateString) return 'N/A';
  
  const defaultOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...options
  };
  
  try {
    return new Date(dateString).toLocaleDateString('en-US', defaultOptions);
  } catch (error) {
    return 'Invalid Date';
  }
};

/**
 * Format date with time
 * @param {string|Date} dateString - Date string or Date object
 * @returns {string} - Formatted date and time string
 */
export const formatDateTime = (dateString) => {
  if (!dateString) return 'N/A';
  
  try {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch (error) {
    return 'Invalid Date';
  }
};

/**
 * Get relative time (e.g., "2 hours ago", "3 days ago")
 * @param {string|Date} dateString - Date string or Date object
 * @returns {string} - Relative time string
 */
export const getRelativeTime = (dateString) => {
  if (!dateString) return 'N/A';
  
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 604800)} weeks ago`;
    if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)} months ago`;
    return `${Math.floor(diffInSeconds / 31536000)} years ago`;
  } catch (error) {
    return 'Invalid Date';
  }
};

// ============================================================
// STATUS HELPER FUNCTIONS
// ============================================================

/**
 * Get status color classes for badges
 * @param {string} status - Booking status
 * @returns {string} - Tailwind CSS classes for the status
 */
export const getStatusColor = (status) => {
  const colors = {
    pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    confirmed: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    'in-progress': 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
    completed: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    cancelled: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
    rejected: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
  };
  return colors[status?.toLowerCase()] || colors.pending;
};

/**
 * Get status badge with icon
 * @param {string} status - Booking status
 * @returns {object} - Object with color, icon, and label
 */
export const getStatusBadge = (status) => {
  const badges = {
    pending: { color: 'yellow', icon: '⏳', label: 'Pending' },
    confirmed: { color: 'blue', icon: '✓', label: 'Confirmed' },
    'in-progress': { color: 'purple', icon: '🔄', label: 'In Progress' },
    completed: { color: 'green', icon: '✅', label: 'Completed' },
    cancelled: { color: 'red', icon: '✕', label: 'Cancelled' },
    rejected: { color: 'red', icon: '❌', label: 'Rejected' },
  };
  return badges[status?.toLowerCase()] || badges.pending;
};

// ============================================================
// VALIDATION HELPER FUNCTIONS
// ============================================================

/**
 * Validate email format
 * @param {string} email - Email string
 * @returns {boolean} - Is valid email
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate phone number (basic)
 * @param {string} phone - Phone number string
 * @returns {boolean} - Is valid phone
 */
export const isValidPhone = (phone) => {
  const phoneRegex = /^[\d\s\-+()]{10,}$/;
  return phoneRegex.test(phone);
};

/**
 * Validate URL
 * @param {string} url - URL string
 * @returns {boolean} - Is valid URL
 */
export const isValidUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// ============================================================
// STRING HELPER FUNCTIONS
// ============================================================

/**
 * Truncate text with ellipsis
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} - Truncated text
 */
export const truncateText = (text, maxLength = 100) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
};

/**
 * Capitalize first letter of each word
 * @param {string} text - Text to capitalize
 * @returns {string} - Capitalized text
 */
export const capitalizeWords = (text) => {
  if (!text) return '';
  return text
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

/**
 * Generate slug from text
 * @param {string} text - Text to convert
 * @returns {string} - URL-friendly slug
 */
export const generateSlug = (text) => {
  if (!text) return '';
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

// ============================================================
// NUMBER HELPER FUNCTIONS
// ============================================================

/**
 * Format number with commas
 * @param {number} num - Number to format
 * @returns {string} - Formatted number
 */
export const formatNumber = (num) => {
  if (num === null || num === undefined || isNaN(num)) return '0';
  return new Intl.NumberFormat('en-US').format(num);
};

/**
 * Calculate average rating from reviews
 * @param {Array} reviews - Array of review objects with rating property
 * @returns {number} - Average rating (0-5)
 */
export const calculateAverageRating = (reviews) => {
  if (!reviews || reviews.length === 0) return 0;
  
  const totalRating = reviews.reduce((sum, review) => sum + (review.rating || 0), 0);
  return parseFloat((totalRating / reviews.length).toFixed(1));
};

/**
 * Generate star rating display
 * @param {number} rating - Rating value (0-5)
 * @returns {string} - Star string
 */
export const generateStarRating = (rating) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
  
  return '★'.repeat(fullStars) + (hasHalfStar ? '½' : '') + '☆'.repeat(emptyStars);
};

// ============================================================
// MISCELLANEOUS HELPER FUNCTIONS
// ============================================================

/**
 * Debounce function
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in ms
 * @returns {Function} - Debounced function
 */
export const debounce = (func, wait = 300) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Deep clone an object
 * @param {object} obj - Object to clone
 * @returns {object} - Cloned object
 */
export const deepClone = (obj) => {
  return JSON.parse(JSON.stringify(obj));
};

/**
 * Check if object is empty
 * @param {object} obj - Object to check
 * @returns {boolean} - Is empty
 */
export const isEmptyObject = (obj) => {
  return obj && Object.keys(obj).length === 0 && obj.constructor === Object;
};

/**
 * Get initials from name
 * @param {string} name - Full name
 * @returns {string} - Initials (e.g., "JD" for "John Doe")
 */
export const getInitials = (name) => {
  if (!name) return 'U';
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
};

/**
 * Generate random ID
 * @param {number} length - ID length
 * @returns {string} - Random ID
 */
export const generateId = (length = 8) => {
  return Math.random().toString(36).substring(2, 2 + length);
};

/**
 * Sort array of objects by key
 * @param {Array} array - Array to sort
 * @param {string} key - Key to sort by
 * @param {string} order - 'asc' or 'desc'
 * @returns {Array} - Sorted array
 */
export const sortByKey = (array, key, order = 'asc') => {
  return [...array].sort((a, b) => {
    if (a[key] < b[key]) return order === 'asc' ? -1 : 1;
    if (a[key] > b[key]) return order === 'asc' ? 1 : -1;
    return 0;
  });
};

// ============================================================
// EXPORT DEFAULT OBJECT (Alternative import style)
// ============================================================

const helpers = {
  SERVICE_CATEGORIES,
  getCategoryInfo,
  getCategoryDefaultImage,
  getCategoryLabel,
  getCategoryIcon,
  formatPrice,
  formatDate,
  formatDateTime,
  getRelativeTime,
  getStatusColor,
  getStatusBadge,
  isValidEmail,
  isValidPhone,
  isValidUrl,
  truncateText,
  capitalizeWords,
  generateSlug,
  formatNumber,
  calculateAverageRating,
  generateStarRating,
  debounce,
  deepClone,
  isEmptyObject,
  getInitials,
  generateId,
  sortByKey,
};

export default helpers;