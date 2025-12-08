// src/components/home/Testimonials.jsx
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
// FiQuote বাদ দেওয়া হয়েছে
import { FiStar, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
// FaQuoteLeft যোগ করা হয়েছে
import { FaQuoteLeft } from 'react-icons/fa'; 
import SectionHeader from '../shared/SectionHeader';

const testimonials = [
  {
    id: 1,
    name: 'Sarah Johnson',
    role: 'Homeowner',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    rating: 5,
    text: 'Absolutely amazing service! The electrician arrived on time, was professional, and fixed all our electrical issues within hours. Highly recommend HomeHero to everyone.',
    service: 'Electrical Service',
  },
  {
    id: 2,
    name: 'Michael Chen',
    role: 'Business Owner',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    rating: 5,
    text: 'We use HomeHero for all our office cleaning needs. The team is reliable, thorough, and always goes above and beyond. Best decision we made for our workplace.',
    service: 'Cleaning Service',
  },
  {
    id: 3,
    name: 'Emily Rodriguez',
    role: 'Apartment Resident',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
    rating: 5,
    text: 'Had a plumbing emergency at midnight and HomeHero connected me with a plumber within 30 minutes. Crisis averted! The 24/7 availability is a lifesaver.',
    service: 'Plumbing Service',
  },
  {
    id: 4,
    name: 'David Thompson',
    role: 'Property Manager',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
    rating: 5,
    text: 'Managing multiple properties requires reliable service providers. HomeHero has been consistent in delivering quality work across all our maintenance needs.',
    service: 'Multiple Services',
  },
  {
    id: 5,
    name: 'Lisa Patel',
    role: 'New Homeowner',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    rating: 5,
    text: 'As a first-time homeowner, I was overwhelmed with repairs. HomeHero made everything so easy. The app is user-friendly and the service quality is top-notch.',
    service: 'Home Repairs',
  },
];

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
      scale: 0.8,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (direction) => ({
      x: direction > 0 ? -300 : 300,
      opacity: 0,
      scale: 0.8,
    }),
  };

  const paginate = (newDirection) => {
    setDirection(newDirection);
    setCurrentIndex((prev) => {
      if (newDirection > 0) {
        return (prev + 1) % testimonials.length;
      }
      return (prev - 1 + testimonials.length) % testimonials.length;
    });
  };

  const testimonial = testimonials[currentIndex];

  return (
    <section className="py-20 lg:py-28 bg-light-200 dark:bg-dark-400/50 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-primary-500/5 blur-3xl" />
      </div>

      <div className="container mx-auto px-4 lg:px-8">
        <SectionHeader
          badge="Testimonials"
          title="What Our Customers Say"
          subtitle="Real experiences from real customers. See why thousands trust HomeHero for their home services."
        />

        <div className="max-w-4xl mx-auto">
          {/* Main Testimonial Card */}
          <div className="relative">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={currentIndex}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.5 }}
                className="relative"
              >
                <div className="bg-light-100 dark:bg-dark-200 rounded-3xl p-8 md:p-12 shadow-xl border border-light-400 dark:border-dark-100">
                  {/* Quote Icon - Fixed Here */}
                  <div className="absolute -top-6 left-8 w-12 h-12 rounded-xl bg-primary-500 flex items-center justify-center shadow-lg shadow-primary-500/30">
                    <FaQuoteLeft className="text-white" size={24} />
                  </div>

                  {/* Rating */}
                  <div className="flex items-center gap-1 mb-6">
                    {[...Array(5)].map((_, i) => (
                      <FiStar
                        key={i}
                        className={`${
                          i < testimonial.rating
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-gray-300'
                        }`}
                        size={20}
                      />
                    ))}
                    <span className="ml-2 text-sm text-gray-500">
                      {testimonial.service}
                    </span>
                  </div>

                  {/* Testimonial Text */}
                  <blockquote className="text-lg md:text-xl text-dark-300 dark:text-light-100 leading-relaxed mb-8">
                    "{testimonial.text}"
                  </blockquote>

                  {/* Author */}
                  <div className="flex items-center gap-4">
                    <motion.img
                      whileHover={{ scale: 1.1 }}
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-14 h-14 rounded-full object-cover border-2 border-primary-500"
                    />
                    <div>
                      <h4 className="font-heading font-bold text-dark-300 dark:text-light-100">
                        {testimonial.name}
                      </h4>
                      <p className="text-sm text-gray-500">{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation Buttons */}
            <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 flex justify-between pointer-events-none">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => paginate(-1)}
                className="pointer-events-auto -translate-x-1/2 w-12 h-12 rounded-full bg-light-100 dark:bg-dark-200 border border-light-400 dark:border-dark-100 shadow-lg flex items-center justify-center text-dark-300 dark:text-light-100 hover:bg-primary-500 hover:text-white transition-colors"
              >
                <FiChevronLeft size={24} />
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => paginate(1)}
                className="pointer-events-auto translate-x-1/2 w-12 h-12 rounded-full bg-light-100 dark:bg-dark-200 border border-light-400 dark:border-dark-100 shadow-lg flex items-center justify-center text-dark-300 dark:text-light-100 hover:bg-primary-500 hover:text-white transition-colors"
              >
                <FiChevronRight size={24} />
              </motion.button>
            </div>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center gap-3 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setDirection(index > currentIndex ? 1 : -1);
                  setCurrentIndex(index);
                }}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? 'w-8 bg-primary-500'
                    : 'w-2 bg-gray-300 dark:bg-gray-600 hover:bg-primary-300'
                }`}
              />
            ))}
          </div>

          {/* Trust Badges */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-12 flex flex-wrap justify-center items-center gap-8"
          >
            {[
              { label: 'Trusted', value: 'Platform' },
              { label: 'Secure', value: 'Payments' },
              { label: 'Verified', value: 'Providers' },
              { label: '24/7', value: 'Support' },
            ].map((badge, index) => (
              <div
                key={index}
                className="flex items-center gap-2 text-gray-500 dark:text-gray-400"
              >
                <div className="w-3 h-3 rounded-full bg-accent-emerald" />
                <span className="text-sm">
                  <strong className="text-dark-300 dark:text-light-100">{badge.label}</strong>{' '}
                  {badge.value}
                </span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;