// src/pages/ErrorPage.jsx
import { Link, useRouteError } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiHome, FiArrowLeft, FiAlertTriangle } from 'react-icons/fi';

const ErrorPage = () => {
  const error = useRouteError();

  return (
    <div className="min-h-screen bg-light-200 dark:bg-dark-300 flex items-center justify-center p-4">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-primary-500/5 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-primary-500/5 blur-3xl" />
      </div>

      <div className="relative text-center max-w-lg">
        {/* 404 Animation */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', duration: 1 }}
          className="relative mb-8"
        >
          <motion.h1
            className="text-[150px] md:text-[200px] font-heading font-bold text-primary-500/20"
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            404
          </motion.h1>
          
          {/* Floating Icon */}
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            animate={{ 
              y: [0, -20, 0],
              rotate: [0, 5, -5, 0] 
            }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            <div className="w-24 h-24 rounded-2xl bg-primary-500 flex items-center justify-center shadow-2xl shadow-primary-500/30">
              <FiAlertTriangle size={48} className="text-white" />
            </div>
          </motion.div>
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-dark-300 dark:text-light-100 mb-4">
            Page Not Found
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
            Oops! The page you're looking for doesn't exist or has been moved.
            Let's get you back on track.
          </p>

          {error && (
            <p className="text-sm text-red-500 mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-900/20">
              {error.statusText || error.message}
            </p>
          )}

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/" className="btn-primary flex items-center gap-2">
              <FiHome />
              Back to Home
            </Link>
            <button
              onClick={() => window.history.back()}
              className="btn-secondary flex items-center gap-2"
            >
              <FiArrowLeft />
              Go Back
            </button>
          </div>
        </motion.div>

        {/* Decorative Elements */}
        <div className="absolute -z-10">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 rounded-full bg-primary-500/30"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
              }}
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                duration: 2 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;