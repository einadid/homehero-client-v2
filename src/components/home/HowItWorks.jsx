// src/components/home/HowItWorks.jsx
import { motion } from 'framer-motion';
import { FiSearch, FiCalendar, FiCheckCircle, FiSmile } from 'react-icons/fi';
import SectionHeader from '../shared/SectionHeader';

const steps = [
  {
    icon: <FiSearch size={32} />,
    number: '01',
    title: 'Search Service',
    description: 'Browse through our wide range of professional home services and find what you need.',
  },
  {
    icon: <FiCalendar size={32} />,
    number: '02',
    title: 'Book Appointment',
    description: 'Select your preferred date and time, and book with just a few clicks.',
  },
  {
    icon: <FiCheckCircle size={32} />,
    number: '03',
    title: 'Get Service',
    description: 'Our verified professional arrives at your doorstep and completes the work.',
  },
  {
    icon: <FiSmile size={32} />,
    number: '04',
    title: 'Leave Review',
    description: 'Rate your experience and help others find great service providers.',
  },
];

const HowItWorks = () => {
  return (
    <section className="py-20 lg:py-28 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-dots opacity-30" />
      </div>

      <div className="container mx-auto px-4 lg:px-8">
        <SectionHeader
          badge="How It Works"
          title="Simple & Easy Process"
          subtitle="Getting professional help for your home has never been easier. Just follow these simple steps."
        />

        {/* Steps */}
        <div className="relative">
          {/* Connection Line */}
          <div className="hidden lg:block absolute top-24 left-0 right-0 h-0.5 bg-light-400 dark:bg-dark-100">
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: '100%' }}
              viewport={{ once: true }}
              transition={{ duration: 1.5, delay: 0.5 }}
              className="h-full bg-primary-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="relative text-center"
              >
                {/* Step Card */}
                <div className="relative z-10">
                  {/* Icon Container */}
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 360 }}
                    transition={{ duration: 0.5 }}
                    className="relative inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-primary-500 text-white shadow-xl shadow-primary-500/30 mb-6"
                  >
                    {step.icon}
                    
                    {/* Number Badge */}
                    <span className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-dark-300 dark:bg-light-100 text-light-100 dark:text-dark-300 text-sm font-bold flex items-center justify-center">
                      {step.number}
                    </span>
                  </motion.div>

                  {/* Content */}
                  <h3 className="text-xl font-heading font-bold text-dark-300 dark:text-light-100 mb-3">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 max-w-xs mx-auto">
                    {step.description}
                  </p>
                </div>

                {/* Arrow for mobile */}
                {index < steps.length - 1 && (
                  <div className="lg:hidden flex justify-center my-6">
                    <motion.div
                      animate={{ y: [0, 10, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="w-8 h-8 rounded-full bg-primary-500/20 flex items-center justify-center"
                    >
                      <svg
                        className="w-4 h-4 text-primary-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 14l-7 7m0 0l-7-7m7 7V3"
                        />
                      </svg>
                    </motion.div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;