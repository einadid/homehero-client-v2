// src/components/home/CTASection.jsx
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiPhone } from 'react-icons/fi';

const CTASection = () => {
  return (
    <section className="py-20 lg:py-28 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-primary-500">
        <div className="absolute inset-0 bg-mesh opacity-20" />
        <motion.div
          className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-white/10"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
          }}
          transition={{ duration: 15, repeat: Infinity }}
        />
        <motion.div
          className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-white/10"
          animate={{
            scale: [1, 1.3, 1],
            rotate: [0, -90, 0],
          }}
          transition={{ duration: 20, repeat: Infinity }}
        />
      </div>

      <div className="container mx-auto px-4 lg:px-8 relative">
        <div className="max-w-3xl mx-auto text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            {/* Badge */}
            <span className="inline-block px-4 py-2 rounded-full bg-white/20 text-sm font-medium mb-6">
              Ready to Get Started?
            </span>

            {/* Heading */}
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold mb-6">
              Join Thousands of Happy Homeowners Today
            </h2>

            {/* Description */}
            <p className="text-lg md:text-xl text-primary-100 mb-10 max-w-2xl mx-auto">
              Whether you need a quick fix or a major renovation, our network of trusted professionals is here to help. Book your first service today!
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/services">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 rounded-xl bg-white text-primary-600 font-semibold shadow-xl shadow-black/20 flex items-center gap-2 hover:bg-gray-100 transition-colors"
                >
                  Browse Services
                  <FiArrowRight />
                </motion.button>
              </Link>

              <motion.a
                href="tel:+1234567890"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-white font-semibold flex items-center gap-2 hover:bg-white/20 transition-colors"
              >
                <FiPhone />
                Call Us Now
              </motion.a>
            </div>

            {/* Trust Indicators */}
            <div className="mt-12 flex flex-wrap justify-center items-center gap-8">
              {[
                'No Hidden Fees',
                'Free Cancellation',
                'Satisfaction Guaranteed',
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  className="flex items-center gap-2"
                >
                  <svg
                    className="w-5 h-5 text-accent-emerald"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-sm">{item}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;