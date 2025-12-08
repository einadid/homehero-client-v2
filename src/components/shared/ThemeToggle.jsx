// src/components/shared/ThemeToggle.jsx
import { motion } from 'framer-motion';
import { FiSun, FiMoon } from 'react-icons/fi';
import { useTheme } from '../../providers/ThemeProvider';

const ThemeToggle = ({ className = '' }) => {
  const { theme, toggleTheme, isDark } = useTheme();

  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={toggleTheme}
      className={`
        relative w-14 h-8 rounded-full
        bg-light-300 dark:bg-dark-100
        border-2 border-light-400 dark:border-dark-100
        transition-colors duration-300
        ${className}
      `}
      aria-label="Toggle theme"
    >
      {/* Background icons */}
      <span className="absolute left-1.5 top-1/2 -translate-y-1/2 text-amber-500">
        <FiSun size={14} />
      </span>
      <span className="absolute right-1.5 top-1/2 -translate-y-1/2 text-primary-400">
        <FiMoon size={14} />
      </span>

      {/* Toggle ball */}
      <motion.div
        layout
        className={`
          absolute top-1 w-5 h-5 rounded-full
          bg-white dark:bg-primary-500
          shadow-md
          flex items-center justify-center
        `}
        animate={{
          left: isDark ? 'calc(100% - 24px)' : '4px',
        }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      >
        {isDark ? (
          <FiMoon size={12} className="text-white" />
        ) : (
          <FiSun size={12} className="text-amber-500" />
        )}
      </motion.div>

      {/* Glow effect */}
      <motion.div
        className="absolute inset-0 -z-10 rounded-full bg-primary-500/30 blur-lg"
        animate={{ opacity: isDark ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      />
    </motion.button>
  );
};

export default ThemeToggle;