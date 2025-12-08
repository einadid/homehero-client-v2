// src/components/home/ServiceCategories.jsx
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';
import SectionHeader from '../shared/SectionHeader';
import { SERVICE_CATEGORIES } from '../../utils/helpers';

const ServiceCategories = () => {
  const categories = SERVICE_CATEGORIES.map((cat, index) => ({
    ...cat,
    count: Math.floor(Math.random() * 50) + 20,
    image: [
      'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400',
      'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=400',
      'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400',
      'https://images.unsplash.com/photo-1578926375605-eaf7559b1458?q=80&w=1063&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      'https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=400',
      'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400',
      'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=400',
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400',
      'https://images.unsplash.com/photo-1749142618156-432f0c4ffb5a?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      'https://images.unsplash.com/photo-1600585152220-90363fe7e115?w=400',
    ][index % 10],
  }));

  return (
    <section className="py-20 lg:py-28 bg-light-200 dark:bg-dark-400/50">
      <div className="container mx-auto px-4 lg:px-8">
        <SectionHeader
          badge="Categories"
          title="Browse by Category"
          subtitle="Find the perfect service provider for your specific needs"
        />

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 lg:gap-6">
          {categories.map((category, index) => (
            <motion.div
              key={category.value}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
            >
              <Link to={`/services?category=${category.value}`}>
                <motion.div
                  whileHover={{ y: -8 }}
                  className="group relative h-48 rounded-2xl overflow-hidden"
                >
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                    style={{ backgroundImage: `url(${category.image})` }}
                  />
                  
                  <div className="absolute inset-0 bg-dark-400/60 group-hover:bg-dark-400/70 transition-colors" />

                  <div className="relative h-full flex flex-col items-center justify-center text-white p-4">
                    <motion.span
                      whileHover={{ scale: 1.2 }}
                      className="text-4xl mb-3"
                    >
                      {category.icon}
                    </motion.span>
                    <h3 className="font-heading font-bold text-center text-lg mb-1">
                      {category.label}
                    </h3>
                    <p className="text-sm text-gray-300">
                      {category.count}+ Services
                    </p>
                    
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      whileHover={{ opacity: 1, y: 0 }}
                      className="absolute bottom-4 flex items-center gap-1 text-sm text-primary-400"
                    >
                      View Services <FiArrowRight />
                    </motion.div>
                  </div>

                  <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-primary-500/50 transition-colors" />
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServiceCategories;