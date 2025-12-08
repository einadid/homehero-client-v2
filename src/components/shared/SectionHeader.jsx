// src/components/shared/SectionHeader.jsx
import { motion } from 'framer-motion';

const SectionHeader = ({
  badge,
  title,
  subtitle,
  align = 'center',
  className = '',
}) => {
  const alignments = {
    left: 'text-left',
    center: 'text-center mx-auto',
    right: 'text-right',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className={`max-w-3xl mb-12 ${alignments[align]} ${className}`}
    >
      {badge && (
        <motion.span
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="inline-block px-4 py-2 mb-4 rounded-full text-sm font-medium bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 border border-primary-200 dark:border-primary-800"
        >
          {badge}
        </motion.span>
      )}
      
      <h2 className="section-title">
        {title}
      </h2>
      
      {subtitle && (
        <p className="section-subtitle mt-4">
          {subtitle}
        </p>
      )}
      
      {/* Decorative underline */}
      <motion.div
        initial={{ width: 0 }}
        whileInView={{ width: '80px' }}
        viewport={{ once: true }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className={`h-1 bg-primary-500 rounded-full mt-6 ${align === 'center' ? 'mx-auto' : ''}`}
      />
    </motion.div>
  );
};

export default SectionHeader;