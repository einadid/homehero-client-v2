// src/components/shared/Footer.jsx
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FiFacebook, 
  FiInstagram, 
  FiLinkedin, 
  FiYoutube,
  FiMail,
  FiPhone,
  FiMapPin,
  FiArrowRight 
} from 'react-icons/fi';
import { FaXTwitter } from 'react-icons/fa6';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { label: 'Home', path: '/' },
    { label: 'Services', path: '/services' },
    { label: 'About Us', path: '/about' },
    { label: 'Contact', path: '/contact' },
  ];

  const services = [
    { label: 'Electrician', path: '/services?category=electrician' },
    { label: 'Plumber', path: '/services?category=plumber' },
    { label: 'Cleaner', path: '/services?category=cleaner' },
    { label: 'Carpenter', path: '/services?category=carpenter' },
  ];

  const socialLinks = [
    { icon: <FiFacebook size={20} />, url: 'https://facebook.com', label: 'Facebook' },
    { icon: <FaXTwitter size={20} />, url: 'https://x.com', label: 'X (Twitter)' },
    { icon: <FiInstagram size={20} />, url: 'https://instagram.com', label: 'Instagram' },
    { icon: <FiLinkedin size={20} />, url: 'https://linkedin.com', label: 'LinkedIn' },
    { icon: <FiYoutube size={20} />, url: 'https://youtube.com', label: 'YouTube' },
  ];

  return (
    <footer className="relative bg-dark-300 text-light-200 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-mesh opacity-30" />
      
      {/* Glowing Orbs */}
      <div className="absolute -top-40 -left-40 w-80 h-80 rounded-full bg-primary-500/10 blur-3xl" />
      <div className="absolute -bottom-40 -right-40 w-80 h-80 rounded-full bg-primary-500/10 blur-3xl" />

      <div className="relative container mx-auto px-4 lg:px-8">
        {/* Newsletter Section */}
        <div className="py-12 border-b border-dark-100">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="text-center lg:text-left">
              <h3 className="text-2xl font-heading font-bold mb-2">
                Subscribe to Our Newsletter
              </h3>
              <p className="text-gray-400">
                Get the latest updates on new services and offers.
              </p>
            </div>
            
            <form className="flex gap-3 w-full max-w-md">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-xl bg-dark-200 border border-dark-100 text-light-200 placeholder:text-gray-500 focus:outline-none focus:border-primary-500 transition-colors"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                className="px-6 py-3 rounded-xl bg-primary-500 text-white font-semibold shadow-lg shadow-primary-500/30 hover:bg-primary-600 transition-colors"
              >
                <FiArrowRight size={20} />
              </motion.button>
            </form>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-primary-500 flex items-center justify-center">
                <span className="text-2xl font-bold text-white">H</span>
              </div>
              <div>
                <h2 className="text-xl font-heading font-bold">
                  Home<span className="text-primary-500">Hero</span>
                </h2>
                <p className="text-xs text-gray-400">Service Finder</p>
              </div>
            </Link>
            
            <p className="text-gray-400 mb-6 leading-relaxed">
              Connect with trusted local service providers. Quality services at your doorstep, making home maintenance hassle-free.
            </p>

            {/* Social Links */}
            <div className="flex gap-3">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={index}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ y: -3, scale: 1.1 }}
                  className="w-10 h-10 rounded-xl bg-dark-200 border border-dark-100 flex items-center justify-center text-gray-400 hover:text-primary-400 hover:border-primary-500/50 transition-colors"
                  aria-label={social.label}
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-heading font-semibold mb-6 flex items-center gap-2">
              <span className="w-8 h-0.5 bg-primary-500 rounded-full" />
              Quick Links
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    to={link.path}
                    className="text-gray-400 hover:text-primary-400 transition-colors flex items-center gap-2 group"
                  >
                    <FiArrowRight className="text-xs opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-heading font-semibold mb-6 flex items-center gap-2">
              <span className="w-8 h-0.5 bg-primary-500 rounded-full" />
              Our Services
            </h4>
            <ul className="space-y-3">
              {services.map((service, index) => (
                <li key={index}>
                  <Link
                    to={service.path}
                    className="text-gray-400 hover:text-primary-400 transition-colors flex items-center gap-2 group"
                  >
                    <FiArrowRight className="text-xs opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                    {service.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-heading font-semibold mb-6 flex items-center gap-2">
              <span className="w-8 h-0.5 bg-primary-500 rounded-full" />
              Contact Us
            </h4>
            <ul className="space-y-4">
              <li>
                <a
                  href="mailto:support@homehero.com"
                  className="flex items-start gap-3 text-gray-400 hover:text-primary-400 transition-colors"
                >
                  <FiMail className="mt-1 flex-shrink-0" />
                  <span>support@homehero.com</span>
                </a>
              </li>
              <li>
                <a
                  href="tel:+1234567890"
                  className="flex items-start gap-3 text-gray-400 hover:text-primary-400 transition-colors"
                >
                  <FiPhone className="mt-1 flex-shrink-0" />
                  <span>+1 (234) 567-890</span>
                </a>
              </li>
              <li className="flex items-start gap-3 text-gray-400">
                <FiMapPin className="mt-1 flex-shrink-0" />
                <span>123 Service Street, Tech City, TC 12345</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-6 border-t border-dark-100">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-400">
            <p>
              © {currentYear} HomeHero. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <Link to="/privacy" className="hover:text-primary-400 transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="hover:text-primary-400 transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;