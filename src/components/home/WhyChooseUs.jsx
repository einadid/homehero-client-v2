// src/components/home/WhyChooseUs.jsx
import { motion } from 'framer-motion';
import { 
  FiShield, 
  FiClock, 
  FiDollarSign, 
  FiAward, 
  FiUsers, 
  FiHeadphones 
} from 'react-icons/fi';
import SectionHeader from '../shared/SectionHeader';

const features = [
  {
    icon: <FiShield size={28} />,
    title: 'Verified Professionals',
    description: 'All our service providers undergo thorough background checks and verification processes.',
    color: 'bg-primary-500',
  },
  {
    icon: <FiClock size={28} />,
    title: 'On-Time Service',
    description: 'We respect your time. Our professionals arrive punctually and complete work efficiently.',
    color: 'bg-accent-emerald',
  },
  {
    icon: <FiDollarSign size={28} />,
    title: 'Transparent Pricing',
    description: 'No hidden charges. See the exact price before booking any service.',
    color: 'bg-accent-amber',
  },
  {
    icon: <FiAward size={28} />,
    title: 'Quality Guaranteed',
    description: 'Not satisfied? We offer a quality guarantee on all our services.',
    color: 'bg-accent-rose',
  },
  {
    icon: <FiUsers size={28} />,
    title: 'Expert Team',
    description: 'Skilled professionals with years of experience in their respective fields.',
    color: 'bg-accent-cyan',
  },
  {
    icon: <FiHeadphones size={28} />,
    title: '24/7 Support',
    description: 'Our customer support team is available around the clock to assist you.',
    color: 'bg-purple-500',
  },
];

const WhyChooseUs = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <section className="py-20 lg:py-28 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-0 w-96 h-96 rounded-full bg-primary-500/5 blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-primary-500/5 blur-3xl" />
        <div className="absolute inset-0 bg-mesh opacity-20" />
      </div>

      <div className="container mx-auto px-4 lg:px-8">
        <SectionHeader
          badge="Why HomeHero"
          title="Why Choose Us?"
          subtitle="We're committed to providing the best service experience. Here's what sets us apart."
        />

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="group relative"
            >
              <div className="relative p-8 rounded-2xl bg-light-100 dark:bg-dark-200 border border-light-400 dark:border-dark-100 h-full transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-primary-500/10">
                {/* Icon */}
                <motion.div
                  whileHover={{ rotate: 360, scale: 1.1 }}
                  transition={{ duration: 0.5 }}
                  className={`w-16 h-16 rounded-2xl ${feature.color} flex items-center justify-center text-white shadow-lg mb-6`}
                >
                  {feature.icon}
                </motion.div>

                {/* Content */}
                <h3 className="text-xl font-heading font-bold text-dark-300 dark:text-light-100 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  {feature.description}
                </p>

                {/* Decorative Line */}
                <motion.div
                  className={`absolute bottom-0 left-0 right-0 h-1 ${feature.color} rounded-b-2xl opacity-0 group-hover:opacity-100 transition-opacity`}
                />

                {/* Number Badge */}
                <div className="absolute -top-4 -right-4 w-10 h-10 rounded-full bg-light-200 dark:bg-dark-100 border-4 border-light-100 dark:border-dark-200 flex items-center justify-center font-heading font-bold text-primary-500">
                  {index + 1}
                </div>
              </div>

              {/* Glow Effect */}
              <div className={`absolute inset-0 -z-10 ${feature.color}/20 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 p-8 rounded-2xl bg-primary-500 shadow-xl shadow-primary-500/30"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: '500+', label: 'Service Providers' },
              { value: '10,000+', label: 'Happy Customers' },
              { value: '15+', label: 'Service Categories' },
              { value: '4.9/5', label: 'Average Rating' },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center text-white"
              >
                <p className="text-3xl md:text-4xl font-heading font-bold mb-2">
                  {stat.value}
                </p>
                <p className="text-primary-200">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default WhyChooseUs;