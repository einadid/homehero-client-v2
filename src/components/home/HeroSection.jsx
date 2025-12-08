// src/components/home/HeroSection.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiArrowRight, FiPlay, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import FloatingShapes from '../3d/FloatingShapes';

const slides = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=1200',
    title: 'Professional',
    highlight: 'Electricians',
    subtitle: 'at Your Service',
    description: 'Get expert electrical services for your home. From repairs to installations, our certified electricians handle it all.',
    category: 'electrician',
    color: 'text-accent-amber',
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=1200',
    title: 'Expert',
    highlight: 'Plumbers',
    subtitle: 'Ready to Help',
    description: 'Solve all your plumbing issues with our skilled professionals. Quick response, quality work guaranteed.',
    category: 'plumber',
    color: 'text-accent-cyan',
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=1200',
    title: 'Trusted',
    highlight: 'Cleaners',
    subtitle: 'for Your Home',
    description: 'Experience spotless cleaning with our professional team. Your home deserves the best care.',
    category: 'cleaner',
    color: 'text-accent-emerald',
  },
];

const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(1);

  useEffect(() => {
    const timer = setInterval(() => {
      setDirection(1);
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);

    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setDirection(1);
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setDirection(-1);
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction) => ({
      x: direction > 0 ? -1000 : 1000,
      opacity: 0,
    }),
  };

  const slide = slides[currentSlide];

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background Image with Overlay */}
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={slide.id}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.8, ease: 'easeInOut' }}
          className="absolute inset-0"
        >
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${slide.image})` }}
          />
          <div className="absolute inset-0 bg-dark-400/70 dark:bg-dark-400/80" />
        </motion.div>
      </AnimatePresence>

      {/* Floating Shapes */}
      <FloatingShapes />

      {/* Content */}
      <div className="relative container mx-auto px-4 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={slide.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.5 }}
              className="text-white"
            >
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6"
              >
                <span className="w-2 h-2 rounded-full bg-accent-emerald animate-pulse" />
                <span className="text-sm font-medium">Trusted by 10,000+ customers</span>
              </motion.div>

              {/* Heading */}
              <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-heading font-bold leading-tight mb-6">
                <span className="block">{slide.title}</span>
                <span className={`block ${slide.color}`}>{slide.highlight}</span>
                <span className="block">{slide.subtitle}</span>
              </h1>

              {/* Description */}
              <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-xl">
                {slide.description}
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-4">
                <Link to="/services">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-8 py-4 rounded-xl bg-primary-500 text-white font-semibold shadow-lg shadow-primary-500/30 flex items-center gap-2 hover:bg-primary-600 transition-colors"
                  >
                    Explore Services
                    <FiArrowRight />
                  </motion.button>
                </Link>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-white font-semibold flex items-center gap-2 hover:bg-white/20 transition-colors"
                >
                  <FiPlay className="text-accent-emerald" />
                  Watch Demo
                </motion.button>
              </div>

              {/* Stats */}
              <div className="mt-12 grid grid-cols-3 gap-6">
                {[
                  { value: '500+', label: 'Service Providers' },
                  { value: '10K+', label: 'Happy Customers' },
                  { value: '4.9', label: 'Average Rating' },
                ].map((stat, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    className="text-center"
                  >
                    <p className="text-2xl md:text-3xl font-heading font-bold text-primary-400">
                      {stat.value}
                    </p>
                    <p className="text-sm text-gray-400">{stat.label}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* 3D Illustration Area */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="hidden lg:flex items-center justify-center"
          >
            <div className="relative">
              {/* Main Circle */}
              <motion.div
                animate={{
                  rotate: 360,
                }}
                transition={{
                  duration: 30,
                  repeat: Infinity,
                  ease: 'linear',
                }}
                className="w-80 h-80 xl:w-96 xl:h-96 rounded-full border-2 border-dashed border-white/20"
              >
                {/* Orbiting Elements */}
                {[0, 1, 2, 3].map((i) => (
                  <motion.div
                    key={i}
                    className="absolute w-16 h-16 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center shadow-xl"
                    style={{
                      top: '50%',
                      left: '50%',
                      marginTop: -32,
                      marginLeft: -32,
                    }}
                    animate={{
                      rotate: -360,
                    }}
                    transition={{
                      duration: 30,
                      repeat: Infinity,
                      ease: 'linear',
                    }}
                  >
                    <span className="text-2xl">
                      {['⚡', '🔧', '🧹', '🪚'][i]}
                    </span>
                  </motion.div>
                ))}
              </motion.div>

              {/* Center Logo */}
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-2xl bg-primary-500 flex items-center justify-center shadow-2xl shadow-primary-500/50"
              >
                <span className="text-5xl font-heading font-bold text-white">H</span>
              </motion.div>

              {/* Glow Effect */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-primary-500/30 blur-3xl -z-10" />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Slider Controls */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-6">
        {/* Prev Button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={prevSlide}
          className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
        >
          <FiChevronLeft size={24} />
        </motion.button>

        {/* Dots */}
        <div className="flex gap-3">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setDirection(index > currentSlide ? 1 : -1);
                setCurrentSlide(index);
              }}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentSlide
                  ? 'w-8 bg-primary-500'
                  : 'w-2 bg-white/30 hover:bg-white/50'
              }`}
            />
          ))}
        </div>

        {/* Next Button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={nextSlide}
          className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
        >
          <FiChevronRight size={24} />
        </motion.button>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-10 right-10 hidden lg:flex flex-col items-center gap-2 text-white/50"
      >
        <span className="text-xs tracking-widest rotate-90 origin-center mb-8">SCROLL</span>
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-0.5 h-16 bg-white/30 rounded-full overflow-hidden"
        >
          <motion.div
            animate={{ y: [-64, 64] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-full h-8 bg-primary-500"
          />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;