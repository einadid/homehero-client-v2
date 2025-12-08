// src/components/shared/LoadingSpinner.jsx
import { motion } from 'framer-motion';

const LoadingSpinner = ({ size = 'md', fullScreen = false }) => {
  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24',
  };

  const Spinner = () => (
    <div className="relative">
      {/* Outer ring */}
      <motion.div
        className={`${sizes[size]} rounded-full border-4 border-light-400 dark:border-dark-100`}
        animate={{ rotate: 360 }}
        transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
      />
      
      {/* Inner spinning element */}
      <motion.div
        className={`${sizes[size]} absolute inset-0 rounded-full border-4 border-transparent border-t-primary-500`}
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      />
      
      {/* Center glow */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          className="w-2 h-2 rounded-full bg-primary-500"
          animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
        />
      </div>
      
      {/* Glow effect */}
      <div className="absolute inset-0 -z-10 rounded-full bg-primary-500/20 blur-xl" />
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-light-200/80 dark:bg-dark-300/80 backdrop-blur-sm">
        <div className="flex flex-col items-center gap-4">
          <Spinner />
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-dark-300 dark:text-light-200 font-medium"
          >
            Loading...
          </motion.p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center py-12">
      <Spinner />
    </div>
  );
};

export default LoadingSpinner;