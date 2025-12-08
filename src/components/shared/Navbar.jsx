// src/components/shared/Navbar.jsx
import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiHome, 
  FiGrid, 
  FiPlus, 
  FiList, 
  FiCalendar, 
  FiUser, 
  FiLogIn, 
  FiLogOut,
  FiMenu,
  FiX 
} from 'react-icons/fi';
import { useAuth } from '../../hooks/useAuth';
import ThemeToggle from './ThemeToggle';
import toast from 'react-hot-toast';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, logOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      await logOut();
      toast.success('Logged out successfully!');
      navigate('/');
    } catch (error) {
      toast.error('Failed to logout');
    }
  };

  const navLinks = [
    { path: '/', label: 'Home', icon: <FiHome /> },
    { path: '/services', label: 'Services', icon: <FiGrid /> },
  ];

  const privateLinks = [
    { path: '/add-service', label: 'Add Service', icon: <FiPlus /> },
    { path: '/my-services', label: 'My Services', icon: <FiList /> },
    { path: '/my-bookings', label: 'My Bookings', icon: <FiCalendar /> },
    { path: '/profile', label: 'Profile', icon: <FiUser /> },
  ];

  const NavItem = ({ path, label, icon, onClick }) => (
    <NavLink
      to={path}
      onClick={onClick}
      className={({ isActive }) => `
        flex items-center gap-2 px-4 py-2 rounded-xl font-medium
        transition-all duration-300
        ${isActive 
          ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/30' 
          : 'text-dark-300 dark:text-light-200 hover:bg-light-300 dark:hover:bg-dark-100'
        }
      `}
    >
      <span className="text-lg">{icon}</span>
      <span>{label}</span>
    </NavLink>
  );

  return (
    <>
      <motion.header
  initial={{ y: -100 }}
  animate={{ y: 0 }}
  className={`
    fixed top-0 left-0 right-0 z-40
    transition-all duration-500
    ${isScrolled 
      ? 'py-2 bg-light-100/95 dark:bg-dark-200/95 backdrop-blur-xl shadow-lg border-b border-light-400/50 dark:border-dark-100/50' 
      : 'py-4 bg-transparent'
    }
  `}
>
        <nav className="container mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
                className="relative w-12 h-12 rounded-xl bg-primary-500 flex items-center justify-center shadow-lg shadow-primary-500/30"
              >
                <span className="text-2xl font-bold text-white">H</span>
                <div className="absolute inset-0 rounded-xl bg-primary-400/50 blur-lg -z-10" />
              </motion.div>
              <div>
                <h1 className="text-xl font-heading font-bold text-dark-300 dark:text-light-100">
                  Home<span className="text-primary-500">Hero</span>
                </h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Service Finder
                </p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-2">
              {navLinks.map((link) => (
                <NavItem key={link.path} {...link} />
              ))}
              
              {user && privateLinks.map((link) => (
                <NavItem key={link.path} {...link} />
              ))}
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-4">
              <ThemeToggle />

              {/* Desktop Auth */}
              <div className="hidden lg:flex items-center gap-3">
                {user ? (
                  <div className="flex items-center gap-3">
                    {/* User Avatar */}
                    <div className="relative group">
                      <motion.img
                        whileHover={{ scale: 1.1 }}
                        src={user.photoURL || 'https://i.ibb.co/5GzXkwq/user.png'}
                        alt={user.displayName}
                        className="w-10 h-10 rounded-full border-2 border-primary-500 object-cover cursor-pointer"
                      />
                      
                      {/* Dropdown */}
                      <div className="absolute right-0 top-full mt-2 w-64 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="p-4 rounded-xl bg-light-100 dark:bg-dark-200 border border-light-400 dark:border-dark-100 shadow-xl"
                        >
                          <div className="flex items-center gap-3 pb-3 border-b border-light-400 dark:border-dark-100">
                            <img
                              src={user.photoURL || 'https://i.ibb.co/5GzXkwq/user.png'}
                              alt={user.displayName}
                              className="w-12 h-12 rounded-full object-cover"
                            />
                            <div>
                              <p className="font-semibold text-dark-300 dark:text-light-100">
                                {user.displayName}
                              </p>
                              <p className="text-sm text-gray-500 truncate max-w-[150px]">
                                {user.email}
                              </p>
                            </div>
                          </div>
                          
                          <div className="pt-3 space-y-2">
                            <Link
                              to="/profile"
                              className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-light-300 dark:hover:bg-dark-100 transition-colors"
                            >
                              <FiUser />
                              <span>View Profile</span>
                            </Link>
                            <button
                              onClick={handleLogout}
                              className="flex items-center gap-2 px-3 py-2 rounded-lg w-full text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                            >
                              <FiLogOut />
                              <span>Logout</span>
                            </button>
                          </div>
                        </motion.div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <Link to="/login" className="btn-secondary text-sm">
                      <FiLogIn className="mr-2" />
                      Login
                    </Link>
                    <Link to="/register" className="btn-primary text-sm">
                      Register
                    </Link>
                  </div>
                )}
              </div>

              {/* Mobile Menu Button */}
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 rounded-xl bg-light-300 dark:bg-dark-100"
              >
                {isMobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
              </motion.button>
            </div>
          </div>
        </nav>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 z-40 bg-dark-400/60 backdrop-blur-sm lg:hidden"
            />

            {/* Menu Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25 }}
              className="fixed top-0 right-0 bottom-0 z-50 w-80 bg-light-100 dark:bg-dark-200 shadow-2xl lg:hidden"
            >
              <div className="p-6">
                {/* Close Button */}
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-xl font-heading font-bold">Menu</h2>
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-2 rounded-xl hover:bg-light-300 dark:hover:bg-dark-100"
                  >
                    <FiX size={24} />
                  </button>
                </div>

                {/* User Info */}
                {user && (
                  <div className="flex items-center gap-3 p-4 rounded-xl bg-light-200 dark:bg-dark-100 mb-6">
                    <img
                      src={user.photoURL || 'https://i.ibb.co/5GzXkwq/user.png'}
                      alt={user.displayName}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-semibold">{user.displayName}</p>
                      <p className="text-sm text-gray-500 truncate max-w-[180px]">
                        {user.email}
                      </p>
                    </div>
                  </div>
                )}

                {/* Nav Links */}
                <div className="space-y-2">
                  {navLinks.map((link) => (
                    <NavItem 
                      key={link.path} 
                      {...link} 
                      onClick={() => setIsMobileMenuOpen(false)}
                    />
                  ))}
                  
                  {user && (
                    <>
                      <div className="my-4 border-t border-light-400 dark:border-dark-100" />
                      {privateLinks.map((link) => (
                        <NavItem 
                          key={link.path} 
                          {...link}
                          onClick={() => setIsMobileMenuOpen(false)}
                        />
                      ))}
                    </>
                  )}
                </div>

                {/* Auth Buttons */}
                <div className="mt-8 space-y-3">
                  {user ? (
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-red-500 text-white font-semibold"
                    >
                      <FiLogOut />
                      Logout
                    </button>
                  ) : (
                    <>
                      <Link
                        to="/login"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="block w-full text-center btn-secondary"
                      >
                        Login
                      </Link>
                      <Link
                        to="/register"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="block w-full text-center btn-primary"
                      >
                        Register
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;