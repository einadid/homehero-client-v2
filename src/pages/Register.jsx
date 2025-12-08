// src/pages/Register.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiUser, FiMail, FiLock, FiImage, FiUserPlus, FiCheck, FiX, FiArrowRight } from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc';
import toast from 'react-hot-toast';
import { useAuth } from '../hooks/useAuth';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    photoURL: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({
    hasMinLength: false,
    hasUppercase: false,
    hasLowercase: false,
    hasNumber: false,
  });

  const { createUser, updateUserProfile, signInWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }

    // Check password strength
    if (name === 'password') {
      setPasswordStrength({
        hasMinLength: value.length >= 6,
        hasUppercase: /[A-Z]/.test(value),
        hasLowercase: /[a-z]/.test(value),
        hasNumber: /[0-9]/.test(value),
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (formData.photoURL && !/^https?:\/\/.+/.test(formData.photoURL)) {
      newErrors.photoURL = 'Please enter a valid URL';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    } else if (!/[A-Z]/.test(formData.password)) {
      newErrors.password = 'Password must contain at least one uppercase letter';
    } else if (!/[a-z]/.test(formData.password)) {
      newErrors.password = 'Password must contain at least one lowercase letter';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    try {
      // Create user
      await createUser(formData.email, formData.password);
      
      // Update profile with name and photo
      await updateUserProfile(
        formData.name,
        formData.photoURL || 'https://i.ibb.co/5GzXkwq/user.png'
      );

      toast.success('Account created successfully! Welcome to HomeHero!');
      navigate('/');
    } catch (error) {
      console.error('Registration error:', error);
      
      if (error.code === 'auth/email-already-in-use') {
        toast.error('This email is already registered. Try logging in instead.');
        setErrors({ email: 'Email already in use' });
      } else if (error.code === 'auth/invalid-email') {
        toast.error('Invalid email address.');
        setErrors({ email: 'Invalid email format' });
      } else if (error.code === 'auth/weak-password') {
        toast.error('Password is too weak.');
        setErrors({ password: 'Password is too weak' });
      } else {
        toast.error('Registration failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleRegister = async () => {
    setIsLoading(true);
    try {
      await signInWithGoogle();
      toast.success('Account created successfully with Google!');
      navigate('/');
    } catch (error) {
      console.error('Google registration error:', error);
      
      if (error.code === 'auth/popup-closed-by-user') {
        toast.error('Registration cancelled. Please try again.');
      } else {
        toast.error('Google registration failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const PasswordRequirement = ({ met, text }) => (
    <div className={`flex items-center gap-2 text-sm ${met ? 'text-emerald-500' : 'text-gray-400'}`}>
      {met ? <FiCheck size={14} /> : <FiX size={14} />}
      <span>{text}</span>
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden -z-10">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-primary-500/5 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full bg-primary-500/5 blur-3xl" />
        <div className="absolute inset-0 bg-mesh opacity-30" />
      </div>

      <div className="w-full max-w-lg">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <Link to="/" className="inline-flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-primary-500 flex items-center justify-center shadow-lg shadow-primary-500/30">
              <span className="text-2xl font-bold text-white">H</span>
            </div>
            <span className="text-2xl font-heading font-bold text-dark-300 dark:text-light-100">
              Home<span className="text-primary-500">Hero</span>
            </span>
          </Link>
          <h1 className="text-3xl font-heading font-bold text-dark-300 dark:text-light-100 mb-2">
            Create Account
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Join HomeHero to find trusted service providers
          </p>
        </motion.div>

        {/* Register Form Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card-3d p-8"
        >
          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Full Name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              icon={<FiUser />}
              error={errors.name}
              disabled={isLoading}
            />

            <Input
              label="Email Address"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              icon={<FiMail />}
              error={errors.email}
              disabled={isLoading}
            />

            <Input
              label="Photo URL (Optional)"
              type="url"
              name="photoURL"
              value={formData.photoURL}
              onChange={handleChange}
              placeholder="https://example.com/photo.jpg"
              icon={<FiImage />}
              error={errors.photoURL}
              disabled={isLoading}
            />

            <div>
              <Input
                label="Password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create a password"
                icon={<FiLock />}
                error={errors.password}
                disabled={isLoading}
              />
              
              {/* Password Strength Indicators */}
              {formData.password && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-3 p-3 rounded-lg bg-light-200 dark:bg-dark-100 space-y-1"
                >
                  <p className="text-xs font-medium text-gray-500 mb-2">Password Requirements:</p>
                  <PasswordRequirement met={passwordStrength.hasMinLength} text="At least 6 characters" />
                  <PasswordRequirement met={passwordStrength.hasUppercase} text="One uppercase letter" />
                  <PasswordRequirement met={passwordStrength.hasLowercase} text="One lowercase letter" />
                  <PasswordRequirement met={passwordStrength.hasNumber} text="One number (recommended)" />
                </motion.div>
              )}
            </div>

            <Input
              label="Confirm Password"
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your password"
              icon={<FiLock />}
              error={errors.confirmPassword}
              disabled={isLoading}
            />

            {/* Terms Agreement */}
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="terms"
                required
                className="mt-1 w-4 h-4 rounded border-gray-300 text-primary-500 focus:ring-primary-500"
              />
              <label htmlFor="terms" className="text-sm text-gray-600 dark:text-gray-400">
                I agree to the{' '}
                <Link to="/terms" className="text-primary-500 hover:underline">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link to="/privacy" className="text-primary-500 hover:underline">
                  Privacy Policy
                </Link>
              </label>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={isLoading}
              className="w-full"
              icon={<FiUserPlus />}
            >
              Create Account
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-light-400 dark:border-dark-100" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-light-100 dark:bg-dark-200 text-gray-500">
                Or sign up with
              </span>
            </div>
          </div>

          {/* Google Register */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleGoogleRegister}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-3 px-6 py-3 rounded-xl border-2 border-light-400 dark:border-dark-100 bg-light-100 dark:bg-dark-100 hover:bg-light-200 dark:hover:bg-dark-200 transition-colors disabled:opacity-50"
          >
            <FcGoogle size={24} />
            <span className="font-semibold text-dark-300 dark:text-light-200">
              Continue with Google
            </span>
          </motion.button>

          {/* Login Link */}
          <p className="mt-8 text-center text-gray-600 dark:text-gray-400">
            Already have an account?{' '}
            <Link
              to="/login"
              className="text-primary-600 dark:text-primary-400 font-semibold hover:underline inline-flex items-center gap-1"
            >
              Sign In
              <FiArrowRight />
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;